import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";

type Row = { metric: string; value: number; device: string | null; rating: string | null; created_at: string };

const THRESHOLDS: Record<string, { good: number; poor: number; unit: string }> = {
  LCP: { good: 2500, poor: 4000, unit: "ms" },
  FCP: { good: 1800, poor: 3000, unit: "ms" },
  INP: { good: 200, poor: 500, unit: "ms" },
  TTFB: { good: 800, poor: 1800, unit: "ms" },
  CLS: { good: 0.1, poor: 0.25, unit: "" },
};

function percentile(values: number[], p: number) {
  if (!values.length) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const idx = Math.min(sorted.length - 1, Math.floor((p / 100) * sorted.length));
  return sorted[idx];
}

export const getWebVitalsOverview = createServerFn({ method: "POST" })
  .inputValidator((input: { rangeDays: number }) =>
    z.object({ rangeDays: z.number().int().min(1).max(365) }).parse(input),
  )
  .handler(async ({ data }) => {
    const { supabaseAdmin } = await import("@/integrations/supabase/client.server");
    const since = new Date(Date.now() - data.rangeDays * 24 * 60 * 60 * 1000).toISOString();
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const { data: rows, error } = await (supabaseAdmin.from("web_vitals" as any) as any)
      .select("metric,value,device,rating,created_at")
      .gte("created_at", since)
      .order("created_at", { ascending: false })
      .limit(5000);
    if (error) throw new Error(error.message);

    const all = (rows ?? []) as Row[];
    const metrics: Array<{
      metric: string; unit: string;
      mobile: { p75: number; samples: number; goodPct: number; poorPct: number };
      desktop: { p75: number; samples: number; goodPct: number; poorPct: number };
    }> = [];

    for (const m of ["LCP", "FCP", "INP", "CLS", "TTFB"]) {
      const t = THRESHOLDS[m];
      const agg = (dev: "mobile" | "desktop") => {
        const arr = all.filter((r) => r.metric === m && r.device === dev);
        const vals = arr.map((r) => r.value);
        const good = arr.filter((r) => r.value <= t.good).length;
        const poor = arr.filter((r) => r.value > t.poor).length;
        return {
          p75: percentile(vals, 75),
          samples: vals.length,
          goodPct: vals.length ? (good / vals.length) * 100 : 0,
          poorPct: vals.length ? (poor / vals.length) * 100 : 0,
        };
      };
      metrics.push({ metric: m, unit: t.unit, mobile: agg("mobile"), desktop: agg("desktop") });
    }

    return { metrics, totalSamples: all.length };
  });
