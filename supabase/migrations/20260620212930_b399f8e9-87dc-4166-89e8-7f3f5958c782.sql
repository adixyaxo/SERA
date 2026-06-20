
ALTER TABLE public.habits
  ADD COLUMN IF NOT EXISTS target_per_week integer NOT NULL DEFAULT 7,
  ADD COLUMN IF NOT EXISTS reminder_time time,
  ADD COLUMN IF NOT EXISTS notes text,
  ADD COLUMN IF NOT EXISTS color text,
  ADD COLUMN IF NOT EXISTS icon text,
  ADD COLUMN IF NOT EXISTS cue text,
  ADD COLUMN IF NOT EXISTS reward text,
  ADD COLUMN IF NOT EXISTS difficulty text NOT NULL DEFAULT 'easy';
