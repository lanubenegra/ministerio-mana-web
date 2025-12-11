import { v as verifyTurnstile, e as enforceRateLimit } from '../../../chunks/rateLimit_CvI49SJz.mjs';
import { b as validateCopAmount, a as sanitizeDescription, s as safeCountry } from '../../../chunks/donations_D7W57EJc.mjs';
import { r as resolveBaseUrl } from '../../../chunks/url_B71Ml9ik.mjs';
import { b as buildWompiCheckoutUrl } from '../../../chunks/wompi_D8T7vsLw.mjs';
import { l as logSecurityEvent, a as logPaymentEvent } from '../../../chunks/securityEvents_Qegq-P8G.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
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
        identifier: "wompi.checkout",
        ip: clientAddress,
        userAgent,
        detail: "Turnstile inválido"
      });
      return new Response(JSON.stringify({ ok: false, error: "Captcha inválido" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
    const rateKey = `wompi:${clientAddress ?? "unknown"}`;
    const allowed = await enforceRateLimit(rateKey);
    if (!allowed) {
      void logSecurityEvent({
        type: "rate_limited",
        identifier: rateKey,
        ip: clientAddress,
        userAgent,
        detail: "Wompi checkout"
      });
      return new Response(JSON.stringify({ ok: false, error: "Demasiadas solicitudes. Intenta más tarde." }), {
        status: 429,
        headers: { "content-type": "application/json" }
      });
    }
    const amountInput = Number(data.get("amount") || 0);
    let amountCop;
    try {
      amountCop = validateCopAmount(amountInput);
    } catch (error) {
      return new Response(JSON.stringify({ ok: false, error: error?.message || "Monto inválido" }), {
        status: 400,
        headers: { "content-type": "application/json" }
      });
    }
    const description = sanitizeDescription(data.get("desc")?.toString(), "Donación");
    const country = safeCountry(data.get("country")?.toString()) ?? "CO";
    const baseUrl = resolveBaseUrl(request);
    const redirectUrl = `${baseUrl}/donaciones/gracias`;
    const { url, reference } = buildWompiCheckoutUrl({
      amountInCents: amountCop * 100,
      currency: "COP",
      description,
      redirectUrl,
      customerData: {
        country
      }
    });
    void logPaymentEvent("wompi", "checkout.created", reference, {
      amount: amountCop,
      currency: "COP",
      country,
      checkout_url: url
    });
    if (acceptsJson(request)) {
      return new Response(JSON.stringify({ ok: true, provider: "wompi", reference, url }), {
        status: 200,
        headers: { "content-type": "application/json" }
      });
    }
    return new Response(null, {
      status: 303,
      headers: { location: url }
    });
  } catch (error) {
    console.error("[wompi.checkout] error", error);
    void logSecurityEvent({
      type: "payment_error",
      identifier: "wompi.checkout",
      ip: clientAddress,
      userAgent,
      detail: error?.message || "Wompi checkout error"
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
