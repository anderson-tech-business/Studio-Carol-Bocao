"use client";

import Link from "next/link";
import { useRef } from "react";
import { motion, useMotionTemplate, useScroll, useTransform } from "motion/react";
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { studio } from "@/data/mock";
import { OpenNow } from "./OpenNow";
import { Reveal } from "./motion";
import { H2, Kicker } from "./ui";

function PLine({ icon, children }: { icon: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="flex items-start gap-2.5 text-ink-soft [&_b]:text-ink">
      <span className="mt-0.5 flex-none text-raspberry [&>svg]:h-[18px] [&>svg]:w-[18px]">{icon}</span>
      <span>{children}</span>
    </div>
  );
}

export function LocationCard() {
  return (
    <Reveal className="mt-14">
      <motion.div
        id="local"
        className="relative grid gap-[18px] rounded-3xl bg-white p-[18px] shadow-[0_30px_60px_-30px_rgba(122,31,75,.6),0_0_0_1px_#EFD3DF] md:grid-cols-[1.1fr_1fr] md:p-[22px]"
        initial={{ rotate: -1 }}
        whileHover={{ rotate: 0 }}
        transition={{ type: "spring", stiffness: 200, damping: 12 }}
      >
        {/* selo e carimbo postal */}
        <motion.div
          aria-hidden="true"
          className="absolute -top-7 right-[76px] grid h-[70px] w-[58px] place-items-center rounded bg-raspberry shadow-[0_10px_20px_-10px_rgba(0,0,0,.4)] outline-dotted outline-4 -outline-offset-[3px] outline-white"
          initial={{ rotate: 8 }}
          whileHover={{ rotate: -6, scale: 1.08 }}
        >
          <span className="h-[34px] w-[22px] rounded-[50%_50%_40%_40%/62%_62%_38%_38%] bg-gradient-to-br from-white to-blush" />
        </motion.div>
        <div aria-hidden="true" className="pointer-events-none absolute -right-1.5 -top-[50px] h-[110px] w-[110px] text-raspberry">
          <svg className="h-full w-full animate-spin-slower" viewBox="0 0 120 120">
            <defs>
              <path id="circ2" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
            </defs>
            <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.5" />
            <circle cx="60" cy="60" r="32" fill="none" stroke="currentColor" strokeWidth="1" />
            <text className="fill-current font-display text-[9.5px] font-bold tracking-[2.2px]">
              <textPath href="#circ2">GLEBA DO PÊSSEGO · SÃO PAULO · SP · </textPath>
            </text>
          </svg>
        </div>

        <div className="relative min-h-[220px] overflow-hidden rounded-2xl bg-blush-soft" role="img" aria-label="Mapa ilustrativo da R. Emburi, 72">
          <svg className="absolute inset-0 h-full w-full" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
            <rect width="400" height="260" fill="#FBEAF1" />
            <g fill="#F6D6E4">
              <rect x="20" y="20" width="110" height="70" rx="8" />
              <rect x="150" y="20" width="80" height="70" rx="8" />
              <rect x="250" y="20" width="130" height="90" rx="8" />
              <rect x="20" y="110" width="90" height="130" rx="8" />
              <rect x="130" y="130" width="70" height="110" rx="8" />
              <rect x="250" y="135" width="60" height="105" rx="8" />
              <rect x="330" y="135" width="50" height="105" rx="8" />
            </g>
            <g stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round">
              <path d="M0 100 H400" />
              <path d="M140 0 V260" />
              <path d="M240 0 V260" />
              <motion.path
                d="M215 100 C 220 160, 230 200, 320 260"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.4, ease: "easeInOut" }}
              />
            </g>
            <text x="16" y="96" fontFamily="DM Sans, sans-serif" fontSize="9" fill="#9E5C7B" letterSpacing="1">R. EMBURI</text>
          </svg>
          <span className="absolute left-[52%] top-[46%] -translate-x-1/2 -translate-y-full text-raspberry drop-shadow-[0_8px_10px_rgba(122,31,75,.4)] after:absolute after:-bottom-1.5 after:left-1/2 after:-ml-[9px] after:h-1.5 after:w-[18px] after:animate-pulse-ring after:rounded-full after:bg-berry/30 after:content-['']">
            <svg className="h-[46px] w-[46px] animate-pin-bob" viewBox="0 0 24 24">
              <path fill="currentColor" d="M12 1.5a8.5 8.5 0 0 0-8.5 8.5c0 5.6 6.6 11.6 7.7 12.5a1.2 1.2 0 0 0 1.6 0c1.1-.9 7.7-6.9 7.7-12.5A8.5 8.5 0 0 0 12 1.5" />
              <circle cx="12" cy="10" r="3.2" fill="#fff" />
            </svg>
          </span>
        </div>

        <div className="grid gap-3.5 px-1 pb-1.5 pt-1">
          <Kicker>Como chegar</Kicker>
          <h3 className="font-display text-2xl font-black leading-[1.05] tracking-[-0.03em]">Te esperamos na R. Emburi, 72</h3>
          <PLine icon={<MapPin />}>
            <b>R. Emburi, 72</b> – Gleba do Pêssego, São Paulo/SP
          </PLine>
          <PLine icon={<Clock />}>
            <b>
              {studio.hours.open} às {studio.hours.close}
            </b>
            , sempre com hora marcada
          </PLine>
          <OpenNow />
          <PLine icon={<InstagramIcon />}>
            Trabalhos recentes em{" "}
            <a href={studio.instagramUrl} target="_blank" rel="noopener noreferrer" className="font-bold text-raspberry">
              {studio.instagram}
            </a>
          </PLine>
          <a className="btn btn-fill justify-self-start" href={studio.mapsUrl} target="_blank" rel="noopener noreferrer">
            <MapPin />
            Abrir rota no Maps
          </a>
        </div>
      </motion.div>
    </Reveal>
  );
}

