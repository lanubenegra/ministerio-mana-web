const activationCta = document.getElementById('activation-cta');
const activationStatus = document.getElementById('activation-status');
const activateBtn = document.getElementById('btn-activar-cuenta');
const completeBtn = document.getElementById('btn-completar-registro');

const params = new URLSearchParams(window.location.search);
const bookingId = params.get('bookingId');
const token = params.get('token');
const hasBookingLink = Boolean(bookingId && token);

const registroUrl = bookingId && token
  ? `/eventos/cumbre-mundial-2026/registro?bookingId=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(token)}`
  : '/eventos/cumbre-mundial-2026';

if (completeBtn) {
  completeBtn.href = registroUrl;
}

let supabase = null;
if (hasBookingLink) {
  try {
    // Lazy init to avoid hard failure when env vars are missing.
    // eslint-disable-next-line import/no-unresolved
    const { getSupabaseBrowserClient } = await import('@lib/supabaseBrowser');
    supabase = getSupabaseBrowserClient();
  } catch (err) {
    console.error('Supabase client not available:', err);
  }
}
let bookingEmail = '';

async function fetchBookingEmail() {
  if (!bookingId || !token) return '';
  try {
    const res = await fetch(`/api/cumbre2026/booking/get?bookingId=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(token)}`);
    if (!res.ok) return '';
    const payload = await res.json();
    bookingEmail = (payload?.booking?.contact_email || '').toString().trim().toLowerCase();
    return bookingEmail;
  } catch (err) {
    console.error(err);
    return '';
  }
}

function showActivation(show = true) {
  if (!activationCta) return;
  activationCta.classList.toggle('hidden', !show);
}

function showComplete(show = true) {
  if (!completeBtn) return;
  completeBtn.classList.toggle('hidden', !show);
}

async function checkSession() {
  try {
    if (!supabase) return false;
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      showComplete(true);
      showActivation(false);
      return true;
    }
  } catch (err) {
    console.error(err);
  }
  showComplete(true);
  showActivation(true);
  return false;
}

async function sendMagicLink() {
  if (!activationStatus) return;
  activationStatus.textContent = '';
  const email = bookingEmail || (await fetchBookingEmail());
  if (!email) {
    activationStatus.textContent = 'No encontramos tu correo. Escríbenos por WhatsApp para ayudarte.';
    return;
  }
  activationStatus.textContent = 'Enviando enlace...';
  activateBtn?.setAttribute('disabled', 'disabled');
  activateBtn?.classList.add('opacity-60');
  try {
    const redirectTo = `${window.location.origin}/portal/activar?next=${encodeURIComponent(registroUrl)}`;
    const res = await fetch('/api/auth/send-link', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, kind: 'magiclink', redirectTo }),
    });
    const payload = await res.json();
    if (!res.ok || !payload?.ok) {
      throw new Error(payload?.error || 'No se pudo enviar el enlace.');
    }
    activationStatus.textContent = 'Enlace enviado. Revisa tu correo para activar tu cuenta.';
  } catch (err) {
    console.error(err);
    activationStatus.textContent = err?.message || 'No se pudo enviar el enlace.';
  } finally {
    activateBtn?.removeAttribute('disabled');
    activateBtn?.classList.remove('opacity-60');
  }
}

activateBtn?.addEventListener('click', () => {
  void sendMagicLink();
});

if (!hasBookingLink) {
  showActivation(true);
  showComplete(false);
} else {
  showComplete(true);
  showActivation(!supabase);
  void fetchBookingEmail();
  void checkSession();
}

if (supabase) {
  supabase.auth.onAuthStateChange((_event, session) => {
    if (session) {
      showComplete(true);
      showActivation(false);
    }
  });
}
