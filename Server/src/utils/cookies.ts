import type { CookieOptions, Response } from "express";
import { COOKIE_MAX_AGE_MS, COOKIE_NAME } from "../config/constants";
import { env } from "../config/env";

const base: CookieOptions = {
  httpOnly: true, // JavaScript can't read it, which protects against XSS token theft
  secure: env.NODE_ENV === "production",
  sameSite: "lax", // use "none" together with secure if the client and API are on different sites
};

export const setAuthCookie = (res: Response, token: string) =>
  res.cookie(COOKIE_NAME, token, { ...base, maxAge: COOKIE_MAX_AGE_MS });

export const clearAuthCookie = (res: Response) => res.clearCookie(COOKIE_NAME, base);