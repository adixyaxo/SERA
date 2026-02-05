import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { OnboardingLayout } from "./OnboardingLayout";
import { WelcomeStep } from "./steps/WelcomeStep";
import { EnergyMappingStep } from "./steps/EnergyMappingStep";
import { MethodologyStep } from "./steps/MethodologyStep";
import { ConstraintsStep } from "./steps/ConstraintsStep";
import { PersonaStep } from "./steps/PersonaStep";
import { ScenarioStep } from "./steps/ScenarioStep";
import { CompletionStep } from "./steps/CompletionStep";
import { useCalibration, UserCalibration } from "@/hooks/useCalibration";
import { useProfile } from "@/hooks/useProfile";
import { toast } from "sonner";

const TOTAL_STEPS = 7;

export function OnboardingFlow() {
  const navigate = useNavigate();
  const { calibration, loading, updateCalibration, completeOnboarding } = useCalibration();
  const { profile } = useProfile();
  const [currentStep, setCurrentStep] = useState(0);
  const [localData, setLocalData] = useState<Partial<UserCalibration>>({});

  useEffect(() => {
    if (calibration) {
      setLocalData(calibration);
      // Resume from saved step
      if (calibration.onboarding_step > 0 && calibration.onboarding_step < TOTAL_STEPS - 1) {
        setCurrentStep(calibration.onboarding_step);
      }
    }
  }, [calibration]);

  const handleNext = async (stepData?: Partial<UserCalibration>) => {
    const newData = { ...localData, ...stepData };
    setLocalData(newData);

    const nextStep = currentStep + 1;
    setCurrentStep(nextStep);

    // Save progress
    if (stepData) {
      await updateCalibration({
        ...stepData,
        onboarding_step: nextStep,
      });
    }
  };

  const handleBack = () => {
    setCurrentStep(Math.max(0, currentStep - 1));
  };

  const handleScenarioComplete = async (response: string) => {
    await updateCalibration({
      scenario_response: response,
      onboarding_step: TOTAL_STEPS - 1,
    });
    setCurrentStep(TOTAL_STEPS - 1);
  };

  const handleFinish = async () => {
    await completeOnboarding();
    toast.success("Welcome to SERA! Your personalized dashboard awaits.");
    navigate("/");
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <WelcomeStep
            onNext={() => handleNext()}
            userName={profile?.full_name || undefined}
          />
        );
      case 1:
        return (
          <EnergyMappingStep
            onNext={handleNext}
            onBack={handleBack}
            initialData={{
              chronotype: localData.chronotype,
              energy_windows: localData.energy_windows,
              deep_work_start: localData.deep_work_start,
              deep_work_end: localData.deep_work_end,
            }}
          />
        );
      case 2:
        return (
          <MethodologyStep
            onNext={handleNext}
            onBack={handleBack}
            initialData={{
              methodology: localData.methodology,
              open_loop_handling: localData.open_loop_handling,
              buffer_minutes: localData.buffer_minutes,
            }}
          />
        );
      case 3:
        return (
          <ConstraintsStep
            onNext={handleNext}
            onBack={handleBack}
            initialData={{
              commute: localData.commute,
              commute_duration_minutes: localData.commute_duration_minutes,
              voice_mode_on_transit: localData.voice_mode_on_transit,
              blackout_hours: localData.blackout_hours,
              max_focus_hours: localData.max_focus_hours,
            }}
          />
        );
      case 4:
        return (
          <PersonaStep
            onNext={handleNext}
            onBack={handleBack}
            initialData={{
              proactivity: localData.proactivity,
              communication_style: localData.communication_style,
              urgency_threshold_minutes: localData.urgency_threshold_minutes,
              primary_calendar: localData.primary_calendar,
              notes_destination: localData.notes_destination,
              priority_contacts: localData.priority_contacts,
            }}
          />
        );
      case 5:
        return (
          <ScenarioStep
            onComplete={handleScenarioComplete}
            onBack={handleBack}
          />
        );
      case 6:
        return (
          <CompletionStep
            calibration={localData}
            onFinish={handleFinish}
          />
        );
      default:
        return null;
    }
  };

  return (
    <OnboardingLayout step={currentStep} totalSteps={TOTAL_STEPS}>
      {renderStep()}
    </OnboardingLayout>
  );
}
