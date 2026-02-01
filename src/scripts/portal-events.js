import { createClient } from '@supabase/supabase-js';

// Init Supabase (Client Side)
const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

// DOM Elements
const eventsList = document.getElementById('events-list');
const eventsLoading = document.getElementById('events-loading');
const eventsEmpty = document.getElementById('events-empty');
const btnNewEvent = document.getElementById('btn-new-event');
const eventModal = document.getElementById('event-modal');
const closeModal = document.getElementById('close-modal');
const eventForm = document.getElementById('event-form');

let userProfile = null;

// Auth & Init
async function init() {
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
        window.location.href = '/portal/ingresar';
        return;
    }

    // Fetch Profile
    const { data: profile, error } = await supabase
        .from('user_profiles')
        .select('*')
        .eq('user_id', session.user.id)
        .single();

    if (error || !profile) {
        console.error('Error fetching profile:', error);
        return;
    }
    userProfile = profile;

    // Load Events
    loadEvents();
}

// Load Events
async function loadEvents() {
    eventsLoading.classList.remove('hidden');
    eventsList.classList.add('hidden');
    eventsEmpty.classList.add('hidden');

    try {
        const res = await fetch('/api/portal/events');
        const data = await res.json();

        if (!data.ok) throw new Error(data.error);

        renderEvents(data.events || []);
    } catch (err) {
        console.error(err);
        eventsEmpty.classList.remove('hidden'); // Fail gracefully
    } finally {
        eventsLoading.classList.add('hidden');
    }
}

// Render Events
function renderEvents(events) {
    if (events.length === 0) {
        eventsEmpty.classList.remove('hidden');
        return;
    }

    eventsList.innerHTML = events.map(event => `
        <div class="bg-white rounded-[2rem] border border-slate-100 p-6 shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div class="absolute top-0 right-0 p-4 opacity-5">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-32 w-32" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>
            </div>
            
            <div class="relative z-10">
                <div class="flex justify-between items-start mb-4">
                    <span class="px-3 py-1 rounded-full bg-slate-50 text-[10px] font-bold uppercase tracking-widest text-slate-500 border border-slate-100">
                        ${event.scope}
                    </span>
                    <div class="text-right">
                        <p class="text-xs font-bold text-[#293C74]">${new Date(event.start_date).toLocaleDateString()}</p>
                        <p class="text-[10px] text-slate-400 uppercase tracking-widest">Inicio</p>
                    </div>
                </div>
                
                <h3 class="text-lg font-bold text-[#293C74] mb-2 group-hover:text-brand-teal transition-colors">${event.title}</h3>
                <p class="text-sm text-slate-500 line-clamp-2 mb-4">${event.description || 'Sin descripción'}</p>
                
                <div class="flex items-center gap-2 text-xs text-slate-400">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    <span>${event.location_address || 'Virtual'}</span>
                </div>
            </div>
        </div>
    `).join('');

    eventsList.classList.remove('hidden');
}

// Modal Logic
btnNewEvent?.addEventListener('click', () => {
    eventModal.classList.remove('hidden');
    eventModal.classList.add('flex');
});

closeModal?.addEventListener('click', () => {
    eventModal.classList.add('hidden');
    eventModal.classList.remove('flex');
});

eventForm?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn = eventForm.querySelector('button[type="submit"]');
    const originalText = btn.textContent;
    btn.textContent = 'Guardando...';
    btn.disabled = true;

    try {
        const formData = new FormData(eventForm);
        const payload = Object.fromEntries(formData.entries());

        const res = await fetch('/api/portal/events', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        const data = await res.json();
        if (!res.ok || !data.ok) throw new Error(data.error || 'Error al guardar');

        // Reset and Reload
        eventForm.reset();
        eventModal.classList.add('hidden');
        eventModal.classList.remove('flex');
        loadEvents();

    } catch (err) {
        alert(err.message);
    } finally {
        btn.textContent = originalText;
        btn.disabled = false;
    }
});

// Run
init();
