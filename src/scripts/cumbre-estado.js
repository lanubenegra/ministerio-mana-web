import { getSupabaseBrowserClient } from '@lib/supabaseBrowser';

const activationCta = document.getElementById('activation-cta');
const activationStatus = document.getElementById('activation-status');
const activateBtn = document.getElementById('btn-activar-cuenta');
const completeBtn = document.getElementById('btn-completar-registro');

const params = new URLSearchParams(window.location.search);
const bookingId = params.get('bookingId');
const token = params.get('token');

const registroUrl = bookingId && token
  ? `/eventos/cumbre-mundial-2026/registro?bookingId=${encodeURIComponent(bookingId)}&token=${encodeURIComponent(token)}`
  : '/eventos/cumbre-mundial-2026';

if (completeBtn) {
  completeBtn.href = registroUrl;
}

const supabase = getSupabaseBrowserClient();
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

function showActivation() {
  activationCta?.classList.remove('hidden');
  completeBtn?.classList.add('hidden');
}

function showComplete() {
  activationCta?.classList.add('hidden');
  completeBtn?.classList.remove('hidden');
}

async function checkSession() {
  try {
    const { data } = await supabase.auth.getSession();
    if (data?.session) {
      showComplete();
      return true;
    }
  } catch (err) {
    console.error(err);
  }
  showActivation();
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
    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: { emailRedirectTo: redirectTo },
    });
    if (error) throw error;
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

if (!bookingId || !token) {
  showActivation();
} else {
  void fetchBookingEmail();
  void checkSession();
}

supabase.auth.onAuthStateChange((_event, session) => {
  if (session) {
    showComplete();
  }
});
