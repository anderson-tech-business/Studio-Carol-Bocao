"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  CalendarCheck,
  Check,
  Clock,
  Crown,
  Eye,
  Flame,
  Footprints,
  Hand,
  Info,
  Scissors,
  Sparkles,
  UserRound,
  Users,
} from "lucide-react";
import {
  bookables,
  categories,
  findBookable,
  professionals,
  type Bookable,
  type CategoryId,
} from "@/data/mock";
import { brl, dayChip, formatDuration, formatLongDate, isValidPhone, maskPhone } from "@/lib/format";
import { clearDraft, readDraft, toQuery, writeDraft } from "@/lib/booking";
import { isSlotBookable, nextWorkingDays, slotsFor, type SlotStatus } from "@/lib/schedule";

const STEPS = [
  { n: 1, label: "Serviço" },
  { n: 2, label: "Profissional" },
  { n: 3, label: "Data e hora" },
  { n: 4, label: "Seus dados" },
] as const;

const CATEGORY_ICON: Record<CategoryId, typeof Hand> = { unhas: Hand, pes: Footprints, olhar: Eye, cabelo: Scissors };

const STATUS_LABEL: Record<Exclude<SlotStatus, "free">, string> = {
  busy: "Ocupado",
  past: "Encerrado",
  "too-long": "Passa das 17h",
};

