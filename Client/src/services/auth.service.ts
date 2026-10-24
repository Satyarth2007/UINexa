import { api } from "../lib/axios";
import type { User } from "../types/auth.types";

type AuthResponse = { user: User };

export const authService = {
  register: (data: { name: string; email: string; password: string }) =>
    api.post<AuthResponse>("/auth/register", data).then((r) => r.data.user),
  login: (data: { email: string; password: string }) =>
    api.post<AuthResponse>("/auth/login", data).then((r) => r.data.user),
  logout: () => api.post("/auth/logout"),
  me: () => api.get<AuthResponse>("/auth/me").then((r) => r.data.user),
};