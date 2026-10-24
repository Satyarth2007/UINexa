import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import { useLogout, useMe } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { ThemeToggle } from "./ThemeToggle";

export function Navbar({ showAnchors = false }: { showAnchors?: boolean }) {
  const { data: user } = useMe();
  const logout = useLogout();
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 z-40 border-b border-border bg-surface/80 backdrop-blur">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-8">
          <Link to="/" className="text-lg font-semibold tracking-tight">
            UI<span className="text-primary">nexa</span>
          </Link>
          {showAnchors && (
            <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
              <a href="#features" className="hover:text-foreground">Features</a>
              <a href="#how-it-works" className="hover:text-foreground">How it works</a>
              <a href="#checker" className="hover:text-foreground">Checker</a>
            </nav>
          )}
        </div>

        <div className="flex items-center gap-2">
          <ThemeToggle />
          {user ? (
            <>
              <Button variant="ghost" onClick={() => navigate("/dashboard")}>Dashboard</Button>
              <Button
                variant="outline"
                loading={logout.isPending}
                onClick={() => logout.mutate(undefined, { onSuccess: () => navigate("/login") })}
              >
                <LogOut size={16} /> Log out
              </Button>
            </>
          ) : (
            <>
              <Button variant="ghost" onClick={() => navigate("/login")}>Log in</Button>
              <Button onClick={() => navigate("/register")}>Sign up</Button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}