
CREATE OR REPLACE FUNCTION public.monk_carry_forward(_user_id uuid, _from_date date, _to_date date)
RETURNS integer
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path TO 'public'
AS $function$
DECLARE moved int;
BEGIN
  IF _user_id <> auth.uid() THEN
    RAISE EXCEPTION 'forbidden';
  END IF;
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
$function$;

GRANT EXECUTE ON FUNCTION public.monk_carry_forward(uuid, date, date) TO authenticated;
