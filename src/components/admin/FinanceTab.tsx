"use client";

import { useMemo, useState } from "react";
import { Gem, Info, Plus, Receipt, Scissors, TrendingUp, Trash2, Wallet } from "lucide-react";
import {
  categoryFinance,
  currentMonthTransactions,
  lastMonths,
  saleOptions,
  type FinanceLine,
} from "@/data/admin-mock";
import { FieldLabel, Modal, money } from "./ui";

export interface Sale {
  id: string;
  optionId: string;
  label: string;
  line: FinanceLine;
  price: number;
  at: string;
}

const MONTHS = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

export function FinanceTab({
  sales,
  setSales,
  notify,
  monthIndex,
}: {
  sales: Sale[];
  setSales: (fn: (s: Sale[]) => Sale[]) => void;
  notify: (msg: string) => void;
  /** Mês atual (0–11) no fuso do studio. */
  monthIndex: number;
}) {
  const [open, setOpen] = useState(false);
  const [pulse, setPulse] = useState(0);

  const lines = useMemo(
    () =>
      categoryFinance.map((c) => {
        const extra = sales.filter((s) => s.line === c.line);
        const revenue = c.revenue + extra.reduce((t, s) => t + s.price, 0);
        const cost = c.cost + extra.reduce((t, s) => t + Math.round(s.price * c.costRate * 100) / 100, 0);
        return { ...c, revenue, cost, profit: revenue - cost, margin: revenue ? (revenue - cost) / revenue : 0 };
      }),
    [sales],
  );

  const revenue = lines.reduce((t, l) => t + l.revenue, 0);
  const cost = lines.reduce((t, l) => t + l.cost, 0);
  const profit = revenue - cost;
  const ticket = revenue / (currentMonthTransactions + sales.length);
  const prev = lastMonths[lastMonths.length - 2];
  const growth = (revenue - prev.revenue) / prev.revenue;

  const months = lastMonths.map((m, i) => {
    const isCurrent = i === lastMonths.length - 1;
    const idx = (monthIndex - (lastMonths.length - 1 - i) + 12) % 12;
    return { label: MONTHS[idx], revenue: isCurrent ? revenue : m.revenue, profit: isCurrent ? profit : m.profit, isCurrent };
  });
  const maxValue = Math.ceil(Math.max(...months.map((m) => m.revenue)) / 1000) * 1000;
  const ticks = [maxValue, maxValue * 0.75, maxValue * 0.5, maxValue * 0.25, 0];

  return (
    <section aria-labelledby="fin-titulo" className="animate-blur-in">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="fin-titulo" className="font-display text-2xl font-black text-ink">
            Financeiro &amp; Lucro
          </h2>
          <p className="text-base text-ink-soft">Mês atual · {MONTHS[monthIndex]}</p>
        </div>
        <button type="button" onClick={() => setOpen(true)} className="btn btn-fill min-h-12 !whitespace-normal text-center">
          <Plus aria-hidden="true" />
          Registrar Venda de Semijoia / Serviço
        </button>
      </div>

      {/* KPIs */}
      <div className="mb-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
        <Kpi icon={Wallet} label="Faturamento Bruto" value={money(revenue)} note={`${growth >= 0 ? "+" : ""}${(growth * 100).toFixed(1).replace(".", ",")}% vs. mês anterior`} pulse={pulse} />
        <Kpi icon={Receipt} label="Custos de Materiais/Produtos" value={money(cost)} note={`${((cost / revenue) * 100).toFixed(0)}% do faturamento`} pulse={pulse} />
        <Kpi icon={TrendingUp} label="Lucro Líquido Real" value={money(profit)} note={`Margem de ${((profit / revenue) * 100).toFixed(0)}%`} highlight pulse={pulse} />
        <Kpi icon={Scissors} label="Ticket Médio" value={money(ticket)} note={`${currentMonthTransactions + sales.length} atendimentos`} pulse={pulse} />
      </div>

      {/* Gráfico */}
      <div className="mb-6 rounded-3xl bg-white p-5 ring-1 ring-line">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
          <h3 className="font-display text-lg font-extrabold text-ink">Faturamento vs. Lucro · últimos 4 meses</h3>
          <div className="flex gap-4 text-sm font-medium text-ink">
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-raspberry" aria-hidden="true" />
              Faturamento
            </span>
            <span className="inline-flex items-center gap-1.5">
              <span className="h-3 w-3 rounded-sm bg-gold-ink" aria-hidden="true" />
              Lucro
            </span>
          </div>
        </div>
        <div className="grid grid-cols-[44px_1fr] gap-2">
          <div className="relative h-56" aria-hidden="true">
            {ticks.map((t, i) => (
              <span key={t} className="absolute right-0 -translate-y-1/2 text-xs tabular-nums text-ink-soft" style={{ top: `${(i / (ticks.length - 1)) * 100}%` }}>
                {t >= 1000 ? `${(t / 1000).toLocaleString("pt-BR")}k` : t}
              </span>
            ))}
          </div>
          <div>
            <div className="relative h-56">
              {ticks.map((t, i) => (
                <span key={t} className="absolute inset-x-0 border-t border-dashed border-line" style={{ top: `${(i / (ticks.length - 1)) * 100}%` }} aria-hidden="true" />
              ))}
              <ul className="relative flex h-full items-end justify-around gap-2" aria-label="Faturamento e lucro por mês">
                {months.map((m, i) => (
                  <li key={m.label} className="flex h-full flex-1 items-end justify-center gap-1.5" aria-label={`${m.label}: faturamento ${money(m.revenue)}, lucro ${money(m.profit)}`}>
                    <Bar value={m.revenue} max={maxValue} cls="bg-raspberry" delay={i * 90} current={m.isCurrent} />
                    <Bar value={m.profit} max={maxValue} cls="bg-gold-ink" delay={i * 90 + 60} current={m.isCurrent} />
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-2 flex justify-around">
              {months.map((m) => (
                <span key={m.label} className={`flex-1 text-center text-sm font-bold uppercase ${m.isCurrent ? "text-raspberry" : "text-ink-soft"}`}>
                  {m.label}
                  {m.isCurrent ? " (atual)" : ""}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Margem por categoria */}
      <div className="mb-6 rounded-3xl bg-white p-5 ring-1 ring-line">
        <h3 className="font-display text-lg font-extrabold text-ink">Margem por Categoria</h3>
        <p className="mb-4 text-[.95rem] text-ink-soft">Quanto sobra de cada linha de negócio no fim do mês, depois de pagar material e produto.</p>

        <div className="mb-4 grid gap-3 sm:grid-cols-2">
          {lines.map((l) => (
            <div key={l.line} className={`rounded-2xl p-4 ${l.line === "servicos" ? "bg-gradient-to-br from-raspberry to-berry text-white" : "bg-blush-soft text-ink ring-1 ring-line-strong"}`}>
              <div className="flex items-center gap-2 font-display font-extrabold">
                {l.line === "servicos" ? <Scissors className="h-5 w-5" aria-hidden="true" /> : <Gem className="h-5 w-5" aria-hidden="true" />}
                {l.label}
              </div>
              <p className="mt-2 font-display text-4xl font-black tabular-nums">{(l.margin * 100).toFixed(0)}%</p>
              <p className={`text-[.95rem] ${l.line === "servicos" ? "text-white" : "text-ink-soft"}`}>
                A cada R$ 100 vendidos, sobram <b>{money(l.margin * 100)}</b>.
              </p>
              <div className={`mt-3 h-3 overflow-hidden rounded-full ${l.line === "servicos" ? "bg-white/25" : "bg-white"}`} aria-hidden="true">
                <div className={`h-full rounded-full transition-[width] duration-700 ${l.line === "servicos" ? "bg-white" : "bg-gold-ink"}`} style={{ width: `${l.margin * 100}%` }} />
              </div>
            </div>
          ))}
        </div>

        <div className="-mx-5 overflow-x-auto px-5">
          <table className="w-full min-w-[520px] border-collapse text-left text-[.95rem]">
            <caption className="sr-only">Margem por categoria no mês atual</caption>
            <thead>
              <tr className="border-b-2 border-ink text-xs uppercase tracking-wide text-ink-soft">
                <th scope="col" className="py-2 pr-3 font-bold">Linha</th>
                <th scope="col" className="py-2 pr-3 text-right font-bold">Faturamento</th>
                <th scope="col" className="py-2 pr-3 text-right font-bold">Custo</th>
                <th scope="col" className="py-2 pr-3 text-right font-bold">Sobra (lucro)</th>
                <th scope="col" className="py-2 text-right font-bold">Margem</th>
              </tr>
            </thead>
            <tbody className="tabular-nums [&_td]:whitespace-nowrap">
              {lines.map((l) => (
                <tr key={l.line} className="border-b border-line">
                  <th scope="row" className="py-3 pr-3 font-display font-bold text-ink">
                    {l.label}
                    <span className="block text-sm font-normal text-ink-soft">{l.detail}</span>
                  </th>
                  <td className="py-3 pr-3 text-right">{money(l.revenue)}</td>
                  <td className="py-3 pr-3 text-right text-ink-soft">− {money(l.cost)}</td>
                  <td className="py-3 pr-3 text-right font-bold text-wa-ink">{money(l.profit)}</td>
                  <td className="py-3 text-right font-display font-black text-raspberry">{(l.margin * 100).toFixed(0)}%</td>
                </tr>
              ))}
              <tr>
                <th scope="row" className="py-3 pr-3 font-display font-black text-ink">Total do mês</th>
                <td className="py-3 pr-3 text-right font-bold">{money(revenue)}</td>
                <td className="py-3 pr-3 text-right font-bold text-ink-soft">− {money(cost)}</td>
                <td className="py-3 pr-3 text-right font-black text-wa-ink">{money(profit)}</td>
                <td className="py-3 text-right font-display font-black text-raspberry">{((profit / revenue) * 100).toFixed(0)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <p className="mt-3 flex items-start gap-2 text-[.92rem] text-ink-soft">
          <Info className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
          Serviços têm margem alta porque o custo é só material (esmalte, gel, cílios). Na revenda, a maior parte do preço paga a própria peça.
        </p>
      </div>

      {sales.length > 0 && (
        <div className="rounded-3xl bg-white p-5 ring-1 ring-line">
          <h3 className="mb-2 font-display text-lg font-extrabold text-ink">Vendas registradas agora</h3>
          <ul className="divide-y divide-line">
            {[...sales].reverse().map((s) => (
              <li key={s.id} className="flex items-center justify-between gap-3 py-2.5 animate-blur-in">
                <span className="min-w-0">
                  <b className="block text-ink">{s.label}</b>
                  <span className="text-sm text-ink-soft">{s.at}</span>
                </span>
                <span className="flex items-center gap-2">
                  <b className="font-display tabular-nums text-raspberry">+ {money(s.price)}</b>
                  <button
                    type="button"
                    aria-label={`Remover venda ${s.label}`}
                    onClick={() => {
                      setSales((list) => list.filter((x) => x.id !== s.id));
                      setPulse((p) => p + 1);
                    }}
                    className="grid h-11 w-11 place-items-center rounded-full text-ink-soft hover:bg-blush-soft"
                  >
                    <Trash2 className="h-4 w-4" aria-hidden="true" />
                  </button>
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}

      <SaleModal
        open={open}
        onClose={() => setOpen(false)}
        onSave={(sale) => {
          setSales((list) => [...list, sale]);
          setPulse((p) => p + 1);
          setOpen(false);
          notify(`Venda de ${money(sale.price)} registrada. Faturamento atualizado.`);
        }}
      />
    </section>
  );
}

function Kpi({
  icon: Icon,
  label,
  value,
  note,
  highlight = false,
  pulse,
}: {
  icon: typeof Wallet;
  label: string;
  value: string;
  note: string;
  highlight?: boolean;
  pulse: number;
}) {
  return (
    <div className={`rounded-3xl p-4 ${highlight ? "bg-wa-ink text-white shadow-[0_18px_30px_-20px_rgba(15,107,61,.9)]" : "bg-white text-ink ring-1 ring-line"}`}>
      <div className={`mb-2 grid h-10 w-10 place-items-center rounded-xl ${highlight ? "bg-white/15" : "bg-blush-soft text-raspberry"}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <p className={`text-sm font-bold leading-tight ${highlight ? "text-white" : "text-ink-soft"}`}>{label}</p>
      <p key={pulse} className="mt-1 animate-pop font-display text-[1.35rem] font-black leading-tight tabular-nums sm:text-2xl">
        {value}
      </p>
      <p className={`mt-1 text-sm ${highlight ? "text-white" : "text-ink-soft"}`}>{note}</p>
    </div>
  );
}

function Bar({ value, max, cls, delay, current }: { value: number; max: number; cls: string; delay: number; current: boolean }) {
  const h = Math.max(2, (value / max) * 100);
  return (
    <div className="group relative flex h-full w-full max-w-[34px] items-end">
      <div
        className={`bar-grow relative w-full rounded-t-lg transition-[height] duration-700 ease-out-expo ${cls} ${current ? "" : "opacity-80"}`}
        style={{ height: `${h}%`, animationDelay: `${delay}ms` }}
      >
        <span className="pointer-events-none absolute -top-7 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-md bg-ink px-1.5 py-0.5 text-[.7rem] font-bold text-white opacity-0 transition group-hover:opacity-100">
          {money(value)}
        </span>
      </div>
    </div>
  );
}

function SaleModal({ open, onClose, onSave }: { open: boolean; onClose: () => void; onSave: (s: Sale) => void }) {
  const [optionId, setOptionId] = useState(saleOptions[0].id);
  const option = saleOptions.find((o) => o.id === optionId)!;
  const [price, setPrice] = useState(String(saleOptions[0].suggestedPrice));
  const value = Number(price.replace(",", "."));
  const valid = Number.isFinite(value) && value > 0 && value < 10000;
  const rate = categoryFinance.find((c) => c.line === option.line)!.costRate;

  return (
    <Modal open={open} title="Registrar venda" onClose={onClose}>
      <form
        noValidate
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          if (!valid) return;
          const now = new Date().toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit", timeZone: "America/Sao_Paulo" });
          onSave({ id: `s${Date.now()}`, optionId, label: option.label, line: option.line, price: Math.round(value * 100) / 100, at: `Hoje, ${now}` });
        }}
      >
        <div>
          <FieldLabel htmlFor="venda-item">O que foi vendido</FieldLabel>
          <select
            id="venda-item"
            className="input"
            value={optionId}
            onChange={(e) => {
              setOptionId(e.target.value);
              setPrice(String(saleOptions.find((o) => o.id === e.target.value)!.suggestedPrice));
            }}
          >
            {saleOptions.map((o) => (
              <option key={o.id} value={o.id}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <FieldLabel htmlFor="venda-valor">Valor recebido (R$)</FieldLabel>
          <input
            id="venda-valor"
            className="input tabular-nums"
            inputMode="decimal"
            value={price}
            onChange={(e) => setPrice(e.target.value.replace(/[^\d,.]/g, ""))}
            aria-invalid={!valid}
          />
          {!valid && (
            <p className="mt-1 text-[.92rem] font-medium text-[#A3123F]" role="alert">
              Digite um valor maior que zero.
            </p>
          )}
        </div>
        {valid && (
          <div className="rounded-2xl bg-blush-soft p-3 text-[.95rem] text-ink">
            Custo estimado: <b>{money(value * rate)}</b> · Sobra: <b className="text-wa-ink">{money(value * (1 - rate))}</b>
          </div>
        )}
        <button type="submit" className={`btn btn-fill min-h-12 w-full ${!valid ? "opacity-60" : ""}`}>
          <Plus aria-hidden="true" />
          Somar ao faturamento
        </button>
      </form>
    </Modal>
  );
}