/** "carol bocão" gigante que se preenche conforme o rodapé entra na tela. */
function GiantName() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end 0.85"] });
  const fill = useTransform(scrollYProgress, [0, 1], [0, 100]);
  const backgroundSize = useMotionTemplate`${fill}% 100%`;

  return (
    <motion.div
      ref={ref}
      aria-hidden="true"
      style={{ backgroundSize }}
      className="whitespace-nowrap bg-gradient-to-r from-raspberry to-blush bg-clip-text bg-no-repeat font-display text-[clamp(3.4rem,19vw,12rem)] font-black leading-[.86] tracking-[-0.07em] text-transparent [-webkit-text-stroke:1.5px_rgba(246,214,228,.45)]"
    >
      carol bocão
    </motion.div>
  );
}

export function FinalSection() {
  return (
    <section id="final" className="relative overflow-x-clip bg-ink pb-24 pt-11 text-white">
      <div className="mx-auto grid max-w-[1120px] gap-5 px-4">
        <Reveal className="grid justify-items-start gap-[18px]">
          <H2 className="text-[clamp(2rem,9vw,3.4rem)] [&_em]:text-blush">
            Seu horário está <em>a dois toques</em>.
          </H2>
          <Link href="/agendar" className="btn btn-fill">
            <CalendarCheck />
            Agendar Horário
          </Link>
        </Reveal>
        <GiantName />
        <div className="grid gap-1.5 text-[.95rem] text-[#ece1e6] [&_a]:text-blush [&_a]:underline [&_a]:underline-offset-[3px]">
          <span>Studio Carol Bocão · Nails &amp; Beauty</span>
          <span>
            {studio.address} · WhatsApp {studio.whatsappDisplay} ·{" "}
            <a href={studio.instagramUrl} target="_blank" rel="noopener noreferrer">
              {studio.instagram}
            </a>
          </span>
          <span className="mt-2 text-[.85rem] text-[#c9b6bf]">
            Protótipo visual de demonstração. Agendamentos simulados. · <Link href="/admin">Área da Carol</Link>
          </span>
        </div>
      </div>
    </section>
  );
}

export function WhatsAppFab() {
  return (
    <motion.a
      className="group fixed bottom-[calc(16px+env(safe-area-inset-bottom))] right-[calc(16px+env(safe-area-inset-right))] z-[85] grid h-[58px] w-[58px] place-items-center rounded-full bg-wa text-white shadow-[0_14px_30px_-10px_rgba(19,128,74,.6)] before:absolute before:inset-0 before:animate-pulse-ring-sm before:rounded-full before:border-2 before:border-wa before:content-['']"
      href={`https://wa.me/${studio.whatsapp}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Conversar no WhatsApp"
      initial={{ scale: 0, rotate: -90 }}
      animate={{ scale: 1, rotate: 0 }}
      transition={{ type: "spring", stiffness: 260, damping: 16, delay: 1.4 }}
      whileHover={{ scale: 1.1, rotate: -8 }}
      whileTap={{ scale: 0.92 }}
    >
      <WhatsAppIcon className="h-7 w-7" />
      <span className="pointer-events-none absolute right-[68px] top-1/2 -translate-y-1/2 translate-x-2 whitespace-nowrap rounded-xl bg-white px-3 py-2 text-[.9rem] font-medium text-ink opacity-0 shadow-[0_10px_24px_-14px_rgba(0,0,0,.5)] transition duration-300 ease-out-expo group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100">
        Fale com a Carol
      </span>
    </motion.a>
  );
}
