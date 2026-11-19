"use client";

import { useEffect, useRef, useState } from "react";
import { X } from "lucide-react";

export const money = (n: number) => n.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

/** useState com persistência opcional em localStorage (falha silenciosa). */
export function useStoredState<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    try {
      const raw = localStorage.getItem(key);
      if (raw) setValue(JSON.parse(raw) as T);
    } catch {
      /* usa o valor inicial */
    }
    setLoaded(true);
  }, [key]);
  useEffect(() => {
    if (!loaded) return;
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* noop */
    }
  }, [key, value, loaded]);
  return [value, setValue, loaded] as const;
}

export function Modal({
  open,
  title,
  onClose,
  children,
}: {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
}) {
  const panel = useRef<HTMLDivElement>(null);
  const lastFocus = useRef<HTMLElement | null>(null);
  const closeRef = useRef(onClose);
  closeRef.current = onClose;

  useEffect(() => {
    if (!open) return;
    lastFocus.current = document.activeElement as HTMLElement;
    const t = window.setTimeout(() => {
      panel.current?.querySelector<HTMLElement>("input, select, button:not([data-close])")?.focus();
    }, 50);
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeRef.current();
      if (e.key === "Tab" && panel.current) {
        const items = panel.current.querySelectorAll<HTMLElement>("button, input, select, textarea, a[href]");
        if (!items.length) return;
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.clearTimeout(t);
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
      lastFocus.current?.focus();
    };
  }, [open]);

  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[100] flex items-end justify-center sm:items-center">
      <div className="absolute inset-0 bg-cap/50 backdrop-blur-[3px] animate-[fadeIn_.2s_ease-out]" onClick={onClose} aria-hidden="true" />
      <div
        ref={panel}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className="relative max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-[28px] bg-white p-5 pb-[calc(20px+env(safe-area-inset-bottom))] shadow-2xl animate-[sheetUp_.35s_cubic-bezier(.16,1,.3,1)] sm:rounded-[28px] sm:pb-5"
      >
        <div className="mb-4 flex items-start justify-between gap-3">
          <h2 id="modal-title" className="font-display text-xl font-black text-ink">
            {title}
          </h2>
          <button
            type="button"
            data-close
            onClick={onClose}
            aria-label="Fechar"
            className="grid h-11 w-11 flex-none place-items-center rounded-full bg-blush-soft text-berry transition hover:rotate-90"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function Switch({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={label}
      onClick={() => onChange(!checked)}
      className={`relative inline-flex h-8 w-14 flex-none items-center rounded-full transition-colors duration-300 ${
        checked ? "bg-wa" : "bg-[#8A7380]"
      }`}
    >
      <span
        className={`inline-block h-6 w-6 rounded-full bg-white shadow transition-transform duration-300 ease-spring ${
          checked ? "translate-x-7" : "translate-x-1"
        }`}
      />
    </button>
  );
}

export function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="mb-1.5 block font-display text-[.95rem] font-bold text-ink">
      {children}
    </label>
  );
}

export function Toast({ message }: { message: string }) {
  if (!message) return null;
  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-[calc(16px+env(safe-area-inset-bottom))] z-[110] flex justify-center px-4">
      <div role="status" className="max-w-md rounded-full bg-ink px-5 py-3 text-center font-medium text-white shadow-xl animate-blur-in">
        {message}
      </div>
    </div>
  );
}
