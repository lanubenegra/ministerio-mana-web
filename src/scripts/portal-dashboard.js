import { getSupabaseBrowserClient } from '@lib/supabaseBrowser';
import { gsap } from 'gsap';

const loadingEl = document.getElementById('account-loading');
const errorEl = document.getElementById('account-error');
const contentEl = document.getElementById('account-content');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileRole = document.getElementById('profile-role');
const profilePhone = document.getElementById('profile-phone');
const profileCity = document.getElementById('profile-city');
const profileCountry = document.getElementById('profile-country');
const profileAffiliation = document.getElementById('profile-affiliation');
const profileChurchWrapper = document.getElementById('profile-church-wrapper');
const profileChurchName = document.getElementById('profile-church-name');
const profileStatus = document.getElementById('profile-status');
const welcomeName = document.getElementById('welcome-name');

// Stats
const statTotalPaid = document.getElementById('stat-total-paid');
const statNextDue = document.getElementById('stat-next-due');
const planHighlight = document.getElementById('plan-highlight');
const highlightAmount = document.getElementById('highlight-amount');
const highlightDate = document.getElementById('highlight-date');

const bookingsList = document.getElementById('bookings-list');
const bookingsEmpty = document.getElementById('bookings-empty');
const plansList = document.getElementById('plans-list');
const plansEmpty = document.getElementById('plans-empty');
const paymentsTable = document.getElementById('payments-table');
const paymentsEmpty = document.getElementById('payments-empty');
const churchMembershipsEmpty = document.getElementById('church-memberships-empty');
const churchMembershipsList = document.getElementById('church-memberships-list');
const churchForm = document.getElementById('church-manual-form');
const churchFormStatus = document.getElementById('church-form-status');
const churchBookingsEmpty = document.getElementById('church-bookings-empty');
const churchBookingsList = document.getElementById('church-bookings-list');
const participantsList = document.getElementById('participants-list');
const addParticipantBtn = document.getElementById('btn-add-participant');
const inviteCard = document.getElementById('church-invite-card');
const inviteEmail = document.getElementById('church-invite-email');
const inviteRole = document.getElementById('church-invite-role');
const inviteStatus = document.getElementById('church-invite-status');
const inviteBtn = document.getElementById('church-invite-btn');
const inviteChurchWrapper = document.getElementById('church-invite-church-wrapper');
const inviteChurchInput = document.getElementById('church-invite-church');
const iglesiaNavLabel = document.getElementById('nav-iglesia-label');
const iglesiaTitle = document.getElementById('iglesia-title');
const iglesiaSubtitle = document.getElementById('iglesia-subtitle');
const churchMembersEmpty = document.getElementById('church-members-empty');
const churchMembersList = document.getElementById('church-members-list');
const adminUsersCard = document.getElementById('admin-users-card');
const adminInviteEmail = document.getElementById('admin-invite-email');
const adminInviteName = document.getElementById('admin-invite-name');
const adminInviteRole = document.getElementById('admin-invite-role');
const adminInviteChurchRole = document.getElementById('admin-invite-church-role');
const adminInviteChurch = document.getElementById('admin-invite-church');
const adminInviteStatus = document.getElementById('admin-invite-status');
const adminInviteBtn = document.getElementById('admin-invite-btn');
const adminUsersEmpty = document.getElementById('admin-users-empty');
const adminUsersList = document.getElementById('admin-users-list');

// UI Helpers
const navLinks = document.querySelectorAll('.nav-link');
const tabContents = document.querySelectorAll('.tab-content');
const logoutBtn = document.getElementById('btn-logout');
const saveProfileBtn = document.getElementById('btn-save-profile');
const onboardingModal = document.getElementById('onboarding-modal');
const onboardingForm = document.getElementById('onboarding-form');
const onboardingStatus = document.getElementById('onboarding-status');
const onboardName = document.getElementById('onboard-name');
const onboardPhone = document.getElementById('onboard-phone');
const onboardCity = document.getElementById('onboard-city');
const onboardCountry = document.getElementById('onboard-country');
const onboardAffiliation = document.getElementById('onboard-affiliation');
const onboardChurchWrapper = document.getElementById('onboard-church-wrapper');
const onboardChurchName = document.getElementById('onboard-church-name');

const supabase = getSupabaseBrowserClient();
let portalProfile = null;
let portalMemberships = [];
let authMode = 'supabase';
let churchParticipantsCount = 0;
let portalAuthHeaders = {};
let portalIsAdmin = false;
let portalIsSuperadmin = false;

function formatCurrency(value, currency) {
  if (!currency) return value;
  if (currency === 'COP') {
    return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', maximumFractionDigits: 0 }).format(value || 0);
  }
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 }).format(value || 0);
}

function formatDate(value) {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleDateString('es-CO', { day: '2-digit', month: 'short', year: 'numeric' });
}

// Tabs Navigation
navLinks.forEach(link => {
  link.addEventListener('click', () => {
    const targetTab = link.dataset.tab;
    switchTab(targetTab);
  });
});

document.querySelectorAll('[data-tab-trigger]').forEach(btn => {
   btn.addEventListener('click', () => {
      switchTab(btn.dataset.tabTrigger);
   });
});

