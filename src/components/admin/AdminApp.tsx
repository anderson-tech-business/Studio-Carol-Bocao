"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState, type KeyboardEvent } from "react";
import { CalendarDays, ExternalLink, LogOut, RefreshCw, Sparkles, Wallet } from "lucide-react";
import { PolishLogo } from "@/components/icons";
import { todayAppointments, type Appointment } from "@/data/admin-mock";
import { bookables } from "@/data/mock";
import { endSession, hasSession, startSession } from "@/lib/admin-auth";
import { formatLongDate } from "@/lib/format";
import { nowInStudio } from "@/lib/schedule";
import { AdminLogin } from "./AdminLogin";
import { AgendaTab } from "./AgendaTab";
import { FinanceTab, type Sale } from "./FinanceTab";
import { ServicesTab } from "./ServicesTab";
import { Toast, useStoredState } from "./ui";

export type ServiceOverrides = Record<string, { active: boolean; price: number }>;

const initialOverrides = (): ServiceOverrides =>
  Object.fromEntries(bookables.map((b) => [b.slug, { active: true, price: b.price }]));

const TABS = [
  { id: "agenda", label: "Agenda do Dia", icon: CalendarDays },
  { id: "financeiro", label: "Financeiro & Lucro", icon: Wallet },
  { id: "servicos", label: "Serviços & Combos", icon: Sparkles },
] as const;
type TabId = (typeof TABS)[number]["id"];

const KEYS = { appts: "scb-admin-agenda", sales: "scb-admin-vendas", services: "scb-admin-servicos", tab: "scb-admin-aba" };

function DemoBanner() {
  return (
    <div className="bg-cap px-4 py-2 text-center text-[.85rem] font-medium text-blush" role="note">
      <span className="font-bold text-white">Modo Demonstração</span> — Painel da Carol
    </div>
  );
}

export function AdminApp() {
  const [auth, setAuth] = useState<boolean | null>(null);
  useEffect(() => setAuth(hasSession()), []);

  if (auth === null) {
    return (
      <>
        <DemoBanner />
        <p className="px-4 py-16 text-center text-ink-soft">Carregando painel…</p>
      </>
    );
  }

  return (
    <>
      <DemoBanner />
      {auth ? (
        <Dashboard
          onLogout={() => {
            endSession();
            setAuth(false);
          }}
        />
      ) : (
        <AdminLogin
          onSuccess={() => {
            startSession();
            setAuth(true);
          }}
        />
      )}
    </>
  );
}

function Dashboard({ onLogout }: { onLogout: () => void }) {
  const [tab, setTab] = useStoredState<TabId>(KEYS.tab, "financeiro");
  const [appointments, setAppointments] = useStoredState<Appointment[]>(KEYS.appts, todayAppointments);
  const [sales, setSales] = useStoredState<Sale[]>(KEYS.sales, []);
  const [overrides, setOverrides] = useStoredState<ServiceOverrides>(KEYS.services, initialOverrides());
  const [toast, setToast] = useState("");
  const toastTimer = useRef(0);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [now] = useState(() => nowInStudio());

  const notify = useCallback((msg: string) => {
    setToast(msg);
    window.clearTimeout(toastTimer.current);
    toastTimer.current = window.setTimeout(() => setToast(""), 2600);
  }, []);

  const resetDemo = () => {
    setAppointments(todayAppointments);
    setSales([]);
    setOverrides(initialOverrides());
    notify("Dados da demonstração restaurados.");
  };

  const onTabKey = (e: KeyboardEvent) => {
    if (e.key !== "ArrowRight" && e.key !== "ArrowLeft") return;
    const i = TABS.findIndex((t) => t.id === tab);
    const next = TABS[(i + (e.key === "ArrowRight" ? 1 : -1) + TABS.length) % TABS.length];
    setTab(next.id);
    tabRefs.current[next.id]?.focus();
  };

  return (
    <div className="min-h-dvh bg-blush-soft font-body text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-2 px-4 py-3">
          <div className="flex items-center gap-3">
            <PolishLogo />
            <div className="leading-tight">
              <p className="font-display text-lg font-black text-berry">Olá, Carol</p>
              <p className="text-sm text-ink-soft">Painel do studio</p>
            </div>
          </div>
          <div className="flex items-center gap-1">
            <Link href="/" className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-berry hover:bg-blush-soft">
              <ExternalLink className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Ver site</span>
            </Link>
            <button type="button" onClick={resetDemo} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-berry hover:bg-blush-soft" aria-label="Restaurar dados da demonstração">
              <RefreshCw className="h-4 w-4" aria-hidden="true" />
              <span className="hidden sm:inline">Restaurar demo</span>
            </button>
            <button type="button" onClick={onLogout} className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 text-sm font-bold text-berry ring-2 ring-line-strong hover:bg-blush-soft">
              <LogOut className="h-4 w-4" aria-hidden="true" />
              Sair
            </button>
          </div>
        </div>

        <div className="mx-auto max-w-6xl px-4">
          <div role="tablist" aria-label="Seções do painel" onKeyDown={onTabKey} className="-mx-4 flex gap-1 overflow-x-auto px-4 [scrollbar-width:none]">
            {TABS.map((t) => {
              const selected = tab === t.id;
              return (
                <button
                  key={t.id}
                  ref={(el) => {
                    tabRefs.current[t.id] = el;
                  }}
                  role="tab"
                  id={`aba-${t.id}`}
                  aria-selected={selected}
                  aria-controls="painel-admin"
                  tabIndex={selected ? 0 : -1}
                  onClick={() => setTab(t.id)}
                  className={`relative inline-flex min-h-12 flex-none items-center gap-2 px-3 font-display text-[.95rem] font-bold transition ${
                    selected ? "text-raspberry" : "text-ink-soft hover:text-berry"
                  }`}
                >
                  <t.icon className="h-5 w-5" aria-hidden="true" />
                  {t.label}
                  <span
                    className={`absolute inset-x-2 bottom-0 h-1 rounded-t-full bg-raspberry transition-transform duration-300 ease-spring ${selected ? "scale-x-100" : "scale-x-0"}`}
                    aria-hidden="true"
                  />
                </button>
              );
            })}
          </div>
        </div>
      </header>

      <main id="painel-admin" role="tabpanel" aria-labelledby={`aba-${tab}`} className="mx-auto max-w-6xl px-4 pb-24 pt-5" key={tab}>
        {tab === "agenda" && (
          <AgendaTab
            appointments={appointments}
            setAppointments={setAppointments}
            overrides={overrides}
            notify={notify}
            todayLabel={formatLongDate(now.iso)}
          />
        )}
        {tab === "financeiro" && <FinanceTab sales={sales} setSales={setSales} notify={notify} monthIndex={Number(now.iso.slice(5, 7)) - 1} />}
        {tab === "servicos" && <ServicesTab overrides={overrides} setOverrides={setOverrides} notify={notify} />}
      </main>
      <Toast message={toast} />
    </div>
  );
}
