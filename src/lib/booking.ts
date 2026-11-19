import { findBookable, findProfessional, studio, type Bookable, type Professional } from "@/data/mock";
import { brl, formatDuration, formatLongDate, isValidPhone, parseISODate, phoneDigits } from "@/lib/format";

/** Dados de um agendamento, transportados entre as telas via query params. */
export interface BookingData {
  servico: string;
  profissional: string;
  data: string;
  horario: string;
  nome: string;
  whatsapp: string;
}

export const BOOKING_KEYS: (keyof BookingData)[] = ["servico", "profissional", "data", "horario", "nome", "whatsapp"];

export function toQuery(data: BookingData): string {
  const params = new URLSearchParams();
  for (const key of BOOKING_KEYS) params.set(key, data[key]);
  return params.toString();
}

export interface ResolvedBooking {
  data: BookingData;
  service: Bookable;
  professional: Professional;
}

/** Valida os query params da confirmação contra os dados do mock. */
export function resolveBooking(get: (key: string) => string | null): ResolvedBooking | null {
  const data = Object.fromEntries(BOOKING_KEYS.map((k) => [k, (get(k) ?? "").trim()])) as unknown as BookingData;
  const service = findBookable(data.servico);
  const professional = findProfessional(data.profissional);
  if (!service || !professional) return null;
  if (!parseISODate(data.data)) return null;
  if (!/^\d{2}:\d{2}$/.test(data.horario)) return null;
  if (data.nome.length < 2 || !isValidPhone(data.whatsapp)) return null;
  return { data, service, professional };
}

export function whatsappReceiptUrl({ data, service, professional }: ResolvedBooking): string {
  const text = [
    `Olá, Carol! Aqui é ${data.nome}. Segue o comprovante do meu agendamento:`,
    "",
    `*Serviço:* ${service.name} (${brl(service.price)})`,
    `*Data:* ${formatLongDate(data.data)}`,
    `*Horário:* ${data.horario} (duração aprox. ${formatDuration(service.duration)})`,
    `*Profissional:* ${professional.name}`,
    `*Meu WhatsApp:* ${data.whatsapp}`,
    "",
    "Até lá! 💅",
  ].join("\n");
  return `https://wa.me/${studio.whatsapp}?text=${encodeURIComponent(text)}`;
}

export const DRAFT_KEY = "scb-agendamento-rascunho";

export type Draft = Partial<BookingData> & { step?: number };

export function readDraft(): Draft {
  try {
    const raw = localStorage.getItem(DRAFT_KEY);
    return raw ? (JSON.parse(raw) as Draft) : {};
  } catch {
    return {};
  }
}

export function writeDraft(draft: Draft): void {
  try {
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  } catch {
    /* armazenamento indisponível: segue sem rascunho */
  }
}

export function clearDraft(): void {
  try {
    localStorage.removeItem(DRAFT_KEY);
  } catch {
    /* noop */
  }
}

export { phoneDigits };
