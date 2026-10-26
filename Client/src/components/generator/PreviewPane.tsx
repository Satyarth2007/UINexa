import { useEffect, useMemo, useRef } from "react";
import { Monitor, Tablet, Smartphone, Download } from "lucide-react";

export type Device = "desktop" | "tablet" | "mobile";


 interface Props {
     files: Record<string, string>;
     page: string;
     onPageChange: (p: string) => void;
     device: Device;
     onDeviceChange: (d: Device) => void;
   }


const WIDTHS: Record<Device, string> = { desktop: "100%", tablet: "768px", mobile: "375px" };
const DEVICES = [
  { id: "desktop", icon: Monitor, label: "Desktop" },
  { id: "tablet", icon: Tablet, label: "Tablet" },
  { id: "mobile", icon: Smartphone, label: "Mobile" },
] as const;

const CSP =
  `<meta http-equiv="Content-Security-Policy" content="default-src 'none'; ` +
  `style-src 'unsafe-inline'; script-src 'unsafe-inline'; img-src data: blob:; font-src data:;">`;

const NAV_SCRIPT = `<script>
document.addEventListener("click", function (e) {
  var a = e.target.closest && e.target.closest("a");
  if (!a) return;
  var page = a.getAttribute("data-page");
  if (page) { e.preventDefault(); parent.postMessage({ type: "uinexa:navigate", page: page }, "*"); return; }
  var href = a.getAttribute("href") || "";
  if (href === "" || href === "#") e.preventDefault();
});
</script>`;

const norm = (ref: string) => "/" + ref.replace(/^\.?\//, "");

// Turns <link href="styles.css"> and <script src="script.js"> into inline code for the iframe.
function buildDoc(html: string, files: Record<string, string>) {
  const scripts: string[] = [];

  let doc = html
    .replace(/<link\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi, (tag, href) => {
      const css = files[norm(href)];
      return css !== undefined && /stylesheet/i.test(tag) ? `<style>\n${css}\n</style>` : tag;
    })
    .replace(/<script\b[^>]*\bsrc\s*=\s*["']([^"']+)["'][^>]*>\s*<\/script>/gi, (tag, src) => {
      const js = files[norm(src)];
      if (js === undefined) return tag;
      scripts.push(js.replace(/<\/script/gi, "<\\/script"));
      return ""; // re-added at the end of <body>, which is how "defer" behaves
    });

  const tail = scripts.map((s) => `<script>\n${s}\n</script>`).join("\n") + NAV_SCRIPT;
  doc = /<head[^>]*>/i.test(doc) ? doc.replace(/<head[^>]*>/i, (m) => m + CSP) : CSP + doc;
  doc = /<\/body>/i.test(doc) ? doc.replace(/<\/body>/i, (m) => tail + m) : doc + tail;
  return doc;
}

function rewriteLinks(html: string) {
  const parsed = new DOMParser().parseFromString(html, "text/html");
  parsed.querySelectorAll("a[data-page]").forEach((a) => {
    a.setAttribute("href", `${a.getAttribute("data-page")}.html`);
  });
  return "<!DOCTYPE html>\n" + parsed.documentElement.outerHTML;
}

interface Props {
  files: Record<string, string>;
  device: Device;
  onDeviceChange: (d: Device) => void;
}

export default function PreviewPane({ files, page, onPageChange, device, onDeviceChange }: Props) {
  const pagePaths = useMemo(
    () =>
      Object.keys(files)
        .filter((p) => p.endsWith(".html"))
        .sort((a, b) => (a === "/index.html" ? -1 : b === "/index.html" ? 1 : a.localeCompare(b))),
    [files]
  );

  const current = files[page] !== undefined ? page : pagePaths[0];
  const frameRef = useRef<HTMLIFrameElement>(null);
  const html = files[current];
  const doc = useMemo(() => (html ? buildDoc(html, files) : ""), [html, files]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.source !== frameRef.current?.contentWindow) return;
      if (e.data?.type !== "uinexa:navigate") return;
      const target = `/${String(e.data.page).replace(/[^a-z0-9-]/gi, "")}.html`;
      if (files[target]) onPageChange(target);
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, [files, onPageChange]);

  const downloadZip = async () => {
    const { default: JSZip } = await import("jszip");
    const zip = new JSZip();
    for (const [path, content] of Object.entries(files)) {
      zip.file(path.slice(1), path.endsWith(".html") ? rewriteLinks(content) : content);
    }
    const blob = await zip.generateAsync({ type: "blob" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "uinexa-site.zip";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div>
      <div className="flex items-center justify-between border-b border-border bg-surface-2 p-2">
        <div className="flex gap-1">
          {DEVICES.map(({ id, icon: Icon, label }) => (
            <button
              key={id}
              type="button"
              onClick={() => onDeviceChange(id)}
              className={`flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs ${
                device === id ? "bg-primary text-primary-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              <Icon className="h-3.5 w-3.5" />
              {label}
            </button>
          ))}
        </div>
        {html && (
          <button
            type="button"
            onClick={downloadZip}
            className="flex items-center gap-1.5 rounded-md px-3 py-1.5 text-xs text-muted hover:text-foreground"
          >
            <Download className="h-3.5 w-3.5" />
            Download ZIP
          </button>
        )}
      </div>

      {pagePaths.length > 1 && (
        <div className="flex gap-1 overflow-x-auto border-b border-border p-2">
          {pagePaths.map((p) => (
            <button
              key={p}
              type="button"
              onClick={() => onPageChange(p)}
              className={`rounded-md px-3 py-1.5 text-xs ${
                p === current ? "bg-surface-2 text-foreground" : "text-muted hover:text-foreground"
              }`}
            >
              {p === "/index.html" ? "Home" : p.slice(1, -5)}
            </button>
          ))}
        </div>
      )}

      <div className="flex justify-center overflow-auto bg-background p-4">
        {doc ? (
          <iframe
            ref={frameRef}
            title="Generated UI preview"
            sandbox="allow-scripts"
            srcDoc={doc}
            className="rounded-lg border border-border bg-white transition-all duration-300"
            style={{ width: WIDTHS[device], maxWidth: "100%", height: 640 }}
          />
        ) : (
          <p className="py-16 text-sm text-muted">No preview available for this generation.</p>
        )}
      </div>
    </div>
  );
}