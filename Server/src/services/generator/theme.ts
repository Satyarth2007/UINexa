export interface PaletteInput {
  primary: string;
  background: string;
  foreground: string;
}

export interface Tokens {
  background: string; surface: string; "surface-2": string; border: string;
  foreground: string; muted: string; primary: string; "primary-foreground": string;
  success: string; warning: string; danger: string;
}

type RGB = [number, number, number];

const clamp = (n: number) => Math.max(0, Math.min(255, Math.round(n)));
const parse = (h: string): RGB => [1, 3, 5].map((i) => parseInt(h.slice(i, i + 2), 16)) as RGB;
const toHex = (c: RGB) => "#" + c.map((v) => clamp(v).toString(16).padStart(2, "0")).join("").toUpperCase();

// t = how much of b to blend into a (0 to 1)
export function mix(a: string, b: string, t: number) {
  const A = parse(a), B = parse(b);
  return toHex(A.map((v, i) => v + (B[i] - v) * t) as RGB);
}

function luminance(hex: string) {
  const [r, g, b] = parse(hex).map((v) => {
    const c = v / 255;
    return c <= 0.03928 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}

export function contrast(a: string, b: string) {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x);
  return (hi + 0.05) / (lo + 0.05);
}

const STATUS = { success: "#22C55E", warning: "#F59E0B", danger: "#EF4444" };

const DEFAULT_TOKENS: Tokens = {
  background: "#09090B", surface: "#18181B", "surface-2": "#27272A", border: "#27272A",
  foreground: "#F4F4F5", muted: "#A1A1AA", primary: "#3B82F6", "primary-foreground": "#FFFFFF",
  ...STATUS,
};

export function resolveTokens(p?: PaletteInput): { tokens: Tokens; mode: "dark" | "light"; custom: boolean } {
  if (!p) return { tokens: DEFAULT_TOKENS, mode: "dark", custom: false };

  const bg = p.background.toUpperCase();
  const fg = p.foreground.toUpperCase();
  const primary = p.primary.toUpperCase();

  const tokens: Tokens = {
    background: bg,
    surface: mix(bg, fg, 0.06),
    "surface-2": mix(bg, fg, 0.12),
    border: mix(bg, fg, 0.16),
    foreground: fg,
    muted: mix(fg, bg, 0.35),
    primary,
    "primary-foreground": contrast(primary, "#FFFFFF") >= contrast(primary, "#000000") ? "#FFFFFF" : "#000000",
    ...STATUS,
  };
  return { tokens, mode: luminance(bg) < 0.4 ? "dark" : "light", custom: true };
}

export function tokensToCss(t: Tokens) {
  return Object.entries(t).map(([k, v]) => `--${k}: ${v};`).join("\n");
}