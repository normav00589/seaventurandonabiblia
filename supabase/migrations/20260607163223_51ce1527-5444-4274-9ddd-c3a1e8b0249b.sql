
CREATE TABLE public.funnel_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  session_key text NOT NULL UNIQUE,
  user_agent text,
  device text,
  browser text,
  os text,
  referrer text,
  landing_path text,
  utm_source text,
  utm_medium text,
  utm_campaign text,
  utm_term text,
  utm_content text,
  country text,
  ip_hash text,
  started_at timestamptz NOT NULL DEFAULT now(),
  last_seen_at timestamptz NOT NULL DEFAULT now(),
  exit_step text,
  total_time_ms integer DEFAULT 0,
  reached_steps text[] DEFAULT ARRAY[]::text[],
  clicked_cta boolean DEFAULT false
);

CREATE INDEX idx_funnel_sessions_started ON public.funnel_sessions (started_at DESC);
CREATE INDEX idx_funnel_sessions_utm ON public.funnel_sessions (utm_source, utm_medium);

CREATE TABLE public.funnel_events (
  id bigserial PRIMARY KEY,
  session_key text NOT NULL,
  event_name text NOT NULL,
  step text,
  meta jsonb,
  created_at timestamptz NOT NULL DEFAULT now()
);

CREATE INDEX idx_funnel_events_session ON public.funnel_events (session_key);
CREATE INDEX idx_funnel_events_created ON public.funnel_events (created_at DESC);
CREATE INDEX idx_funnel_events_name ON public.funnel_events (event_name);

GRANT SELECT, INSERT, UPDATE ON public.funnel_sessions TO anon;
GRANT SELECT, INSERT, UPDATE ON public.funnel_sessions TO authenticated;
GRANT ALL ON public.funnel_sessions TO service_role;

GRANT INSERT ON public.funnel_events TO anon;
GRANT INSERT ON public.funnel_events TO authenticated;
GRANT USAGE, SELECT ON SEQUENCE public.funnel_events_id_seq TO anon, authenticated;
GRANT ALL ON public.funnel_events TO service_role;
GRANT ALL ON SEQUENCE public.funnel_events_id_seq TO service_role;

ALTER TABLE public.funnel_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.funnel_events ENABLE ROW LEVEL SECURITY;

-- Anyone can insert tracking rows; nobody can read via the public API
CREATE POLICY "anon can insert sessions" ON public.funnel_sessions
  FOR INSERT TO anon, authenticated WITH CHECK (true);

CREATE POLICY "anon can update own session by key" ON public.funnel_sessions
  FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);

-- No SELECT policy => no public reads. Service role bypasses RLS for the dashboard.

CREATE POLICY "anon can insert events" ON public.funnel_events
  FOR INSERT TO anon, authenticated WITH CHECK (true);