function switchTab(tabId) {
  // Update links
  navLinks.forEach(l => l.classList.remove('active'));
  document.querySelector(`[data-tab="${tabId}"]`)?.classList.add('active');

  // Update contents with GSAP
  tabContents.forEach(content => {
    if (content.id === `tab-${tabId}`) {
      content.classList.remove('hidden');
      gsap.fromTo(content, { opacity: 0, x: 20 }, { opacity: 1, x: 0, duration: 0.6, ease: 'power2.out' });
    } else {
      content.classList.add('hidden');
    }
  });
}

async function loadAccount() {
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    let token = sessionData.session?.access_token;
    let headers = {};
    if (token) {
      headers = { Authorization: `Bearer ${token}` };
      portalAuthHeaders = headers;
    } else {
      const fallbackRes = await fetch('/api/portal/password-session');
      if (!fallbackRes.ok) {
        window.location.href = '/portal/ingresar';
        return;
      }
      const fallback = await fallbackRes.json();
      if (!fallback.ok) {
        window.location.href = '/portal/ingresar';
        return;
      }
      authMode = 'password';
    }

    const sessionRes = await fetch('/api/portal/session', { headers });
    const sessionPayload = await sessionRes.json();
    if (!sessionRes.ok || !sessionPayload.ok) throw new Error(sessionPayload.error || 'No se pudo cargar el perfil');

    portalProfile = sessionPayload.profile || {};
    portalMemberships = sessionPayload.memberships || [];
    portalIsAdmin = portalProfile?.role === 'admin' || portalProfile?.role === 'superadmin';
    portalIsSuperadmin = portalProfile?.role === 'superadmin';
    const hasChurchRole = (portalMemberships || []).some(
      (membership) => ['church_admin', 'church_member'].includes(membership?.role) && membership?.status !== 'pending',
    );
    const hasChurchAccess = portalIsAdmin || hasChurchRole;

    const { data: userData } = token ? await supabase.auth.getUser() : { data: { user: null } };
    const user = userData?.user;

    let payload = {
      ok: true,
      user: {
        fullName: portalProfile?.full_name || user?.user_metadata?.full_name || portalProfile?.email || '',
        email: portalProfile?.email || user?.email || '',
      },
      bookings: [],
      plans: [],
      payments: [],
    };

    if (token) {
      const res = await fetch('/api/cuenta/resumen', { headers });
      const resPayload = await res.json();
      if (!res.ok || !resPayload.ok) throw new Error(resPayload.error || 'No se pudo cargar');
      payload = resPayload;
    }

    const activeUser = payload.user || {};
    const name = activeUser.fullName || user?.user_metadata?.full_name || 'Usuario';
    profileName.value = name;
    welcomeName.textContent = name.split(' ')[0];
    profileEmail.value = activeUser.email || user?.email || '';
    if (profileRole) profileRole.value = portalProfile?.role || 'user';
    profilePhone.value = portalProfile.phone || '';
    profileCity.value = portalProfile.city || '';
    profileCountry.value = portalProfile.country || '';
    profileAffiliation.value = portalProfile.affiliation_type || '';
    profileChurchName.value = portalProfile.church_name || '';
    toggleChurchField(profileAffiliation.value);

    if (portalProfile?.role === 'admin' || portalProfile?.role === 'superadmin') {
      if (iglesiaNavLabel) iglesiaNavLabel.textContent = 'Iglesias';
      if (iglesiaTitle) iglesiaTitle.textContent = 'Iglesias';
      if (iglesiaSubtitle) iglesiaSubtitle.textContent = 'Panel general para gestión de sedes y registros físicos.';
    }

    // Calculations for highlights
    let totalPaidAll = 0;
    payload.bookings?.forEach(b => totalPaidAll += (b.total_paid || 0));
    statTotalPaid.textContent = formatCurrency(totalPaidAll, payload.bookings?.[0]?.currency);

    const activePlan = payload.plans?.find(p => p.status === 'ACTIVE');
    if (activePlan) {
       statNextDue.textContent = formatDate(activePlan.next_due_date);
       planHighlight.classList.remove('hidden');
       highlightAmount.textContent = formatCurrency(activePlan.installment_amount, activePlan.currency);
       highlightDate.textContent = formatDate(activePlan.next_due_date);
    }

    renderBookings(payload.bookings || []);
    renderPlans(payload.plans || [], payload.bookings || []);
    renderPayments(payload.payments || []);
    renderMemberships(portalMemberships);
    if (hasChurchAccess) {
      await loadChurchBookings(headers);
      await loadChurchMembers(headers);
    }
    await loadAdminUsers(headers);
    setupInviteAccess();
    initAdminInvite();
    await loadChurchDraft();

    if (authMode === 'password') {
      if (onboardingModal) onboardingModal.classList.add('hidden');
      if (saveProfileBtn) {
        saveProfileBtn.disabled = true;
        saveProfileBtn.classList.add('opacity-40', 'cursor-not-allowed');
      }
    } else if (!portalProfile?.full_name || !portalProfile?.affiliation_type) {
      showOnboarding();
    }

    loadingEl.classList.add('hidden');
    contentEl.classList.remove('hidden');
    gsap.from(contentEl, { opacity: 0, y: 30, duration: 1, ease: 'expo.out' });
  } catch (err) {
    console.error(err);
    loadingEl.classList.add('hidden');
    errorEl.classList.remove('hidden');
  }
}

