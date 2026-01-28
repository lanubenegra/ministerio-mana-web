import { getSupabaseBrowserClient } from '@lib/supabaseBrowser';
import { gsap } from 'gsap';

const loadingEl = document.getElementById('account-loading');
const errorEl = document.getElementById('account-error');
const contentEl = document.getElementById('account-content');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
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
    const token = sessionData.session?.access_token;
    if (!token) {
      window.location.href = '/portal/ingresar';
      return;
    }

    const { data: userData } = await supabase.auth.getUser();
    const user = userData.user;

    const sessionRes = await fetch('/api/portal/session', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const sessionPayload = await sessionRes.json();
    if (!sessionRes.ok || !sessionPayload.ok) throw new Error(sessionPayload.error || 'No se pudo cargar el perfil');

    portalProfile = sessionPayload.profile || {};
    portalMemberships = sessionPayload.memberships || [];

    const res = await fetch('/api/cuenta/resumen', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo cargar');

    const activeUser = payload.user || {};
    const name = activeUser.fullName || user?.user_metadata?.full_name || 'Usuario';
    profileName.value = name;
    welcomeName.textContent = name.split(' ')[0];
    profileEmail.value = activeUser.email || user?.email || '';
    profilePhone.value = portalProfile.phone || '';
    profileCity.value = portalProfile.city || '';
    profileCountry.value = portalProfile.country || '';
    profileAffiliation.value = portalProfile.affiliation_type || '';
    profileChurchName.value = portalProfile.church_name || '';
    toggleChurchField(profileAffiliation.value);

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

    if (!portalProfile?.full_name || !portalProfile?.affiliation_type) {
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
    profileStatus.textContent = 'Error al actualizar el perfil.';
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

logoutBtn?.addEventListener('click', async () => {
  logoutBtn.disabled = true;
  logoutBtn.textContent = 'Saliendo...';
  await supabase.auth.signOut();
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
    onboardingStatus.textContent = 'No pudimos guardar tu perfil. Intenta de nuevo.';
  }
});
plansList?.addEventListener('click', handlePlanAction);

loadAccount();
