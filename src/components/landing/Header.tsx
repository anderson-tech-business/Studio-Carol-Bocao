import Link from "next/link";
import { CalendarCheck } from "lucide-react";
import { PolishLogo } from "@/components/icons";

export function Header() {
  return (
    <header className="header" id="header">
      <div className="wrap">
        <Link href="/" className="logo" aria-label="Studio Carol Bocão, início">
          <PolishLogo />
          <span className="logo-txt">
            <b>
              carol <i>bocão</i>
            </b>
            <small>Nails &amp; Beauty</small>
          </span>
        </Link>
        <Link href="/agendar" className="btn btn-fill btn-sm">
          <CalendarCheck />
          Agendar Horário
        </Link>
      </div>
    </header>
  );
}
