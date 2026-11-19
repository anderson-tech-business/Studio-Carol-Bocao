import Link from "next/link";
import { CalendarCheck, Clock, Eye, Flame, Footprints, Hand, MapPin } from "lucide-react";
import { InstagramIcon, WhatsAppIcon } from "@/components/icons";
import { combos, resale, services, studio } from "@/data/mock";
import { brl, formatDuration } from "@/lib/format";
import { OpenNow } from "./OpenNow";

function Connector() {
  return (
    <svg className="connector" viewBox="0 0 100 2" preserveAspectRatio="none" aria-hidden="true">
      <path d="M0 1 H100" style={{ strokeDasharray: "4 5" }} />
    </svg>
  );
}

export function ComboSection() {
  const combo = combos[0];
  const avulso = combo.includesServices.reduce((sum, slug) => sum + (services.find((s) => s.slug === slug)?.price ?? 0), 0);
  return (
    <section className="sec" id="combos">
      <div className="wrap">
        <div className="sec-head" data-anim="up">
          <span className="kicker">Combo da casa</span>
          <h2 className="h2">
            Do olhar até os pés, <em>numa tarde só</em>
          </h2>
        </div>
        <div className="ticket-wrap" data-anim="stamp">
          <article className="ticket">
            <div className="t-top">
              <span className="kicker">Ficha nº 01</span>
              <h3>
                Combo Beleza <span>Completa</span>
              </h3>
              {combo.badge && (
                <div className="stamp">
                  <Flame />
                  {combo.badge}
                </div>
              )}
              <div className="combo-path">
                <span className="cstep"><i><Eye /></i>Cílios</span>
                <Connector />
                <span className="cstep"><i><Hand /></i>Unhas</span>
                <Connector />
                <span className="cstep"><i><Footprints /></i>Pés</span>
              </div>
            </div>
            <div className="t-perf" />
            <div className="t-bottom">
              <div>
                <div className="price">
                  <small>R$</small>
                  <b data-count={combo.price}>{combo.price}</b>
                </div>
                <div className="price-note">
                  {formatDuration(combo.duration)} de atendimento · avulso sairia <s>{brl(avulso)}</s>
                </div>
              </div>
              <Link href={`/agendar?servico=${combo.slug}`} className="btn btn-fill">
                <CalendarCheck />
                Agendar o combo
              </Link>
            </div>
          </article>
        </div>
      </div>
    </section>
  );
}

function Earring({ shape, len }: { shape: "drop" | "hoop" | "dot"; len: number }) {
  return (
    <div className="swing" data-swing="">
      <svg width="44" height={len + 60} viewBox={`0 0 44 ${len + 60}`}>
        <path d={`M22 0 v${len}`} stroke="#B8893E" strokeWidth="2" />
        <circle cx="22" cy="2" r="3" fill="none" stroke="#B8893E" strokeWidth="2" />
        {shape === "drop" && (
          <>
            <path d={`M22 ${len} l14 16 -14 32 -14 -32z`} fill="#fff" stroke="#B8893E" strokeWidth="2.5" />
            <path d={`M8 ${len + 16} h28 M22 ${len} l-5 16 5 32 5-32z`} fill="none" stroke="#C9A25B" strokeWidth="1.2" />
          </>
        )}
        {shape === "hoop" && (
          <>
            <circle cx="22" cy={len + 20} r="18" fill="none" stroke="#C9A25B" strokeWidth="4" />
            <circle cx="22" cy={len + 38} r="4" fill="#B0306A" />
          </>
        )}
        {shape === "dot" && (
          <>
            <circle cx="22" cy={len + 14} r="12" fill="#F6D6E4" stroke="#B8893E" strokeWidth="2.5" />
            <circle cx="18" cy={len + 10} r="3" fill="#fff" />
          </>
        )}
      </svg>
    </div>
  );
}

