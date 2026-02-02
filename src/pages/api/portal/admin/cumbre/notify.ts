import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';
import { ensureUserProfile, isAdminRole } from '@lib/portalAuth';
import { readPasswordSession } from '@lib/portalPasswordSession';
import { sendCumbreEmail } from '@lib/cumbreMailer';
import { generateAccessToken } from '@lib/cumbre2026';
import { resolveBaseUrl } from '@lib/url';

export const prerender = false;

async function getAdminContext(request: Request) {
  const user = await getUserFromRequest(request);
  if (user?.email) {
    const profile = await ensureUserProfile(user);
    if (!profile || !isAdminRole(profile.role)) {
      return { ok: false, role: null };
    }
    return { ok: true, role: profile.role };
  }

  const passwordSession = readPasswordSession(request);
  if (!passwordSession?.email) {
    return { ok: false, role: null };
  }

  return { ok: true, role: 'superadmin' };
}

function buildMissingFields(participants: any[]) {
  const missing: string[] = [];
  if (!participants.length) {
    missing.push('Participantes');
    return missing;
  }
  if (participants.some((p) => !p.document_number)) {
    missing.push('Documento');
  }
  if (participants.some((p) => !p.birthdate)) {
    missing.push('Fecha de nacimiento');
  }
  if (participants.some((p) => !p.gender)) {
    missing.push('Género');
  }
  return missing;
}

export const POST: APIRoute = async ({ request }) => {
  if (!supabaseAdmin) {
    return new Response(JSON.stringify({ ok: false, error: 'Supabase no configurado' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const ctx = await getAdminContext(request);
  if (!ctx.ok) {
    return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const payload = await request.json().catch(() => null);
  if (!payload?.bookingId || !payload?.kind) {
    return new Response(JSON.stringify({ ok: false, error: 'Datos incompletos' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const bookingId = String(payload.bookingId);
  const kind = String(payload.kind);
  if (!['registration_incomplete', 'payment_pending'].includes(kind)) {
    return new Response(JSON.stringify({ ok: false, error: 'Tipo de correo no soportado' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const { data: booking, error } = await supabaseAdmin
    .from('cumbre_bookings')
    .select('id, contact_name, contact_email, total_amount, total_paid, currency, status')
    .eq('id', bookingId)
    .maybeSingle();

  if (error || !booking) {
    return new Response(JSON.stringify({ ok: false, error: 'Reserva no encontrada' }), {
      status: 404,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!booking.contact_email) {
    return new Response(JSON.stringify({ ok: false, error: 'Reserva sin email' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (kind === 'registration_incomplete') {
    const { data: participants } = await supabaseAdmin
      .from('cumbre_participants')
      .select('id, booking_id, document_number, birthdate, gender')
      .eq('booking_id', bookingId);
    const missingFields = buildMissingFields(participants || []);

    const tokenPair = generateAccessToken();
    const { error: tokenError } = await supabaseAdmin
      .from('cumbre_bookings')
      .update({
        token_hash: tokenPair.hash,
        updated_at: new Date().toISOString(),
      })
      .eq('id', bookingId);

    if (tokenError) {
      console.error('[portal.admin.cumbre.notify] token error', tokenError);
      return new Response(JSON.stringify({ ok: false, error: 'No se pudo preparar el enlace' }), {
        status: 500,
        headers: { 'content-type': 'application/json' },
      });
    }

    const baseUrl = resolveBaseUrl(request);
    const ctaUrl = `${baseUrl}/eventos/cumbre-mundial-2026/registro?bookingId=${bookingId}&token=${tokenPair.token}`;

    await sendCumbreEmail('registration_incomplete', {
      to: booking.contact_email,
      fullName: booking.contact_name || '',
      bookingId: booking.id,
      totalAmount: booking.total_amount,
      totalPaid: booking.total_paid,
      currency: booking.currency,
      missingFields,
      ctaUrl,
      ctaLabel: 'Completar registro',
    });
  }

  if (kind === 'payment_pending') {
    const { data: payment } = await supabaseAdmin
      .from('cumbre_payments')
      .select('amount, currency, status, provider')
      .eq('booking_id', bookingId)
      .eq('status', 'PENDING')
      .order('created_at', { ascending: false })
      .limit(1)
      .maybeSingle();

    const baseUrl = resolveBaseUrl(request);
    await sendCumbreEmail('payment_pending', {
      to: booking.contact_email,
      fullName: booking.contact_name || '',
      bookingId: booking.id,
      amount: payment?.amount,
      currency: payment?.currency || booking.currency,
      totalAmount: booking.total_amount,
      totalPaid: booking.total_paid,
      ctaUrl: `${baseUrl}/eventos/cumbre-mundial-2026`,
      ctaLabel: 'Ver detalles',
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