export function BookingWizard() {
  const router = useRouter();
  const params = useSearchParams();
  const slugFromUrl = params.get("servico");
  const linkedService = findBookable(slugFromUrl);

  const [step, setStep] = useState(1);
  const [dir, setDir] = useState<1 | -1>(1);
  const [servico, setServico] = useState("");
  const [profissional, setProfissional] = useState("carol-bocao");
  const [data, setData] = useState("");
  const [horario, setHorario] = useState("");
  const [nome, setNome] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [touched, setTouched] = useState({ nome: false, whatsapp: false });
  const [shake, setShake] = useState(false);
  const [ready, setReady] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const headingRef = useRef<HTMLHeadingElement>(null);

  const days = useMemo(() => (ready ? nextWorkingDays(7) : []), [ready]);
  const service = findBookable(servico);

  /* Hidrata: ?servico=slug tem prioridade sobre o rascunho salvo. */
  useEffect(() => {
    const draft = readDraft();
    if (draft.profissional) setProfissional(draft.profissional);
    if (draft.nome) setNome(draft.nome);
    if (draft.whatsapp) setWhatsapp(maskPhone(draft.whatsapp));
    if (linkedService) {
      setServico(linkedService.slug);
      setStep(2);
    } else if (draft.servico && findBookable(draft.servico)) {
      setServico(draft.servico);
      if (draft.data) setData(draft.data);
      if (draft.horario) setHorario(draft.horario);
    }
    setReady(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* Primeiro dia disponível como padrão; descarta datas antigas do rascunho. */
  useEffect(() => {
    if (!days.length) return;
    if (!data || !days.includes(data)) {
      setData(days[0]);
      setHorario("");
    }
  }, [days, data]);

  /* Se o serviço mudar e o horário não couber mais, limpa o horário. */
  useEffect(() => {
    if (service && data && horario && !isSlotBookable(data, horario, service.duration)) setHorario("");
  }, [service, data, horario]);

  /* Salva rascunho local. */
  useEffect(() => {
    if (!ready) return;
    writeDraft({ servico, profissional, data, horario, nome, whatsapp, step });
  }, [ready, servico, profissional, data, horario, nome, whatsapp, step]);

  /* Foco no título de cada passo (leitores de tela e teclado). */
  useEffect(() => {
    if (ready) headingRef.current?.focus({ preventScroll: true });
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [step, ready]);

  const nameOk = nome.trim().length >= 2;
  const phoneOk = isValidPhone(whatsapp);
  const canAdvance =
    (step === 1 && !!service) ||
    (step === 2 && !!profissional) ||
    (step === 3 && !!data && !!horario) ||
    (step === 4 && nameOk && phoneOk);

  /* Até onde dá para avançar sem pular etapas obrigatórias. */
  const maxReachable = !service ? 1 : !profissional ? 2 : !(data && horario) ? 3 : 4;

  const go = (to: number) => {
    const target = Math.min(maxReachable, Math.max(1, to));
    setDir(target > step ? 1 : -1);
    setStep(target);
  };

  const next = () => {
    if (!canAdvance) {
      if (step === 4) setTouched({ nome: true, whatsapp: true });
      setShake(true);
      window.setTimeout(() => setShake(false), 400);
      return;
    }
    if (step < 4) {
      setDir(1);
      setStep(step + 1);
    } else confirm();
  };

  const confirm = () => {
    if (!service) return;
    setSubmitting(true);
    const query = toQuery({ servico, profissional, data, horario, nome: nome.trim(), whatsapp });
    clearDraft();
    router.push(`/agendamento-confirmado?${query}`);
  };

  const pickService = (b: Bookable) => {
    setServico(b.slug);
    window.setTimeout(() => {
      setDir(1);
      setStep(2);
    }, 180);
  };

  const pickPro = (slug: string) => {
    setProfissional(slug);
    window.setTimeout(() => {
      setDir(1);
      setStep(3);
    }, 180);
  };

  const animClass = dir === 1 ? "animate-step-in-right" : "animate-step-in-left";
  const progress = ((step - 1) / (STEPS.length - 1)) * 100;

  return (
    <div className="mx-auto max-w-5xl px-4 pb-40 pt-5 md:grid md:grid-cols-[1fr_320px] md:gap-8 md:pb-16">
      <div className="min-w-0">
        {/* Stepper */}
        <nav aria-label="Etapas do agendamento" className="mb-5">
          <p className="mb-2 font-display text-sm font-bold uppercase tracking-[.14em] text-berry">
            Passo {step} de {STEPS.length}
          </p>
          <div className="relative h-2 overflow-hidden rounded-full bg-white shadow-[inset_0_0_0_1px_#EFD3DF]">
            <div
              className="absolute inset-y-0 left-0 rounded-full bg-gradient-to-r from-berry via-raspberry to-gold transition-[width] duration-700 ease-out-expo"
              style={{ width: `${Math.max(progress, 6)}%` }}
            />
          </div>
          <ol className="mt-3 grid grid-cols-4 gap-1">
            {STEPS.map((s) => {
              const done = s.n < step;
              const current = s.n === step;
              const reachable = s.n < step;
              return (
                <li key={s.n}>
                  <button
                    type="button"
                    onClick={() => reachable && go(s.n)}
                    disabled={!reachable}
                    aria-current={current ? "step" : undefined}
                    className={`flex w-full min-h-11 flex-col items-center gap-1 rounded-xl px-1 py-1 text-center font-display text-[.78rem] font-bold leading-tight transition ${
                      current ? "text-raspberry" : done ? "text-berry hover:bg-white" : "text-ink-soft"
                    } disabled:cursor-default`}
                  >
                    <span
                      className={`grid h-7 w-7 place-items-center rounded-full text-[.8rem] transition duration-300 ${
                        current
                          ? "scale-110 bg-raspberry text-white shadow-[0_8px_16px_-8px_rgba(176,48,106,.9)]"
                          : done
                            ? "bg-berry text-white"
                            : "bg-white text-ink-soft shadow-[inset_0_0_0_2px_#9E5C7B]"
                      }`}
                    >
                      {done ? <Check className="h-4 w-4" aria-hidden="true" /> : s.n}
                    </span>
                    {s.label}
                  </button>
                </li>
              );
            })}
          </ol>
        </nav>

        <div key={step} className={animClass}>
          {/* ---------------- PASSO 1 ---------------- */}
          {step === 1 && (
            <section aria-labelledby="titulo-passo">
              <StepTitle refEl={headingRef} title="Qual cuidado você quer?" subtitle="Escolha um serviço ou o combo da casa." />
              {slugFromUrl && !linkedService && (
                <Notice>O serviço do link não foi encontrado. Escolha uma opção abaixo.</Notice>
              )}
              <div className="grid gap-3">
                {bookables
                  .filter((b) => b.kind === "combo")
                  .map((b) => (
                    <button
                      key={b.slug}
                      type="button"
                      onClick={() => pickService(b)}
                      aria-pressed={servico === b.slug}
                      className={`group relative overflow-hidden rounded-3xl p-5 text-left text-white transition duration-300 ease-spring hover:-translate-y-0.5 ${
                        servico === b.slug ? "ring-4 ring-gold" : ""
                      } bg-gradient-to-br from-raspberry to-berry shadow-[0_20px_36px_-22px_rgba(122,31,75,.9)]`}
                    >
                      <span className="mb-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1 font-display text-xs font-extrabold uppercase tracking-wider text-raspberry">
                        <Flame className="h-3.5 w-3.5" aria-hidden="true" />
                        Mais Pedido
                      </span>
                      <span className="block font-display text-xl font-extrabold leading-tight">{b.name}</span>
                      <span className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-1 text-base">
                        <b className="font-display text-2xl font-black">{brl(b.price)}</b>
                        <span className="inline-flex items-center gap-1.5">
                          <Clock className="h-4 w-4" aria-hidden="true" />
                          {formatDuration(b.duration)}
                        </span>
                      </span>
                      <Sparkles className="absolute -right-2 -top-2 h-20 w-20 text-white/15 transition duration-700 group-hover:rotate-45" aria-hidden="true" />
                      {servico === b.slug && <SelectedMark light />}
                    </button>
                  ))}

                {categories.map((cat) => {
                  const Icon = CATEGORY_ICON[cat.id];
                  const list = bookables.filter((b) => b.category === cat.id);
                  return (
                    <div key={cat.id} className="mt-3">
                      <h3 className="mb-2 flex items-center gap-2 font-display text-base font-extrabold text-berry">
                        <Icon className="h-5 w-5" aria-hidden="true" />
                        {cat.label}
                      </h3>
                      <div className="grid gap-2 sm:grid-cols-2">
                        {list.map((b) => (
                          <OptionCard key={b.slug} selected={servico === b.slug} onClick={() => pickService(b)}>
                            <span className="block font-display text-[1.05rem] font-bold leading-snug">{b.name}</span>
                            <span className="mt-1 block text-[.95rem] text-ink-soft">{b.description}</span>
                            <span className="mt-2 flex items-center gap-3">
                              <b className="font-display text-lg font-black text-raspberry">{brl(b.price)}</b>
                              <span className="inline-flex items-center gap-1 text-[.92rem] font-bold text-berry">
                                <Clock className="h-4 w-4" aria-hidden="true" />
                                {formatDuration(b.duration)}
                              </span>
                            </span>
                          </OptionCard>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* ---------------- PASSO 2 ---------------- */}
          {step === 2 && (
            <section aria-labelledby="titulo-passo">
              <StepTitle refEl={headingRef} title="Com quem você quer agendar?" subtitle="A Carol atende pessoalmente todos os serviços." />
              {linkedService && servico === linkedService.slug && (
                <Notice>
                  Serviço escolhido pelo link: <b>{linkedService.name}</b>.{" "}
                  <button type="button" className="font-bold text-raspberry underline underline-offset-2" onClick={() => go(1)}>
                    Trocar
                  </button>
                </Notice>
              )}
              <div className="grid gap-3">
                {professionals.map((p) => (
                  <OptionCard key={p.slug} selected={profissional === p.slug} onClick={() => pickPro(p.slug)} featured={p.featured}>
                    <span className="flex items-center gap-4">
                      <span
                        className={`grid h-16 w-16 flex-none place-items-center rounded-2xl ${
                          p.featured ? "bg-gradient-to-br from-raspberry to-berry text-white" : "bg-blush-soft text-berry"
                        }`}
                      >
                        {p.featured ? (
                          <span className="font-display text-2xl font-black">CB</span>
                        ) : (
                          <Users className="h-7 w-7" aria-hidden="true" />
                        )}
                      </span>
                      <span className="min-w-0">
                        <span className="flex flex-wrap items-center gap-2">
                          <b className="font-display text-lg font-extrabold">
                            {p.name} — {p.role}
                          </b>
                          {p.featured && (
                            <span className="inline-flex items-center gap-1 rounded-full bg-gold-ink px-2.5 py-0.5 text-xs font-bold uppercase tracking-wide text-white">
                              <Crown className="h-3.5 w-3.5" aria-hidden="true" />
                              Recomendada
                            </span>
                          )}
                        </span>
                        <span className="mt-1 block text-[.95rem] text-ink-soft">{p.bio}</span>
                      </span>
                    </span>
                  </OptionCard>
                ))}
              </div>
            </section>
          )}

          {/* ---------------- PASSO 3 ---------------- */}
          {step === 3 && service && (
            <section aria-labelledby="titulo-passo">
              <StepTitle refEl={headingRef} title="Escolha o dia e o horário" subtitle={`${service.name} · ${formatDuration(service.duration)}`} />
              <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-[.12em] text-ink-soft">Dia</h3>
              <div className="-mx-4 mb-5 flex gap-2 overflow-x-auto px-4 pb-2 [scrollbar-width:none]" role="group" aria-label="Dias disponíveis">
                {days.map((d) => {
                  const chip = dayChip(d);
                  const selected = d === data;
                  const free = slotsFor(d, service.duration).filter((s) => s.status === "free").length;
                  return (
                    <button
                      key={d}
                      type="button"
                      aria-pressed={selected}
                      aria-label={`${formatLongDate(d)}, ${free} horários livres`}
                      onClick={() => {
                        setData(d);
                        setHorario("");
                      }}
                      className={`flex min-w-[72px] flex-none flex-col items-center rounded-2xl border-2 px-3 py-2 transition duration-200 ease-spring hover:-translate-y-0.5 ${
                        selected ? "animate-pop border-raspberry bg-raspberry text-white" : "border-line-strong bg-white text-ink"
                      }`}
                    >
                      <span className={`text-xs font-bold uppercase tracking-wide ${selected ? "text-white" : "text-ink-soft"}`}>{chip.weekday}</span>
                      <span className="font-display text-2xl font-black leading-tight">{chip.day}</span>
                      <span className={`text-xs ${selected ? "text-white" : "text-ink-soft"}`}>{chip.month}</span>
                    </button>
                  );
                })}
              </div>

              <h3 className="mb-2 font-display text-sm font-bold uppercase tracking-[.12em] text-ink-soft">
                Horários de {data ? formatLongDate(data) : ""}
              </h3>
              <div className={`grid grid-cols-3 gap-2 ${shake ? "animate-shake" : ""}`} role="group" aria-label="Horários">
                {data &&
                  slotsFor(data, service.duration).map((s) => {
                    const free = s.status === "free";
                    const selected = horario === s.time;
                    return (
                      <button
                        key={s.time}
                        type="button"
                        disabled={!free}
                        aria-pressed={selected}
                        aria-label={free ? `${s.time}, livre` : `${s.time}, ${STATUS_LABEL[s.status as Exclude<SlotStatus, "free">]}`}
                        onClick={() => setHorario(s.time)}
                        className={`relative flex min-h-[60px] flex-col items-center justify-center rounded-2xl border-2 font-display transition duration-200 ease-spring ${
                          selected
                            ? "animate-pop border-raspberry bg-raspberry text-white shadow-[0_12px_20px_-12px_rgba(176,48,106,.9)]"
                            : free
                              ? "border-line-strong bg-white text-ink hover:-translate-y-0.5 hover:border-raspberry"
                              : "cursor-not-allowed border-dashed border-line-strong bg-[repeating-linear-gradient(135deg,#fff_0_6px,#FBEAF1_6px_12px)] text-ink-soft"
                        }`}
                      >
                        <span className={`text-lg font-black ${!free ? "line-through decoration-2" : ""}`}>{s.time}</span>
                        {!free && <span className="text-xs font-bold">{STATUS_LABEL[s.status as Exclude<SlotStatus, "free">]}</span>}
                      </button>
                    );
                  })}
              </div>
              <p className="mt-3 flex items-start gap-2 text-[.92rem] text-ink-soft">
                <Info className="mt-0.5 h-4 w-4 flex-none" aria-hidden="true" />
                Horários de demonstração. O atendimento vai das 07:30 às 17:00.
              </p>
            </section>
          )}

          {/* ---------------- PASSO 4 ---------------- */}
          {step === 4 && service && (
            <section aria-labelledby="titulo-passo">
              <StepTitle refEl={headingRef} title="Quase lá! Seus dados" subtitle="Usamos só para identificar o seu horário." />
              <form
                noValidate
                onSubmit={(e) => {
                  e.preventDefault();
                  next();
                }}
                className="grid gap-4"
              >
                <Field
                  id="nome"
                  label="Nome da cliente"
                  error={touched.nome && !nameOk ? "Digite seu nome (pelo menos 2 letras)." : ""}
                >
                  <input
                    id="nome"
                    name="nome"
                    autoComplete="name"
                    value={nome}
                    onChange={(e) => setNome(e.target.value)}
                    onBlur={() => setTouched((t) => ({ ...t, nome: true }))}
                    placeholder="Ex.: Juliana Martins"
                    aria-invalid={touched.nome && !nameOk}
                    aria-describedby={touched.nome && !nameOk ? "nome-erro" : undefined}
                    className="input"
                  />
                </Field>
                <Field
                  id="whatsapp"
                  label="WhatsApp"
                  hint="Com DDD. Ex.: (11) 99999-9999"
                  error={touched.whatsapp && !phoneOk ? "Digite um celular com DDD no formato (11) 99999-9999." : ""}
                >
                  <input
                    id="whatsapp"
                    name="whatsapp"
                    type="tel"
                    inputMode="numeric"
                    autoComplete="tel-national"
                    value={whatsapp}
                    onChange={(e) => setWhatsapp(maskPhone(e.target.value))}
                    onBlur={() => setTouched((t) => ({ ...t, whatsapp: true }))}
                    placeholder="(11) 99999-9999"
                    maxLength={15}
                    aria-invalid={touched.whatsapp && !phoneOk}
                    aria-describedby={touched.whatsapp && !phoneOk ? "whatsapp-erro" : "whatsapp-dica"}
                    className="input tabular-nums"
                  />
                </Field>
                <button type="submit" className="hidden" aria-hidden="true" tabIndex={-1} />
              </form>
              <div className="mt-5 md:hidden">
                <Summary service={service} profissional={profissional} data={data} horario={horario} onEdit={go} />
              </div>
            </section>
          )}
        </div>
      </div>

      {/* Resumo lateral (desktop) */}
      <aside className="hidden md:block">
        <div className="sticky top-24">
          <Summary service={service} profissional={profissional} data={data} horario={horario} onEdit={go} />
        </div>
      </aside>

      {/* Barra de ações */}
      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-line bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur md:static md:mt-8 md:border-0 md:bg-transparent md:col-span-2 md:pb-0">
        <div className="mx-auto flex max-w-5xl items-center gap-3 px-4 py-3 md:px-0">
          {step > 1 && (
            <button
              type="button"
              onClick={() => go(step - 1)}
              aria-label="Voltar para o passo anterior"
              className="inline-flex min-h-12 min-w-12 flex-none items-center justify-center gap-1.5 rounded-full px-3 font-display font-bold text-berry ring-2 ring-line-strong transition hover:bg-blush-soft sm:px-4"
            >
              <ArrowLeft className="h-5 w-5" aria-hidden="true" />
              <span className="hidden sm:inline">Voltar</span>
            </button>
          )}
          <button
            type="button"
            onClick={next}
            disabled={submitting}
            aria-disabled={!canAdvance}
            className={`btn btn-fill min-h-12 flex-1 !whitespace-normal text-center md:ml-auto md:flex-none ${!canAdvance ? "opacity-60" : ""} ${shake ? "animate-shake" : ""}`}
          >
            {step < 4 ? (
              <>
                Continuar <ArrowRight aria-hidden="true" />
              </>
            ) : (
              <>
                <CalendarCheck aria-hidden="true" /> Confirmar Agendamento
              </>
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Subcomponentes ---------------- */

function StepTitle({ title, subtitle, refEl }: { title: string; subtitle: string; refEl: React.RefObject<HTMLHeadingElement | null> }) {
  return (
    <div className="mb-4">
      <h1 id="titulo-passo" ref={refEl} tabIndex={-1} className="font-display text-[1.9rem] font-black leading-[1.05] tracking-tight text-ink outline-none">
        {title}
      </h1>
      <p className="mt-1.5 text-base text-ink-soft">{subtitle}</p>
    </div>
  );
}

function Notice({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 flex items-start gap-2 rounded-2xl bg-white p-3 text-[.95rem] text-ink shadow-[inset_0_0_0_2px_#9E5C7B]" role="status">
      <Info className="mt-0.5 h-5 w-5 flex-none text-raspberry" aria-hidden="true" />
      <span>{children}</span>
    </div>
  );
}

function SelectedMark({ light = false }: { light?: boolean }) {
  return (
    <span
      className={`absolute right-3 top-3 grid h-8 w-8 animate-pop place-items-center rounded-full ${
        light ? "bg-white text-raspberry" : "bg-raspberry text-white"
      }`}
      aria-hidden="true"
    >
      <Check className="h-5 w-5" strokeWidth={3} />
    </span>
  );
}

function OptionCard({
  selected,
  onClick,
  children,
  featured = false,
}: {
  selected: boolean;
  onClick: () => void;
  children: React.ReactNode;
  featured?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={selected}
      className={`relative w-full rounded-2xl border-2 bg-white p-4 pr-12 text-left transition duration-300 ease-spring hover:-translate-y-0.5 hover:shadow-[0_16px_28px_-20px_rgba(122,31,75,.8)] ${
        selected ? "border-raspberry shadow-[0_0_0_4px_rgba(176,48,106,.15)]" : featured ? "border-berry" : "border-line-strong"
      }`}
    >
      {children}
      {selected && <SelectedMark />}
    </button>
  );
}

function Field({ id, label, hint, error, children }: { id: string; label: string; hint?: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="font-display text-base font-bold text-ink">
        {label}
      </label>
      {children}
      {error ? (
        <p id={`${id}-erro`} className="text-[.95rem] font-medium text-[#A3123F]" role="alert">
          {error}
        </p>
      ) : hint ? (
        <p id={`${id}-dica`} className="text-[.92rem] text-ink-soft">
          {hint}
        </p>
      ) : null}
    </div>
  );
}

function Summary({
  service,
  profissional,
  data,
  horario,
  onEdit,
}: {
  service?: Bookable;
  profissional: string;
  data: string;
  horario: string;
  onEdit: (step: number) => void;
}) {
  const pro = professionals.find((p) => p.slug === profissional);
  const rows: { label: string; value: string; step: number; icon: typeof Clock }[] = [
    { label: "Serviço", value: service ? `${service.name} · ${brl(service.price)}` : "Escolha um serviço", step: 1, icon: Sparkles },
    { label: "Profissional", value: pro ? `${pro.name} — ${pro.role}` : "—", step: 2, icon: UserRound },
    { label: "Quando", value: data && horario ? `${formatLongDate(data)} às ${horario}` : "Escolha dia e horário", step: 3, icon: CalendarCheck },
  ];
  return (
    <div className="rounded-3xl bg-white p-5 shadow-[0_22px_40px_-28px_rgba(122,31,75,.75)] ring-1 ring-line">
      <p className="mb-3 font-display text-sm font-bold uppercase tracking-[.14em] text-berry">Resumo</p>
      <ul className="grid gap-3">
        {rows.map((r) => (
          <li key={r.label} className="flex items-start gap-3">
            <r.icon className="mt-0.5 h-5 w-5 flex-none text-raspberry" aria-hidden="true" />
            <div className="min-w-0 flex-1">
              <span className="block text-xs font-bold uppercase tracking-wide text-ink-soft">{r.label}</span>
              <span className="block text-[.98rem] font-medium leading-snug text-ink">{r.value}</span>
            </div>
            <button
              type="button"
              onClick={() => onEdit(r.step)}
              className="min-h-11 rounded-full px-2 text-sm font-bold text-raspberry underline underline-offset-2"
              aria-label={`Alterar ${r.label.toLowerCase()}`}
            >
              Alterar
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
