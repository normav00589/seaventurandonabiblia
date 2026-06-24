-- Restrict funnel tracking tables: only service_role (used by edge/server code) can access.
-- Deny anon and authenticated by adding no permissive policies and revoking direct grants.

REVOKE ALL ON public.funnel_sessions FROM anon, authenticated;
REVOKE ALL ON public.funnel_events FROM anon, authenticated;

GRANT ALL ON public.funnel_sessions TO service_role;
GRANT ALL ON public.funnel_events TO service_role;

-- Explicit deny policies for clarity (RLS is already enabled; absence of policies = deny)
CREATE POLICY "Deny all client access to funnel_sessions"
ON public.funnel_sessions
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);

CREATE POLICY "Deny all client access to funnel_events"
ON public.funnel_events
AS RESTRICTIVE
FOR ALL
TO anon, authenticated
USING (false)
WITH CHECK (false);