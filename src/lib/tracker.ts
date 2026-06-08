// Lightweight funnel tracker. ~2KB. Batches events, flushes on pagehide via sendBeacon.
const STORAGE_KEY = "fnl_sk";
const ENDPOINT = "/api/public/track";
const FLUSH_INTERVAL_MS = 4000;

type EventPayload = {
  event_name: "page_view" | "section_view" | "cta_click" | "exit";
  step?: string;
  meta?: Record<string, unknown>;
  t: number;
};

let sessionKey: string | null = null;
let queue: EventPayload[] = [];
let startTime = 0;
let lastStep: string | null = null;
let reachedSteps = new Set<string>();
let initialized = false;
let flushTimer: ReturnType<typeof setInterval> | null = null;
let sessionMeta: Record<string, unknown> = {};

function uuid() {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getDeviceInfo() {
  const ua = navigator.userAgent;
  const mobile = /Mobi|Android|iPhone|iPad/i.test(ua);
  let browser = "Other";
  if (/Edg\//.test(ua)) browser = "Edge";
  else if (/Chrome\//.test(ua)) browser = "Chrome";
  else if (/Safari\//.test(ua)) browser = "Safari";
  else if (/Firefox\//.test(ua)) browser = "Firefox";
  let os = "Other";
  if (/Windows/.test(ua)) os = "Windows";
  else if (/Mac OS/.test(ua)) os = "macOS";
  else if (/Android/.test(ua)) os = "Android";
  else if (/iPhone|iPad|iOS/.test(ua)) os = "iOS";
  else if (/Linux/.test(ua)) os = "Linux";
  return { device: mobile ? "mobile" : "desktop", browser, os };
}

function parseUtm() {
  const p = new URLSearchParams(window.location.search);
  return {
    utm_source: p.get("utm_source"),
    utm_medium: p.get("utm_medium"),
    utm_campaign: p.get("utm_campaign"),
    utm_term: p.get("utm_term"),
    utm_content: p.get("utm_content"),
  };
}

function send(body: object, useBeacon = false) {
  try {
    const payload = JSON.stringify(body);
    if (useBeacon && "sendBeacon" in navigator) {
      navigator.sendBeacon(ENDPOINT, new Blob([payload], { type: "application/json" }));
      return;
    }
    fetch(ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: payload,
      keepalive: true,
    }).catch(() => {});
  } catch {}
}

function flush(final = false) {
  if (!sessionKey) return;
  const events = queue;
  queue = [];
  const totalMs = Date.now() - startTime;
  const body: Record<string, unknown> = {
    session_key: sessionKey,
    events,
    update: {
      last_seen_at: new Date().toISOString(),
      total_time_ms: totalMs,
      reached_steps: Array.from(reachedSteps),
      exit_step: final ? lastStep : undefined,
    },
  };
  if (events.length === 0 && !final) return;
  send(body, final);
}

function trackEvent(ev: EventPayload) {
  queue.push(ev);
  if (ev.event_name === "section_view" && ev.step) {
    reachedSteps.add(ev.step);
    lastStep = ev.step;
  }
  if (ev.event_name === "cta_click") {
    reachedSteps.add("cta_click");
  }
}

function observeSections() {
  const els = document.querySelectorAll<HTMLElement>("[data-funnel-step]");
  if (!els.length) return;
  const seen = new Set<string>();
  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (!e.isIntersecting) continue;
        const step = (e.target as HTMLElement).dataset.funnelStep;
        if (!step || seen.has(step)) continue;
        seen.add(step);
        trackEvent({ event_name: "section_view", step, t: Date.now() });
      }
    },
    { threshold: 0.4 },
  );
  els.forEach((el) => io.observe(el));
}

function attachCtaListeners() {
  document.addEventListener(
    "click",
    (e) => {
      const target = e.target as HTMLElement | null;
      const el = target?.closest<HTMLElement>("[data-cta]");
      if (!el) return;
      trackEvent({
        event_name: "cta_click",
        step: "cta_click",
        meta: { cta: el.dataset.cta, href: (el as HTMLAnchorElement).href },
        t: Date.now(),
      });
      flush(); // send immediately
    },
    { capture: true },
  );
}

export function initTracker() {
  if (initialized || typeof window === "undefined") return;
  initialized = true;

  // Restore/create session key (per tab session)
  try {
    sessionKey = sessionStorage.getItem(STORAGE_KEY);
  } catch {}
  const isNew = !sessionKey;
  if (!sessionKey) {
    sessionKey = uuid();
    try {
      sessionStorage.setItem(STORAGE_KEY, sessionKey);
    } catch {}
  }

  startTime = Date.now();
  const dev = getDeviceInfo();
  const utm = parseUtm();
  sessionMeta = {
    ...dev,
    ...utm,
    user_agent: navigator.userAgent,
    referrer: document.referrer || null,
    landing_path: window.location.pathname + window.location.search,
  };

  // Initial page_view + ensure session row exists
  trackEvent({ event_name: "page_view", step: "visited", t: Date.now() });
  reachedSteps.add("visited");
  lastStep = "visited";

  send({
    session_key: sessionKey,
    new_session: isNew,
    session: sessionMeta,
    events: queue,
    update: {
      last_seen_at: new Date().toISOString(),
      total_time_ms: 0,
      reached_steps: Array.from(reachedSteps),
    },
  });
  queue = [];

  // Engaged after 10% scroll
  let engagedFired = false;
  const onScroll = () => {
    if (engagedFired) return;
    const scrolled = window.scrollY / Math.max(1, document.body.scrollHeight - window.innerHeight);
    if (scrolled > 0.08) {
      engagedFired = true;
      trackEvent({ event_name: "section_view", step: "engaged", t: Date.now() });
      window.removeEventListener("scroll", onScroll);
    }
  };
  window.addEventListener("scroll", onScroll, { passive: true });

  // Wait for DOM
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", () => {
      observeSections();
      attachCtaListeners();
    });
  } else {
    observeSections();
    attachCtaListeners();
  }

  flushTimer = setInterval(() => flush(false), FLUSH_INTERVAL_MS);

  window.addEventListener("pagehide", () => {
    trackEvent({ event_name: "exit", step: lastStep ?? "unknown", t: Date.now() });
    flush(true);
  });
  document.addEventListener("visibilitychange", () => {
    if (document.visibilityState === "hidden") flush(false);
  });
}
