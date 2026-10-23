
import { useState } from "react";
import {
  Activity,
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  Blocks,
  Check,
  Code2,
  Eye,
  Fingerprint,
  Layers3,
  Menu,
  ScanSearch,
  Sparkles,
  X,
  Zap,
} from "lucide-react";

const features = [
  {
    number: "01",
    icon: Sparkles,
    title: "AI UI Generator",
    description:
      "Turn simple text prompts into structured, reusable React interface designs.",
    tag: "GENERATE",
    color: "cyan",
  },
  {
    number: "02",
    icon: ScanSearch,
    title: "UI Consistency Checker",
    description:
      "Analyze your website screenshots and identify visual inconsistencies.",
    tag: "ANALYZE",
    color: "pink",
  },
  {
    number: "03",
    icon: Eye,
    title: "Responsive Testing",
    description:
      "Inspect your layouts across desktop and mobile screen sizes.",
    tag: "RESPONSIVE",
    color: "purple",
  },
  {
    number: "04",
    icon: Fingerprint,
    title: "Accessibility Analysis",
    description:
      "Find accessibility problems and get actionable suggestions to fix them.",
    tag: "ACCESSIBILITY",
    color: "cyan",
  },
  {
    number: "05",
    icon: Blocks,
    title: "Reusable Design Systems",
    description:
      "Keep colors, typography, spacing, and components consistent across pages.",
    tag: "DESIGN SYSTEM",
    color: "pink",
  },
  {
    number: "06",
    icon: Code2,
    title: "Developer-Friendly Output",
    description:
      "Organize your interface into structured blueprints and reusable components.",
    tag: "BUILD",
    color: "purple",
  },
];

const steps = [
  {
    number: "01",
    title: "Describe or upload",
    description:
      "Tell the AI what you want to build, or upload screenshots of your existing interface for analysis.",
    icon: Layers3,
  },
  {
    number: "02",
    title: "Generate or analyze",
    description:
      "Create a new interface or inspect your existing design for visual and usability issues.",
    icon: ScanSearch,
  },
  {
    number: "03",
    title: "Improve your UI",
    description:
      "Review findings, understand suggested fixes, and move toward a more consistent interface.",
    icon: Zap,
  },
];

