import { z } from "zod";
import { getLLM } from "../llm";
import { PLAN_PROMPT, briefBlock, type Brief, type SitePlan } from "./prompt";

const planSchema = z.object({
  siteName: z.string().trim().min(1).max(40),
  pages: z
    .array(
      z.object({
        slug: z.string().regex(/^[a-z0-9-]{1,30}$/),
        title: z.string().trim().min(1).max(30),
        purpose: z.string().trim().max(200),
      })
    )
    .min(1)
    .max(5),
});

export function singlePagePlan(prompt: string): SitePlan {
  return { siteName: "Site", pages: [{ slug: "index", title: "Home", purpose: prompt.slice(0, 200) }] };
}

export async function planSite(prompt: string, brief?: Brief): Promise<SitePlan> {
  try {
    const out = await getLLM().complete({
      system: PLAN_PROMPT,
      messages: [{ role: "user", content: prompt + briefBlock(brief) }],
      maxTokens: 4000,
      json: true,
    });

    const text = out.text.trim().replace(/^```(?:json)?\s*/i, "").replace(/```\s*$/, "").trim();
    const parsed = planSchema.parse(JSON.parse(text.slice(text.indexOf("{"), text.lastIndexOf("}") + 1)));

    const seen = new Set<string>();
    const pages = parsed.pages.map((p, i) => {
      let slug = i === 0 ? "index" : p.slug === "index" ? `page-${i + 1}` : p.slug;
      while (seen.has(slug)) slug = `${slug}-${i + 1}`;
      seen.add(slug);
      return { ...p, slug };
    });

    console.log("[planner] pages:", pages.map((p) => p.slug).join(", "));
    return { siteName: parsed.siteName, pages };
  } catch (err) {
    console.error("[planner] failed, falling back to a single page:", (err as Error).message);
    return singlePagePlan(prompt);
  }
}