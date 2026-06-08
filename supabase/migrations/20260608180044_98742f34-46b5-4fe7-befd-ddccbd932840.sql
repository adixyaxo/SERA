
-- 1. Add missing UPDATE policy on habit_logs
CREATE POLICY "Users can update their own habit logs"
ON public.habit_logs
FOR UPDATE
USING (EXISTS (SELECT 1 FROM public.habits h WHERE h.id = habit_logs.habit_id AND h.user_id = auth.uid()))
WITH CHECK (EXISTS (SELECT 1 FROM public.habits h WHERE h.id = habit_logs.habit_id AND h.user_id = auth.uid()));

-- 2. Revoke EXECUTE on SECURITY DEFINER monk_carry_forward from public roles
REVOKE EXECUTE ON FUNCTION public.monk_carry_forward(uuid, date, date) FROM PUBLIC, anon, authenticated;
GRANT EXECUTE ON FUNCTION public.monk_carry_forward(uuid, date, date) TO service_role;

-- 3. Remove cards from realtime publication (prevents cross-user subscriptions)
ALTER PUBLICATION supabase_realtime DROP TABLE public.cards;
