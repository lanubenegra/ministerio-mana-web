import type { APIRoute } from 'astro';
import { getUserFromRequest } from '@lib/supabaseAuth';
import { ensureUserProfile, listUserMemberships } from '@lib/portalAuth';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
  const user = await getUserFromRequest(request);
  if (!user?.email) {
    return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const profile = await ensureUserProfile(user);
  if (!profile) {
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo crear perfil' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  const memberships = await listUserMemberships(user.id);

  return new Response(JSON.stringify({
    ok: true,
    profile,
    memberships,
  }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
