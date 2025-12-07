const VERIFY_ENDPOINT = 'https://challenges.cloudflare.com/turnstile/v0/siteverify';

function getSecret(): string {
  const secret = import.meta.env?.TURNSTILE_SECRET_KEY ?? process.env?.TURNSTILE_SECRET_KEY;
  if (!secret) {
    throw new Error('TURNSTILE_SECRET_KEY no está configurado');
  }
  return secret;
}

export async function verifyTurnstile(token: string | null | undefined, remoteIp?: string): Promise<boolean> {
  if (!token) return false;
  const secret = getSecret();

  try {
    const res = await fetch(VERIFY_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: new URLSearchParams({ secret, response: token, remoteip: remoteIp ?? '' }),
    });
    if (!res.ok) return false;
    const data = await res.json();
    return Boolean(data?.success);
  } catch (err) {
    console.error('[turnstile.verify] error', err);
    return false;
  }
}
