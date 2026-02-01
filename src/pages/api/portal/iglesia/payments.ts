import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';
import { ensureUserProfile, listUserMemberships, isAdminRole } from '@lib/portalAuth';
import { readPasswordSession } from '@lib/portalPasswordSession';

export const prerender = false;

function extractMethod(raw: any): string {
  if (!raw || typeof raw !== 'object') return '';
  return (
    raw.payment_method ||
    raw.payment_method_type ||
    raw.method ||
    (Array.isArray(raw.payment_method_types) ? raw.payment_method_types[0] : '') ||
    ''
  );
}

export const GET: APIRoute = async ({ request }) => {
  if (!supabaseAdmin) {
    return new Response(JSON.stringify({ ok: false, error: 'Supabase no configurado' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  let isAllowed = false;
  let isAdmin = false;
  let churchId: string | null = null;
  let profile: any = null;

  const user = await getUserFromRequest(request);
  if (!user?.email) {
    const passwordSession = readPasswordSession(request);
    if (!passwordSession?.email) {
      return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401 });
    }
    isAllowed = true;
    isAdmin = true;
  } else {
    // Check Profile & Roles with strict 403 for regular users
    profile = await ensureUserProfile(user);
    if (!profile) return new Response(JSON.stringify({ ok: false, error: 'Perfil no encontrado' }), { status: 403 });

    const role = profile.role || 'user';
    const allowedRoles = ['superadmin', 'admin', 'national_pastor', 'pastor', 'local_collaborator', 'church_admin'];

    if (!allowedRoles.includes(role)) {
      return new Response(JSON.stringify({ ok: false, error: 'Acceso denegado a datos operativos' }), { status: 403 });
    }

    if (role === 'superadmin' || role === 'admin') {
      isAdmin = true;
      isAllowed = true;
    } else if (role === 'national_pastor') {
      isAllowed = true;
      const country = profile.country;
      if (!country) return new Response(JSON.stringify({ ok: false, error: 'Sin país asignado' }), { status: 403 });

      const { data: churches } = await supabaseAdmin.from('churches').select('id').eq('country', country);
      const countryChurchIds = (churches || []).map(c => c.id);

      const requestedChurch = new URL(request.url).searchParams.get('churchId');
      if (requestedChurch) {
        if (!countryChurchIds.includes(requestedChurch)) return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 403 });
        churchId = requestedChurch;
      } else {
        churchId = `IN:${countryChurchIds.join(',')}`;
      }
    } else {
      isAllowed = true;
      churchId = profile.church_id;
    }
  }

  // Build Query
  let bookingQuery = supabaseAdmin
    .from('cumbre_bookings')
    .select('id, contact_name, contact_email, contact_phone, contact_church, church_id, total_amount, total_paid, status, currency')
    .eq('source', 'portal-iglesia')
    .order('created_at', { ascending: false })
    .limit(200);

  // Apply Scope
  if (isAdmin) {
    const requestedChurch = new URL(request.url).searchParams.get('churchId');
    if (requestedChurch) bookingQuery = bookingQuery.eq('church_id', requestedChurch);
  } else if (churchId && churchId.startsWith('IN:')) {
    const ids = churchId.substring(3).split(',');
    if (ids.length === 0) return new Response(JSON.stringify({ ok: true, payments: [] }), { status: 200 });
    bookingQuery = bookingQuery.in('church_id', ids);
  } else if (churchId) {
    bookingQuery = bookingQuery.eq('church_id', churchId);
  } else {
    return new Response(JSON.stringify({ ok: true, payments: [] }), { status: 200 });
  }

  const { data: bookings, error: bookingsError } = await bookingQuery;
  if (bookingsError) {
    console.error('[portal.iglesia.payments] bookings error', bookingsError);
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo cargar' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const bookingIds = (bookings || []).map((b: any) => b.id);
  if (!bookingIds.length) {
    return new Response(JSON.stringify({ ok: true, payments: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  const { data: payments, error: paymentsError } = await supabaseAdmin
    .from('cumbre_payments')
    .select('id, booking_id, provider, provider_tx_id, reference, amount, currency, status, raw_event, created_at, installment_id')
    .in('booking_id', bookingIds)
    .order('created_at', { ascending: false });

  if (paymentsError) {
    console.error('[portal.iglesia.payments] payments error', paymentsError);
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo cargar' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const bookingMap = new Map<string, any>();
  (bookings || []).forEach((booking: any) => {
    bookingMap.set(booking.id, booking);
  });

  const response = (payments || []).map((payment: any) => ({
    ...payment,
    method: extractMethod(payment.raw_event),
    booking: bookingMap.get(payment.booking_id) || null,
  }));

  return new Response(JSON.stringify({ ok: true, payments: response }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
