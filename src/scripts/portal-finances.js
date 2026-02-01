import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

const statTotal = document.getElementById('stat-total');
const statTop = document.getElementById('stat-top-concept');
const loadingEl = document.getElementById('finances-loading');
const tableEl = document.getElementById('finances-table');
const emptyEl = document.getElementById('finances-empty');
const tbody = tableEl?.querySelector('tbody');

function formatCurrency(val) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
}

async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/portal/ingresar';
        return;
    }

    try {
        // Build Headers with Token
        const token = session.access_token;
        const res = await fetch('/api/portal/finances', {
            headers: { 'Authorization': `Bearer ${token}` }
        });

        if (res.status === 403) {
            alert('No tienes permisos para ver finanzas.');
            window.location.href = '/portal';
            return;
        }

        const data = await res.json();
        if (!res.ok) throw new Error(data.error || 'Error de carga');

        renderDashboard(data);

    } catch (err) {
        console.error(err);
        if (loadingEl) loadingEl.textContent = 'Error al cargar datos.';
    }
}

function renderDashboard(data) {
    if (loadingEl) loadingEl.classList.add('hidden');

    // Stats
    const total = data.stats?.total || 0;
    if (statTotal) statTotal.textContent = formatCurrency(total);

    // Top Concept
    const byConcept = data.stats?.byConcept || {};
    let topConcept = '-';
    let maxVal = 0;
    for (const [key, val] of Object.entries(byConcept)) {
        if (val > maxVal) {
            maxVal = val;
            topConcept = key;
        }
    }
    if (statTop) statTop.textContent = topConcept;

    // Table
    const txs = data.transactions || [];
    if (txs.length === 0) {
        if (emptyEl) emptyEl.classList.remove('hidden');
        return;
    }

    if (tableEl) tableEl.classList.remove('hidden');

    if (tbody) {
        tbody.innerHTML = txs.map(t => `
            <tr>
                <td class="py-3 pl-2">${new Date(t.created_at).toLocaleDateString()}</td>
                <td class="py-3 font-medium text-[#293C74]">${t.concept_label || 'Aporte'}</td>
                <td class="py-3 text-slate-500">${t.donor_name || 'Anónimo'}</td>
                <td class="py-3"><span class="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">${t.status}</span></td>
                <td class="py-3 text-right font-bold pr-2">${formatCurrency(t.amount)}</td>
            </tr>
        `).join('');
    }
}

init();
