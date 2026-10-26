import { useState } from "react";
import { ChevronDown, Palette as PaletteIcon } from "lucide-react";
import { contrast } from "../../utils/color";
import type { Palette, Brief } from "../../types/generate";

export interface Settings {
  useCustomColors: boolean;
  palette: Palette;
  brandName: string;
  context: string;
}

const PRESETS: { name: string; palette: Palette }[] = [
  { name: "Zinc + Blue", palette: { primary: "#3B82F6", background: "#09090B", foreground: "#F4F4F5" } },
  { name: "Clean Light", palette: { primary: "#2563EB", background: "#FFFFFF", foreground: "#18181B" } },
  { name: "Emerald Night", palette: { primary: "#10B981", background: "#04120D", foreground: "#ECFDF5" } },
  { name: "Violet Dark", palette: { primary: "#8B5CF6", background: "#0B0B14", foreground: "#F5F3FF" } },
  { name: "Sunset Light", palette: { primary: "#EA580C", background: "#FFF7ED", foreground: "#1C1917" } },
];

export const DEFAULT_SETTINGS: Settings = {
  useCustomColors: false,
  palette: PRESETS[0].palette,
  brandName: "",
  context: "",
};

export function getSettingsError(s: Settings): string | null {
  if (s.useCustomColors && contrast(s.palette.foreground, s.palette.background) < 4.5) {
    return "Text and background colors need more contrast (minimum 4.5:1).";
  }
  return null;
}

export function toPayload(s: Settings): { palette?: Palette; brief?: Brief } {
  const brief: Brief = {};
  if (s.brandName.trim()) brief.brandName = s.brandName.trim();
  if (s.context.trim()) brief.context = s.context.trim();
  return {
    palette: s.useCustomColors ? s.palette : undefined,
    brief: Object.keys(brief).length ? brief : undefined,
  };
}

const FIELDS: { key: keyof Palette; label: string }[] = [
  { key: "primary", label: "Primary" },
  { key: "background", label: "Background" },
  { key: "foreground", label: "Text" },
];

export default function CustomizePanel({ value, onChange }: { value: Settings; onChange: (s: Settings) => void }) {
  const [open, setOpen] = useState(false);
  const error = getSettingsError(value);
  const set = (patch: Partial<Settings>) => onChange({ ...value, ...patch });

  return (
    <div className="mt-3 rounded-lg border border-border">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between px-3 py-2 text-sm text-muted hover:text-foreground"
      >
        <span className="flex items-center gap-2">
          <PaletteIcon className="h-4 w-4 text-primary" />
          Customize colors and content (optional)
        </span>
        <ChevronDown className={`h-4 w-4 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="space-y-4 border-t border-border p-3">
          <div>
            <label className="flex cursor-pointer items-center gap-2 text-sm text-foreground">
              <input
                type="checkbox"
                checked={value.useCustomColors}
                onChange={(e) => set({ useCustomColors: e.target.checked })}
                className="h-4 w-4 accent-[var(--color-primary)]"
              />
              Use my own colors
            </label>

            {value.useCustomColors && (
              <div className="mt-3 space-y-3">
                <div className="flex flex-wrap gap-2">
                  {PRESETS.map((p) => (
                    <button
                      key={p.name}
                      type="button"
                      onClick={() => set({ palette: p.palette })}
                      className="flex items-center gap-2 rounded-md border border-border px-2.5 py-1 text-xs text-muted hover:text-foreground"
                    >
                      <span className="h-3 w-3 rounded-full" style={{ background: p.palette.primary }} />
                      {p.name}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-4">
                  {FIELDS.map(({ key, label }) => (
                    <label key={key} className="flex items-center gap-2 text-xs text-muted">
                      <input
                        type="color"
                        value={value.palette[key]}
                        onChange={(e) => set({ palette: { ...value.palette, [key]: e.target.value.toUpperCase() } })}
                        className="h-8 w-10 cursor-pointer rounded border border-border bg-transparent"
                      />
                      {label} <span className="font-mono">{value.palette[key]}</span>
                    </label>
                  ))}
                </div>

                {error && <p className="text-xs text-danger">{error}</p>}
              </div>
            )}
          </div>

          <div className="grid gap-3">
            <input
              value={value.brandName}
              onChange={(e) => set({ brandName: e.target.value })}
              maxLength={60}
              placeholder="Brand name (optional)"
              className="rounded-lg border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <textarea
              value={value.context}
              onChange={(e) => set({ context: e.target.value })}
              maxLength={1500}
              rows={4}
              placeholder="What is this site about? Sections you want, tone, real text to use (optional)"
              className="resize-none rounded-lg border border-border bg-background p-2.5 text-sm text-foreground placeholder:text-muted focus:outline-none focus:ring-2 focus:ring-primary"
            />
          </div>
        </div>
      )}
    </div>
  );
}