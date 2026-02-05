-- Create enum types for user calibration data
CREATE TYPE methodology_type AS ENUM ('gtd', 'time_blocking', 'nuke_the_day', 'pomodoro', 'organic');
CREATE TYPE chronotype_type AS ENUM ('morning_lark', 'night_owl', 'third_bird');
CREATE TYPE proactivity_type AS ENUM ('co_pilot', 'chief_of_staff');
CREATE TYPE commute_type AS ENUM ('walking', 'driving', 'public_transit', 'remote');
CREATE TYPE communication_style AS ENUM ('concise', 'conversational');

-- Create user_calibration table for onboarding data
CREATE TABLE public.user_calibration (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  
  -- Methodology & Productivity DNA
  methodology methodology_type DEFAULT 'organic',
  open_loop_handling TEXT DEFAULT 'capture_later', -- 'capture_later' or 'prompt_immediately'
  buffer_minutes INTEGER DEFAULT 5,
  
  -- Biological & Energy Rhythm
  chronotype chronotype_type DEFAULT 'third_bird',
  energy_windows JSONB DEFAULT '{}', -- Maps hours 0-23 to energy levels
  deep_work_start INTEGER DEFAULT 9, -- Hour of day (0-23)
  deep_work_end INTEGER DEFAULT 12,
  slump_start INTEGER DEFAULT 14,
  slump_end INTEGER DEFAULT 16,
  wake_time TIME DEFAULT '07:00',
  wind_down_time TIME DEFAULT '22:00',
  
  -- Contextual Constraints
  commute commute_type DEFAULT 'remote',
  commute_duration_minutes INTEGER DEFAULT 0,
  voice_mode_on_transit BOOLEAN DEFAULT true,
  blackout_hours JSONB DEFAULT '[]', -- Array of {start, end, label} objects
  max_focus_hours INTEGER DEFAULT 6,
  
  -- Voice & Interaction Style
  proactivity proactivity_type DEFAULT 'co_pilot',
  communication_style communication_style DEFAULT 'conversational',
  urgency_threshold_minutes INTEGER DEFAULT 15,
  
  -- Integration & Memory
  primary_calendar TEXT DEFAULT 'google',
  notes_destination TEXT DEFAULT 'sera',
  priority_contacts JSONB DEFAULT '[]',
  
  -- Onboarding status
  onboarding_completed BOOLEAN DEFAULT false,
  onboarding_step INTEGER DEFAULT 0,
  scenario_response TEXT, -- Stores response to stress-test scenario
  
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  
  UNIQUE(user_id)
);

-- Enable RLS
ALTER TABLE public.user_calibration ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Users can view their own calibration"
ON public.user_calibration FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own calibration"
ON public.user_calibration FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own calibration"
ON public.user_calibration FOR UPDATE
USING (auth.uid() = user_id);

-- Create trigger for updated_at
CREATE TRIGGER update_user_calibration_updated_at
BEFORE UPDATE ON public.user_calibration
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();