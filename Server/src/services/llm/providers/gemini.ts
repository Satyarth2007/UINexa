import type { LLMClient, LLMCompleteInput, LLMCompleteOutput } from "../types";

const RETRYABLE = new Set([500, 502, 503, 504]);           // retry same model
const FALLBACK_ON = new Set([404, 429, 500, 502, 503, 504]); // then move to next model

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

export class GeminiClient implements LLMClient {
  public readonly model: string;
  private fallbacks: string[];

  constructor(private apiKey: string, model: string, fallbacks?: string) {
    const clean = (m: string) => m.trim().replace(/^["']|["']$/g, "").replace(/^models\//, "");
    this.model = clean(model);
    this.fallbacks = (fallbacks ?? "").split(",").map(clean).filter(Boolean);
  }

  async complete(input: LLMCompleteInput): Promise<LLMCompleteOutput> {
    const chain = [this.model, ...this.fallbacks];
    let lastErr: unknown;

    for (const m of chain) {
      try {
        return await this.callWithRetry(m, input);
      } catch (e) {
        lastErr = e;
        const status = (e as any).status as number | undefined;
        if (!status || !FALLBACK_ON.has(status)) throw e; // e.g. 400/401/403: don't hide real bugs
        console.warn(`[gemini] ${m} failed with ${status}, trying next model`);
      }
    }
    throw lastErr;
  }

  private async callWithRetry(model: string, input: LLMCompleteInput): Promise<LLMCompleteOutput> {
    const delays = [2000, 5000]; // up to 3 attempts total
    let lastErr: unknown;

    for (let i = 0; i <= delays.length; i++) {
      try {
        return await this.callOnce(model, input);
      } catch (e) {
        lastErr = e;
        const status = (e as any).status as number | undefined;
        if (!status || !RETRYABLE.has(status) || i === delays.length) throw e;
        console.warn(`[gemini] ${model} returned ${status}, retrying in ${delays[i]}ms (attempt ${i + 1})`);
        await sleep(delays[i]);
      }
    }
    throw lastErr;
  }

  private async callOnce(
    model: string,
    { system, messages, maxTokens = 16000, json = true }: LLMCompleteInput
  ): Promise<LLMCompleteOutput> {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`;
    console.log("[gemini] calling:", url);

    const started = Date.now();

    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json", "x-goog-api-key": this.apiKey },
      body: JSON.stringify({
        systemInstruction: { parts: [{ text: system }] },
        contents: messages.map((m) => ({
          role: m.role === "assistant" ? "model" : "user",
          parts: [{ text: m.content }],
        })),
        generationConfig: {
          maxOutputTokens: maxTokens,
          temperature: 0.7,
          ...(json ? { responseMimeType: "application/json" } : {}),
        },
      }),
      signal: AbortSignal.timeout(180_000),
    });

    console.log(`[gemini] ${model} responded in ${((Date.now() - started) / 1000).toFixed(1)}s`);

    if (!res.ok) {
      const body = await res.text().catch(() => "");
      console.error("[gemini] status:", res.status, "body:", body);
      const err: any = new Error(`Gemini ${res.status}: ${body.slice(0, 300)}`);
      err.status = res.status;
      throw err;
    }

    const data: any = await res.json();
    const finish = data?.candidates?.[0]?.finishReason;
    if (finish && finish !== "STOP") console.error("[gemini] finishReason:", finish);

    const text: string = data?.candidates?.[0]?.content?.parts?.map((p: any) => p.text ?? "").join("") ?? "";
    if (!text) throw new Error("Gemini returned an empty response");

    const u = data.usageMetadata ?? {};
    return {
      text,
      usage: {
        inputTokens: u.promptTokenCount ?? 0,
        outputTokens: u.candidatesTokenCount ?? 0,
        totalTokens: u.totalTokenCount ?? 0,
      },
    };
  }
}