# AlgarSales Platform

Plataforma completa de vendas automatizadas via WhatsApp para franquia Algar Telecom.

## Produto
- **Fibra 700 Mega + Globoplay** — R$99,90/mês
- **Operadora:** Algar Telecom

## Módulos

| Módulo | Descrição | Status |
|--------|-----------|--------|
| `maya/` | Agente de vendas IA (SPIN Selling) | 🔄 Em desenvolvimento |
| `dispatcher/` | Motor de disparo em massa (anti-ban) | 📋 Planejado |
| `dashboard/` | BKO Dashboard para 2 operadores | 📋 Planejado |
| `infra/` | Docker Compose + N8N + Evolution API | 📋 Planejado |
| `scripts/` | Scripts utilitários | 📋 Planejado |

## Stack

- **WhatsApp:** Evolution API
- **Automação:** N8N
- **IA:** Claude Haiku API
- **Banco:** Supabase
- **Frontend:** Next.js + Vercel
- **Infra:** Oracle Cloud VPS (ARM) / Hetzner

## Custo estimado
~R$60/mês (Claude API ~R$30 + chip WhatsApp ~R$30)

## Setup rápido

```bash
# 1. Clone o repo
git clone https://github.com/rodrigoanunes19-boop/ai-master

# 2. Configure as variáveis de ambiente
cp .env.example .env
# Edite o .env com suas chaves

# 3. Suba a infra
cd infra && docker-compose up -d
```

## Variáveis de ambiente necessárias

```
ANTHROPIC_API_KEY=     # Claude API
EVOLUTION_API_KEY=     # Evolution API
SUPABASE_URL=          # Supabase URL
SUPABASE_KEY=          # Supabase anon key
WHATSAPP_NUMBER=       # Número WhatsApp dedicado
```
