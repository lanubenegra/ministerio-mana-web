import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';

export const POST: APIRoute = async ({ request }) => {
    if (!supabaseAdmin) return new Response(JSON.stringify({ ok: false, error: 'Server Config Error' }), { status: 500 });

    const user = await getUserFromRequest(request);
    if (!user) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });

    // Get Creator Profile to check Role + Church
    const { data: creatorProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('church_id, role')
        .eq('user_id', user.id)
        .single();

    if (!creatorProfile || (creatorProfile.role !== 'admin' && creatorProfile.role !== 'superadmin' && creatorProfile.role !== 'pastor')) {
        return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
    }

    const body = await request.json();
    const { email, password, firstName, lastName, role, churchId } = body;

    if (!email || !password || !firstName || !lastName) {
        return new Response(JSON.stringify({ ok: false, error: 'Missing fields' }), { status: 400 });
    }

    // Validate Church Scope
    let targetChurchId = churchId;
    if (creatorProfile.role === 'pastor') {
        // Pastor can ONLY create for their church
        targetChurchId = creatorProfile.church_id;
    }

    // Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Autoconfirm since Admin created it
        user_metadata: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`
        }
    });

    if (authError) {
        return new Response(JSON.stringify({ ok: false, error: authError.message }), { status: 400 });
    }

    if (!authData.user) {
        return new Response(JSON.stringify({ ok: false, error: 'Failed to create user' }), { status: 500 });
    }

    // Create/Update Profile
    // Note: Trigger might create it, but we want to set Role + Church immediately
    // We use upsert just in case trigger fired
    const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .upsert({
            user_id: authData.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            role: role || 'user', // Default to 'user', Pastor can create 'leader'
            church_id: targetChurchId,
            updated_at: new Date().toISOString()
        });

    if (profileError) {
        console.error('Profile Error', profileError);
        // Don't fail the request, but warn? Auth user exists.
    }

    return new Response(JSON.stringify({ ok: true, userId: authData.user.id }), { status: 200 });
};
