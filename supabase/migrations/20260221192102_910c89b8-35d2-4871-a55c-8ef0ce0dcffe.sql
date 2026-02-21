
-- Create timetable_entries table for weekly recurring schedule
CREATE TABLE public.timetable_entries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL,
  title TEXT NOT NULL,
  description TEXT,
  day_of_week INTEGER NOT NULL CHECK (day_of_week >= 0 AND day_of_week <= 6), -- 0=Sunday, 6=Saturday
  start_time TIME NOT NULL,
  end_time TIME NOT NULL,
  color TEXT DEFAULT '#7E9EF9',
  repeat_type TEXT DEFAULT 'weekly', -- 'weekly', 'biweekly', 'none'
  location TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.timetable_entries ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view their own timetable entries"
  ON public.timetable_entries FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own timetable entries"
  ON public.timetable_entries FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own timetable entries"
  ON public.timetable_entries FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own timetable entries"
  ON public.timetable_entries FOR DELETE
  USING (auth.uid() = user_id);

-- Trigger for updated_at
CREATE TRIGGER update_timetable_entries_updated_at
  BEFORE UPDATE ON public.timetable_entries
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();
