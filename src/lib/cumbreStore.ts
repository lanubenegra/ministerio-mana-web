import { supabaseAdmin } from './supabaseAdmin';
import { statusFromPaid, depositThreshold } from './cumbre2026';
import { logSecurityEvent } from './securityEvents';
import { sendCumbreEmail } from './cumbreMailer';

function ensureSupabase() {
  if (!supabaseAdmin) {
    throw new Error('Supabase no configurado');
  }
  return supabaseAdmin;
}

export type BookingRecord = {
  id: string;
  contact_name: string | null;
  contact_email: string | null;
  contact_phone: string | null;
  country_group: string;
  currency: string;
  total_amount: number;
  total_paid: number;
  status: string;
  deposit_threshold: number;
  token_hash: string;
};

export async function getBookingById(id: string): Promise<BookingRecord | null> {
  const supabase = ensureSupabase();
  const { data, error } = await supabase
    .from('cumbre_bookings')
    .select('*')
    .eq('id', id)
    .maybeSingle();
  if (error) {
    console.error('[cumbre.booking] load error', error);
    return null;
  }
  return data as BookingRecord | null;
}

export async function countPayments(bookingId: string): Promise<number> {
  const supabase = ensureSupabase();
  const { count, error } = await supabase
    .from('cumbre_payments')
    .select('id', { count: 'exact', head: true })
    .eq('booking_id', bookingId);
  if (error) {
    console.error('[cumbre.payments] count error', error);
    return 0;
  }
  return count ?? 0;
}

export async function recordPayment(params: {
  bookingId: string;
  provider: string;
  providerTxId: string | null;
  reference: string | null;
  amount: number;
  currency: string;
  status: string;
  rawEvent?: unknown;
}): Promise<void> {
  const supabase = ensureSupabase();

  if (params.reference) {
    const { data, error } = await supabase
      .from('cumbre_payments')
      .update({
        provider_tx_id: params.providerTxId,
        status: params.status,
        amount: params.amount,
        currency: params.currency,
        raw_event: params.rawEvent ?? null,
      })
      .eq('booking_id', params.bookingId)
      .eq('provider', params.provider)
      .eq('reference', params.reference)
      .select('id');

    if (!error && data && data.length > 0) {
      return;
    }
  }

  const { error: insertError } = await supabase
    .from('cumbre_payments')
    .insert({
      booking_id: params.bookingId,
      provider: params.provider,
      provider_tx_id: params.providerTxId,
      reference: params.reference,
      amount: params.amount,
      currency: params.currency,
      status: params.status,
      raw_event: params.rawEvent ?? null,
    });

  if (insertError) {
    console.error('[cumbre.payments] insert error', insertError);
    void logSecurityEvent({
      type: 'payment_error',
      identifier: 'cumbre.payment',
      detail: insertError.message,
    });
  }
}

export async function recomputeBookingTotals(bookingId: string): Promise<void> {
  const supabase = ensureSupabase();
  const booking = await getBookingById(bookingId);
  if (!booking) return;

  const { data: payments, error } = await supabase
    .from('cumbre_payments')
    .select('amount,status')
    .eq('booking_id', bookingId)
    .eq('status', 'APPROVED');

  if (error) {
    console.error('[cumbre.payments] sum error', error);
    return;
  }

  const totalPaid = (payments || []).reduce((sum, item) => sum + Number(item.amount || 0), 0);
  const threshold = booking.deposit_threshold || depositThreshold(Number(booking.total_amount || 0));
  const newStatus = statusFromPaid(totalPaid, Number(booking.total_amount || 0));
  const prevStatus = booking.status;

  const { error: updateError } = await supabase
    .from('cumbre_bookings')
    .update({
      total_paid: totalPaid,
      status: newStatus,
      deposit_threshold: threshold,
    })
    .eq('id', bookingId);

  if (updateError) {
    console.error('[cumbre.booking] update error', updateError);
    return;
  }

  if (booking.contact_email) {
    if (newStatus !== prevStatus && newStatus === 'DEPOSIT_OK') {
      await sendCumbreEmail('deposit_ok', {
        to: booking.contact_email,
        fullName: booking.contact_name ?? undefined,
        bookingId,
        totalPaid,
        totalAmount: Number(booking.total_amount || 0),
        currency: booking.currency,
      });
    }
    if (newStatus !== prevStatus && newStatus === 'PAID') {
      await sendCumbreEmail('paid', {
        to: booking.contact_email,
        fullName: booking.contact_name ?? undefined,
        bookingId,
        totalPaid,
        totalAmount: Number(booking.total_amount || 0),
        currency: booking.currency,
      });
    }
  }
}
