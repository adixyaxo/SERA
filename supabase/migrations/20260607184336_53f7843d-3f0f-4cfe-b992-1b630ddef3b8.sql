
REVOKE EXECUTE ON FUNCTION public.monk_carry_forward(uuid, date, date) FROM PUBLIC, anon;
GRANT EXECUTE ON FUNCTION public.monk_carry_forward(uuid, date, date) TO authenticated;
