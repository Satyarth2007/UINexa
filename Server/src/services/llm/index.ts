import { env } from "../../config/env"; // ADAPT: your env export
import type { LLMClient } from "./types";
import { GeminiClient } from "./providers/gemini";

let client: LLMClient | null = null;

export function getLLM(): LLMClient {
  if (client) return client;

  switch (env.LLM_PROVIDER) {
    case "gemini":
      client = new GeminiClient(env.LLM_API_KEY.trim(), env.LLM_MODEL, env.LLM_FALLBACK_MODELS);
      return client;
    default:
      throw new Error(`Unsupported LLM provider: ${env.LLM_PROVIDER}`);
  }
}

export * from "./types";