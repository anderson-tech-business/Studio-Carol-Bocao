"use client";

import { useState } from "react";
import { motion, useMotionValue, useTransform, type PanInfo } from "motion/react";
import { RotateCw, Star } from "lucide-react";
import { reviews, studio } from "@/data/mock";
import { EASE_IO, Reveal } from "./motion";
import { Kicker } from "./ui";

const STACK = [
  { x: 0, y: 0, rotate: -1.5, z: 3, bg: "bg-white" },
  { x: 10, y: 10, rotate: 3, z: 2, bg: "bg-blush-soft" },
  { x: 18, y: 18, rotate: 6, z: 1, bg: "bg-blush" },
];

function Stars() {
  const five = Array.from({ length: 5 }, (_, k) => <Star key={k} className="h-6 w-6" fill="currentColor" strokeWidth={0} />);
  return (
    <span className="relative inline-flex gap-[3px] text-line-strong" aria-label="5 de 5 estrelas">
      {five}
      <motion.span
        aria-hidden="true"
        className="absolute inset-0 inline-flex gap-[3px] text-gold-ink"
        initial={{ clipPath: "inset(0 100% 0 0)" }}
        whileInView={{ clipPath: "inset(0 0% 0 0)" }}
        viewport={{ once: true }}
        transition={{ duration: 1.4, delay: 0.2, ease: EASE_IO }}
      >
        {Array.from({ length: 5 }, (_, k) => (
          <Star key={k} className="h-6 w-6" fill="currentColor" strokeWidth={0} />
        ))}
      </motion.span>
    </span>
  );
}

function ReviewCard({
  review,
  pos,
  flyingDir,
  onThrow,
  onFlown,
}: {
  review: (typeof reviews)[number];
  pos: number;
  flyingDir: number | null;
  onThrow: (dir: number) => void;
  onFlown: () => void;
}) {
  const x = useMotionValue(0);
  const rotate = useTransform(x, (v) => v / 14);
  const top = pos === 0;
  const slot = STACK[Math.min(pos, STACK.length - 1)];

  const onDragEnd = (_: unknown, info: PanInfo) => {
    if (Math.abs(info.offset.x) > 70 || Math.abs(info.velocity.x) > 500) onThrow(Math.sign(info.offset.x || info.velocity.x));
  };

  return (
    <motion.figure
      className="m-0 [grid-area:1/1]"
      style={{ zIndex: slot.z }}
      initial={false}
      animate={
        flyingDir !== null
          ? { x: `${flyingDir * 120}%`, y: 0, rotate: flyingDir * 18, opacity: 0 }
          : { x: slot.x, y: slot.y, rotate: slot.rotate, opacity: 1 }
      }
      transition={flyingDir !== null ? { duration: 0.28, ease: "easeIn" } : { type: "spring", stiffness: 260, damping: 20 }}
      onAnimationComplete={() => flyingDir !== null && onFlown()}
      aria-hidden={!top}
    >
      <motion.div
        drag={top ? "x" : false}
        dragSnapToOrigin
        dragElastic={0.6}
        onDragEnd={onDragEnd}
        onTap={() => top && onThrow(1)}
        whileDrag={{ scale: 1.03 }}
        style={{ x, rotate }}
        className={`grid cursor-grab touch-pan-y select-none content-start gap-3.5 rounded-3xl border-2 border-line-strong p-[22px] shadow-[0_22px_40px_-28px_rgba(122,31,75,.75)] active:cursor-grabbing ${slot.bg}`}
      >
        <div className={`grid gap-3.5 transition-opacity duration-300 ${top ? "opacity-100" : "opacity-35"}`}>
          <div className="flex items-center gap-2.5">
            <span className="grid h-[42px] w-[42px] flex-none place-items-center rounded-full font-display font-extrabold text-white" style={{ background: review.color }}>
              {review.name[0]}
            </span>
            <div className="grid leading-tight">
              <b>{review.name}</b>
              <small className="text-[.88rem] text-ink-soft">{review.when} · Google</small>
            </div>
            <span className="ml-auto flex gap-px text-gold-ink" aria-label="5 estrelas">
              {Array.from({ length: 5 }, (_, k) => (
                <Star key={k} className="h-[13px] w-[13px]" fill="currentColor" strokeWidth={0} />
              ))}
            </span>
          </div>
          <blockquote className="m-0 text-[1.08rem] leading-normal text-ink before:mb-1.5 before:block before:font-display before:text-5xl before:font-black before:leading-[.6] before:text-raspberry before:content-['“']">
            {review.text}
          </blockquote>
        </div>
      </motion.div>
    </motion.figure>
  );
}

function ReviewDeck() {
  const [order, setOrder] = useState(() => reviews.map((_, i) => i));
  const [flying, setFlying] = useState<{ index: number; dir: number } | null>(null);

  const cycle = (dir = 1) => {
    if (!flying) setFlying({ index: order[0], dir });
  };
  const settle = () => {
    setOrder((o) => [...o.slice(1), o[0]]);
    setFlying(null);
  };

  return (
    <Reveal kind="tilt" className="grid justify-items-start gap-4">
      <div className="mb-[22px] grid w-[calc(100%-20px)] max-w-[500px]" aria-live="polite">
        {reviews.map((r, i) => (
          <ReviewCard
            key={r.name}
            review={r}
            pos={order.indexOf(i)}
            flyingDir={flying?.index === i ? flying.dir : null}
            onThrow={cycle}
            onFlown={settle}
          />
        ))}
      </div>
      <div className="flex items-center gap-3">
        <motion.button
          type="button"
          onClick={() => cycle(1)}
          aria-label="Ver próxima avaliação"
          className="grid h-[46px] w-[46px] flex-none place-items-center rounded-full bg-ink text-white"
          whileHover={{ rotate: -20, scale: 1.08 }}
          whileTap={{ rotate: -200, scale: 0.92 }}
          transition={{ type: "spring", stiffness: 400, damping: 15 }}
        >
          <RotateCw className="h-5 w-5" aria-hidden="true" />
        </motion.button>
        <small className="text-[.92rem] text-ink-soft">Arraste o cartão para o lado ou toque para ver a próxima</small>
      </div>
    </Reveal>
  );
}

export function ReviewsBlock() {
  return (
    <div className="md:grid md:grid-cols-[.9fr_1.1fr] md:items-center md:gap-10">
      <Reveal>
        <Kicker>Quem já veio</Kicker>
        <div className="mb-[18px] mt-3.5 flex flex-wrap items-end gap-x-[18px] gap-y-1.5">
          <div className="font-display text-[clamp(5rem,26vw,9rem)] font-black leading-[.82] tracking-[-0.07em] text-raspberry">5,0</div>
          <div className="grid gap-1.5 pb-1.5">
            <Stars />
            <span className="text-ink-soft">
              Nota no Google com <b className="text-ink">{studio.rating.count} avaliações</b>
            </span>
          </div>
        </div>
      </Reveal>
      <ReviewDeck />
    </div>
  );
}
