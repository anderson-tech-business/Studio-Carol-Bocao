import type { ReactNode } from "react";
import { Reveal } from "./motion";

/** Rótulo pequeno em caixa alta com traço antes (padrão das seções da landing). */
export function Kicker({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <span
      className={`inline-flex items-center gap-2 text-[.82rem] font-bold uppercase tracking-[0.16em] text-berry before:h-0.5 before:w-[22px] before:rounded-sm before:bg-current before:content-[''] ${className}`}
    >
      {children}
    </span>
  );
}

/** Título de seção: <em> vira o destaque em itálico framboesa. */
export function H2({ children, className = "" }: { children: ReactNode; className?: string }) {
  return (
    <h2
      className={`font-display text-[clamp(2rem,9vw,3.6rem)] font-black leading-[1.05] tracking-[-0.03em] [text-wrap:balance] [&_em]:italic [&_em]:text-raspberry ${className}`}
    >
      {children}
    </h2>
  );
}

export function SectionHead({ kicker, title, lead }: { kicker: string; title: ReactNode; lead?: ReactNode }) {
  return (
    <Reveal className="mb-[22px] grid gap-2.5">
      <Kicker>{kicker}</Kicker>
      <H2>{title}</H2>
      {lead && <p className="max-w-[46ch] text-ink-soft">{lead}</p>}
    </Reveal>
  );
}

/** Seção padrão da landing (respiro vertical + largura máxima). */
export function Section({ id, children, className = "", innerClassName = "" }: { id: string; children: ReactNode; className?: string; innerClassName?: string }) {
  return (
    <section id={id} className={`overflow-x-clip py-11 md:py-16 ${className}`}>
      <div className={`mx-auto max-w-[1120px] px-4 ${innerClassName}`}>{children}</div>
    </section>
  );
}
