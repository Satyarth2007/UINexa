import { CircleCheck, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const points = [
  "Live preview in seconds",
  "Rule-based and AI consistency checks",
  "Your design tokens, enforced",
];

export function AuthShowcase() {
  return (
    <aside className="relative hidden flex-col justify-between overflow-hidden border-r border-border bg-surface p-10 lg:flex">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(var(--border) 1px, transparent 1px)",
          backgroundSize: "22px 22px",
          maskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 80% 70% at 50% 45%, black, transparent)",
        }}
      />

      <div aria-hidden className="pointer-events-none absolute inset-0 flex items-center justify-center">
        {[0, 2, 4].map((delay) => (
          <span
            key={delay}
            className="animate-ripple absolute size-[26rem] rounded-full border border-primary/40"
            style={{ animationDelay: `${delay}s` }}
          />
        ))}
      </div>

      <Link to="/" className="relative text-xl font-semibold tracking-tight">
        UI<span className="text-primary">nexa</span>
      </Link>

      <div className="relative mx-auto h-[24rem] w-full max-w-sm">
        <div className="relative z-10 rounded-xl border border-border bg-background/80 p-3 backdrop-blur">
          <p className="mb-2 flex items-center gap-1.5 text-xs font-medium uppercase tracking-wide text-muted">
            <Sparkles size={12} className="text-primary" /> Prompt
          </p>
          <div className="font-mono text-sm">
            <span className="animate-typing inline-block overflow-hidden whitespace-nowrap border-r-2 border-primary align-bottom">
              A login card with email and password
            </span>
          </div>
        </div>

        <div className="animate-float-a absolute left-0 top-24 w-48 rounded-xl border border-border bg-background p-4 shadow-xl shadow-black/10">
          <div className="h-2.5 w-20 rounded bg-foreground/80" />
          <div className="mt-4 space-y-2">
            <div className="h-7 rounded-md border border-border" />
            <div className="h-7 rounded-md border border-border" />
          </div>
          <div className="mt-3 h-7 rounded-md bg-primary" />
        </div>

        <div className="animate-float-b absolute right-0 top-32 w-40 rounded-xl border border-border bg-background p-4 shadow-xl shadow-black/10">
          <p className="text-xs text-muted">Consistency</p>
          <p className="mt-1 text-3xl font-semibold">96</p>
          <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-border">
            <div className="h-full w-[96%] rounded-full bg-success" />
          </div>
          <p className="mt-2 flex items-center gap-1 text-xs text-success">
            <CircleCheck size={12} /> No critical issues
          </p>
        </div>

        <div className="animate-float-c absolute bottom-0 left-12 w-52 rounded-xl border border-border bg-background p-4 shadow-xl shadow-black/10">
          <p className="text-xs text-muted">Design tokens</p>
          <div className="mt-2 flex gap-2">
            <span className="size-6 rounded-md bg-primary" />
            <span className="size-6 rounded-md bg-success" />
            <span className="size-6 rounded-md bg-warning" />
            <span className="size-6 rounded-md bg-danger" />
            <span className="size-6 rounded-md border border-border bg-foreground" />
          </div>
        </div>
      </div>

      <div className="relative">
        <h2 className="text-2xl font-semibold tracking-tight">Generate UI. Keep it consistent.</h2>
        <ul className="mt-4 space-y-2 text-sm text-muted">
          {points.map((p) => (
            <li key={p} className="flex items-center gap-2">
              <CircleCheck size={16} className="text-success" /> {p}
            </li>
          ))}
        </ul>
      </div>
    </aside>
  );
}