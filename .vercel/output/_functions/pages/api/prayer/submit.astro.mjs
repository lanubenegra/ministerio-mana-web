import { createClient } from '@supabase/supabase-js';
import { v as verifyTurnstile, e as enforceRateLimit } from '../../../chunks/rateLimit_CvI49SJz.mjs';
import { l as logSecurityEvent } from '../../../chunks/securityEvents_Qegq-P8G.mjs';
import { s as safeCountry } from '../../../chunks/donations_D7W57EJc.mjs';
import { c as containsBlockedSequence, s as sanitizePlainText } from '../../../chunks/validation_DwYloAJB.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request, clientAddress }) => {
  const form = await request.formData();
  const firstNameRaw = form.get("firstName") || "";
  const cityRaw = form.get("city") || "";
  const countryRaw = form.get("country") || "";
  if (containsBlockedSequence(firstNameRaw) || containsBlockedSequence(cityRaw)) {
    return new Response(JSON.stringify({ ok: false, error: "Contenido inválido" }), { status: 400 });
  }
  const firstName = sanitizePlainText(firstNameRaw, 60);
  const city = sanitizePlainText(cityRaw, 80);
  const country = sanitizePlainText(countryRaw, 80);
  const captchaToken = form.get("cf-turnstile-response")?.toString();
  if (!firstName) return new Response(JSON.stringify({ ok: false, error: "Nombre requerido" }), { status: 400 });
  const okCaptcha = await verifyTurnstile(captchaToken, clientAddress);
  if (!okCaptcha) {
    void logSecurityEvent({
      type: "captcha_failed",
      identifier: "prayer.submit",
      ip: clientAddress,
      detail: "Turnstile inválido"
    });
    return new Response(JSON.stringify({ ok: false, error: "Captcha inválido" }), { status: 400 });
  }
  const allowed = await enforceRateLimit(`prayer:${clientAddress ?? "unknown"}`);
  if (!allowed) {
    void logSecurityEvent({
      type: "rate_limited",
      identifier: `prayer:${clientAddress ?? "unknown"}`,
      ip: clientAddress,
      detail: "Prayer submit"
    });
    return new Response(JSON.stringify({ ok: false, error: "Demasiadas solicitudes" }), { status: 429 });
  }
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE;
  if (!url || !key) return new Response(JSON.stringify({ ok: true, simulated: true }), { status: 200 });
  const supabase = createClient(url, key, { auth: { persistSession: false } });
  const cityClean = city ? city.replace(/[^\p{L}\p{N}\s\.,-]+/gu, "").trim() : null;
  const countryCode = safeCountry(country) ?? null;
  const { error } = await supabase.from("prayer_requests").insert({
    first_name: firstName,
    city: cityClean,
    country: countryCode,
    prayers_count: 0,
    approved: true
  });
  if (error) {
    void logSecurityEvent({
      type: "payment_error",
      identifier: "prayer.submit",
      ip: clientAddress,
      detail: "Supabase insert error",
      meta: { error: error.message }
    });
    return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
  }
  return new Response(JSON.stringify({ ok: true }), { status: 200 });
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
