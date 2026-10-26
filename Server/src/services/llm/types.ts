export type LLMMessage = { role: "user" | "assistant"; content: string };

export interface LLMCompleteInput {
  system: string;
  messages: LLMMessage[];
  maxTokens?: number;
  json?: boolean;
}

export interface LLMCompleteOutput {
  text: string;
  usage: { inputTokens: number; outputTokens: number; totalTokens: number };
}

export interface LLMClient {
  readonly model: string;
  complete(input: LLMCompleteInput): Promise<LLMCompleteOutput>;
}