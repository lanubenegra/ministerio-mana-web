import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';
import { ensureUserProfile, listUserMemberships, isAdminRole } from '@lib/portalAuth';
import { readPasswordSession } from '@lib/portalPasswordSession';

export const prerender = false;

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

  const user = await getUserFromRequest(request);
  if (!user?.email) {
    const passwordSession = readPasswordSession(request);
    if (!passwordSession?.email) {
      return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401 });
    }
    isAllowed = true;
    isAdmin = true;
  } else {
    // Standard User - Check Profile & Roles
    const profile = await ensureUserProfile(user);
    if (!profile) return new Response(JSON.stringify({ ok: false, error: 'Perfil no encontrado' }), { status: 403 });

    const memberships = await listUserMemberships(user.id);
    const activeMembership = memberships.find((m: any) =>
      ['church_admin', 'church_member'].includes(m?.role) && m?.status !== 'pending',
    );
    const hasChurchRole = Boolean(activeMembership);

    const role = profile.role || 'user';

    // 1. Roles allowed to view dashboard data
    const allowedRoles = ['superadmin', 'admin', 'national_pastor', 'pastor', 'local_collaborator', 'church_admin'];
    if (!allowedRoles.includes(role) && !hasChurchRole) {
      // Regular users cannot see this data
      return new Response(JSON.stringify({ ok: false, error: 'Acceso denegado a datos operativos' }), { status: 403 });
    }

    // 2. Determine Scope
    if (role === 'superadmin' || role === 'admin') {
      // Global Scope
      isAdmin = true;
      isAllowed = true;
      // Logic handled below (churchId param)
    } else if (role === 'national_pastor') {
      // Country Scope
      isAllowed = true;
      const country = profile.country;
      if (!country) return new Response(JSON.stringify({ ok: false, error: 'Sin país asignado' }), { status: 403 });

      // Find all churches in this country
      const { data: churches } = await supabaseAdmin.from('churches').select('id').eq('country', country);
      const countryChurchIds = (churches || []).map(c => c.id);

      const requestedChurch = new URL(request.url).searchParams.get('churchId');
      if (requestedChurch) {
        // Verify requested church is in country
        if (!countryChurchIds.includes(requestedChurch)) {
          return new Response(JSON.stringify({ ok: false, error: 'No autorizado para esta sede' }), { status: 403 });
        }
        churchId = requestedChurch; // Validated
      } else {
        // No specific church requested, return query for ALL in country
        // Special flag to handle "IN" query below
        churchId = `IN:${countryChurchIds.join(',')}`;
      }
    } else {
      // Local Scope (Pastor / Collaborator)
      isAllowed = true;
      churchId = profile.church_id || activeMembership?.church?.id || null; // Forced to assigned church
    }
  }

  const url = new URL(request.url);
  const requestedChurch = url.searchParams.get('churchId');
  const includeAllSources = isAdmin && !requestedChurch;

  const baseSelect = 'id, contact_name, contact_email, total_amount, total_paid, currency, status, created_at, church_id, contact_church, source';
  const extendedSelect = `${baseSelect}, payment_method, payment_status`;

  const buildQuery = (select: string) => {
    let query = supabaseAdmin
      .from('cumbre_bookings')
      .select(select)
      .order('created_at', { ascending: false })
      .limit(100);
    if (!includeAllSources) {
      query = query.eq('source', 'portal-iglesia');
    }

    if (isAdmin) {
      if (requestedChurch) query = query.eq('church_id', requestedChurch);
    } else if (churchId && churchId.startsWith('IN:')) {
      const ids = churchId.substring(3).split(',');
      if (ids.length === 0) return null;
      query = query.in('church_id', ids);
    } else if (churchId) {
      query = query.eq('church_id', churchId);
    } else {
      return null;
    }
    return query;
  };

  const primaryQuery = buildQuery(extendedSelect);
  if (!primaryQuery) {
    return new Response(JSON.stringify({ ok: true, bookings: [] }), { status: 200 });
  }

  let { data: bookings, error } = await primaryQuery;

  if (error && error.code === '42703') {
    const fallbackQuery = buildQuery(baseSelect);
    if (!fallbackQuery) {
      return new Response(JSON.stringify({ ok: true, bookings: [] }), { status: 200 });
    }
    const fallback = await fallbackQuery;
    bookings = fallback.data;
    error = fallback.error;
  }

  if (error) {
    console.error('[portal.iglesia.bookings] error', error);
    return new Response(JSON.stringify({ ok: false, error: 'Error interno' }), { status: 500 });
  }

  const enrolledBookings = (bookings || []).filter((booking: any) => {
    const totalPaid = Number(booking.total_paid || 0);
    return totalPaid > 0 || booking.status === 'DEPOSIT_OK' || booking.status === 'PAID';
  });

  // Participant Counts
  const bookingIds = enrolledBookings.map((b: any) => b.id);
  let counts: Record<string, number> = {};
  if (bookingIds.length) {
    const { data: participants } = await supabaseAdmin
      .from('cumbre_participants')
      .select('booking_id')
      .in('booking_id', bookingIds);
    counts = (participants || []).reduce((acc: any, row: any) => {
      acc[row.booking_id] = (acc[row.booking_id] || 0) + 1;
      return acc;
    }, {});
  }

  const response = enrolledBookings.map((booking: any) => {
    const paymentMethod = String(booking.payment_method || '').toLowerCase();
    const isManual =
      paymentMethod === 'cash' ||
      paymentMethod === 'manual' ||
      booking.source === 'portal-iglesia';
    return {
      ...booking,
      participant_count: counts[booking.id] || 0,
      // Helper fields for frontend
      is_paid_full: booking.status === 'PAID' || booking.total_paid >= booking.total_amount,
      payment_type: isManual ? 'Físico' : 'Online',
    };
  });

  return new Response(JSON.stringify({ ok: true, bookings: response }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
