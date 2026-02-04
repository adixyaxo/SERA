-- Create habits table
CREATE TABLE public.habits (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  name TEXT NOT NULL,
  frequency TEXT NOT NULL DEFAULT 'daily',
  archived BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create habit_logs table for tracking completions
CREATE TABLE public.habit_logs (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  habit_id UUID NOT NULL REFERENCES public.habits(id) ON DELETE CASCADE,
  completed_date DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(habit_id, completed_date)
);

-- Enable RLS on habits
ALTER TABLE public.habits ENABLE ROW LEVEL SECURITY;

-- Enable RLS on habit_logs
ALTER TABLE public.habit_logs ENABLE ROW LEVEL SECURITY;

-- RLS policies for habits
CREATE POLICY "Users can view their own habits"
ON public.habits FOR SELECT
USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own habits"
ON public.habits FOR INSERT
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own habits"
ON public.habits FOR UPDATE
USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own habits"
ON public.habits FOR DELETE
USING (auth.uid() = user_id);

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

-- Add trigger for updated_at on habits
CREATE TRIGGER update_habits_updated_at
BEFORE UPDATE ON public.habits
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();