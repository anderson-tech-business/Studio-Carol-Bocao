export const brl = (n: number) => "R$ " + n.toLocaleString("pt-BR");

export function formatDuration(min: number): string {
  if (min < 60) return `${min} min`;
  const h = Math.floor(min / 60);
  const m = min % 60;
  return m ? `${h}h${String(m).padStart(2, "0")}` : `${h}h`;
}

const WEEKDAYS = ["domingo", "segunda", "terça", "quarta", "quinta", "sexta", "sábado"];
const WEEKDAYS_SHORT = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
const MONTHS_SHORT = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

/** "2026-11-20" -> { y, m, d } sem depender do fuso do navegador. */
export function parseISODate(iso: string): { y: number; m: number; d: number } | null {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
  if (!match) return null;
  const [y, m, d] = [Number(match[1]), Number(match[2]), Number(match[3])];
  const check = new Date(Date.UTC(y, m - 1, d));
  if (check.getUTCMonth() !== m - 1 || check.getUTCDate() !== d) return null;
  return { y, m, d };
}

function weekdayOf(iso: string): number {
  const p = parseISODate(iso);
  if (!p) return 0;
  return new Date(Date.UTC(p.y, p.m - 1, p.d)).getUTCDay();
}

/** "quinta-feira, 20/11/2026" */
export function formatLongDate(iso: string): string {
  const p = parseISODate(iso);
  if (!p) return iso;
  const wd = WEEKDAYS[weekdayOf(iso)];
  const suffix = wd === "sábado" || wd === "domingo" ? "" : "-feira";
  return `${wd}${suffix}, ${String(p.d).padStart(2, "0")}/${String(p.m).padStart(2, "0")}/${p.y}`;
}

export function dayChip(iso: string) {
  const p = parseISODate(iso);
  return {
    weekday: WEEKDAYS_SHORT[weekdayOf(iso)],
    day: p ? p.d : 0,
    month: p ? MONTHS_SHORT[p.m - 1] : "",
  };
}

/** Mantém só dígitos e aplica (11) 99999-9999 progressivamente. */
export function maskPhone(value: string): string {
  const d = value.replace(/\D/g, "").slice(0, 11);
  if (d.length === 0) return "";
  if (d.length <= 2) return `(${d}`;
  if (d.length <= 7) return `(${d.slice(0, 2)}) ${d.slice(2)}`;
  return `(${d.slice(0, 2)}) ${d.slice(2, 7)}-${d.slice(7)}`;
}

export const phoneDigits = (v: string) => v.replace(/\D/g, "");

export const isValidPhone = (v: string) => /^\d{2}9\d{8}$/.test(phoneDigits(v));
