import type { APIRoute } from 'astro';
import { verifyTurnstile } from '@lib/turnstile';
import { enforceRateLimit } from '@lib/rateLimit';
import { sanitizeDescription, validateUsdAmount, safeCountry } from '@lib/donations';
import { resolveBaseUrl } from '@lib/url';
import { createStripeDonationSession } from '@lib/stripe';
import { logPaymentEvent, logSecurityEvent } from '@lib/securityEvents';
import { stripeSupportedCurrencyCodes } from '@lib/geo';

export const prerender = false;

const SUPPORTED_CURRENCIES = new Set(stripeSupportedCurrencyCodes());

function acceptsJson(request: Request): boolean {
  const accept = request.headers.get('accept') || '';
  return accept.includes('application/json');
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  const userAgent = request.headers.get('user-agent') || '';
  try {
    const data = await request.formData();
    const captchaToken = data.get('cf-turnstile-response')?.toString();
    const okCaptcha = await verifyTurnstile(captchaToken, clientAddress);
    if (!okCaptcha) {
      void logSecurityEvent({
        type: 'captcha_failed',
        identifier: 'stripe.checkout',
        ip: clientAddress,
        userAgent,
        detail: 'Turnstile inválido',
      });
      return new Response(JSON.stringify({ ok: false, error: 'Captcha inválido' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const rateKey = `stripe:${clientAddress ?? 'unknown'}`;
    const allowed = await enforceRateLimit(rateKey);
    if (!allowed) {
      void logSecurityEvent({
        type: 'rate_limited',
        identifier: rateKey,
        ip: clientAddress,
        userAgent,
        detail: 'Stripe checkout',
      });
      return new Response(JSON.stringify({ ok: false, error: 'Demasiadas solicitudes. Intenta más tarde.' }), {
        status: 429,
        headers: { 'content-type': 'application/json' },
      });
    }

    const amountInput = Number(data.get('amountUsd') || 0);
    let amountUsd: number;
    try {
      amountUsd = validateUsdAmount(amountInput);
    } catch (error: any) {
      return new Response(JSON.stringify({ ok: false, error: error?.message || 'Monto inválido' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const currency = String(data.get('currency') || 'USD').toUpperCase();
    if (!SUPPORTED_CURRENCIES.has(currency)) {
      return new Response(JSON.stringify({ ok: false, error: 'Moneda no soportada' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }

    const description = sanitizeDescription(data.get('desc')?.toString(), 'Donation');
    const country = safeCountry(data.get('country')?.toString()) ?? 'UN';
    const baseUrl = resolveBaseUrl(request);
    const successUrl = (import.meta.env?.STRIPE_SUCCESS_URL ?? process.env.STRIPE_SUCCESS_URL) || `${baseUrl}/donaciones/gracias`;
    const cancelUrl = (import.meta.env?.STRIPE_CANCEL_URL ?? process.env.STRIPE_CANCEL_URL) || `${baseUrl}/donaciones`;

    const session = await createStripeDonationSession({
      amountUsd,
      currency,
      description,
      successUrl,
      cancelUrl,
      metadata: {
        country,
        source: 'donations_form',
      },
    });

    void logPaymentEvent('stripe', 'checkout.created', session.id, {
      amount: amountUsd,
      currency,
      country,
      session_id: session.id,
      payment_status: session.payment_status,
    });

    if (!session.url) {
      return new Response(JSON.stringify({ ok: false, error: 'No se pudo crear la sesión de pago' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    if (acceptsJson(request)) {
      return new Response(JSON.stringify({ ok: true, provider: 'stripe', sessionId: session.id, url: session.url }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    return new Response(null, {
      status: 303,
      headers: { location: session.url },
    });
  } catch (error: any) {
    console.error('[stripe.checkout] error', error);
    void logSecurityEvent({
      type: 'payment_error',
      identifier: 'stripe.checkout',
      ip: clientAddress,
      userAgent,
      detail: error?.message || 'Stripe checkout error',
    });
    return new Response(JSON.stringify({ ok: false, error: 'Error procesando el pago' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }
};
