"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";
import { AnimatePresence, motion, type Variants } from "motion/react";
import { ArrowRight, Clock } from "lucide-react";
import { categories, services, type CategoryId } from "@/data/mock";
import { brl, formatDuration } from "@/lib/format";
import { EASE_OUT } from "./motion";

const TAB_KEY = "scb-tab";

const list: Variants = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
  exit: { opacity: 0, transition: { duration: 0.15 } },
};
const row: Variants = {
  hidden: { opacity: 0, y: 16, filter: "blur(4px)" },
  show: { opacity: 1, y: 0, filter: "blur(0px)", transition: { duration: 0.55, ease: EASE_OUT } },
};

export function ServiceMenu() {
  const [active, setActive] = useState<CategoryId>("unhas");
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem(TAB_KEY) as CategoryId | null;
      if (saved && categories.some((c) => c.id === saved)) setActive(saved);
    } catch {
      /* sem armazenamento */
    }
  }, []);

  const select = (id: CategoryId, focus = false) => {
    setActive(id);
    try {
      localStorage.setItem(TAB_KEY, id);
    } catch {
      /* noop */
    }
    if (focus) tabRefs.current[id]?.focus();
  };

  const onKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = categories.findIndex((c) => c.id === active);
    const next = categories[(i + (e.key === "ArrowRight" ? 1 : -1) + categories.length) % categories.length];
    select(next.id, true);
  };

  const current = categories.find((c) => c.id === active)!;
  const items = services.filter((s) => s.category === active);

  return (
    <>
      <div className="mb-4 grid grid-cols-4 gap-2" role="tablist" aria-label="Categorias de serviço" onKeyDown={onKey}>
        {categories.map((cat) => {
          const selected = cat.id === active;
          return (
            <button
              key={cat.id}
              ref={(el) => {
                tabRefs.current[cat.id] = el;
              }}
              className="group relative grid justify-items-center gap-2 rounded-2xl px-0.5 py-1.5"
              role="tab"
              id={`tab-${cat.id}`}
              aria-selected={selected}
              aria-controls="painel-servicos"
              tabIndex={selected ? 0 : -1}
              onClick={() => select(cat.id)}
            >
              {selected && (
                <motion.span
                  layoutId="service-tab"
                  className="absolute inset-0 -z-10 rounded-2xl bg-blush-soft"
                  transition={{ type: "spring", stiffness: 380, damping: 30 }}
                />
              )}
              {/* mini frasco: inclina e enche quando a aba está ativa */}
              <motion.span
                aria-hidden="true"
                className="relative block h-[58px] w-10"
                animate={selected ? { y: -6, rotate: -8 } : { y: 0, rotate: 0 }}
                transition={{ type: "spring", stiffness: 300, damping: 14 }}
              >
                <span className="absolute inset-0 group-hover:animate-wiggle">
                <span className="absolute left-3 top-0 h-[22px] w-4 rounded-t rounded-b-sm bg-cap" />
                <span className="absolute bottom-0 left-0 h-[38px] w-10 overflow-hidden rounded-xl bg-white shadow-[inset_0_0_0_2px_#9E5C7B]">
                  <motion.span
                    className="absolute inset-x-0 bottom-0 h-full origin-bottom"
                    style={{ background: cat.color }}
                    initial={false}
                    animate={{ scaleY: selected ? 1 : 0.4 }}
                    transition={{ duration: 0.6, ease: EASE_OUT }}
                  />
                  <span className="absolute left-1.5 top-[5px] h-[18px] w-[5px] rounded bg-white/70" />
                </span>
                </span>
              </motion.span>
              <span className={`font-display text-[.95rem] font-bold transition-colors ${selected ? "text-berry" : "text-ink"}`}>{cat.label}</span>
            </button>
          );
        })}
      </div>

      <div className="relative isolate">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={`g-${active}`}
            aria-hidden="true"
            className="pointer-events-none absolute -right-1.5 -top-[60px] -z-10 hidden whitespace-nowrap font-display text-[clamp(4.5rem,24vw,10rem)] font-black leading-none tracking-[-0.06em] text-transparent [-webkit-text-stroke:1.5px_#EFD3DF] md:block"
            initial={{ x: 40, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: -40, opacity: 0 }}
            transition={{ duration: 0.7, ease: EASE_OUT }}
          >
            {current.label}
          </motion.div>
        </AnimatePresence>

        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={active}
            id="painel-servicos"
            role="tabpanel"
            aria-labelledby={`tab-${active}`}
            className="grid border-t-2 border-ink md:gap-x-10"
            variants={list}
            initial="hidden"
            animate="show"
            exit="exit"
          >
            {items.map((s) => (
              <motion.article
                key={s.slug}
                variants={row}
                className="group relative isolate grid gap-1.5 border-b border-line-strong px-1 py-[18px] before:absolute before:inset-y-0 before:-inset-x-2 before:-z-10 before:origin-left before:scale-x-0 before:rounded-[14px] before:bg-raspberry before:transition-transform before:duration-[600ms] before:ease-out-expo before:content-[''] focus-within:text-white focus-within:before:scale-x-100 hover:text-white hover:before:scale-x-100"
              >
                <div className="flex items-baseline gap-2.5">
                  <h3 className="min-w-0 font-display text-[1.15rem] font-bold leading-[1.05] tracking-[-0.02em]">{s.name}</h3>
                  <span
                    aria-hidden="true"
                    className="min-w-5 flex-1 -translate-y-1 border-b-2 border-dotted border-line-strong transition-colors group-focus-within:border-white/50 group-hover:border-white/50"
                  />
                  <span className="whitespace-nowrap font-display text-[1.3rem] font-black tabular-nums text-raspberry transition-colors group-focus-within:text-white group-hover:text-white">
                    {brl(s.price)}
                  </span>
                </div>
                <div className="grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-2">
                  <span className="col-span-full row-start-1 min-w-0 text-[.95rem] text-ink-soft transition-colors group-focus-within:text-white group-hover:text-white">
                    {s.description}
                  </span>
                  <span className="inline-flex items-center gap-[5px] text-[.92rem] font-bold text-berry transition-colors group-focus-within:text-white group-hover:text-white">
                    <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                    {formatDuration(s.duration)}
                  </span>
                  <Link
                    href={`/agendar?servico=${s.slug}`}
                    aria-label={`Agendar ${s.name}`}
                    className="group/book inline-flex min-h-11 items-center gap-1.5 justify-self-end rounded-full bg-blush-soft px-4 py-2 font-display text-[.92rem] font-bold text-berry transition-colors group-focus-within:bg-white group-focus-within:text-raspberry group-hover:bg-white group-hover:text-raspberry"
                  >
                    Agendar
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 ease-spring group-hover/book:translate-x-1" aria-hidden="true" />
                  </Link>
                </div>
              </motion.article>
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </>
  );
}
