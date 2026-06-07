
-- monk_tasks
CREATE TABLE public.monk_tasks (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_date date NOT NULL,
  title text NOT NULL,
  notes text,
  estimate_minutes int DEFAULT 30,
  priority text NOT NULL DEFAULT 'med',
  order_index int NOT NULL DEFAULT 0,
  completed_at timestamptz,
  postpone_count int NOT NULL DEFAULT 0,
  origin_date date NOT NULL DEFAULT CURRENT_DATE,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.monk_tasks TO authenticated;
GRANT ALL ON public.monk_tasks TO service_role;
ALTER TABLE public.monk_tasks ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own monk_tasks select" ON public.monk_tasks FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own monk_tasks insert" ON public.monk_tasks FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own monk_tasks update" ON public.monk_tasks FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own monk_tasks delete" ON public.monk_tasks FOR DELETE USING (auth.uid() = user_id);
CREATE INDEX idx_monk_tasks_user_date ON public.monk_tasks(user_id, plan_date);
CREATE TRIGGER trg_monk_tasks_updated BEFORE UPDATE ON public.monk_tasks FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- monk_daily_plans
CREATE TABLE public.monk_daily_plans (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  plan_date date NOT NULL,
  frog_task_id uuid REFERENCES public.monk_tasks(id) ON DELETE SET NULL,
  intention text,
  energy_forecast int,
  planned_at timestamptz NOT NULL DEFAULT now(),
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, plan_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.monk_daily_plans TO authenticated;
GRANT ALL ON public.monk_daily_plans TO service_role;
ALTER TABLE public.monk_daily_plans ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own plans select" ON public.monk_daily_plans FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own plans insert" ON public.monk_daily_plans FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own plans update" ON public.monk_daily_plans FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own plans delete" ON public.monk_daily_plans FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_monk_plans_updated BEFORE UPDATE ON public.monk_daily_plans FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- monk_journal_entries
CREATE TABLE public.monk_journal_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  entry_date date NOT NULL,
  went_well text,
  time_wasted text,
  improve_tomorrow text,
  energy int,
  clarity int,
  mood text,
  free_form text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, entry_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.monk_journal_entries TO authenticated;
GRANT ALL ON public.monk_journal_entries TO service_role;
ALTER TABLE public.monk_journal_entries ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own journal select" ON public.monk_journal_entries FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own journal insert" ON public.monk_journal_entries FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own journal update" ON public.monk_journal_entries FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own journal delete" ON public.monk_journal_entries FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_monk_journal_updated BEFORE UPDATE ON public.monk_journal_entries FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- monk_schedule_checkins
CREATE TABLE public.monk_schedule_checkins (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  timetable_entry_id uuid NOT NULL,
  check_date date NOT NULL,
  status text NOT NULL DEFAULT 'followed',
  note text,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  UNIQUE (user_id, timetable_entry_id, check_date)
);
GRANT SELECT, INSERT, UPDATE, DELETE ON public.monk_schedule_checkins TO authenticated;
GRANT ALL ON public.monk_schedule_checkins TO service_role;
ALTER TABLE public.monk_schedule_checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "own checkins select" ON public.monk_schedule_checkins FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "own checkins insert" ON public.monk_schedule_checkins FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "own checkins update" ON public.monk_schedule_checkins FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "own checkins delete" ON public.monk_schedule_checkins FOR DELETE USING (auth.uid() = user_id);
CREATE TRIGGER trg_monk_checkins_updated BEFORE UPDATE ON public.monk_schedule_checkins FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Carry forward function
CREATE OR REPLACE FUNCTION public.monk_carry_forward(_user_id uuid, _from_date date, _to_date date)
RETURNS int
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
DECLARE moved int;
BEGIN
  WITH updated AS (
    UPDATE public.monk_tasks
       SET plan_date = _to_date,
           postpone_count = postpone_count + 1,
           updated_at = now()
     WHERE user_id = _user_id
       AND plan_date = _from_date
       AND completed_at IS NULL
    RETURNING 1
  )
  SELECT count(*) INTO moved FROM updated;
  RETURN moved;
END;
$$;
