import { busySlotsPerDay, studio, timeSlots } from "@/data/mock";

/** Data/hora "agora" no fuso do studio, sem depender do fuso do aparelho. */
export function nowInStudio(): { iso: string; minutes: number; weekday: number } {
  const parts = new Intl.DateTimeFormat("en-CA", {
    timeZone: studio.timezone,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
    hour: "2-digit",
    minute: "2-digit",
    hourCycle: "h23",
    weekday: "short",
  }).formatToParts(new Date());
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const iso = `${get("year")}-${get("month")}-${get("day")}`;
  const minutes = Number(get("hour")) * 60 + Number(get("minute"));
  const weekday = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].indexOf(get("weekday"));
  return { iso, minutes, weekday };
}

function addDaysISO(iso: string, n: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + n));
  return dt.toISOString().slice(0, 10);
}

/** Próximos 7 dias de atendimento (pula os dias em que o studio fecha). */
export function nextWorkingDays(count = 7): string[] {
  const { iso } = nowInStudio();
  const out: string[] = [];
  for (let i = 0; out.length < count && i < 21; i++) {
    const day = addDaysISO(iso, i);
    const wd = new Date(day + "T12:00:00Z").getUTCDay();
    if (studio.workingDays.includes(wd)) out.push(day);
  }
  return out;
}

export const toMinutes = (hhmm: string) => {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
};

/** Hash simples e estável para escolher os horários "ocupados" de cada dia. */
function hash(str: string): number {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export type SlotStatus = "free" | "busy" | "past" | "too-long";

export interface Slot {
  time: string;
  status: SlotStatus;
}

/**
 * Horários do dia com status mockado:
 * - 2 horários "Ocupado" por dia (determinístico por data);
 * - horários que já passaram (hoje) ficam indisponíveis;
 * - horários em que o serviço terminaria depois do fechamento ficam indisponíveis.
 */
export function slotsFor(dayISO: string, durationMin: number): Slot[] {
  const seed = hash(dayISO);
  const busy = new Set<number>();
  let k = 0;
  while (busy.size < busySlotsPerDay && k < 20) {
    busy.add(hash(`${seed}-${k}`) % timeSlots.length);
    k++;
  }
  const now = nowInStudio();
  const close = toMinutes(studio.hours.close);

  return timeSlots.map((time, i) => {
    const start = toMinutes(time);
    let status: SlotStatus = "free";
    if (busy.has(i)) status = "busy";
    else if (dayISO === now.iso && start <= now.minutes + 30) status = "past";
    else if (start + durationMin > close) status = "too-long";
    return { time, status };
  });
}

export function isSlotBookable(dayISO: string, time: string, durationMin: number): boolean {
  return slotsFor(dayISO, durationMin).some((s) => s.time === time && s.status === "free");
}
