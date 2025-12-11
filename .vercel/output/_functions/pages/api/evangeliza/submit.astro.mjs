import { v as verifyTurnstile, e as enforceRateLimit } from '../../../chunks/rateLimit_CvI49SJz.mjs';
import { l as logSecurityEvent } from '../../../chunks/securityEvents_Qegq-P8G.mjs';
import { s as safeCountry } from '../../../chunks/donations_D7W57EJc.mjs';
import { c as containsBlockedSequence, s as sanitizePlainText } from '../../../chunks/validation_DwYloAJB.mjs';
export { renderers } from '../../../renderers.mjs';

const supabaseAdmin = void 0;

async function geocodeCityCountry(city, country) {
  const q = [city, country].filter(Boolean).join(", ");
  if (!q) return null;
  try {
    const res = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(q)}&limit=1`, {
      headers: { "User-Agent": process.env.NOMINATIM_USER_AGENT || "ministeriomana.org/evangeliza" }
    });
    const data = await res.json();
    if (Array.isArray(data) && data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
  }
  return null;
}

const prerender = false;
const POST = async ({ request, clientAddress, redirect }) => {
  try {
    const form = await request.formData();
    const firstNameRaw = form.get("firstName") || "";
    const cityRaw = form.get("city") || "";
    const countryRaw = form.get("country") || "";
    const campusRaw = form.get("campus") || "";
    if (containsBlockedSequence(firstNameRaw) || containsBlockedSequence(cityRaw) || containsBlockedSequence(campusRaw)) {
      return new Response(JSON.stringify({ ok: false, error: "No se permiten enlaces o caracteres especiales." }), { status: 400 });
    }
    const firstName = sanitizePlainText(firstNameRaw, 60);
    const city = sanitizePlainText(cityRaw, 80);
    const campus = sanitizePlainText(campusRaw, 80);
    const country = sanitizePlainText(countryRaw, 80);
    const cfToken = form.get("cf-turnstile-response") || void 0;
    if (!firstName) {
      return new Response(JSON.stringify({ ok: false, error: "Nombre requerido" }), { status: 400 });
    }
    const okCaptcha = await verifyTurnstile(cfToken, clientAddress);
    if (!okCaptcha) {
      void logSecurityEvent({
        type: "captcha_failed",
        identifier: "evangeliza.submit",
        ip: clientAddress,
        detail: "Turnstile inválido"
      });
      return new Response(JSON.stringify({ ok: false, error: "Captcha inválido" }), { status: 400 });
    }
    const allowed = await enforceRateLimit(`evangeliza:${clientAddress ?? "unknown"}`);
    if (!allowed) {
      void logSecurityEvent({
        type: "rate_limited",
        identifier: `evangeliza:${clientAddress ?? "unknown"}`,
        ip: clientAddress,
        detail: "Evangeliza submit"
      });
      return new Response(JSON.stringify({ ok: false, error: "Demasiadas solicitudes" }), { status: 429 });
    }
    let lat = null;
    let lng = null;
    const geo = await geocodeCityCountry(city, country);
    if (geo) {
      lat = geo.lat;
      lng = geo.lng;
    }
    const countryCode = safeCountry(country) ?? null;
    const cityClean = city || null;
    const campusClean = campus || null;
    if (supabaseAdmin) ; else {
      console.log("[EVANGELIZA] (no-supabase)", { firstName, city, country, lat, lng, campus });
    }
    return new Response(JSON.stringify({ ok: true }), { status: 200, headers: { "content-type": "application/json" } });
  } catch (e) {
    void logSecurityEvent({
      type: "payment_error",
      identifier: "evangeliza.submit",
      ip: clientAddress,
      detail: e?.message || "Evangeliza submit error"
    });
    return new Response(JSON.stringify({ ok: false, error: e?.message || "Error" }), { status: 500 });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
