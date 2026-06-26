import { Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

/**
 * Root `/` gate: signed-in users go to /dashboard, everyone else to /home.
 */
const RootRedirect = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  return <Navigate to={user ? "/dashboard" : "/home"} replace />;
};

export default RootRedirect;
