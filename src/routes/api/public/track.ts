import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const EventSchema = z.object({
  event_name: z.enum(["page_view", "section_view", "cta_click", "exit"]),
  step: z.string().max(60).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
  t: z.number().int().nonnegative(),
});

const SessionMetaSchema = z.object({
  user_agent: z.string().max(500).optional().nullable(),
  device: z.string().max(20).optional().nullable(),
  browser: z.string().max(30).optional().nullable(),
  os: z.string().max(30).optional().nullable(),
  referrer: z.string().max(500).optional().nullable(),
  landing_path: z.string().max(500).optional().nullable(),
  utm_source: z.string().max(120).optional().nullable(),
  utm_medium: z.string().max(120).optional().nullable(),
  utm_campaign: z.string().max(120).optional().nullable(),
  utm_term: z.string().max(120).optional().nullable(),
  utm_content: z.string().max(120).optional().nullable(),
});

const BodySchema = z.object({
  session_key: z.string().min(8).max(64),
  new_session: z.boolean().optional(),
  session: SessionMetaSchema.optional(),
  events: z.array(EventSchema).max(50).optional(),
  update: z
    .object({
      last_seen_at: z.string().optional(),
      total_time_ms: z.number().int().nonnegative().optional(),
      reached_steps: z.array(z.string().max(60)).max(20).optional(),
      exit_step: z.string().max(60).optional().nullable(),
    })
    .optional(),
});

export const Route = createFileRoute("/api/public/track")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let json: unknown;
        try {
          json = await request.json();
        } catch {
          return new Response("Bad JSON", { status: 400 });
        }
        const parsed = BodySchema.safeParse(json);
        if (!parsed.success) {
          return new Response("Invalid payload", { status: 400 });
        }
        const body = parsed.data;

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");

        // Upsert / create session
        if (body.new_session && body.session) {
          await supabaseAdmin
            .from("funnel_sessions")
            .upsert(
              {
                session_key: body.session_key,
                ...body.session,
              },
              { onConflict: "session_key" },
            );
        }

        // Update session aggregates
        if (body.update) {
          const upd: Record<string, unknown> = {};
          if (body.update.last_seen_at) upd.last_seen_at = body.update.last_seen_at;
          if (typeof body.update.total_time_ms === "number") upd.total_time_ms = body.update.total_time_ms;
          if (body.update.reached_steps) upd.reached_steps = body.update.reached_steps;
          if (body.update.exit_step) upd.exit_step = body.update.exit_step;
          if (body.events?.some((e) => e.event_name === "cta_click")) upd.clicked_cta = true;
          if (Object.keys(upd).length > 0) {
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            await (supabaseAdmin.from("funnel_sessions") as any)
              .update(upd)
              .eq("session_key", body.session_key);
          }
        }

        // Insert events
        if (body.events && body.events.length > 0) {
          const rows = body.events.map((e) => ({
            session_key: body.session_key,
            event_name: e.event_name,
            step: e.step ?? null,
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            meta: (e.meta ?? null) as any,
            created_at: new Date(e.t).toISOString(),
          }));
          await supabaseAdmin.from("funnel_events").insert(rows);
        }


        return new Response("ok", { status: 200 });
      },
      OPTIONS: async () =>
        new Response(null, {
          status: 204,
          headers: {
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "POST, OPTIONS",
            "Access-Control-Allow-Headers": "Content-Type",
          },
        }),
    },
  },
});
