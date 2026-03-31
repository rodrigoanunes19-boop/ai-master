/**
 * Motor de Disparo AlgarSales
 * Envia mensagem inicial para lista de leads com throttle anti-ban
 */

const fs = require('fs');
const path = require('path');

const EVOLUTION_API_URL = process.env.EVOLUTION_API_URL || 'http://localhost:8080';
const EVOLUTION_API_KEY = process.env.EVOLUTION_API_KEY;
const INSTANCE_NAME = process.env.WHATSAPP_INSTANCE || 'algarsales';

// Configuração anti-ban
const CONFIG = {
  delayMin: 8000,   // 8 segundos mínimo entre mensagens
  delayMax: 20000,  // 20 segundos máximo
  batchSize: 20,    // mensagens por hora
  batchDelay: 3600000 // 1 hora entre lotes
};

function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

function randomDelay() {
  return Math.floor(Math.random() * (CONFIG.delayMax - CONFIG.delayMin)) + CONFIG.delayMin;
}

function buildMessage(name) {
  const firstName = name.split(' ')[0];
  return `Olá ${firstName}! Tudo bem? 😊\n\nSou a Maya da Algar Telecom. Vi que você está na região com cobertura de fibra óptica e queria te apresentar uma oferta especial:\n\n🚀 *Fibra 700 Mega + Globoplay*\n💰 Apenas R$99,90/mês\n\nPosso te contar mais detalhes?`;
}

async function sendMessage(phone, message) {
  const url = `${EVOLUTION_API_URL}/message/sendText/${INSTANCE_NAME}`;

  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'apikey': EVOLUTION_API_KEY
    },
    body: JSON.stringify({
      number: phone,
      text: message
    })
  });

  if (!response.ok) {
    throw new Error(`Erro ao enviar para ${phone}: ${response.status}`);
  }

  return response.json();
}

async function runDisparo(leadsFile) {
  const leads = JSON.parse(fs.readFileSync(leadsFile, 'utf8'));
  console.log(`Iniciando disparo para ${leads.length} leads`);

  let sent = 0;
  let errors = 0;

  for (let i = 0; i < leads.length; i++) {
    const lead = leads[i];

    // Pausa entre lotes
    if (i > 0 && i % CONFIG.batchSize === 0) {
      console.log(`Lote concluído. Aguardando 1 hora...`);
      await sleep(CONFIG.batchDelay);
    }

    try {
      const message = buildMessage(lead.name);
      await sendMessage(lead.phone, message);
      sent++;
      console.log(`[${i + 1}/${leads.length}] Enviado para ${lead.name} (${lead.phone})`);
    } catch (error) {
      errors++;
      console.error(`Erro: ${lead.phone} — ${error.message}`);
    }

    // Delay aleatório anti-ban
    const delay = randomDelay();
    await sleep(delay);
  }

  console.log(`\nDisparo finalizado: ${sent} enviados, ${errors} erros`);
}

// Exemplo de uso: node disparo.js leads.json
const leadsFile = process.argv[2] || 'leads.json';
runDisparo(leadsFile).catch(console.error);
