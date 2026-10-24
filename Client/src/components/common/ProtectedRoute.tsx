import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useMe } from "../../hooks/useAuth";

export function ProtectedRoute() {
  const { data: user, isPending } = useMe();
  const location = useLocation();

  if (isPending) return <div className="p-10 text-sm text-muted">Loading…</div>;
  return user ? (
    <Outlet />
  ) : (
    <Navigate to="/login" replace state={{ from: location.pathname }} />
  );
}