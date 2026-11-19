/**
 * Dados mockados do Studio Carol Bocão | Nails & Beauty.
 * Protótipo 100% front-end: sem banco de dados, sem autenticação.
 */

export type CategoryId = "unhas" | "pes" | "olhar" | "cabelo";

export interface Studio {
  name: string;
  shortName: string;
  address: string;
  addressShort: string;
  neighborhood: string;
  city: string;
  whatsapp: string;
  whatsappDisplay: string;
  instagram: string;
  instagramUrl: string;
  mapsUrl: string;
  hours: { open: string; close: string };
  /** Dias de atendimento (0 = domingo … 6 = sábado). */
  workingDays: number[];
  timezone: string;
  rating: { score: number; count: number };
}

export interface Category {
  id: CategoryId;
  label: string;
  /** Cor do "frasquinho" da aba. */
  color: string;
}

export interface Service {
  slug: string;
  name: string;
  price: number;
  /** Duração em minutos. */
  duration: number;
  category: CategoryId;
  description: string;
}

export interface Combo {
  slug: string;
  name: string;
  includes: string[];
  /** Slugs dos serviços avulsos usados para mostrar a economia. */
  includesServices: string[];
  price: number;
  duration: number;
  badge?: string;
}

export interface ResaleItem {
  slug: string;
  name: string;
  priceFrom: number;
  kind: "jewel" | "lingerie";
  description: string;
  tags: string[];
}

export interface Professional {
  slug: string;
  name: string;
  role: string;
  bio: string;
  featured: boolean;
}

export interface Review {
  name: string;
  when: string;
  color: string;
  text: string;
}

export const studio: Studio = {
  name: "Studio Carol Bocão | Nails & Beauty",
  shortName: "Studio Carol Bocão",
  address: "R. Emburi, 72 - Gleba do Pêssego, São Paulo/SP",
  addressShort: "R. Emburi, 72 - Gleba do Pêssego",
  neighborhood: "Gleba do Pêssego",
  city: "São Paulo/SP",
  whatsapp: "5511981991410",
  whatsappDisplay: "(11) 98199-1410",
  instagram: "@carolbocaoo",
  instagramUrl: "https://instagram.com/carolbocaoo",
  mapsUrl:
    "https://www.google.com/maps/search/?api=1&query=R.+Emburi,+72+-+Gleba+do+P%C3%AAssego,+S%C3%A3o+Paulo+-+SP",
  hours: { open: "07:30", close: "17:00" },
  workingDays: [1, 2, 3, 4, 5, 6],
  timezone: "America/Sao_Paulo",
  rating: { score: 5.0, count: 37 },
};

export const categories: Category[] = [
  { id: "unhas", label: "Unhas", color: "#B0306A" },
  { id: "pes", label: "Pés", color: "#F2A9C8" },
  { id: "olhar", label: "Olhar", color: "#7A1F4B" },
  { id: "cabelo", label: "Cabelo", color: "#C9A25B" },
];

export const services: Service[] = [
  { slug: "cutilagem-e-esmaltacao", name: "Cutilagem e esmaltação", price: 35, duration: 45, category: "unhas", description: "Cutícula bem feita e esmalte tradicional." },
  { slug: "esmaltacao-em-gel", name: "Esmaltação em gel", price: 65, duration: 60, category: "unhas", description: "Brilho que dura semanas sem lascar." },
  { slug: "molde-f1", name: "Molde F1", price: 110, duration: 120, category: "unhas", description: "Alongamento com formato natural e resistente." },
  { slug: "postica-realista", name: "Postiça realista", price: 80, duration: 90, category: "unhas", description: "Unhas prontas com acabamento natural." },
  { slug: "blindagem", name: "Blindagem", price: 60, duration: 60, category: "unhas", description: "Camada protetora para a unha natural." },
  { slug: "pedicure", name: "Pedicure", price: 40, duration: 45, category: "pes", description: "Cutilagem, lixa e esmaltação dos pés." },
  { slug: "plastica-dos-pes", name: "Plástica dos pés", price: 75, duration: 60, category: "pes", description: "Esfoliação, calosidades e hidratação." },
  { slug: "extensao-de-cilios", name: "Extensão de Cílios", price: 95, duration: 90, category: "olhar", description: "Fios aplicados um a um, efeito leve." },
  { slug: "progressiva", name: "Progressiva", price: 150, duration: 150, category: "cabelo", description: "Alinha os fios e reduz o volume." },
];