function setupInviteAccess() {
  if (!inviteCard) return;
  const profileRole = portalProfile?.role || 'user';
  const membershipRoles = (portalMemberships || []).map((m) => m?.role);
  const canInvite = profileRole === 'admin' || profileRole === 'superadmin' || membershipRoles.includes('church_admin');
  if (!canInvite) {
    inviteCard.classList.add('hidden');
    return;
  }
  inviteCard.classList.remove('hidden');
  if (profileRole === 'admin' || profileRole === 'superadmin') {
    inviteChurchWrapper?.classList.remove('hidden');
  } else {
    inviteChurchWrapper?.classList.add('hidden');
    if (inviteRole) {
      inviteRole.value = 'church_member';
      inviteRole.querySelector('option[value="church_admin"]')?.setAttribute('disabled', 'disabled');
    }
  }
}

function buildParticipantRow(data = {}) {
  churchParticipantsCount += 1;
  const row = document.createElement('div');
  row.className = 'rounded-2xl border border-slate-200 bg-white p-4 space-y-3';
  row.innerHTML = `
    <div class="flex items-center justify-between">
      <p class="text-xs font-bold text-[#293C74]">Persona ${churchParticipantsCount}</p>
      <button type="button" class="text-xs font-bold text-red-500 hover:underline" data-action="remove">Quitar</button>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <input type="text" data-field="fullName" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#293C74] focus:border-[#293C74] focus:ring-1 focus:ring-[#293C74] outline-none transition-all font-medium" placeholder="Nombre completo" value="${data.fullName || ''}">
      <input type="number" min="0" data-field="age" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#293C74] focus:border-[#293C74] focus:ring-1 focus:ring-[#293C74] outline-none transition-all font-medium" placeholder="Edad" value="${data.age || ''}">
    </div>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-3">
      <select data-field="lodging" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#293C74] focus:border-[#293C74] focus:ring-1 focus:ring-[#293C74] outline-none transition-all font-medium">
        <option value="yes">Con alojamiento</option>
        <option value="no">Sin alojamiento</option>
      </select>
      <select data-field="menuType" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#293C74] focus:border-[#293C74] focus:ring-1 focus:ring-[#293C74] outline-none transition-all font-medium">
        <option value="">Tipo de menú</option>
        <option value="TRADICIONAL">Menú tradicional</option>
        <option value="VEGETARIANO">Menú vegetariano</option>
      </select>
      <input type="text" data-field="relationship" class="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-[#293C74] focus:border-[#293C74] focus:ring-1 focus:ring-[#293C74] outline-none transition-all font-medium" placeholder="Relación (ej: Hijo/a)" value="${data.relationship || ''}">
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div class="grid grid-cols-[110px_1fr] gap-2">
        <select data-field="documentType" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-[#293C74] focus:border-[#293C74] focus:ring-1 focus:ring-[#293C74] outline-none transition-all font-medium">
          <option value="CC">CC</option>
          <option value="TI">TI</option>
          <option value="CE">CE</option>
          <option value="PASSPORT">Pasaporte</option>
        </select>
        <input type="text" data-field="documentNumber" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-[#293C74] focus:border-[#293C74] focus:ring-1 focus:ring-[#293C74] outline-none transition-all font-medium" placeholder="Documento" value="${data.documentNumber || ''}">
      </div>
      <div class="grid grid-cols-2 gap-2">
        <input type="date" data-field="birthdate" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-[#293C74] focus:border-[#293C74] focus:ring-1 focus:ring-[#293C74] outline-none transition-all font-medium" value="${data.birthdate || ''}">
        <select data-field="gender" class="bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-[#293C74] focus:border-[#293C74] focus:ring-1 focus:ring-[#293C74] outline-none transition-all font-medium">
          <option value="">Género</option>
          <option value="M">Masculino</option>
          <option value="F">Femenino</option>
        </select>
      </div>
    </div>
  `;
  const removeBtn = row.querySelector('[data-action="remove"]');
  removeBtn.addEventListener('click', () => {
    row.remove();
  });
  return row;
}

function collectParticipants() {
  const participants = [];
  const rows = participantsList?.querySelectorAll('[data-field]') ? participantsList.querySelectorAll('.rounded-2xl') : [];
  rows.forEach((row) => {
    const getValue = (field) => row.querySelector(`[data-field="${field}"]`)?.value?.toString().trim() || '';
    const ageValue = Number(getValue('age') || 0);
    participants.push({
      fullName: getValue('fullName'),
      age: ageValue,
      lodging: getValue('lodging'),
      menuType: getValue('menuType'),
      relationship: getValue('relationship'),
      documentType: getValue('documentType'),
      documentNumber: getValue('documentNumber'),
      birthdate: getValue('birthdate'),
      gender: getValue('gender'),
    });
  });
  return participants.filter((p) => p.fullName);
}

