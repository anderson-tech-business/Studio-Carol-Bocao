"use client";

import type { ReactNode } from "react";
import {
  motion,
  useMotionTemplate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
  type MotionValue,
} from "motion/react";
import { WhatsAppIcon } from "@/components/icons";
import { resale, studio } from "@/data/mock";
import { brl } from "@/lib/format";
import { Reveal } from "./motion";
import { Section, SectionHead } from "./ui";

/** Brilhos fixos (posições determinísticas para o SSR bater com o cliente). */
const GLITTER = Array.from({ length: 26 }, (_, i) => ({
  left: `${(i * 37) % 100}%`,
  top: `${(i * 53 + 11) % 100}%`,
  size: 2 + (i % 3),
  delay: (i % 7) * 0.45,
  dur: 2.4 + (i % 5) * 0.5,
}));

/**
 * Peça pendurada que balança como pêndulo: mola com pouco amortecimento,
 * empurrada pela velocidade da rolagem e pelo "toque" do cursor no expositor.
 */
function Swing({ children, dir, kick, index }: { children: ReactNode; dir: 1 | -1; kick: MotionValue<number>; index: number }) {
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const push = useTransform(velocity, [-2000, 2000], [-22 * dir, 22 * dir], { clamp: true });
  const target = useTransform(() => push.get() + kick.get() * dir);
  const rotate = useSpring(target, { stiffness: 55, damping: 3.5, mass: 1 });

  return (
    <motion.div style={{ rotate }} className="relative origin-top">
      <motion.div
        className="origin-top"
        animate={{ rotate: [-4, 4, -4] }}
        transition={{ duration: 5.6, repeat: Infinity, ease: "easeInOut", delay: index * -1.7 }}
      >
        {children}
      </motion.div>
    </motion.div>
  );
}

function Earring({ shape, len }: { shape: "drop" | "hoop" | "dot"; len: number }) {
  return (
    <svg className="block" width="44" height={len + 60} viewBox={`0 0 44 ${len + 60}`}>
      <path d={`M22 0 v${len}`} stroke="#B8893E" strokeWidth="2" />
      <circle cx="22" cy="2" r="3" fill="none" stroke="#B8893E" strokeWidth="2" />
      {shape === "drop" && (
        <>
          <path d={`M22 ${len} l14 16 -14 32 -14 -32z`} fill="#fff" stroke="#B8893E" strokeWidth="2.5" />
          <path d={`M8 ${len + 16} h28 M22 ${len} l-5 16 5 32 5-32z`} fill="none" stroke="#C9A25B" strokeWidth="1.2" />
        </>
      )}
      {shape === "hoop" && (
        <>
          <circle cx="22" cy={len + 20} r="18" fill="none" stroke="#C9A25B" strokeWidth="4" />
          <circle cx="22" cy={len + 38} r="4" fill="#B0306A" />
        </>
      )}
      {shape === "dot" && (
        <>
          <circle cx="22" cy={len + 14} r="12" fill="#F6D6E4" stroke="#B8893E" strokeWidth="2.5" />
          <circle cx="18" cy={len + 10} r="3" fill="#fff" />
        </>
      )}
    </svg>
  );
}

function Hanger() {
  return (
    <svg className="block" width="150" height="160" viewBox="0 0 150 160">
      <path d="M75 4 q10 0 10 9 q0 7 -10 12" fill="none" stroke="#7A1F4B" strokeWidth="3" strokeLinecap="round" />
      <path d="M75 25 L10 52 H140 Z" fill="none" stroke="#7A1F4B" strokeWidth="3" strokeLinejoin="round" />
      <path d="M30 52 Q36 90 66 92 Q75 84 75 78 Q75 84 84 92 Q114 90 120 52 Q102 46 98 56 L75 78 L52 56 Q48 46 30 52z" fill="#B0306A" />
      <path d="M38 64 Q52 84 66 86 M112 64 Q98 84 84 86" fill="none" stroke="#F6D6E4" strokeWidth="1.5" strokeDasharray="2 3" />
      <circle cx="75" cy="84" r="4" fill="#F6D6E4" />
      <path d="M40 104 Q75 114 110 104 Q104 134 75 136 Q46 134 40 104z" fill="#7A1F4B" />
      <path d="M75 92 v12" stroke="#7A1F4B" strokeWidth="1.5" strokeDasharray="2 2" />
    </svg>
  );
}