function Hanger() {
  return (
    <div className="swing" data-swing="">
      <svg width="150" height="160" viewBox="0 0 150 160">
        <path d="M75 4 q10 0 10 9 q0 7 -10 12" fill="none" stroke="#7A1F4B" strokeWidth="3" strokeLinecap="round" />
        <path d="M75 25 L10 52 H140 Z" fill="none" stroke="#7A1F4B" strokeWidth="3" strokeLinejoin="round" />
        <path d="M30 52 Q36 90 66 92 Q75 84 75 78 Q75 84 84 92 Q114 90 120 52 Q102 46 98 56 L75 78 L52 56 Q48 46 30 52z" fill="#B0306A" />
        <path d="M38 64 Q52 84 66 86 M112 64 Q98 84 84 86" fill="none" stroke="#F6D6E4" strokeWidth="1.5" strokeDasharray="2 3" />
        <circle cx="75" cy="84" r="4" fill="#F6D6E4" />
        <path d="M40 104 Q75 114 110 104 Q104 134 75 136 Q46 134 40 104z" fill="#7A1F4B" />
        <path d="M75 92 v12" stroke="#7A1F4B" strokeWidth="1.5" strokeDasharray="2 2" />
      </svg>
    </div>
  );
}

export function ShowcaseSection() {
  const waText = encodeURIComponent("Oi Carol! Quero ver os modelos de semijoias e moda íntima.");
  return (
    <section className="sec shopband" id="vitrine">
      <canvas className="glit" id="glit" aria-hidden="true" />
      <div className="wrap">
        <div className="sec-head" data-anim="up">
          <span className="kicker" style={{ color: "var(--berry)" }}>Também no Studio</span>
          <h2 className="h2">
            Saia com a unha feita <em>e um mimo</em>
          </h2>
          <p className="lead" style={{ color: "var(--berry)" }}>
            Peças escolhidas pela Carol para ver de perto no studio ou por foto no WhatsApp.
          </p>
        </div>
        <div className="displays">
          {resale.map((item, i) => (
            <article key={item.slug} className="display" data-anim="tilt" style={{ transitionDelay: `${i * 120}ms` }}>
              <div className="disp-top">
                <h3>{item.name}</h3>
                <div className="from">
                  a partir de<b>{brl(item.priceFrom)}</b>
                </div>
              </div>
              <div className={`rack ${item.kind === "jewel" ? "gold" : ""}`} aria-hidden="true">
                {item.kind === "jewel" ? (
                  <>
                    <Earring shape="drop" len={40} />
                    <Earring shape="hoop" len={26} />
                    <Earring shape="dot" len={56} />
                  </>
                ) : (
                  <Hanger />
                )}
              </div>
              <p>{item.description}</p>
              <div className="tags">
                {item.tags.map((t) => (
                  <span key={t}>{t}</span>
                ))}
              </div>
            </article>
          ))}
        </div>
        <div className="shop-cta" data-anim="up">
          <a className="btn btn-wa" href={`https://wa.me/${studio.whatsapp}?text=${waText}`} target="_blank" rel="noopener noreferrer">
            <WhatsAppIcon />
            Consultar modelos no WhatsApp
          </a>
          <small>Sem loja on-line: a Carol manda fotos e valores atualizados.</small>
        </div>
      </div>
    </section>
  );
}

