
import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  ArrowUpRight,
  Layers3,
  Sparkles,
  WandSparkles,
  ScanEye,
  Activity,
} from "lucide-react";

type AuthLayoutProps = {
  children: ReactNode;
};

function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <main className="min-h-screen bg-[#080812] text-white lg:grid lg:grid-cols-2">
      {/* Left animated panel */}
      <section className="relative hidden min-h-screen overflow-hidden border-r border-cyan-400/10 bg-[#0b1020] p-12 lg:flex lg:flex-col lg:justify-between xl:p-16">
        {/* Background effects */}
        <div className="auth-grid absolute inset-0 opacity-30" />

        <div className="auth-orb auth-orb-one" />
        <div className="auth-orb auth-orb-two" />

        {/* Brand */}
        <Link to="/" className="relative z-10 flex items-center gap-3">
          <div className="rounded-xl border border-cyan-300/30 bg-cyan-400/10 p-2.5 text-cyan-300">
            <Layers3 size={25} />
          </div>

          <span className="text-2xl font-bold tracking-wide">
            UI<span className="text-cyan-300">Nexa</span>
          </span>
        </Link>

        {/* Main content */}
        <div className="relative z-10 my-12 max-w-xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/20 bg-cyan-300/5 px-4 py-2 text-sm text-cyan-200">
            <Sparkles size={15} />
            Your AI-powered design workspace
          </div>

          <h1 className="text-5xl font-bold leading-tight xl:text-6xl">
            Design smarter.
            <br />
            <span className="auth-gradient-text">
              Build better.
            </span>
          </h1>

          <p className="mt-6 max-w-md text-base leading-7 text-slate-400">
            Generate beautiful interfaces, detect UI inconsistencies,
            and build experiences that look perfect on every screen.
          </p>

          {/* Floating dashboard card */}
          <div className="auth-float mt-10 max-w-md rounded-2xl border border-cyan-300/20 bg-[#101629]/90 p-5 shadow-2xl shadow-cyan-950/40 backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-cyan-400/10 p-2 text-cyan-300">
                  <ScanEye size={22} />
                </div>
                <div>
                  <p className="font-medium">UI Analysis</p>
                  <p className="text-xs text-slate-500">
                    Design consistency report
                  </p>
                </div>
              </div>

              <span className="rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs text-emerald-300">
                Analyzed
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-white/[0.03] p-4">
                <Activity className="mb-3 text-cyan-300" size={20} />
                <p className="text-2xl font-semibold">98%</p>
                <p className="mt-1 text-xs text-slate-500">
                  Visual consistency
                </p>
              </div>

              <div className="rounded-xl bg-white/[0.03] p-4">
                <WandSparkles className="mb-3 text-fuchsia-300" size={20} />
                <p className="text-2xl font-semibold">AI</p>
                <p className="mt-1 text-xs text-slate-500">
                  Smart suggestions
                </p>
              </div>
            </div>

            <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-slate-800">
              <div className="auth-progress h-full w-[98%] rounded-full bg-gradient-to-r from-cyan-400 to-fuchsia-400" />
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center justify-between text-sm text-slate-500">
          <span>© 2026 UINexa</span>
          <span className="flex items-center gap-2">
            Built for better interfaces
            <ArrowUpRight size={15} />
          </span>
        </div>
      </section>

      {/* Right form panel */}
      <section className="relative flex min-h-screen items-center justify-center overflow-hidden px-5 py-10 sm:px-10 lg:px-12">
        {/* Mobile-only brand */}
        <Link
          to="/"
          className="absolute left-6 top-6 flex items-center gap-2 lg:hidden"
        >
          <Layers3 className="text-cyan-300" size={25} />
          <span className="text-xl font-bold">
            UI<span className="text-cyan-300">Nexa</span>
          </span>
        </Link>

        <div className="relative z-10 w-full max-w-md pt-10 lg:pt-0">
          {children}
        </div>
      </section>
    </main>
  );
}

export default AuthLayout;
