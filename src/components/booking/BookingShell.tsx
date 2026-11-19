import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { PolishLogo } from "@/components/icons";

/** Moldura simples das telas de agendamento: logo + voltar ao site. */
export function BookingShell({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-dvh bg-blush-soft font-body text-ink">
      <header className="sticky top-0 z-40 border-b border-line bg-white/95 backdrop-blur pt-[env(safe-area-inset-top)]">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3">
          <Link href="/" className="logo" aria-label="Studio Carol Bocão, voltar ao início">
            <PolishLogo />
            <span className="logo-txt">
              <b>
                carol <i>bocão</i>
              </b>
              <small>Nails &amp; Beauty</small>
            </span>
          </Link>
          <Link
            href="/"
            className="inline-flex min-h-11 items-center gap-1.5 rounded-full px-3 font-display text-sm font-bold text-berry transition hover:bg-blush-soft"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Voltar ao site
          </Link>
        </div>
      </header>
      {children}
    </div>
  );
}
