import type { APIRoute } from 'astro';
import crypto from 'node:crypto';
import { verifyWompiWebhook } from '@lib/wompi';
import { logSecurityEvent } from '@lib/securityEvents';
import { parseReferenceBookingId, parseReferencePlanId } from '@lib/cumbre2026';
import {
  recordPayment,
  recomputeBookingTotals,
  getBookingById,
  getInstallmentByReference,
  getNextPendingInstallment,
  updateInstallment,
  addPlanPayment,
} from '@lib/cumbreStore';
import { sendCumbreEmail } from '@lib/cumbreMailer';

export const prerender = false;

function env(key: string): string | undefined {
  return import.meta.env?.[key] ?? process.env?.[key];
}

function validInternalSignature(payload: string, signature: string | null): boolean {
  const secret = env('INTERNAL_WEBHOOK_SECRET');
  if (!secret || !signature) return false;
  const expected = crypto.createHmac('sha256', secret).update(payload).digest('hex');
  if (expected.length !== signature.length) return false;
  return crypto.timingSafeEqual(Buffer.from(expected), Buffer.from(signature));
}

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.text();
  const internalSignature = request.headers.get('x-internal-signature');
  const wompiSignature = request.headers.get('x-wompi-signature');

  if (!validInternalSignature(payload, internalSignature)) {
    void logSecurityEvent({
      type: 'webhook_invalid',
      identifier: 'wompi.forwarded',
      detail: 'Firma interna invalida',
    });
    return new Response(JSON.stringify({ ok: false, error: 'Firma invalida' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  try {
    if (wompiSignature) {
      const ok = verifyWompiWebhook(payload, wompiSignature);
      if (!ok) {
        throw new Error('Firma Wompi invalida');
      }
    }

    const event = JSON.parse(payload);
    const transaction = event?.data?.transaction;
    const reference = transaction?.reference ?? null;
    const bookingId = parseReferenceBookingId(reference);
    const planId = parseReferencePlanId(reference);

    if (!bookingId && !planId) {
      return new Response(JSON.stringify({ ok: true, ignored: true }), {
        status: 200,
        headers: { 'content-type': 'application/json' },
      });
    }

    const status = transaction?.status ?? 'PENDING';
    const amountInCents = Number(transaction?.amount_in_cents || 0);
    const amount = amountInCents ? amountInCents / 100 : 0;
    const currency = transaction?.currency || 'COP';
    const providerTxId = transaction?.id ? String(transaction.id) : null;

    let installmentId: string | null = null;
    if (planId) {
      const installmentByRef = reference ? await getInstallmentByReference(reference) : null;
      const installment = installmentByRef || await getNextPendingInstallment(planId);
      if (installment) {
        installmentId = installment.id;
        await updateInstallment(installment.id, {
          status: status === 'APPROVED' ? 'PAID' : 'FAILED',
          provider_tx_id: providerTxId,
          provider_reference: reference,
          paid_at: status === 'APPROVED' ? new Date().toISOString() : null,
          attempt_count: status === 'APPROVED' ? installment.attempt_count : Number(installment.attempt_count || 0) + 1,
          last_error: status === 'APPROVED' ? null : 'Wompi payment failed',
        });
        if (status === 'APPROVED') {
          await addPlanPayment(planId, amount);
        }
      }
    }

    if (bookingId) {
      await recordPayment({
        bookingId,
        provider: 'wompi',
        providerTxId,
        reference,
        amount,
        currency,
        status,
        planId: planId ?? undefined,
        installmentId: installmentId ?? undefined,
        rawEvent: event,
      });
    }

    if (status === 'APPROVED' && bookingId) {
      const booking = await getBookingById(bookingId);
      if (booking?.contact_email) {
        await sendCumbreEmail('payment_received', {
          to: booking.contact_email,
          fullName: booking.contact_name ?? undefined,
          bookingId,
          amount,
          currency,
          totalPaid: booking.total_paid,
          totalAmount: booking.total_amount,
        });
      }
      await recomputeBookingTotals(bookingId);
    }

    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  } catch (error: any) {
    console.error('[wompi.forwarded] error', error);
    void logSecurityEvent({
      type: 'webhook_invalid',
      identifier: 'wompi.forwarded',
      detail: error?.message || 'Forwarded webhook error',
    });
    return new Response(JSON.stringify({ ok: false, error: 'Webhook invalido' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }
};
