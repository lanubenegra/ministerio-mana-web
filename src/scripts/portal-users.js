import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const tableEl = document.getElementById('users-table');
const tbody = tableEl?.querySelector('tbody');
const loadingEl = document.getElementById('users-loading');
const emptyEl = document.getElementById('users-empty');

// Modal Elements
const modal = document.getElementById('create-user-modal');
const btnOpen = document.getElementById('btn-open-create-user');
const btnCancel = document.getElementById('btn-cancel-create');
const form = document.getElementById('create-user-form');
const btnSubmit = document.getElementById('btn-submit-create');
const roleSelect = document.getElementById('user-role-select');
const passwordInput = document.getElementById('user-password-input');
const togglePasswordBtn = document.getElementById('toggle-password-user');

let currentUserRole = 'user';

// Password Toggle
togglePasswordBtn?.addEventListener('click', () => {
    const type = passwordInput.type === 'password' ? 'text' : 'password';
    passwordInput.type = type;
});

async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/portal/ingresar';
        return;
    }

    const token = session.access_token;

    // 1. Get My Profile to set UI permissions
    try {
        const res = await fetch('/api/portal/profile', { headers: { 'Authorization': `Bearer ${token}` } });
        if (res.ok) {
            const profile = await res.json();
            currentUserRole = profile.role;
            if (currentUserRole === 'admin' || currentUserRole === 'superadmin') {
                document.querySelectorAll('.admin-only').forEach(el => el.classList.remove('hidden'));
            }
        }
    } catch (e) { console.error(e); }

    // 2. Load Users
    loadUsers(token);

    // 3. Setup Events
    setupModal(token);
}

async function loadUsers(token) {
    try {
        const res = await fetch('/api/portal/admin/users/list', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 403) {
            alert('No tienes permiso para ver usuarios.');
            window.location.href = '/portal';
            return;
        }

        const data = await res.json();
        if (!data.ok) throw new Error(data.error);

        renderTable(data.users || []);

    } catch (err) {
        console.error(err);
        if (loadingEl) loadingEl.textContent = 'Error al cargar usuarios.';
    }
}

function renderTable(users) {
    if (loadingEl) loadingEl.classList.add('hidden');
    if (users.length === 0) {
        if (emptyEl) emptyEl.classList.remove('hidden');
        return;
    }

    if (tableEl) tableEl.classList.remove('hidden');

    if (tbody) {
        tbody.innerHTML = users.map(u => `
            <tr class="group hover:bg-slate-50 transition-colors">
                <td class="py-3 pl-2 font-medium text-[#293C74]">${u.first_name} ${u.last_name || ''}</td>
                <td class="py-3 text-slate-500">${u.email}</td>
                <td class="py-3">
                    <span class="px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${u.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                u.role === 'pastor' ? 'bg-blue-100 text-blue-700' :
                    u.role === 'leader' ? 'bg-teal-100 text-teal-700' : 'bg-slate-100 text-slate-600'}">
                        ${u.role}
                    </span>
                </td>
                <td class="py-3 text-slate-400 text-xs">${new Date(u.updated_at).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }
}

function setupModal(token) {
    btnOpen?.addEventListener('click', () => {
        modal?.classList.remove('hidden');
    });

    btnCancel?.addEventListener('click', () => {
        modal?.classList.add('hidden');
    });

    form?.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const body = Object.fromEntries(formData);

        const originalText = btnSubmit.textContent;
        btnSubmit.textContent = 'Creando...';
        btnSubmit.disabled = true;

        try {
            const res = await fetch('/api/portal/admin/users/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(body)
            });

            const data = await res.json();
            if (!data.ok) throw new Error(data.error || 'Error al crear');

            alert('Usuario creado exitosamente.');
            modal?.classList.add('hidden');
            form.reset();
            loadUsers(token); // Reload list

        } catch (err) {
            console.error(err);
            alert(`Error: ${err.message}`);
        } finally {
            btnSubmit.textContent = originalText;
            btnSubmit.disabled = false;
        }
    });
}

init();
