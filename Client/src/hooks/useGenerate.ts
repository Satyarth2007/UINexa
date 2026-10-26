import { useMutation } from "@tanstack/react-query";
import { api } from "../lib/axios"; // ADAPT: your axios instance (withCredentials)
import type { GenerateInput, GenerationResponse } from "../types/generate";
import axios from "axios";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import type { GenerationsOverview } from "../types/generate";
import type { VersionItem } from "../types/generate";


export function getErrorMessage(err: unknown): string {
  if (axios.isAxiosError(err)) {
    if (err.response?.status === 429) return "You've hit the generation limit. Please wait a few minutes and try again.";
    return err.response?.data?.message ?? "Something went wrong. Please try again.";
  }
  return "Something went wrong. Please try again.";
}

export function useGenerate() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (input: GenerateInput) => {
      const { data } = await api.post<GenerationResponse>("/generate", input);
      return data;
    },
    onSuccess: () => qc.invalidateQueries({ queryKey: ["generations"] }),
  });
}



export function useGenerations() {
  return useQuery({
    queryKey: ["generations"],
    queryFn: async () => (await api.get<GenerationsOverview>("/generations")).data,
  });
}


export function useGeneration(id: string | null) {
  return useQuery({
    queryKey: ["generation", id],
    queryFn: async () => (await api.get<GenerationResponse>(`/generations/${id}`)).data,
    enabled: !!id,
    staleTime: Infinity,
  });
}



export function useVersions(id: string | null, rootId: string | null) {
  return useQuery({
    queryKey: ["versions", rootId],
    queryFn: async () => (await api.get<VersionItem[]>(`/generations/${id}/versions`)).data,
    enabled: !!id && !!rootId,
  });
}

export function useSaveFiles() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, files }: { id: string; files: Record<string, string> }) =>
      (await api.patch(`/generations/${id}/files`, { files })).data,
    onSuccess: (_d, v) => qc.invalidateQueries({ queryKey: ["generation", v.id] }),
  });
}

export function useRefine() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: { id: string; instruction: string; page: string }) =>
      (await api.post<GenerationResponse>(`/generations/${v.id}/refine`, {
        instruction: v.instruction,
        page: v.page,
      })).data,
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ["versions", d.rootId] });
      qc.invalidateQueries({ queryKey: ["generations"] });
    },
  });
}


export function useAddPage() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (v: { id: string; title: string; description: string }) =>
      (await api.post<GenerationResponse>(`/generations/${v.id}/pages`, {
        title: v.title,
        description: v.description,
      })).data,
    onSuccess: (d) => {
      qc.invalidateQueries({ queryKey: ["versions", d.rootId] });
      qc.invalidateQueries({ queryKey: ["generations"] });
    },
  });
}