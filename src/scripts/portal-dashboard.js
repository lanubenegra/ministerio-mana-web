import { getSupabaseBrowserClient } from '@lib/supabaseBrowser';
import { ensureAuthenticated, redirectToLogin } from '@lib/portalAuthClient';
import { gsap } from 'gsap';

const DEBUG = import.meta.env?.DEV === true;
const dlog = (...args) => { if (DEBUG) console.log(...args); };
const dwarn = (...args) => { if (DEBUG) console.warn(...args); };

async function clearStaleServiceWorkersOnce() {
  if (typeof window === 'undefined' || !('serviceWorker' in navigator)) return false;
  if (sessionStorage.getItem('portal_sw_cleared') === '1') return false;

  const registrations = await navigator.serviceWorker.getRegistrations();
  if (!registrations.length) return false;

  sessionStorage.setItem('portal_sw_cleared', '1');
  await Promise.all(registrations.map((reg) => reg.unregister()));

  if ('caches' in window) {
    const keys = await caches.keys();
    await Promise.all(keys.map((key) => caches.delete(key)));
  }

  return true;
}

const loadingEl = document.getElementById('account-loading');
dlog('Portal Script Started. Loading El:', loadingEl);
const errorEl = document.getElementById('account-error');
const contentEl = document.getElementById('account-content');
const profileName = document.getElementById('profile-name');
const profileEmail = document.getElementById('profile-email');
const profileRole = document.getElementById('profile-role');
const profilePhone = document.getElementById('profile-phone');
const profileCity = document.getElementById('profile-city');
const profileCountry = document.getElementById('profile-country');
const profileDocumentType = document.getElementById('profile-document-type');
const profileDocumentNumber = document.getElementById('profile-document-number');
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
const installmentsList = document.getElementById('installments-list');
const installmentsEmpty = document.getElementById('installments-empty');
const paymentsTable = document.getElementById('payments-table');
const paymentsEmpty = document.getElementById('payments-empty');
const churchMembershipsEmpty = document.getElementById('church-memberships-empty');
const churchMembershipsList = document.getElementById('church-memberships-list');
const churchForm = document.getElementById('church-manual-form');
const churchFormToggle = document.getElementById('church-form-toggle');
const churchNameInput = document.getElementById('church-name');
const churchFormStatus = document.getElementById('church-form-status');
const churchBookingsEmpty = document.getElementById('church-bookings-empty');
const churchBookingsList = document.getElementById('church-bookings-list');
const churchBookingsSearch = document.getElementById('church-bookings-search');
const churchBookingsStatus = document.getElementById('church-bookings-status');
const churchPaymentsEmpty = document.getElementById('church-payments-empty');
const churchPaymentsList = document.getElementById('church-payments-list');
const churchPaymentsSearch = document.getElementById('church-payments-search');
const churchPaymentsStatus = document.getElementById('church-payments-status');
const churchPaymentsProvider = document.getElementById('church-payments-provider');
const churchPaymentsFrom = document.getElementById('church-payments-from');
const churchPaymentsTo = document.getElementById('church-payments-to');
const churchExportBtn = document.getElementById('church-export-btn');
const churchExportStatus = document.getElementById('church-export-status');
const churchInstallmentsEmpty = document.getElementById('church-installments-empty');
const churchInstallmentsList = document.getElementById('church-installments-list');
const churchInstallmentsSearch = document.getElementById('church-installments-search');
const churchInstallmentsStatusFilter = document.getElementById('church-installments-status');
const churchInstallmentsStatusMsg = document.getElementById('church-installments-status-msg');
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
const churchMembersSearch = document.getElementById('church-members-search');
const churchMembersRole = document.getElementById('church-members-role');
const churchSelector = document.getElementById('church-selector');
const churchSelectorInput = document.getElementById('church-selector-input');
const churchSelectorStatus = document.getElementById('church-selector-status');
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
const adminFollowupsCard = document.getElementById('admin-followups-card');
const adminFollowupsCount = document.getElementById('admin-followups-count');
const adminFollowupsStatus = document.getElementById('admin-followups-status');
const adminFollowupsEmpty = document.getElementById('admin-followups-empty');
const adminFollowupsList = document.getElementById('admin-followups-list');
const adminFollowupsFilters = document.getElementById('admin-followups-filters');

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
const portalAlertModal = document.getElementById('portal-alert-modal');
const portalAlertTitle = document.getElementById('portal-alert-title');
const portalAlertMessage = document.getElementById('portal-alert-message');
const portalAlertClose = document.getElementById('portal-alert-close');
const portalAlertOk = document.getElementById('portal-alert-ok');

function hidePortalAlert() {
  if (!portalAlertModal) return;
  portalAlertModal.classList.add('hidden');
  portalAlertModal.classList.remove('flex');
}

function showPortalAlert(message, options = {}) {
  if (!portalAlertModal || !portalAlertMessage || !portalAlertTitle) {
    window.alert(message);
    return;
  }
  portalAlertMessage.textContent = message;
  portalAlertTitle.textContent = options.title || 'Atención';
  portalAlertModal.classList.remove('hidden');
  portalAlertModal.classList.add('flex');
}

portalAlertClose?.addEventListener('click', hidePortalAlert);
portalAlertOk?.addEventListener('click', hidePortalAlert);
portalAlertModal?.addEventListener('click', (event) => {
  if (event.target === portalAlertModal) hidePortalAlert();
});

let supabase = null;
let supabaseInitError = null;
try {
  supabase = getSupabaseBrowserClient();
} catch (err) {
  console.error('Supabase client initialization failed:', err);
  supabaseInitError = err;
  // Don't redirect or show errors here - let the auth flow handle it
}
let portalProfile = null;
let portalMemberships = [];
let authMode = 'supabase';
let churchParticipantsCount = 0;
let portalAuthHeaders = {};
let portalIsAdmin = false;
let portalIsSuperadmin = false;
let portalSelectedChurchId = null;
let portalChurchesCatalog = [];
let portalIsCustomChurch = false;
let churchBookingsData = [];
let churchMembersData = [];
let churchPaymentsData = [];
let churchInstallmentsData = [];
let adminIssuesData = [];
let adminIssuesFilter = 'all';
let adminIssuesCounts = {};
const ALL_CHURCHES_VALUE = '__all__';
const CUSTOM_CHURCH_VALUE = '__custom__';

function isAllChurchesSelected() {
  return portalSelectedChurchId === ALL_CHURCHES_VALUE;
}

function resolveSelectedChurchId() {
  if (!portalSelectedChurchId || isAllChurchesSelected()) return '';
  return portalSelectedChurchId;
}

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

