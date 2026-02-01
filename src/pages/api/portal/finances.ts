import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';

export const GET: APIRoute = async ({ request }) => {
    if (!supabaseAdmin) return new Response(JSON.stringify({ ok: false, error: 'Server Config Error' }), { status: 500 });

    const user = await getUserFromRequest(request);
    if (!user) return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });

    // Get Profile
    const { data: profile } = await supabaseAdmin
        .from('user_profiles')
        .select('church_id, role')
        .eq('user_id', user.id)
        .single();

    if (!profile || (profile.role !== 'admin' && profile.role !== 'superadmin' && profile.role !== 'pastor' && profile.role !== 'leader')) {
        return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
    }

    // Base Query
    let query = supabaseAdmin
        .from('donations')
        .select('id, amount, currency, status, concept_label, concept_code, created_at, donor_name')
        .neq('status', 'FAILED'); // Show Paid and Pending? Or just Paid? Usually Finances show Paid.

    // Filter by Role
    if (profile.role === 'pastor' || profile.role === 'leader') {
        if (!profile.church_id) {
            return new Response(JSON.stringify({ ok: true, stats: { total: 0 }, transactions: [] }), { status: 200 });
        }
        query = query.eq('church_id', profile.church_id);
    }

    // Execute
    const { data: transactions, error } = await query.order('created_at', { ascending: false }).limit(100);

    if (error) {
        // If column doesn't exist yet (migration pending), behave gracefully
        console.error(error);
        return new Response(JSON.stringify({ ok: false, error: 'Error loading finances' }), { status: 500 });
    }

    // Calculate Aggregates (Simple JS aggregation for now, or DB function later)
    // Converting all to base currency (assuming COP primarily, checking currency)
    let total = 0;
    const byConcept: Record<string, number> = {};

    transactions.forEach(t => {
        if (t.status === 'PAID' || t.status === 'APPROVED') {
            const amount = Number(t.amount) || 0;
            total += amount;

            const label = t.concept_label || 'Otros';
            byConcept[label] = (byConcept[label] || 0) + amount;
        }
    });

    return new Response(JSON.stringify({ ok: true, stats: { total, byConcept }, transactions }), { status: 200 });
};
