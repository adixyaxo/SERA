import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "sonner";

export type Methodology = 'gtd' | 'time_blocking' | 'nuke_the_day' | 'pomodoro' | 'organic';
export type Chronotype = 'morning_lark' | 'night_owl' | 'third_bird';
export type Proactivity = 'co_pilot' | 'chief_of_staff';
export type CommuteType = 'walking' | 'driving' | 'public_transit' | 'remote';
export type CommunicationStyle = 'concise' | 'conversational';

export interface EnergyWindow {
  [hour: number]: 'high' | 'medium' | 'low';
}

export interface BlackoutHour {
  start: number;
  end: number;
  label: string;
}

export interface UserCalibration {
  id: string;
  user_id: string;
  methodology: Methodology;
  open_loop_handling: string;
  buffer_minutes: number;
  chronotype: Chronotype;
  energy_windows: EnergyWindow;
  deep_work_start: number;
  deep_work_end: number;
  slump_start: number;
  slump_end: number;
  wake_time: string;
  wind_down_time: string;
  commute: CommuteType;
  commute_duration_minutes: number;
  voice_mode_on_transit: boolean;
  blackout_hours: BlackoutHour[];
  max_focus_hours: number;
  proactivity: Proactivity;
  communication_style: CommunicationStyle;
  urgency_threshold_minutes: number;
  primary_calendar: string;
  notes_destination: string;
  priority_contacts: string[];
  onboarding_completed: boolean;
  onboarding_step: number;
  scenario_response: string | null;
  created_at: string;
  updated_at: string;
}

const defaultCalibration: Partial<UserCalibration> = {
  methodology: 'organic',
  open_loop_handling: 'capture_later',
  buffer_minutes: 5,
  chronotype: 'third_bird',
  energy_windows: {},
  deep_work_start: 9,
  deep_work_end: 12,
  slump_start: 14,
  slump_end: 16,
  wake_time: '07:00',
  wind_down_time: '22:00',
  commute: 'remote',
  commute_duration_minutes: 0,
  voice_mode_on_transit: true,
  blackout_hours: [],
  max_focus_hours: 6,
  proactivity: 'co_pilot',
  communication_style: 'conversational',
  urgency_threshold_minutes: 15,
  primary_calendar: 'google',
  notes_destination: 'sera',
  priority_contacts: [],
  onboarding_completed: false,
  onboarding_step: 0,
  scenario_response: null,
};

export const useCalibration = () => {
  const { user } = useAuth();
  const [calibration, setCalibration] = useState<UserCalibration | null>(null);
  const [loading, setLoading] = useState(true);

  const parseCalibrationData = (data: any): UserCalibration => ({
    ...data,
    energy_windows: data.energy_windows || {},
    blackout_hours: Array.isArray(data.blackout_hours) ? data.blackout_hours : [],
    priority_contacts: Array.isArray(data.priority_contacts) ? data.priority_contacts : [],
  });

  const fetchCalibration = useCallback(async () => {
    if (!user) {
      setLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("user_calibration")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        if (error.code === "PGRST116") {
          // No calibration exists, create one
          const { data: newCalibration, error: insertError } = await supabase
            .from("user_calibration")
            .insert({
              user_id: user.id,
            })
            .select()
            .single();

          if (insertError) {
            console.error("Error creating calibration:", insertError);
          } else if (newCalibration) {
            setCalibration(parseCalibrationData(newCalibration));
          }
        } else {
          console.error("Error fetching calibration:", error);
        }
      } else {
        setCalibration(parseCalibrationData(data));
      }
    } catch (err) {
      console.error("Unexpected error:", err);
    } finally {
      setLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchCalibration();
  }, [fetchCalibration]);

  const updateCalibration = async (updates: Partial<UserCalibration>) => {
    if (!user) return { error: new Error("No user") };

    // Transform complex types to JSON for Supabase
    const dbUpdates: Record<string, any> = { ...updates };
    if (updates.blackout_hours) {
      dbUpdates.blackout_hours = JSON.parse(JSON.stringify(updates.blackout_hours));
    }
    if (updates.energy_windows) {
      dbUpdates.energy_windows = JSON.parse(JSON.stringify(updates.energy_windows));
    }
    if (updates.priority_contacts) {
      dbUpdates.priority_contacts = JSON.parse(JSON.stringify(updates.priority_contacts));
    }

    const { data, error } = await supabase
      .from("user_calibration")
      .update(dbUpdates)
      .eq("user_id", user.id)
      .select()
      .single();

    if (error) {
      toast.error("Failed to save calibration");
      return { error };
    }

    setCalibration(parseCalibrationData(data));
    return { data };
  };

  const completeOnboarding = async () => {
    return updateCalibration({ onboarding_completed: true });
  };

  const setOnboardingStep = async (step: number) => {
    return updateCalibration({ onboarding_step: step });
  };

  return {
    calibration,
    loading,
    updateCalibration,
    completeOnboarding,
    setOnboardingStep,
    refetch: fetchCalibration,
  };
};
