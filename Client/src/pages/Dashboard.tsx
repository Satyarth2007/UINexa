
import {
  ArrowUpRight,
  FolderKanban,
  ScanSearch,
  Sparkles,
  CheckCircle2,
  Clock3,
} from "lucide-react";

const stats = [
  {
    label: "Total Projects",
    value: "12",
    detail: "Your design workspaces",
    icon: FolderKanban,
    color: "text-primary",
  },
  {
    label: "UI Generations",
    value: "28",
    detail: "Interfaces generated",
    icon: Sparkles,
    color: "text-fuchsia-400",
  },
  {
    label: "UI Checks",
    value: "16",
    detail: "Designs analyzed",
    icon: ScanSearch,
    color: "text-cyan-400",
  },
  {
    label: "Issues Resolved",
    value: "43",
    detail: "Across your projects",
    icon: CheckCircle2,
    color: "text-emerald-400",
  },
];

function Dashboard() {
  return (
    <div className="mx-auto max-w-7xl space-y-8 p-4 sm:p-6 lg:p-8">
      <section className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
        <div>
          <p className="text-sm font-medium text-primary">
            YOUR DESIGN COMMAND CENTER
          </p>

          <h2 className="mt-2 text-3xl font-bold tracking-tight sm:text-4xl">
            Welcome to UINexa
          </h2>

          <p className="mt-2 text-sm text-muted-foreground sm:text-base">
            Generate, inspect, and improve your interfaces.
          </p>
        </div>

        <div className="flex flex-wrap gap-3">
          <button className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-3 text-sm font-semibold text-primary-foreground transition hover:opacity-90">
            <Sparkles size={17} />
            Generate UI
          </button>

          <button className="inline-flex items-center gap-2 rounded-lg border border-border bg-card px-4 py-3 text-sm font-semibold transition hover:border-primary">
            <ScanSearch size={17} />
            Check UI
          </button>
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;

          return (
            <article
              key={stat.label}
              className="rounded-xl border border-border bg-card p-5 shadow-sm transition hover:-translate-y-0.5 hover:border-primary/50"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm text-muted-foreground">
                  {stat.label}
                </p>

                <Icon size={21} className={stat.color} />
              </div>

              <p className="mt-4 text-3xl font-bold tracking-tight">
                {stat.value}
              </p>

              <p className="mt-2 text-xs text-muted-foreground">
                {stat.detail}
              </p>
            </article>
          );
        })}
      </section>

      <section className="grid grid-cols-1 gap-5 xl:grid-cols-3">
        <article className="rounded-xl border border-border bg-card p-5 sm:p-6 xl:col-span-2">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-semibold">Quick Start</h3>
              <p className="mt-1 text-sm text-muted-foreground">
                Choose what you want to work on.
              </p>
            </div>

            <Sparkles className="text-primary" />
          </div>

          <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
            <button className="rounded-xl border border-border p-4 text-left transition hover:border-primary hover:bg-primary/5">
              <Sparkles className="text-primary" size={24} />
              <h4 className="mt-4 font-semibold">Generate a new UI</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Turn your ideas into interface blueprints.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Get started <ArrowUpRight size={16} />
              </span>
            </button>

            <button className="rounded-xl border border-border p-4 text-left transition hover:border-primary hover:bg-primary/5">
              <ScanSearch className="text-cyan-400" size={24} />
              <h4 className="mt-4 font-semibold">Check an interface</h4>
              <p className="mt-2 text-sm text-muted-foreground">
                Find consistency, responsive, and accessibility issues.
              </p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-primary">
                Start checking <ArrowUpRight size={16} />
              </span>
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-border bg-card p-5 sm:p-6">
          <div className="flex items-center gap-2">
            <Clock3 className="text-primary" size={20} />
            <h3 className="text-lg font-semibold">Recent Activity</h3>
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex gap-3">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-primary" />
              <div>
                <p className="text-sm font-medium">Workspace initialized</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Your UINexa workspace is ready.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-fuchsia-400" />
              <div>
                <p className="text-sm font-medium">AI Generator</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Start your first UI generation.
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <div className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-400" />
              <div>
                <p className="text-sm font-medium">UI Consistency Checker</p>
                <p className="mt-1 text-xs text-muted-foreground">
                  Analyze your first interface.
                </p>
              </div>
            </div>
          </div>
        </article>
      </section>
    </div>
  );
}

export default Dashboard;
