export const htmlPaths = (files: Record<string, string>) =>
  Object.keys(files).filter((p) => p.endsWith(".html"));

// matches <li><a data-page="x">Title</a></li> (the <li> wrapper is optional)
const navRe = () =>
  /(<li\b[^>]*>\s*)?<a\b[^>]*\bdata-page\s*=\s*["']([a-z0-9-]+)["'][^>]*>([\s\S]*?)<\/a>(\s*<\/li>)?/gi;

export function readPages(files: Record<string, string>): { slug: string; title: string }[] {
  const pages = new Map<string, string>();
  for (const m of (files["/index.html"] ?? "").matchAll(navRe())) {
    pages.set(m[2], m[3].replace(/<[^>]+>/g, "").trim() || m[2]);
  }
  for (const p of htmlPaths(files)) {
    const slug = p.slice(1, -5);
    if (!pages.has(slug)) pages.set(slug, slug === "index" ? "Home" : slug);
  }
  return [...pages].map(([slug, title]) => ({ slug, title }));
}

export function makeSlug(title: string, taken: Set<string>) {
  let base = title.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 28);
  if (!base || base === "index") base = "page";
  let slug = base;
  let i = 2;
  while (taken.has(slug)) slug = `${base}-${i++}`;
  return slug;
}

// Clones the last nav link in the header, so classes and <li> wrappers match.
export function insertNavLink(html: string, page: { slug: string; title: string }) {
  if (new RegExp(`data-page\\s*=\\s*["']${page.slug}["']`, "i").test(html)) return html;

  const header = html.match(/<header[\s\S]*?<\/header>/i);
  const region = header ? header[0] : html;
  const offset = header ? (header.index as number) : 0;

  const all = [...region.matchAll(navRe())];
  const last = all[all.length - 1];
  if (!last) return html;

  const cloned = last[0]
    .replace(/(\bdata-page\s*=\s*["'])[a-z0-9-]+(["'])/i, (_m, a, b) => a + page.slug + b)
    .replace(/\s*aria-current\s*=\s*["'][^"']*["']/i, "")
    .replace(/class\s*=\s*"([^"]*)"/i, (_m, c: string) => {
      const kept = c.split(/\s+/).filter((t) => t && !/^(is-)?(active|current|selected)$/.test(t));
      return `class="${kept.join(" ")}"`;
    })
    .replace(/(<a\b[^>]*>)[\s\S]*?(<\/a>)/i, (_m, a, b) => a + page.title + b);

  const at = offset + (last.index as number) + last[0].length;
  return html.slice(0, at) + "\n" + cloned + html.slice(at);
}

export const rootBlockOf = (css: string) => css.match(/:root\s*\{[^}]*\}/)?.[0];