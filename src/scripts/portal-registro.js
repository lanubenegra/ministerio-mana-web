import { createClient } from '@supabase/supabase-js';
import gsap from 'gsap';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const form = document.getElementById('register-form');
const btnSubmit = document.getElementById('btn-submit-register');
const statusEl = document.getElementById('register-status');
const starsContainer = document.getElementById('stars-container');

// Background Animation (simplified)
if (starsContainer) {
    for (let i = 0; i < 50; i++) {
        const star = document.createElement('div');
        star.classList.add('absolute', 'bg-white', 'rounded-full');
        const size = Math.random() * 2 + 1;
        star.style.width = `${size}px`;
        star.style.height = `${size}px`;
        star.style.opacity = Math.random() * 0.5 + 0.1;
        star.style.left = `${Math.random() * 100}%`;
        star.style.top = `${Math.random() * 100}%`;
        starsContainer.appendChild(star);

        gsap.to(star, {
            y: `-=${Math.random() * 100 + 50}`,
            opacity: 0,
            duration: Math.random() * 3 + 2,
            repeat: -1,
            ease: 'linear',
            delay: Math.random() * 5
        });
    }
}

form?.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!btnSubmit) return;

    // Get values
    const name = document.getElementById('reg-name').value;
    const lastname = document.getElementById('reg-lastname').value;
    const email = document.getElementById('reg-email').value;
    const password = document.getElementById('reg-password').value;

    const originalText = btnSubmit.textContent;
    btnSubmit.textContent = 'Creando cuenta...';
    btnSubmit.disabled = true;
    statusEl?.classList.add('hidden');

    try {
        const { data, error } = await supabase.auth.signUp({
            email,
            password,
            options: {
                data: {
                    first_name: name,
                    last_name: lastname,
                    full_name: `${name} ${lastname}`.trim()
                }
            }
        });

        if (error) throw error;

        if (data?.user && data.user.identities?.length === 0) {
            throw new Error('Este correo ya está registrado.');
        }

        // Success
        statusEl.classList.remove('hidden', 'bg-red-50', 'text-red-600');
        statusEl.classList.add('bg-green-50', 'text-green-600');

        if (data?.session) {
            statusEl.textContent = '¡Cuenta creada! Redirigiendo...';
            setTimeout(() => {
                window.location.href = '/portal';
            }, 1500);
        } else {
            statusEl.textContent = '¡Cuenta creada! Por favor revisa tu correo para confirmar.';
            btnSubmit.textContent = 'Verificar Correo';
        }

    } catch (err) {
        console.error(err);
        if (statusEl) {
            statusEl.classList.remove('hidden', 'bg-green-50', 'text-green-600');
            statusEl.classList.add('bg-red-50', 'text-red-800');
            statusEl.textContent = err.message || 'Error al registrarse.';
        }
        btnSubmit.textContent = originalText;
        btnSubmit.disabled = false;
    }
});
