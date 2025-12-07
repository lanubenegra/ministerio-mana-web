import type { APIRoute } from 'astro';
import { verifyWompiWebhook } from '@lib/wompi';
import { logPaymentEvent, logSecurityEvent } from '@lib/securityEvents';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.text();
  const signature = request.headers.get('x-wompi-signature');

  try {
    const valid = verifyWompiWebhook(payload, signature);
    if (!valid) {
      throw new Error('Firma Wompi inválida');
    }
    const event = JSON.parse(payload);
    const eventName = event?.event ?? 'wompi.webhook';
    const reference = event?.data?.transaction?.reference ?? null;
    void logPaymentEvent('wompi', eventName, reference, event);
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[wompi.webhook] error', error);
    void logSecurityEvent({
      type: 'webhook_invalid',
      identifier: 'wompi',
      detail: error?.message || 'Wompi webhook error',
    });
    return new Response(JSON.stringify({ ok: false, error: 'Firma inválida' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
};
