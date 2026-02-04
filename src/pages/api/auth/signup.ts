import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { sendAuthLink } from '@lib/authMailer';
import { checkLeakedPassword, formatPasswordErrors, validatePasswordStrength } from '@lib/passwordSecurity';

export const POST: APIRoute = async ({ request }) => {
    if (!supabaseAdmin) {
        return new Response(JSON.stringify({ ok: false, error: 'Server configuration error' }), { status: 500 });
    }

    try {
        const body = await request.json();
        const { email, password, firstName, lastName } = body;

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
            console.warn('[signup] HIBP check failed:', leaked.error);
        }

        // Check if user already exists
        const { data: existingUsers } = await supabaseAdmin.auth.admin.listUsers();
        const userExists = existingUsers?.users?.some(u => u.email?.toLowerCase() === email.toLowerCase());

        if (userExists) {
            return new Response(JSON.stringify({ ok: false, error: 'Este correo ya está registrado' }), { status: 400 });
        }

        // Create user with auto-confirmed email
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true,
            user_metadata: {
                first_name: firstName,
                last_name: lastName,
                full_name: `${firstName} ${lastName}`.trim()
            }
        });

        if (authError || !authData.user) {
            console.error('Signup error:', authError);
            return new Response(JSON.stringify({ ok: false, error: authError?.message || 'Error al crear cuenta' }), { status: 400 });
        }

        // Create profile
        const { error: profileError } = await supabaseAdmin
            .from('user_profiles')
            .upsert({
                user_id: authData.user.id,
                email: email,
                first_name: firstName,
                last_name: lastName,
                role: 'user',
                updated_at: new Date().toISOString()
            });

        if (profileError) {
            console.error('Profile creation error:', profileError);
        }

        // Send welcome email via SendGrid
        // Since user is already created, we use 'magiclink' instead of 'invite'
        try {
            const emailResult = await sendAuthLink({
                kind: 'magiclink',
                email: email,
                redirectTo: `${new URL(request.url).origin}/portal`
            });

            if (!emailResult.ok) {
                console.warn('[signup] Email not sent:', emailResult.error);
            }
        } catch (emailErr) {
            console.error('[signup] Email error:', emailErr);
            // Don't fail registration if email fails
        }

        return new Response(JSON.stringify({
            ok: true,
            userId: authData.user.id,
            message: 'Cuenta creada. Revisa tu correo para activar tu cuenta.'
        }), { status: 200 });

    } catch (err: any) {
        console.error('Signup error:', err);
        return new Response(JSON.stringify({ ok: false, error: err.message || 'Error al registrarse' }), { status: 500 });
    }
};