function formatDateTime(value) {
  if (!value) return '-';
  const date = new Date(value);
  return date.toLocaleString('es-CO', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getAuthRedirectState() {
  const url = new URL(window.location.href);
  const hasHashToken = Boolean(window.location.hash && window.location.hash.includes('access_token'));
  const hasCode = url.searchParams.has('code');
  const hasError = url.searchParams.has('error');
  const hasType = url.searchParams.has('type');
  return {
    url,
    hasHashToken,
    hasCode,
    hasError,
    hasType,
    isAuthRedirect: hasHashToken || hasCode || hasError || hasType,
  };
}

function cleanupAuthRedirect() {
  const url = new URL(window.location.href);
  if (url.hash && url.hash.includes('access_token')) {
    url.hash = '';
  }
  ['code', 'type', 'error', 'error_description', 'access_token', 'refresh_token', 'expires_in', 'token_type'].forEach((param) => {
    url.searchParams.delete(param);
  });
  history.replaceState(null, '', `${url.pathname}${url.search}${url.hash}`);
}

// Tabs Navigation
navLinks.forEach(link => {
  link.addEventListener('click', (e) => {
    const targetTab = link.dataset.tab;
    if (targetTab) {
      e.preventDefault();
      // Update URL
      const url = new URL(window.location);
      url.searchParams.set('tab', targetTab);
      history.pushState({}, '', url);
      switchTab(targetTab);
    }
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

// Core Dashboard Logic - Reactive Auth
async function loadDashboardData(authResult) {
  dlog('[DEBUG] loadDashboardData called with mode:', authResult.mode);

  try {
    const token = authResult.token;
    const sessionUser = authResult.user;

    // Update global state
    authMode = authResult.mode;
    if (sessionUser) {
      portalProfile = sessionUser;
    }

    const headers = token ? { Authorization: `Bearer ${token}` } : {};
    portalAuthHeaders = headers;
    window.portalAuthHeaders = headers;
    // 2. Parallelized Initial Data Fetching

    dlog('[DEBUG] Starting Promise.all for API requests...');

    const promises = [
      fetch('/api/portal/session', { headers, credentials: 'include' }),
      fetch('/api/portal/churches', { headers, credentials: 'include' }), // Fetch Catalog

      fetch('/api/cuenta/resumen', { headers, credentials: 'include' })
    ];

    if (token && supabase) {
      promises.push(supabase.auth.getUser());
    } else {
      promises.push(Promise.resolve({ data: { user: null } })); // Mock for no-token
    }

    const [sessionRes, churchesRes, resumenRes, { data: userData }] = await Promise.all(promises);
    dlog('[DEBUG] Promise.all completed.');

    // Handle Church Catalog
    if (churchesRes.ok) {
      portalChurchesCatalog = await churchesRes.json();
      populateChurchesUI(portalChurchesCatalog);

      // Update advanced church selector if it exists
      if (window.advancedChurchSelector && portalChurchesCatalog.length > 0) {
        window.advancedChurchSelector.setChurches(portalChurchesCatalog);
      }
    }

    dlog('[DEBUG] sessionRes status:', sessionRes.status);
    dlog('[DEBUG] userData:', userData);

    if (!sessionRes.ok) {
      console.error('[DEBUG] /api/portal/session failed:', sessionRes.status, sessionRes.statusText);
      const text = await sessionRes.text();
      console.error('[DEBUG] /api/portal/session body:', text);
      throw new Error(`Session API error: ${sessionRes.status}`);
    }

    const sessionPayload = await sessionRes.json();
    dlog('[DEBUG] sessionPayload:', sessionPayload);
    if (!sessionRes.ok || !sessionPayload.ok) throw new Error(sessionPayload.error || 'No se pudo cargar el perfil');

    let payload = { ok: true, user: {}, bookings: [], plans: [], payments: [] };
    const resData = await resumenRes.json();
    dlog('[DEBUG] resData (resumen):', resData);
    if (!resumenRes.ok || !resData.ok) {
      // Optional: Log error but continue with minimal profile?
      dwarn('Could not load resumen:', resData.error);
    } else {
      payload = resData;
    }

    authMode = sessionPayload.mode || 'supabase';
    portalProfile = sessionPayload.profile || {};
    portalMemberships = sessionPayload.memberships || [];
    portalIsAdmin = portalProfile?.role === 'admin' || portalProfile?.role === 'superadmin';
    portalIsSuperadmin = portalProfile?.role === 'superadmin';
    if (portalIsAdmin && !portalSelectedChurchId) {
      portalSelectedChurchId = ALL_CHURCHES_VALUE;
    }

    dlog('[DEBUG] Data loaded. Profile:', portalProfile);

    // --- Sidebar Role Visibility Logic ---
    const navLinkEventManagement = document.getElementById('nav-link-events'); // Gestión de Eventos
    const navLinkFinances = document.getElementById('nav-link-finances'); // Finanzas
    const navLinkUsers = document.getElementById('nav-link-users'); // Usuarios
    const navLinkCampus = document.getElementById('nav-link-campus'); // Campus
    const tabIglesia = document.getElementById('tab-iglesia'); // The actual tab content

    // Default: Hide ALL restricted links (regular users see none of these)
    if (navLinkEventManagement) navLinkEventManagement.style.display = 'none';
    if (navLinkFinances) navLinkFinances.style.display = 'none';
    if (navLinkUsers) navLinkUsers.style.display = 'none';
    if (navLinkCampus) navLinkCampus.style.display = 'none';

    const myRole = portalProfile?.role || 'user';
    const allowedDashboardRoles = ['superadmin', 'admin', 'national_pastor', 'pastor', 'local_collaborator', 'church_admin'];

    // Tab Iglesia (Eventos) - Show to ALL users, but content varies by role
    const isManagementRole = allowedDashboardRoles.includes(myRole);


    if (tabIglesia) {
      if (isManagementRole) {
        // Pastors/Admins: Show management view (church selector + booking list)
        const churchDashboardUser = document.getElementById('church-dashboard-user');
        if (churchDashboardUser) churchDashboardUser.classList.add('hidden');
      } else {
        // Regular users: Show personal event info (countdown, payment status, group)
        const churchDashboardManagement = document.getElementById('church-dashboard-management');
        if (churchDashboardManagement) churchDashboardManagement.classList.add('hidden');

        const churchDashboardUser = document.getElementById('church-dashboard-user');
        if (churchDashboardUser) churchDashboardUser.classList.remove('hidden');

        // Load user's own event data
        if (typeof loadMyEventInfo === 'function') {
          loadMyEventInfo(portalAuthHeaders);
        }
      }
    }

    // Gestión de Eventos: Only Pastors and Admins (can create local/national events)
    const eventManagementRoles = ['superadmin', 'admin', 'national_pastor', 'pastor'];

    // Usuarios: Only Pastors and Admins
    const userManagementRoles = ['superadmin', 'admin', 'national_pastor', 'pastor', 'local_collaborator'];

    // Campus: Campus Missionaries + Admins (donor management)
    const campusRoles = ['superadmin', 'admin', 'campus_missionary'];

    // Finanzas: ONLY Superadmin and Admin
    const financeRoles = ['superadmin', 'admin'];

    if (myRole) {
      if (eventManagementRoles.includes(myRole) && navLinkEventManagement) {
        navLinkEventManagement.style.display = 'flex';
      }

      if (userManagementRoles.includes(myRole) && navLinkUsers) {
        navLinkUsers.style.display = 'flex';
      }

      if (campusRoles.includes(myRole) && navLinkCampus) {
        navLinkCampus.style.display = 'flex';
      }

      if (financeRoles.includes(myRole) && navLinkFinances) {
        navLinkFinances.style.display = 'flex';
      }
    }

    // -------------------------------------

    const hasChurchRole = (portalMemberships || []).some(
      (membership) => ['church_admin', 'church_member'].includes(membership?.role) && membership?.status !== 'pending',
    );
    const hasChurchAccess = portalIsAdmin || hasChurchRole;
    const membershipChurch = portalMemberships.find((item) => item?.church?.id)?.church || null;

    if (!portalSelectedChurchId && membershipChurch?.id && !portalIsAdmin) {
      portalSelectedChurchId = membershipChurch.id;
    }
    if (churchNameInput && membershipChurch?.name && !portalIsAdmin) {
      churchNameInput.value = membershipChurch.name;
      churchNameInput.setAttribute('readonly', 'readonly');
      churchNameInput.classList.add('bg-slate-100', 'cursor-not-allowed');
    }

    const user = userData?.user;

    const activeUser = payload.user || {};
    const name = activeUser.fullName || user?.user_metadata?.full_name || 'Usuario';
    profileName.value = name;
    welcomeName.textContent = name.split(' ')[0];
    profileEmail.value = activeUser.email || user?.email || '';
    if (profileRole) profileRole.value = portalProfile?.role || 'user';
    profilePhone.value = portalProfile.phone || '';
    profileCity.value = portalProfile.city || '';
    profileCountry.value = portalProfile.country || '';
    if (profileDocumentType) profileDocumentType.value = portalProfile.document_type || '';
    if (profileDocumentNumber) profileDocumentNumber.value = portalProfile.document_number || '';
    profileAffiliation.value = portalProfile.affiliation_type || '';
    profileChurchName.value = portalProfile.church_name || '';
    toggleChurchField(profileAffiliation.value);

    // Update Label for Superadmins if needed, though replaced by new static logic
    if (portalProfile?.role === 'admin' || portalProfile?.role === 'superadmin') {
      if (iglesiaTitle) iglesiaTitle.textContent = 'Cumbre Mundial 2026';
      if (iglesiaSubtitle) iglesiaSubtitle.textContent = 'Panel general del evento para gestión de sedes y registros físicos.';

      const adminUsersCard = document.getElementById('admin-users-card');
      const syncWrapper = document.getElementById('admin-sync-wrapper');
      // We might keep these hidden or visible depending on specific page logic, 
      // but Sidebar is now the primary navigation.
      // adminUsersCard?.classList.remove('hidden'); // Legacy logic?
      syncWrapper?.classList.remove('hidden');
      loadAdminUsers();
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

      // Dynamic Context
      const highlightHeader = document.getElementById('highlight-header');
      const highlightContext = document.getElementById('highlight-context');

      const relatedBooking = payload.bookings?.find(b => b.id === activePlan.booking_id);
      // Default concept
      let concept = relatedBooking?.event_name || 'Cumbre Mundial 2026';

      // Override if specific metadata exists
      if (relatedBooking?.event_type === 'campus') {
        concept = 'Campus Maná';
      }

      let type = 'Abono auto.';

      if (highlightHeader) highlightHeader.textContent = `${type} - ${concept}`;
      if (highlightContext) highlightContext.textContent = concept;
    }

    renderBookings(payload.bookings || []);
    renderPlans(payload.plans || [], payload.bookings || []);
    renderInstallments(payload.installments || [], payload.plans || [], payload.bookings || []);
    renderPayments(payload.payments || []);
    renderMemberships(portalMemberships);
    setupInviteAccess();
    initAdminInvite();
    // 5. Reveal Dashboard (Eager Loading)
    loadingEl.classList.add('hidden');
    contentEl.classList.remove('hidden');

    // Inject Admin Filters if applicable
    if (portalProfile?.role === 'admin' || portalProfile?.role === 'superadmin') {
      setupAdminFilters(payload.bookings || []);
    }

    // Role-based filtering for initial view
    let displayedBookings = payload.bookings || [];
    if (portalProfile?.role === 'pastor' || portalProfile?.role === 'leader') {
      const myChurch = portalProfile.church_name;
      if (myChurch) {
        displayedBookings = displayedBookings.filter(b => b.church_name === myChurch);
      }
    }

    // Initial Render with (potentially) filtered data
    // Note: renderBookings will reuse portalGlobalBookings if we don't pass filtered, so let's update calling convention
    // But renderPlans/etc might also need filtering. For now, focus on Bookings list.
    renderBookings(displayedBookings);

    gsap.from(contentEl, { opacity: 0, y: 30, duration: 1, ease: 'expo.out' });

    // 6. Background Initialization (Parallelized)
    const backgroundTasks = [];
    if (hasChurchAccess) {
      backgroundTasks.push(loadChurchSelector(headers));
      backgroundTasks.push(loadChurchBookings(headers));
      backgroundTasks.push(loadChurchPayments(headers));
      backgroundTasks.push(loadChurchInstallments(headers));
      backgroundTasks.push(loadChurchMembers(headers));
    }
    backgroundTasks.push(loadAdminUsers(headers));
    backgroundTasks.push(loadAdminFollowups(headers));
    backgroundTasks.push(loadChurchDraft());

    await Promise.all(backgroundTasks);

    if (authMode === 'password') {
      if (onboardingModal) onboardingModal.classList.add('hidden');
      if (saveProfileBtn) {
        saveProfileBtn.disabled = true;
        saveProfileBtn.classList.add('opacity-40', 'cursor-not-allowed');
      }
    } else if (!portalProfile?.full_name || !portalProfile?.affiliation_type) {
      showOnboarding();
    }
  } catch (err) {
    console.error(err);
    if (!loadingEl.classList.contains('hidden')) {
      loadingEl.classList.add('hidden');
      errorEl.classList.remove('hidden');
    }
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

async function loadChurchSelector(headers = {}) {
  if (!churchSelector || !churchSelectorInput) return;
  churchSelectorStatus.textContent = 'Cargando iglesias...';
  try {
    const res = await fetch('/api/portal/iglesia/selection', { headers, credentials: 'include' });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo cargar iglesias');

    const churches = payload.churches || [];
    portalChurchesCatalog = churches;

    // Update advanced church selector if it exists
    if (window.advancedChurchSelector && churches.length > 0) {
      window.advancedChurchSelector.setChurches(churches);
    }
    const isAdmin = Boolean(payload.isAdmin);
    churchSelectorInput.innerHTML = '';
    if (isAdmin) {
      const allOption = document.createElement('option');
      allOption.value = ALL_CHURCHES_VALUE;
      allOption.textContent = 'Todos';
      churchSelectorInput.appendChild(allOption);
    } else {
      const placeholder = document.createElement('option');
      placeholder.value = '';
      placeholder.textContent = 'Selecciona una iglesia';
      churchSelectorInput.appendChild(placeholder);
    }
    churches.forEach((church) => {
      const option = document.createElement('option');
      option.value = church.id;
      const label = church?.code
        ? `${church.code} · ${church.name}${church.city ? ` · ${church.city}` : ''}`
        : `${church.name}${church.city ? ` · ${church.city}` : ''}`;
      option.textContent = label;
      churchSelectorInput.appendChild(option);
    });

    const customOption = document.createElement('option');
    customOption.value = CUSTOM_CHURCH_VALUE;
    customOption.textContent = 'Otra iglesia (manual)';
    churchSelectorInput.appendChild(customOption);

    portalSelectedChurchId = payload.selectedChurchId || '';
    portalIsCustomChurch = false;
    if (isAdmin && !portalSelectedChurchId) {
      portalSelectedChurchId = ALL_CHURCHES_VALUE;
    }
    if (portalSelectedChurchId) {
      churchSelectorInput.value = portalSelectedChurchId;
    } else if (churches.length === 1) {
      portalSelectedChurchId = churches[0].id;
      churchSelectorInput.value = portalSelectedChurchId;
      await saveChurchSelection(portalSelectedChurchId, headers);
    }

    if (churchNameInput) {
      const resolvedId = resolveSelectedChurchId();
      if (resolvedId) {
        const selected = portalChurchesCatalog.find((item) => item.id === resolvedId);
        if (selected) {
          churchNameInput.value = selected.name;
          churchNameInput.setAttribute('readonly', 'readonly');
          churchNameInput.classList.add('bg-slate-100', 'cursor-not-allowed');
        }
      } else {
        churchNameInput.value = '';
        churchNameInput.removeAttribute('readonly');
        churchNameInput.classList.remove('bg-slate-100', 'cursor-not-allowed');
      }
    }

    if (isAdmin) {
      churchSelector.classList.remove('hidden');
    } else {
      churchSelector.classList.add('hidden');
    }

    const emptyEl = document.getElementById('church-dashboard-empty');
    const contentEl = document.getElementById('church-dashboard-content');
    if (portalSelectedChurchId && portalSelectedChurchId !== CUSTOM_CHURCH_VALUE) {
      if (emptyEl) emptyEl.classList.add('hidden');
      if (contentEl) contentEl.classList.remove('hidden');
    } else {
      if (emptyEl) emptyEl.classList.remove('hidden');
      if (contentEl) contentEl.classList.add('hidden');
    }

    if (isAllChurchesSelected()) {
      churchSelectorStatus.textContent = 'Mostrando todos los registros (incluye sin iglesia / virtual).';
    } else {
      churchSelectorStatus.textContent = churches.length ? 'Selecciona una iglesia para ver los registros.' : 'No hay iglesias disponibles.';
    }
  } catch (err) {
    console.error(err);
    churchSelectorStatus.textContent = 'No se pudo cargar iglesias.';
  }
}

// Church Selector: Change Event Listener
if (churchSelectorInput) {
  churchSelectorInput.addEventListener('change', async () => {
    const selectedChurchId = churchSelectorInput.value;

    if (selectedChurchId === CUSTOM_CHURCH_VALUE) {
      portalIsCustomChurch = true;
      portalSelectedChurchId = null;
      if (churchSelectorStatus) {
        churchSelectorStatus.textContent = 'Modo manual activo. Escribe el nombre de la iglesia.';
      }
      if (churchNameInput) {
        churchNameInput.removeAttribute('readonly');
        churchNameInput.classList.remove('bg-slate-100', 'cursor-not-allowed');
        churchNameInput.value = '';
        churchNameInput.focus();
      }
      return;
    }

    portalIsCustomChurch = false;
    if (selectedChurchId === ALL_CHURCHES_VALUE) {
      portalSelectedChurchId = ALL_CHURCHES_VALUE;
      await saveChurchSelection(null, portalAuthHeaders);
    } else if (selectedChurchId) {
      portalSelectedChurchId = selectedChurchId;
      await saveChurchSelection(selectedChurchId, portalAuthHeaders);
    } else {
      portalSelectedChurchId = null;
    }

    const emptyEl = document.getElementById('church-dashboard-empty');
    const contentEl = document.getElementById('church-dashboard-content');
    if (selectedChurchId === ALL_CHURCHES_VALUE || selectedChurchId) {
      if (emptyEl) emptyEl.classList.add('hidden');
      if (contentEl) contentEl.classList.remove('hidden');

      await Promise.all([
        loadChurchBookings(portalAuthHeaders),
        loadChurchInstallments(portalAuthHeaders),
        loadChurchPayments(portalAuthHeaders),
        loadChurchMembers(portalAuthHeaders),
      ]).catch((err) => console.error('Error loading church data:', err));

      updateChurchStats();
    } else {
      if (emptyEl) emptyEl.classList.remove('hidden');
      if (contentEl) contentEl.classList.add('hidden');
    }
  });
}

// Helper: Update Church Stats Cards
function updateChurchStats() {
  const total = churchBookingsData.length;
  const paid = churchBookingsData.filter(b => b.is_paid_full || b.status === 'PAID').length;
  const pending = total - paid;

  const totalEl = document.getElementById('stat-church-total');
  const paidEl = document.getElementById('stat-church-paid');
  const pendingEl = document.getElementById('stat-church-pending');

  if (totalEl) totalEl.textContent = total;
  if (paidEl) paidEl.textContent = paid;
  if (pendingEl) pendingEl.textContent = pending;
}

async function saveChurchSelection(churchId, headers = {}) {
  if (!churchSelectorStatus) return;
  churchSelectorStatus.textContent = 'Guardando selección...';
  try {
    const res = await fetch('/api/portal/iglesia/selection', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...headers },
      body: JSON.stringify({ churchId }),
      credentials: 'include'
    });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo guardar');
    portalSelectedChurchId = payload.churchId || '';
    if (!portalSelectedChurchId && portalIsAdmin && churchId === null) {
      portalSelectedChurchId = ALL_CHURCHES_VALUE;
    }
    churchSelectorStatus.textContent = isAllChurchesSelected() ? 'Mostrando todas las iglesias.' : 'Iglesia seleccionada.';

    if (churchNameInput) {
      const resolvedId = resolveSelectedChurchId();
      if (resolvedId) {
        const selected = portalChurchesCatalog.find((item) => item.id === resolvedId);
        if (selected) {
          churchNameInput.value = selected.name;
          churchNameInput.setAttribute('readonly', 'readonly');
          churchNameInput.classList.add('bg-slate-100', 'cursor-not-allowed');
        }
      } else {
        churchNameInput.value = '';
        churchNameInput.removeAttribute('readonly');
        churchNameInput.classList.remove('bg-slate-100', 'cursor-not-allowed');
      }
    }
  } catch (err) {
    console.error(err);
    churchSelectorStatus.textContent = err?.message || 'Error guardando selección.';
  }
}

function filterChurchBookings(list) {
  const query = churchBookingsSearch?.value?.trim().toLowerCase() || '';
  const status = churchBookingsStatus?.value || '';
  return (list || []).filter((item) => {
    const searchable = [
      item.contact_name,
      item.contact_email,
      item.contact_church,
      item.reference,
      item.id,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    if (query && !searchable.includes(query)) return false;
    if (status && item.status !== status) return false;
    return true;
  });
}

function renderChurchBookings(list) {
  if (!churchBookingsList || !churchBookingsEmpty) return;
  churchBookingsList.innerHTML = '';
  if (!list.length) {
    churchBookingsEmpty.classList.remove('hidden');
    churchBookingsList.classList.add('hidden');
    return;
  }
  churchBookingsEmpty.classList.add('hidden');
  churchBookingsList.classList.remove('hidden');
  list.forEach((item) => {
    const card = document.createElement('div');
    card.className = 'rounded-2xl border border-slate-200 bg-white p-5 hover:shadow-md transition-shadow';
    const churchName = item.contact_church || (isAllChurchesSelected() ? 'Sin iglesia / virtual' : 'Sin iglesia');
    const churchLabel = `<p class="text-[10px] text-slate-400 font-bold uppercase tracking-widest mb-1 truncate">${churchName}</p>`;

    // Status Logic
    const isPaidFull = item.is_paid_full || item.total_paid >= item.total_amount;
    const paymentMethod = item.payment_type || (item.payment_method === 'cash' ? 'Físico' : 'Online');

    // Badges
    const statusBadge = isPaidFull
      ? `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-[10px] font-bold uppercase tracking-wide border border-green-100">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" /></svg>
             Completo
           </span>`
      : `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-yellow-50 text-yellow-700 text-[10px] font-bold uppercase tracking-wide border border-yellow-100">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" viewBox="0 0 20 20" fill="currentColor"><path fill-rule="evenodd" d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" /></svg>
             Abono
           </span>`;

    const methodBadge = paymentMethod === 'Físico'
      ? `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-slate-100 text-slate-600 text-[10px] font-bold uppercase tracking-wide border border-slate-200">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
             Físico
           </span>`
      : `<span class="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-purple-50 text-purple-700 text-[10px] font-bold uppercase tracking-wide border border-purple-100">
             <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" /></svg>
             Online
           </span>`;

    card.innerHTML = `
      <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div class="flex-1 min-w-0">
          ${churchLabel}
          <div class="flex items-center gap-2 mb-1">
             <p class="text-sm font-bold text-[#293C74]">#${(item.reference || item.id)?.slice(0, 8).toUpperCase()}</p>
             <span class="text-xs text-slate-400">•</span>
             <p class="text-xs font-semibold text-slate-700 truncate">${item.contact_name || item.contact_email || 'Participante'}</p>
          </div>
          <div class="flex items-center gap-2">
            ${statusBadge}
            ${methodBadge}
          </div>
        </div>
        
        <div class="flex items-center gap-4 border-t md:border-t-0 md:border-l border-slate-100 pt-3 md:pt-0 md:pl-4 mt-2 md:mt-0">
            <div class="text-right">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Pagado</p>
              <p class="text-sm font-bold text-brand-teal">${formatCurrency(item.total_paid, item.currency)}</p>
            </div>
            <div class="text-right">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-0.5">Total</p>
              <p class="text-sm font-bold text-[#293C74]">${formatCurrency(item.total_amount, item.currency)}</p>
            </div>
        </div>
      </div>
      
      <div class="mt-4 pt-3 border-t border-slate-50 flex items-center justify-between text-xs text-slate-400">
         <span class="flex items-center gap-1">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
            ${item.participant_count || 0} inscritos
         </span>
         <span>${formatDateTime(item.created_at)}</span>
      </div>
    `;
    churchBookingsList.appendChild(card);
  });

  // Update stats after rendering
  updateChurchStats();
}

function parseDateInput(value) {
  if (!value) return null;
  const date = new Date(`${value}T00:00:00`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function filterChurchPayments(list) {
  const query = churchPaymentsSearch?.value?.trim().toLowerCase() || '';
  const status = churchPaymentsStatus?.value || '';
  const provider = churchPaymentsProvider?.value || '';
  const from = parseDateInput(churchPaymentsFrom?.value);
  const toRaw = churchPaymentsTo?.value;
  const to = toRaw ? new Date(`${toRaw}T23:59:59`) : null;

  return (list || []).filter((payment) => {
    const booking = payment.booking || {};
    const searchable = [
      booking.contact_name,
      booking.contact_email,
      booking.contact_phone,
      booking.contact_church,
      payment.reference,
      payment.provider_tx_id,
      payment.booking_id,
      payment.id,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    if (query && !searchable.includes(query)) return false;
    if (status && payment.status !== status) return false;
    if (provider && payment.provider !== provider) return false;
    if (from || to) {
      const created = payment.created_at ? new Date(payment.created_at) : null;
      if (!created || Number.isNaN(created.getTime())) return false;
      if (from && created < from) return false;
      if (to && created > to) return false;
    }
    return true;
  });
}

function renderChurchPayments(list) {
  if (!churchPaymentsList || !churchPaymentsEmpty) return;
  churchPaymentsList.innerHTML = '';
  if (!list.length) {
    churchPaymentsEmpty.classList.remove('hidden');
    churchPaymentsList.classList.add('hidden');
    return;
  }
  churchPaymentsEmpty.classList.add('hidden');
  churchPaymentsList.classList.remove('hidden');

  list.forEach((payment) => {
    const booking = payment.booking || {};
    const providerLabel = payment.provider ? payment.provider.toUpperCase() : '—';
    const statusLabel = payment.status || 'PENDING';
    const methodLabel = payment.method || '—';
    const referenceLabel = (payment.reference || payment.id || '').toString();
    const card = document.createElement('div');
    card.className = 'rounded-2xl border border-slate-200 bg-white px-4 py-4';
    card.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Pago</p>
          <p class="text-sm font-bold text-[#293C74]">${formatCurrency(payment.amount, payment.currency)}</p>
          <p class="text-xs text-slate-500">${providerLabel} · ${statusLabel}</p>
        </div>
        <div class="text-right">
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Referencia</p>
          <p class="text-xs font-bold text-[#293C74]">#${referenceLabel.slice(0, 10).toUpperCase()}</p>
          <p class="text-xs text-slate-500">${formatDate(payment.created_at)}</p>
        </div>
      </div>
      <div class="mt-2 text-xs text-slate-500">
        ${booking.contact_name || booking.contact_email || 'Sin nombre'}
        ${booking.contact_email ? ` · ${booking.contact_email}` : ''}
      </div>
      <div class="mt-2 text-[11px] text-slate-400">Método: ${methodLabel}</div>
    `;
    churchPaymentsList.appendChild(card);
  });
}

function filterChurchInstallments(list) {
  const query = churchInstallmentsSearch?.value?.trim().toLowerCase() || '';
  const status = churchInstallmentsStatusFilter?.value || '';
  return (list || []).filter((item) => {
    const booking = item.booking || {};
    const searchable = [
      booking.contact_name,
      booking.contact_email,
      booking.contact_phone,
      booking.contact_church,
      item.provider_reference,
      item.booking_id,
      item.id,
    ]
      .filter(Boolean)
      .join(' ')
      .toLowerCase();
    if (query && !searchable.includes(query)) return false;
    if (status && item.status !== status) return false;
    return true;
  });
}

function renderChurchInstallments(list) {
  if (!churchInstallmentsList || !churchInstallmentsEmpty) return;
  churchInstallmentsList.innerHTML = '';
  if (!list.length) {
    churchInstallmentsEmpty.classList.remove('hidden');
    churchInstallmentsList.classList.add('hidden');
    return;
  }
  churchInstallmentsEmpty.classList.add('hidden');
  churchInstallmentsList.classList.remove('hidden');

  list.forEach((item) => {
    const booking = item.booking || {};
    const plan = item.plan || {};
    const statusLabel = item.status || 'PENDING';
    const statusClass = statusLabel === 'PAID'
      ? 'bg-green-100 text-green-700'
      : statusLabel === 'FAILED'
        ? 'bg-red-100 text-red-700'
        : 'bg-yellow-100 text-yellow-700';
    const amountLabel = formatCurrency(item.amount, item.currency || plan.currency);
    const dueLabel = formatDate(item.due_date);
    const reminderLabel = item.last_reminder?.sent_at ? formatDateTime(item.last_reminder.sent_at) : '—';
    const linkLabel = item.last_link?.created_at ? formatDateTime(item.last_link.created_at) : '—';
    const isAuto = (plan.provider === 'wompi' && plan.provider_payment_method_id)
      || (plan.provider === 'stripe' && plan.provider_subscription_id);
    const chargeLabel = isAuto ? 'Auto' : 'Manual';
    const chargeClass = isAuto ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700';
    const actionsHtml = isAuto
      ? '<div class="text-xs font-semibold text-emerald-700">Cobro automático activo</div>'
      : `
        <button class="church-installment-action px-3 py-2 rounded-xl bg-[#293C74] text-white text-xs font-bold hover:shadow-md transition" data-action="copy-link" data-installment="${item.id}">
          Copiar link
        </button>
        <button class="church-installment-action px-3 py-2 rounded-xl bg-white border border-slate-200 text-[#293C74] text-xs font-bold hover:bg-slate-50 transition" data-action="send-reminder" data-installment="${item.id}">
          Enviar recordatorio
        </button>
      `;

    const card = document.createElement('div');
    card.className = 'rounded-2xl border border-slate-200 bg-white px-4 py-4';
    card.innerHTML = `
      <div class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">Cuota</p>
          <p class="text-sm font-bold text-[#293C74]">${amountLabel}</p>
          <p class="text-xs text-slate-500">Vence: ${dueLabel}</p>
          <p class="text-xs text-slate-500">${booking.contact_name || booking.contact_email || 'Sin nombre'}</p>
          <p class="text-[11px] text-slate-400">Ref: ${(item.provider_reference || item.id).toString().slice(0, 12).toUpperCase()}</p>
        </div>
        <div class="text-right space-y-2">
          <span class="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusClass}">${statusLabel}</span>
          <span class="inline-flex px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${chargeClass}">Cobro ${chargeLabel}</span>
          <div class="text-[11px] text-slate-400">Último link: ${linkLabel}</div>
          <div class="text-[11px] text-slate-400">Último recordatorio: ${reminderLabel}</div>
        </div>
      </div>
      <div class="mt-3 flex flex-wrap gap-2">
        ${actionsHtml}
      </div>
    `;
    churchInstallmentsList.appendChild(card);
  });
}

async function loadChurchBookings(headers = {}) {
  if (!churchBookingsList || !churchBookingsEmpty) return;
  if (portalIsAdmin && !portalSelectedChurchId && !portalIsCustomChurch) {
    churchBookingsEmpty.textContent = 'Selecciona una iglesia para ver los registros.';
    churchBookingsEmpty.classList.remove('hidden');
    churchBookingsList.classList.add('hidden');
    return;
  }
  try {
    const url = new URL('/api/portal/iglesia/bookings', window.location.origin);
    const resolvedId = resolveSelectedChurchId();
    if (resolvedId) url.searchParams.set('churchId', resolvedId);
    const res = await fetch(url.toString(), { headers, credentials: 'include' });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo cargar');
    churchBookingsData = payload.bookings || [];
    const filtered = filterChurchBookings(churchBookingsData);
    renderChurchBookings(filtered);
  } catch (err) {
    console.error(err);
  }
}

async function loadChurchInstallments(headers = {}) {
  if (!churchInstallmentsList || !churchInstallmentsEmpty) return;
  if (portalIsAdmin && !portalSelectedChurchId && !portalIsCustomChurch) {
    churchInstallmentsEmpty.textContent = 'Selecciona una iglesia para ver las cuotas.';
    churchInstallmentsEmpty.classList.remove('hidden');
    churchInstallmentsList.classList.add('hidden');
    return;
  }
  try {
    if (churchInstallmentsStatusMsg) {
      churchInstallmentsStatusMsg.textContent = 'Cargando cuotas...';
    }
    const url = new URL('/api/portal/iglesia/installments', window.location.origin);
    const resolvedId = resolveSelectedChurchId();
    if (resolvedId) url.searchParams.set('churchId', resolvedId);
    const res = await fetch(url.toString(), { headers, credentials: 'include' });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo cargar');
    churchInstallmentsData = payload.installments || [];
    renderChurchInstallments(filterChurchInstallments(churchInstallmentsData));
    if (churchInstallmentsStatusMsg) {
      churchInstallmentsStatusMsg.textContent = '';
    }
  } catch (err) {
    console.error(err);
    if (churchInstallmentsStatusMsg) {
      churchInstallmentsStatusMsg.textContent = err?.message || 'No se pudo cargar.';
    }
  }
}

async function loadChurchPayments(headers = {}) {
  if (!churchPaymentsList || !churchPaymentsEmpty) return;
  if (portalIsAdmin && !portalSelectedChurchId && !portalIsCustomChurch) {
    churchPaymentsEmpty.textContent = 'Selecciona una iglesia para ver los pagos.';
    churchPaymentsEmpty.classList.remove('hidden');
    churchPaymentsList.classList.add('hidden');
    return;
  }
  try {
    const url = new URL('/api/portal/iglesia/payments', window.location.origin);
    const resolvedId = resolveSelectedChurchId();
    if (resolvedId) url.searchParams.set('churchId', resolvedId);
    url.searchParams.set('status', 'APPROVED');
    const res = await fetch(url.toString(), { headers, credentials: 'include' });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo cargar');
    churchPaymentsData = payload.payments || [];
    const filtered = filterChurchPayments(churchPaymentsData);
    renderChurchPayments(filtered);
  } catch (err) {
    console.error(err);
  }
}

function filterChurchMembers(list) {
  const query = churchMembersSearch?.value?.trim().toLowerCase() || '';
  const role = churchMembersRole?.value || '';
  return (list || []).filter((member) => {
    const profile = member.profile || {};
    const searchable = [profile.full_name, profile.email].filter(Boolean).join(' ').toLowerCase();
    if (query && !searchable.includes(query)) return false;
    if (role && member.role !== role) return false;
    return true;
  });
}

function renderChurchMembers(list) {
  if (!churchMembersList || !churchMembersEmpty) return;
  if (!list.length) {
    churchMembersEmpty.classList.remove('hidden');
    churchMembersList.classList.add('hidden');
    return;
  }
  churchMembersEmpty.classList.add('hidden');
  churchMembersList.classList.remove('hidden');
  churchMembersList.innerHTML = '';
  list.forEach((member) => {
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
}

async function loadChurchMembers(headers = {}) {
  if (!churchMembersList || !churchMembersEmpty) return;
  if (portalIsAdmin && !portalSelectedChurchId && !portalIsCustomChurch) {
    churchMembersEmpty.textContent = 'Selecciona una iglesia para ver el equipo.';
    churchMembersEmpty.classList.remove('hidden');
    churchMembersList.classList.add('hidden');
    return;
  }
  try {
    const url = new URL('/api/portal/iglesia/members', window.location.origin);
    const resolvedId = resolveSelectedChurchId();
    if (resolvedId) url.searchParams.set('churchId', resolvedId);
    const res = await fetch(url.toString(), { headers, credentials: 'include' });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo cargar');
    churchMembersData = payload.members || [];
    const filtered = filterChurchMembers(churchMembersData);
    renderChurchMembers(filtered);
  } catch (err) {
    console.error(err);
  }
}

async function exportChurchBookings() {
  if (!churchExportBtn || !churchExportStatus) return;
  const resolvedId = resolveSelectedChurchId();
  if (!resolvedId) {
    churchExportStatus.textContent = 'Selecciona una iglesia antes de exportar.';
    return;
  }
  churchExportStatus.textContent = 'Preparando export...';
  try {
    const url = new URL('/api/portal/iglesia/export', window.location.origin);
    url.searchParams.set('churchId', resolvedId);
    const res = await fetch(url.toString(), { headers: portalAuthHeaders });
    if (!res.ok) {
      const payload = await res.json().catch(() => null);
      throw new Error(payload?.error || 'No se pudo exportar');
    }
    const blob = await res.blob();
    const filename = res.headers.get('content-disposition')?.split('filename=')?.[1]?.replace(/"/g, '') || 'portal-iglesia.csv';
    const link = document.createElement('a');
    link.href = window.URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    link.remove();
    churchExportStatus.textContent = 'Export listo.';
  } catch (err) {
    console.error(err);
    churchExportStatus.textContent = err?.message || 'No se pudo exportar.';
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

async function loadAdminFollowups(headers = {}) {
  if (!adminFollowupsCard) return;
  if (!portalIsAdmin) {
    adminFollowupsCard.classList.add('hidden');
    return;
  }
  adminFollowupsCard.classList.remove('hidden');
  if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'Cargando alertas...';
  try {
    const res = await fetch('/api/portal/admin/cumbre/issues', { headers });
    const payload = await res.json();
    if (!res.ok || !payload.ok) throw new Error(payload.error || 'No se pudo cargar');
    adminIssuesData = payload.items || [];
    adminIssuesCounts = payload.counts || {};
    renderAdminFollowups(adminIssuesData, adminIssuesCounts);
  } catch (err) {
    console.error(err);
    if (adminFollowupsStatus) {
      adminFollowupsStatus.textContent = err?.message || 'No se pudo cargar alertas.';
    }
    if (adminFollowupsEmpty) adminFollowupsEmpty.classList.remove('hidden');
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

function getIssueBadge(type) {
  const map = {
    registration_incomplete: { label: 'Registro incompleto', className: 'bg-amber-50 text-amber-700 border-amber-100' },
    payment_pending: { label: 'Pago pendiente', className: 'bg-sky-50 text-sky-700 border-sky-100' },
    payment_mismatch: { label: 'Descuadre pago', className: 'bg-rose-50 text-rose-700 border-rose-100' },
    overpaid: { label: 'Pago duplicado', className: 'bg-pink-50 text-pink-700 border-pink-100' },
    no_church: { label: 'Sin iglesia', className: 'bg-slate-100 text-slate-600 border-slate-200' },
  };
  return map[type] || { label: 'Alerta', className: 'bg-slate-100 text-slate-600 border-slate-200' };
}

function updateAdminFollowupsFilters(counts = {}, total = 0) {
  if (!adminFollowupsFilters) return;
  adminFollowupsFilters.querySelectorAll('[data-filter]').forEach((button) => {
    const filter = button.dataset.filter || 'all';
    const count = filter === 'all' ? total : (counts[filter] || 0);
    const countEl = button.querySelector('[data-count]');
    if (countEl) countEl.textContent = `${count}`;

    if (filter === adminIssuesFilter) {
      button.classList.remove('bg-white', 'text-slate-500', 'border-slate-100');
      button.classList.add('bg-[#293C74]', 'text-white', 'border-transparent');
    } else {
      button.classList.add('bg-white', 'text-slate-500', 'border-slate-100');
      button.classList.remove('bg-[#293C74]', 'text-white', 'border-transparent');
    }
  });
}

function normalizeWhatsappPhone(value) {
  if (!value) return '';
  const digits = String(value).replace(/\D/g, '');
  if (digits.length === 10) return `57${digits}`;
  return digits;
}

function buildWhatsappMessage(item, ctaUrl = '') {
  const name = item.contact_name || 'Hola';
  const bookingRef = (item.booking_id || item.id || '').slice(0, 8).toUpperCase();
  switch (item.type) {
    case 'registration_incomplete':
      const missingFields = Array.isArray(item.missing_fields)
        ? item.missing_fields.join(', ')
        : (item.missing_fields || 'datos del registro');
      return `Hola ${name}, vimos tu pago para la Cumbre Mundial 2026. Falta completar: ${missingFields}. ${ctaUrl ? `Completa aqui: ${ctaUrl}. ` : ''}Booking: ${bookingRef}.`;
    case 'payment_pending':
      return `Hola ${name}, tu pago esta en verificacion. Si pagaste con PSE/Nequi puede tardar unos minutos. No hagas otro pago. Booking: ${bookingRef}.`;
    case 'payment_mismatch':
      return `Hola ${name}, estamos revisando tu pago porque aparece aprobado pero no se actualizo el registro. Nuestro equipo lo esta corrigiendo. Booking: ${bookingRef}.`;
    case 'overpaid':
      return `Hola ${name}, detectamos un pago adicional en tu reserva de la Cumbre. Nuestro equipo esta revisando para ayudarte. Booking: ${bookingRef}.`;
    case 'no_church':
      return `Hola ${name}, necesitamos confirmar tu iglesia o sede para la Cumbre Mundial 2026. Responde con el nombre de tu iglesia y ciudad. Booking: ${bookingRef}.`;
    default:
      return `Hola ${name}, estamos revisando tu registro de la Cumbre Mundial 2026. Booking: ${bookingRef}.`;
  }
}

function renderAdminFollowups(items, counts = {}) {
  if (!adminFollowupsList || !adminFollowupsEmpty) return;
  adminFollowupsList.innerHTML = '';

  const total = items.length || 0;
  if (adminFollowupsCount) adminFollowupsCount.textContent = `${total}`;
  updateAdminFollowupsFilters(counts, total);

  const filteredItems = adminIssuesFilter === 'all'
    ? items
    : items.filter((item) => item.type === adminIssuesFilter);

  if (!filteredItems.length) {
    adminFollowupsEmpty.classList.remove('hidden');
    adminFollowupsList.classList.add('hidden');
    if (adminFollowupsStatus) adminFollowupsStatus.textContent = total ? 'No hay alertas en este filtro.' : '';
    return;
  }

  adminFollowupsEmpty.classList.add('hidden');
  adminFollowupsList.classList.remove('hidden');
  if (adminFollowupsStatus) {
    adminFollowupsStatus.textContent = `Mostrando ${filteredItems.length} alertas.`;
  }

  const churchOptions = (portalChurchesCatalog || [])
    .map((church) => `<option value="${church.id}">${church.name}</option>`)
    .join('');

  filteredItems.forEach((item) => {
    const badge = getIssueBadge(item.type);
    const contactLabel = item.contact_name || item.contact_email || 'Participante';
    const createdLabel = formatDateTime(item.created_at);
    const amountValue = item.total_paid != null ? item.total_paid : item.total_amount;
    const amountLabel = amountValue != null ? formatCurrency(amountValue, item.currency) : '-';
    const bookingRef = (item.booking_id || item.id || '').slice(0, 8).toUpperCase();
    const paymentAmountLabel = item.payment?.amount != null
      ? formatCurrency(item.payment.amount, item.payment.currency || item.currency)
      : '-';
    const paymentInfo = item.payment
      ? `${item.payment.provider || 'Pago'} · ${item.payment.status || ''} · ${paymentAmountLabel}`
      : '';
    const lastWhatsapp = item.last_whatsapp;
    const whatsappSender = lastWhatsapp?.sent_by_name || lastWhatsapp?.sent_by_email || '';
    const whatsappStatusLabel = lastWhatsapp?.sent_at
      ? `WhatsApp enviado${whatsappSender ? ` por ${whatsappSender}` : ''} · ${formatDateTime(lastWhatsapp.sent_at)}`
      : '';

    let detail = '';
    if (item.type === 'registration_incomplete') {
      const missing = Array.isArray(item.missing_fields) && item.missing_fields.length
        ? item.missing_fields.join(', ')
        : 'Datos incompletos';
      detail = `Faltan datos: ${missing}`;
    }
    if (item.type === 'payment_pending') {
      detail = paymentInfo || 'Pago en verificación.';
    }
    if (item.type === 'payment_mismatch') {
      detail = `Pagos aprobados: ${formatCurrency(item.approved_total, item.currency)} · Registrado: ${formatCurrency(item.total_paid, item.currency)}`;
    }
    if (item.type === 'overpaid') {
      detail = `Pagado: ${formatCurrency(item.total_paid, item.currency)} · Total: ${formatCurrency(item.total_amount, item.currency)}`;
    }
    if (item.type === 'no_church') {
      detail = 'Sin iglesia registrada.';
    }

    const canEmail = ['registration_incomplete', 'payment_pending'].includes(item.type);
    const canRecompute = item.type === 'payment_mismatch';
    const canAssignChurch = item.type === 'no_church';
    const whatsappLabel = item.contact_phone ? 'WhatsApp' : 'Copiar WhatsApp';

    const card = document.createElement('div');
    card.className = 'admin-issue-card rounded-2xl border border-slate-200 bg-white p-4 space-y-3';
    card.dataset.booking = item.id;
    card.dataset.type = item.type;
    card.innerHTML = `
      <div class="flex items-start justify-between gap-4">
        <div class="min-w-0">
          <div class="flex items-center gap-2 mb-2 flex-wrap">
            <span class="inline-flex items-center gap-1 px-2 py-1 rounded-md border text-[10px] font-bold uppercase tracking-widest ${badge.className}">${badge.label}</span>
            <span class="text-[10px] uppercase tracking-widest text-slate-400">#${bookingRef}</span>
          </div>
          <p class="text-sm font-bold text-[#293C74] truncate">${contactLabel}</p>
          <p class="text-xs text-slate-500 truncate">${item.contact_email || '-'}</p>
          <p class="text-xs text-slate-400 truncate">${item.contact_phone || 'Sin teléfono'}</p>
        </div>
        <div class="text-right">
          <p class="text-[10px] uppercase tracking-widest text-slate-400">Pagado</p>
          <p class="text-sm font-bold text-brand-teal">${amountLabel}</p>
          <p class="text-[10px] text-slate-400 mt-2">${createdLabel}</p>
        </div>
      </div>
      <div class="rounded-xl bg-slate-50/70 border border-slate-100 px-3 py-2 text-xs text-slate-600">
        ${detail || 'Alerta pendiente de revisión.'}
      </div>
      <p class="text-[10px] uppercase tracking-widest text-slate-400" data-field="whatsapp-status">${whatsappStatusLabel}</p>
      ${canAssignChurch ? `
        <div class="flex flex-col md:flex-row md:items-center gap-2">
          <select data-role="assign-church" class="flex-1 bg-white border border-slate-200 rounded-lg px-3 py-2 text-xs font-semibold text-[#293C74]">
            <option value="">Selecciona iglesia</option>
            <option value="__virtual__">Ministerio Virtual</option>
            ${churchOptions}
          </select>
          <button data-action="assign-church" data-booking="${item.id}" class="px-3 py-2 rounded-lg bg-slate-900 text-white text-xs font-bold hover:bg-slate-800">
            Asignar
          </button>
        </div>
      ` : ''}
      <div class="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
        <span class="text-[10px] uppercase tracking-widest text-slate-400">Estado: ${item.status || '-'}</span>
        <div class="flex items-center gap-2">
          ${canRecompute ? `
            <button data-action="recompute" data-booking="${item.id}" class="px-3 py-2 rounded-lg bg-white border border-slate-200 text-xs font-bold text-[#293C74] hover:bg-slate-100">
              Recalcular
            </button>
          ` : ''}
          ${canEmail ? `
            <button data-action="notify-email" data-booking="${item.id}" data-kind="${item.type}" class="px-3 py-2 rounded-lg bg-[#293C74] text-white text-xs font-bold hover:bg-[#293C74]/90">
              Enviar correo
            </button>
          ` : ''}
          <button data-action="whatsapp" data-booking="${item.id}" class="px-3 py-2 rounded-lg bg-teal-600 text-white text-xs font-bold hover:bg-teal-700">
            ${whatsappLabel}
          </button>
        </div>
      </div>
    `;
    adminFollowupsList.appendChild(card);
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
    if (draft.churchId) {
      portalSelectedChurchId = draft.churchId;
      if (churchSelectorInput) {
        churchSelectorInput.value = draft.churchId;
      }
    }
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
    churchId: resolveSelectedChurchId(),
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
  if (portalIsAdmin && !resolveSelectedChurchId() && !portalIsCustomChurch) {
    if (churchFormStatus) {
      churchFormStatus.textContent = 'Selecciona una iglesia en el panel superior antes de registrar.';
    }
    churchForm.classList.add('hidden');
    if (churchFormToggle) {
      churchFormToggle.textContent = 'Abrir formulario';
    }
  }
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
    if (portalIsAdmin && !resolveSelectedChurchId() && !portalIsCustomChurch) {
      churchFormStatus.textContent = 'Selecciona una iglesia en el panel superior.';
      return;
    }
    if (portalIsAdmin && portalIsCustomChurch && !churchNameInput?.value?.trim()) {
      churchFormStatus.textContent = 'Escribe el nombre de la iglesia.';
      return;
    }
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
      churchId: resolveSelectedChurchId(),
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
      await loadChurchPayments();
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
        <div class="flex justify-between items-center mt-2">
            <p class="text-[10px] text-white/50 truncate max-w-[150px]">${booking.church_name || 'Sin iglesia'}</p>
            ${booking.status !== 'PAID' ? `
            <a href="https://wa.me/${booking.participant_phone || ''}?text=${encodeURIComponent(`Hola ${booking.participant_name || ''}, te recordamos tu compromiso con la Cumbre 2026. Tu saldo pendiente es de $${booking.total_amount - booking.total_paid}.`)}" 
               target="_blank"
               class="flex items-center gap-1 text-[10px] bg-green-500/10 text-green-400 px-2 py-1 rounded-lg hover:bg-green-500/20 transition-colors">
               <svg xmlns="http://www.w3.org/2000/svg" class="h-3 w-3" fill="currentColor" viewBox="0 0 24 24"><path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.463 1.065 2.876 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg>
               Recordar
            </a>` : ''}
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

function setupAdminFilters(allBookings) {
  if (document.getElementById('admin-filters-container')) return;

  // Get unique cities and churches
  const cities = [...new Set(allBookings.map(b => b.city || b.church_city))].filter(Boolean).sort();
  const churches = [...new Set(allBookings.map(b => b.church_name))].filter(Boolean).sort();

  const container = document.createElement('div');
  container.id = 'admin-filters-container';
  container.className = 'flex flex-wrap gap-2 mb-4';

  // City Select
  const citySelect = document.createElement('select');
  citySelect.className = 'bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal';
  citySelect.innerHTML = '<option value="">Todas las ciudades</option>' + cities.map(c => `<option value="${c}">${c}</option>`).join('');

  // Church Select
  const churchSelect = document.createElement('select');
  churchSelect.className = 'bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-xs text-white outline-none focus:border-brand-teal';
  churchSelect.innerHTML = '<option value="">Todas las iglesias</option>' + churches.map(c => `<option value="${c}">${c}</option>`).join('');

  // Event Listeners
  const applyFilters = () => {
    const selectedCity = citySelect.value;
    const selectedChurch = churchSelect.value;

    const filtered = allBookings.filter(b => {
      if (selectedCity && (b.city !== selectedCity && b.church_city !== selectedCity)) return false;
      if (selectedChurch && b.church_name !== selectedChurch) return false;
      return true;
    });

    renderBookings(filtered);
  };

  citySelect.addEventListener('change', applyFilters);
  churchSelect.addEventListener('change', applyFilters);

  container.appendChild(citySelect);
  container.appendChild(churchSelect);

  // Insert before list
  if (bookingsList && bookingsList.parentNode) {
    bookingsList.parentNode.insertBefore(container, bookingsList);
  }
}

function renderInstallments(installments, plans, bookings) {
  if (!installmentsList || !installmentsEmpty) return;
  const pending = (installments || []).filter((item) => ['PENDING', 'FAILED'].includes(item.status));
  installmentsList.innerHTML = '';
  if (!pending.length) {
    installmentsEmpty.classList.remove('hidden');
    return;
  }
  installmentsEmpty.classList.add('hidden');
  pending.forEach((installment) => {
    const plan = plans.find((item) => item.id === installment.plan_id) || {};
    const booking = bookings.find((item) => item.id === installment.booking_id) || {};
    const statusLabel = installment.status === 'FAILED' ? 'Fallido' : 'Pendiente';
    const statusClass = installment.status === 'FAILED' ? 'bg-red-100 text-red-600' : 'bg-yellow-100 text-yellow-700';
    const installmentLabel = plan.installment_count
      ? `Cuota ${installment.installment_index}/${plan.installment_count}`
      : `Cuota ${installment.installment_index}`;
    const currency = plan.currency || installment.currency;
    const amountLabel = formatCurrency(installment.amount, currency);
    const dueLabel = formatDate(installment.due_date);

    const card = document.createElement('div');
    card.className = 'rounded-2xl border border-slate-200 bg-white px-5 py-4 flex flex-col gap-3 md:flex-row md:items-center md:justify-between';
    card.innerHTML = `
      <div>
        <p class="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1">${installmentLabel}</p>
        <p class="text-sm font-bold text-[#293C74]">${amountLabel}</p>
        <p class="text-xs text-slate-500">Vence: ${dueLabel}</p>
        <p class="text-[11px] text-slate-400 mt-1">${booking.contact_name || booking.contact_email || ''}</p>
      </div>
      <div class="flex items-center gap-3">
        <span class="px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest ${statusClass}">${statusLabel}</span>
        <button class="installment-pay px-4 py-2 rounded-xl bg-[#293C74] text-white text-xs font-bold hover:shadow-md transition" data-installment="${installment.id}">
          Pagar ahora
        </button>
      </div>
    `;
    installmentsList.appendChild(card);
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
        documentType: profileDocumentType?.value || '',
        documentNumber: profileDocumentNumber?.value?.trim() || '',
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
    showPortalAlert('No pudimos actualizar tu plan. Intenta nuevamente.');
    target.textContent = originalText;
    target.disabled = false;
  }
}

async function handleInstallmentPay(event) {
  const target = event.target.closest('.installment-pay');
  if (!target) return;
  const installmentId = target.dataset.installment;
  if (!installmentId) return;

  const originalText = target.textContent;
  target.textContent = 'Generando...';
  target.disabled = true;

  try {
    const res = await fetch('/api/cuenta/installments/link', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...portalAuthHeaders },
      body: JSON.stringify({ installmentId }),
    });
    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo generar el link');
    if (data.url) {
      window.open(data.url, '_blank', 'noopener,noreferrer');
    }
    target.textContent = 'Link generado';
  } catch (err) {
    console.error(err);
    target.textContent = originalText;
    showPortalAlert(err.message || 'No se pudo generar el link.');
  } finally {
    setTimeout(() => {
      target.disabled = false;
      target.textContent = originalText;
    }, 2500);
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
    showPortalAlert(err.message || 'No se pudo actualizar el rol.');
  }
});

adminFollowupsFilters?.addEventListener('click', (event) => {
  const target = event.target.closest('[data-filter]');
  if (!target) return;
  adminIssuesFilter = target.dataset.filter || 'all';
  renderAdminFollowups(adminIssuesData, adminIssuesCounts);
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
    showPortalAlert(err.message || 'No se pudo enviar.');
  }
});

adminFollowupsList?.addEventListener('click', async (event) => {
  const target = event.target.closest('[data-action]');
  if (!target) return;
  const action = target.dataset.action;
  const bookingId = target.dataset.booking;
  if (!bookingId) return;

  if (action === 'notify-email') {
    const kind = target.dataset.kind || 'registration_incomplete';
    const originalText = target.textContent;
    target.textContent = 'Enviando...';
    target.setAttribute('disabled', 'disabled');
    if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'Enviando correo...';

    try {
      const res = await fetch('/api/portal/admin/cumbre/notify', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...portalAuthHeaders },
        body: JSON.stringify({ bookingId, kind }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo enviar');
      target.textContent = 'Enviado';
      if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'Correo enviado.';
      setTimeout(() => {
        loadAdminFollowups(portalAuthHeaders);
      }, 800);
    } catch (err) {
      console.error(err);
      target.textContent = originalText;
      target.removeAttribute('disabled');
      if (adminFollowupsStatus) adminFollowupsStatus.textContent = err?.message || 'No se pudo enviar el correo.';
      showPortalAlert(err?.message || 'No se pudo enviar el correo.');
    }
    return;
  }

  if (action === 'recompute') {
    const originalText = target.textContent;
    target.textContent = 'Recalculando...';
    target.setAttribute('disabled', 'disabled');
    if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'Recalculando totales...';
    try {
      const res = await fetch('/api/portal/admin/cumbre/recompute', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...portalAuthHeaders },
        body: JSON.stringify({ bookingId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo recalcular');
      if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'Totales actualizados.';
      target.textContent = 'Listo';
      setTimeout(() => {
        loadAdminFollowups(portalAuthHeaders);
      }, 800);
    } catch (err) {
      console.error(err);
      target.textContent = originalText;
      target.removeAttribute('disabled');
      if (adminFollowupsStatus) adminFollowupsStatus.textContent = err?.message || 'No se pudo recalcular.';
      showPortalAlert(err?.message || 'No se pudo recalcular.');
    }
    return;
  }

  if (action === 'assign-church') {
    const card = target.closest('.admin-issue-card');
    const select = card?.querySelector('[data-role=\"assign-church\"]');
    if (!(select instanceof HTMLSelectElement)) return;
    const churchId = select.value;
    const churchName = churchId === '__virtual__'
      ? 'Ministerio Virtual'
      : select.options[select.selectedIndex]?.text || '';
    if (!churchId) {
      if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'Selecciona una iglesia.';
      return;
    }
    const originalText = target.textContent;
    target.textContent = 'Asignando...';
    target.setAttribute('disabled', 'disabled');
    if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'Asignando iglesia...';
    try {
      const res = await fetch('/api/portal/admin/cumbre/assign-church', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...portalAuthHeaders },
        body: JSON.stringify({ bookingId, churchId, churchName }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo asignar');
      if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'Iglesia asignada.';
      target.textContent = 'Listo';
      setTimeout(() => {
        loadAdminFollowups(portalAuthHeaders);
      }, 800);
    } catch (err) {
      console.error(err);
      target.textContent = originalText;
      target.removeAttribute('disabled');
      if (adminFollowupsStatus) adminFollowupsStatus.textContent = err?.message || 'No se pudo asignar.';
      showPortalAlert(err?.message || 'No se pudo asignar.');
    }
    return;
  }

  if (action === 'whatsapp') {
    const card = target.closest('.admin-issue-card');
    const issueType = card?.dataset.type;
    const item = adminIssuesData.find((entry) => entry.id === bookingId && (!issueType || entry.type === issueType));
    if (!item) return;
    const originalText = target.textContent;
    target.textContent = 'Enviando...';
    target.setAttribute('disabled', 'disabled');
    if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'Enviando WhatsApp...';
    let sentViaApi = false;
    try {
      const res = await fetch('/api/portal/admin/cumbre/notify', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...portalAuthHeaders },
        body: JSON.stringify({ bookingId, kind: item.type, channel: 'whatsapp' }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok || !data.ok) {
        if (data?.alreadySent) {
          const sender = data.sent_by_name || data.sent_by_email || '';
          const statusEl = card?.querySelector('[data-field="whatsapp-status"]');
          if (statusEl && data.sent_at) {
            statusEl.textContent = `WhatsApp enviado${sender ? ` por ${sender}` : ''} · ${formatDateTime(data.sent_at)}`;
            statusEl.classList.add('text-emerald-600');
          }
          if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'Ya estaba enviado.';
          return;
        }
        throw new Error(data.error || 'No se pudo enviar WhatsApp');
      }
      sentViaApi = true;
      if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'WhatsApp enviado.';
      const statusEl = card?.querySelector('[data-field="whatsapp-status"]');
      if (statusEl) {
        const sentAt = new Date();
        statusEl.textContent = `WhatsApp enviado · ${sentAt.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}`;
        statusEl.classList.add('text-emerald-600');
      }
    } catch (err) {
      console.error(err);
      if (!sentViaApi) {
        try {
          let ctaUrl = '';
          if (item.type === 'registration_incomplete') {
            const linkRes = await fetch('/api/portal/admin/cumbre/link', {
              method: 'POST',
              headers: { 'content-type': 'application/json', ...portalAuthHeaders },
              body: JSON.stringify({ bookingId }),
            });
            const linkData = await linkRes.json();
            if (!linkRes.ok || !linkData.ok) throw new Error(linkData.error || 'No se pudo generar el link');
            ctaUrl = linkData.ctaUrl || '';
          }

          const message = buildWhatsappMessage(item, ctaUrl);
          const phone = normalizeWhatsappPhone(item.contact_phone || '');
          if (phone) {
            const url = `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
            window.open(url, '_blank', 'noopener,noreferrer');
          } else {
            try {
              await navigator.clipboard.writeText(message);
              showPortalAlert('Mensaje copiado. Pégalo en WhatsApp.');
            } catch (copyErr) {
              window.prompt('Copia este mensaje para WhatsApp:', message);
            }
          }
          if (adminFollowupsStatus) adminFollowupsStatus.textContent = 'Mensaje listo.';
          const statusEl = card?.querySelector('[data-field="whatsapp-status"]');
          if (statusEl) {
            const sentAt = new Date();
            statusEl.textContent = `Mensaje preparado · ${sentAt.toLocaleString('es-CO', { dateStyle: 'medium', timeStyle: 'short' })}`;
            statusEl.classList.add('text-amber-600');
          }
        } catch (fallbackErr) {
          console.error(fallbackErr);
          if (adminFollowupsStatus) {
            adminFollowupsStatus.textContent = fallbackErr?.message || err?.message || 'No se pudo preparar WhatsApp.';
          }
          showPortalAlert(fallbackErr?.message || err?.message || 'No se pudo preparar WhatsApp.');
        }
      }
    } finally {
      target.textContent = originalText;
      target.removeAttribute('disabled');
    }
  }
});

churchInstallmentsList?.addEventListener('click', async (event) => {
  const target = event.target.closest('.church-installment-action');
  if (!target) return;
  const action = target.dataset.action;
  const installmentId = target.dataset.installment;
  if (!action || !installmentId) return;

  const original = target.textContent;
  target.textContent = '...';
  target.setAttribute('disabled', 'disabled');

  try {
    if (action === 'copy-link') {
      const res = await fetch('/api/portal/iglesia/installments/link', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...portalAuthHeaders },
        body: JSON.stringify({ installmentId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo generar el link');
      if (data.url) {
        try {
          await navigator.clipboard.writeText(data.url);
        } catch (err) {
          window.prompt('Copia el link de pago:', data.url);
        }
      }
      target.textContent = 'Link copiado';
    } else if (action === 'send-reminder') {
      const res = await fetch('/api/portal/iglesia/installments/remind', {
        method: 'POST',
        headers: { 'content-type': 'application/json', ...portalAuthHeaders },
        body: JSON.stringify({ installmentId }),
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'No se pudo enviar');
      target.textContent = 'Recordatorio enviado';
      await loadChurchInstallments(portalAuthHeaders);
    }
  } catch (err) {
    console.error(err);
    target.textContent = original;
    showPortalAlert(err.message || 'No se pudo completar la acción.');
  } finally {
    setTimeout(() => {
      target.removeAttribute('disabled');
      target.textContent = original;
    }, 2500);
  }
});

churchBookingsSearch?.addEventListener('input', () => {
  renderChurchBookings(filterChurchBookings(churchBookingsData));
});
churchBookingsStatus?.addEventListener('change', () => {
  renderChurchBookings(filterChurchBookings(churchBookingsData));
});
churchPaymentsSearch?.addEventListener('input', () => {
  renderChurchPayments(filterChurchPayments(churchPaymentsData));
});
churchPaymentsStatus?.addEventListener('change', () => {
  renderChurchPayments(filterChurchPayments(churchPaymentsData));
});
churchPaymentsProvider?.addEventListener('change', () => {
  renderChurchPayments(filterChurchPayments(churchPaymentsData));
});
churchPaymentsFrom?.addEventListener('change', () => {
  renderChurchPayments(filterChurchPayments(churchPaymentsData));
});
churchPaymentsTo?.addEventListener('change', () => {
  renderChurchPayments(filterChurchPayments(churchPaymentsData));
});
churchInstallmentsSearch?.addEventListener('input', () => {
  renderChurchInstallments(filterChurchInstallments(churchInstallmentsData));
});
churchInstallmentsStatusFilter?.addEventListener('change', () => {
  renderChurchInstallments(filterChurchInstallments(churchInstallmentsData));
});
churchMembersSearch?.addEventListener('input', () => {
  renderChurchMembers(filterChurchMembers(churchMembersData));
});
churchMembersRole?.addEventListener('change', () => {
  renderChurchMembers(filterChurchMembers(churchMembersData));
});
churchExportBtn?.addEventListener('click', () => {
  void exportChurchBookings();
});


const churchFormContainer = document.getElementById('church-manual-form-container');
const churchFormCloseBtn = document.getElementById('church-form-close');
const inviteToggleBtn = document.getElementById('btn-toggle-invite');

// Manual Registration Modal Trigger
// Variable declared at top is 'churchFormToggle'
churchFormToggle?.addEventListener('click', () => {
  console.log('[DEBUG] Open manual registration modal clicked');

  // Validation: Check if admin has selected a church
  if (portalIsAdmin && !resolveSelectedChurchId() && !portalIsCustomChurch) {
    showPortalAlert('Por favor selecciona una iglesia en el panel superior antes de registrar.');
    return;
  }

  const modal = document.getElementById('manual-registration-modal');
  if (modal) {
    modal.classList.remove('hidden');
    modal.classList.add('flex');
    document.body.style.overflow = 'hidden';
  } else {
    console.error('[DEBUG] Modal manual-registration-modal not found');
  }
});

// Manual Modal Close Handlers
const manualModalCloseBtn = document.getElementById('btn-close-manual-modal');
const manualModalCancelBtn = document.getElementById('btn-cancel-manual-reg');
const manualModal = document.getElementById('manual-registration-modal');

function closeManualModal() {
  if (manualModal) {
    manualModal.classList.add('hidden');
    manualModal.classList.remove('flex');
    document.body.style.overflow = '';
    // Reset form
    document.getElementById('manual-registration-form')?.reset();
    document.getElementById('manual-reg-status').textContent = '';
  }
}

manualModalCloseBtn?.addEventListener('click', closeManualModal);
manualModalCancelBtn?.addEventListener('click', closeManualModal);

// Close on click outside
manualModal?.addEventListener('click', (e) => {
  if (e.target === manualModal) closeManualModal();
});

// Manual Registration Form Submit
// NOTE: manualRegCompanions is a global array managed by modal UI (add/remove logic elsewhere)
let manualRegCompanions = [];

const manualRegForm = document.getElementById('manual-registration-form');
manualRegForm?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const statusEl = document.getElementById('manual-reg-status');
  const submitBtn = manualRegForm.querySelector('button[type="submit"]');

  if (statusEl) statusEl.textContent = 'Procesando...';
  if (submitBtn) submitBtn.disabled = true;

  try {
    // Collect LEADER data
    const leaderDocType = document.getElementById('reg-leader-doc-type')?.value || 'CC';
    const leaderDocNumber = document.getElementById('reg-leader-doc-number')?.value?.trim();
    const leaderName = document.getElementById('reg-leader-name')?.value?.trim();
    const leaderEmail = document.getElementById('reg-leader-email')?.value?.trim();
    const leaderPhone = document.getElementById('reg-leader-phone')?.value?.trim();
    const leaderAge = parseInt(document.getElementById('reg-leader-age')?.value) || null;
    const leaderMenu = document.getElementById('reg-leader-menu')?.value || 'general';
    const leaderPackage = document.getElementById('reg-leader-package')?.value || 'lodging';

    // Validation
    if (!leaderDocNumber || !leaderName) {
      throw new Error('Completa al menos Documento y Nombre del responsable');
    }

    // Get selected church
    const selectedChurchId = resolveSelectedChurchId();
    if (!selectedChurchId) {
      throw new Error('Selecciona una iglesia antes de registrar');
    }

    // Build participants array (leader + companions)
    const participants = [
      {
        name: leaderName,
        document_type: leaderDocType,
        document_number: leaderDocNumber,
        email: leaderEmail || null,
        phone: leaderPhone || null,
        age: leaderAge,
        packageType: leaderPackage,
        isLeader: true
      },
      ...manualRegCompanions  // Add companions (if any)
    ];

    // Determine payment option (FULL, DEPOSIT, INSTALLMENTS)
    const paymentOption = document.getElementById('reg-payment-option')?.value || 'FULL';

    // Calculate total amount based on all participants
    const currency = 'COP'; // TODO: Make dynamic if needed
    const priceMap = { lodging: 850000, no_lodging: 660000, child_0_7: 300000, child_7_13: 550000 };

    const totalAmount = participants.reduce((sum, p) => {
      let pkg = p.packageType;
      // Auto-adjust package for children
      if (p.age && p.age < 7) pkg = 'child_0_7';
      else if (p.age && p.age >= 7 && p.age < 14) pkg = 'child_7_13';
      return sum + (priceMap[pkg] || 0);
    }, 0);

    const payload = {
      church_id: selectedChurchId,
      country: 'Colombia', // TODO: Extract from church data if available
      city: '', // TODO: Extract from church data if available
      participants,
      payment_option: paymentOption,
      installment_frequency: paymentOption === 'INSTALLMENTS' ? 'MONTHLY' : null,
      total_amount: totalAmount,
      currency
    };

    const res = await fetch('/api/portal/iglesia/register-group', {
      method: 'POST',
      headers: { 'content-type': 'application/json', ...portalAuthHeaders },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (!res.ok || !data.ok) throw new Error(data.error || 'Error al registrar');

    if (statusEl) {
      statusEl.textContent = `✅ ¡${participants.length} persona${participants.length > 1 ? 's' : ''} registrada${participants.length > 1 ? 's' : ''}!`;
      statusEl.className = 'mt-4 text-sm text-center text-white/70';
    }

    // Refresh church bookings
    await loadChurchBookings(portalAuthHeaders);

    // Reset form and close modal after delay
    setTimeout(() => {
      manualRegForm.reset();
      manualRegCompanions = []; // Clear companions
      closeManualModal();
      if (submitBtn) submitBtn.disabled = false;
      if (statusEl) statusEl.textContent = '';
    }, 2000);

  } catch (err) {
    console.error('Manual registration error:', err);
    if (statusEl) {
      statusEl.textContent = `❌ ${err.message}`;
      statusEl.className = 'mt-4 text-sm text-center text-red-400 font-bold';
    }
    if (submitBtn) submitBtn.disabled = false;
  }
});



inviteToggleBtn?.addEventListener('click', () => {
  if (!inviteCard) return;
  const isHidden = inviteCard.classList.contains('hidden');
  if (isHidden) {
    inviteCard.classList.remove('hidden');
    inviteToggleBtn.textContent = 'Cerrar Gestión';
  } else {
    inviteCard.classList.add('hidden');
    inviteToggleBtn.textContent = 'Gestionar Equipo';
  }
});

installmentsList?.addEventListener('click', (event) => {
  void handleInstallmentPay(event);
});

logoutBtn?.addEventListener('click', async () => {
  logoutBtn.disabled = true;
  logoutBtn.textContent = 'Saliendo...';

  // Guarantee redirect happens within 1 second, even if cleanup hangs
  const redirectTimer = setTimeout(() => {
    window.location.href = '/portal/ingresar';
  }, 1000);

  // Attempt to clean up sessions (non-blocking)
  Promise.race([
    (async () => {
      try {
        if (supabase) {
          await supabase.auth.signOut({ scope: 'local' });
        }
        if (authMode === 'password') {
          await fetch('/api/portal/password-logout', { method: 'POST', credentials: 'include' });
        }
      } catch (err) {
        console.error('Logout cleanup error:', err);
      }
    })(),
    new Promise(resolve => setTimeout(resolve, 800)) // 800ms max for cleanup
  ]).finally(() => {
    clearTimeout(redirectTimer);
    window.location.href = '/portal/ingresar';
  });
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


const updatePasswordBtn = document.getElementById('btn-update-password');
const newPasswordInput = document.getElementById('security-new-password');
const securityStatus = document.getElementById('security-status');

updatePasswordBtn?.addEventListener('click', async () => {
  if (!newPasswordInput || !securityStatus) return;
  if (!supabase) {
    securityStatus.textContent = 'Función no disponible en este modo.';
    securityStatus.className = 'text-sm font-medium text-red-500';
    return;
  }
  const password = newPasswordInput.value.trim();
  if (password.length < 6) {
    securityStatus.textContent = 'La contraseña debe tener al menos 6 caracteres.';
    securityStatus.className = 'text-sm font-medium text-red-500';
    return;
  }

  securityStatus.textContent = 'Actualizando contraseña...';
  securityStatus.className = 'text-sm font-medium text-slate-500';
  updatePasswordBtn.disabled = true;
  updatePasswordBtn.classList.add('opacity-50', 'cursor-not-allowed');
  const originalText = updatePasswordBtn.textContent;
  updatePasswordBtn.textContent = 'Guardando...';

  try {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) throw error;

    securityStatus.textContent = '¡Contraseña actualizada correctamente!';
    securityStatus.className = 'text-sm font-medium text-green-500';
    newPasswordInput.value = '';
  } catch (err) {
    console.error(err);
    securityStatus.textContent = err.message || 'No se pudo actualizar la contraseña.';
    securityStatus.className = 'text-sm font-medium text-red-500';
  } finally {
    updatePasswordBtn.disabled = false;
    updatePasswordBtn.classList.remove('opacity-50', 'cursor-not-allowed');
    updatePasswordBtn.textContent = originalText;
    setTimeout(() => {
      if (securityStatus.textContent.includes('correctamente')) {
        securityStatus.textContent = '';
      }
    }, 3000);
  }
});


const registerPasskeyBtn = document.getElementById('btn-register-passkey');
const passkeyStatus = document.getElementById('passkey-status');

registerPasskeyBtn?.addEventListener('click', async () => {
  if (!passkeyStatus) return;
  if (!supabase) {
    passkeyStatus.textContent = 'Passkeys no disponible en este modo.';
    passkeyStatus.className = 'text-xs text-center mt-2 font-medium text-red-500';
    return;
  }
  passkeyStatus.textContent = 'Iniciando registro de Passkey...';
  passkeyStatus.className = 'text-xs text-center mt-2 font-medium text-slate-500';
  registerPasskeyBtn.disabled = true;
  registerPasskeyBtn.classList.add('opacity-50');

  try {
    // 1. Initialize enrollment
    const { data, error } = await supabase.auth.mfa.enroll({
      factorType: 'webauthn',
    });

    if (error) throw error;

    // 2. Challenge and Verify (Triggers Browser Prompt)
    const { data: verifyData, error: verifyError } = await supabase.auth.mfa.challengeAndVerify({
      factorId: data.id,
    });

    if (verifyError) throw verifyError;

    passkeyStatus.textContent = '¡Dispositivo vinculado correctamente!';
    passkeyStatus.className = 'text-xs text-center mt-2 font-bold text-green-500';
    registerPasskeyBtn.innerHTML = `
       <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" /></svg>
       Vinculado
    `;

  } catch (err) {
    console.error(err);
    passkeyStatus.textContent = err.message || 'Error al vincular. Verifica que tu dispositivo soporte Passkeys.';
    passkeyStatus.className = 'text-xs text-center mt-2 font-medium text-red-500';
    registerPasskeyBtn.disabled = false;
    registerPasskeyBtn.classList.remove('opacity-50');
  }
});



// Init Dashboard with Reactive Auth
// Init Dashboard with Reactive Auth
async function initDashboard() {
  const cleared = await clearStaleServiceWorkersOnce();
  if (cleared) {
    dlog('[DEBUG] Cleared stale service workers. Reloading...');
    window.location.reload();
    return;
  }

  // 1. Clean Slate Auth Check
  dlog('[DEBUG] Starting Clean Auth Check...');
  const auth = await ensureAuthenticated();

  if (!auth.isAuthenticated) {
    console.warn('[DEBUG] Not authenticated. Redirecting...');
    if (loadingEl) loadingEl.classList.add('hidden');
    // Allow a brief moment for any pending logs/events? No, fail fast.
    redirectToLogin();
    return;
  }

  dlog('[DEBUG] Authenticated!', auth);
  cleanupAuthRedirect(); // Clean URL hash/params if present

  // 2. Load Dashboard
  await loadDashboardData(auth);

  // 3. Handle Deep Linking (Tab Restore)
  const urlParams = new URLSearchParams(window.location.search);
  const tab = urlParams.get('tab');
  if (tab) {
    switchTab(tab);
  }
}

initDashboard();
initChurchManualForm();
initInviteForm();

// Church Catalog Helpers
function populateChurchesUI(catalog) {
  if (!catalog || !catalog.length) return;

  // Populate Datalist for Manual Registration
  const dataList = document.getElementById('churches-list');
  if (dataList) {
    dataList.innerHTML = catalog.map(c => `<option value="${c.name} - ${c.city}">${c.address || ''}</option>`).join('');
  }

  // Populate Admin Selector (if empty or just placeholder)
  if (churchSelectorInput) {
    // Keep the first option if it's a placeholder
    const placeholder = churchSelectorInput.firstElementChild;
    churchSelectorInput.innerHTML = '';
    if (placeholder) churchSelectorInput.appendChild(placeholder);

    catalog.forEach(c => {
      const opt = document.createElement('option');
      opt.value = c.id;
      opt.textContent = `${c.city} - ${c.name}`;
      churchSelectorInput.appendChild(opt);
    });
  }
}

// Church Input Logic (Auto-fill city/country)
const regChurchInput = document.getElementById('reg-church');
regChurchInput?.addEventListener('input', (e) => { // 'input' event triggers on autocomplete selection too usually
  const val = e.target.value;
  if (!portalChurchesCatalog) return;

  // Try to find by "Name - City" format or just Name
  const found = portalChurchesCatalog.find(c => `${c.name} - ${c.city}` === val || c.name === val);

  if (found) {
    const cityInput = document.getElementById('reg-city');
    const countryInput = document.getElementById('reg-country');
    // Only auto-fill if empty or explicit override? let's override for convenience
    if (cityInput) cityInput.value = found.city;
    if (countryInput) countryInput.value = found.country || 'Colombia';
  }
});
// Admin Sync Logic
const syncBtn = document.getElementById('btn-sync-churches');
const syncWrapper = document.getElementById('admin-sync-wrapper');

if (syncBtn) {
  syncBtn.addEventListener('click', async () => {
    const statusEl = document.getElementById('sync-status');
    const originalText = syncBtn.innerHTML;

    syncBtn.disabled = true;
    syncBtn.textContent = 'Sincronizando...';
    if (statusEl) statusEl.textContent = 'Conectando con base de datos...';

    try {
      const res = await fetch('/api/portal/admin/seed-churches', {
        method: 'POST',
        headers: portalAuthHeaders
      });

      const data = await res.json();

      if (!res.ok) throw new Error(data.error || 'Error al sincronizar');

      if (statusEl) {
        statusEl.textContent = data.message;
        statusEl.className = 'text-[10px] text-center text-green-500 font-bold mt-1';
      }
      setTimeout(() => {
        syncBtn.disabled = false;
        syncBtn.innerHTML = originalText;
        // Reload catalog to reflect changes immediately
        window.location.reload();
      }, 2000);

    } catch (err) {
      console.error(err);
      syncBtn.disabled = false;
      syncBtn.innerHTML = originalText;
      if (statusEl) {
        statusEl.textContent = err.message;
        statusEl.className = 'text-[10px] text-center text-red-500 font-bold mt-1';
      }
    }
  });
}

// ======================================
// Advanced Registration Modal & Church Selector Initialization
// ======================================
import { ChurchSelector } from './ChurchSelector.js';
import { RegistrationModal } from './RegistrationModal.js';

let advancedChurchSelector;
let advancedRegistrationModal;

// Initialize components when DOM is ready
function initAdvancedComponents() {
  const modalElement = document.getElementById('manual-registration-modal');

  // If modal not found yet, retry in a moment
  if (!modalElement) {
    // console.log('Waiting for Registration Modal DOM...');
    setTimeout(initAdvancedComponents, 200);
    return;
  }

  // Initialize Church Selector
  if (!advancedChurchSelector) {
    advancedChurchSelector = new ChurchSelector(portalChurchesCatalog || []);
    // Make it accessible globally for data syncing
    window.advancedChurchSelector = advancedChurchSelector;
  }

  // Initialize Registration Modal
  if (!advancedRegistrationModal) {
    advancedRegistrationModal = new RegistrationModal();
  }

  // Connect church selector button
  const btnOpenChurchSelector = document.getElementById('btn-open-church-selector');
  if (btnOpenChurchSelector) {
    // Clone to remove old listeners
    const newBtn = btnOpenChurchSelector.cloneNode(true);
    btnOpenChurchSelector.parentNode.replaceChild(newBtn, btnOpenChurchSelector);

    newBtn.addEventListener('click', () => {
      advancedChurchSelector.open();
    });
  }

  // When a church is selected, pass it to the registration modal
  advancedChurchSelector.onSelect((church) => {
    advancedRegistrationModal.setChurch(church);
  });

  // Update church selector data when catalog is loaded
  if (portalChurchesCatalog && portalChurchesCatalog.length > 0) {
    advancedChurchSelector.setChurches(portalChurchesCatalog);
  }

  // Connect the "Registrar Participante" button to open the new modal
  const churchFormToggle = document.getElementById('church-form-toggle');
  if (churchFormToggle) {
    // Clone to remove old listeners
    const newToggle = churchFormToggle.cloneNode(true);
    churchFormToggle.parentNode.replaceChild(newToggle, churchFormToggle);

    newToggle.addEventListener('click', () => {
      advancedRegistrationModal.open();
    });
  }
}

// Call after loadDashboardData completes
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initAdvancedComponents, 500); // Give time for data to load
  });
} else {
  setTimeout(initAdvancedComponents, 500);
}
