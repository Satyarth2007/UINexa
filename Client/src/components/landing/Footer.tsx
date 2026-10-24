import { ArrowUp } from "lucide-react";
import { Link } from "react-router-dom";
import { useMe } from "../../hooks/useAuth";

const product = [
  { label: "Features", href: "#features" },
  { label: "How it works", href: "#how-it-works" },
  { label: "Consistency checker", href: "#checker" },
];

const stack = [
  "React and TypeScript",
  "Tailwind CSS",
  "Node.js and Express",
  "MongoDB",
  "Hosted LLM API",
];

const linkClass = "text-sm text-muted transition hover:text-foreground";

export function Footer() {
  const { data: user } = useMe();

  return (
    <footer className="border-t border-border bg-surface">
      <div className="mx-auto max-w-6xl px-4 py-14">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link to="/" className="text-xl font-semibold tracking-tight">
              UI<span className="text-primary">nexa</span>
            </Link>
            <p className="mt-3 max-w-xs text-sm text-muted">
              Generate UI from a prompt, preview it live, and check it against your design rules
              before it ships.
            </p>
          </div>

          <div>
            <h3 className="text-sm font-medium">Product</h3>
            <ul className="mt-4 space-y-3">
              {product.map((item) => (
                <li key={item.href}>
                  <a href={item.href} className={linkClass}>
                    {item.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Account</h3>
            <ul className="mt-4 space-y-3">
              {user ? (
                <li>
                  <Link to="/dashboard" className={linkClass}>Dashboard</Link>
                </li>
              ) : (
                <>
                  <li>
                    <Link to="/login" className={linkClass}>Log in</Link>
                  </li>
                  <li>
                    <Link to="/register" className={linkClass}>Create account</Link>
                  </li>
                </>
              )}
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-medium">Built with</h3>
            <ul className="mt-4 space-y-3">
              {stack.map((item) => (
                <li key={item} className="text-sm text-muted">
                  {item}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border pt-6 sm:flex-row">
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} UInexa. All rights reserved.
          </p>
          <button
            type="button"
            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
            className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
          >
            Back to top <ArrowUp size={14} />
          </button>
        </div>
      </div>
    </footer>
  );
}