function DisplayCard({ item, index }: { item: (typeof resale)[number]; index: number }) {
  const mx = useMotionValue(-400);
  const my = useMotionValue(-400);
  const spotlight = useMotionTemplate`radial-gradient(260px circle at ${mx}px ${my}px, rgba(246,214,228,.7), transparent 70%)`;
  const kick = useMotionValue(0);
  const jewel = item.kind === "jewel";

  const hit = () => {
    kick.set(18);
    window.setTimeout(() => kick.set(0), 140);
  };

  return (
    <Reveal kind="tilt" delay={index * 0.12} as="article" className="overflow-hidden rounded-[34px] bg-white">
      <div
        className="group relative grid h-full gap-[18px] p-[22px]"
        onPointerMove={(e) => {
          const r = e.currentTarget.getBoundingClientRect();
          mx.set(e.clientX - r.left);
          my.set(e.clientY - r.top);
        }}
      >
        <motion.div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{ background: spotlight }}
        />
        <div className="flex items-start justify-between gap-3">
          <h3 className="font-display text-[1.45rem] font-extrabold leading-[1.05] tracking-[-0.03em]">{item.name}</h3>
          <div className="whitespace-nowrap text-right text-[.88rem] leading-[1.1] text-ink-soft">
            a partir de
            <b className="block font-display text-[1.7rem] font-black tracking-[-0.04em] text-raspberry">{brl(item.priceFrom)}</b>
          </div>
        </div>

        <motion.div
          aria-hidden="true"
          onHoverStart={hit}
          onTap={hit}
          className={`relative flex h-[170px] items-start justify-around rounded-[20px] pt-[22px] before:absolute before:inset-x-3.5 before:top-3.5 before:h-1 before:rounded before:bg-berry/20 before:content-[''] ${
            jewel ? "bg-gradient-to-b from-[#FFF6E6] to-[#F6E7C9]" : "bg-blush-soft"
          }`}
        >
          {jewel ? (
            <>
              <Swing dir={1} kick={kick} index={0}><Earring shape="drop" len={40} /></Swing>
              <Swing dir={-1} kick={kick} index={1}><Earring shape="hoop" len={26} /></Swing>
              <Swing dir={1} kick={kick} index={2}><Earring shape="dot" len={56} /></Swing>
            </>
          ) : (
            <Swing dir={-1} kick={kick} index={3}><Hanger /></Swing>
          )}
        </motion.div>

        <p className="relative text-ink-soft">{item.description}</p>
        <div className="relative flex flex-wrap gap-1.5">
          {item.tags.map((t) => (
            <span key={t} className="rounded-full bg-blush-soft px-[11px] py-[5px] text-[.88rem] font-medium text-berry">
              {t}
            </span>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

export function ShowcaseSection() {
  const waText = encodeURIComponent("Oi Carol! Quero ver os modelos de semijoias e moda íntima.");
  return (
    <Section id="vitrine" className="relative bg-blush" innerClassName="relative">
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        {GLITTER.map((g, i) => (
          <motion.span
            key={i}
            className="absolute rounded-full bg-white"
            style={{ left: g.left, top: g.top, width: g.size, height: g.size }}
            animate={{ opacity: [0.1, 0.9, 0.1], scale: [0.5, 1.2, 0.5] }}
            transition={{ duration: g.dur, delay: g.delay, repeat: Infinity, ease: "easeInOut" }}
          />
        ))}
      </div>

      <SectionHead
        kicker="Também no Studio"
        title={
          <>
            Saia com a unha feita <em>e um mimo</em>
          </>
        }
        lead={<span className="text-berry">Peças escolhidas pela Carol para ver de perto no studio ou por foto no WhatsApp.</span>}
      />

      <div className="grid gap-4 md:grid-cols-2">
        {resale.map((item, i) => (
          <DisplayCard key={item.slug} item={item} index={i} />
        ))}
      </div>

      <Reveal className="mt-[18px] flex flex-wrap items-center gap-x-4 gap-y-3">
        <a className="btn btn-wa" href={`https://wa.me/${studio.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer">
          <WhatsAppIcon />
          Consultar modelos no WhatsApp
        </a>
        <small className="text-[.95rem] font-medium text-berry">Sem loja on-line: a Carol manda fotos e valores atualizados.</small>
      </Reveal>
    </Section>
  );
}
