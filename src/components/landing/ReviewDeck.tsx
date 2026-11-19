"use client";

import { useRef, useState, type PointerEvent } from "react";
import { RotateCw, Star } from "lucide-react";
import { reviews } from "@/data/mock";

export function ReviewDeck() {
  const [order, setOrder] = useState(() => reviews.map((_, i) => i));
  const [flying, setFlying] = useState<{ index: number; dir: number } | null>(null);
  const drag = useRef<{ x: number; dx: number; el: HTMLElement } | null>(null);

  const cycle = (dir = 1) => {
    if (flying) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    setFlying({ index: order[0], dir });
    window.setTimeout(
      () => {
        setOrder((o) => [...o.slice(1), o[0]]);
        setFlying(null);
      },
      reduce ? 0 : 280,
    );
  };

  const onDown = (e: PointerEvent<HTMLElement>, pos: number) => {
    if (pos !== 0) return;
    const el = e.currentTarget;
    drag.current = { x: e.clientX, dx: 0, el };
    el.classList.add("dragging");
    el.setPointerCapture(e.pointerId);
  };
  const onMove = (e: PointerEvent<HTMLElement>) => {
    const d = drag.current;
    if (!d) return;
    d.dx = e.clientX - d.x;
    d.el.style.transform = `translateX(${d.dx}px) rotate(${d.dx / 14}deg)`;
  };
  const onUp = () => {
    const d = drag.current;
    if (!d) return;
    d.el.classList.remove("dragging");
    d.el.style.transform = "";
    drag.current = null;
    if (Math.abs(d.dx) > 70) cycle(Math.sign(d.dx));
    else if (Math.abs(d.dx) < 6) cycle(1);
  };

  return (
    <div className="deck-wrap" data-anim="tilt">
      <div className="deck" aria-live="polite">
        {reviews.map((r, i) => {
          const pos = order.indexOf(i);
          const isFlying = flying?.index === i;
          return (
            <figure
              key={r.name}
              className="rcard"
              data-pos={pos}
              aria-hidden={pos !== 0}
              style={{
                margin: 0,
                ...(isFlying ? { transform: `translateX(${flying!.dir * 120}%) rotate(${flying!.dir * 18}deg)`, opacity: 0 } : {}),
              }}
              onPointerDown={(e) => onDown(e, pos)}
              onPointerMove={onMove}
              onPointerUp={onUp}
              onPointerCancel={onUp}
            >
              <div className="rtop">
                <span className="avatar" style={{ background: r.color }}>{r.name[0]}</span>
                <div>
                  <b>{r.name}</b>
                  <small>{r.when} · Google</small>
                </div>
                <span className="mini-stars" aria-label="5 estrelas">
                  {Array.from({ length: 5 }, (_, k) => (
                    <Star key={k} fill="currentColor" strokeWidth={0} />
                  ))}
                </span>
              </div>
              <blockquote>{r.text}</blockquote>
            </figure>
          );
        })}
      </div>
      <div className="deck-ctrl">
        <button className="x" onClick={() => cycle(1)} aria-label="Ver próxima avaliação">
          <RotateCw />
        </button>
        <small>Arraste o cartão para o lado ou toque para ver a próxima</small>
      </div>
    </div>
  );
}
