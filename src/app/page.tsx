import { ComboSection } from "@/components/landing/ComboSection";
import { Header } from "@/components/landing/Header";
import { Hero } from "@/components/landing/Hero";
import { Marquee } from "@/components/landing/Marquee";
import { MotionRoot, ScrollProgress, SparkleLayer } from "@/components/landing/motion";
import { ReviewsBlock } from "@/components/landing/Reviews";
import { FinalSection, LocationCard, WhatsAppFab } from "@/components/landing/Sections";
import { ServiceMenu } from "@/components/landing/ServiceMenu";
import { ShowcaseSection } from "@/components/landing/ShowcaseSection";
import { Section, SectionHead } from "@/components/landing/ui";

export default function HomePage() {
  return (
    <MotionRoot>
      <ScrollProgress />
      <SparkleLayer />
      <Header />
      <main id="topo" className="overflow-x-clip">
        <Hero />
        <Marquee />
        <ComboSection />

        <Section id="servicos" className="!pt-0">
          <SectionHead
            kicker="Tabela de preços"
            title={
              <>
                Escolha o <em>cuidado</em> de hoje
              </>
            }
            lead="Valores fixos e tempo estimado de cada atendimento. Toque em “Agendar” e escolha o horário."
          />
          <ServiceMenu />
        </Section>

        <ShowcaseSection />

        <Section id="avaliacoes">
          <ReviewsBlock />
          <LocationCard />
        </Section>

        <FinalSection />
      </main>
      <WhatsAppFab />
    </MotionRoot>
  );
}
