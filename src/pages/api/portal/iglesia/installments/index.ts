import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';
import { ensureUserProfile, listUserMemberships, isAdminRole } from '@lib/portalAuth';
import { readPasswordSession } from '@lib/portalPasswordSession';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  if (!supabaseAdmin) {
    return new Response(JSON.stringify({ ok: false, error: 'Supabase no configurado' }), { status: 500 });
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

  const url = new URL(request.url);
  const requestedChurch = url.searchParams.get('churchId');
  const includeAllSources = isAdmin && !requestedChurch;

  // Build Query
  let bookingQuery = supabaseAdmin
    .from('cumbre_bookings')
    .select('id, contact_name, contact_email, contact_phone, contact_church, church_id, total_amount, total_paid, status, currency')
    .order('created_at', { ascending: false })
    .limit(400);
  if (!includeAllSources) {
    bookingQuery = bookingQuery.eq('source', 'portal-iglesia');
  }

  // Apply Scope
  if (isAdmin) {
    if (requestedChurch) bookingQuery = bookingQuery.eq('church_id', requestedChurch);
  } else if (churchId && churchId.startsWith('IN:')) {
    const ids = churchId.substring(3).split(',');
    if (ids.length === 0) return new Response(JSON.stringify({ ok: true, installments: [] }), { status: 200 });
    bookingQuery = bookingQuery.in('church_id', ids);
  } else if (churchId) {
    bookingQuery = bookingQuery.eq('church_id', churchId);
  } else {
    return new Response(JSON.stringify({ ok: true, installments: [] }), { status: 200 });
  }

  const { data: bookings, error: bookingsError } = await bookingQuery;
  if (bookingsError) {
    console.error('[portal.iglesia.installments] bookings error', bookingsError);
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo cargar' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const bookingIds = (bookings || []).map((b: any) => b.id);
  if (!bookingIds.length) {
    return new Response(JSON.stringify({ ok: true, installments: [] }), {
      status: 200,
      headers: { 'content-type': 'application/json' },
    });
  }

  const { data: installments, error } = await supabaseAdmin
    .from('cumbre_installments')
    .select('id, booking_id, plan_id, installment_index, due_date, amount, currency, status, provider_reference, provider_tx_id, paid_at, created_at, booking:cumbre_bookings(id, contact_name, contact_email, contact_phone, contact_church, church_id, total_amount, total_paid, status, currency), plan:cumbre_payment_plans(id, status, provider, currency, installment_count, provider_payment_method_id, provider_subscription_id)')
    .in('booking_id', bookingIds)
    .order('due_date', { ascending: true })
    .limit(500);

  if (error) {
    console.error('[portal.iglesia.installments] list error', error);
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo cargar' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const installmentIds = (installments || []).map((row: any) => row.id);
  const reminderMap: Record<string, any> = {};
  const linkMap: Record<string, any> = {};

  if (installmentIds.length) {
    const { data: reminders } = await supabaseAdmin
      .from('cumbre_installment_reminders')
      .select('installment_id, sent_at, reminder_key, channel, error')
      .in('installment_id', installmentIds)
      .order('sent_at', { ascending: false });

    (reminders || []).forEach((reminder: any) => {
      if (!reminderMap[reminder.installment_id]) {
        reminderMap[reminder.installment_id] = reminder;
      }
    });

    const { data: links } = await supabaseAdmin
      .from('cumbre_installment_links')
      .select('installment_id, created_at, expires_at, used_at')
      .in('installment_id', installmentIds)
      .order('created_at', { ascending: false });

    (links || []).forEach((link: any) => {
      if (!linkMap[link.installment_id]) {
        linkMap[link.installment_id] = link;
      }
    });
  }

  const response = (installments || []).map((row: any) => ({
    ...row,
    last_reminder: reminderMap[row.id] || null,
    last_link: linkMap[row.id] || null,
  }));

  return new Response(JSON.stringify({ ok: true, installments: response }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
