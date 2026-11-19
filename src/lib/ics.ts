/**
 * Geração client-side de um arquivo iCalendar (.ics, RFC 5545) com dois alarmes.
 * O horário é convertido para UTC (America/Sao_Paulo é UTC-3 fixo desde 2019),
 * o que evita depender de VTIMEZONE e funciona no iOS, Android e Google Agenda.
 */

export interface CalendarEventInput {
  title: string;
  description: string;
  location: string;
  /** "YYYY-MM-DD" no fuso do studio. */
  date: string;
  /** "HH:MM" no fuso do studio. */
  time: string;
  durationMinutes: number;
  /** Diferença do fuso do studio para UTC, em horas (São Paulo = -3). */
  utcOffsetHours?: number;
  organizerName?: string;
}

const pad = (n: number) => String(n).padStart(2, "0");

function toUtcStamp(d: Date): string {
  return (
    d.getUTCFullYear() +
    pad(d.getUTCMonth() + 1) +
    pad(d.getUTCDate()) +
    "T" +
    pad(d.getUTCHours()) +
    pad(d.getUTCMinutes()) +
    pad(d.getUTCSeconds()) +
    "Z"
  );
}

/** Escapa texto conforme RFC 5545 §3.3.11. */
function escapeText(value: string): string {
  return value
    .replace(/\\/g, "\\\\")
    .replace(/;/g, "\\;")
    .replace(/,/g, "\\,")
    .replace(/\r?\n/g, "\\n");
}

/** Dobra linhas com mais de 75 octetos (RFC 5545 §3.1), sem quebrar caracteres UTF-8. */
function foldLine(line: string): string {
  const encoder = new TextEncoder();
  if (encoder.encode(line).length <= 75) return line;
  const out: string[] = [];
  let current = "";
  let size = 0;
  for (const ch of line) {
    const chSize = encoder.encode(ch).length;
    const limit = out.length === 0 ? 75 : 74; // linhas de continuação começam com espaço
    if (size + chSize > limit) {
      out.push(current);
      current = "";
      size = 0;
    }
    current += ch;
    size += chSize;
  }
  out.push(current);
  return out.join("\r\n ");
}

export function buildICS(input: CalendarEventInput): string {
  const offset = input.utcOffsetHours ?? -3;
  const [y, m, d] = input.date.split("-").map(Number);
  const [hh, mm] = input.time.split(":").map(Number);
  const start = new Date(Date.UTC(y, m - 1, d, hh - offset, mm));
  const end = new Date(start.getTime() + input.durationMinutes * 60_000);
  const uid = `${input.date.replace(/-/g, "")}T${input.time.replace(":", "")}-${Math.random()
    .toString(36)
    .slice(2, 10)}@studiocarolbocao`;

  const lines = [
    "BEGIN:VCALENDAR",
    "VERSION:2.0",
    "PRODID:-//Studio Carol Bocao//Agendamento//PT-BR",
    "CALSCALE:GREGORIAN",
    "METHOD:PUBLISH",
    "BEGIN:VEVENT",
    `UID:${uid}`,
    `DTSTAMP:${toUtcStamp(new Date())}`,
    `DTSTART:${toUtcStamp(start)}`,
    `DTEND:${toUtcStamp(end)}`,
    `SUMMARY:${escapeText(input.title)}`,
    `DESCRIPTION:${escapeText(input.description)}`,
    `LOCATION:${escapeText(input.location)}`,
    "STATUS:CONFIRMED",
    "TRANSP:OPAQUE",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(`Amanhã: ${input.title}`)}`,
    "TRIGGER:-PT24H",
    "END:VALARM",
    "BEGIN:VALARM",
    "ACTION:DISPLAY",
    `DESCRIPTION:${escapeText(`Em 2 horas: ${input.title}`)}`,
    "TRIGGER:-PT2H",
    "END:VALARM",
    "END:VEVENT",
    "END:VCALENDAR",
  ];

  return lines.map(foldLine).join("\r\n") + "\r\n";
}

/** Gera o .ics e dispara o download no navegador. */
export function downloadICS(input: CalendarEventInput, filename = "agendamento-studio-carol-bocao.ics"): void {
  const content = buildICS(input);
  const blob = new Blob([content], { type: "text/calendar;charset=utf-8" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.rel = "noopener";
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 10_000);
}
