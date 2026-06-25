import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useQuery } from "@tanstack/react-query";
import { useState, Fragment } from "react";
import { getFunnelOverview } from "@/lib/funnel.functions";
import { getWebVitalsOverview } from "@/lib/web-vitals.functions";
import {
  Users, MousePointerClick, TrendingUp, Clock, Smartphone, Monitor,
  ChevronDown, ChevronRight, RefreshCw, Gauge,
} from "lucide-react";

export const Route = createFileRoute("/painel-funil")({
  head: () => ({
    meta: [
      { title: "Painel do Funil" },
      { name: "robots", content: "noindex,nofollow" },
    ],
  }),
  component: PainelFunil,
});

function PainelFunil() {
  const [rangeDays, setRangeDays] = useState(7);
  const fetchOverview = useServerFn(getFunnelOverview);
  const fetchVitals = useServerFn(getWebVitalsOverview);
  const { data, isLoading, refetch, isFetching } = useQuery({
    queryKey: ["funnel-overview", rangeDays],
    queryFn: () => fetchOverview({ data: { rangeDays } }),
    refetchInterval: 30_000,
  });
  const { data: vitals } = useQuery({
    queryKey: ["web-vitals", rangeDays],
    queryFn: () => fetchVitals({ data: { rangeDays } }),
    refetchInterval: 60_000,
  });

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between gap-4 flex-wrap">
          <div>
            <h1 className="text-xl font-bold">Painel do Funil</h1>
            <p className="text-xs text-slate-400">Caça ao Tesouro Bíblico — jornada do lead em tempo real</p>
          </div>
          <div className="flex items-center gap-2">
            {[1, 7, 30].map((d) => (
              <button
                key={d}
                onClick={() => setRangeDays(d)}
                className={`px-3 py-1.5 rounded-md text-sm font-medium border ${
                  rangeDays === d
                    ? "bg-emerald-500 border-emerald-500 text-slate-950"
                    : "bg-slate-800 border-slate-700 text-slate-200 hover:bg-slate-700"
                }`}
              >
                {d === 1 ? "Hoje" : `${d} dias`}
              </button>
            ))}
            <button
              onClick={() => refetch()}
              className="ml-2 p-1.5 rounded-md bg-slate-800 border border-slate-700 hover:bg-slate-700"
              aria-label="Atualizar"
            >
              <RefreshCw className={`w-4 h-4 ${isFetching ? "animate-spin" : ""}`} />
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-6 space-y-6">
        {isLoading ? (
          <div className="text-slate-400 py-20 text-center">Carregando dados…</div>
        ) : data ? (
          <>
            <StatsGrid totals={data.totals} />
            {vitals && <WebVitalsCard vitals={vitals} />}
            <FunnelChart funnel={data.funnel} />
            <div className="grid lg:grid-cols-2 gap-6">
              <SourcesTable utm={data.utm} />
              <DevicesCard devices={data.devices} />
            </div>
            <RecentSessions recent={data.recent} />
          </>
        ) : (
          <div className="text-slate-400 py-20 text-center">Nenhum dado ainda. Visite a página principal para gerar tráfego.</div>
        )}
      </main>
    </div>
  );
}

function Stat({ icon: Icon, label, value, sub }: { icon: typeof Users; label: string; value: string; sub?: string }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <div className="flex items-center justify-between mb-3">
        <span className="text-xs uppercase tracking-wide text-slate-400">{label}</span>
        <Icon className="w-4 h-4 text-emerald-400" />
      </div>
      <div className="text-3xl font-bold tabular-nums">{value}</div>
      {sub && <div className="text-xs text-slate-500 mt-1">{sub}</div>}
    </div>
  );
}

