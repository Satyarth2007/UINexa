import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { authService } from "../services/auth.service";

export const ME_KEY = ["auth", "me"] as const;

// Resolves to the user, or null when logged out (a 401 is normal here, not an error)
export function useMe() {
  return useQuery({
    queryKey: ME_KEY,
    staleTime: Infinity,
    queryFn: async () => {
      try {
        return await authService.me();
      } catch (err) {
        if (axios.isAxiosError(err) && err.response?.status === 401) return null;
        throw err;
      }
    },
  });
}

export function useLogin() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.login,
    onSuccess: (user) => qc.setQueryData(ME_KEY, user),
  });
}

export function useRegister() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.register,
    onSuccess: (user) => qc.setQueryData(ME_KEY, user),
  });
}

export function useLogout() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: authService.logout,
    onSuccess: () => {
      qc.clear(); // drop all cached user data
      qc.setQueryData(ME_KEY, null);
    },
  });
}