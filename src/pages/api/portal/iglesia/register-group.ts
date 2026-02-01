import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';
import { ensureUserProfile } from '@lib/portalAuth';
import { readPasswordSession } from '@lib/portalPasswordSession';

export const prerender = false;

export const POST: APIRoute = async ({ request }) => {
    if (!supabaseAdmin) {
        return new Response(JSON.stringify({ ok: false, error: 'Supabase no configurado' }), { status: 500 });
    }

    // RBAC Authorization (Same as bookings.ts)
    let isAllowed = false;
    let isAdmin = false;
    let allowedChurchId: string | null = null;
    let allowedCountry: string | null = null;
    let profile: any = null;

    const user = await getUserFromRequest(request);
    if (!user?.email) {
        const passwordSession = readPasswordSession(request);
        if (!passwordSession?.email) {
            return new Response(JSON.stringify({ ok: false, error: 'No autorizado' }), { status: 401 });
        }
        isAllowed = true;
        isAdmin = true;
    } else {
        profile = await ensureUserProfile(user);
        if (!profile) {
            return new Response(JSON.stringify({ ok: false, error: 'Perfil no encontrado' }), { status: 403 });
        }

        const role = profile.role || 'user';
        const allowedRoles = ['superadmin', 'admin', 'national_pastor', 'pastor', 'local_collaborator', 'church_admin'];

        // STRICT: Block regular users
        if (!allowedRoles.includes(role)) {
            return new Response(JSON.stringify({ ok: false, error: 'No tienes permisos para registrar participantes' }), { status: 403 });
        }

        if (role === 'superadmin' || role === 'admin') {
            isAdmin = true;
            isAllowed = true;
        } else if (role === 'national_pastor') {
            // National Pastor: Can register in ANY church in their country
            isAllowed = true;
            allowedCountry = profile.country;
            if (!allowedCountry) {
                return new Response(JSON.stringify({ ok: false, error: 'Sin país asignado' }), { status: 403 });
            }
        } else {
            // Local Pastor / Collaborator: ONLY their assigned church
            isAllowed = true;
            allowedChurchId = profile.church_id;
            if (!allowedChurchId) {
                return new Response(JSON.stringify({ ok: false, error: 'Sin iglesia asignada' }), { status: 403 });
            }
        }
    }

    // Parse request body
    const body = await request.json();
    const {
        church_id,
        country,
        city,
        participants = [],
        payment_option,
        installment_frequency,
        total_amount,
        currency = 'COP'
    } = body;

    // Validate required fields
    if (!church_id || participants.length === 0) {
        return new Response(JSON.stringify({ ok: false, error: 'Datos incompletos: se requiere iglesia y al menos un participante' }), { status: 400 });
    }

    // STRICT RBAC: Validate requested church is within authorized scope
    if (!isAdmin) {
        if (allowedChurchId) {
            // Local scope: must match exactly
            if (church_id !== allowedChurchId) {
                return new Response(JSON.stringify({ ok: false, error: 'Solo puedes registrar en tu iglesia asignada' }), { status: 403 });
            }
        } else if (allowedCountry) {
            // Country scope: verify church is in country
            const { data: church, error: churchError } = await supabaseAdmin
                .from('churches')
                .select('country')
                .eq('id', church_id)
                .single();

            if (churchError || !church || church.country !== allowedCountry) {
                return new Response(JSON.stringify({ ok: false, error: 'Solo puedes registrar en iglesias de tu país' }), { status: 403 });
            }
        }
    }

    // Create a group identifier (booking_group_id)
    const groupId = `GRP-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Determine payment status
    let paymentStatus = 'PENDING';
    if (payment_option === 'FULL') {
        paymentStatus = 'PAID';
    } else if (payment_option === 'DEPOSIT') {
        paymentStatus = 'PARTIAL';
    }

    // Calculate amount paid (for tracking)
    let amountPaid = 0;
    if (payment_option === 'FULL') {
        amountPaid = total_amount;
    } else if (payment_option === 'DEPOSIT') {
        amountPaid = Math.round(total_amount * 0.5);
    }

    // Insert each participant as a cumbre_bookings record
    const bookingRecords = participants.map((participant: any) => {
        const priceMap = currency === 'COP'
            ? { lodging: 850000, no_lodging: 660000, child_0_7: 300000, child_7_13: 550000 }
            : { lodging: 220, no_lodging: 170, child_0_7: 80, child_7_13: 140 };

        const participantAmount = priceMap[participant.packageType as keyof typeof priceMap] || 0;

        return {
            booking_group_id: groupId,
            name: participant.name,
            email: participant.email || null,
            phone: participant.phone || null,
            country: country || 'Colombia',
            city: city || '',
            affiliation: church_id,
            document_type: participant.document_type || 'CC',
            document_number: participant.document_number || '',
            age: participant.age || null,
            package_type: participant.packageType,
            amount: participantAmount,
            currency,
            payment_method: payment_option,
            payment_status: paymentStatus,
            is_leader: participant.isLeader || false,
            registered_by: user?.id || profile?.id || null,
            created_at: new Date().toISOString()
        };
    });

    const { data: insertedBookings, error: bookingError } = await supabaseAdmin
        .from('cumbre_bookings')
        .insert(bookingRecords)
        .select();

    if (bookingError) {
        console.error('Error inserting bookings:', bookingError);
        return new Response(JSON.stringify({ error: `Error al crear registros: ${bookingError.message}` }), { status: 500 });
    }

    // Create payment plan if installments selected
    if (payment_option === 'INSTALLMENTS' && installment_frequency) {
        const deadline = '2026-05-15';
        const installments = calculateInstallmentPlan(total_amount, installment_frequency, deadline);

        const paymentPlanRecords = installments.map((inst, index) => ({
            booking_group_id: groupId,
            installment_number: index + 1,
            amount: inst.amount,
            due_date: inst.dueDate,
            currency,
            status: 'PENDING',
            created_at: new Date().toISOString()
        }));

        const { error: planError } = await supabaseAdmin
            .from('cumbre_payment_plans')
            .insert(paymentPlanRecords);

        if (planError) {
            console.warn('Error creating payment plan:', planError);
            // Don't fail the entire request if payment plan creation fails
        }
    }

    // TODO: Send welcome emails if email is provided
    // TODO: Activate event in participant portal

    return new Response(
        JSON.stringify({
            ok: true,
            success: true,
            message: `Grupo registrado exitosamente (${participants.length} participante${participants.length > 1 ? 's' : ''})`,
            group_id: groupId,
            bookings: insertedBookings
        }),
        { status: 200 }
    );
};

// Helper function to calculate installment plan
function calculateInstallmentPlan(total: number, frequency: string, deadline: string): { amount: number; dueDate: string }[] {
    const [year, month, day] = deadline.split('-').map(Number);
    const end = new Date(Date.UTC(year, month - 1, day));
    const now = new Date();
    const current = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));

    if (end < current) {
        return [{ amount: total, dueDate: deadline }];
    }

    const dueDates = [];
    let tempDate = new Date(current);

    while (tempDate <= end) {
        dueDates.push(new Date(tempDate).toISOString().split('T')[0]);
        if (frequency === 'BIWEEKLY') {
            tempDate.setUTCDate(tempDate.getUTCDate() + 14);
        } else {
            tempDate.setUTCMonth(tempDate.getUTCMonth() + 1);
        }
    }

    const count = Math.max(1, dueDates.length);
    const installmentAmount = Math.round(total / count);

    return dueDates.map(dueDate => ({
        amount: installmentAmount,
        dueDate
    }));
}
