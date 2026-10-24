import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMe } from "../../hooks/useAuth";

// Logged-in users never see login/register. This is also where post-login
// redirects happen, so the pages themselves don't need to navigate.
export function GuestRoute() {
  const { data: user, isPending } = useMe();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from ?? "/dashboard";

  if (isPending) return <div className="p-10 text-sm text-muted">Loading…</div>;
  return user ? <Navigate to={from} replace /> : <Outlet />;
}