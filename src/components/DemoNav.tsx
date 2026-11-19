"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { CalendarCheck, LayoutDashboard, Sparkles } from "lucide-react";

const LINKS = [
  { href: "/", label: "Site", short: "Site", icon: Sparkles, match: (p: string) => p === "/" },
  { href: "/agendar", label: "Agendamento", short: "Agendar", icon: CalendarCheck, match: (p: string) => p.startsWith("/agendar") || p.startsWith("/agendamento") },
  { href: "/admin", label: "Painel da Carol", short: "Painel", icon: LayoutDashboard, match: (p: string) => p.startsWith("/admin") },
];

/**
 * Barra da demonstração: liga as três partes do protótipo (landing, agendamento
 * e painel) para quem estiver avaliando navegar entre elas. Não é fixa, então
 * não disputa espaço com os cabeçalhos sticky e barras inferiores das telas.
 */
export function DemoNav() {
  const pathname = usePathname() ?? "/";
  const onAdmin = pathname.startsWith("/admin");

  return (
    <nav aria-label="Navegação da demonstração" className="relative z-[90] bg-cap font-body text-white pt-[env(safe-area-inset-top)]">
      <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-x-3 gap-y-1 px-4 py-1.5">
        <span className="hidden text-xs font-bold uppercase tracking-[0.14em] text-blush sm:inline">Demonstração</span>
        <ul className="flex flex-1 items-center justify-center gap-1 sm:flex-none">
          {LINKS.map(({ href, label, short, icon: Icon, match }) => {
            const active = match(pathname);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  className={`inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-[13px] font-bold transition focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white ${
                    active ? "bg-white text-berry" : "text-white hover:bg-white/15"
                  }`}
                >
                  <Icon className="h-4 w-4" aria-hidden="true" />
                  <span className="sm:hidden">{short}</span>
                  <span className="hidden sm:inline">{label}</span>
                </Link>
              </li>
            );
          })}
        </ul>
        {onAdmin && (
          <span className="w-full text-center text-xs text-blush sm:w-auto">
            Login: <b className="text-white">adm@gmail.com</b> · senha <b className="text-white">adm123@</b>
          </span>
        )}
      </div>
    </nav>
  );
}
