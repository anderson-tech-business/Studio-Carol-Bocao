"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  animate,
  AnimatePresence,
  motion,
  MotionConfig,
  useInView,
  useReducedMotion,
  useScroll,
  useSpring,
  type Variants,
} from "motion/react";

/** Curvas do design system (mesmas do tailwind.config: out-expo, io, spring). */
export const EASE_OUT = [0.16, 1, 0.3, 1] as const;
export const EASE_IO = [0.65, 0, 0.35, 1] as const;

/** Raiz de movimento da landing: respeita prefers-reduced-motion em todos os filhos. */
export function MotionRoot({ children }: { children: ReactNode }) {
  return <MotionConfig reducedMotion="user">{children}</MotionConfig>;
}

const reveal: Record<"up" | "tilt", Variants> = {
  up: {
    hidden: { opacity: 0, y: 32 },
    show: { opacity: 1, y: 0, transition: { duration: 0.8, ease: EASE_OUT } },
  },
  tilt: {
    hidden: { opacity: 0, rotateX: 14, y: 36, transformPerspective: 800 },
    show: { opacity: 1, rotateX: 0, y: 0, transformPerspective: 800, transition: { duration: 0.9, ease: EASE_OUT } },
  },
};

/** Revela o bloco quando entra na tela (uma vez). */
export function Reveal({
  children,
  kind = "up",
  delay = 0,
  className,
  as = "div",
}: {
  children: ReactNode;
  kind?: "up" | "tilt";
  delay?: number;
  className?: string;
  as?: "div" | "article";
}) {
  const Tag = as === "article" ? motion.article : motion.div;
  return (
    <Tag
      className={className}
      variants={reveal[kind]}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -6% 0px" }}
      transition={{ delay }}
    >
      {children}
    </Tag>
  );
}

/** Barra de progresso da rolagem ("pincelada" no topo). */
export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 160, damping: 30, restDelta: 0.001 });
  return (
    <motion.div
      aria-hidden="true"
      style={{ scaleX }}
      className="pointer-events-none fixed inset-x-0 top-[env(safe-area-inset-top)] z-[95] h-1 origin-left rounded-r bg-gradient-to-r from-berry via-raspberry to-gold"
    />
  );
}

/** Número que conta de 0 até `to` quando aparece na tela. */
export function CountUp({ to, className }: { to: number; className?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.6 });
  const reduce = useReducedMotion();

  useEffect(() => {
    const el = ref.current;
    if (!el || !inView || reduce) return;
    const controls = animate(0, to, {
      duration: 1,
      ease: EASE_OUT,
      onUpdate: (v) => (el.textContent = String(Math.round(v))),
    });
    return () => controls.stop();
  }, [inView, reduce, to]);

  return (
    <span ref={ref} className={className}>
      {to}
    </span>
  );
}

type Spark = { id: number; x: number; y: number; dx: number; dy: number; r: number; c: string };
const SPARK_COLORS = ["#B0306A", "#F6D6E4", "#C9A25B", "#7A1F4B"];

/** Faíscas de esmalte a cada toque/clique (substitui o canvas antigo). */
export function SparkleLayer() {
  const [sparks, setSparks] = useState<Spark[]>([]);
  const reduce = useReducedMotion();
  const seq = useRef(0);

  useEffect(() => {
    if (reduce) return;
    const onDown = (e: PointerEvent) => {
      const burst = Array.from({ length: 12 }, (_, i) => {
        const a = (i / 12) * Math.PI * 2 + Math.random() * 0.5;
        const d = 30 + Math.random() * 46;
        return {
          id: seq.current++,
          x: e.clientX,
          y: e.clientY,
          dx: Math.cos(a) * d,
          dy: Math.sin(a) * d + 18,
          r: 6 + Math.random() * 6,
          c: SPARK_COLORS[i % SPARK_COLORS.length],
        };
      });
      setSparks((s) => [...s, ...burst]);
    };
    window.addEventListener("pointerdown", onDown);
    return () => window.removeEventListener("pointerdown", onDown);
  }, [reduce]);

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[99] overflow-hidden">
      <AnimatePresence>
        {sparks.map((s) => (
          <motion.svg
            key={s.id}
            viewBox="0 0 10 10"
            width={s.r}
            height={s.r}
            className="absolute -translate-x-1/2 -translate-y-1/2"
            style={{ left: s.x, top: s.y, color: s.c }}
            initial={{ x: 0, y: 0, scale: 1, rotate: 0, opacity: 1 }}
            animate={{ x: s.dx, y: s.dy, scale: 0.2, rotate: 180, opacity: 0 }}
            transition={{ duration: 0.8, ease: EASE_OUT }}
            onAnimationComplete={() => setSparks((all) => all.filter((p) => p.id !== s.id))}
          >
            <path d="M5 0 6.2 3.8 10 5 6.2 6.2 5 10 3.8 6.2 0 5 3.8 3.8z" fill="currentColor" />
          </motion.svg>
        ))}
      </AnimatePresence>
    </div>
  );
}
