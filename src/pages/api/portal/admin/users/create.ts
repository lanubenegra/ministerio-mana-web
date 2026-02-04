import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';
import { sendAuthLink } from '@lib/authMailer';
import { checkLeakedPassword, formatPasswordErrors, validatePasswordStrength } from '@lib/passwordSecurity';

export const POST: APIRoute = async ({ request }) => {
    if (!supabaseAdmin) return new Response(JSON.stringify({ ok: false, error: 'Server Config Error' }), { status: 500 });

    const user = await getUserFromRequest(request);
    if (!user) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });

    // Get Creator Profile to check Role + Church + Country
    const { data: creatorProfile } = await supabaseAdmin
        .from('user_profiles')
        .select('church_id, role, country')
        .eq('user_id', user.id)
        .single();

    if (!creatorProfile) {
        return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
    }

    const { role: creatorRole } = creatorProfile;

    // Roles allowed to create users
    const allowedCreators = ['superadmin', 'admin', 'national_pastor', 'pastor', 'local_collaborator'];
    if (!allowedCreators.includes(creatorRole)) {
        return new Response(JSON.stringify({ ok: false, error: 'No tienes permisos para crear usuarios' }), { status: 403 });
    }

    const body = await request.json();
    const { email, password, firstName, lastName, role, churchId } = body;

    if (!email || !password || !firstName || !lastName) {
        return new Response(JSON.stringify({ ok: false, error: 'Faltan campos requeridos' }), { status: 400 });
    }

    const strength = validatePasswordStrength(password);
    if (!strength.ok) {
        return new Response(JSON.stringify({ ok: false, error: formatPasswordErrors(strength.errors) }), { status: 400 });
    }

    const leaked = await checkLeakedPassword(password);
    if (leaked.leaked) {
        return new Response(JSON.stringify({ ok: false, error: 'Esta contraseña aparece en filtraciones conocidas. Elige otra.' }), { status: 400 });
    }
    if (!leaked.checked && leaked.error) {
        console.warn('[create-user] HIBP check failed:', leaked.error);
    }

    // Role Hierarchy Validation
    const targetRole = role || 'user';
    let allowedTargetRoles: string[] = [];

    if (creatorRole === 'superadmin') {
        allowedTargetRoles = ['superadmin', 'admin', 'national_pastor', 'campus_missionary', 'pastor', 'local_collaborator', 'user'];
    } else if (creatorRole === 'admin') {
        allowedTargetRoles = ['national_pastor', 'campus_missionary', 'pastor', 'local_collaborator', 'user'];
    } else if (creatorRole === 'national_pastor') {
        allowedTargetRoles = ['campus_missionary', 'pastor', 'local_collaborator', 'user'];
    } else if (creatorRole === 'pastor') {
        allowedTargetRoles = ['local_collaborator', 'user'];
    } else if (creatorRole === 'local_collaborator') {
        allowedTargetRoles = ['user'];
    }

    if (!allowedTargetRoles.includes(targetRole)) {
        return new Response(JSON.stringify({ ok: false, error: `No tienes permiso para crear un usuario con el rol: ${targetRole}` }), { status: 403 });
    }

    // Scope Assignment (Church / Country)
    let targetChurchId = churchId || null;
    let targetCountry = null;

    if (creatorRole === 'pastor' || creatorRole === 'local_collaborator') {
        // Enforce Church Scope
        targetChurchId = creatorProfile.church_id;
        if (!targetChurchId) {
            return new Response(JSON.stringify({ ok: false, error: 'Error: Tu usuario no tiene una iglesia asignada.' }), { status: 400 });
        }
    } else if (creatorRole === 'national_pastor') {
        // Enforce Country Scope (National Pastor assigns their country to the new user)
        targetCountry = creatorProfile.country;
        // Church ID remains null unless they selected one? (Not implemented in UI yet)
    }

    // Backend Check: Ensure email doesn't exist already (Supabase createUser handles this, but good to check Profile)

    // Create Auth User
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
        email,
        password,
        email_confirm: true, // Auto-confirm
        user_metadata: {
            first_name: firstName,
            last_name: lastName,
            full_name: `${firstName} ${lastName}`.trim()
        }
    });

    if (authError) {
        return new Response(JSON.stringify({ ok: false, error: authError.message }), { status: 400 });
    }

    if (!authData.user) {
        return new Response(JSON.stringify({ ok: false, error: 'Failed to create user' }), { status: 500 });
    }

    // Create Profile
    const { error: profileError } = await supabaseAdmin
        .from('user_profiles')
        .upsert({
            user_id: authData.user.id,
            email: email,
            first_name: firstName,
            last_name: lastName,
            role: targetRole,
            church_id: targetChurchId,
            country: targetCountry, // Assign country if applicable
            updated_at: new Date().toISOString()
        });

    if (profileError) {
        console.error('Profile Error', profileError);
    }

    // Send Welcome Email via SendGrid (Magic Link for existing user since we just created them)
    try {
        const emailResult = await sendAuthLink({
            kind: 'magiclink',
            email: email,
            redirectTo: `${new URL(request.url).origin}/portal`
        });

        if (!emailResult.ok) {
            console.warn('[create-user] Email not sent:', emailResult.error);
        }
    } catch (emailErr) {
        console.error('[create-user] Email error:', emailErr);
    }

    return new Response(JSON.stringify({ ok: true, userId: authData.user.id }), { status: 200 });
};
