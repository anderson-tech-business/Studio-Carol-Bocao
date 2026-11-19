"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, type CSSProperties } from "react";
import { BellRing, CalendarCheck, CalendarPlus, Clock, MapPin, Sparkles, UserRound } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { studio } from "@/data/mock";
import { resolveBooking, whatsappReceiptUrl } from "@/lib/booking";
import { brl, dayChip, formatDuration, formatLongDate } from "@/lib/format";
import { downloadICS } from "@/lib/ics";

const CONFETTI_COLORS = ["#B0306A", "#F6D6E4", "#C9A25B", "#7A1F4B"];

export function Confirmation() {
  const params = useSearchParams();
  const booking = useMemo(() => resolveBooking((k) => params.get(k)), [params]);
  const [icsDone, setIcsDone] = useState(false);
  const [confetti, setConfetti] = useState<{ left: number; color: string; d: number; delay: number; rot: number }[]>([]);

  useEffect(() => {
    if (!booking) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setConfetti(
      Array.from({ length: 36 }, (_, i) => ({
        left: Math.random() * 100,
        color: CONFETTI_COLORS[i % CONFETTI_COLORS.length],
        d: 2.4 + Math.random() * 1.8,
        delay: Math.random() * 0.6,
        rot: Math.random() * 360,
      })),
    );
    const t = window.setTimeout(() => setConfetti([]), 5000);
    return () => window.clearTimeout(t);
  }, [booking]);

  if (!booking) {
    return (
      <main className="mx-auto grid max-w-xl gap-4 px-4 py-12 text-center">
        <h1 className="font-display text-3xl font-black text-ink">Não encontramos os dados do agendamento</h1>
        <p className="text-lg text-ink-soft">O link pode estar incompleto. Faça o agendamento de novo, leva menos de um minuto.</p>
        <Link href="/agendar" className="btn btn-fill mx-auto">
          <CalendarCheck />
          Agendar horário
        </Link>
      </main>
    );
  }

  const { data, service, professional } = booking;
  const chip = dayChip(data.data);
  const firstName = data.nome.split(" ")[0];

  const addToCalendar = () => {
    downloadICS({
      title: `${service.name} · Studio Carol Bocão`,
      description: [
        `Cliente: ${data.nome}`,
        `Serviço: ${service.name} (${brl(service.price)})`,
        `Profissional: ${professional.name}`,
        `Duração aproximada: ${formatDuration(service.duration)}`,
        `WhatsApp do studio: ${studio.whatsappDisplay}`,
      ].join("\n"),
      location: studio.addressShort + ", São Paulo - SP",
      date: data.data,
      time: data.horario,
      durationMinutes: service.duration,
    });
    setIcsDone(true);
  };

  return (
    <main className="relative mx-auto max-w-xl px-4 pb-16 pt-6">
      {confetti.map((c, i) => (
        <span
          key={i}
          className="confetti"
          aria-hidden="true"
          style={{ left: `${c.left}%`, background: c.color, rotate: `${c.rot}deg`, "--cd": `${c.d}s`, "--cdel": `${c.delay}s` } as CSSProperties}
        />
      ))}

      <div className="mb-5 flex items-center gap-4 animate-blur-in">
        <span className="grid h-16 w-16 flex-none place-items-center rounded-full bg-wa text-white shadow-[0_14px_28px_-14px_rgba(19,128,74,.9)]">
          <svg viewBox="0 0 24 24" className="h-9 w-9" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M5 12.5l4.5 4.5L19 7.5" strokeDasharray="48" className="animate-draw-check" />
          </svg>
        </span>
        <div>
          <p className="font-display text-sm font-bold uppercase tracking-[.14em] text-wa-ink">Horário reservado</p>
          <h1 className="font-display text-[1.9rem] font-black leading-[1.05] tracking-tight text-ink">
            Tudo certo, {firstName}!
          </h1>
        </div>
      </div>

      {/* Cartão resumo (ficha) */}
      <article
        className="relative overflow-hidden rounded-[30px] bg-white shadow-[0_30px_50px_-30px_rgba(122,31,75,.8)] ring-1 ring-line animate-blur-in"
        style={{ animationDelay: ".15s" }}
      >
        <div className="relative bg-gradient-to-br from-raspberry to-berry px-5 pb-6 pt-5 text-white">
          <p className="pr-24 font-display text-xs font-bold uppercase tracking-[.18em] text-white">Ficha de atendimento</p>
          <h2 className="mt-2 pr-24 font-display text-2xl font-black leading-tight">{service.name}</h2>
          <p className="mt-1 text-base text-white">
            {brl(service.price)} · {formatDuration(service.duration)}
          </p>
          <div
            className="absolute right-4 top-4 grid h-[84px] w-[84px] place-items-center rounded-full border-[3px] border-double border-white bg-white/10 text-center font-display text-[.7rem] font-black uppercase leading-tight tracking-wide animate-stamp-in"
            aria-hidden="true"
          >
            <span>
              <Sparkles className="mx-auto mb-0.5 h-4 w-4" />
              Confirmado
            </span>
          </div>
        </div>

        {/* picote */}
        <div className="relative h-0 border-t-2 border-dashed border-line-strong">
          <span className="absolute -left-4 -top-4 h-8 w-8 rounded-full bg-blush-soft" />
          <span className="absolute -right-4 -top-4 h-8 w-8 rounded-full bg-blush-soft" />
        </div>

        <div className="grid gap-4 p-5">
          <div className="flex items-center gap-4">
            <div className="grid w-[78px] flex-none place-items-center rounded-2xl bg-blush-soft py-2 text-center ring-2 ring-line-strong">
              <span className="text-xs font-bold uppercase tracking-wide text-ink-soft">{chip.weekday}</span>
              <span className="font-display text-3xl font-black leading-none text-raspberry">{chip.day}</span>
              <span className="text-xs font-bold uppercase text-ink-soft">{chip.month}</span>
            </div>
            <div>
              <p className="text-base text-ink-soft first-letter:uppercase">{formatLongDate(data.data)}</p>
              <p className="flex items-center gap-2 font-display text-[1.7rem] font-black text-ink">
                <Clock className="h-6 w-6 text-raspberry" aria-hidden="true" />
                {data.horario}
              </p>
            </div>
          </div>

          <dl className="grid gap-3 text-[1rem]">
            <Row icon={UserRound} label="Cliente" value={`${data.nome} · ${data.whatsapp}`} />
            <Row icon={Sparkles} label="Profissional" value={`${professional.name} — ${professional.role}`} />
            <Row icon={MapPin} label="Endereço" value={studio.address} />
          </dl>
        </div>
      </article>

      {/* Ações */}
      <div className="mt-6 grid gap-3 animate-blur-in" style={{ animationDelay: ".3s" }}>
        <button type="button" onClick={addToCalendar} className="btn btn-fill min-h-[58px] w-full !whitespace-normal text-center text-base">
          <CalendarPlus aria-hidden="true" />
          Adicionar Lembrete na Agenda do Celular
        </button>
        <p className="flex items-start gap-2 text-[.95rem] text-ink-soft" role="status">
          <BellRing className="mt-0.5 h-4 w-4 flex-none text-raspberry" aria-hidden="true" />
          {icsDone
            ? "Lembrete gerado. Abra o arquivo baixado para salvar na agenda."
            : "Gera um evento com aviso 24 horas e 2 horas antes do horário."}
        </p>

        <a
          href={whatsappReceiptUrl(booking)}
          target="_blank"
          rel="noopener noreferrer"
          className="btn btn-wa min-h-[58px] w-full !whitespace-normal text-center text-base"
        >
          <WhatsAppIcon />
          Enviar Comprovante para a Carol
        </a>
      </div>

      <div className="mt-8 flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-center">
        <a href={studio.mapsUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-1.5 font-bold text-berry underline underline-offset-4">
          <MapPin className="h-4 w-4" aria-hidden="true" />
          Ver rota no Maps
        </a>
        <Link href="/agendar" className="inline-flex min-h-11 items-center gap-1.5 font-bold text-berry underline underline-offset-4">
          <CalendarCheck className="h-4 w-4" aria-hidden="true" />
          Agendar outro horário
        </Link>
      </div>
    </main>
  );
}

function Row({ icon: Icon, label, value }: { icon: typeof Clock; label: string; value: string }) {
  return (
    <div className="flex items-start gap-3">
      <Icon className="mt-0.5 h-5 w-5 flex-none text-raspberry" aria-hidden="true" />
      <div className="min-w-0">
        <dt className="text-xs font-bold uppercase tracking-wide text-ink-soft">{label}</dt>
        <dd className="m-0 font-medium leading-snug text-ink">{value}</dd>
      </div>
    </div>
  );
}
