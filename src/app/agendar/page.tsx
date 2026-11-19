import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingShell } from "@/components/booking/BookingShell";
import { BookingWizard } from "@/components/booking/BookingWizard";

export const metadata: Metadata = {
  title: "Agendar horário | Studio Carol Bocão",
  description: "Escolha o serviço, a profissional, o dia e o horário em quatro passos.",
};

export default function AgendarPage() {
  return (
    <BookingShell>
      <Suspense fallback={<p className="px-4 py-10 text-center text-ink-soft">Carregando agenda…</p>}>
        <BookingWizard />
      </Suspense>
    </BookingShell>
  );
}
