"use client";

import { motion } from "motion/react";
import { EASE_OUT } from "./motion";

const NAILS = [
  { pos: "left-[2%] top-[18%] w-[14%]", bg: "from-white to-blush", rotate: -24, dur: 5.5 },
  { pos: "left-[10%] bottom-[12%] w-[11%]", bg: "from-[#E7C68E] to-gold", rotate: 16, dur: 6.5 },
  { pos: "right-[4%] bottom-[26%] w-[12%]", bg: "from-berry to-cap", rotate: 28, dur: 4.8 },
];

/**
 * Palco do hero: frasco entra com mola e pode ser "chacoalhado" (arrastar e soltar volta ao lugar),
 * unhas flutuam e o selo da nota gira.
 */
export function HeroBottle({ ratingCount }: { ratingCount: number }) {
  return (
    <div className="relative aspect-square w-[min(100%,280px)] max-w-full justify-self-center" aria-hidden="true">
      {NAILS.map((n, i) => (
        <motion.span
          key={i}
          className={`absolute aspect-[1/1.6] rounded-[50%_50%_40%_40%/62%_62%_38%_38%] bg-gradient-to-br shadow-[inset_-4px_-6px_10px_rgba(0,0,0,.15),0_14px_22px_-12px_rgba(42,14,28,.7)] ${n.pos} ${n.bg}`}
          style={{ rotate: n.rotate }}
          initial={{ opacity: 0, scale: 0.4 }}
          animate={{ opacity: 1, scale: 1, y: [0, -14, 0] }}
          transition={{
            opacity: { duration: 0.5, delay: 0.5 + i * 0.12 },
            scale: { type: "spring", stiffness: 260, damping: 14, delay: 0.5 + i * 0.12 },
            y: { duration: n.dur, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <span className="absolute left-[22%] top-[12%] h-[40%] w-[22%] rounded-full bg-white/75" />
        </motion.span>
      ))}

      {/* Frasco: entrada com mola + arrastável */}
      <motion.div
        className="absolute bottom-[6%] left-[27%] w-[46%] cursor-grab touch-none active:cursor-grabbing"
        initial={{ y: 40, rotate: -18, scale: 0.8, opacity: 0 }}
        animate={{ y: 0, rotate: 0, scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 140, damping: 11, delay: 0.3 }}
        drag
        dragSnapToOrigin
        dragElastic={0.35}
        dragTransition={{ bounceStiffness: 420, bounceDamping: 12 }}
        whileDrag={{ scale: 1.06, rotate: 8 }}
        whileHover={{ scale: 1.03 }}
      >
        <div className="origin-bottom animate-sway">
          <div className="relative mx-auto aspect-[1/1.75] w-[38%] rounded-t-[10px] rounded-b bg-[linear-gradient(90deg,#1a0812,#2A0E1C_40%,#4a1a33_60%,#2A0E1C)] shadow-[inset_0_-6px_0_rgba(0,0,0,.25)]">
            <span className="absolute left-[18%] top-[10%] h-[70%] w-[12%] rounded bg-white/20" />
          </div>
          <div className="mx-auto h-2.5 w-[30%] rounded-sm bg-white/40" />
          <div className="relative aspect-[1/1.05] overflow-hidden rounded-[26%_26%_22%_22%] bg-white/20 shadow-[inset_0_0_0_3px_rgba(255,255,255,.55),0_30px_50px_-20px_rgba(42,14,28,.7)]">
            <div className="absolute inset-x-0 bottom-0 h-[78%] overflow-hidden bg-gradient-to-b from-[#D24C88] to-berry">
              <span className="absolute left-1/2 top-0 aspect-square w-[260%] -translate-x-1/2 -translate-y-[97%] animate-wave rounded-[42%] bg-white/20" />
              <span className="absolute left-1/2 top-0 aspect-square w-[260%] -translate-x-1/2 -translate-y-[98.5%] animate-wave-slow rounded-[40%] bg-[#D24C88] opacity-90" />
            </div>
            <span className="absolute left-[12%] top-[10%] h-[60%] w-[10%] rounded-[20px] bg-gradient-to-b from-white/80 to-white/0" />
            <div className="absolute inset-x-[14%] top-[42%] rounded-lg bg-white px-1.5 py-2 text-center leading-[1.05] text-berry shadow-[0_4px_12px_rgba(0,0,0,.15)]">
              <small className="block text-[.5rem] uppercase tracking-[0.2em] text-ink-soft">Studio</small>
              <b className="block font-display text-[clamp(.9rem,4vw,1.15rem)] font-black tracking-[-0.04em]">Nº 72</b>
              <small className="block text-[.5rem] uppercase tracking-[0.2em] text-ink-soft">Raspberry</small>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Selo giratório da nota */}
      <motion.div
        className="absolute right-0 top-[4%] aspect-square w-[42%]"
        initial={{ opacity: 0, y: 18, filter: "blur(6px)" }}
        animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
        transition={{ duration: 1, delay: 1.2, ease: EASE_OUT }}
        whileHover={{ scale: 1.08 }}
      >
        <svg className="h-full w-full animate-spin-slow" viewBox="0 0 120 120">
          <defs>
            <path id="circ1" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
          </defs>
          <text className="fill-white font-display text-[10.5px] font-extrabold uppercase tracking-[2.6px]">
            <textPath href="#circ1">Nota no Google · {ratingCount} avaliações · </textPath>
          </text>
        </svg>
        <div className="absolute inset-[24%] grid place-items-center rounded-full bg-gold text-center leading-none text-cap shadow-[0_10px_24px_-10px_rgba(0,0,0,.5)]">
          <div>
            <b className="font-display text-[clamp(1.1rem,5vw,1.5rem)] font-black tracking-[-0.04em]">5,0</b>
            <small className="block text-[.55rem] font-bold uppercase tracking-[0.12em]">★★★★★</small>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
