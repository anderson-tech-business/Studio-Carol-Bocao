# Studio Carol Bocão — Motion System

Animações do protótipo aprovado (conceito "esmalteria"). Use estes tokens e padrões ao portar a landing page para Next.js 15 + Tailwind + Lucide React.

## Tokens

| Token | Valor | Uso |
|-------|-------|-----|
| `--t-fast` | 180ms | Chips de dia/horário, micro-feedback |
| `--t-norm` | 320ms | Hover de botões, cores, ícones |
| `--t-slow` | 600ms | Preenchimento de botões, linhas da tabela, frascos |
| `--t-hero` | 1100ms | Entrada das linhas do H1 |
| `--ease-out` | `cubic-bezier(.16,1,.3,1)` | Entradas e reveals |
| `--ease-io` | `cubic-bezier(.65,0,.35,1)` | Clip/preenchimentos contínuos |
| `--ease-spring` | `cubic-bezier(.34,1.56,.64,1)` | Carimbo, frascos, botões, FAB |

Cores: `#B0306A` (raspberry), `#F6D6E4` (blush), `#7A1F4B` (berry/destaque), `#FFFFFF`, `#222222`, apoio `#C9A25B` (dourado), `#2A0E1C` (tampa do frasco).
Fontes: Poppins 800/900 (títulos, inclusive itálico), DM Sans (corpo).

```ts
// tailwind.config.ts → theme.extend
transitionTimingFunction: {
  'out-expo': 'cubic-bezier(.16,1,.3,1)',
  'io': 'cubic-bezier(.65,0,.35,1)',
  'spring': 'cubic-bezier(.34,1.56,.64,1)',
},
keyframes: {
  'line-up': { from: { transform: 'translateY(110%) rotate(4deg)' }, to: { transform: 'none' } },
  'polish-fill': { to: { backgroundSize: '100% 100%' } },
  'gloss': { from: { backgroundPosition: '120% 0' }, to: { backgroundPosition: '-130% 0' } },
  'blur-in': { from: { opacity: '0.01', transform: 'translateY(18px)', filter: 'blur(6px)' }, to: { opacity: '1', transform: 'none', filter: 'none' } },
  'drip': { from: { transform: 'scaleY(.35)' }, to: { transform: 'scaleY(1)' } },
  'fall': { '0%,55%': { transform: 'translateY(0)', opacity: '1' }, '100%': { transform: 'translateY(130px)', opacity: '0' } },
  'wave': { to: { rotate: '360deg' } },
  'sway': { '0%,100%': { transform: 'rotate(-3deg)' }, '50%': { transform: 'rotate(3deg)' } },
  'wiggle': { '0%,100%': { transform: 'rotate(0)' }, '25%': { transform: 'rotate(-14deg)' }, '60%': { transform: 'rotate(10deg)' } },
  'marquee': { to: { transform: 'translateX(-50%)' } },
  'row-in': { from: { transform: 'translateY(16px)', opacity: '0', filter: 'blur(4px)' }, to: { transform: 'none', opacity: '1', filter: 'none' } },
  'star-fill': { from: { clipPath: 'inset(0 100% 0 0)' } },
  'ripple': { to: { transform: 'translate(-50%,-50%) scale(1)', opacity: '0' } },
},
animation: {
  'line-up': 'line-up 1.1s cubic-bezier(.16,1,.3,1) both',
  'blur-in': 'blur-in .9s cubic-bezier(.16,1,.3,1) both',
  'drip': 'drip 6s cubic-bezier(.65,0,.35,1) infinite alternate',
  'fall': 'fall 6s ease-in infinite',
  'wave': 'wave 7s linear infinite',
  'sway': 'sway 6s ease-in-out infinite',
  'marquee': 'marquee 30s linear infinite',
  'row-in': 'row-in .55s cubic-bezier(.16,1,.3,1) both',
  'star-fill': 'star-fill 1.4s .2s cubic-bezier(.65,0,.35,1) both',
},
```

## Mapa componente → animação

| Componente | Animação | Trigger | Implementação |
|------------|----------|---------|---------------|
| Hero (fundo) | Esmalte escorrendo (SVG + filtro goo, `drip` + `fall`) | Load, loop | Server Component, CSS puro |
| H1 | Linhas sobem (`line-up` com delay escalonado); "impecáveis" contorno → preenchimento (`polish-fill`); "um só lugar" brilho (`gloss`) | Load | CSS puro |
| Frasco do hero | Entrada com spring, balanço (`sway`), onda do líquido (`wave`) | Load, loop | CSS puro |
| Marquee duplo | `marquee` em sentidos opostos + skew pela velocidade do scroll | Loop + scroll | Client: hook `useScrollVelocity` |
| Ficha do combo | Carimbo "Mais Pedido" com spring; conector tracejado desenha; preço count-up | Scroll (IO) | Client: `useScrollReveal` + `useCountUp` |
| Abas de categoria | Mini frascos enchem (`height`) e inclinam; palavra fantasma desliza | Click | Client: estado da aba |
| Linhas de serviço | `row-in` escalonado; hover pinta a linha (`scaleX` do `::before`) | Troca de aba / hover | CSS + `style={{'--i': i}}` |
| Vitrine | Pingentes/cabide em pêndulo com física simples (impulso do scroll); spotlight segue o cursor | Loop + scroll + hover | Client: `useSwing` |
| Avaliações | Estrelas preenchem (`star-fill`); deck arrastável | Scroll + drag | Client: pointer events |
| Postal | Carimbo postal gira; pino flutua; leve rotação desfeita no hover | Loop + hover | CSS puro |
| Rodapé | "carol bocão" preenche conforme a rolagem | Scroll | Client: `--fp` via scroll |
| Global | Barra de progresso; faíscas no toque/cursor (canvas); ripple nos botões | Scroll / pointer | Client: `<SparkleLayer/>`, `<RippleButton/>` |

## Regras do projeto

- Conteúdo da primeira dobra nunca começa invisível; reveals (`.wait`) só para elementos abaixo da dobra no carregamento.
- Animar apenas `transform`, `opacity`, `filter`, `clip-path` e `background-size/position` de texto.
- Loops de `requestAnimationFrame` (pêndulos, glitter, faíscas) param com `prefers-reduced-motion` e quando não há partículas.
- Manter o bloco de reduced-motion do `SKILL.md` no `globals.css`.
- Protótipo de referência: artefato "Studio Carol Bocão" (HTML único com dados de `src/data/mock.ts` espelhados).
