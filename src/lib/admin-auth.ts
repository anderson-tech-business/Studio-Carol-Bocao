/**
 * Login MOCKADO do painel da Carol, só para a demonstração.
 *
 * Atenção: isto roda 100% no navegador. As credenciais ficam no bundle JS e a
 * "sessão" é um valor no localStorage, então NÃO é segurança real. Em produção,
 * troque por autenticação no servidor (ex.: Auth.js/NextAuth, Supabase Auth)
 * com senha com hash e cookie httpOnly.
 */

const ADMIN_EMAIL = "adm@gmail.com";
const ADMIN_PASSWORD = "adm123@";
const SESSION_KEY = "scb-admin-session";
const SESSION_HOURS = 12;

export function checkCredentials(email: string, password: string): boolean {
  return email.trim().toLowerCase() === ADMIN_EMAIL && password === ADMIN_PASSWORD;
}

export function startSession(): void {
  try {
    localStorage.setItem(SESSION_KEY, JSON.stringify({ email: ADMIN_EMAIL, exp: Date.now() + SESSION_HOURS * 3_600_000 }));
  } catch {
    /* sem armazenamento: a sessão dura só até recarregar */
  }
}

export function hasSession(): boolean {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    if (!raw) return false;
    const { exp } = JSON.parse(raw) as { exp: number };
    if (Date.now() > exp) {
      localStorage.removeItem(SESSION_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}

export function endSession(): void {
  try {
    localStorage.removeItem(SESSION_KEY);
  } catch {
    /* noop */
  }
}
