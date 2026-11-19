"use client";

import { Clock, Flame, RotateCcw, Tag } from "lucide-react";
import { bookables, categories, findBookable } from "@/data/mock";
import { formatDuration } from "@/lib/format";
import { Switch, money } from "./ui";
import type { ServiceOverrides } from "./AdminApp";

export function ServicesTab({
  overrides,
  setOverrides,
  notify,
}: {
  overrides: ServiceOverrides;
  setOverrides: (fn: (o: ServiceOverrides) => ServiceOverrides) => void;
  notify: (msg: string) => void;
}) {
  const groups = [
    { id: "combo", label: "Combos", items: bookables.filter((b) => b.kind === "combo") },
    ...categories.map((c) => ({ id: c.id, label: c.label, items: bookables.filter((b) => b.category === c.id) })),
  ];
  const activeCount = bookables.filter((b) => overrides[b.slug]?.active !== false).length;

  const patch = (slug: string, p: Partial<ServiceOverrides[string]>) =>
    setOverrides((o) => ({ ...o, [slug]: { ...o[slug], ...p } }));

  return (
    <section aria-labelledby="serv-titulo" className="animate-blur-in">
      <div className="mb-4">
        <h2 id="serv-titulo" className="font-display text-2xl font-black text-ink">
          Serviços &amp; Combos
        </h2>
        <p className="text-base text-ink-soft">
          {activeCount} de {bookables.length} ativos. Pause um serviço ou mude o preço para criar uma promoção na hora.
        </p>
      </div>

      <div className="grid gap-6">
        {groups.map((g) => (
          <div key={g.id}>
            <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-[.14em] text-berry">{g.label}</h3>
            <ul className="grid gap-2">
              {g.items.map((b) => {
                const ov = overrides[b.slug] ?? { active: true, price: b.price };
                const original = findBookable(b.slug)!.price;
                const discount = ov.price < original ? Math.round((1 - ov.price / original) * 100) : 0;
                const changed = ov.price !== original || !ov.active;
                const isCombo = b.kind === "combo";
                return (
                  <li
                    key={b.slug}
                    className={`grid grid-cols-[1fr_auto] items-center gap-x-3 gap-y-3 rounded-2xl p-4 ring-1 transition sm:grid-cols-[1fr_auto_auto] ${
                      ov.active ? "bg-white ring-line" : "bg-[#F6F2F4] ring-[#D9CCD3]"
                    } ${isCombo && ov.active ? "ring-2 ring-raspberry" : ""}`}
                  >
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <b className={`font-display text-[1.05rem] font-extrabold leading-tight ${ov.active ? "text-ink" : "text-ink-soft"}`}>{b.name}</b>
                        {isCombo && (
                          <span className="inline-flex items-center gap-1 rounded-full bg-raspberry px-2 py-0.5 text-xs font-bold uppercase text-white">
                            <Flame className="h-3 w-3" aria-hidden="true" />
                            Mais Pedido
                          </span>
                        )}
                        {discount > 0 && ov.active && (
                          <span className="inline-flex animate-pop items-center gap-1 rounded-full bg-gold-ink px-2 py-0.5 text-xs font-bold uppercase text-white">
                            <Tag className="h-3 w-3" aria-hidden="true" />
                            Promoção −{discount}%
                          </span>
                        )}
                      </div>
                      <p className="mt-1 flex flex-wrap items-center gap-x-3 text-[.92rem] text-ink-soft">
                        <span className="inline-flex items-center gap-1">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          {formatDuration(b.duration)}
                        </span>
                        {ov.price !== original && <span>Preço original: {money(original)}</span>}
                      </p>
                    </div>

                    <div className="col-start-1 row-start-2 flex items-center gap-2 sm:col-start-2 sm:row-start-1">
                      <label htmlFor={`preco-${b.slug}`} className="text-sm font-bold text-ink-soft">
                        R$
                      </label>
                      <input
                        id={`preco-${b.slug}`}
                        type="number"
                        inputMode="decimal"
                        min={0}
                        step={1}
                        value={Number.isFinite(ov.price) ? ov.price : ""}
                        onChange={(e) => patch(b.slug, { price: Math.max(0, Number(e.target.value)) })}
                        onBlur={(e) => {
                          const v = Number(e.target.value);
                          if (v !== original) notify(`${b.name}: novo preço ${money(v)}.`);
                        }}
                        aria-label={`Preço de ${b.name}`}
                        className="h-12 w-24 rounded-xl border-2 border-line-strong bg-white px-3 text-right font-display text-lg font-black tabular-nums text-ink focus:border-raspberry focus:outline-none focus:ring-4 focus:ring-raspberry/20"
                      />
                      {changed && (
                        <button
                          type="button"
                          onClick={() => {
                            patch(b.slug, { price: original, active: true });
                            notify(`${b.name} voltou ao original.`);
                          }}
                          aria-label={`Restaurar ${b.name}`}
                          className="grid h-11 w-11 place-items-center rounded-full text-berry hover:bg-blush-soft"
                        >
                          <RotateCcw className="h-4 w-4" aria-hidden="true" />
                        </button>
                      )}
                    </div>

                    <div className="col-start-2 row-span-1 row-start-1 flex flex-col items-center gap-1 sm:col-start-3">
                      <Switch
                        checked={ov.active}
                        label={`${b.name}: ${ov.active ? "ativo" : "pausado"}`}
                        onChange={(v) => {
                          patch(b.slug, { active: v });
                          notify(`${b.name} ${v ? "ativado" : "pausado"}.`);
                        }}
                      />
                      <span className={`text-xs font-bold ${ov.active ? "text-wa-ink" : "text-ink-soft"}`}>{ov.active ? "Ativo" : "Pausado"}</span>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>
    </section>
  );
}
