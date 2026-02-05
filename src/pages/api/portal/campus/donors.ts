import type { APIRoute } from 'astro';
import { supabaseAdmin } from '@lib/supabaseAdmin';
import { getUserFromRequest } from '@lib/supabaseAuth';
import { readPasswordSession } from '@lib/portalPasswordSession';

export const prerender = false;

export const GET: APIRoute = async ({ request }) => {
    if (!supabaseAdmin) {
        return new Response(JSON.stringify({ ok: false, error: 'Server Config Error' }), { status: 500 });
    }

    const user = await getUserFromRequest(request);
    const passwordSession = user ? null : readPasswordSession(request);
    if (!user && !passwordSession) {
        return new Response(JSON.stringify({ ok: false, error: 'Unauthorized' }), { status: 401 });
    }

    let userProfile: { user_id?: string; role?: string } | null = null;
    if (user) {
        const { data: profile } = await supabaseAdmin
            .from('user_profiles')
            .select('user_id, role')
            .eq('user_id', user.id)
            .single();
        userProfile = profile ?? null;
    }

    if (!userProfile && !passwordSession) {
        return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
    }

    const role = passwordSession ? 'superadmin' : (userProfile?.role || 'user');

    // Only campus missionaries and admins can access this endpoint
    const allowedRoles = ['campus_missionary', 'admin', 'superadmin'];
    if (!allowedRoles.includes(role)) {
        return new Response(JSON.stringify({ ok: false, error: 'Forbidden' }), { status: 403 });
    }

    const isAdmin = role === 'admin' || role === 'superadmin';
    const isCampusMissionary = role === 'campus_missionary';

    // Build query
    let query = supabaseAdmin
        .from('donations')
        .select('id, donor_name, donor_email, donor_phone, amount, currency, created_at, missionary_id, missionary_name, campus, status')
        .eq('status', 'APPROVED')
        .order('created_at', { ascending: false });

    // Scoping: Campus missionaries only see THEIR donors
    if (isCampusMissionary && user?.id) {
        query = query.eq('missionary_id', user.id);
    }
    // Admins see all donations (no filter)

    const { data: donations, error } = await query.limit(200);

    if (error) {
        console.error('[campus.donors] Error:', error);
        return new Response(JSON.stringify({ ok: false, error: 'Failed to load donors' }), { status: 500 });
    }

    // Group donations by donor
    const donorMap = new Map();

    (donations || []).forEach((donation) => {
        const donorKey = donation.donor_email || donation.donor_name || 'unknown';

        if (!donorMap.has(donorKey)) {
            donorMap.set(donorKey, {
                name: donation.donor_name || 'Donante Anónimo',
                email: donation.donor_email,
                phone: donation.donor_phone,
                // Only include amounts for admins
                totalAmount: isAdmin ? donation.amount : null,
                currency: isAdmin ? donation.currency : null,
                donationCount: 1,
                lastDonation: donation.created_at,
                missionary: {
                    id: donation.missionary_id,
                    name: donation.missionary_name
                },
                campus: donation.campus
            });
        } else {
            const existing = donorMap.get(donorKey);
            existing.donationCount += 1;
            if (isAdmin) {
                existing.totalAmount = (existing.totalAmount || 0) + (donation.amount || 0);
            }
            // Update last donation if more recent
            if (new Date(donation.created_at) > new Date(existing.lastDonation)) {
                existing.lastDonation = donation.created_at;
            }
        }
    });

    const donors = Array.from(donorMap.values());

    // Calculate stats (only for admins)
    let stats = null;
    if (isAdmin) {
        const totalDonors = donors.length;
        const totalAmount = donors.reduce((sum, d) => sum + (d.totalAmount || 0), 0);

        // Count unique missionaries
        const uniqueMissionaries = new Set();
        donations?.forEach(d => {
            if (d.missionary_id) uniqueMissionaries.add(d.missionary_id);
        });

        stats = {
            totalDonors,
            totalAmount,
            currency: donations?.[0]?.currency || 'USD',
            activeMissionaries: uniqueMissionaries.size
        };
    }

    return new Response(JSON.stringify({
        ok: true,
        donors,
        stats,
        isAdmin,
        isCampusMissionary
    }), {
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
};
