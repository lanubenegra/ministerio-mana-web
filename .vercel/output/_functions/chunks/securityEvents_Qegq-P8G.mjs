const REST_TABLE_ENDPOINT = "security_events";
function getRestConfig() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) return null;
  return {
    endpoint: `${url}/rest/v1/${REST_TABLE_ENDPOINT}`,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      Prefer: "return=minimal"
    }
  };
}
async function logSecurityEvent(event) {
  const conf = getRestConfig();
  if (!conf) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[securityEvent] config missing", event);
    }
    return;
  }
  const payload = {
    type: event.type,
    identifier: event.identifier ?? null,
    ip: event.ip ?? null,
    detail: event.detail ?? null,
    user_agent: event.userAgent ?? null,
    meta: event.meta ?? null
  };
  try {
    const res = await fetch(conf.endpoint, {
      method: "POST",
      headers: conf.headers,
      body: JSON.stringify(payload)
    });
    if (!res.ok && process.env.NODE_ENV !== "production") {
      console.error("[securityEvent] insert failed", res.status, await res.text());
    }
  } catch (error) {
    console.error("[securityEvent] error", error);
  }
}
async function logPaymentEvent(provider, kind, reference, data) {
  return;
}

export { logPaymentEvent as a, logSecurityEvent as l };
