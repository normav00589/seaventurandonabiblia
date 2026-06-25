import { createFileRoute } from "@tanstack/react-router";
import { z } from "zod";

const BodySchema = z.object({
  session_key: z.string().min(4).max(64).nullable().optional(),
  metric: z.enum(["LCP", "FCP", "INP", "CLS", "TTFB"]),
  value: z.number().finite().min(0).max(120000),
  rating: z.enum(["good", "needs-improvement", "poor"]).optional().nullable(),
  device: z.string().max(20).optional().nullable(),
  path: z.string().max(300).optional().nullable(),
  utm_source: z.string().max(120).optional().nullable(),
  utm_medium: z.string().max(120).optional().nullable(),
  utm_campaign: z.string().max(120).optional().nullable(),
});

export const Route = createFileRoute("/api/public/vitals")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let json: unknown;
        try { json = await request.json(); } catch { return new Response("Bad JSON", { status: 400 }); }
        const parsed = BodySchema.safeParse(json);
        if (!parsed.success) return new Response("Invalid payload", { status: 400 });

        const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
        await supabaseAdmin.from("web_vitals").insert({
          session_key: parsed.data.session_key ?? null,
          metric: parsed.data.metric,
          value: parsed.data.value,
          rating: parsed.data.rating ?? null,
          device: parsed.data.device ?? null,
          path: parsed.data.path ?? null,
          utm_source: parsed.data.utm_source ?? null,
          utm_medium: parsed.data.utm_medium ?? null,
          utm_campaign: parsed.data.utm_campaign ?? null,
        });
        return new Response("ok", { status: 200 });
      },
      OPTIONS: async () => new Response(null, { status: 204, headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
      }}),
    },
  },
});
