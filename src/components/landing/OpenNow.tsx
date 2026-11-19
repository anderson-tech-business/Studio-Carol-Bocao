"use client";

import { useEffect, useState } from "react";
import { studio } from "@/data/mock";
import { nowInStudio, toMinutes } from "@/lib/schedule";

export function OpenNow() {
  const [open, setOpen] = useState<boolean | null>(null);

  useEffect(() => {
    const check = () => {
      const now = nowInStudio();
      setOpen(
        studio.workingDays.includes(now.weekday) &&
          now.minutes >= toMinutes(studio.hours.open) &&
          now.minutes < toMinutes(studio.hours.close),
      );
    };
    check();
    const id = setInterval(check, 60_000);
    return () => clearInterval(id);
  }, []);

  if (open === null) return null;
  return (
    <div className="open-now" style={{ color: open ? "var(--wa-ink)" : "var(--berry)" }}>
      <i />
      {open ? "Aberto agora" : `Fechado agora · abre às ${studio.hours.open}`}
    </div>
  );
}
