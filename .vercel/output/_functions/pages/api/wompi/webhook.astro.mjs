import { v as verifyWompiWebhook } from '../../../chunks/wompi_D8T7vsLw.mjs';
import { a as logPaymentEvent, l as logSecurityEvent } from '../../../chunks/securityEvents_Qegq-P8G.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
const POST = async ({ request }) => {
  const payload = await request.text();
  const signature = request.headers.get("x-wompi-signature");
  try {
    const valid = verifyWompiWebhook(payload, signature);
    if (!valid) {
      throw new Error("Firma Wompi inválida");
    }
    const event = JSON.parse(payload);
    const eventName = event?.event ?? "wompi.webhook";
    const reference = event?.data?.transaction?.reference ?? null;
    void logPaymentEvent("wompi", eventName, reference, event);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  } catch (error) {
    console.error("[wompi.webhook] error", error);
    void logSecurityEvent({
      type: "webhook_invalid",
      identifier: "wompi",
      detail: error?.message || "Wompi webhook error"
    });
    return new Response(JSON.stringify({ ok: false, error: "Firma inválida" }), {
      status: 400,
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