export function LocationCard() {
  return (
    <div className="postal" id="local" data-anim="up">
      <div className="stampbox" aria-hidden="true"><span /></div>
      <div className="postmark" aria-hidden="true">
        <svg viewBox="0 0 120 120">
          <defs>
            <path id="circ2" d="M60,60 m-44,0 a44,44 0 1,1 88,0 a44,44 0 1,1 -88,0" />
          </defs>
          <circle cx="60" cy="60" r="56" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <circle cx="60" cy="60" r="32" fill="none" stroke="currentColor" strokeWidth="1" />
          <text>
            <textPath href="#circ2">GLEBA DO PÊSSEGO · SÃO PAULO · SP · </textPath>
          </text>
        </svg>
      </div>
      <div className="postal-map" role="img" aria-label="Mapa ilustrativo da R. Emburi, 72">
        <svg className="streets" viewBox="0 0 400 260" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
          <rect width="400" height="260" fill="#FBEAF1" />
          <g fill="#F6D6E4">
            <rect x="20" y="20" width="110" height="70" rx="8" />
            <rect x="150" y="20" width="80" height="70" rx="8" />
            <rect x="250" y="20" width="130" height="90" rx="8" />
            <rect x="20" y="110" width="90" height="130" rx="8" />
            <rect x="130" y="130" width="70" height="110" rx="8" />
            <rect x="250" y="135" width="60" height="105" rx="8" />
            <rect x="330" y="135" width="50" height="105" rx="8" />
          </g>
          <g stroke="#fff" strokeWidth="12" fill="none" strokeLinecap="round">
            <path d="M0 100 H400" />
            <path d="M140 0 V260" />
            <path d="M240 0 V260" />
            <path d="M215 100 C 220 160, 230 200, 320 260" />
          </g>
          <text x="16" y="96" fontFamily="DM Sans, sans-serif" fontSize="9" fill="#9E5C7B" letterSpacing="1">R. EMBURI</text>
        </svg>
        <span className="pin">
          <svg viewBox="0 0 24 24">
            <path fill="currentColor" d="M12 1.5a8.5 8.5 0 0 0-8.5 8.5c0 5.6 6.6 11.6 7.7 12.5a1.2 1.2 0 0 0 1.6 0c1.1-.9 7.7-6.9 7.7-12.5A8.5 8.5 0 0 0 12 1.5" />
            <circle cx="12" cy="10" r="3.2" fill="#fff" />
          </svg>
        </span>
      </div>
      <div className="postal-body">
        <span className="kicker">Como chegar</span>
        <h3>Te esperamos na R. Emburi, 72</h3>
        <div className="pline"><MapPin /><span><b>R. Emburi, 72</b> – Gleba do Pêssego, São Paulo/SP</span></div>
        <div className="pline"><Clock /><span><b>{studio.hours.open} às {studio.hours.close}</b>, sempre com hora marcada</span></div>
        <OpenNow />
        <div className="pline">
          <InstagramIcon />
          <span>
            Trabalhos recentes em{" "}
            <a href={studio.instagramUrl} target="_blank" rel="noopener noreferrer" style={{ color: "var(--raspberry)", fontWeight: 700 }}>
              {studio.instagram}
            </a>
          </span>
        </div>
        <a className="btn btn-fill" style={{ justifySelf: "start" }} href={studio.mapsUrl} target="_blank" rel="noopener noreferrer">
          <MapPin />
          Abrir rota no Maps
        </a>
      </div>
    </div>
  );
}

export function FinalSection() {
  return (
    <section className="final" id="final">
      <div className="wrap">
        <div data-anim="up" style={{ display: "grid", gap: 18, justifyItems: "start" }}>
          <h2>
            Seu horário está <em>a dois toques</em>.
          </h2>
          <Link href="/agendar" className="btn btn-fill">
            <CalendarCheck />
            Agendar Horário
          </Link>
        </div>
        <div className="giant" id="giant" aria-hidden="true">carol bocão</div>
        <div className="foot-info">
          <span>Studio Carol Bocão · Nails &amp; Beauty</span>
          <span>
            {studio.address} · WhatsApp {studio.whatsappDisplay} ·{" "}
            <a href={studio.instagramUrl} target="_blank" rel="noopener noreferrer">{studio.instagram}</a>
          </span>
          <span className="note">
            Protótipo visual de demonstração. Agendamentos simulados. ·{" "}
            <Link href="/admin">Área da Carol</Link>
          </span>
        </div>
      </div>
    </section>
  );
}

export function WhatsAppFab() {
  return (
    <a className="fab" href={`https://wa.me/${studio.whatsapp}`} target="_blank" rel="noopener noreferrer" aria-label="Conversar no WhatsApp">
      <WhatsAppIcon />
      <span className="fab-tip">Fale com a Carol</span>
    </a>
  );
}
