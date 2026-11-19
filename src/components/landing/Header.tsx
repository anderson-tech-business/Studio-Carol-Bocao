"use client";

import Link from "next/link";
import { useState } from "react";
import { motion, useMotionValueEvent, useScroll } from "motion/react";
import { CalendarCheck } from "lucide-react";
import { BrandLogo } from "@/components/icons";

export function Header() {
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  useMotionValueEvent(scrollY, "change", (y) => setScrolled(y > 8));

  return (
    <motion.header
      className="sticky top-[env(safe-area-inset-top)] z-[80] bg-white"
      animate={{ boxShadow: scrolled ? "0 10px 30px -22px rgba(122,31,75,.7)" : "0 0 0 0 rgba(122,31,75,0)" }}
      transition={{ duration: 0.32 }}
    >
      <div className="mx-auto flex max-w-[1120px] items-center justify-between gap-3 px-4 py-3">
        <Link href="/" aria-label="Studio Carol Bocão, início">
          <BrandLogo />
        </Link>
        <Link href="/agendar" className="btn btn-fill btn-sm">
          <CalendarCheck />
          Agendar Horário
        </Link>
      </div>
    </motion.header>
  );
}
