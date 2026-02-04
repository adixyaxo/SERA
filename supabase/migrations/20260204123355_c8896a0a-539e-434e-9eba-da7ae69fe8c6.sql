-- Add missing columns to habits table
ALTER TABLE public.habits 
ADD COLUMN IF NOT EXISTS category TEXT DEFAULT 'General',
ADD COLUMN IF NOT EXISTS start_date DATE DEFAULT CURRENT_DATE;

-- Drop the existing habit_logs table and recreate with correct schema
DROP TABLE IF EXISTS public.habit_logs CASCADE;

CREATE TABLE public.habit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  date_string TEXT NOT NULL,
  completed BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(habit_id, date_string)
);

-- Enable RLS on habit_logs
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for habit_logs (through habit ownership)
CREATE POLICY "Users can view their own habit logs"
ON public.habit_logs FOR SELECT
USING (EXISTS (
  SELECT 1 FROM public.habits
  WHERE habits.id = habit_logs.habit_id
  AND habits.user_id = auth.uid()
));

CREATE POLICY "Users can create their own habit logs"
ON public.habit_logs FOR INSERT
WITH CHECK (EXISTS (
  SELECT 1 FROM public.habits
  WHERE habits.id = habit_logs.habit_id
  AND habits.user_id = auth.uid()
));

CREATE POLICY "Users can delete their own habit logs"
ON public.habit_logs FOR DELETE
USING (EXISTS (
  SELECT 1 FROM public.habits
  WHERE habits.id = habit_logs.habit_id
  AND habits.user_id = auth.uid()
));