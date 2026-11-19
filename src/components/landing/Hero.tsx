import Link from "next/link";
import type { CSSProperties } from "react";
import { CalendarCheck, Clock, MapPin } from "lucide-react";
import { WhatsAppIcon } from "@/components/icons";
import { studio } from "@/data/mock";

const v = (vars: Record<string, string>) => vars as CSSProperties;

const DRIPS = [
  { x: 22, w: 16, h: 64, dd: "5s" },
  { x: 78, w: 12, h: 40, dd: "7s" },
  { x: 134, w: 20, h: 86, dd: "6s" },
  { x: 205, w: 12, h: 46, dd: "4.6s" },
  { x: 262, w: 18, h: 74, dd: "6.6s" },
  { x: 330, w: 14, h: 52, dd: "5.4s" },
  { x: 372, w: 16, h: 92, dd: "7.4s" },
];

export function Hero() {
  const waText = encodeURIComponent("Oi Carol! Gostaria de agendar um horário.");
  return (
    <section className="hero">
      <svg className="drips" viewBox="0 0 400 150" preserveAspectRatio="xMidYMin slice" aria-hidden="true">
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="b" />
            <feColorMatrix in="b" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10" />
          </filter>
        </defs>
        <g filter="url(#goo)" fill="#7A1F4B">
          <rect x="-10" y="-6" width="420" height="18" />
          {DRIPS.map((d) => (
            <rect key={d.x} className="d" x={d.x} y="0" width={d.w} height={d.h} rx={d.w / 2} style={v({ "--dd": d.dd })} />
          ))}
          <circle className="drop" cx="144" cy="80" r="8" style={v({ "--dd": "6s" })} />
          <circle className="drop" cx="271" cy="70" r="7" style={{ ...v({ "--dd": "6.6s" }), animationDelay: "-2s" }} />
          <circle className="drop" cx="380" cy="86" r="7" style={{ ...v({ "--dd": "7.4s" }), animationDelay: "-4s" }} />
        </g>
      </svg>

      <div className="wrap">
        <div className="hero-copy">
          <span className="hero-tag">
            <span className="dot" />
            Gleba do Pêssego · Zona Leste · SP
          </span>
          <h1>
            <span className="line"><span style={v({ "--ld": ".05s" })}>Unhas</span></span>
            <span className="line"><span className="fill-text" style={v({ "--ld": ".15s" })}>impecáveis</span></span>
            <span className="line"><span style={v({ "--ld": ".25s" })}>e beleza em</span></span>
            <span className="line"><span className="gloss" style={v({ "--ld": ".35s" })}>um só lugar</span></span>
          </h1>
          <p className="hero-sub">
            Esmaltação, alongamento, pés, cílios e cabelo com hora marcada, no capricho da Carol. Atendimento na{" "}
            <b>Gleba do Pêssego</b>, pertinho de você.
          </p>
          <div className="hero-ctas">
            <Link href="/agendar" className="btn btn-white">
              <CalendarCheck />
              Agendar Horário
            </Link>
            <a className="btn btn-line" href={`https://wa.me/${studio.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer">
              <WhatsAppIcon />
              Chamar no WhatsApp
            </a>
          </div>
          <div className="hero-facts">
            <span><MapPin />R. Emburi, 72</span>
            <span><Clock />{studio.hours.open} às {studio.hours.close}</span>
          </div>
        </div>

        <div className="stage" aria-hidden="true">
          <span className="nail-float nf1" />
          <span className="nail-float nf2" />
          <span className="nail-float nf3" />
          <div className="bottle">
            <div className="bottle-inner">
              <div className="b-cap" />
              <div className="b-neck" />
              <div className="b-glass">
                <div className="b-liquid" />
                <div className="b-shine" />
                <div className="b-label">
                  <small>Studio</small>
                  <b>Nº 72</b>
                  <small>Raspberry</small>
                </div>
              </div>
            </div>
          </div>
          <div className="badge-rot">
            <svg className="ring" viewBox="0 0 120 120">
              <defs>
                <path id="circ1" d="M60,60 m-46,0 a46,46 0 1,1 92,0 a46,46 0 1,1 -92,0" />
              </defs>
              <text>
                <textPath href="#circ1">Nota no Google · {studio.rating.count} avaliações · </textPath>
              </text>
            </svg>
            <div className="core">
              <div>
                <b>5,0</b>
                <small>★★★★★</small>
              </div>
            </div>
          </div>
        </div>
      </div>
      <svg className="hero-wave" viewBox="0 0 400 70" preserveAspectRatio="none" aria-hidden="true">
        <path d="M0 40 C 60 10, 120 70, 200 38 S 340 10, 400 36 V70 H0z" fill="#fff" />
      </svg>
    </section>
  );
}

export function Marquee() {
  const rowA = ["Esmaltação em gel", "Molde F1", "Blindagem", "Postiça realista"];
  const rowB = ["Extensão de cílios", "Plástica dos pés", "Progressiva", "Pedicure"];
  const Row = ({ items }: { items: string[] }) => (
    <span>
      {items.map((t) => (
        <span key={t} style={{ display: "contents" }}>
          {t} <i>✦</i>
        </span>
      ))}
    </span>
  );
  return (
    <div className="marq" id="marq" aria-hidden="true">
      <div className="marq-row a">
        <div className="marq-track"><Row items={rowA} /><Row items={rowA} /></div>
      </div>
      <div className="marq-row b">
        <div className="marq-track"><Row items={rowB} /><Row items={rowB} /></div>
      </div>
    </div>
  );
}
