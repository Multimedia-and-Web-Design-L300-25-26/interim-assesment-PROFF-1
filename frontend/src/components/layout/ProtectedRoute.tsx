/*
 * Route guard that redirects unauthenticated users to the sign-in page.
 * It waits for auth hydration before deciding whether to render children.
 */
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return null;
  }

  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return children;
}

export default ProtectedRoute;