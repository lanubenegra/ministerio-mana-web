import { v as verifyStripeWebhook, g as getStripeClient } from '../../../chunks/stripe_DGPgY0he.mjs';
import { l as logSecurityEvent, a as logPaymentEvent } from '../../../chunks/securityEvents_Qegq-P8G.mjs';
export { renderers } from '../../../renderers.mjs';

const prerender = false;
async function processEvent(event) {
  const stripe = getStripeClient();
  switch (event.type) {
    case "checkout.session.completed": {
      const session = event.data.object;
      const reference = session.id;
      void logPaymentEvent("stripe", "checkout.completed", reference, {
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email ?? session.customer_email,
        payment_status: session.payment_status
      });
      break;
    }
    case "payment_intent.succeeded": {
      const intent = event.data.object;
      void logPaymentEvent("stripe", "payment_intent.succeeded", intent.id, {
        amount: intent.amount_received,
        currency: intent.currency,
        customer: intent.customer,
        charges: intent.charges?.data?.map((charge) => ({
          id: charge.id,
          status: charge.status
        }))
      });
      break;
    }
    case "payment_intent.payment_failed": {
      const intent = event.data.object;
      void logSecurityEvent({
        type: "payment_error",
        identifier: intent.id,
        detail: "Stripe payment failed",
        meta: {
          amount: intent.amount,
          currency: intent.currency,
          last_payment_error: intent.last_payment_error?.message
        }
      });
      break;
    }
    default: {
      let serialized = {};
      try {
        serialized = JSON.parse(JSON.stringify(event.data));
      } catch {
        serialized = { object: event.data.object };
      }
      void logPaymentEvent("stripe", event.type, event.id);
      break;
    }
  }
  if (event.type.startsWith("payment_intent.") && event.data.object) {
    const intent = event.data.object;
    if (intent.metadata?.checkout_session_id) {
      const session = await stripe.checkout.sessions.retrieve(intent.metadata.checkout_session_id).catch(() => null);
      if (session) {
        void logPaymentEvent("stripe", "checkout.session.synced", session.id, {
          amount_total: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status
        });
      }
    }
  }
}
const POST = async ({ request }) => {
  const payload = await request.text();
  const signature = request.headers.get("stripe-signature");
  try {
    const event = verifyStripeWebhook(payload, signature);
    await processEvent(event);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "content-type": "application/json" }
    });
  } catch (error) {
    console.error("[stripe.webhook] error", error);
    void logSecurityEvent({
      type: "webhook_invalid",
      identifier: "stripe",
      detail: error?.message || "Stripe webhook error"
    });
    return new Response(JSON.stringify({ ok: false, error: "Firma inválida o evento desconocido" }), {
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