async function loadChurchBookings(headers = {}) {
  if (!churchBookingsList || !churchBookingsEmpty) return;
  try {
    const res = await fetch('/api/portal/iglesia/bookings', { headers });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo cargar');
    const bookings = payload.bookings || [];
    if (!bookings.length) {
      churchBookingsEmpty.classList.remove('hidden');
      churchBookingsList.classList.add('hidden');
      return;
    }
    churchBookingsEmpty.classList.add('hidden');
    churchBookingsList.classList.remove('hidden');
    churchBookingsList.innerHTML = '';
    bookings.forEach((item) => {
      const card = document.createElement('div');
      card.className = 'rounded-2xl border border-slate-200 bg-slate-50/70 p-4';
      const churchLabel = item.contact_church ? `<p class="text-[11px] text-slate-400 font-semibold uppercase tracking-widest">${item.contact_church}</p>` : '';
      card.innerHTML = `
        <div class="flex items-center justify-between gap-4">
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Reserva</p>
            ${churchLabel}
            <p class="text-sm font-bold text-[#293C74]">#${item.reference || item.id?.slice(0, 8).toUpperCase()}</p>
            <p class="text-xs text-slate-500">${item.contact_name || item.contact_email || ''}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pagado</p>
            <p class="text-sm font-bold text-[#293C74]">${formatCurrency(item.total_paid, item.currency)}</p>
            <p class="text-xs text-slate-500">Total ${formatCurrency(item.total_amount, item.currency)}</p>
          </div>
        </div>
        <div class="mt-3 flex items-center justify-between text-xs text-slate-500">
          <span>${item.participant_count || 0} participantes</span>
          <span>${item.status || 'PENDING'}</span>
        </div>
      `;
      churchBookingsList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadChurchMembers(headers = {}) {
  if (!churchMembersList || !churchMembersEmpty) return;
  try {
    const res = await fetch('/api/portal/iglesia/members', { headers });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo cargar');
    const members = payload.members || [];
    if (!members.length) {
      churchMembersEmpty.classList.remove('hidden');
      churchMembersList.classList.add('hidden');
      return;
    }
    churchMembersEmpty.classList.add('hidden');
    churchMembersList.classList.remove('hidden');
    churchMembersList.innerHTML = '';
    members.forEach((member) => {
      const card = document.createElement('div');
      const profile = member.profile || {};
      card.className = 'rounded-2xl border border-slate-200 bg-white px-4 py-3';
      card.innerHTML = `
        <div class="flex items-center justify-between gap-3">
          <div>
            <p class="text-sm font-bold text-[#293C74]">${profile.full_name || profile.email || 'Usuario'}</p>
            <p class="text-xs text-slate-500">${profile.email || ''}</p>
          </div>
          <div class="text-right">
            <p class="text-[10px] uppercase tracking-widest text-slate-400 font-bold">${member.role}</p>
            <p class="text-[10px] text-slate-400">${member.status}</p>
          </div>
        </div>
      `;
      churchMembersList.appendChild(card);
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadAdminUsers(headers = {}) {
  if (!adminUsersCard) return;
  if (!portalIsAdmin) {
    adminUsersCard.classList.add('hidden');
    return;
  }
  adminUsersCard.classList.remove('hidden');

  try {
    const res = await fetch('/api/portal/admin/users', { headers });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo cargar');
    renderAdminUsers(payload.users || []);
  } catch (err) {
    console.error(err);
    if (adminUsersEmpty) adminUsersEmpty.classList.remove('hidden');
  }
}

function renderAdminUsers(users) {
  if (!adminUsersList || !adminUsersEmpty) return;
  adminUsersList.innerHTML = '';
  if (!users.length) {
    adminUsersEmpty.classList.remove('hidden');
    adminUsersList.classList.add('hidden');
    return;
  }
  adminUsersEmpty.classList.add('hidden');
  adminUsersList.classList.remove('hidden');

  users.forEach((user) => {
    const rolesLabel = (user.memberships || [])
      .map((m) => `${m.role}${m.church?.name ? ` · ${m.church.name}` : ''}`)
      .join(' | ');
    const card = document.createElement('div');
    card.className = 'rounded-2xl border border-slate-200 bg-slate-50/80 p-4 space-y-3';
    const roleSelect = portalIsSuperadmin
      ? `<select data-action="role" data-user="${user.user_id}" class="bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-bold text-[#293C74]">
          <option value="user" ${user.role === 'user' ? 'selected' : ''}>Usuario</option>
          <option value="admin" ${user.role === 'admin' ? 'selected' : ''}>Admin</option>
          <option value="superadmin" ${user.role === 'superadmin' ? 'selected' : ''}>Superadmin</option>
        </select>`
      : `<span class="text-xs font-bold text-[#293C74]">${user.role}</span>`;
    card.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <div>
          <p class="text-sm font-bold text-[#293C74]">${user.full_name || user.email}</p>
          <p class="text-xs text-slate-500">${user.email}</p>
          <p class="text-[10px] text-slate-400 mt-1">${rolesLabel || 'Sin rol de iglesia'}</p>
        </div>
        <div class="flex items-center gap-2">
          ${roleSelect}
          <button data-action="reset" data-email="${user.email}" class="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#293C74] hover:bg-slate-100">
            Reset contraseña
          </button>
        </div>
      </div>
    `;
    adminUsersList.appendChild(card);
  });
}

function initAdminInvite() {
  if (!adminInviteBtn || !adminInviteEmail || !adminInviteRole) return;
  if (!portalIsAdmin) return;

  if (!portalIsSuperadmin && adminInviteRole) {
    adminInviteRole.querySelector('option[value="admin"]')?.setAttribute('disabled', 'disabled');
    adminInviteRole.querySelector('option[value="superadmin"]')?.setAttribute('disabled', 'disabled');
  }

  adminInviteBtn.addEventListener('click', async () => {
    if (!adminInviteStatus) return;
    adminInviteStatus.textContent = 'Enviando...';
    try {
      const payload = {
        email: adminInviteEmail.value.trim(),
        fullName: adminInviteName?.value?.trim() || '',
        role: adminInviteRole.value,
        churchRole: adminInviteChurchRole?.value || '',
        church: adminInviteChurch?.value?.trim() || '',
      };
      const res = await fetch('/api/portal/admin/invite', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...portalAuthHeaders },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo invitar');
      adminInviteStatus.textContent = 'Invitación enviada.';
      adminInviteEmail.value = '';
      if (adminInviteName) adminInviteName.value = '';
      if (adminInviteChurch) adminInviteChurch.value = '';
      await loadAdminUsers(portalAuthHeaders);
    } catch (err) {
      console.error(err);
      adminInviteStatus.textContent = err.message || 'Error al invitar';
    }
  });
}

async function loadChurchDraft() {
  if (!churchForm) return;
  try {
    const res = await fetch('/api/portal/iglesia/draft', { headers: portalAuthHeaders });
    const payload = await res.json();
    if (!res.ok || !payload.ok || !payload.draft) return;
    const draft = payload.draft;
    document.getElementById('church-contact-name').value = draft.contactName || '';
    document.getElementById('church-contact-email').value = draft.email || '';
    document.getElementById('church-contact-phone').value = draft.phone || '';
    document.getElementById('church-document-type').value = draft.documentType || 'CC';
    document.getElementById('church-document-number').value = draft.documentNumber || '';
    document.getElementById('church-country-group').value = draft.countryGroup || 'CO';
    document.getElementById('church-country').value = draft.country || '';
    document.getElementById('church-city').value = draft.city || '';
    document.getElementById('church-name').value = draft.church || '';
    document.getElementById('church-payment-option').value = draft.paymentOption || 'FULL';
    document.getElementById('church-payment-amount').value = draft.paymentAmount || '';
    document.getElementById('church-payment-frequency').value = draft.frequency || 'MONTHLY';
    document.getElementById('church-payment-method').value = draft.paymentMethod || '';
    document.getElementById('church-notes').value = draft.notes || '';
    participantsList.innerHTML = '';
    (draft.participants || []).forEach((item) => {
      participantsList.appendChild(buildParticipantRow(item));
    });
    if (!participantsList.children.length) {
      participantsList.appendChild(buildParticipantRow());
    }
  } catch (err) {
    console.error(err);
  }
}

let draftTimer;
function scheduleDraftSave() {
  if (!churchForm || authMode === 'password') return;
  clearTimeout(draftTimer);
  draftTimer = setTimeout(() => {
    saveChurchDraft();
  }, 900);
}

async function saveChurchDraft() {
  if (!churchForm) return;
  const payload = {
    contactName: document.getElementById('church-contact-name')?.value || '',
    email: document.getElementById('church-contact-email')?.value || '',
    phone: document.getElementById('church-contact-phone')?.value || '',
    documentType: document.getElementById('church-document-type')?.value || '',
    documentNumber: document.getElementById('church-document-number')?.value || '',
    countryGroup: document.getElementById('church-country-group')?.value || 'CO',
    country: document.getElementById('church-country')?.value || '',
    city: document.getElementById('church-city')?.value || '',
    church: document.getElementById('church-name')?.value || '',
    paymentOption: document.getElementById('church-payment-option')?.value || 'FULL',
    paymentAmount: document.getElementById('church-payment-amount')?.value || '',
    frequency: document.getElementById('church-payment-frequency')?.value || 'MONTHLY',
    paymentMethod: document.getElementById('church-payment-method')?.value || '',
    notes: document.getElementById('church-notes')?.value || '',
    participants: collectParticipants(),
  };
  try {
    await fetch('/api/portal/iglesia/draft', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...portalAuthHeaders },
      body: JSON.stringify(payload),
    });
  } catch (err) {
    console.error(err);
  }
}

function initChurchManualForm() {
  if (!churchForm || !participantsList || !addParticipantBtn) return;
  if (!participantsList.children.length) {
    participantsList.appendChild(buildParticipantRow());
  }

  addParticipantBtn.addEventListener('click', () => {
    participantsList.appendChild(buildParticipantRow());
    scheduleDraftSave();
  });

  churchForm.querySelectorAll('input, select, textarea').forEach((input) => {
    input.addEventListener('input', scheduleDraftSave);
  });

  churchForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (!churchFormStatus) return;
    churchFormStatus.textContent = 'Guardando...';
    const payload = {
      contactName: document.getElementById('church-contact-name')?.value || '',
      email: document.getElementById('church-contact-email')?.value || '',
      phone: document.getElementById('church-contact-phone')?.value || '',
      documentType: document.getElementById('church-document-type')?.value || '',
      documentNumber: document.getElementById('church-document-number')?.value || '',
      countryGroup: document.getElementById('church-country-group')?.value || 'CO',
      country: document.getElementById('church-country')?.value || '',
      city: document.getElementById('church-city')?.value || '',
      church: document.getElementById('church-name')?.value || '',
      paymentOption: document.getElementById('church-payment-option')?.value || 'FULL',
      paymentAmount: Number(document.getElementById('church-payment-amount')?.value || 0),
      frequency: document.getElementById('church-payment-frequency')?.value || 'MONTHLY',
      paymentMethod: document.getElementById('church-payment-method')?.value || '',
      notes: document.getElementById('church-notes')?.value || '',
      participants: collectParticipants(),
    };

    try {
      const res = await fetch('/api/portal/iglesia/submit', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...portalAuthHeaders },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo guardar');
      churchFormStatus.textContent = 'Inscripción registrada.';
      await loadChurchBookings();
      churchForm.reset();
      participantsList.innerHTML = '';
      participantsList.appendChild(buildParticipantRow());
      await fetch('/api/portal/iglesia/draft', { method: 'DELETE', headers: portalAuthHeaders });
    } catch (error) {
      console.error(error);
      churchFormStatus.textContent = error.message || 'Error guardando';
    }
  });
}

function initInviteForm() {
  if (!inviteBtn || !inviteEmail || !inviteRole) return;
  inviteBtn.addEventListener('click', async () => {
    if (!inviteStatus) return;
    inviteStatus.textContent = 'Enviando invitación...';
    try {
      const payload = {
        email: inviteEmail.value.trim(),
        role: inviteRole.value,
        church: inviteChurchInput?.value?.trim() || '',
      };
      const res = await fetch('/api/portal/iglesia/invite', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...portalAuthHeaders },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo invitar');
      inviteStatus.textContent = 'Invitación enviada.';
      inviteEmail.value = '';
    } catch (err) {
      console.error(err);
      inviteStatus.textContent = err.message || 'No se pudo invitar';
    }
  });
}

function renderBookings(bookings) {
  bookingsList.innerHTML = '';
  if (!bookings.length) {
    bookingsEmpty.classList.remove('hidden');
    return;
  }
  bookingsEmpty.classList.add('hidden');
  bookings.forEach((booking) => {
    const card = document.createElement('div');
    card.className = 'bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-4 hover:bg-white/[0.07] transition-all group';
    const colorClass = booking.status === 'PAID' ? 'text-green-400' : 'text-brand-teal';
    card.innerHTML = `
      <div class="flex justify-between items-start">
        <div>
          <p class="text-[10px] font-bold text-white/30 uppercase tracking-widest mb-1">Reserva identificada</p>
          <h3 class="font-bold text-lg text-white">#${booking.id.slice(0, 8).toUpperCase()}</h3>
        </div>
        <span class="px-3 py-1 rounded-full bg-white/5 text-[10px] font-black uppercase tracking-widest border border-white/10 ${colorClass}">${booking.status}</span>
      </div>
      <div class="space-y-3 pt-2">
        <div class="flex justify-between text-xs">
          <span class="text-white/40">Progreso de abono</span>
          <span class="text-white/80">${Math.round((booking.total_paid / booking.total_amount) * 100)}%</span>
        </div>
        <div class="h-1.5 w-full bg-white/5 rounded-full overflow-hidden">
          <div class="h-full bg-brand-teal transition-all duration-1000" style="width: ${(booking.total_paid / booking.total_amount) * 100}%"></div>
        </div>
        <div class="grid grid-cols-2 gap-4">
          <div>
             <p class="text-[10px] text-white/30 uppercase tracking-widest mb-1">Aportado</p>
             <p class="text-sm font-bold">${formatCurrency(booking.total_paid, booking.currency)}</p>
          </div>
          <div class="text-right">
             <p class="text-[10px] text-white/30 uppercase tracking-widest mb-1">Monto Total</p>
             <p class="text-sm font-bold text-white/60">${formatCurrency(booking.total_amount, booking.currency)}</p>
          </div>
        </div>
      </div>
    `;
    bookingsList.appendChild(card);
  });
}

function renderPlans(plans, bookings) {
  plansList.innerHTML = '';
  if (!plans.length) {
    plansEmpty.classList.remove('hidden');
    return;
  }
  plansEmpty.classList.add('hidden');
  plans.forEach((plan) => {
    const booking = bookings.find((item) => item.id === plan.booking_id);
    const card = document.createElement('div');
    card.className = 'bg-white/5 border border-white/10 rounded-[2rem] p-6 space-y-5';
    const statusLabel = plan.status === 'PAUSED' ? 'Pausado' : plan.status === 'COMPLETED' ? 'Completado' : 'Activo';
    const actionLabel = plan.status === 'PAUSED' ? 'Reactivar abonos' : 'Pausar abonos';
    const actionClass = plan.status === 'PAUSED' ? 'bg-brand-teal text-white' : 'bg-white/5 text-white/60 hover:bg-white/10';
    
    card.innerHTML = `
      <div class="flex justify-between items-center">
        <div class="flex items-center gap-3">
           <div class="w-10 h-10 rounded-xl bg-white/5 flex items-center justify-center text-white/40">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
           </div>
           <div>
             <p class="text-[10px] font-bold text-white/30 uppercase tracking-widest">Recurrencia</p>
             <p class="text-sm font-bold text-white">${plan.frequency === 'BIWEEKLY' ? 'Quincenal' : 'Mensual'}</p>
           </div>
        </div>
        <span class="text-[10px] font-bold px-2 py-1 rounded bg-white/5 border border-white/5 text-white/40 uppercase">${statusLabel}</span>
      </div>
      
      <div class="p-4 bg-white/[0.03] rounded-2xl border border-white/5 text-center">
         <p class="text-[10px] text-white/30 uppercase tracking-widest mb-1">Monto de la Cuota</p>
         <p class="text-2xl font-display font-bold text-white">${formatCurrency(plan.installment_amount, plan.currency)}</p>
      </div>

      <div class="flex items-center justify-between text-xs text-white/40 border-t border-white/5 pt-4">
         <span>Próximo abono: ${formatDate(plan.next_due_date)}</span>
         <button class="plan-action px-4 py-2 rounded-lg text-xs font-bold transition-all ${actionClass}" data-plan="${plan.id}" data-action="${plan.status === 'PAUSED' ? 'resume' : 'pause'}">
          ${actionLabel}
         </button>
      </div>
    `;
    plansList.appendChild(card);
  });
}

function renderPayments(payments) {
  paymentsTable.innerHTML = '';
  if (!payments.length) {
    paymentsEmpty.classList.remove('hidden');
    return;
  }
  paymentsEmpty.classList.add('hidden');
  payments.forEach((payment) => {
    const row = document.createElement('tr');
    row.className = 'group hover:bg-white/[0.02] transition-colors';
    const statusClass = payment.status === 'APPROVED' ? 'bg-green-400/10 text-green-400' : 'bg-brand-gold/10 text-brand-gold';
    row.innerHTML = `
      <td class="py-6 px-8 text-white/80">${formatDate(payment.created_at)}</td>
      <td class="py-6 px-8 font-mono text-xs text-white/40">${payment.reference || '-'}</td>
      <td class="py-6 px-8 text-white/60">${payment.provider?.toUpperCase() || '-'} · Aporte</td>
      <td class="py-6 px-8 text-right font-bold text-white">${formatCurrency(payment.amount, payment.currency)}</td>
      <td class="py-6 px-8 text-center">
        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${statusClass}">
          ${payment.status || 'PENDING'}
        </span>
      </td>
    `;
    paymentsTable.appendChild(row);
  });
}

function toggleChurchField(value) {
  if (value === 'local') {
    profileChurchWrapper?.classList.remove('hidden');
  } else {
    profileChurchWrapper?.classList.add('hidden');
  }
}

function toggleOnboardingChurch(value) {
  if (value === 'local') {
    onboardChurchWrapper?.classList.remove('hidden');
  } else {
    onboardChurchWrapper?.classList.add('hidden');
  }
}

function showOnboarding() {
  if (!onboardingModal) return;
  onboardingModal.classList.remove('hidden');
  onboardingModal.classList.add('flex');

  if (portalProfile) {
    onboardName.value = portalProfile.full_name || profileName.value || '';
    onboardPhone.value = portalProfile.phone || '';
    onboardCity.value = portalProfile.city || '';
    onboardCountry.value = portalProfile.country || '';
    onboardAffiliation.value = portalProfile.affiliation_type || '';
    onboardChurchName.value = portalProfile.church_name || '';
    toggleOnboardingChurch(onboardAffiliation.value);
  }
}

function renderMemberships(memberships) {
  if (!churchMembershipsList || !churchMembershipsEmpty) return;
  churchMembershipsList.innerHTML = '';
  if (!memberships.length) {
    churchMembershipsEmpty.classList.remove('hidden');
    churchMembershipsList.classList.add('hidden');
    return;
  }
  churchMembershipsEmpty.classList.add('hidden');
  churchMembershipsList.classList.remove('hidden');
  memberships.forEach((membership) => {
    const card = document.createElement('div');
    card.className = 'rounded-2xl border border-slate-100 bg-slate-50/80 p-5 flex flex-col md:flex-row md:items-center md:justify-between gap-3';
    const statusLabel = membership.status === 'approved' ? 'Aprobado' : membership.status === 'rejected' ? 'Rechazado' : 'Pendiente';
    card.innerHTML = `
      <div>
        <p class="text-xs uppercase tracking-widest text-slate-400 font-bold mb-1">Sede</p>
        <p class="text-lg font-bold text-[#293C74]">${membership.church?.name || 'Iglesia sin nombre'}</p>
        <p class="text-xs text-slate-500">${membership.church?.city || ''} ${membership.church?.country ? `· ${membership.church.country}` : ''}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest bg-white border border-slate-200 text-slate-500">${membership.role}</span>
        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${membership.status === 'approved' ? 'bg-green-50 text-green-600 border border-green-200' : 'bg-yellow-50 text-yellow-700 border border-yellow-200'}">${statusLabel}</span>
      </div>
    `;
    churchMembershipsList.appendChild(card);
  });
}

async function updateProfile() {
  profileStatus.textContent = 'Guardando...';
  profileStatus.className = 'text-sm font-medium text-white/40';
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const res = await fetch('/api/portal/profile', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: profileName.value.trim(),
        phone: profilePhone.value.trim(),
        city: profileCity.value.trim(),
        country: profileCountry.value.trim(),
        affiliationType: profileAffiliation.value,
        churchName: profileChurchName.value.trim(),
      }),
    });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo actualizar');
    
    profileStatus.textContent = '¡Cambios guardados con éxito!';
    profileStatus.className = 'text-sm font-medium text-green-400';
    welcomeName.textContent = profileName.value.trim().split(' ')[0];
    
    setTimeout(() => { profileStatus.textContent = ''; }, 3000);
  } catch (err) {
    console.error(err);
    profileStatus.textContent = err?.message || 'Error al actualizar el perfil.';
    profileStatus.className = 'text-sm font-medium text-red-400';
  }
}

async function handlePlanAction(event) {
  const target = event.target.closest('.plan-action');
  if (!target) return;
  const planId = target.dataset.plan;
  const action = target.dataset.action;
  const endpoint = action === 'resume' ? '/api/cuenta/planes/resume' : '/api/cuenta/planes/pause';

  const originalText = target.textContent;
  target.textContent = '...';
  target.disabled = true;

  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const res = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ planId }),
    });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo actualizar');
    await loadAccount();
  } catch (err) {
    console.error(err);
    alert('No pudimos actualizar tu plan. Intenta nuevamente.');
    target.textContent = originalText;
    target.disabled = false;
  }
}

adminUsersList?.addEventListener('change', async (event) => {
  const target = event.target;
  if (!(target instanceof HTMLSelectElement)) return;
  if (target.dataset.action !== 'role') return;
  const userId = target.dataset.user;
  const role = target.value;
  if (!userId) return;
  try {
    const res = await fetch('/api/portal/admin/role', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...portalAuthHeaders },
      body: JSON.stringify({ userId, role }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo actualizar');
  } catch (err) {
    console.error(err);
    alert(err.message || 'No se pudo actualizar el rol.');
  }
});

adminUsersList?.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-action="reset"]');
  if (!target) return;
  const email = target.dataset.email;
  if (!email) return;
  target.textContent = 'Enviando...';
  target.setAttribute('disabled', 'disabled');
  try {
    const res = await fetch('/api/portal/admin/reset-password', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...portalAuthHeaders },
      body: JSON.stringify({ email }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo enviar');
    target.textContent = 'Enviado';
  } catch (err) {
    console.error(err);
    target.textContent = 'Reset contraseña';
    target.removeAttribute('disabled');
    alert(err.message || 'No se pudo enviar.');
  }
});

logoutBtn?.addEventListener('click', async () => {
  logoutBtn.disabled = true;
  logoutBtn.textContent = 'Saliendo...';
  try {
    // Always clear any local Supabase session (even in password fallback).
    await supabase.auth.signOut({ scope: 'local' });
  } catch (err) {
    console.warn('No se pudo cerrar sesión Supabase en el cliente.', err);
  }
  if (authMode === 'password') {
    await fetch('/api/portal/password-logout', { method: 'POST' });
  }
  window.location.href = '/portal/ingresar';
});

saveProfileBtn?.addEventListener('click', updateProfile);
profileAffiliation?.addEventListener('change', (event) => {
  toggleChurchField(event.target.value);
});
onboardAffiliation?.addEventListener('change', (event) => {
  toggleOnboardingChurch(event.target.value);
});
onboardingForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  onboardingStatus.textContent = 'Guardando...';
  try {
    const { data: sessionData } = await supabase.auth.getSession();
    const token = sessionData.session?.access_token;
    const res = await fetch('/api/portal/profile', {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        fullName: onboardName.value.trim(),
        phone: onboardPhone.value.trim(),
        city: onboardCity.value.trim(),
        country: onboardCountry.value.trim(),
        affiliationType: onboardAffiliation.value,
        churchName: onboardChurchName.value.trim(),
      }),
    });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo guardar');

    portalProfile = payload.profile || portalProfile;
    profileName.value = portalProfile.full_name || profileName.value;
    profilePhone.value = portalProfile.phone || '';
    profileCity.value = portalProfile.city || '';
    profileCountry.value = portalProfile.country || '';
    profileAffiliation.value = portalProfile.affiliation_type || '';
    profileChurchName.value = portalProfile.church_name || '';
    toggleChurchField(profileAffiliation.value);

    onboardingModal.classList.add('hidden');
    onboardingModal.classList.remove('flex');
  } catch (err) {
    console.error(err);
    onboardingStatus.textContent = err?.message || 'No pudimos guardar tu perfil. Intenta de nuevo.';
  }
});
plansList?.addEventListener('click', handlePlanAction);

loadAccount();
initChurchManualForm();
initInviteForm();
