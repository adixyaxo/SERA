# Performance, Security, and Scalability

## Performance
- **Read Performance**: The heavy reliance on Supabase means standard queries are highly optimized. However, the identified missing indexes on `user_id` across several tables will degrade read performance over time as the database scales.
- **Write Performance**: The `JSONB` columns offer fast, schema-less writes for dynamic metadata without the overhead of complex relational inserts. 

## Scalability
- The architecture is highly scalable. Delegating authentication and relational storage to Supabase prevents local bottlenecks. 
- The use of Edge Functions allows backend processing to scale serverlessly.
- Real-time capabilities were enabled on `cards` via `supabase_realtime`, though later dropped to prevent cross-user subscription leaks, showing active tuning of scalability vs security.

## Security
- **Row Level Security (RLS)**: Excellent security posture. Every single table in the schema has RLS enabled, explicitly checking `auth.uid() = user_id`. This prevents cross-tenant data leaks.
- **Function Security**: 
  - A vulnerability in the function search path was identified and patched (`SECURITY DEFINER SET search_path = public`). 
  - The `monk_carry_forward` function was wisely downgraded from `SECURITY DEFINER` to `SECURITY INVOKER` to prevent privilege escalation attacks.
- **Data Consistency**: Strict `ON DELETE CASCADE` rules combined with `CHECK` constraints guarantee database integrity even if frontend validations fail.

## Data Consistency
Data consistency is strongly enforced at the database level:
- Automated `updated_at` triggers ensure cache invalidation works reliably.
- Strict ENUMs/CHECKs prevent invalid states from being saved to the database.
