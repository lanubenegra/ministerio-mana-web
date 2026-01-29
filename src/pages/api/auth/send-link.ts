import type { APIRoute } from 'astro';
import { sendAuthLink } from '@lib/authMailer';
import { resolveBaseUrl } from '@lib/url';

export const prerender = false;

const ALLOWED_TYPES = new Set(['invite', 'magiclink', 'recovery']);

export const POST: APIRoute = async ({ request }) => {
  const payload = await request.json().catch(() => null);
  const email = String(payload?.email || '').trim().toLowerCase();
  const kind = String(payload?.kind || payload?.type || '').trim();
  if (!email || !kind || !ALLOWED_TYPES.has(kind)) {
    return new Response(JSON.stringify({ ok: false, error: 'Datos incompletos' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const baseUrl = resolveBaseUrl(request);
  let redirectTo = payload?.redirectTo ? String(payload.redirectTo) : '';
  if (redirectTo) {
    try {
      const target = new URL(redirectTo, baseUrl);
      if (target.origin !== new URL(baseUrl).origin) {
        redirectTo = baseUrl;
      } else {
        redirectTo = target.toString();
      }
    } catch {
      redirectTo = baseUrl;
    }
  } else {
    redirectTo = baseUrl;
  }

  let result;
  try {
    result = await sendAuthLink({
      kind: kind as 'invite' | 'magiclink' | 'recovery',
      email,
      redirectTo,
    });
  } catch (error: any) {
    console.error('[auth.send-link] unexpected error', {
      email,
      kind,
      redirectTo,
      message: error?.message || String(error),
    });
    return new Response(JSON.stringify({ ok: false, error: 'Error interno' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!result.ok) {
    console.error('[auth.send-link] failed', {
      email,
      kind,
      redirectTo,
      method: result.method,
      error: result.error,
    });
    return new Response(JSON.stringify({ ok: false, error: result.error || 'No se pudo enviar' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true, method: result.method }), {
    status: 200,
    headers: { 'content-type': 'application/json' },
  });
};
