import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';
import { readPasswordSession } from '@lib/portalPasswordSession';

const ACTIONS = new Set(['pause', 'resume', 'cancel']);

function normalizeEmail(email: string | null | undefined) {
  return (email || '').trim().toLowerCase();
}

export const POST: APIRoute = async ({ request }) => {
  if (!supabaseAdmin) {
    return new Response(JSON.stringify({ ok: false, error: 'Server Config Error' }), { status: 500 });
  }

  const user = await getUserFromRequest(request);
  const passwordSession = user ? null : readPasswordSession(request);
  if (!user && !passwordSession) {
    return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });
  }

  let body: { id?: string; action?: string };
  try {
    body = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Invalid payload' }), { status: 400 });
  }

  const subscriptionId = body.id?.toString().trim();
  const action = body.action?.toString().trim().toLowerCase();
  if (!subscriptionId || !action || !ACTIONS.has(action)) {
    return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), { status: 400 });
  }

  const sessionEmail = normalizeEmail(user?.email || passwordSession?.email);
  if (!sessionEmail) {
    return new Response(JSON.stringify({ ok: false, error: 'Email missing' }), { status: 400 });
  }

  const { data: subscription, error: subError } = await supabaseAdmin
    .from('donation_reminder_subscriptions')
    .select('id, donor_email, status, next_reminder_date')
    .eq('id', subscriptionId)
    .single();

  if (subError || !subscription) {
    return new Response(JSON.stringify({ ok: false, error: 'Subscription not found' }), { status: 404 });
  }

  const donorEmail = normalizeEmail(subscription.donor_email);
  if (!donorEmail || donorEmail !== sessionEmail) {
    return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
  }

  let nextStatus = subscription.status || 'ACTIVE';
  if (action === 'pause') nextStatus = 'PAUSED';
  if (action === 'resume') nextStatus = 'ACTIVE';
  if (action === 'cancel') nextStatus = 'CANCELLED';

  if (nextStatus === subscription.status) {
    return new Response(JSON.stringify({ ok: true, subscription }), { status: 200 });
  }

  const { data: updated, error: updateError } = await supabaseAdmin
    .from('donation_reminder_subscriptions')
    .update({ status: nextStatus, updated_at: new Date().toISOString() })
    .eq('id', subscriptionId)
    .select('id, status, next_reminder_date')
    .single();

  if (updateError || !updated) {
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo actualizar' }), { status: 500 });
  }

  return new Response(JSON.stringify({ ok: true, subscription: updated }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
