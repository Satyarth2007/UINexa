import { ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMe } from "../../hooks/useAuth";
import { Button } from "../ui/Button";

export function CTA() {
  const navigate = useNavigate();
  const { data: user } = useMe();

  return (
    <section className="border-t border-border py-20">
      <div className="mx-auto max-w-3xl px-4 text-center">
        <h2 className="text-3xl font-semibold tracking-tight">Ready to build a consistent UI?</h2>
        <p className="mt-3 text-muted">Create an account and generate your first screen in minutes.</p>
        <Button size="lg" className="mt-8" onClick={() => navigate(user ? "/dashboard" : "/register")}>
          {user ? "Go to dashboard" : "Create your account"} <ArrowRight size={18} />
        </Button>
      </div>
    </section>
  );
}