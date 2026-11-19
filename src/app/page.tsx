import { Star } from "lucide-react";
import { Header } from "@/components/landing/Header";
import { Hero, Marquee } from "@/components/landing/Hero";
import { LandingEffects } from "@/components/landing/LandingEffects";
import { ReviewDeck } from "@/components/landing/ReviewDeck";
import { ComboSection, FinalSection, LocationCard, ShowcaseSection, WhatsAppFab } from "@/components/landing/Sections";
import { ServiceMenu } from "@/components/landing/ServiceMenu";
import { studio } from "@/data/mock";

function Stars() {
  const five = Array.from({ length: 5 }, (_, k) => <Star key={k} fill="currentColor" strokeWidth={0} />);
  return (
    <span className="stars" aria-label="5 de 5 estrelas">
      {five}
      <span className="on" aria-hidden="true">
        {Array.from({ length: 5 }, (_, k) => (
          <Star key={k} fill="currentColor" strokeWidth={0} />
        ))}
      </span>
    </span>
  );
}

export default function HomePage() {
  return (
    <>
      <LandingEffects />
      <Header />
      <main id="topo">
        <Hero />
        <Marquee />
        <ComboSection />

        <section className="sec" id="servicos" style={{ paddingTop: 0 }}>
          <div className="wrap">
            <div className="sec-head" data-anim="up">
              <span className="kicker">Tabela de preços</span>
              <h2 className="h2">
                Escolha o <em>cuidado</em> de hoje
              </h2>
              <p className="lead">Valores fixos e tempo estimado de cada atendimento. Toque em “Agendar” e escolha o horário.</p>
            </div>
            <ServiceMenu />
          </div>
        </section>

        <ShowcaseSection />

        <section className="sec" id="avaliacoes">
          <div className="wrap">
            <div className="reviews-grid">
              <div data-anim="up">
                <span className="kicker">Quem já veio</span>
                <div className="score" style={{ marginTop: 14 }}>
                  <div className="score-num">5,0</div>
                  <div className="score-side">
                    <Stars />
                    <span>
                      Nota no Google com <b>{studio.rating.count} avaliações</b>
                    </span>
                  </div>
                </div>
              </div>
              <ReviewDeck />
            </div>
            <LocationCard />
          </div>
        </section>

        <FinalSection />
      </main>
      <WhatsAppFab />
    </>
  );
}
