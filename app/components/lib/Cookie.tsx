// app/components/lib/Cookie.ts
import { AlertNotification } from "../global/Alert";

// ==========================
// Utilities: Cookie helpers
// ==========================
type CookieOptions = {
  path?: string;
  maxAge?: number; // detik
  expires?: Date;
  sameSite?: "lax" | "strict" | "none" | "Lax" | "Strict" | "None";
  secure?: boolean;
};

// NOTE: hanya dipakai di client. Jangan panggil di server.
export const setCookie = (name: string, value: string, opts: CookieOptions = {}) => {
  if (typeof document === "undefined") return;

  const {
    path = "/",
    sameSite = "Lax",
    secure = process.env.NODE_ENV === "production",
    maxAge,
    expires,
  } = opts;

  let cookie = `${encodeURIComponent(name)}=${encodeURIComponent(value)}; Path=${path}; SameSite=${sameSite}`;
  if (secure) cookie += "; Secure";
  if (typeof maxAge === "number") cookie += `; Max-Age=${maxAge}`;
  if (expires instanceof Date) cookie += `; Expires=${expires.toUTCString()}`;

  document.cookie = cookie;
};

// SSR-safe getter
export const getCookie = (name: string): string | null => {
  if (typeof document === "undefined") return null;
  const target = `; ${encodeURIComponent(name)}=`;
  const value = `; ${document.cookie}`;
  const parts = value.split(target);
  if (parts.length === 2) {
    const raw = parts.pop()!.split(";").shift()!;
    try {
      return decodeURIComponent(raw);
    } catch {
      return raw;
    }
  }
  return null;
};

export const removeCookie = (name: string, path = "/") => {
  if (typeof document === "undefined") return;
  // Set expired
  document.cookie = `${encodeURIComponent(name)}=; Path=${path}; Expires=Thu, 01 Jan 1970 00:00:00 GMT; SameSite=Lax`;
};

// ==================================
// Auth helpers: login / logout / get
// ==================================

// Tipe respons agar aman saat akses properti
type LoginResponse =
  | { code: number; data: { token?: string; user?: unknown } }
  | { code: number; data: string };

export async function login(username: string, password: string): Promise<void> {
  const API_LOGIN = process.env.NEXT_PUBLIC_API_URL;
  const res = await fetch(`${API_LOGIN}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password })
  })

  if (!res.ok) {
    throw new Error("Login gagal")
  } else {
    const data = await res.json();
    AlertNotification("Berhasil Login", "", "success", 2000);
    localStorage.setItem("sessionId", data.sessionId)
  
    // cookie buat middleware
    document.cookie = `sessionId=${data.sessionId}; path=/; secure; samesite=strict`
  }

}

export const logout = () => {
  // Hapus cookies yang dipakai middleware
  removeCookie("sessionId", "/");     // ⬅️ TAMBAHKAN INI
  removeCookie("token", "/");
  removeCookie("user", "/");
  removeCookie("opd", "/");
  removeCookie("periode", "/");
  removeCookie("tahun", "/");

  // (opsional) bersih-bersih localStorage
  try {
    localStorage.removeItem("sessionId"); // ⬅️ TAMBAHKAN INI
    localStorage.removeItem("token");
    localStorage.removeItem("opd");
    localStorage.removeItem("user");
    localStorage.removeItem("periode");
  } catch {}

  // Redirect ke login
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};


// Helpers pembacaan
export const getUser = () => {
  const raw = getCookie("user");
  if (!raw) return undefined;
  try {
    return { user: JSON.parse(raw) };
  } catch {
    return undefined;
  }
};

export const getToken = () => {
  const t = getCookie("token");
  return t ?? null;
};

export const getSessionId = () => {
  const t = localStorage.getItem("sessionId")
  return t ?? '-';
}

export const getOpdTahun = () => {
  const tRaw = getCookie("tahun");
  const oRaw = getCookie("opd");
  let tahun: any = null;
  let opd: any = null;
  try {
    if (tRaw) tahun = JSON.parse(tRaw);
  } catch { }
  try {
    if (oRaw) opd = JSON.parse(oRaw);
  } catch { }
  return { tahun, opd };
};

export const getPeriode = () => {
  const pRaw = getCookie("periode");
  try {
    if (pRaw) return { periode: JSON.parse(pRaw) };
  } catch { }
  return { periode: null };
};
