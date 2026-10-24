import type { Request, Response } from "express";
import { loginUser, registerUser, signToken, toPublicUser } from "../services/auth.service";
import { clearAuthCookie, setAuthCookie } from "../utils/cookies";

export async function register(req: Request, res: Response) {
  const user = await registerUser(req.body);
  setAuthCookie(res, signToken(user.id));
  res.status(201).json({ user: toPublicUser(user) });
}

export async function login(req: Request, res: Response) {
  const user = await loginUser(req.body.email, req.body.password);
  setAuthCookie(res, signToken(user.id));
  res.json({ user: toPublicUser(user) });
}

export function logout(_req: Request, res: Response) {
  clearAuthCookie(res);
  res.json({ ok: true });
}

export function me(req: Request, res: Response) {
  res.json({ user: toPublicUser(req.user!) });
}