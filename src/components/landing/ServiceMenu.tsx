"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties, type KeyboardEvent } from "react";
import { ArrowRight, Clock } from "lucide-react";
import { categories, services, type CategoryId } from "@/data/mock";
import { brl, formatDuration } from "@/lib/format";

const TAB_KEY = "scb-tab";

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
  const list = services.filter((s) => s.category === active);

  return (
    <>
      <div className="bottles" role="tablist" aria-label="Categorias de serviço" onKeyDown={onKey}>
        {categories.map((cat) => (
          <button
            key={cat.id}
            ref={(el) => {
              tabRefs.current[cat.id] = el;
            }}
            className="btab"
            role="tab"
            id={`tab-${cat.id}`}
            aria-selected={cat.id === active}
            aria-controls="painel-servicos"
            tabIndex={cat.id === active ? 0 : -1}
            onClick={() => select(cat.id)}
            style={{ "--c": cat.color } as CSSProperties}
          >
            <span className="mini" aria-hidden="true">
              <span className="mc" />
              <span className="mg">
                <span className="ml" />
              </span>
            </span>
            <span>{cat.label}</span>
          </button>
        ))}
      </div>
      <div className="menu">
        <div className="ghost-word" key={`g-${active}`} aria-hidden="true">
          {current.label}
        </div>
        <div className="rows" id="painel-servicos" role="tabpanel" aria-labelledby={`tab-${active}`} key={active}>
          {list.map((s, i) => (
            <article className="row" key={s.slug} style={{ "--i": i } as CSSProperties}>
              <div className="r-main">
                <h3>{s.name}</h3>
                <span className="leader" aria-hidden="true" />
                <span className="r-price">{brl(s.price)}</span>
              </div>
              <div className="r-sub">
                <span className="r-time">
                  <Clock />
                  {formatDuration(s.duration)}
                </span>
                <span className="r-desc">{s.description}</span>
                <Link href={`/agendar?servico=${s.slug}`} className="r-book" aria-label={`Agendar ${s.name}`}>
                  Agendar <ArrowRight />
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </>
  );
}