export const combos: Combo[] = [
  {
    slug: "combo-beleza-completa",
    name: "Combo Beleza Completa (Cílios + Unhas + Pés)",
    includes: ["Cílios", "Unhas", "Pés"],
    includesServices: ["extensao-de-cilios", "esmaltacao-em-gel", "pedicure"],
    price: 120,
    duration: 150,
    badge: "Mais Pedido",
  },
];

export const resale: ResaleItem[] = [
  { slug: "semijoias", name: "Semijoias que não escurecem", priceFrom: 10, kind: "jewel", description: "Brincos, colares e anéis com banho resistente para usar todo dia.", tags: ["Brincos", "Colares", "Anéis", "Pulseiras"] },
  { slug: "moda-intima", name: "Moda Íntima", priceFrom: 15, kind: "lingerie", description: "Conjuntos, sutiãs e calcinhas confortáveis, do P ao GG.", tags: ["Conjuntos", "Sutiãs", "Calcinhas"] },
];

export const professionals: Professional[] = [
  { slug: "carol-bocao", name: "Carol Bocão", role: "Especialista", bio: "Dona do studio. Atende unhas, pés, cílios e cabelo.", featured: true },
  { slug: "primeira-disponivel", name: "Primeira disponível", role: "Equipe do studio", bio: "Quem tiver o horário livre mais cedo atende você.", featured: false },
];

export const reviews: Review[] = [
  { name: "Juliana M.", when: "há 2 semanas", color: "#B0306A", text: "Fiz o molde F1 e ficou exatamente no formato que pedi. Já estou na terceira manutenção e não descolou nenhuma." },
  { name: "Patrícia S.", when: "há 1 mês", color: "#7A1F4B", text: "Ambiente limpinho e a Carol é muito caprichosa na cutícula. Pontual no horário marcado, coisa rara." },
  { name: "Renata A.", when: "há 2 meses", color: "#C9A25B", text: "Fiz o combo com cílios e pés numa tarde só. Saí renovada e o preço foi justo. Ainda levei um brinco." },
];

/** Grade fixa de horários oferecidos por dia (mock). */
export const timeSlots = ["08:00", "09:30", "11:00", "13:30", "15:00", "16:30"] as const;

/** Quantos horários aparecem como "Ocupado" em cada dia (mock de realismo). */
export const busySlotsPerDay = 2;

/** Serviço ou combo selecionável no agendamento. */
export interface Bookable {
  slug: string;
  name: string;
  price: number;
  duration: number;
  kind: "service" | "combo";
  category?: CategoryId;
  description: string;
}

export const bookables: Bookable[] = [
  ...combos.map<Bookable>((c) => ({
    slug: c.slug,
    name: c.name,
    price: c.price,
    duration: c.duration,
    kind: "combo",
    description: c.includes.join(" + "),
  })),
  ...services.map<Bookable>((s) => ({
    slug: s.slug,
    name: s.name,
    price: s.price,
    duration: s.duration,
    kind: "service",
    category: s.category,
    description: s.description,
  })),
];

export function findBookable(slug: string | null | undefined): Bookable | undefined {
  if (!slug) return undefined;
  return bookables.find((b) => b.slug === slug);
}

export function findProfessional(slug: string | null | undefined): Professional | undefined {
  if (!slug) return undefined;
  return professionals.find((p) => p.slug === slug);
}
