"use client";

import { motion, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "motion/react";

const ROW_A = ["Esmaltação em gel", "Molde F1", "Blindagem", "Postiça realista"];
const ROW_B = ["Extensão de cílios", "Plástica dos pés", "Progressiva", "Pedicure"];

function Track({ items, italic }: { items: string[]; italic?: boolean }) {
  const half = (
    <span className="inline-flex items-center gap-[22px] whitespace-nowrap pr-[22px] font-display text-[clamp(1.1rem,5vw,1.6rem)] font-extrabold tracking-[-0.02em]">
      {items.map((t) => (
        <span key={t} className="contents">
          <span className={italic ? "italic" : undefined}>{t}</span>
          <i className="inline-block animate-spin-6 not-italic text-gold">✦</i>
        </span>
      ))}
    </span>
  );
  return (
    <>
      {half}
      {half}
    </>
  );
}

/** Faixa dupla de serviços: rola sozinha e entorta conforme a velocidade da rolagem. */
export function Marquee() {
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const velocity = useVelocity(scrollY);
  const smooth = useSpring(velocity, { stiffness: 300, damping: 50 });
  const skewY = useTransform(smooth, [-1500, 0, 1500], [-8, -2, 4], { clamp: true });

  return (
    <motion.div
      aria-hidden="true"
      className="group relative z-[3] -mt-[22px] grid"
      style={{ skewY: reduce ? -2 : skewY }}
    >
      <div className="overflow-hidden bg-berry py-3 text-white">
        <div className="flex w-max animate-marquee group-hover:[animation-play-state:paused]">
          <Track items={ROW_A} />
        </div>
      </div>
      <div className="overflow-hidden bg-blush py-3 text-berry">
        <div className="flex w-max animate-marquee-rev group-hover:[animation-play-state:paused]">
          <Track items={ROW_B} italic />
        </div>
      </div>
    </motion.div>
  );
}
