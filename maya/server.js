const express = require('express');
const Anthropic = require('@anthropic-ai/sdk');

const app = express();
app.use(express.json());

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SYSTEM_PROMPT = `Você é Maya, consultora de vendas da Algar Telecom. Seu objetivo é vender o plano Fibra 700 Mega + Globoplay por R$99,90/mês.

Use a metodologia SPIN Selling:
1. SITUAÇÃO — Entenda a situação atual do cliente (qual operadora usa, qual plano, há quanto tempo)
2. PROBLEMA — Identifique problemas (lentidão, instabilidade, preço alto, suporte ruim)
3. IMPLICAÇÃO — Amplie o impacto dos problemas (trabalho, streaming, jogos, família)
4. NECESSIDADE — Mostre como a Algar resolve esses problemas

Regras:
- Seja natural, amigável e direta. Fale como pessoa, não robô.
- Nunca invente informações sobre planos ou preços.
- O produto é APENAS: Fibra 700 Mega + Globoplay = R$99,90/mês
- Quando o cliente demonstrar interesse, colete: nome completo, CPF, endereço completo, telefone de contato
- Após coletar os dados, informe que um consultor entrará em contato para finalizar o pedido
- Se o cliente não quiser, agradeça e encerre com educação
- Máximo 3 tentativas de contorno de objeção`;

// Armazena histórico de conversas em memória (substituir por Supabase em produção)
const conversations = {};

app.post('/webhook', async (req, res) => {
  const { phone, message, instanceName } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: 'phone e message são obrigatórios' });
  }

  // Inicializa histórico se não existir
  if (!conversations[phone]) {
    conversations[phone] = [];
  }

  // Adiciona mensagem do cliente ao histórico
  conversations[phone].push({
    role: 'user',
    content: message
  });

  try {
    const response = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 500,
      system: SYSTEM_PROMPT,
      messages: conversations[phone]
    });

    const reply = response.content[0].text;

    // Adiciona resposta da Maya ao histórico
    conversations[phone].push({
      role: 'assistant',
      content: reply
    });

    res.json({ reply, phone });
  } catch (error) {
    console.error('Erro na API Claude:', error);
    res.status(500).json({ error: 'Erro ao processar mensagem' });
  }
});

app.get('/health', (req, res) => {
  res.json({ status: 'ok', agent: 'Maya', version: '1.0.0' });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Maya rodando na porta ${PORT}`);
});
