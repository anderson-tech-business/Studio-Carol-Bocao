"use client";

import { useState } from "react";
import { Eye, EyeOff, LockKeyhole, LogIn } from "lucide-react";
import { PolishLogo } from "@/components/icons";
import { checkCredentials } from "@/lib/admin-auth";

export function AdminLogin({ onSuccess }: { onSuccess: () => void }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [shake, setShake] = useState(false);

  return (
    <main className="grid min-h-[calc(100dvh-36px)] place-items-center bg-gradient-to-br from-raspberry to-berry px-4 py-10">
      <form
        noValidate
        onSubmit={(e) => {
          e.preventDefault();
          if (checkCredentials(email, password)) {
            setError("");
            onSuccess();
          } else {
            setError("E-mail ou senha incorretos. Confira e tente de novo.");
            setShake(true);
            window.setTimeout(() => setShake(false), 400);
          }
        }}
        className={`w-full max-w-sm rounded-[28px] bg-white p-6 shadow-[0_30px_60px_-30px_rgba(42,14,28,.9)] animate-blur-in ${shake ? "animate-shake" : ""}`}
      >
        <div className="mb-5 flex items-center gap-3">
          <PolishLogo />
          <div>
            <p className="font-display text-xs font-bold uppercase tracking-[.16em] text-berry">Painel da Carol</p>
            <h1 className="font-display text-2xl font-black leading-tight text-ink">Entrar</h1>
          </div>
        </div>

        <div className="grid gap-4">
          <div>
            <label htmlFor="adm-email" className="mb-1.5 block font-display text-[.95rem] font-bold text-ink">
              E-mail
            </label>
            <input
              id="adm-email"
              type="email"
              autoComplete="username"
              inputMode="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="input"
              aria-invalid={!!error}
              aria-describedby={error ? "adm-erro" : undefined}
            />
          </div>
          <div>
            <label htmlFor="adm-senha" className="mb-1.5 block font-display text-[.95rem] font-bold text-ink">
              Senha
            </label>
            <div className="relative">
              <input
                id="adm-senha"
                type={show ? "text" : "password"}
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input pr-14"
                aria-invalid={!!error}
                aria-describedby={error ? "adm-erro" : undefined}
              />
              <button
                type="button"
                onClick={() => setShow((s) => !s)}
                aria-label={show ? "Ocultar senha" : "Mostrar senha"}
                className="absolute right-1 top-1/2 grid h-11 w-11 -translate-y-1/2 place-items-center rounded-full text-berry hover:bg-blush-soft"
              >
                {show ? <EyeOff className="h-5 w-5" aria-hidden="true" /> : <Eye className="h-5 w-5" aria-hidden="true" />}
              </button>
            </div>
          </div>
          {error && (
            <p id="adm-erro" role="alert" className="rounded-xl bg-[#FCEEF2] p-3 text-[.95rem] font-medium text-[#A3123F]">
              {error}
            </p>
          )}
          <button type="submit" className="btn btn-fill min-h-12 w-full">
            <LogIn aria-hidden="true" />
            Entrar no painel
          </button>
          <p className="flex items-center justify-center gap-1.5 text-center text-sm text-ink-soft">
            <LockKeyhole className="h-4 w-4" aria-hidden="true" />
            Acesso exclusivo da administradora
          </p>
        </div>
      </form>
    </main>
  );
}
