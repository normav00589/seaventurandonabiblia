// Facebook Pixel — client-side helper.
// O script principal (fbevents.js) é carregado de forma assíncrona pelo
// snippet injetado no <head>, então não bloqueia renderização.

export const FB_PIXEL_ID = "1027016336523047";

type FbqFn = ((...args: unknown[]) => void) & { callMethod?: unknown; queue?: unknown[] };
declare global {
  interface Window {
    fbq?: FbqFn;
  }
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
