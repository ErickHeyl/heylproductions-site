import { createHmac, timingSafeEqual } from "node:crypto";
import type { AstroCookies } from "astro";

const COOKIE_NAME = "heyl_admin_session";
const SESSION_DAYS = 7;

// One shared admin password both gates login and signs the session cookie:
// no separate secret to manage, and changing the password logs out every
// existing session.
const secret = () => import.meta.env.BLOG_ADMIN_PASSWORD || "";

const sign = (expiresAt: number): string =>
  createHmac("sha256", secret()).update(String(expiresAt)).digest("hex");

export const checkPassword = (password: unknown): boolean => {
  if (!secret() || typeof password !== "string" || password.length === 0) return false;
  const expected = Buffer.from(secret());
  const provided = Buffer.from(password);
  return expected.length === provided.length && timingSafeEqual(expected, provided);
};

export const createSessionCookie = (cookies: AstroCookies) => {
  const expiresAt = Date.now() + SESSION_DAYS * 24 * 60 * 60 * 1000;
  cookies.set(COOKIE_NAME, `${expiresAt}.${sign(expiresAt)}`, {
    httpOnly: true,
    secure: import.meta.env.PROD,
    sameSite: "lax",
    path: "/",
    expires: new Date(expiresAt),
  });
};

export const clearSessionCookie = (cookies: AstroCookies) => {
  cookies.delete(COOKIE_NAME, { path: "/" });
};

export const isAuthenticated = (cookies: AstroCookies): boolean => {
  if (!secret()) return false;
  const value = cookies.get(COOKIE_NAME)?.value;
  if (!value) return false;

  const [expiresAtStr, providedSig] = value.split(".");
  const expiresAt = Number(expiresAtStr);
  if (!expiresAt || Date.now() > expiresAt || !providedSig) return false;

  const expected = Buffer.from(sign(expiresAt), "hex");
  const provided = Buffer.from(providedSig, "hex");
  if (expected.length !== provided.length) return false;
  return timingSafeEqual(expected, provided);
};
