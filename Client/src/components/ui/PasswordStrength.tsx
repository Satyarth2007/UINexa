const labels = ["", "Weak", "Fair", "Good", "Strong"];
const colors = ["bg-border", "bg-danger", "bg-warning", "bg-primary", "bg-success"];

export function getPasswordScore(password: string) {
  return [
    password.length >= 8,
    /[a-z]/.test(password) && /[A-Z]/.test(password),
    /\d/.test(password),
    /[^A-Za-z0-9]/.test(password),
  ].filter(Boolean).length;
}

export function PasswordStrength({ password }: { password: string }) {
  if (!password) return null;
  const score = getPasswordScore(password);

  return (
    <div className="space-y-1.5" aria-live="polite">
      <div className="flex gap-1.5">
        {[0, 1, 2, 3].map((i) => (
          <span
            key={i}
            className={`h-1 flex-1 rounded-full transition-colors ${i < score ? colors[score] : "bg-border"}`}
          />
        ))}
      </div>
      <p className="text-xs text-muted">
        Strength: <span className="text-foreground">{labels[score]}</span>
        {score < 4 && " · use upper and lower case, a number and a symbol"}
      </p>
    </div>
  );
}