function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const closeMobileMenu = () => setMobileMenuOpen(false);

  return (
    <div className="dark min-h-screen overflow-hidden bg-[#080812] text-slate-100 selection:bg-cyan-300 selection:text-slate-950">
      {/* Background decoration */}
      <div className="pointer-events-none fixed inset-0 -z-0 overflow-hidden">
        <div className="absolute -left-40 top-20 h-96 w-96 rounded-full bg-cyan-500/10 blur-[120px]" />
        <div className="absolute -right-40 top-80 h-96 w-96 rounded-full bg-fuchsia-600/10 blur-[120px]" />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "linear-gradient(rgba(34,211,238,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(34,211,238,0.4) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage:
              "linear-gradient(to bottom, black, transparent 75%)",
          }}
        />
      </div>

      {/* Navigation */}
      <header className="relative z-20 border-b border-white/[0.08] bg-[#080812]/80 backdrop-blur-xl">
        <nav className="mx-auto flex h-[72px] max-w-7xl items-center justify-between px-5 sm:px-8">
          <a href="/" className="flex items-center gap-3" aria-label="UINexa home">
            <span className="flex h-10 w-10 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-300 shadow-[0_0_24px_rgba(34,211,238,0.12)]">
              <Activity size={23} />
            </span>
            <span className="text-xl font-bold tracking-tight">
              UI<span className="text-cyan-300">Nexa</span>
            </span>
          </a>

          <div className="hidden items-center gap-8 md:flex">
            <a
              href="#features"
              className="text-sm text-slate-400 transition hover:text-cyan-300"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="text-sm text-slate-400 transition hover:text-cyan-300"
            >
              How It Works
            </a>
            <a
              href="#about"
              className="text-sm text-slate-400 transition hover:text-cyan-300"
            >
              About
            </a>
          </div>

          <div className="hidden items-center gap-3 md:flex">
            <a
              href="/login"
              className="rounded-lg px-4 py-2.5 text-sm font-medium text-slate-300 transition hover:text-cyan-300"
            >
              Login
            </a>
            <a
              href="/register"
              className="group inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:bg-cyan-200 hover:shadow-[0_0_28px_rgba(34,211,238,0.25)]"
            >
              Sign Up <ArrowUpRight size={16} />
            </a>
          </div>

          <button
            type="button"
            onClick={() => setMobileMenuOpen((open) => !open)}
            className="rounded-lg border border-white/10 p-2 text-slate-200 md:hidden"
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileMenuOpen}
          >
            {mobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </nav>

        {mobileMenuOpen && (
          <div className="border-t border-white/10 bg-[#0c0c19] px-5 py-5 md:hidden">
            <div className="flex flex-col gap-1">
              <a
                href="#features"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/5"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/5"
              >
                How It Works
              </a>
              <a
                href="#about"
                onClick={closeMobileMenu}
                className="rounded-lg px-3 py-3 text-sm text-slate-300 hover:bg-white/5"
              >
                About
              </a>
              <div className="mt-3 grid grid-cols-2 gap-3">
                <a
                  href="/login"
                  onClick={closeMobileMenu}
                  className="rounded-lg border border-white/15 px-4 py-3 text-center text-sm font-semibold"
                >
                  Login
                </a>
                <a
                  href="/register"
                  onClick={closeMobileMenu}
                  className="rounded-lg bg-cyan-300 px-4 py-3 text-center text-sm font-bold text-slate-950"
                >
                  Sign Up
                </a>
              </div>
            </div>
          </div>
        )}
      </header>

      <main className="relative z-10">
        {/* Hero */}
        <section className="mx-auto grid max-w-7xl items-center gap-14 px-5 pb-24 pt-20 sm:px-8 sm:pt-28 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10 lg:pb-32 lg:pt-32">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/[0.07] px-3.5 py-2 text-xs font-semibold tracking-wide text-cyan-200">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-cyan-300 opacity-50" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-cyan-300" />
              </span>
              THE AI-POWERED UI WORKSPACE
            </div>

            <h1 className="mt-7 max-w-2xl text-4xl font-bold leading-[1.12] tracking-tight sm:text-5xl lg:text-6xl xl:text-[68px]">
              Design smarter.
              <br />
              Build <span className="text-cyan-300">faster.</span>
              <br />
              Stay{" "}
              <span className="bg-gradient-to-r from-fuchsia-400 to-pink-300 bg-clip-text text-transparent">
                consistent.
              </span>
            </h1>

            <p className="mt-6 max-w-xl text-base leading-8 text-slate-400 sm:text-lg">
              Generate modern interfaces with AI, analyze your existing website,
              and find design inconsistencies—all in one workspace built for
              developers and designers.
            </p>

            <div className="mt-9 flex flex-col gap-3 sm:flex-row">
              <a
                href="/register"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 py-3.5 font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-[0_0_32px_rgba(34,211,238,0.22)]"
              >
                <Sparkles size={18} />
                Get Started
                <ArrowRight size={17} />
              </a>
              <a
                href="#features"
                className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/[0.03] px-6 py-3.5 font-semibold text-slate-200 transition hover:border-fuchsia-400/50 hover:bg-fuchsia-400/[0.06]"
              >
                Explore Features
                <ArrowDown size={17} />
              </a>
            </div>

            <div className="mt-9 flex flex-wrap items-center gap-x-5 gap-y-3 text-sm text-slate-500">
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-cyan-300" />
                AI-assisted workflows
              </span>
              <span className="inline-flex items-center gap-2">
                <Check size={16} className="text-cyan-300" />
                Built for responsive UI
              </span>
            </div>
          </div>

          {/* Decorative product preview */}
          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-5 rounded-[32px] bg-gradient-to-br from-cyan-400/10 via-transparent to-fuchsia-500/10 blur-2xl" />

            <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-[#10101d] shadow-2xl shadow-cyan-950/30">
              <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3.5 sm:px-5">
                <div className="flex items-center gap-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-rose-400" />
                  <span className="h-2.5 w-2.5 rounded-full bg-amber-300" />
                  <span className="h-2.5 w-2.5 rounded-full bg-emerald-400" />
                </div>
                <span className="text-[10px] font-semibold tracking-[0.2em] text-slate-500 sm:text-xs">
                  UINEXA / WORKSPACE
                </span>
                <div className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
              </div>

              <div className="grid min-h-[330px] grid-cols-[54px_1fr] sm:grid-cols-[68px_1fr]">
                <aside className="flex flex-col items-center gap-5 border-r border-white/[0.08] bg-white/[0.015] py-5">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-300/15 text-cyan-300">
                    <Activity size={17} />
                  </div>
                  <Layers3 size={18} className="text-slate-600" />
                  <Sparkles size={18} className="text-slate-600" />
                  <ScanSearch size={18} className="text-slate-600" />
                  <Blocks size={18} className="text-slate-600" />
                </aside>

                <div className="min-w-0 p-4 sm:p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-[10px] font-semibold tracking-[0.18em] text-cyan-300 sm:text-xs">
                        PROJECT OVERVIEW
                      </p>
                      <h2 className="mt-2 text-lg font-bold sm:text-2xl">
                        Design workspace
                      </h2>
                      <p className="mt-1 text-xs text-slate-500 sm:text-sm">
                        Your UI, improved with AI.
                      </p>
                    </div>
                    <span className="rounded-lg border border-fuchsia-400/20 bg-fuchsia-400/10 px-2 py-1.5 text-[10px] font-semibold text-fuchsia-300 sm:text-xs">
                      AI READY
                    </span>
                  </div>

                  <div className="mt-5 grid grid-cols-2 gap-3">
                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 sm:text-xs">
                          UI GENERATOR
                        </span>
                        <Sparkles size={15} className="text-cyan-300" />
                      </div>
                      <div className="mt-3 text-sm font-semibold sm:text-base">
                        Create a UI
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-3/4 rounded-full bg-cyan-300" />
                      </div>
                    </div>

                    <div className="rounded-xl border border-white/[0.08] bg-white/[0.025] p-3 sm:p-4">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 sm:text-xs">
                          UI ANALYSIS
                        </span>
                        <ScanSearch size={15} className="text-fuchsia-300" />
                      </div>
                      <div className="mt-3 text-sm font-semibold sm:text-base">
                        Inspect design
                      </div>
                      <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                        <div className="h-full w-1/2 rounded-full bg-fuchsia-400" />
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 rounded-xl border border-white/[0.08] bg-[#0b0b16] p-3 sm:p-4">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs font-semibold text-slate-300 sm:text-sm">
                        Interface preview
                      </span>
                      <span className="text-[10px] text-cyan-300 sm:text-xs">
                        LIVE PREVIEW CONCEPT
                      </span>
                    </div>
                    <div className="mt-4 grid grid-cols-[0.65fr_1.35fr] gap-3">
                      <div className="space-y-2">
                        <div className="h-3 w-4/5 rounded bg-white/10" />
                        <div className="h-2 w-full rounded bg-white/[0.06]" />
                        <div className="h-2 w-3/4 rounded bg-white/[0.06]" />
                        <div className="mt-4 h-7 w-full rounded-md border border-cyan-300/25 bg-cyan-300/10" />
                      </div>
                      <div className="rounded-lg border border-white/[0.08] p-2.5">
                        <div className="flex items-center gap-2">
                          <div className="h-6 w-6 rounded-md bg-gradient-to-br from-cyan-300 to-fuchsia-400" />
                          <div className="h-2 w-2/5 rounded bg-white/15" />
                        </div>
                        <div className="mt-3 flex h-16 items-end gap-1.5 sm:h-20">
                          <div className="h-[35%] flex-1 rounded-t bg-cyan-300/30" />
                          <div className="h-[60%] flex-1 rounded-t bg-cyan-300/50" />
                          <div className="h-[45%] flex-1 rounded-t bg-fuchsia-400/40" />
                          <div className="h-[85%] flex-1 rounded-t bg-cyan-300/80" />
                          <div className="h-[65%] flex-1 rounded-t bg-fuchsia-400/70" />
                          <div className="h-full flex-1 rounded-t bg-cyan-300/50" />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="mt-4 flex items-center gap-2 rounded-lg border border-cyan-300/15 bg-cyan-300/[0.05] px-3 py-2.5">
                    <Zap size={15} className="shrink-0 text-cyan-300" />
                    <p className="text-[10px] leading-relaxed text-slate-400 sm:text-xs">
                      Generate, review, and improve your interface in one place.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="absolute -bottom-5 -left-3 hidden items-center gap-3 rounded-xl border border-white/10 bg-[#151523] p-3 shadow-xl sm:flex sm:-left-8">
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-fuchsia-400/10 text-fuchsia-300">
                <ScanSearch size={19} />
              </span>
              <div>
                <p className="text-xs font-semibold">UI analysis</p>
                <p className="mt-1 text-[10px] text-slate-500">
                  Find issues. Improve quality.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Short value strip */}
        <section className="relative border-y border-white/[0.08] bg-white/[0.02]">
          <div className="mx-auto grid max-w-7xl grid-cols-2 gap-6 px-5 py-7 sm:px-8 md:grid-cols-4">
            {[
              ["01", "Generate interfaces"],
              ["02", "Check consistency"],
              ["03", "Test responsiveness"],
              ["04", "Improve accessibility"],
            ].map(([number, label]) => (
              <div key={number} className="flex items-center gap-3">
                <span className="font-mono text-sm text-cyan-300">{number}</span>
                <span className="text-xs font-medium text-slate-400 sm:text-sm">
                  {label}
                </span>
              </div>
            ))}
          </div>
        </section>

        {/* Features */}
        <section id="features" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:py-32">
          <div className="mx-auto max-w-7xl">
            <div className="mx-auto max-w-2xl text-center">
              <p className="text-xs font-bold tracking-[0.25em] text-cyan-300 sm:text-sm">
                ONE WORKSPACE. MORE POSSIBILITIES.
              </p>
              <h2 className="mt-4 text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
                Everything your UI workflow needs
              </h2>
              <p className="mt-5 text-sm leading-7 text-slate-400 sm:text-base">
                From your first prompt to the final quality check, UINexa brings
                interface generation and design analysis into one workflow.
              </p>
            </div>

            <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {features.map((feature) => {
                const Icon = feature.icon;
                const isCyan = feature.color === "cyan";
                const isPink = feature.color === "pink";

                return (
                  <article
                    key={feature.number}
                    className="group relative overflow-hidden rounded-2xl border border-white/[0.09] bg-[#10101b]/90 p-6 transition duration-300 hover:-translate-y-1 hover:border-cyan-300/30 hover:shadow-[0_16px_50px_rgba(0,0,0,0.2)] sm:p-7"
                  >
                    <div
                      className={`absolute -right-10 -top-10 h-28 w-28 rounded-full blur-3xl transition group-hover:opacity-100 ${
                        isCyan
                          ? "bg-cyan-400/10"
                          : isPink
                            ? "bg-fuchsia-400/10"
                            : "bg-violet-400/10"
                      }`}
                    />

                    <div className="relative flex items-start justify-between">
                      <div
                        className={`flex h-12 w-12 items-center justify-center rounded-xl border ${
                          isCyan
                            ? "border-cyan-300/20 bg-cyan-300/10 text-cyan-300"
                            : isPink
                              ? "border-fuchsia-300/20 bg-fuchsia-300/10 text-fuchsia-300"
                              : "border-violet-300/20 bg-violet-300/10 text-violet-300"
                        }`}
                      >
                        <Icon size={23} />
                      </div>
                      <span className="font-mono text-xs text-slate-600">
                        {feature.number}
                      </span>
                    </div>

                    <p
                      className={`relative mt-6 text-[10px] font-bold tracking-[0.2em] ${
                        isCyan
                          ? "text-cyan-300"
                          : isPink
                            ? "text-fuchsia-300"
                            : "text-violet-300"
                      }`}
                    >
                      {feature.tag}
                    </p>
                    <h3 className="relative mt-2 text-lg font-semibold">
                      {feature.title}
                    </h3>
                    <p className="relative mt-3 text-sm leading-7 text-slate-400">
                      {feature.description}
                    </p>

                    <div className="relative mt-6 flex items-center gap-2 text-xs font-semibold text-slate-500 transition group-hover:text-cyan-300">
                      Explore capability
                      <ArrowRight
                        size={14}
                        className="transition group-hover:translate-x-1"
                      />
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section
          id="how-it-works"
          className="scroll-mt-20 border-y border-white/[0.08] bg-white/[0.02] px-5 py-24 sm:px-8 lg:py-28"
        >
          <div className="mx-auto max-w-7xl">
            <div className="grid gap-12 lg:grid-cols-[0.8fr_1.2fr] lg:gap-20">
              <div>
                <p className="text-xs font-bold tracking-[0.25em] text-fuchsia-300 sm:text-sm">
                  A SIMPLER WORKFLOW
                </p>
                <h2 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl">
                  From idea to a better interface.
                </h2>
                <p className="mt-5 max-w-lg text-sm leading-7 text-slate-400 sm:text-base">
                  Whether you are creating something new or improving an existing
                  website, UINexa helps you move through the process with more
                  clarity.
                </p>
                <a
                  href="/register"
                  className="mt-8 inline-flex items-center gap-2 font-semibold text-cyan-300 transition hover:text-cyan-200"
                >
                  Start your workflow <ArrowRight size={17} />
                </a>
              </div>

              <div className="space-y-4">
                {steps.map((step, index) => {
                  const Icon = step.icon;

                  return (
                    <article
                      key={step.number}
                      className="flex gap-4 rounded-2xl border border-white/[0.09] bg-[#10101b]/80 p-5 sm:gap-6 sm:p-6"
                    >
                      <div className="flex shrink-0 flex-col items-center gap-3">
                        <div className="flex h-12 w-12 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/[0.08] text-cyan-300">
                          <Icon size={22} />
                        </div>
                        {index !== steps.length - 1 && (
                          <div className="h-7 w-px bg-gradient-to-b from-cyan-300/40 to-fuchsia-400/20" />
                        )}
                      </div>
                      <div className="pb-1">
                        <p className="font-mono text-xs text-fuchsia-300">
                          STEP {step.number}
                        </p>
                        <h3 className="mt-2 text-lg font-semibold">
                          {step.title}
                        </h3>
                        <p className="mt-2 text-sm leading-7 text-slate-400">
                          {step.description}
                        </p>
                      </div>
                    </article>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* About / CTA */}
        <section id="about" className="scroll-mt-20 px-5 py-24 sm:px-8 lg:py-32">
          <div className="relative mx-auto max-w-5xl overflow-hidden rounded-3xl border border-cyan-300/20 bg-[#10101d] px-6 py-12 text-center sm:px-12 sm:py-16">
            <div className="pointer-events-none absolute -left-20 -top-24 h-64 w-64 rounded-full bg-cyan-400/10 blur-[90px]" />
            <div className="pointer-events-none absolute -bottom-24 -right-16 h-64 w-64 rounded-full bg-fuchsia-500/10 blur-[90px]" />

            <div className="relative">
              <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl border border-cyan-300/25 bg-cyan-300/10 text-cyan-300">
                <Activity size={27} />
              </span>
              <p className="mt-6 text-xs font-bold tracking-[0.25em] text-cyan-300">
                MEET YOUR NEW UI WORKSPACE
              </p>
              <h2 className="mx-auto mt-4 max-w-3xl text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
                Make every interface a step better.
              </h2>
              <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-400 sm:text-base">
                Start exploring AI-powered UI generation and consistency
                analysis with UINexa.
              </p>
              <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
                <a
                  href="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-cyan-300 px-6 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-200"
                >
                  Create Your Account <ArrowRight size={17} />
                </a>
                <a
                  href="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-white/15 px-6 py-3.5 font-semibold text-slate-200 transition hover:border-fuchsia-300/40 hover:bg-fuchsia-300/[0.05]"
                >
                  I already have an account
                </a>
              </div>
            </div>
          </div>
        </section>
      </main>

        {/* Attractive Multi-Column Footer */}
      <footer className="relative z-10 overflow-hidden border-t border-cyan-300/15 bg-[#070710]">
        {/* Decorative background glow */}
        <div className="pointer-events-none absolute -left-32 top-0 h-72 w-72 rounded-full bg-cyan-400/[0.07] blur-[100px]" />
        <div className="pointer-events-none absolute -right-32 bottom-0 h-72 w-72 rounded-full bg-fuchsia-500/[0.07] blur-[100px]" />

        <div className="relative mx-auto max-w-7xl px-5 sm:px-8">
          {/* Main footer columns */}
          <div className="grid gap-12 py-14 sm:grid-cols-2 lg:grid-cols-5 lg:gap-8 lg:py-16">
            {/* Brand column */}
            <div className="sm:col-span-2 lg:col-span-2">
              <a
                href="/"
                className="inline-flex items-center gap-3"
                aria-label="UINexa home"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-300 shadow-[0_0_25px_rgba(34,211,238,0.12)]">
                  <Activity size={24} />
                </span>

                <span className="text-2xl font-bold tracking-tight text-white">
                  UI<span className="text-cyan-300">Nexa</span>
                </span>
              </a>

              <p className="mt-5 max-w-sm text-sm leading-7 text-slate-400">
                Your AI-powered workspace for generating modern interfaces,
                checking design consistency, and building better digital
                experiences.
              </p>

              <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/15 bg-cyan-300/[0.05] px-3.5 py-2">
                <span className="h-2 w-2 rounded-full bg-cyan-300 shadow-[0_0_10px_rgba(34,211,238,0.8)]" />
                <span className="text-xs font-medium text-cyan-200">
                  Design smarter with AI
                </span>
              </div>

              <div className="mt-7 flex flex-wrap gap-3">
                <a
                  href="/register"
                  className="inline-flex items-center gap-2 rounded-lg bg-cyan-300 px-4 py-2.5 text-sm font-bold text-slate-950 transition hover:-translate-y-0.5 hover:bg-cyan-200 hover:shadow-[0_0_22px_rgba(34,211,238,0.2)]"
                >
                  Get Started
                  <ArrowUpRight size={16} />
                </a>

                <a
                  href="/login"
                  className="inline-flex items-center gap-2 rounded-lg border border-white/15 px-4 py-2.5 text-sm font-semibold text-slate-200 transition hover:border-fuchsia-300/40 hover:text-fuchsia-200"
                >
                  Login
                  <ArrowRight size={15} />
                </a>
              </div>
            </div>

            {/* Product column */}
            <div>
              <h3 className="text-sm font-bold tracking-wide text-white">
                Product
              </h3>

              <div className="mt-5 flex flex-col items-start gap-4">
                <a
                  href="#features"
                  className="text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  AI UI Generator
                </a>
                <a
                  href="#features"
                  className="text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  UI Consistency Checker
                </a>
                <a
                  href="#features"
                  className="text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  Responsive Testing
                </a>
                <a
                  href="#features"
                  className="text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  Accessibility Analysis
                </a>
                <a
                  href="#features"
                  className="text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  Design Systems
                </a>
              </div>
            </div>

            {/* Explore column */}
            <div>
              <h3 className="text-sm font-bold tracking-wide text-white">
                Explore
              </h3>

              <div className="mt-5 flex flex-col items-start gap-4">
                <a
                  href="#about"
                  className="text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  About UINexa
                </a>
                <a
                  href="#how-it-works"
                  className="text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  How It Works
                </a>
                <a
                  href="#features"
                  className="text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  Features
                </a>
                <a
                  href="/dashboard"
                  className="text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  Workspace Preview
                </a>
              </div>
            </div>

            {/* Account column */}
            <div>
              <h3 className="text-sm font-bold tracking-wide text-white">
                Your Account
              </h3>

              <div className="mt-5 flex flex-col items-start gap-4">
                <a
                  href="/login"
                  className="text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  Login
                </a>
                <a
                  href="/register"
                  className="text-sm text-slate-400 transition hover:translate-x-1 hover:text-cyan-300"
                >
                  Create Account
                </a>
              </div>

              <div className="mt-7 rounded-xl border border-fuchsia-400/15 bg-fuchsia-400/[0.04] p-4">
                <Sparkles size={19} className="text-fuchsia-300" />
                <p className="mt-3 text-sm font-semibold text-slate-200">
                  Build with clarity.
                </p>
                <p className="mt-1 text-xs leading-5 text-slate-500">
                  Generate, inspect, and improve your UI workflow.
                </p>
              </div>
            </div>
          </div>

          {/* Divider */}
          <div className="h-px bg-gradient-to-r from-transparent via-cyan-300/20 to-transparent" />

          {/* Bottom footer bar */}
          <div className="flex flex-col gap-4 py-6 sm:flex-row sm:items-center sm:justify-between">
            <p className="text-xs leading-5 text-slate-500">
              © {new Date().getFullYear()} UINexa. All rights reserved.
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-3">
              <a
                href="#about"
                className="text-xs text-slate-500 transition hover:text-cyan-300"
              >
                About
              </a>
              <a
                href="/login"
                className="text-xs text-slate-500 transition hover:text-cyan-300"
              >
                Login
              </a>
              <a
                href="/register"
                className="text-xs text-slate-500 transition hover:text-cyan-300"
              >
                Sign Up
              </a>

              <span className="hidden h-4 w-px bg-white/10 sm:block" />

              <span className="inline-flex items-center gap-2 text-xs text-slate-500">
                Made for better interfaces
                <span className="text-fuchsia-300">✦</span>
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default LandingPage;
