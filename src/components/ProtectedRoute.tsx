import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useCalibration } from '@/hooks/useCalibration';

export const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { user, loading } = useAuth();
  const { calibration, loading: calibrationLoading } = useCalibration();
  const location = useLocation();

  if (loading || (user && calibrationLoading)) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-pulse text-foreground">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/auth" replace state={{ from: location.pathname }} />;
  }

  // Gate every protected page behind onboarding completion, except /onboarding itself.
  const isOnboardingRoute = location.pathname.startsWith('/onboarding');
  if (calibration && !calibration.onboarding_completed && !isOnboardingRoute) {
    return <Navigate to="/onboarding" replace />;
  }

  return <>{children}</>;
};
