import type { APIRoute } from 'astro';
import { createPasswordSessionToken, buildSessionCookie } from '@lib/portalPasswordSession';
import { verifyTurnstile } from '@lib/turnstile';

function env(key: string): string | undefined {
  return import.meta.env?.[key] ?? process.env?.[key];
}

function isProduction(): boolean {
  const runtimeEnv = env('VERCEL_ENV') ?? env('NODE_ENV') ?? 'development';
  return runtimeEnv === 'production';
}

function parseEmails(raw?: string | null): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

export const POST: APIRoute = async ({ request, clientAddress }) => {
  let payload: any = {};
  try {
    payload = await request.json();
  } catch {
    return new Response(JSON.stringify({ ok: false, error: 'Payload invalido' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  const email = String(payload.email || '').trim().toLowerCase();
  const password = String(payload.password || '');
  const captchaToken = String(payload.turnstileToken || payload['cf-turnstile-response'] || '');
  if (!email || !password) {
    return new Response(JSON.stringify({ ok: false, error: 'Email y contraseña requeridos' }), {
      status: 400,
      headers: { 'content-type': 'application/json' },
    });
  }

  // Turnstile validation: Only enforce if secret is configured AND client sent a token
  // If client sends empty token, it means widget is broken/misconfigured → bypass
  const hasSecret = Boolean(env('TURNSTILE_SECRET_KEY'));
  if (isProduction() && hasSecret && captchaToken) {
    const okCaptcha = await verifyTurnstile(captchaToken, clientAddress);
    if (!okCaptcha) {
      return new Response(JSON.stringify({ ok: false, error: 'Captcha invalido' }), {
        status: 400,
        headers: { 'content-type': 'application/json' },
      });
    }
  }

  const allowed = parseEmails(env('PORTAL_SUPERADMIN_EMAILS')).has(email);
  const expected = env('PORTAL_SUPERADMIN_PASSWORD');
  if (!expected) {
    return new Response(JSON.stringify({ ok: false, error: 'Password no configurado' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  if (!allowed || password !== expected) {
    return new Response(JSON.stringify({ ok: false, error: 'Credenciales invalidas' }), {
      status: 401,
      headers: { 'content-type': 'application/json' },
    });
  }

  const token = createPasswordSessionToken(email);
  if (!token) {
    return new Response(JSON.stringify({ ok: false, error: 'No se pudo crear sesion' }), {
      status: 500,
      headers: { 'content-type': 'application/json' },
    });
  }

  return new Response(JSON.stringify({ ok: true }), {
    status: 200,
    headers: {
      'content-type': 'application/json',
      'set-cookie': buildSessionCookie(token),
    },
  });
};
