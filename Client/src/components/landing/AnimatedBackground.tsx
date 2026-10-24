export function AnimatedBackground() {
  return (
    <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
      <div
        className="animate-grid-pan absolute inset-0 opacity-60"
        style={{
          backgroundImage:
            "linear-gradient(to right, var(--border) 1px, transparent 1px), linear-gradient(to bottom, var(--border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
          WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent)",
        }}
      />

      <div
        className="bg-blob animate-drift-a -left-24 -top-24 size-[28rem]"
        style={{ background: "color-mix(in oklab, var(--primary) 35%, transparent)" }}
      />
      <div
        className="bg-blob animate-drift-b -right-20 top-10 size-[24rem]"
        style={{ background: "color-mix(in oklab, #6366f1 28%, transparent)" }}
      />
      <div
        className="bg-blob animate-drift-c left-1/3 top-1/2 size-[22rem]"
        style={{ background: "color-mix(in oklab, #38bdf8 22%, transparent)" }}
      />
    </div>
  );
}