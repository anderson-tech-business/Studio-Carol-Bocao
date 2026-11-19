# Studio Carol Bocão | Nails & Beauty

Protótipo visual de demonstração (Next.js 15 + TypeScript + Tailwind CSS + Lucide React).
100% front-end: dados mockados em `src/data/mock.ts`, sem banco de dados e sem autenticação.

## Rodando

```bash
npm install
npm run dev
```

Abra http://localhost:3000.

## Rotas

| Rota | O que faz |
|---|---|
| `/` | Landing page (combos, serviços por categoria, vitrine, avaliações, localização). |
| `/agendar` | Wizard em 4 passos: serviço → profissional → data/hora → dados. |
| `/agendar?servico=molde-f1` | Abre com o serviço já escolhido (links de posts do Instagram/Facebook). |
| `/agendamento-confirmado?...` | Resumo + lembrete `.ics` (alarmes 24h e 2h antes) + comprovante pelo WhatsApp. |
| `/admin` | Painel da Carol (login mockado): Agenda do Dia, Financeiro & Lucro, Serviços & Combos. |

Slugs disponíveis: `combo-beleza-completa`, `cutilagem-e-esmaltacao`, `esmaltacao-em-gel`, `molde-f1`,
`postica-realista`, `blindagem`, `pedicure`, `plastica-dos-pes`, `extensao-de-cilios`, `progressiva`.

Arquitetura e decisões: [`docs/ARCHITECTURE.md`](docs/ARCHITECTURE.md).

## Painel da Carol (`/admin`)

Login de demonstração: **adm@gmail.com** / **adm123@**.

O login é **mockado no navegador** (credenciais no código do front-end e sessão no `localStorage`).
Serve para a reunião, não é segurança real: antes de ir para produção, trocar por autenticação no servidor.
As alterações feitas no painel ficam salvas só no navegador; o botão "Restaurar demo" volta tudo ao início.
