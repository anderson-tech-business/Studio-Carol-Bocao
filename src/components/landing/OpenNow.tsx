"use client";

import { useEffect, useState } from "react";
import { motion } from "motion/react";
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
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className={`inline-flex w-max items-center gap-1.5 rounded-full bg-blush-soft px-2.5 py-1 text-[.9rem] font-bold ${open ? "text-wa-ink" : "text-berry"}`}
    >
      <i className="h-2 w-2 animate-beat rounded-full bg-current" />
      {open ? "Aberto agora" : `Fechado agora · abre às ${studio.hours.open}`}
    </motion.div>
  );
}
