import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';

export const GET: APIRoute = async ({ request }) => {
    if (!supabaseAdmin) return new Response(JSON.stringify({ ok: false, error: 'Server Config Error' }), { status: 500 });

    const user = await getUserFromRequest(request);
    if (!user) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });

    // Get Creator Profile
    const { data: creatorProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('church_id, role')
        .eq('user_id', user.id)
        .single();

    if (!creatorProfile || (creatorProfile.role !== 'admin' && creatorProfile.role !== 'superadmin' && creatorProfile.role !== 'pastor')) {
        return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
    }

    let query = supabaseAdmin
        .from('user_profiles')
        .select('user_id, first_name, last_name, email, role, church_id, updated_at')
        .order('updated_at', { ascending: false });

    if (creatorProfile.role === 'pastor') {
        if (!creatorProfile.church_id) {
            return new Response(JSON.stringify({ ok: true, users: [] }), { status: 200 });
        }
        query = query.eq('church_id', creatorProfile.church_id);
    }

    const { data: users, error } = await query.limit(100);

    if (error) {
        return new Response(JSON.stringify({ ok: false, error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify({ ok: true, users }), { status: 200 });
};
