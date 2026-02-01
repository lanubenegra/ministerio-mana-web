import type { APIRoute } from 'astro';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = (import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL) as string;
const supabaseServiceKey = (import.meta.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY) as string;

export const POST: APIRoute = async ({ request }) => {
    try {
        if (!supabaseUrl || !supabaseServiceKey) {
            return new Response(JSON.stringify({ error: 'Missing database configuration' }), { status: 500 });
        }

        const supabase = createClient(supabaseUrl, supabaseServiceKey);

        // Get authenticated user (pastor/admin)
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
        }

        const token = authHeader.replace('Bearer ', '');
        const { data: { user }, error: authError } = await supabase.auth.getUser(token);

        if (authError || !user) {
            return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
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
            return new Response(JSON.stringify({ error: 'Datos incompletos: se requiere iglesia y al menos un participante' }), { status: 400 });
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
                registered_by: user.id,
                created_at: new Date().toISOString()
            };
        });

        const { data: insertedBookings, error: bookingError } = await supabase
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

            const { error: planError } = await supabase
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
                success: true,
                message: `Grupo registrado exitosamente (${participants.length} participante${participants.length > 1 ? 's' : ''})`,
                group_id: groupId,
                bookings: insertedBookings
            }),
            {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        );
    } catch (error) {
        console.error('Unexpected error in register-group:', error);
        return new Response(JSON.stringify({ error: 'Error inesperado al procesar la solicitud' }), { status: 500 });
    }
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
