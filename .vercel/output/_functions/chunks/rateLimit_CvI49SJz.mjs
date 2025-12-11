const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://www.ejemplo-ministeriomana.org", "SSR": true};
const VERIFY_ENDPOINT = "https://challenges.cloudflare.com/turnstile/v0/siteverify";
function getSecret() {
  const secret = Object.assign(__vite_import_meta_env__, { _: process.env._ })?.TURNSTILE_SECRET_KEY ?? process.env?.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error("TURNSTILE_SECRET_KEY no está configurado");
  }
  return secret;
}
async function verifyTurnstile(token, remoteIp) {
  if (!token) return false;
  const secret = getSecret();
  try {
    const res = await fetch(VERIFY_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: new URLSearchParams({ secret, response: token, remoteip: remoteIp ?? "" })
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.success);
  } catch (err) {
    console.error("[turnstile.verify] error", err);
    return false;
  }
}

const MAX_ATTEMPTS = 5;
const WINDOW_SECONDS = 60;
function getSupabaseRestConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) return null;
  return {
    endpoint: `${url}/rest/v1/security_throttle`,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json"
    }
  };
}
async function cleanupOldEntries(conf) {
  if (!conf) return;
  const cutoff = new Date(Date.now() - 1e3 * 60 * 60 * 24).toISOString();
  try {
    await fetch(`${conf.endpoint}?created_at=lt.${encodeURIComponent(cutoff)}`, {
      method: "DELETE",
      headers: conf.headers
    });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[rateLimit] cleanup failed", error);
    }
  }
}
async function enforceRateLimit(identifier, windowSeconds = WINDOW_SECONDS, maxAttempts = MAX_ATTEMPTS) {
  const conf = getSupabaseRestConfig();
  if (!conf) return true;
  try {
    await fetch(conf.endpoint, {
      method: "POST",
      headers: conf.headers,
      body: JSON.stringify({ identifier })
    });
    const since = new Date(Date.now() - windowSeconds * 1e3).toISOString();
    const res = await fetch(`${conf.endpoint}?select=identifier&identifier=eq.${encodeURIComponent(identifier)}&created_at=gte.${encodeURIComponent(since)}`, {
      method: "GET",
      headers: { ...conf.headers, Prefer: "count=exact" }
    });
    if (!res.ok) return true;
    let count = 0;
    const contentRange = res.headers.get("content-range") || res.headers.get("Content-Range");
    if (contentRange) {
      const parts = contentRange.split("/");
      const total = parts[1];
      count = Number(total) || 0;
    }
    if (!count) {
      const data = await res.json();
      count = Array.isArray(data) ? data.length : 0;
    }
    if (Math.random() < 0.05) {
      void cleanupOldEntries(conf);
    }
    return count <= maxAttempts;
  } catch (error) {
    console.error("[rateLimit] error", error);
    return true;
  }
}

export { enforceRateLimit as e, verifyTurnstile as v };
