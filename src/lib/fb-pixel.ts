// Facebook Pixel — client-side helper.
// O script principal (fbevents.js) é carregado de forma assíncrona pelo
// snippet injetado no <head>, então não bloqueia renderização.

import { sendFbEvent } from "@/lib/fb-capi.functions";

export const FB_PIXEL_ID = "4377717859166211";

type FbqFn = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
declare global {
  interface Window {
    fbq?: FbqFn;
  }
}

function readCookie(name: string): string | undefined {
  if (typeof document === "undefined") return undefined;
  const m = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return m ? decodeURIComponent(m[1]) : undefined;
}

function uuid(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return "xxxxxxxxxxxx4xxxyxxxxxxxxxxxxxxx".replace(/[xy]/g, (c) => {
    const r = (Math.random() * 16) | 0;
    const v = c === "x" ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

/** Dispara um evento padrão do Pixel (ex.: 'Lead', 'InitiateCheckout', 'Purchase'). */
export function fbTrack(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    window.fbq("track", event, params);
  }
}

/** Dispara um evento customizado. */
export function fbTrackCustom(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined") return;
  if (typeof window.fbq === "function") {
    window.fbq("trackCustom", event, params);
  }
}

/**
 * Tracking avançado: dispara o evento no Pixel (browser) e na Conversions API
 * (server-side) com o MESMO event_id, permitindo dedupe no Facebook.
 * Roda assincronamente — não bloqueia o clique nem a navegação.
 */
export function trackFbEvent(
  event: string,
  params?: {
    value?: number;
    currency?: string;
    content_name?: string;
    content_ids?: string[];
    content_type?: string;
    [k: string]: unknown;
  },
) {
  if (typeof window === "undefined") return;
  const eventId = uuid();

  // Pixel (browser)
  if (typeof window.fbq === "function") {
    window.fbq("track", event, params ?? {}, { eventID: eventId });
  }

  // CAPI (server) — fire-and-forget
  try {
    void sendFbEvent({
      data: {
        eventName: event,
        eventId,
        eventSourceUrl: window.location.href,
        value: typeof params?.value === "number" ? params.value : undefined,
        currency: typeof params?.currency === "string" ? params.currency : undefined,
        contentName: typeof params?.content_name === "string" ? params.content_name : undefined,
        fbp: readCookie("_fbp"),
        fbc: readCookie("_fbc"),
      },
    }).catch(() => {});
  } catch {}
}

/** Snippet oficial do Pixel — injetado uma única vez via <head>. */
export const FB_PIXEL_SNIPPET = `!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '${FB_PIXEL_ID}');
fbq('track', 'PageView');`;
