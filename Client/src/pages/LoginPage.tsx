
import { useState, type FormEvent } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Activity, Eye, EyeOff, LoaderCircle, LockKeyhole } from "lucide-react";
import api from "../lib/api";
import AuthLayout from "../layouts/AuthLayout";


function LoginPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setLoading(true);

    try {
      await api.post("/auth/login", { email, password });
      navigate("/dashboard", { replace: true });
    } catch (err: unknown) {
      if (typeof err === "object" && err !== null && "response" in err) {
        const response = (err as {
          response?: { data?: { message?: string } };
        }).response;

        setError(response?.data?.message || "Unable to log in. Please try again.");
      } else {
        setError("Cannot connect to the server. Please try again.");
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <AuthLayout>
        <main className="flex min-h-screen items-center justify-center bg-[#080812] px-5 py-10 text-slate-100">
      <div className="w-full max-w-md">
        <Link to="/" className="mb-8 flex items-center justify-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl border border-cyan-300/30 bg-cyan-300/10 text-cyan-300">
            <Activity size={24} />
          </span>
          <span className="text-2xl font-bold">
            UI<span className="text-cyan-300">Nexa</span>
          </span>
        </Link>

        <section className="rounded-2xl border border-white/10 bg-[#10101d] p-6 shadow-2xl shadow-cyan-950/20 sm:p-8">
          <p className="text-xs font-bold tracking-[0.2em] text-cyan-300">
            YOUR WORKSPACE AWAITS
          </p>
          <h1 className="mt-3 text-3xl font-bold">Welcome back</h1>
          <p className="mt-2 text-sm leading-6 text-slate-400">
            Log in to continue creating and improving your interfaces.
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5">
            <div>
              <label htmlFor="email" className="mb-2 block text-sm font-medium">
                Email address
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                required
                maxLength={254}
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-lg border border-white/10 bg-[#090914] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
              />
            </div>

            <div>
              <label htmlFor="password" className="mb-2 block text-sm font-medium">
                Password
              </label>
              <div className="relative">
                <LockKeyhole
                  size={17}
                  className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  required
                  maxLength={72}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-lg border border-white/10 bg-[#090914] py-3 pl-10 pr-12 text-sm outline-none transition placeholder:text-slate-600 focus:border-cyan-300"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-cyan-300"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {error && (
              <p role="alert" className="rounded-lg border border-rose-400/20 bg-rose-400/10 p-3 text-sm text-rose-300">
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-cyan-300 px-4 py-3.5 font-bold text-slate-950 transition hover:bg-cyan-200 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading && <LoaderCircle size={18} className="animate-spin" />}
              {loading ? "Logging in..." : "Login to UINexa"}
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-400">
            Don't have an account?{" "}
            <Link to="/register" className="font-semibold text-cyan-300 hover:text-cyan-200">
              Sign up
            </Link>
          </p>

          <Link to="/" className="mt-5 block text-center text-xs text-slate-500 hover:text-slate-300">
            ← Back to home
          </Link>
        </section>
      </div>
    </main>
    </AuthLayout>
  );
}

export default LoginPage;
