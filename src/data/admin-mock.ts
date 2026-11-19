/**
 * Dados mockados do painel da Carol (/admin).
 * Valores ilustrativos para a demonstração; nada é salvo em servidor.
 */

export type AppointmentStatus = "confirmado" | "concluido" | "cancelado";

export interface Appointment {
  id: string;
  time: string;
  client: string;
  phone: string;
  /** Slug de serviço ou combo em `bookables` (src/data/mock.ts). */
  service: string;
  status: AppointmentStatus;
  origin: "site" | "balcao" | "telefone" | "whatsapp";
}

export const todayAppointments: Appointment[] = [
  { id: "a1", time: "08:00", client: "Juliana", phone: "(11) 98765-4321", service: "molde-f1", status: "concluido", origin: "site" },
  { id: "a2", time: "10:30", client: "Mariana", phone: "(11) 97123-5566", service: "combo-beleza-completa", status: "confirmado", origin: "whatsapp" },
  { id: "a3", time: "14:00", client: "Fernanda", phone: "(11) 96655-2210", service: "progressiva", status: "confirmado", origin: "site" },
  { id: "a4", time: "16:30", client: "Beatriz", phone: "(11) 99812-7734", service: "esmaltacao-em-gel", status: "confirmado", origin: "telefone" },
];

/** Horários que a Carol pode usar ao remarcar ou lançar no balcão. */
export const adminTimeSlots = [
  "07:30", "08:00", "08:30", "09:00", "09:30", "10:00", "10:30", "11:00", "11:30",
  "13:00", "13:30", "14:00", "14:30", "15:00", "15:30", "16:00", "16:30",
];

export interface MonthFinance {
  revenue: number;
  profit: number;
}

/** Últimos 4 meses, do mais antigo para o atual. */
export const lastMonths: MonthFinance[] = [
  { revenue: 4120, profit: 3050 },
  { revenue: 4380, profit: 3290 },
  { revenue: 4610, profit: 3480 },
  { revenue: 4850, profit: 3730 },
];

/** Atendimentos/vendas do mês atual (para o ticket médio). */
export const currentMonthTransactions = 62;

export type FinanceLine = "servicos" | "revenda";

export interface CategoryFinance {
  line: FinanceLine;
  label: string;
  detail: string;
  revenue: number;
  cost: number;
  /** Custo médio estimado sobre o preço de venda, usado ao registrar vendas novas. */
  costRate: number;
}

/** Mês atual separado por linha de negócio. Soma: R$ 4.850 bruto, R$ 1.120 custos, R$ 3.730 lucro. */
export const categoryFinance: CategoryFinance[] = [
  { line: "servicos", label: "Serviços de Unhas/Cílios", detail: "Unhas, pés, cílios e cabelo", revenue: 4180, cost: 752, costRate: 0.18 },
  { line: "revenda", label: "Revenda de Semijoias e Moda Íntima", detail: "Peças compradas para revenda", revenue: 670, cost: 368, costRate: 0.55 },
];

export interface SaleOption {
  id: string;
  label: string;
  line: FinanceLine;
  suggestedPrice: number;
}

export const saleOptions: SaleOption[] = [
  { id: "semijoia-brinco", label: "Semijoia · Brinco", line: "revenda", suggestedPrice: 25 },
  { id: "semijoia-colar", label: "Semijoia · Colar", line: "revenda", suggestedPrice: 45 },
  { id: "intima-conjunto", label: "Moda Íntima · Conjunto", line: "revenda", suggestedPrice: 59 },
  { id: "intima-calcinha", label: "Moda Íntima · Calcinha", line: "revenda", suggestedPrice: 15 },
  { id: "servico-avulso", label: "Serviço avulso (balcão)", line: "servicos", suggestedPrice: 65 },
];
