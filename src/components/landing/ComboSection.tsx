"use client";

import Link from "next/link";
import { motion } from "motion/react";
import { CalendarCheck, Eye, Flame, Footprints, Hand } from "lucide-react";
import { combos, services } from "@/data/mock";
import { brl, formatDuration } from "@/lib/format";
import { CountUp, EASE_IO } from "./motion";
import { Kicker, Section, SectionHead } from "./ui";

/** Recortes laterais da "ficha" (meia-lua dos dois lados, na altura do picote). */
const TICKET_MASK =
  "radial-gradient(circle 16px at 0 64%,#0000 98%,#000) left/51% 100% no-repeat,radial-gradient(circle 16px at 100% 64%,#0000 98%,#000) right/51% 100% no-repeat";

const STEPS = [
  { icon: Eye, label: "Cílios" },
  { icon: Hand, label: "Unhas" },
  { icon: Footprints, label: "Pés" },
];

function Connector({ delay }: { delay: number }) {
  return (
    <motion.svg
      className="h-0.5 w-full origin-left overflow-visible"
      viewBox="0 0 100 2"
      preserveAspectRatio="none"
      aria-hidden="true"
      variants={{ hidden: { scaleX: 0 }, show: { scaleX: 1, transition: { duration: 1.2, delay, ease: EASE_IO } } }}
    >
      <path d="M0 1 H100" className="fill-none stroke-raspberry [stroke-dasharray:4_5] [stroke-width:2]" vectorEffect="non-scaling-stroke" />
    </motion.svg>
  );
}

export function ComboSection() {
  const combo = combos[0];
  const avulso = combo.includesServices.reduce((sum, slug) => sum + (services.find((s) => s.slug === slug)?.price ?? 0), 0);

  return (
    <Section id="combos">
      <SectionHead
        kicker="Combo da casa"
        title={
          <>
            Do olhar até os pés, <em>numa tarde só</em>
          </>
        }
      />

      <motion.div
        className="drop-shadow-[0_26px_30px_rgba(122,31,75,.28)]"
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, amount: 0.3 }}
        variants={{ hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.16, 1, 0.3, 1] } } }}
      >
        <article className="relative grid rounded-[34px] bg-blush-soft" style={{ WebkitMask: TICKET_MASK, mask: TICKET_MASK }}>
          <div className="relative grid gap-4 px-[22px] pb-[22px] pt-7 md:px-10 md:pb-7 md:pt-10">
            <Kicker>Ficha nº 01</Kicker>
            <h3 className="max-w-[14ch] pr-[84px] font-display md:pr-0 text-[clamp(1.7rem,7.5vw,2.6rem)] font-black leading-[1.05] tracking-[-0.03em]">
              Combo Beleza <span className="text-raspberry">Completa</span>
            </h3>

            {combo.badge && (
              <motion.div
                className="absolute right-4 top-[18px] grid h-[76px] w-[76px] place-items-center rounded-full border-[3px] border-double border-raspberry bg-white/60 text-center font-display text-[.62rem] font-black uppercase leading-[1.05] tracking-[0.04em] text-raspberry min-[371px]:h-24 min-[371px]:w-24 min-[371px]:text-[.7rem]"
                variants={{
                  hidden: { opacity: 0, scale: 1.8, rotate: 20 },
                  show: { opacity: 1, scale: 1, rotate: -14, transition: { type: "spring", stiffness: 320, damping: 14, delay: 0.35 } },
                }}
                whileHover={{ rotate: -4, scale: 1.06 }}
              >
                <span>
                  <Flame className="mx-auto mb-0.5 block h-4 w-4" aria-hidden="true" />
                  {combo.badge}
                </span>
              </motion.div>
            )}

            <div className="grid grid-cols-[auto_1fr_auto_1fr_auto] items-center gap-1.5">
              {STEPS.map(({ icon: Icon, label }, i) => (
                <span key={label} className="contents">
                  {i > 0 && <Connector delay={0.2 + i * 0.25} />}
                  <span className="grid justify-items-center gap-1.5 text-[.92rem] font-bold text-berry">
                    <motion.i
                      className="grid h-[54px] w-[54px] place-items-center rounded-[18px] bg-white not-italic text-raspberry shadow-[0_10px_18px_-12px_rgba(122,31,75,.7)]"
                      whileHover={{ y: -4, rotate: -6 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    >
                      <Icon className="h-6 w-6" aria-hidden="true" />
                    </motion.i>
                    {label}
                  </span>
                </span>
              ))}
            </div>
          </div>

          <div className="mx-[26px] border-t-2 border-dashed border-line-strong" />

          <div className="flex flex-wrap items-center justify-between gap-4 px-[22px] pb-[26px] pt-5 md:px-10 md:pb-[34px] md:pt-6">
            <div>
              <div className="flex items-baseline gap-1.5 font-display leading-none">
                <small className="font-bold text-berry">R$</small>
                <CountUp to={combo.price} className="text-5xl font-black tabular-nums tracking-[-0.05em] text-raspberry" />
              </div>
              <div className="mt-1.5 text-[.95rem] text-ink-soft">
                {formatDuration(combo.duration)} de atendimento · avulso sairia <s className="whitespace-nowrap">{brl(avulso)}</s>
              </div>
            </div>
            <Link href={`/agendar?servico=${combo.slug}`} className="btn btn-fill">
              <CalendarCheck />
              Agendar o combo
            </Link>
          </div>
        </article>
      </motion.div>
    </Section>
  );
}
