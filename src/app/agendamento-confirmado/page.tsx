import type { Metadata } from "next";
import { Suspense } from "react";
import { BookingShell } from "@/components/booking/BookingShell";
import { Confirmation } from "@/components/booking/Confirmation";

export const metadata: Metadata = {
  title: "Agendamento confirmado | Studio Carol Bocão",
  description: "Resumo do seu horário no Studio Carol Bocão.",
  robots: { index: false },
};

export default function AgendamentoConfirmadoPage() {
  return (
    <BookingShell>
      <Suspense fallback={<p className="px-4 py-10 text-center text-ink-soft">Carregando…</p>}>
        <Confirmation />
      </Suspense>
    </BookingShell>
  );
}
