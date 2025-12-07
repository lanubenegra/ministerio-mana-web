import type { APIRoute } from 'astro';
import type Stripe from 'stripe';
import { verifyStripeWebhook, getStripeClient } from '@lib/stripe';
import { logPaymentEvent, logSecurityEvent } from '@lib/securityEvents';

export const prerender = false;

async function processEvent(event: Stripe.Event): Promise<void> {
  const stripe = getStripeClient();
  switch (event.type) {
    case 'checkout.session.completed': {
      const session = event.data.object as Stripe.Checkout.Session;
      const reference = session.id;
      void logPaymentEvent('stripe', 'checkout.completed', reference, {
        amount_total: session.amount_total,
        currency: session.currency,
        customer_email: session.customer_details?.email ?? session.customer_email,
        payment_status: session.payment_status,
      });
      break;
    }
    case 'payment_intent.succeeded': {
      const intent = event.data.object as Stripe.PaymentIntent;
      void logPaymentEvent('stripe', 'payment_intent.succeeded', intent.id, {
        amount: intent.amount_received,
        currency: intent.currency,
        customer: intent.customer,
        charges: intent.charges?.data?.map((charge) => ({
          id: charge.id,
          status: charge.status,
        })),
      });
      break;
    }
    case 'payment_intent.payment_failed': {
      const intent = event.data.object as Stripe.PaymentIntent;
      void logSecurityEvent({
        type: 'payment_error',
        identifier: intent.id,
        detail: 'Stripe payment failed',
        meta: {
          amount: intent.amount,
          currency: intent.currency,
          last_payment_error: intent.last_payment_error?.message,
        },
      });
      break;
    }
    default: {
      let serialized: Record<string, unknown> = {};
      try {
        serialized = JSON.parse(JSON.stringify(event.data));
      } catch {
        serialized = { object: event.data.object };
      }
      void logPaymentEvent('stripe', event.type, event.id, {
        raw: serialized,
      });
      break;
    }
  }
  if (event.type.startsWith('payment_intent.') && event.data.object) {
    const intent = event.data.object as Stripe.PaymentIntent;
    if (intent.metadata?.checkout_session_id) {
      const session = await stripe.checkout.sessions.retrieve(intent.metadata.checkout_session_id).catch(() => null);
      if (session) {
        void logPaymentEvent('stripe', 'checkout.session.synced', session.id, {
          amount_total: session.amount_total,
          currency: session.currency,
          payment_status: session.payment_status,
        });
      }
    }
  }
}

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.text();
  const signature = request.headers.get('stripe-signature');

  try {
    const event = verifyStripeWebhook(payload, signature);
    await processEvent(event);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[stripe.webhook] error', error);
    void logSecurityEvent({
      type: 'webhook_invalid',
      identifier: 'stripe',
      detail: error?.message || 'Stripe webhook error',
    });
    return new Response(JSON.stringify({ ok: false, error: 'Firma inválida o evento desconocido' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
};
