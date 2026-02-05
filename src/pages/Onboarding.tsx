import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCalibration } from "@/hooks/useCalibration";
import { OnboardingFlow } from "@/components/onboarding/OnboardingFlow";

const Onboarding = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { calibration, loading } = useCalibration();

  useEffect(() => {
    if (!user) {
      navigate("/auth");
    }
  }, [user, navigate]);

  useEffect(() => {
    // If onboarding is already complete, redirect to dashboard
    if (!loading && calibration?.onboarding_completed) {
      navigate("/");
    }
  }, [calibration, loading, navigate]);

  if (!user || loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  return <OnboardingFlow />;
};

export default Onboarding;