function StatsGrid({ totals }: { totals: { sessions: number; ctaClicks: number; conversionRate: number; avgTimeSec: number } }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <Stat icon={Users} label="Sessões" value={totals.sessions.toLocaleString("pt-BR")} />
      <Stat icon={MousePointerClick} label="Cliques no CTA" value={totals.ctaClicks.toLocaleString("pt-BR")} />
      <Stat icon={TrendingUp} label="Taxa CTA" value={`${totals.conversionRate.toFixed(1)}%`} sub="sessões → clique" />
      <Stat icon={Clock} label="Tempo médio" value={formatDuration(totals.avgTimeSec * 1000)} />
    </div>
  );
}

function FunnelChart({ funnel }: { funnel: Array<{ key: string; label: string; count: number; pctOfTop: number; pctVsPrev: number; dropoff: number }> }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-4">Funil — jornada completa</h2>
      <div className="space-y-3">
        {funnel.map((step, i) => (
          <div key={step.key}>
            <div className="flex items-center justify-between text-sm mb-1.5">
              <span className="text-slate-300">
                <span className="text-slate-500 mr-2">{i + 1}.</span>
                {step.label}
              </span>
              <span className="tabular-nums text-slate-400">
                <span className="text-slate-100 font-semibold">{step.count}</span>
                <span className="mx-2">·</span>
                {step.pctOfTop.toFixed(1)}% do topo
                {i > 0 && (
                  <>
                    <span className="mx-2">·</span>
                    <span className={step.pctVsPrev >= 50 ? "text-emerald-400" : "text-amber-400"}>
                      {step.pctVsPrev.toFixed(1)}% da etapa anterior
                    </span>
                    {step.dropoff > 0 && (
                      <span className="ml-2 text-rose-400">−{step.dropoff}</span>
                    )}
                  </>
                )}
              </span>
            </div>
            <div className="h-7 bg-slate-800 rounded-md overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all"
                style={{ width: `${Math.max(2, step.pctOfTop)}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <p className="text-xs text-slate-500 mt-4">
        % do topo = retenção em relação a quem visitou. % da etapa anterior = quanto sobreviveu da etapa imediatamente acima.
      </p>
    </div>
  );
}

function SourcesTable({ utm }: { utm: Array<{ source: string; sessions: number; clicks: number; rate: number }> }) {
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-4">Fontes de tráfego (UTM source / medium)</h2>
      {utm.length === 0 ? (
        <p className="text-sm text-slate-500">Sem dados ainda.</p>
      ) : (
        <table className="w-full text-sm">
          <thead className="text-xs uppercase text-slate-500 border-b border-slate-800">
            <tr>
              <th className="text-left py-2">Fonte</th>
              <th className="text-right py-2">Sessões</th>
              <th className="text-right py-2">CTA</th>
              <th className="text-right py-2">Taxa</th>
            </tr>
          </thead>
          <tbody>
            {utm.map((u) => (
              <tr key={u.source} className="border-b border-slate-800/50">
                <td className="py-2 text-slate-200">{u.source}</td>
                <td className="py-2 text-right tabular-nums">{u.sessions}</td>
                <td className="py-2 text-right tabular-nums">{u.clicks}</td>
                <td className="py-2 text-right tabular-nums">
                  <span className={u.rate >= 5 ? "text-emerald-400" : "text-slate-400"}>{u.rate.toFixed(1)}%</span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

function DevicesCard({ devices }: { devices: Array<{ device: string; sessions: number }> }) {
  const total = devices.reduce((s, d) => s + d.sessions, 0) || 1;
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-4">Dispositivos</h2>
      {devices.length === 0 ? (
        <p className="text-sm text-slate-500">Sem dados ainda.</p>
      ) : (
        <div className="space-y-3">
          {devices.map((d) => (
            <div key={d.device}>
              <div className="flex items-center justify-between text-sm mb-1">
                <span className="flex items-center gap-2 text-slate-300 capitalize">
                  {d.device === "mobile" ? <Smartphone className="w-4 h-4" /> : <Monitor className="w-4 h-4" />}
                  {d.device}
                </span>
                <span className="text-slate-400 tabular-nums">{d.sessions} · {((d.sessions / total) * 100).toFixed(0)}%</span>
              </div>
              <div className="h-2 bg-slate-800 rounded">
                <div className="h-full bg-sky-500 rounded" style={{ width: `${(d.sessions / total) * 100}%` }} />
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function RecentSessions({ recent }: { recent: Array<{
  session_key: string; started_at: string; device: string | null; browser: string | null; os: string | null;
  utm_source: string | null; utm_medium: string | null; utm_campaign: string | null; referrer: string | null;
  reached: number; reached_steps: string[]; clicked_cta: boolean; exit_step: string | null; total_time_ms: number;
}> }) {
  const [open, setOpen] = useState<string | null>(null);
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-5">
      <h2 className="text-lg font-semibold mb-4">Últimas sessões</h2>
      {recent.length === 0 ? (
        <p className="text-sm text-slate-500">Sem sessões ainda.</p>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="text-xs uppercase text-slate-500 border-b border-slate-800">
              <tr>
                <th className="w-6"></th>
                <th className="text-left py-2">Quando</th>
                <th className="text-left py-2">Dispositivo</th>
                <th className="text-left py-2">Fonte</th>
                <th className="text-right py-2">Etapas</th>
                <th className="text-left py-2">Saiu em</th>
                <th className="text-right py-2">Tempo</th>
                <th className="text-center py-2">CTA</th>
              </tr>
            </thead>
            <tbody>
              {recent.map((r) => {
                const isOpen = open === r.session_key;
                return (
                  <Fragment key={r.session_key}>
                    <tr
                      className="border-b border-slate-800/50 hover:bg-slate-800/40 cursor-pointer"
                      onClick={() => setOpen(isOpen ? null : r.session_key)}
                    >
                      <td className="py-2">{isOpen ? <ChevronDown className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}</td>
                      <td className="py-2 text-slate-300">{formatRelative(r.started_at)}</td>
                      <td className="py-2 text-slate-300">{r.device ?? "?"} · {r.browser ?? "?"}</td>
                      <td className="py-2 text-slate-300">{r.utm_source ?? "direto"}{r.utm_medium ? ` / ${r.utm_medium}` : ""}</td>
                      <td className="py-2 text-right tabular-nums">{r.reached}/7</td>
                      <td className="py-2 text-slate-400">{r.exit_step ?? "—"}</td>
                      <td className="py-2 text-right text-slate-400 tabular-nums">{formatDuration(r.total_time_ms)}</td>
                      <td className="py-2 text-center">
                        {r.clicked_cta ? <span className="text-emerald-400">✓</span> : <span className="text-slate-600">—</span>}
                      </td>
                    </tr>
                    {isOpen && (
                      <tr className="bg-slate-950/50">
                        <td></td>
                        <td colSpan={7} className="py-3 px-2 text-xs text-slate-400 space-y-1">
                          <div><span className="text-slate-500">Sessão:</span> {r.session_key}…</div>
                          <div><span className="text-slate-500">SO:</span> {r.os ?? "?"} · <span className="text-slate-500">Referrer:</span> {r.referrer || "—"}</div>
                          <div><span className="text-slate-500">Campanha:</span> {r.utm_campaign || "—"}</div>
                          <div><span className="text-slate-500">Etapas atingidas:</span> {r.reached_steps.join(" → ") || "—"}</div>
                        </td>
                      </tr>
                    )}
                  </Fragment>

                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function formatDuration(ms: number) {
  const s = Math.max(0, Math.round(ms / 1000));
  if (s < 60) return `${s}s`;
  const m = Math.floor(s / 60);
  const rs = s % 60;
  if (m < 60) return `${m}m ${rs}s`;
  const h = Math.floor(m / 60);
  return `${h}h ${m % 60}m`;
}

function formatRelative(iso: string) {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "agora";
  if (diff < 3600) return `${Math.floor(diff / 60)}min`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h`;
  return d.toLocaleDateString("pt-BR", { day: "2-digit", month: "2-digit", hour: "2-digit", minute: "2-digit" });
}
