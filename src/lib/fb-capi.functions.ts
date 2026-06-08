import { createServerFn } from "@tanstack/react-start";
import { getRequest, getRequestIP } from "@tanstack/react-start/server";
import { z } from "zod";

// Facebook Conversions API (server-side). Use para reforçar eventos críticos
// (Lead, Purchase) com dedupe via event_id — melhora o matching mesmo com
// bloqueadores de anúncios.

const PIXEL_ID = "1027016336523047";
const API_VERSION = "v20.0";

const InputSchema = z.object({
  eventName: z.string().min(1).max(64),
  eventId: z.string().min(1).max(128),
  eventSourceUrl: z.string().url().optional(),
  email: z.string().email().optional(),
  phone: z.string().min(3).max(32).optional(),
  value: z.number().nonnegative().optional(),
  currency: z.string().length(3).optional(),
});

async function sha256(input: string): Promise<string> {
  const data = new TextEncoder().encode(input.trim().toLowerCase());
  const hash = await crypto.subtle.digest("SHA-256", data);
  return Array.from(new Uint8Array(hash))
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("");
}

export const sendFbEvent = createServerFn({ method: "POST" })
  .inputValidator((data: unknown) => InputSchema.parse(data))
  .handler(async ({ data }) => {
    const token = process.env.FB_CONVERSIONS_API_TOKEN;
    if (!token) return { ok: false, error: "missing_token" as const };

    const req = getRequest();
    const ua = req.headers.get("user-agent") ?? undefined;
    const ip = getRequestIP({ xForwardedFor: true }) ?? undefined;
    const fbp = req.headers.get("x-fbp") ?? undefined;
    const fbc = req.headers.get("x-fbc") ?? undefined;

    const userData: Record<string, unknown> = {};
    if (data.email) userData.em = [await sha256(data.email)];
    if (data.phone) userData.ph = [await sha256(data.phone.replace(/\D/g, ""))];
    if (ip) userData.client_ip_address = ip;
    if (ua) userData.client_user_agent = ua;
    if (fbp) userData.fbp = fbp;
    if (fbc) userData.fbc = fbc;

    const body = {
      data: [
        {
          event_name: data.eventName,
          event_time: Math.floor(Date.now() / 1000),
          event_id: data.eventId,
          action_source: "website",
          event_source_url: data.eventSourceUrl,
          user_data: userData,
          custom_data:
            data.value != null
              ? { value: data.value, currency: data.currency ?? "BRL" }
              : undefined,
        },
      ],
    };

    const res = await fetch(
      `https://graph.facebook.com/${API_VERSION}/${PIXEL_ID}/events?access_token=${encodeURIComponent(token)}`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      },
    );

    if (!res.ok) {
      const text = await res.text();
      console.error("FB CAPI error", res.status, text);
      return { ok: false, error: "upstream_error" as const, status: res.status };
    }
    return { ok: true as const };
  });
