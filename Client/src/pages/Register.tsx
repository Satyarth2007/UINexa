import { useState, type ChangeEvent, type FormEvent } from "react";
import { Check } from "lucide-react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PasswordInput } from "../components/ui/PasswordInput";
import { PasswordStrength } from "../components/ui/PasswordStrength";
import { useRegister } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function Register() {
  const register = useRegister();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (key: keyof typeof form) => (e: ChangeEvent<HTMLInputElement>) => {
    setForm((f) => ({ ...f, [key]: e.target.value }));
    setErrors((prev) => ({ ...prev, [key]: "" }));
  };

  const passwordsMatch = form.confirmPassword.length > 0 && form.password === form.confirmPassword;

  const validate = () => {
    const e: Record<string, string> = {};
    if (form.name.trim().length < 2) e.name = "Name must be at least 2 characters";
    if (!/^\S+@\S+\.\S+$/.test(form.email.trim())) e.email = "Enter a valid email";
    if (form.password.length < 8) e.password = "Password must be at least 8 characters";
    if (!form.confirmPassword) e.confirmPassword = "Confirm your password";
    else if (form.password !== form.confirmPassword) e.confirmPassword = "Passwords don't match";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    if (!validate()) return;
    // GuestRoute redirects once the user is set
    register.mutate({
      name: form.name.trim(),
      email: form.email.trim(),
      password: form.password,
    });
  };

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Create your account</h1>
        <p className="mt-1.5 text-sm text-muted">Generate and check UI in one place.</p>
      </div>

      <Input
        label="Full name"
        autoComplete="name"
        value={form.name}
        onChange={set("name")}
        error={errors.name}
        placeholder="Your name"
      />
      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={set("email")}
        error={errors.email}
        placeholder="name@company.com"
      />

      <div className="space-y-2">
        <PasswordInput
          label="Password"
          autoComplete="new-password"
          value={form.password}
          onChange={set("password")}
          error={errors.password}
          placeholder="At least 8 characters"
        />
        <PasswordStrength password={form.password} />
      </div>

      <div className="space-y-1.5">
        <PasswordInput
          label="Confirm password"
          autoComplete="new-password"
          value={form.confirmPassword}
          onChange={set("confirmPassword")}
          error={errors.confirmPassword}
          placeholder="Re-enter your password"
        />
        {passwordsMatch && (
          <p className="flex items-center gap-1 text-xs text-success">
            <Check size={12} /> Passwords match
          </p>
        )}
      </div>

      {register.isError && <p className="text-sm text-danger">{getErrorMessage(register.error)}</p>}

      <Button type="submit" size="lg" loading={register.isPending} className="w-full">
        Create account
      </Button>

      <p className="text-center text-sm text-muted">
        Already have an account?{" "}
        <Link to="/login" className="font-medium text-primary hover:underline">
          Log in
        </Link>
      </p>
    </form>
  );
}