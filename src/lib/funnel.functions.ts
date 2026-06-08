import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

export const FUNNEL_STEPS = [
  { key: "visited", label: "Visitou a página" },
  { key: "engaged", label: "Engajou (scroll)" },
  { key: "kit", label: "Viu o Kit" },
  { key: "bonus", label: "Viu Bônus" },
  { key: "testimonials", label: "Viu Depoimentos" },
  { key: "offer", label: "Viu Oferta" },
  { key: "cta_click", label: "Clicou no CTA" },
] as const;

export type FunnelStepKey = (typeof FUNNEL_STEPS)[number]["key"];

type SessionRow = {
  session_key: string;
  device: string | null;
  browser: string | null;
  os: string | null;
  utm_source: string | null;
  utm_medium: string | null;
  utm_campaign: string | null;
  referrer: string | null;
  landing_path: string | null;
  started_at: string;
  last_seen_at: string;
  exit_step: string | null;
  total_time_ms: number | null;
  reached_steps: string[] | null;
  clicked_cta: boolean | null;
};

export const getFunnelOverview = createServerFn({ method: "POST" })
  .inputValidator((input: { rangeDays: number }) =>
    z.object({ rangeDays: z.number().int().min(1).max(365) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - data.rangeDays * 24 * 60 * 60 * 1000).toISOString();

    const { data: sessions, error } = await supabaseAdmin
      .from("funnel_sessions")
      .select(
        "session_key,device,browser,os,utm_source,utm_medium,utm_campaign,referrer,landing_path,started_at,last_seen_at,exit_step,total_time_ms,reached_steps,clicked_cta",
      )
      .gte("started_at", since)
      .order("started_at", { ascending: false })
      .limit(2000);

    if (error) throw new Error(error.message);
    const rows = (sessions ?? []) as SessionRow[];

    // Funnel counts
    const stepCounts: Record<string, number> = {};
    for (const s of FUNNEL_STEPS) stepCounts[s.key] = 0;
    let totalTime = 0;
    let withTime = 0;
    const utmAgg: Record<string, { sessions: number; clicks: number }> = {};
    const deviceAgg: Record<string, number> = {};

    for (const r of rows) {
      const reached = new Set(r.reached_steps ?? []);
      if (r.clicked_cta) reached.add("cta_click");
      for (const k of Object.keys(stepCounts)) {
        if (reached.has(k)) stepCounts[k]++;
      }
      if (r.total_time_ms && r.total_time_ms > 0) {
        totalTime += r.total_time_ms;
        withTime++;
      }
      const utmKey = `${r.utm_source ?? "direto"} / ${r.utm_medium ?? "—"}`;
      utmAgg[utmKey] = utmAgg[utmKey] || { sessions: 0, clicks: 0 };
      utmAgg[utmKey].sessions++;
      if (r.clicked_cta) utmAgg[utmKey].clicks++;

      const dev = r.device ?? "?";
      deviceAgg[dev] = (deviceAgg[dev] ?? 0) + 1;
    }

    const totalSessions = rows.length;
    const ctaClicks = stepCounts["cta_click"] ?? 0;
    const conversionRate = totalSessions ? (ctaClicks / totalSessions) * 100 : 0;
    const avgTimeSec = withTime ? Math.round(totalTime / withTime / 1000) : 0;

    const funnel = FUNNEL_STEPS.map((s, i) => {
      const count = stepCounts[s.key] ?? 0;
      const first = stepCounts[FUNNEL_STEPS[0].key] || 1;
      const prev = i > 0 ? stepCounts[FUNNEL_STEPS[i - 1].key] || 0 : count;
      return {
        key: s.key,
        label: s.label,
        count,
        pctOfTop: (count / first) * 100,
        pctVsPrev: i === 0 ? 100 : prev ? (count / prev) * 100 : 0,
        dropoff: i === 0 ? 0 : Math.max(0, prev - count),
      };
    });

    const utm = Object.entries(utmAgg)
      .map(([key, v]) => ({
        source: key,
        sessions: v.sessions,
        clicks: v.clicks,
        rate: v.sessions ? (v.clicks / v.sessions) * 100 : 0,
      }))
      .sort((a, b) => b.sessions - a.sessions)
      .slice(0, 12);

    const recent = rows.slice(0, 50).map((r) => ({
      session_key: r.session_key.slice(0, 8),
      started_at: r.started_at,
      device: r.device,
      browser: r.browser,
      os: r.os,
      utm_source: r.utm_source,
      utm_medium: r.utm_medium,
      utm_campaign: r.utm_campaign,
      referrer: r.referrer,
      reached: (r.reached_steps ?? []).length + (r.clicked_cta ? 1 : 0),
      reached_steps: r.reached_steps ?? [],
      clicked_cta: !!r.clicked_cta,
      exit_step: r.exit_step,
      total_time_ms: r.total_time_ms ?? 0,
    }));

    return {
      totals: {
        sessions: totalSessions,
        ctaClicks,
        conversionRate,
        avgTimeSec,
      },
      funnel,
      utm,
      devices: Object.entries(deviceAgg).map(([k, v]) => ({ device: k, sessions: v })),
      recent,
    };
  });
