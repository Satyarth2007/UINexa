import { Code, Eye, History, Palette, ShieldCheck, Sparkles } from "lucide-react";

const features = [
  { icon: Sparkles, title: "Prompt to UI", text: "Describe a screen in plain language and get React and Tailwind code back." },
  { icon: Eye, title: "Live preview", text: "See the result instantly in a sandbox, across mobile, tablet and desktop widths." },
  { icon: Code, title: "Editable code", text: "Tweak the generated files in a full code editor and watch the preview update." },
  { icon: ShieldCheck, title: "Consistency checker", text: "Scan any UI for contrast, spacing and typography problems, with a clear score." },
  { icon: Palette, title: "Design token rules", text: "Define your colors and spacing once. The checker flags every hard-coded value." },
  { icon: History, title: "Saved history", text: "Every generation and report is kept, so you can compare versions and revisit ideas." },
];

export function Features() {
  return (
    <section id="features" className="scroll-mt-20 border-t border-border bg-surface/40 py-20">
      <div className="mx-auto max-w-6xl px-4">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-semibold tracking-tight">Everything in one workspace</h2>
          <p className="mt-3 text-muted">
            Generate a first draft quickly, then make sure it follows your design system.
          </p>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.map(({ icon: Icon, title, text }) => (
            <div
              key={title}
              className="rounded-xl border border-border bg-surface p-5 transition hover:border-primary/50"
            >
              <div className="mb-4 inline-flex size-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <Icon size={20} />
              </div>
              <h3 className="font-medium">{title}</h3>
              <p className="mt-1.5 text-sm text-muted">{text}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}