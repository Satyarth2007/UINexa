import { useState, type FormEvent } from "react";
import { Link } from "react-router-dom";
import { Button } from "../components/ui/Button";
import { Input } from "../components/ui/Input";
import { PasswordInput } from "../components/ui/PasswordInput";
import { useLogin } from "../hooks/useAuth";
import { getErrorMessage } from "../utils/getErrorMessage";

export default function Login() {
  const login = useLogin();
  const [form, setForm] = useState({ email: "", password: "" });
  const [localError, setLocalError] = useState("");

  const onSubmit = (ev: FormEvent) => {
    ev.preventDefault();
    setLocalError("");
    if (!form.email.trim() || !form.password) {
      return setLocalError("Enter your email and password");
    }
    login.mutate({ email: form.email.trim(), password: form.password }); // GuestRoute redirects
  };

  const error = localError || (login.isError ? getErrorMessage(login.error) : "");

  return (
    <form onSubmit={onSubmit} className="space-y-5" noValidate>
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Welcome back</h1>
        <p className="mt-1.5 text-sm text-muted">Log in to continue to your workspace.</p>
      </div>

      <Input
        label="Email"
        type="email"
        autoComplete="email"
        value={form.email}
        onChange={(e) => setForm({ ...form, email: e.target.value })}
        placeholder="name@company.com"
      />
      <PasswordInput
        label="Password"
        autoComplete="current-password"
        value={form.password}
        onChange={(e) => setForm({ ...form, password: e.target.value })}
        placeholder="Your password"
      />

      {error && <p className="text-sm text-danger">{error}</p>}

      <Button type="submit" size="lg" loading={login.isPending} className="w-full">
        Log in
      </Button>

      <p className="text-center text-sm text-muted">
        New to UInexa?{" "}
        <Link to="/register" className="font-medium text-primary hover:underline">
          Create an account
        </Link>
      </p>
    </form>
  );
}