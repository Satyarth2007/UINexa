import { CircleCheck } from "lucide-react";

const code = [
  '<section className="p-8">',
  '  <h2 className="text-2xl font-semibold">',
  "    Simple pricing",
  "  </h2>",
  '  <div className="mt-4 grid gap-4">',
  '    <PlanCard name="Pro" price="$12" />',
  "  </div>",
  "</section>",
];

export function ProductPreview() {
  return (
    <div className="mx-auto max-w-5xl overflow-hidden rounded-xl border border-border bg-surface text-left shadow-2xl shadow-black/20">
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="size-3 rounded-full bg-border" />
        <span className="size-3 rounded-full bg-border" />
        <span className="size-3 rounded-full bg-border" />
        <span className="ml-3 text-xs text-muted">uinexa / generator</span>
      </div>

      <div className="grid md:grid-cols-3">
        <div className="space-y-3 border-b border-border p-4 md:border-b-0 md:border-r">
          <p className="text-xs font-medium uppercase tracking-wide text-muted">Prompt</p>
          <div className="rounded-lg border border-border bg-background p-3 text-sm">
            A clean pricing section with a highlighted Pro plan
          </div>
          <div className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground">
            Generate
          </div>
        </div>

        <div className="border-b border-border p-4 md:border-b-0 md:border-r">
          <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted">Code</p>
          <pre className="overflow-x-auto rounded-lg bg-background p-3 font-mono text-xs leading-relaxed text-muted">
            {code.join("\n")}
          </pre>
        </div>

        <div className="p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-xs font-medium uppercase tracking-wide text-muted">Preview</p>
            <span className="inline-flex items-center gap-1 rounded-full bg-success/15 px-2 py-0.5 text-xs text-success">
              <CircleCheck size={12} /> 92 consistent
            </span>
          </div>
          <div className="space-y-3 rounded-lg border border-border bg-background p-4">
            <p className="text-sm font-semibold">Simple pricing</p>
            <div className="rounded-lg border border-primary p-3">
              <p className="text-sm font-medium">Pro</p>
              <p className="text-2xl font-semibold">$12</p>
            </div>
            <div className="rounded-lg border border-border p-3">
              <p className="text-sm font-medium">Free</p>
              <p className="text-2xl font-semibold">$0</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}