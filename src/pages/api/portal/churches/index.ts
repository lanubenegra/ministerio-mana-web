export const prerender = false;

import type { APIRoute } from 'astro';
import { supabase } from '../../../../lib/supabase'; // Adjust path to shared client if needed // OR use fresh client
// Actually, let's use the one typically used in API routes.
// Checking references: typically importing from '@lib/supabase' or similar.
// I'll check how other APIs import supabase.

// Fallback logic inside:
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.PUBLIC_SUPABASE_URL || process.env.PUBLIC_SUPABASE_URL;
const supabaseKey = import.meta.env.PUBLIC_SUPABASE_ANON_KEY || process.env.PUBLIC_SUPABASE_ANON_KEY;

export const GET: APIRoute = async () => {
    const sb = createClient(supabaseUrl, supabaseKey);

    const { data, error } = await sb
        .from('churches')
        .select('id, name, city, country, address, lat, lng')
        .order('city', { ascending: true });

    if (error) {
        return new Response(JSON.stringify({ error: error.message }), { status: 500 });
    }

    return new Response(JSON.stringify(data), {
        status: 200,
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
