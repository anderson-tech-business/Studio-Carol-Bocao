# Arquitetura — Studio Carol Bocão (protótipo)

## 1. Requisitos

**Funcionais**
- Landing page com combos, catálogo por categoria, vitrine de revenda, avaliações e localização.
- `/agendar`: wizard em 4 passos (serviço → profissional → data/hora → dados da cliente).
  - Aceita `?servico=<slug>` para links de posts (Instagram/Facebook) e já abre no passo 2.
  - 7 próximos dias de atendimento; grade fixa `08:00, 09:30, 11:00, 13:30, 15:00, 16:30`; 2 horários "Ocupado" por dia.
  - Nome + WhatsApp com máscara `(11) 99999-9999`.
- `/agendamento-confirmado`: cartão resumo, download de `.ics` com 2 alarmes e link de comprovante via `wa.me`.

**Não funcionais**
- Protótipo de demonstração: 100% front-end, sem banco, sem autenticação, sem API.
- Mobile-first, WCAG 2.1 AA (contraste ≥ 4.5:1, alvos ≥ 44px, foco visível, `prefers-reduced-motion`).
- Todas as rotas pré-renderizadas como estáticas (deploy em qualquer CDN/Vercel).

## 2. Visão geral

```
 Instagram / Facebook                       Landing (/)
 link ?servico=molde-f1 ─────┐     "Agendar" ─┘  (Link /agendar?servico=slug)
                             ▼
                      ┌──────────────┐  localStorage (rascunho)
                      │  /agendar    │◄──────────────────────────┐
                      │ BookingWizard│───────────────────────────┘
                      └──────┬───────┘
                             │ router.push(query params)
                             ▼
             /agendamento-confirmado?servico&profissional&data&horario&nome&whatsapp
                      ┌──────────────┐
                      │ Confirmation │── resolveBooking() valida contra mock.ts
                      └──┬────────┬──┘
           buildICS()    │        │   whatsappReceiptUrl()
   Blob → download .ics ◄┘        └► https://wa.me/5511981991410?text=...
```

Fonte única de dados: `src/data/mock.ts` (studio, categorias, serviços, combos, revenda, profissionais, avaliações, grade de horários).

## 3. Módulos

| Arquivo | Responsabilidade |
|---|---|
| `src/data/mock.ts` | Dados tipados e `bookables` (combo + serviços) com `findBookable` / `findProfessional`. |
| `src/lib/schedule.ts` | "Agora" no fuso `America/Sao_Paulo`, próximos dias úteis, status de cada horário (`free`, `busy`, `past`, `too-long`). Ocupados são determinísticos por data (hash), então o mesmo dia mostra sempre os mesmos ocupados. |
| `src/lib/booking.ts` | Contrato dos query params, validação da confirmação, mensagem do WhatsApp, rascunho em `localStorage`. |
| `src/lib/ics.ts` | Gera iCalendar RFC 5545: horário em UTC, escape de texto, dobra de linhas a 75 octetos, `VALARM` `-PT24H` e `-PT2H`; dispara download via `Blob`. |
| `src/lib/format.ts` | Moeda, duração, datas em pt-BR sem depender do fuso do aparelho, máscara/validação de celular. |
| `src/components/landing/*` | Seções da landing (Server Components) + ilhas client: `ServiceMenu`, `ReviewDeck`, `OpenNow`, `LandingEffects`. |
| `src/components/booking/*` | `BookingWizard`, `Confirmation`, `BookingShell`. |

### Contrato de query params (`/agendamento-confirmado`)

| Param | Exemplo | Validação |
|---|---|---|
| `servico` | `molde-f1` | precisa existir em `bookables` |
| `profissional` | `carol-bocao` | precisa existir em `professionals` |
| `data` | `2026-11-20` | data ISO válida |
| `horario` | `09:30` | `HH:MM` |
| `nome` | `Juliana Martins` | ≥ 2 caracteres |
| `whatsapp` | `(11) 98765-4321` | 11 dígitos, celular |

Parâmetros inválidos mostram um estado de erro com link para `/agendar`.

### Painel `/admin`

| Arquivo | Responsabilidade |
|---|---|
| `src/data/admin-mock.ts` | Agenda do dia, últimos 4 meses, margem por linha (serviços ~82%, revenda ~45%), opções de venda. |
| `src/lib/admin-auth.ts` | Login mockado (`adm@gmail.com` / `adm123@`), sessão de 12h no `localStorage`. |
| `src/components/admin/*` | `AdminApp` (gate + abas), `AgendaTab`, `FinanceTab`, `ServicesTab`, `AdminLogin`, `ui` (modal, switch, toast, `useStoredState`). |

Estado do painel (agenda, vendas registradas, preços/pausas) é local e persistido no navegador. Os KPIs são derivados: base do mês + vendas registradas × taxa de custo da linha.

## 4. Decisões e trade-offs

| Decisão | Por quê | Custo / quando rever |
|---|---|---|
| Estado no cliente + query params | Pedido do protótipo; link de confirmação é compartilhável e funciona sem servidor. | Dados pessoais ficam na URL (histórico do navegador). Com backend real, trocar por um `id` de agendamento. |
| Horários ocupados mockados por hash da data | Realismo estável na demo, sem banco. | Substituir `slotsFor()` por consulta à agenda real; a interface (`Slot[]`) pode continuar a mesma. |
| `.ics` em UTC (São Paulo = UTC-3 fixo) | Evita `VTIMEZONE`; compatível com iOS, Android e Google Agenda. | Se o Brasil voltar a ter horário de verão, usar `TZID=America/Sao_Paulo` + `VTIMEZONE`. |
| CSS do protótipo em `globals.css` + Tailwind no fluxo novo | Preserva o visual aprovado sem reescrever 300 regras; Tailwind com os mesmos tokens. | Migrar seções da landing para utilitários Tailwind aos poucos. |
| Login do `/admin` no cliente | Pedido da demo: acesso rápido com um único usuário. | Credenciais ficam no bundle; qualquer pessoa técnica entra. Antes de produção: auth no servidor (cookie httpOnly, senha com hash) e `middleware` protegendo `/admin`. |
| Efeitos da landing em um único `useEffect` (DOM) | Um loop `requestAnimationFrame` para pêndulos, glitter e faíscas; zero dependências. | Se crescer, extrair hooks (`useScrollReveal`, `useSwing`) — ver `.claude/skills/frontend-ui-animator`. |

## 5. Próximos passos para produção

1. API de agendamento (ex.: route handlers + banco) com bloqueio real de horários e prevenção de conflito.
2. Confirmação pela Carol (status "pendente → confirmado") e notificações.
3. Trocar dados pessoais da URL por um token do agendamento.
4. Testes E2E (Playwright) do fluxo `?servico=` → confirmação → `.ics`.
