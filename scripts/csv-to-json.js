/**
 * Converte CSV de leads para JSON
 * Uso: node csv-to-json.js leads.csv
 *
 * Formato esperado do CSV:
 * nome,telefone
 * João Silva,85999998888
 */

const fs = require('fs');

function csvToJson(csvFile) {
  const content = fs.readFileSync(csvFile, 'utf8');
  const lines = content.trim().split('\n');
  const headers = lines[0].toLowerCase().split(',').map(h => h.trim());

  const leads = lines.slice(1).map(line => {
    const values = line.split(',').map(v => v.trim());
    const lead = {};
    headers.forEach((header, i) => {
      lead[header] = values[i];
    });

    // Normaliza campos
    return {
      name: lead.nome || lead.name || '',
      phone: normalizePhone(lead.telefone || lead.phone || lead.celular || '')
    };
  }).filter(lead => lead.name && lead.phone);

  const outputFile = csvFile.replace('.csv', '.json');
  fs.writeFileSync(outputFile, JSON.stringify(leads, null, 2));
  console.log(`${leads.length} leads exportados para ${outputFile}`);
  return leads;
}

function normalizePhone(phone) {
  // Remove tudo que não é número
  let cleaned = phone.replace(/\D/g, '');

  // Adiciona DDI Brasil se não tiver
  if (cleaned.length === 11) cleaned = '55' + cleaned;
  if (cleaned.length === 10) cleaned = '55' + cleaned;

  return cleaned;
}

const csvFile = process.argv[2];
if (!csvFile) {
  console.error('Uso: node csv-to-json.js leads.csv');
  process.exit(1);
}

csvToJson(csvFile);
