import { useMe } from "../hooks/useAuth";

export default function Dashboard() {
  const { data: user } = useMe();
  return (
    <div>
      <h1 className="text-2xl font-semibold">Hi, {user?.name}</h1>
      <p className="mt-2 text-sm text-muted">Your generator and checker will appear here.</p>
    </div>
  );
}