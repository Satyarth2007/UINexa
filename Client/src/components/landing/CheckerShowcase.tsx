import { CircleCheck, CircleX, TriangleAlert } from "lucide-react";

const issues = [
  { level: "danger", icon: CircleX, title: "Low contrast text", detail: "Muted text on a light background measures about 2.5:1. WCAG AA needs 4.5:1." },
  { level: "warning", icon: TriangleAlert, title: "Hard-coded color", detail: "#3B82F6 is used directly instead of the primary token." },
  { level: "warning", icon: TriangleAlert, title: "Off-scale spacing", detail: "A 13px gap breaks the 4px spacing scale." },
  { level: "success", icon: CircleCheck, title: "Typography is consistent", detail: "All headings follow the defined type scale." },
] as const;

const tone = {
  danger: "text-danger bg-danger/10",
  warning: "text-warning bg-warning/10",
  success: "text-success bg-success/10",
};

export function CheckerShowcase() {
  return (
    <section id="checker" className="scroll-mt-20 border-t border-border bg-surface/40 py-20">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 lg:grid-cols-2">
        <div>
          <h2 className="text-3xl font-semibold tracking-tight">
            Catch inconsistencies before users do
          </h2>
          <p className="mt-3 text-muted">
            Rule-based checks find the objective problems fast. An AI review then covers the
            subjective ones, like visual hierarchy and alignment. Every issue has a severity and
            a suggested fix.
          </p>
          <ul className="mt-6 space-y-2 text-sm">
            {["Contrast and accessibility", "Spacing and typography scales", "Design token usage"].map((t) => (
              <li key={t} className="flex items-center gap-2">
                <CircleCheck size={16} className="text-success" /> {t}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-xl border border-border bg-surface p-5">
          <div className="flex items-center justify-between">
            <p className="font-medium">Example report</p>
            <p className="text-sm text-muted">
              Score <span className="text-2xl font-semibold text-foreground">78</span>/100
            </p>
          </div>
          <div className="mt-4 space-y-3">
            {issues.map(({ level, icon: Icon, title, detail }) => (
              <div key={title} className="flex gap-3 rounded-lg border border-border p-3">
                <span className={`inline-flex size-8 shrink-0 items-center justify-center rounded-md ${tone[level]}`}>
                  <Icon size={16} />
                </span>
                <div>
                  <p className="text-sm font-medium">{title}</p>
                  <p className="text-xs text-muted">{detail}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}