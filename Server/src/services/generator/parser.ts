export interface GenerationResult {
  summary: string;
  files: Record<string, string>;
}

const LIMITS: Record<string, number> = { ".html": 60_000, ".css": 60_000, ".js": 40_000 };
const MARKER = /^<<<FILE:([^>\r\n]+)>>>[ \t]*\r?$/gm;
const END = /^<<<END>>>[ \t]*\r?$/m;

function stripFence(s: string) {
  return s.trim().replace(/^```[a-z]*\s*\n/i, "").replace(/\n```\s*$/i, "").trim();
}

function splitBlocks(raw: string): Record<string, string> {
  if (!END.test(raw)) throw new Error("Output is incomplete (missing <<<END>>>); it was probably cut off");

  const marks = [...raw.matchAll(MARKER)];
  if (marks.length === 0) throw new Error("No <<<FILE:/path>>> blocks found in the output");

  const files: Record<string, string> = {};
  marks.forEach((m, i) => {
    const path = m[1].trim();
    const from = (m.index as number) + m[0].length;
    const to = i + 1 < marks.length ? (marks[i + 1].index as number) : raw.length;
    files[path] = stripFence(raw.slice(from, to).replace(END, ""));
  });
  return files;
}

function checkFile(path: string, content: string) {
  const limit = LIMITS[path.slice(path.lastIndexOf("."))];
  if (!limit) throw new Error(`Unsupported file type: ${path}`);
  if (content.length === 0) throw new Error(`${path} is empty`);
  if (content.length > limit) throw new Error(`${path} is too large`);
}

export const hasInline = (html: string) =>
  /<style[\s>]/i.test(html) ||
  [...html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)].some((m) => !/\bsrc\s*=/i.test(m[1]) && m[2].trim());

function checkHtml(path: string, html: string, known: Set<string>, strict: boolean) {
  if (!html || !/<html[\s>]/i.test(html) || !/<\/html>/i.test(html)) {
    throw new Error(`${path} must be a complete HTML document`);
  }
  if (strict) {
    if (/<style[\s>]/i.test(html)) throw new Error("Do not use <style> in the HTML; put CSS in the .css file");
    for (const m of html.matchAll(/<script\b([^>]*)>([\s\S]*?)<\/script>/gi)) {
      if (!/\bsrc\s*=/i.test(m[1]) && m[2].trim()) {
        throw new Error("Do not write inline JavaScript in the HTML; put it in the .js file");
      }
    }
  }
  const refs = [
    ...html.matchAll(/<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi),
    ...html.matchAll(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>/gi),
  ].map((m) => m[1]);

  for (const ref of refs) {
    if (/^data:/i.test(ref)) continue;
    if (/^(https?:)?\/\//i.test(ref)) throw new Error(`External resource not allowed: ${ref}`);
    if (!known.has("/" + ref.replace(/^\.?\//, ""))) {
      throw new Error(`HTML references ${ref} but that file was not provided`);
    }
  }
}

// ---------- full page generation ----------
export function parseGeneration(raw: string, opts: { slug: string; existing?: string[] }): GenerationResult {
  const { slug, existing = [] } = opts;
  const files = splitBlocks(raw);

  const allowed =
    slug === "index"
      ? ["/index.html", "/styles.css", "/script.js"]
      : [`/${slug}.html`, `/${slug}.css`, `/${slug}.js`];

  for (const [p, c] of Object.entries(files)) {
    if (!allowed.includes(p)) throw new Error(`Unexpected file ${p}. Allowed files: ${allowed.join(", ")}`);
    checkFile(p, c);
  }
  if (slug === "index" && !files["/styles.css"]) throw new Error("/styles.css is required");

  const htmlPath = `/${slug}.html`;
  checkHtml(htmlPath, files[htmlPath], new Set([...existing, ...Object.keys(files)]), true);

  if (slug !== "index" && !/<link\b[^>]*href\s*=\s*["']\.?\/?styles\.css["']/i.test(files[htmlPath])) {
    throw new Error('The page must include <link rel="stylesheet" href="styles.css"> in <head>');
  }

  const title = files[htmlPath].match(/<title>([^<]*)<\/title>/i)?.[1]?.trim();
  return { summary: title || "Generated UI", files };
}

// ---------- refine: model returns only the files it changed ----------
export function parseRefine(raw: string, opts: { slug: string; current: Record<string, string> }) {
  const { slug, current } = opts;
  const changed = splitBlocks(raw);
  const allowed = [`/${slug}.html`, "/styles.css", "/script.js", `/${slug}.css`, `/${slug}.js`];

  for (const [p, c] of Object.entries(changed)) {
    if (!allowed.includes(p)) throw new Error(`Unexpected file ${p}. You may only change: ${allowed.join(", ")}`);
    checkFile(p, c);
  }

  const merged = { ...current, ...changed };
  const htmlPath = `/${slug}.html`;
  const strict = !hasInline(current[htmlPath] ?? ""); // older single-file generations keep inline code
  checkHtml(htmlPath, merged[htmlPath], new Set(Object.keys(merged)), strict);

  return { changed, merged };
}