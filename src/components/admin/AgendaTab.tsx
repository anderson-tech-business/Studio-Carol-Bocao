"use client";

import { useMemo, useState } from "react";
import { CalendarClock, CheckCircle2, Clock, Phone, Plus, RotateCcw, Undo2, XCircle } from "lucide-react";
import { adminTimeSlots, type Appointment, type AppointmentStatus } from "@/data/admin-mock";
import { bookables, findBookable } from "@/data/mock";
import { formatDuration, isValidPhone, maskPhone } from "@/lib/format";
import { FieldLabel, Modal, money } from "./ui";
import type { ServiceOverrides } from "./AdminApp";

const STATUS: Record<AppointmentStatus, { label: string; cls: string }> = {
  confirmado: { label: "Confirmado", cls: "bg-blush-soft text-berry ring-1 ring-line-strong" },
  concluido: { label: "Concluído", cls: "bg-[#E3F4EA] text-wa-ink ring-1 ring-wa/40" },
  cancelado: { label: "Cancelado", cls: "bg-[#F1EDEF] text-ink-soft ring-1 ring-[#B9A8B1] line-through" },
};

const ORIGIN: Record<Appointment["origin"], string> = {
  site: "Site",
  balcao: "Balcão",
  telefone: "Telefone",
  whatsapp: "WhatsApp",
};

