import Link from "next/link";
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { studio } from "@/data/mock";
import { HeroBottle } from "./HeroBottle";

const DRIPS = [
  { x: 22, w: 16, h: 64, dd: "5s" },
  { x: 78, w: 12, h: 40, dd: "7s" },
  { x: 134, w: 20, h: 86, dd: "6s" },
  { x: 205, w: 12, h: 46, dd: "4.6s" },
  { x: 262, w: 18, h: 74, dd: "6.6s" },
  { x: 330, w: 14, h: 52, dd: "5.4s" },
  { x: 372, w: 16, h: 92, dd: "7.4s" },
];

const DROPS = [
  { cx: 144, cy: 80, r: 8, dd: "6s", delay: "0s" },
  { cx: 271, cy: 70, r: 7, dd: "6.6s", delay: "-2s" },
  { cx: 380, cy: 86, r: 7, dd: "7.4s", delay: "-4s" },
];

/** Uma linha do H1: sobe de dentro de uma máscara. Fica em CSS para aparecer antes do JS (LCP). */
function Line({ children, delay, className = "animate-line-up" }: { children: React.ReactNode; delay: string; className?: string }) {
  return (
    <span className="-my-[.03em] block overflow-hidden pb-[.04em] pt-[.06em]">
      <span className={`inline-block ${className}`} style={{ animationDelay: delay }}>
        {children}
      </span>
    </span>
  );
}

export function Hero() {
  const waText = encodeURIComponent("Oi Carol! Gostaria de agendar um horário.");
  return (
    <section className="relative isolate bg-raspberry pb-[84px] pt-16 text-white md:pb-[104px] md:pt-20">
      {/* luz de fundo */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 opacity-50 [background:radial-gradient(60%_50%_at_85%_30%,rgba(246,214,228,.35),transparent_70%),radial-gradient(50%_40%_at_0%_90%,rgba(122,31,75,.6),transparent_70%)]"
      />

      {/* esmalte escorrendo do topo */}
      <svg className="pointer-events-none absolute inset-x-0 top-0 z-0 h-[150px] w-full" viewBox="0 0 400 150" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
            <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
          </filter>
        </defs>
        <g filter="url(#goo)" fill="#7A1F4B">
          <rect x="-10" y="-6" width="420" height="18" />
          {DRIPS.map((d) => (
            <rect
              key={d.x}
              className="origin-top animate-drip [transform-box:fill-box]"
              style={{ animationDuration: d.dd }}
              x={d.x}
              y="0"
              width={d.w}
              height={d.h}
              rx={d.w / 2}
            />
          ))}
          {DROPS.map((d) => (
            <circle
              key={d.cx}
              className="animate-fall [transform-box:fill-box]"
              style={{ animationDuration: d.dd, animationDelay: d.delay }}
              cx={d.cx}
              cy={d.cy}
              r={d.r}
            />
          ))}
        </g>
      </svg>

      <div className="relative z-[1] mx-auto grid max-w-[1120px] items-center gap-5 px-4 md:grid-cols-[1.25fr_.75fr]">
        <div className="grid min-w-0 gap-[22px]">
          <span className="inline-flex flex-wrap items-center gap-2.5 text-[.85rem] font-bold uppercase tracking-[0.1em]">
            <span className="h-[7px] w-[7px] animate-beat rounded-full bg-gold shadow-[0_0_0_0_rgba(201,162,91,.8)]" />
            Gleba do Pêssego · Zona Leste · SP
          </span>

          <h1 className="font-display text-[clamp(2.55rem,12.6vw,6rem)] font-black leading-[.98] tracking-[-0.045em] [text-wrap:balance]">
            <Line delay=".05s">Unhas</Line>
            <Line
              delay=".15s"
              className="animate-line-up-fill bg-[linear-gradient(90deg,#fff,#fff)] bg-[length:0%_100%] bg-clip-text bg-no-repeat text-transparent [-webkit-text-stroke:1.5px_#fff] motion-reduce:bg-[length:100%_100%]"
            >
              impecáveis
            </Line>
            <Line delay=".25s">e beleza em</Line>
            <Line
              delay=".35s"
              className="animate-line-up-gloss bg-[linear-gradient(100deg,#F6D6E4_0%,#F6D6E4_40%,#fff_50%,#F6D6E4_60%,#F6D6E4_100%)] bg-[length:250%_100%] bg-clip-text italic text-transparent"
            >
              um só lugar
            </Line>
          </h1>

          <p className="max-w-[40ch] animate-blur-in text-[1.12rem] [animation-delay:.6s]">
            Esmaltação, alongamento, pés, cílios e cabelo com hora marcada, no capricho da Carol. Atendimento na{" "}
            <b className="bg-[linear-gradient(transparent_62%,rgba(122,31,75,.75)_62%)]">Gleba do Pêssego</b>, pertinho de você.
          </p>

          <div className="flex animate-blur-in flex-wrap gap-2.5 [animation-delay:.75s]">
            <Link href="/agendar" className="btn btn-white">
              <CalendarCheck />
              Agendar Horário
            </Link>
            <a className="btn btn-line" href={`https://wa.me/${studio.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Chamar no WhatsApp
            </a>
          </div>

          <div className="flex animate-blur-in flex-wrap gap-2 [animation-delay:.9s]">
            {[
              { icon: MapPin, text: "R. Emburi, 72" },
              { icon: Clock, text: `${studio.hours.open} às ${studio.hours.close}` },
            ].map(({ icon: Icon, text }) => (
              <span key={text} className="inline-flex items-center gap-1.5 rounded-full bg-cap/35 px-3 py-[7px] text-[.92rem] font-medium backdrop-blur-sm">
                <Icon className="h-3.5 w-3.5" aria-hidden="true" />
                {text}
              </span>
            ))}
          </div>
        </div>

        <HeroBottle ratingCount={studio.rating.count} />
      </div>

      <svg className="absolute inset-x-0 -bottom-px z-[1] h-12 w-full" viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40 C 60 10, 120 70, 200 38 S 340 10, 400 36 V70 H0z" fill="#fff" />
      </svg>
    </section>
  );
}
