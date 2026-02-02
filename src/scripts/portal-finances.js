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
const categoriesEl = document.getElementById('finances-categories');
const issuesListEl = document.getElementById('finances-issues-list');
const issuesEmptyEl = document.getElementById('finances-issues-empty');

const DEFAULT_CATEGORIES = [
    'Diezmos',
    'Ofrendas',
    'Misiones',
    'Campus',
    'Eventos',
    'Peregrinaciones',
    'General',
    'Otros'
];

function formatCurrency(val) {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(val);
}

function escapeHtml(value) {
    return String(value ?? '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
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
    const byConcept = data.stats?.byCategory || data.stats?.byConcept || {};
    let topConcept = '-';
    let maxVal = 0;
    for (const [key, val] of Object.entries(byConcept)) {
        const numVal = Number(val) || 0;
        if (numVal > maxVal) {
            maxVal = numVal;
            topConcept = key;
        }
    }
    if (statTop) statTop.textContent = maxVal > 0 ? topConcept : '-';

    renderCategories(byConcept);

    // Table
    const txs = data.transactions || [];
    if (txs.length === 0) {
        if (emptyEl) emptyEl.classList.remove('hidden');
    } else {
        if (tableEl) tableEl.classList.remove('hidden');
        if (tbody) {
            tbody.innerHTML = txs.map(t => `
                <tr>
                    <td class="py-3 pl-2">${new Date(t.created_at).toLocaleDateString()}</td>
                    <td class="py-3 font-medium text-[#293C74]">${escapeHtml(t.concept_label || 'Aporte')}</td>
                    <td class="py-3 text-slate-500">${escapeHtml(t.donor_name || 'Anónimo')}</td>
                    <td class="py-3"><span class="px-2 py-1 rounded-full text-[10px] font-bold bg-green-100 text-green-700">${escapeHtml(t.status || 'APROBADO')}</span></td>
                    <td class="py-3 text-right font-bold pr-2">${formatCurrency(t.amount)}</td>
                </tr>
            `).join('');
        }
    }

    renderIssues(data.issues || []);
}

function renderCategories(byCategory) {
    if (!categoriesEl) return;
    const entries = Object.entries(byCategory || {});
    const finalEntries = entries.length
        ? entries
        : DEFAULT_CATEGORIES.map((label) => [label, 0]);

    categoriesEl.innerHTML = finalEntries.map(([label, value]) => `
        <div class="rounded-2xl border border-slate-100 bg-slate-50/50 p-4">
            <p class="text-[10px] uppercase tracking-widest text-slate-400">${escapeHtml(label)}</p>
            <p class="text-lg font-bold text-[#293C74] mt-2">${formatCurrency(Number(value) || 0)}</p>
        </div>
    `).join('');
}

function renderIssues(issues) {
    if (!issuesListEl || !issuesEmptyEl) return;

    if (!issues.length) {
        issuesEmptyEl.classList.remove('hidden');
        issuesListEl.innerHTML = '';
        return;
    }

    issuesEmptyEl.classList.add('hidden');

    issuesListEl.innerHTML = issues.map((issue) => {
        const statusLabel = issue.status === 'FAILED' ? 'FALLIDO' : 'PENDIENTE';
        const statusClass = issue.status === 'FAILED'
            ? 'bg-red-100 text-red-700'
            : 'bg-amber-100 text-amber-700';

        const amount = formatCurrency(issue.amount || 0);
        const name = issue.donor_name || 'Sin nombre';
        const email = issue.donor_email || '';
        const phoneRaw = issue.donor_phone || '';
        const phone = phoneRaw.toString().replace(/\D/g, '');
        const reference = issue.reference ? `Ref: ${issue.reference}` : '';
        const provider = issue.provider ? issue.provider.toString().toUpperCase() : '';
        const reason = issue.reason || 'En verificación';
        const dateLabel = issue.created_at ? new Date(issue.created_at).toLocaleDateString() : '';

        const message = `Hola ${name}, tu pago ${issue.status === 'FAILED' ? 'fue rechazado' : 'esta pendiente'} por ${amount}. ${reason ? `Motivo: ${reason}. ` : ''}${reference ? `${reference}. ` : ''}Si ya esta resuelto, ignora este mensaje.`;
        const encodedMessage = encodeURIComponent(message);
        const mailto = email
            ? `mailto:${email}?subject=${encodeURIComponent(`Pago ${statusLabel} · ${issue.concept_label || 'Aporte'}`)}&body=${encodedMessage}`
            : '';
        const whatsapp = phone && phone.length >= 8
            ? `https://wa.me/${phone}?text=${encodedMessage}`
            : '';

        const actions = [
            email ? `<a class="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:border-slate-300" href="${mailto}">Correo</a>` : '',
            whatsapp ? `<a class="px-3 py-1.5 rounded-full bg-emerald-500 text-white text-xs font-semibold hover:bg-emerald-600" href="${whatsapp}" target="_blank" rel="noreferrer">WhatsApp</a>` : '',
            `<button class="px-3 py-1.5 rounded-full border border-slate-200 text-xs font-semibold text-slate-600 hover:border-slate-300" data-copy-text="${encodedMessage}">Copiar mensaje</button>`
        ].filter(Boolean).join('');

        return `
            <div class="border border-slate-100 rounded-2xl p-4 md:p-5">
                <div class="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="px-2 py-1 rounded-full text-[10px] font-bold ${statusClass}">${statusLabel}</span>
                            ${provider ? `<span class="text-[10px] uppercase tracking-widest text-slate-400">${escapeHtml(provider)}</span>` : ''}
                        </div>
                        <p class="text-base font-semibold text-slate-800 mt-2">${escapeHtml(name)}</p>
                        <p class="text-xs text-slate-400">${[email, phoneRaw].filter(Boolean).map(escapeHtml).join(' • ')}</p>
                    </div>
                    <div class="text-left md:text-right">
                        <p class="text-sm font-bold text-[#293C74]">${amount}</p>
                        <p class="text-xs text-slate-400">${escapeHtml(reference || dateLabel)}</p>
                    </div>
                </div>
                <div class="mt-3 rounded-xl bg-slate-50 px-3 py-2 text-xs text-slate-600">
                    Motivo: ${escapeHtml(reason)}
                </div>
                <div class="mt-3 flex flex-wrap gap-2">
                    ${actions}
                </div>
            </div>
        `;
    }).join('');

    document.querySelectorAll('[data-copy-text]').forEach((button) => {
        button.addEventListener('click', async () => {
            try {
                const encoded = button.getAttribute('data-copy-text') || '';
                const text = decodeURIComponent(encoded);
                await navigator.clipboard.writeText(text);
                button.textContent = 'Copiado';
                setTimeout(() => {
                    button.textContent = 'Copiar mensaje';
                }, 1600);
            } catch (error) {
                console.error('No se pudo copiar el mensaje', error);
            }
        });
    });
}

init();
