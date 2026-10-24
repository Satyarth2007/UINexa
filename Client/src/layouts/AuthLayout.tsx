import { ArrowLeft } from "lucide-react";
import { Link, Outlet } from "react-router-dom";
import { AuthShowcase } from "../components/auth/AuthShowcase";
import { ThemeToggle } from "../components/common/ThemeToggle";

export default function AuthLayout() {
  return (
    <div className="grid min-h-screen lg:grid-cols-2">
      <AuthShowcase />

      <div className="flex flex-col">
        <div className="flex items-center justify-between p-4">
          <Link
            to="/"
            className="inline-flex items-center gap-1.5 text-sm text-muted transition hover:text-foreground"
          >
            <ArrowLeft size={16} />
            <span className="lg:hidden text-lg font-semibold tracking-tight text-foreground">
              UI<span className="text-primary">nexa</span>
            </span>
            <span className="hidden lg:inline">Back to home</span>
          </Link>
          <ThemeToggle />
        </div>

        <div className="flex flex-1 items-center justify-center px-6 pb-12">
          <div className="w-full max-w-md">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
}