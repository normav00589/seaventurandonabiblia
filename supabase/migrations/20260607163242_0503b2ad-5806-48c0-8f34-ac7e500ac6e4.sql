
DROP POLICY IF EXISTS "anon can insert sessions" ON public.funnel_sessions;
DROP POLICY IF EXISTS "anon can update own session by key" ON public.funnel_sessions;
DROP POLICY IF EXISTS "anon can insert events" ON public.funnel_events;

REVOKE INSERT, UPDATE, SELECT ON public.funnel_sessions FROM anon, authenticated;
REVOKE INSERT ON public.funnel_events FROM anon, authenticated;
REVOKE USAGE, SELECT ON SEQUENCE public.funnel_events_id_seq FROM anon, authenticated;