export function AgendaTab({
  appointments,
  setAppointments,
  overrides,
  notify,
  todayLabel,
}: {
  appointments: Appointment[];
  setAppointments: (fn: (a: Appointment[]) => Appointment[]) => void;
  overrides: ServiceOverrides;
  notify: (msg: string) => void;
  todayLabel: string;
}) {
  const [reschedule, setReschedule] = useState<Appointment | null>(null);
  const [newTime, setNewTime] = useState("");
  const [confirmCancel, setConfirmCancel] = useState<string | null>(null);
  const [creating, setCreating] = useState(false);

  const priceOf = (slug: string) => overrides[slug]?.price ?? findBookable(slug)?.price ?? 0;
  const sorted = useMemo(() => [...appointments].sort((a, b) => a.time.localeCompare(b.time)), [appointments]);
  const active = sorted.filter((a) => a.status !== "cancelado");
  const expected = active.reduce((s, a) => s + priceOf(a.service), 0);
  const done = sorted.filter((a) => a.status === "concluido");
  const doneValue = done.reduce((s, a) => s + priceOf(a.service), 0);

  const takenTimes = (exceptId?: string) =>
    new Set(appointments.filter((a) => a.status !== "cancelado" && a.id !== exceptId).map((a) => a.time));

  const update = (id: string, patch: Partial<Appointment>) =>
    setAppointments((list) => list.map((a) => (a.id === id ? { ...a, ...patch } : a)));

  return (
    <section aria-labelledby="agenda-titulo" className="animate-blur-in">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 id="agenda-titulo" className="font-display text-2xl font-black text-ink">
            Agenda do Dia
          </h2>
          <p className="text-base text-ink-soft first-letter:uppercase">{todayLabel}</p>
        </div>
        <button type="button" onClick={() => setCreating(true)} className="btn btn-fill min-h-12">
          <Plus aria-hidden="true" />
          Novo Agendamento Manual
        </button>
      </div>

      <div className="mb-5 grid grid-cols-3 gap-2">
        <MiniStat label="Atendimentos" value={String(active.length)} />
        <MiniStat label="Previsto hoje" value={money(expected)} />
        <MiniStat label="Já recebido" value={money(doneValue)} tone="green" />
      </div>

      <ol className="relative grid gap-3 before:absolute before:bottom-4 before:left-[30px] before:top-4 before:w-0.5 before:bg-line-strong/40">
        {sorted.map((a, i) => {
          const svc = findBookable(a.service);
          const st = STATUS[a.status];
          const cancelled = a.status === "cancelado";
          return (
            <li key={a.id} className="relative grid grid-cols-[62px_1fr] gap-3 animate-blur-in" style={{ animationDelay: `${i * 60}ms` }}>
              <div className="relative z-10 flex flex-col items-center pt-3">
                <span
                  className={`grid h-[60px] w-[60px] place-items-center rounded-2xl font-display text-[1.05rem] font-black tabular-nums ${
                    cancelled ? "bg-[#F1EDEF] text-ink-soft" : a.status === "concluido" ? "bg-wa text-white" : "bg-raspberry text-white"
                  }`}
                >
                  {a.time}
                </span>
              </div>
              <article className={`rounded-2xl bg-white p-4 ring-1 ring-line transition ${cancelled ? "opacity-75" : "shadow-[0_14px_28px_-22px_rgba(122,31,75,.8)]"}`}>
                <div className="flex flex-wrap items-start justify-between gap-2">
                  <div className="min-w-0">
                    <h3 className={`font-display text-lg font-extrabold leading-tight text-ink ${cancelled ? "line-through" : ""}`}>
                      {svc?.name ?? a.service}
                    </h3>
                    <p className="text-base text-ink">
                      <b>{a.client}</b>
                    </p>
                  </div>
                  <span className={`rounded-full px-3 py-1 text-sm font-bold ${st.cls}`}>{st.label}</span>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-[.95rem] text-ink-soft">
                  <span className="font-display text-lg font-black text-raspberry">{money(priceOf(a.service))}</span>
                  {svc && (
                    <span className="inline-flex items-center gap-1">
                      <Clock className="h-4 w-4" aria-hidden="true" />
                      {formatDuration(svc.duration)}
                    </span>
                  )}
                  <span className="inline-flex items-center gap-1 tabular-nums">
                    <Phone className="h-4 w-4" aria-hidden="true" />
                    {a.phone}
                  </span>
                  <span className="rounded-full bg-blush-soft px-2 py-0.5 text-sm font-medium text-berry">{ORIGIN[a.origin]}</span>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  {confirmCancel === a.id ? (
                    <div className="flex flex-wrap items-center gap-2 rounded-2xl bg-blush-soft p-2" role="group" aria-label="Confirmar cancelamento">
                      <span className="px-1 text-[.95rem] font-medium text-ink">Cancelar o horário de {a.client}?</span>
                      <button
                        type="button"
                        className="min-h-11 rounded-full bg-[#A3123F] px-4 font-display text-sm font-bold text-white"
                        onClick={() => {
                          update(a.id, { status: "cancelado" });
                          setConfirmCancel(null);
                          notify(`Horário de ${a.client} cancelado.`);
                        }}
                      >
                        Sim, cancelar
                      </button>
                      <button type="button" className="min-h-11 rounded-full px-4 font-display text-sm font-bold text-berry ring-2 ring-line-strong" onClick={() => setConfirmCancel(null)}>
                        Manter
                      </button>
                    </div>
                  ) : cancelled ? (
                    <ActionButton
                      icon={Undo2}
                      onClick={() => {
                        if (takenTimes(a.id).has(a.time)) {
                          notify(`O horário ${a.time} já foi ocupado. Use "Remarcar".`);
                          setReschedule(a);
                          setNewTime("");
                          return;
                        }
                        update(a.id, { status: "confirmado" });
                        notify(`Horário de ${a.client} reativado.`);
                      }}
                    >
                      Reativar
                    </ActionButton>
                  ) : (
                    <>
                      {a.status === "confirmado" && (
                        <ActionButton
                          icon={CheckCircle2}
                          onClick={() => {
                            update(a.id, { status: "concluido" });
                            notify(`Atendimento de ${a.client} concluído.`);
                          }}
                        >
                          Concluir
                        </ActionButton>
                      )}
                      <ActionButton
                        icon={CalendarClock}
                        onClick={() => {
                          setReschedule(a);
                          setNewTime("");
                        }}
                      >
                        Remarcar
                      </ActionButton>
                      <ActionButton icon={XCircle} danger onClick={() => setConfirmCancel(a.id)}>
                        Cancelar
                      </ActionButton>
                    </>
                  )}
                </div>
              </article>
            </li>
          );
        })}
      </ol>

      {/* Remarcar */}
      <Modal open={!!reschedule} title={`Remarcar ${reschedule?.client ?? ""}`} onClose={() => setReschedule(null)}>
        {reschedule && (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              if (!newTime) return;
              update(reschedule.id, { time: newTime, status: "confirmado" });
              notify(`${reschedule.client} remarcada para ${newTime}.`);
              setReschedule(null);
            }}
            className="grid gap-4"
          >
            <p className="text-base text-ink-soft">
              Horário atual: <b className="text-ink">{reschedule.time}</b>. Escolha o novo horário de hoje:
            </p>
            <div className="grid grid-cols-4 gap-2" role="group" aria-label="Novos horários">
              {adminTimeSlots.map((t) => {
                const taken = takenTimes(reschedule.id).has(t);
                const sel = newTime === t;
                return (
                  <button
                    key={t}
                    type="button"
                    disabled={taken || t === reschedule.time}
                    aria-pressed={sel}
                    onClick={() => setNewTime(t)}
                    className={`min-h-11 rounded-xl border-2 font-display text-[.95rem] font-bold tabular-nums transition ${
                      sel
                        ? "border-raspberry bg-raspberry text-white"
                        : taken || t === reschedule.time
                          ? "cursor-not-allowed border-dashed border-[#B9A8B1] text-ink-soft line-through"
                          : "border-line-strong bg-white text-ink hover:border-raspberry"
                    }`}
                  >
                    {t}
                  </button>
                );
              })}
            </div>
            <button type="submit" disabled={!newTime} className={`btn btn-fill min-h-12 w-full ${!newTime ? "opacity-60" : ""}`}>
              <RotateCcw aria-hidden="true" />
              {newTime ? `Remarcar para ${newTime}` : "Escolha um horário"}
            </button>
          </form>
        )}
      </Modal>

      <NewAppointmentModal
        open={creating}
        onClose={() => setCreating(false)}
        taken={takenTimes()}
        overrides={overrides}
        onCreate={(appt) => {
          setAppointments((list) => [...list, appt]);
          notify(`Agendamento de ${appt.client} às ${appt.time} criado.`);
          setCreating(false);
        }}
      />
    </section>
  );
}

