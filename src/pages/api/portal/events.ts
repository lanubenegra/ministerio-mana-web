import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';

export const GET: APIRoute = async ({ request }) => {
    if (!supabaseAdmin) return new Response(JSON.stringify({ ok: false, error: 'Server Config Error' }), { status: 500 });

    const user = await getUserFromRequest(request);
    if (!user) {
        return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });
    }

    // Get User Profile for Scoping
    const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('church_id, country, city, role')
        .eq('user_id', user.id)
        .single();

    if (!profile) {
        return new Response(JSON.stringify({ ok: false, error: 'Profile not found' }), { status: 403 });
    }

    // Build Query manually for Scoping (since admin bypasses RLS)
    // Logic: 
    // 1. All GLOBAL events
    // 2. NATIONAL events matching profile.country
    // 3. LOCAL events matching profile.church_id
    // 4. (Optional) Created by me (handled if I am admin/pastor)

    // Supabase OR syntax: or=(scope.eq.GLOBAL,and(scope.eq.NATIONAL,country.eq.Colomb...),...)
    // Constructing complex OR filter string

    let orFilter = `scope.eq.GLOBAL`;

    if (profile.country) {
        orFilter += `,and(scope.eq.NATIONAL,country.eq.${profile.country})`;
    }

    if (profile.church_id) {
        orFilter += `,and(scope.eq.LOCAL,church_id.eq.${profile.church_id})`;
    } else {
        // If no church_id, maybe show only global? 
        // If Local events exist without church_id (error state), don't show.
    }

    // Also showing events created by user?
    orFilter += `,created_by.eq.${user.id}`;

    const { data: events, error } = await supabaseAdmin
        .from('events')
        .select('*')
        .or(orFilter)
        .order('start_date', { ascending: true });

    if (error) {
        console.error('Events Fetch Error:', error);
        // Return empty if table doesn't exist yet (graceful degradation)
        if (error.code === '42P01') return new Response(JSON.stringify({ ok: true, events: [] }), { status: 200 });
        return new Response(JSON.stringify({ ok: false, error: 'Error loading events' }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true, events }), { status: 200 });
};

export const POST: APIRoute = async ({ request }) => {
    if (!supabaseAdmin) return new Response(JSON.stringify({ ok: false, error: 'Server Config Error' }), { status: 500 });

    const user = await getUserFromRequest(request);
    if (!user) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });

    const body = await request.json();

    // Validation
    if (!body.title || !body.start_date || !body.scope) {
        return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), { status: 400 });
    }

    // Get Profile
    const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('church_id, role, country, city')
        .eq('user_id', user.id)
        .single();

    // Scope enforcement
    if (body.scope === 'LOCAL') {
        if (!profile?.church_id) {
            return new Response(JSON.stringify({ ok: false, error: 'No tienes una iglesia asociada.' }), { status: 403 });
        }
        body.church_id = profile.church_id;
        // Clear location fields that might conflict or use them as manual
        // body.city = profile.city; 
    } else if (body.scope === 'NATIONAL' || body.scope === 'GLOBAL') {
        // Only Admin/Superadmin/Pastor(maybe?) can create National/Global?
        // Assuming Pastors can only create LOCAL events.
        const allowedRoles = ['admin', 'superadmin'];
        if (!allowedRoles.includes(profile?.role || 'user')) {
            return new Response(JSON.stringify({ ok: false, error: 'No tienes permisos para crear eventos Globales/Nacionales.' }), { status: 403 });
        }

        if (body.scope === 'NATIONAL' && !body.country) {
            body.country = profile?.country || 'Colombia';
        }
    }

    const { data, error } = await supabaseAdmin
        .from('events')
        .insert({
            ...body,
            created_by: user.id,
            status: 'PUBLISHED' // Defaulting to Published for MVP
        })
        .select()
        .single();

    if (error) {
        console.error('Event Create Error:', error);
        return new Response(JSON.stringify({ ok: false, error: 'No se pudo crear el evento' }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true, event: data }), { status: 200 });
};
