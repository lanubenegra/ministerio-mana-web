import { getSupabaseBrowserClient } from '@lib/supabaseBrowser';
import { gsap } from 'gsap';

window.addEventListener('load', () => {
  gsap.to('#login-card', { opacity: 1, y: 0, duration: 1.2, ease: 'power4.out', delay: 0.2 });

  const starsContainer = document.getElementById('stars-container');
  if (starsContainer) {
    for (let i = 0; i < 30; i += 1) {
      const star = document.createElement('div');
      star.className = 'absolute w-[2px] h-[2px] bg-white rounded-full';
      star.style.left = `${Math.random() * 100}%`;
      star.style.top = `${Math.random() * 100}%`;
      starsContainer.appendChild(star);
      gsap.to(star, { opacity: 0.2, duration: 2 + Math.random() * 3, repeat: -1, yoyo: true, delay: Math.random() * 5 });
    }
  }
});

const magicForm = document.getElementById('magic-link-form');
const passwordForm = document.getElementById('password-form');
const magicEmailInput = document.getElementById('magic-email');
const passwordEmailInput = document.getElementById('password-email');
const passwordInput = document.getElementById('login-password');
const toggleMagicBtn = document.getElementById('btn-toggle-magic');
const cancelMagicBtn = document.getElementById('btn-cancel-magic');
const togglePasswordViewBtn = document.getElementById('toggle-password-view');
const passkeyBtn = document.getElementById('btn-passkey');

const statusContainer = document.getElementById('login-status-container');
const statusEl = document.getElementById('login-status');
const statusIcon = document.getElementById('login-status-icon');
const statusWrapper = document.getElementById('login-status-wrapper');

function showStatus(msg, type = 'loading') {
  if (!statusContainer || !statusEl || !statusIcon || !statusWrapper) return;
  statusContainer.classList.remove('hidden');
  statusEl.textContent = msg;

  // Update icon
  statusIcon.className = type === 'error'
    ? 'w-2 h-2 rounded-full bg-red-500'
    : type === 'success'
      ? 'w-2 h-2 rounded-full bg-green-500'
      : 'w-2 h-2 rounded-full bg-blue-500 animate-ping';

  // Update wrapper and text styles
  if (type === 'error') {
    statusWrapper.className = 'inline-flex items-center gap-2 px-4 py-3 rounded-full bg-red-50 border border-red-200';
    statusEl.className = 'text-sm font-semibold text-red-700';
  } else if (type === 'success') {
    statusWrapper.className = 'inline-flex items-center gap-2 px-4 py-3 rounded-full bg-green-50 border border-green-200';
    statusEl.className = 'text-sm font-semibold text-green-700';
  } else {
    statusWrapper.className = 'inline-flex items-center gap-2 px-4 py-3 rounded-full bg-blue-50 border border-blue-200';
    statusEl.className = 'text-sm font-semibold text-blue-700';
  }

  gsap.from(statusContainer, { scale: 0.9, duration: 0.4, ease: 'back.out' });
}

let supabase = null;
const PORTAL_PASSWORD_MODE_KEY = 'portal_password_mode';
try {
  supabase = getSupabaseBrowserClient();
} catch (err) {
  console.error('Supabase client not available:', err);
  showStatus('El portal no está configurado. Escríbenos por WhatsApp.', 'error');
}

supabase?.auth.onAuthStateChange(async (event, session) => {
  if (event === 'SIGNED_IN' && session) {
    showStatus('¡Sesión iniciada! Entrando...', 'success');
    try { localStorage.removeItem(PORTAL_PASSWORD_MODE_KEY); } catch {}
    window.location.href = '/portal';
  }
});

toggleMagicBtn?.addEventListener('click', () => {
  passwordForm?.classList.add('hidden');
  magicForm?.classList.remove('hidden');
  if (passwordEmailInput?.value) magicEmailInput.value = passwordEmailInput.value;
  magicForm?.scrollIntoView({ behavior: 'smooth' });
});

cancelMagicBtn?.addEventListener('click', () => {
  magicForm?.classList.add('hidden');
  passwordForm?.classList.remove('hidden');
});

togglePasswordViewBtn?.addEventListener('click', () => {
  if (!passwordInput) return;
  const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
  passwordInput.setAttribute('type', type);
  togglePasswordViewBtn.classList.toggle('text-[#293C74]');
});

magicForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = magicEmailInput?.value?.trim();
  if (!email) return;

  showStatus('Enviando enlace de restablecimiento...', 'loading');
  const btn = document.getElementById('btn-submit-magic');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('opacity-50');
  }

  try {
    const redirectTo = `${window.location.origin}/portal/activar?next=${encodeURIComponent('/portal')}`;
    const res = await fetch('/api/auth/send-link', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify({ email, kind: 'recovery', redirectTo }),
    });
    const payload = await res.json();
    if (!res.ok || !payload?.ok) throw new Error(payload?.error || 'Error al enviar enlace.');

    showStatus('¡Enlace enviado! Revisa tu correo para restablecer.', 'success');
    magicEmailInput.value = '';
  } catch (err) {
    showStatus(err?.message || 'Error al enviar enlace.', 'error');
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('opacity-50');
    }
  }
});

passwordForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = passwordEmailInput?.value?.trim();
  const password = passwordInput?.value?.trim();
  if (!email || !password) return;

  showStatus('Validando contraseña...', 'loading');
  const btn = document.getElementById('btn-submit-password');
  if (btn) {
    btn.disabled = true;
    btn.classList.add('opacity-50');
  }

  try {
    if (!supabase) {
      // Fallback directly to API if Supabase client is missing
      console.warn('Supabase client missing, trying API login directly.');
      await tryApiLogin(email, password);
      return;
    }

    const { error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      console.warn('Supabase login failed, trying API fallback...', error.message);
      await tryApiLogin(email, password);
      return;
    }

    showStatus('Acceso correcto. Entrando...', 'success');
    try { localStorage.removeItem(PORTAL_PASSWORD_MODE_KEY); } catch {}
    window.location.href = '/portal';
  } catch (err) {
    console.error(err);
    showStatus('Contraseña incorrecta o usuario no encontrado.', 'error');
    if (btn) {
      btn.disabled = false;
      btn.classList.remove('opacity-50');
    }
  }
});

async function tryApiLogin(email, password) {
  const res = await fetch('/api/portal/password-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();
  if (!res.ok || !data.ok) {
    throw new Error(data.error || 'Credenciales inválidas');
  }

  showStatus('Acceso administrativo correcto. Entrando...', 'success');
  try { localStorage.setItem(PORTAL_PASSWORD_MODE_KEY, '1'); } catch {}
  // Force reload to ensure cookie is picked up
  setTimeout(() => window.location.href = '/portal', 500);
}

passkeyBtn?.addEventListener('click', async () => {
  showStatus('Verificando soporte de Passkeys...', 'loading');
  try {
    if (!supabase) {
      throw new Error('El portal no está configurado.');
    }
    if (typeof supabase.auth.signInWithSSO !== 'function') {
      throw new Error('Passkeys no configurado en esta versión.');
    }
    const { data, error } = await supabase.auth.signInWithSSO({
      domain: 'ministeriomana.com',
      options: {
        redirectTo: `${window.location.origin}/portal`,
      },
    });

    if (error) throw error;
    if (data?.url) window.location.href = data.url;
    else throw new Error('Debes configurar Passkeys en tu cuenta primero.');
  } catch (err) {
    showStatus(err?.message || 'Función Beta: Contacta soporte para activar.', 'error');
    setTimeout(() => {
      if (statusContainer) statusContainer.classList.add('hidden');
    }, 3000);
  }
});
