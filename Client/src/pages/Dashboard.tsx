import { Link } from "react-router-dom";
import {
  Sparkles, ShieldCheck, ArrowRight, Layers, Cpu, Clock, FileCode2, Lightbulb,
} from "lucide-react";
import { useMe } from "../hooks/useAuth";
import { useGenerations } from "../hooks/useGenerate";

const EXAMPLES = [
  "Pricing page with 3 tiers and a highlighted middle plan",
  "SaaS analytics dashboard with sidebar, stat cards and a table",
  "Modern login form with social buttons and a remember-me toggle",
  "Portfolio hero section with avatar, skills and contact button",
];

function timeAgo(iso: string | null) {
  if (!iso) return "—";
  const s = Math.floor((Date.now() - new Date(iso).getTime()) / 1000);
  if (s < 60) return "just now";
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  if (s < 86400) return `${Math.floor(s / 3600)}h ago`;
  return `${Math.floor(s / 86400)}d ago`;
}

function Stat({ icon: Icon, label, value }: { icon: typeof Layers; label: string; value: string }) {
  return (
    <div className="rounded-xl border border-border bg-surface p-5">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Icon className="h-4 w-4 text-primary" />
        {label}
      </div>
      <p className="mt-2 text-2xl font-semibold text-foreground">{value}</p>
    </div>
  );
}

export default function Dashboard() {
  const { data: user } = useMe(); // ADAPT if your hook returns the user differently
  const { data, isLoading } = useGenerations();
  const firstName = (user as any)?.name?.split(" ")[0] ?? "there";

  const stats = data?.stats;
  const items = data?.items ?? [];

  return (
    <div className="mx-auto max-w-6xl space-y-8 px-4 py-10">
      {/* Header */}
      <section className="relative overflow-hidden rounded-2xl border border-border bg-surface p-8">
        <div className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
        <div className="relative flex flex-col gap-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-foreground sm:text-3xl">
              Welcome back, {firstName} 👋
            </h1>
            <p className="mt-2 max-w-xl text-sm text-muted">
              Describe an interface and UInexa builds it in React + TypeScript, styled with your design tokens.
            </p>
          </div>
          <Link
            to="/dashboard/generate"
            className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <Sparkles className="h-4 w-4" />
            New generation
          </Link>
        </div>
      </section>

      {/* Stats */}
      <section className="grid gap-4 sm:grid-cols-3">
        <Stat icon={Layers} label="UIs generated" value={isLoading ? "…" : String(stats?.total ?? 0)} />
        <Stat
          icon={Cpu}
          label="Tokens used"
          value={isLoading ? "…" : (stats?.tokens ?? 0).toLocaleString()}
        />
        <Stat icon={Clock} label="Last generated" value={isLoading ? "…" : timeAgo(stats?.lastGeneratedAt ?? null)} />
      </section>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent generations */}
        <section className="rounded-xl border border-border bg-surface lg:col-span-2">
          <div className="flex items-center justify-between border-b border-border px-5 py-4">
            <h2 className="text-base font-medium text-foreground">Recent generations</h2>
            <Link to="/dashboard/generate" className="flex items-center gap-1 text-sm text-primary">
              Create new <ArrowRight className="h-4 w-4" />
            </Link>
          </div>

          {isLoading ? (
            <div className="space-y-3 p-5">
              {[0, 1, 2].map((i) => (
                <div key={i} className="h-14 animate-pulse rounded-lg bg-surface-2" />
              ))}
            </div>
          ) : items.length === 0 ? (
            <div className="flex flex-col items-center px-6 py-14 text-center">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                <Sparkles className="h-6 w-6" />
              </div>
              <p className="mt-4 text-sm font-medium text-foreground">No generations yet</p>
              <p className="mt-1 text-sm text-muted">Try one of the example prompts to get started.</p>
            </div>
          ) : (
            <ul className="divide-y divide-border">
              {items.map((g) => (
                <li key={g.id} className="flex items-start gap-3 px-5 py-4">
                  <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-surface-2 text-primary">
                    <FileCode2 className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-medium text-foreground">{g.prompt}</p>
                    <p className="mt-0.5 line-clamp-1 text-xs text-muted">{g.summary}</p>
                    <p className="mt-1 text-xs text-muted">
                      {g.fileCount} files · {g.model}
                    </p>
                  </div>
                  <span className="shrink-0 text-xs text-muted">{timeAgo(g.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>

        {/* Right column */}
        <div className="space-y-6">
          <section className="rounded-xl border border-border bg-surface p-5">
            <h2 className="flex items-center gap-2 text-base font-medium text-foreground">
              <Lightbulb className="h-4 w-4 text-warning" />
              Try an example
            </h2>
            <div className="mt-4 space-y-2">
              {EXAMPLES.map((ex) => (
                <Link
                  key={ex}
                  to={`/dashboard/generate?prompt=${encodeURIComponent(ex)}`}
                  className="block rounded-lg border border-border bg-background px-3 py-2.5 text-sm text-muted transition-colors hover:border-primary hover:text-foreground"
                >
                  {ex}
                </Link>
              ))}
            </div>
          </section>

          <section className="rounded-xl border border-border bg-surface p-5 opacity-80">
            <div className="flex items-center justify-between">
              <h2 className="flex items-center gap-2 text-base font-medium text-foreground">
                <ShieldCheck className="h-4 w-4 text-primary" />
                UI Checker
              </h2>
              <span className="rounded-full bg-primary/10 px-2 py-0.5 text-xs text-primary">Coming soon</span>
            </div>
            <p className="mt-2 text-sm text-muted">
              Audit any UI for contrast, spacing, typography and token usage, with a score and severity levels.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}