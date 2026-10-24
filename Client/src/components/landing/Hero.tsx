import { ArrowRight, Sparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useMe } from "../../hooks/useAuth";
import { Button } from "../ui/Button";
import { ProductPreview } from "./ProductPreview";
import { AnimatedBackground } from "./AnimatedBackground";


export function Hero() {
  const navigate = useNavigate();
  const { data: user } = useMe();

  return (
    <section className="relative overflow-hidden">
      <AnimatedBackground />
      <div className="relative mx-auto max-w-6xl px-4 pb-16 pt-20 text-center sm:pt-28">
        <span className="inline-flex items-center gap-2 rounded-full border border-border bg-surface px-3 py-1 text-xs text-muted">
          <Sparkles size={14} className="text-primary" />
          AI UI generator and consistency checker
        </span>

        <h1 className="mx-auto mt-6 max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
          Generate UI. <span className="text-primary">Keep it consistent.</span>
        </h1>

        <p className="mx-auto mt-5 max-w-2xl text-base text-muted sm:text-lg">
          Describe an interface and get working code with a live preview. Then check any UI
          against your design rules for contrast, spacing, typography and token drift.
        </p>

        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button size="lg" onClick={() => navigate(user ? "/dashboard" : "/register")}>
            {user ? "Go to dashboard" : "Get started free"} <ArrowRight size={18} />
          </Button>
          <Button
            size="lg"
            variant="outline"
            onClick={() =>
              document.getElementById("how-it-works")?.scrollIntoView({ behavior: "smooth" })
            }
          >
            See how it works
          </Button>
        </div>

        <div className="mt-16">
          <ProductPreview />
        </div>
      </div>
    </section>
  );
}