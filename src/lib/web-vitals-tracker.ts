// Coleta Web Vitals reais (LCP, FCP, INP, CLS, TTFB) e envia para /api/public/vitals.
// Usa sendBeacon para não atrapalhar a navegação.

const ENDPOINT = "/api/public/vitals";
const STORAGE_KEY = "fnl_sk";

type Metric = {
  name: "LCP" | "FCP" | "INP" | "CLS" | "TTFB";
  value: number;
  rating: "good" | "needs-improvement" | "poor";
};

let initialized = false;

function getDevice(): "mobile" | "desktop" {
  if (typeof navigator === "undefined") return "desktop";
  return /Mobi|Android|iPhone|iPad/i.test(navigator.userAgent) ? "mobile" : "desktop";
}

function parseUtm() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
  };
}

function send(metric: Metric) {
  try {
    let sessionKey: string | null = null;
    try { sessionKey = sessionStorage.getItem(STORAGE_KEY); } catch {}
    const body = JSON.stringify({
      session_key: sessionKey,
      metric: metric.name,
      value: metric.value,
      rating: metric.rating,
      device: getDevice(),
      path: window.location.pathname,
      ...parseUtm(),
    });
    if ("sendBeacon" in navigator) {
      navigator.sendBeacon(ENDPOINT, new Blob([body], { type: "application/json" }));
    } else {
      fetch(ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body, keepalive: true }).catch(() => {});
    }
  } catch {}
}

export async function initWebVitals() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;
  try {
    const wv = await import("web-vitals");
    wv.onLCP(send);
    wv.onFCP(send);
    wv.onINP(send);
    wv.onCLS(send);
    wv.onTTFB(send);
  } catch {}
}
