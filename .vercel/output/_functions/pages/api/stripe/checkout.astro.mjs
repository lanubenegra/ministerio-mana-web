import { v as verifyTurnstile, e as enforceRateLimit } from '../../../chunks/rateLimit_CvI49SJz.mjs';
import { v as validateUsdAmount, a as sanitizeDescription, s as safeCountry } from '../../../chunks/donations_D7W57EJc.mjs';
import { r as resolveBaseUrl } from '../../../chunks/url_B71Ml9ik.mjs';
import { c as createStripeDonationSession } from '../../../chunks/stripe_DGPgY0he.mjs';
import { l as logSecurityEvent, a as logPaymentEvent } from '../../../chunks/securityEvents_Qegq-P8G.mjs';
import { S as SUPPORTED_CURRENCIES$1 } from '../../../chunks/fx_CIuljFs3.mjs';
export { renderers } from '../../../renderers.mjs';

new Set(SUPPORTED_CURRENCIES$1.map((code) => code.toUpperCase()));
function stripeSupportedCurrencyCodes() {
  return ["USD", "EUR", "GBP", "MXN", "PEN", "ARS", "CLP", "BRL", "CAD", "AUD"];
}

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://www.ejemplo-ministeriomana.org", "SSR": true};
const prerender = false;
const SUPPORTED_CURRENCIES = new Set(stripeSupportedCurrencyCodes());
function acceptsJson(request) {
  const accept = request.headers.get("accept") || "";
  return accept.includes("application/json");
}
const POST = async ({ request, clientAddress }) => {
  const userAgent = request.headers.get("user-agent") || "";
  try {
    const data = await request.formData();
    const captchaToken = data.get("cf-turnstile-response")?.toString();
    const okCaptcha = await verifyTurnstile(captchaToken, clientAddress);
    if (!okCaptcha) {
      void logSecurityEvent({
        type: "captcha_failed",
        identifier: "stripe.checkout",
        ip: clientAddress,
        userAgent,
        detail: "Turnstile inválido"
      });
      return new Response(JSON.stringify({ ok: false, error: "Captcha inválido" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
    const rateKey = `stripe:${clientAddress ?? "unknown"}`;
    const allowed = await enforceRateLimit(rateKey);
    if (!allowed) {
      void logSecurityEvent({
        type: "rate_limited",
        identifier: rateKey,
        ip: clientAddress,
        userAgent,
        detail: "Stripe checkout"
      });
      return new Response(JSON.stringify({ ok: false, error: "Demasiadas solicitudes. Intenta más tarde." }), {
        status: 429,
        headers: { "content-type": "application/json" }
      });
    }
    const amountInput = Number(data.get("amountUsd") || 0);
    let amountUsd;
    try {
      amountUsd = validateUsdAmount(amountInput);
    } catch (error) {
      return new Response(JSON.stringify({ ok: false, error: error?.message || "Monto inválido" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
    const currency = String(data.get("currency") || "USD").toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(currency)) {
      return new Response(JSON.stringify({ ok: false, error: "Moneda no soportada" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
    const description = sanitizeDescription(data.get("desc")?.toString(), "Donation");
    const country = safeCountry(data.get("country")?.toString()) ?? "UN";
    const baseUrl = resolveBaseUrl(request);
    const successUrl = (Object.assign(__vite_import_meta_env__, { _: process.env._ })?.STRIPE_SUCCESS_URL ?? process.env.STRIPE_SUCCESS_URL) || `${baseUrl}/donaciones/gracias`;
    const cancelUrl = (Object.assign(__vite_import_meta_env__, { _: process.env._ })?.STRIPE_CANCEL_URL ?? process.env.STRIPE_CANCEL_URL) || `${baseUrl}/donaciones`;
    const session = await createStripeDonationSession({
      amountUsd,
      currency,
      description,
      successUrl,
      cancelUrl,
      metadata: {
        country,
        source: "donations_form"
      }
    });
    void logPaymentEvent("stripe", "checkout.created", session.id, {
      amount: amountUsd,
      currency,
      country,
      session_id: session.id,
      payment_status: session.payment_status
    });
    if (!session.url) {
      return new Response(JSON.stringify({ ok: false, error: "No se pudo crear la sesión de pago" }), {
        status: 500,
        headers: { "content-type": "application/json" }
      });
    }
    if (acceptsJson(request)) {
      return new Response(JSON.stringify({ ok: true, provider: "stripe", sessionId: session.id, url: session.url }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    return new Response(null, {
      status: 303,
      headers: { location: session.url }
    });
  } catch (error) {
    console.error("[stripe.checkout] error", error);
    void logSecurityEvent({
      type: "payment_error",
      identifier: "stripe.checkout",
      ip: clientAddress,
      userAgent,
      detail: error?.message || "Stripe checkout error"
    });
    return new Response(JSON.stringify({ ok: false, error: "Error procesando el pago" }), {
      status: 500,
      headers: { "content-type": "application/json" }
    });
  }
};

const _page = /*#__PURE__*/Object.freeze(/*#__PURE__*/Object.defineProperty({
  __proto__: null,
  POST,
  prerender
}, Symbol.toStringTag, { value: 'Module' }));

const page = () => _page;

export { page };