function MiniStat({ label, value, tone }: { label: string; value: string; tone?: "green" }) {
  return (
    <div className="rounded-2xl bg-white p-3 ring-1 ring-line">
      <p className="text-xs font-bold uppercase tracking-wide text-ink-soft">{label}</p>
      <p className={`font-display text-lg font-black tabular-nums sm:text-xl ${tone === "green" ? "text-wa-ink" : "text-ink"}`}>{value}</p>
    </div>
  );
}

function ActionButton({
  icon: Icon,
  children,
  onClick,
  danger = false,
}: {
  icon: typeof Clock;
  children: React.ReactNode;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`inline-flex min-h-11 items-center gap-1.5 rounded-full px-4 font-display text-sm font-bold ring-2 transition hover:-translate-y-0.5 ${
        danger ? "text-[#A3123F] ring-[#E6A9BC] hover:bg-[#FCEEF2]" : "text-berry ring-line-strong hover:bg-blush-soft"
      }`}
    >
      <Icon className="h-4 w-4" aria-hidden="true" />
      {children}
    </button>
  );
}

function NewAppointmentModal({
  open,
  onClose,
  onCreate,
  taken,
  overrides,
}: {
  open: boolean;
  onClose: () => void;
  onCreate: (a: Appointment) => void;
  taken: Set<string>;
  overrides: ServiceOverrides;
}) {
  const [client, setClient] = useState("");
  const [phone, setPhone] = useState("");
  const [service, setService] = useState("");
  const [time, setTime] = useState("");
  const [origin, setOrigin] = useState<Appointment["origin"]>("balcao");
  const [tried, setTried] = useState(false);

  const options = useMemo(() => bookables.filter((b) => overrides[b.slug]?.active !== false), [overrides]);

  const errors = {
    client: client.trim().length < 2 ? "Digite o nome da cliente." : "",
    phone: !isValidPhone(phone) ? "Digite o WhatsApp no formato (11) 99999-9999." : "",
    service: !service ? "Escolha o serviço." : "",
    time: !time ? "Escolha o horário." : "",
  };
  const valid = !Object.values(errors).some(Boolean);

  const reset = () => {
    setClient("");
    setPhone("");
    setService("");
    setTime("");
    setOrigin("balcao");
    setTried(false);
  };

  return (
    <Modal
      open={open}
      title="Novo agendamento manual"
      onClose={() => {
        reset();
        onClose();
      }}
    >
      <form
        noValidate
        className="grid gap-4"
        onSubmit={(e) => {
          e.preventDefault();
          setTried(true);
          if (!valid) return;
          onCreate({ id: `m${Date.now()}`, client: client.trim(), phone, service, time, origin, status: "confirmado" });
          reset();
        }}
      >
        <div>
          <FieldLabel htmlFor="nm-cliente">Nome da cliente</FieldLabel>
          <input id="nm-cliente" className="input" value={client} onChange={(e) => setClient(e.target.value)} autoComplete="off" />
          {tried && errors.client && <ErrorText>{errors.client}</ErrorText>}
        </div>
        <div>
          <FieldLabel htmlFor="nm-fone">WhatsApp</FieldLabel>
          <input
            id="nm-fone"
            className="input tabular-nums"
            type="tel"
            inputMode="numeric"
            placeholder="(11) 99999-9999"
            value={phone}
            onChange={(e) => setPhone(maskPhone(e.target.value))}
          />
          {tried && errors.phone && <ErrorText>{errors.phone}</ErrorText>}
        </div>
        <div>
          <FieldLabel htmlFor="nm-servico">Serviço</FieldLabel>
          <select id="nm-servico" className="input" value={service} onChange={(e) => setService(e.target.value)}>
            <option value="">Selecione…</option>
            {options.map((b) => (
              <option key={b.slug} value={b.slug}>
                {b.name} · {money(overrides[b.slug]?.price ?? b.price)}
              </option>
            ))}
          </select>
          {tried && errors.service && <ErrorText>{errors.service}</ErrorText>}
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div>
            <FieldLabel htmlFor="nm-hora">Horário</FieldLabel>
            <select id="nm-hora" className="input" value={time} onChange={(e) => setTime(e.target.value)}>
              <option value="">--:--</option>
              {adminTimeSlots.map((t) => (
                <option key={t} value={t} disabled={taken.has(t)}>
                  {t}
                  {taken.has(t) ? " (ocupado)" : ""}
                </option>
              ))}
            </select>
            {tried && errors.time && <ErrorText>{errors.time}</ErrorText>}
          </div>
          <div>
            <FieldLabel htmlFor="nm-origem">Pedido por</FieldLabel>
            <select id="nm-origem" className="input" value={origin} onChange={(e) => setOrigin(e.target.value as Appointment["origin"])}>
              <option value="balcao">Balcão</option>
              <option value="telefone">Telefone</option>
              <option value="whatsapp">WhatsApp</option>
            </select>
          </div>
        </div>
        <button type="submit" className="btn btn-fill min-h-12 w-full">
          <Plus aria-hidden="true" />
          Adicionar à agenda
        </button>
      </form>
    </Modal>
  );
}

function ErrorText({ children }: { children: React.ReactNode }) {
  return (
    <p className="mt-1 text-[.92rem] font-medium text-[#A3123F]" role="alert">
      {children}
    </p>
  );
}
