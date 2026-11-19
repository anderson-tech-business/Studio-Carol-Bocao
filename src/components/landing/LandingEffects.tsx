"use client";

import { useEffect } from "react";

/**
 * Efeitos de movimento da landing (DOM puro, sem dependências):
 * barra de progresso, sombra do header, skew do marquee, pêndulos da vitrine,
 * glitter, faíscas no toque, ripple nos botões, reveals e count-up.
 * Tudo respeita prefers-reduced-motion.
 */
export function LandingEffects() {
  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const cleanups: Array<() => void> = [];
    const on = <K extends keyof WindowEventMap>(type: K, fn: (e: WindowEventMap[K]) => void, opts?: AddEventListenerOptions) => {
      window.addEventListener(type, fn, opts);
      cleanups.push(() => window.removeEventListener(type, fn, opts));
    };
    let raf = 0;

    /* ---------- Reveals (só abaixo da dobra; nunca escondem o conteúdo) ---------- */
    const io = new IntersectionObserver(
      (entries) =>
        entries.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.remove("wait");
            io.unobserve(en.target);
          }
        }),
      { threshold: 0.15, rootMargin: "0px 0px -6% 0px" },
    );
    if (!reduce) {
      document.querySelectorAll<HTMLElement>("[data-anim]").forEach((el) => {
        if (el.getBoundingClientRect().top > window.innerHeight) {
          el.classList.add("wait");
          io.observe(el);
        }
      });
    }
    cleanups.push(() => io.disconnect());

    /* ---------- Count-up ---------- */
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => {
      const end = Number(el.dataset.count);
      const o = new IntersectionObserver(
        ([en]) => {
          if (!en.isIntersecting) return;
          o.disconnect();
          if (reduce) return;
          const t0 = performance.now();
          const tick = (t: number) => {
            const p = Math.min(1, (t - t0) / 1000);
            el.textContent = String(Math.round(end * (1 - Math.pow(1 - p, 4))));
            if (p < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        },
        { threshold: 0.6 },
      );
      o.observe(el);
      cleanups.push(() => o.disconnect());
    });

    /* ---------- Pêndulos ---------- */
    const swings = Array.from(document.querySelectorAll<HTMLElement>("[data-swing]")).map((el, i) => ({
      el,
      a: 0,
      v: 0,
      ph: i * 1.7,
      dir: i % 2 ? -1 : 1,
    }));
    document.querySelectorAll<HTMLElement>(".rack").forEach((rack) => {
      const kick = () => swings.forEach((s) => rack.contains(s.el) && (s.v += 3 * s.dir));
      rack.addEventListener("pointerenter", kick);
      cleanups.push(() => rack.removeEventListener("pointerenter", kick));
    });

    /* ---------- Spotlight nos cards da vitrine ---------- */
    document.querySelectorAll<HTMLElement>(".display").forEach((d) => {
      const move = (e: PointerEvent) => {
        const r = d.getBoundingClientRect();
        d.style.setProperty("--mx", `${e.clientX - r.left}px`);
        d.style.setProperty("--my", `${e.clientY - r.top}px`);
      };
      d.addEventListener("pointermove", move);
      cleanups.push(() => d.removeEventListener("pointermove", move));
    });

    /* ---------- Scroll ---------- */
    const header = document.getElementById("header");
    const prog = document.getElementById("progress");
    const marq = document.getElementById("marq");
    const giant = document.getElementById("giant");
    if (marq) marq.style.transition = "transform .3s var(--ease-out)";
    let lastY = window.scrollY;
    let ticking = false;
    let skewTimer = 0;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        const y = window.scrollY;
        const max = document.documentElement.scrollHeight - window.innerHeight;
        prog?.style.setProperty("--p", max > 0 ? (y / max).toFixed(4) : "0");
        header?.classList.toggle("scrolled", y > 8);
        const vel = y - lastY;
        lastY = y;
        if (!reduce) {
          marq?.style.setProperty("--skew", `${Math.max(-6, Math.min(6, vel * 0.12))}deg`);
          window.clearTimeout(skewTimer);
          skewTimer = window.setTimeout(() => marq?.style.setProperty("--skew", "0deg"), 140);
          swings.forEach((s) => (s.v += vel * 0.02 * s.dir));
        }
        if (giant) {
          const r = giant.getBoundingClientRect();
          const p = Math.min(1, Math.max(0, (window.innerHeight - r.top) / (window.innerHeight * 0.7)));
          giant.style.setProperty("--fp", `${(p * 100).toFixed(1)}%`);
        }
        ticking = false;
      });
    };
    on("scroll", onScroll, { passive: true });
    onScroll();

    /* ---------- Glitter ---------- */
    const glit = document.getElementById("glit") as HTMLCanvasElement | null;
    const gctx = glit?.getContext("2d") ?? null;
    let pts: { x: number; y: number; r: number; p: number; s: number }[] = [];
    const sizeGlit = () => {
      if (!glit) return;
      const r = glit.getBoundingClientRect();
      const dpr = window.devicePixelRatio || 1;
      glit.width = r.width * dpr;
      glit.height = r.height * dpr;
      pts = Array.from({ length: 60 }, () => ({
        x: Math.random() * glit.width,
        y: Math.random() * glit.height,
        r: (Math.random() * 2 + 0.6) * dpr,
        p: Math.random() * 6.28,
        s: Math.random() * 0.03 + 0.008,
      }));
    };
    sizeGlit();
    on("resize", sizeGlit);

    /* ---------- Faíscas no toque / cursor ---------- */
    const fx = document.getElementById("fx") as HTMLCanvasElement | null;
    const fctx = fx?.getContext("2d") ?? null;
    type Part = { x: number; y: number; vx: number; vy: number; life: number; r: number; c: string; rot: number };
    let parts: Part[] = [];
    const pal = ["#B0306A", "#F6D6E4", "#C9A25B", "#7A1F4B"];
    const sizeFx = () => {
      if (!fx) return;
      const dpr = window.devicePixelRatio || 1;
      fx.width = window.innerWidth * dpr;
      fx.height = window.innerHeight * dpr;
    };
    sizeFx();
    on("resize", sizeFx);
    const burst = (x: number, y: number, n: number, spread: number) => {
      if (reduce) return;
      for (let i = 0; i < n; i++) {
        const a = Math.random() * 6.283;
        const sp = Math.random() * spread + 0.5;
        parts.push({ x, y, vx: Math.cos(a) * sp, vy: Math.sin(a) * sp - 1, life: 1, r: Math.random() * 4 + 2, c: pal[i % 4], rot: Math.random() * 3 });
      }
    };
    const star = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, rot: number) => {
      ctx.save();
      ctx.translate(x, y);
      ctx.rotate(rot);
      ctx.beginPath();
      for (let i = 0; i < 4; i++) {
        ctx.lineTo(0, -r);
        ctx.rotate(Math.PI / 4);
        ctx.lineTo(0, -r * 0.35);
        ctx.rotate(Math.PI / 4);
      }
      ctx.closePath();
      ctx.fill();
      ctx.restore();
    };
    on("pointerdown", (e) => burst(e.clientX, e.clientY, 14, 4));
    if (window.matchMedia("(pointer: fine)").matches) {
      let last = 0;
      on("pointermove", (e) => {
        const t = performance.now();
        if (t - last > 45) {
          last = t;
          burst(e.clientX, e.clientY, 1, 0.8);
        }
      });
    }

    /* ---------- Ripple nos botões ---------- */
    const ripple = (e: PointerEvent) => {
      const b = (e.target as HTMLElement | null)?.closest<HTMLElement>(".btn");
      if (!b || reduce) return;
      const r = b.getBoundingClientRect();
      const s = document.createElement("span");
      s.className = "ripple";
      s.style.left = `${e.clientX - r.left}px`;
      s.style.top = `${e.clientY - r.top}px`;
      b.appendChild(s);
      window.setTimeout(() => s.remove(), 700);
    };
    document.addEventListener("pointerdown", ripple);
    cleanups.push(() => document.removeEventListener("pointerdown", ripple));

    /* ---------- Loop único de animação ---------- */
    const loop = (t: number) => {
      if (!reduce) {
        for (const s of swings) {
          const target = Math.sin(t / 900 + s.ph) * 4;
          s.v += (target - s.a) * 0.015;
          s.v *= 0.94;
          s.a = Math.max(-35, Math.min(35, s.a + s.v));
          s.el.style.transform = `rotate(${s.a.toFixed(2)}deg)`;
        }
        if (glit && gctx) {
          gctx.clearRect(0, 0, glit.width, glit.height);
          for (const q of pts) {
            q.p += q.s;
            const a = (Math.sin(q.p) + 1) / 2;
            gctx.fillStyle = `rgba(255,255,255,${a * 0.9})`;
            gctx.beginPath();
            gctx.arc(q.x, q.y, q.r * (0.4 + a * 0.7), 0, 6.283);
            gctx.fill();
          }
        }
      }
      if (fx && fctx) {
        const d = window.devicePixelRatio || 1;
        if (parts.length) {
          fctx.clearRect(0, 0, fx.width, fx.height);
          parts = parts.filter((p) => p.life > 0);
          for (const p of parts) {
            p.x += p.vx;
            p.y += p.vy;
            p.vy += 0.08;
            p.life -= 0.022;
            p.rot += 0.1;
            fctx.globalAlpha = Math.max(0, p.life);
            fctx.fillStyle = p.c;
            star(fctx, p.x * d, p.y * d, p.r * d * p.life + 1, p.rot);
          }
          fctx.globalAlpha = 1;
          if (!parts.length) fctx.clearRect(0, 0, fx.width, fx.height);
        }
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    cleanups.push(() => cancelAnimationFrame(raf));

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return (
    <>
      <div className="progress" id="progress" aria-hidden="true" />
      <canvas id="fx" aria-hidden="true" />
    </>
  );
}
