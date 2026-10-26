import { getLLM, type LLMMessage } from "../llm";
import {
  buildSystemPrompt, buildUserPrompt, buildPagePrompt,
  REFINE_SYSTEM, buildRefineUserPrompt,
  type Brief, type SharedParts,
} from "./prompt";
import { parseGeneration, parseRefine } from "./parser";
import { planSite, singlePagePlan } from "./planner";
import type { PaletteInput } from "./theme";
import { htmlPaths, readPages, makeSlug, insertNavLink, rootBlockOf } from "./pages";

export class GenerationError extends Error {}

// One LLM call, validated, with a single retry that feeds the error back.
async function withRetry<T>(args: {
  system: string;
  userContent: string;
  label: string;
  fixHint: string;
  parse: (text: string) => T;
}): Promise<{ value: T; tokens: number }> {
  const { system, userContent, label, fixHint, parse } = args;
  const llm = getLLM();
  const messages: LLMMessage[] = [{ role: "user", content: userContent }];
  let tokens = 0;
  let lastError = "";

  for (let attempt = 0; attempt < 2; attempt++) {
    let text: string;
    try {
      const out = await llm.complete({ system, messages, maxTokens: 16000, json: false });
      text = out.text;
      tokens += out.usage.totalTokens;
    } catch (e) {
      throw new GenerationError(`LLM request failed: ${(e as Error).message}`);
    }

    try {
      return { value: parse(text), tokens };
    } catch (e) {
      lastError = (e as Error).message;
      console.error(`[generator] "${label}" attempt ${attempt + 1} INVALID:`, lastError);
      messages.push(
        { role: "assistant", content: text },
        { role: "user", content: `Your previous output was invalid: ${lastError}. ${fixHint}` }
      );
    }
  }
  throw new GenerationError(`Model returned invalid output after retry: ${lastError}`);
}

const GEN_HINT =
  "Return the corrected output in the same <<<FILE:/path>>> format, ending with <<<END>>>. No fences, no commentary.";

function extractShared(files: Record<string, string>): SharedParts {
  const cap = (s: string, n: number) => (s.length <= n ? s : "");
  const html = files["/index.html"] ?? "";
  return {
    css: cap(files["/styles.css"] ?? "", 30_000),
    header: cap(html.match(/<header[\s\S]*?<\/header>/i)?.[0] ?? "", 4_000),
    footer: cap(html.match(/<footer[\s\S]*?<\/footer>/i)?.[0] ?? "", 4_000),
  };
}

export async function generateSite(args: {
  prompt: string;
  multiPage: boolean;
  palette?: PaletteInput;
  brief?: Brief;
}) {
  const { prompt, multiPage, palette, brief } = args;
  const llm = getLLM();
  const system = buildSystemPrompt(palette);
  const plan = multiPage ? await planSite(prompt, brief) : singlePagePlan(prompt);
  const single = plan.pages.length === 1;

  const files: Record<string, string> = {};
  const failedPages: string[] = [];
  let tokens = 0;
  let shared: SharedParts | undefined;
  let firstTitle = "Generated UI";

  for (const page of plan.pages) {
    const userContent = single
      ? buildUserPrompt(prompt, brief)
      : buildPagePrompt({ userPrompt: prompt, brief, plan, page, shared });

    try {
      const existing = Object.keys(files);
      const out = await withRetry({
        system, userContent, label: page.slug, fixHint: GEN_HINT,
        parse: (t) => parseGeneration(t, { slug: page.slug, existing }),
      });
      Object.assign(files, out.value.files);
      tokens += out.tokens;
      console.log(`[generator] page "${page.slug}" done: ${Object.keys(out.value.files).join(", ")}`);

      if (page.slug === "index") {
        firstTitle = out.value.summary;
        shared = extractShared(files);
      }
    } catch (e) {
      if (page.slug === "index") throw e;
      console.error(`[generator] page "${page.slug}" failed:`, (e as Error).message);
      failedPages.push(page.title);
    }
  }

  return {
    summary: single ? firstTitle : `${plan.siteName} · ${plan.pages.length - failedPages.length} pages`,
    files, failedPages, model: llm.model, tokens,
  };
}

export async function refineSite(args: { files: Record<string, string>; instruction: string; slug: string }) {
  const { files, instruction, slug } = args;
  const llm = getLLM();

  const out = await withRetry({
    system: REFINE_SYSTEM,
    userContent: buildRefineUserPrompt({ files, instruction, slug }),
    label: `refine:${slug}`,
    fixHint: "Return ONLY the changed files, each complete, in the <<<FILE:/path>>> format ending with <<<END>>>.",
    parse: (t) => parseRefine(t, { slug, current: files }),
  });

  console.log(`[refine] changed: ${Object.keys(out.value.changed).join(", ")}`);
  return { files: out.value.merged, model: llm.model, tokens: out.tokens };
}


export async function addPageToSite(args: {
  files: Record<string, string>;
  userPrompt: string;
  title: string;
  description: string;
}) {
  const { userPrompt, title, description } = args;
  const llm = getLLM();
  let files = { ...args.files };
  let tokens = 0;

  const known = readPages(files);
  const slug = makeSlug(title, new Set(known.map((p) => p.slug)));
  const newPage = { slug, title, purpose: description || `${title} page` };

  // 1) every existing page must link to the new one
  if (!/data-page\s*=/i.test(files["/index.html"])) {
    // single-page site with no menu yet: ask the model to add one to the home page
    const links = [...known, newPage]
      .map((p) => `<a href="#" data-page="${p.slug}">${p.title}</a>`)
      .join(" ");
    const out = await refineSite({
      files,
      slug: "index",
      instruction:
        `Add a navigation menu inside the header with exactly these links, in this order: ${links}. ` +
        `Put aria-current="page" on the Home link. Match the existing design and change nothing else.`,
    });
    files = out.files;
    tokens += out.tokens;
    if (!/data-page\s*=/i.test(files["/index.html"])) {
      throw new GenerationError("Navigation links were not added to the home page");
    }
  } else {
    // multi-page site: clone an existing link into every page (no LLM call)
    for (const p of htmlPaths(files)) files[p] = insertNavLink(files[p], newPage);
  }

  // 2) generate only the new page, reusing the site's CSS, header and footer
  const shared = extractShared(files);
  const siteName = (files["/index.html"].match(/<title>([^<]*)<\/title>/i)?.[1] ?? "Site").trim().slice(0, 40);
  const plan = {
    siteName,
    pages: [...known.map((p) => ({ ...p, purpose: "existing page" })), newPage],
  };
  const existing = Object.keys(files);

  const out = await withRetry({
    system: buildSystemPrompt(undefined, rootBlockOf(files["/styles.css"])),
    userContent: buildPagePrompt({ userPrompt, plan, page: newPage, shared }),
    label: slug,
    fixHint: GEN_HINT,
    parse: (t) => parseGeneration(t, { slug, existing }),
  });

  Object.assign(files, out.value.files);
  tokens += out.tokens;
  console.log(`[addPage] "${slug}" created: ${Object.keys(out.value.files).join(", ")}`);
  return { files, slug, model: llm.model, tokens };
}