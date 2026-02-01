import { getSupabaseBrowserClient } from './supabaseBrowser';
import type { User, Session } from '@supabase/supabase-js';

export interface PortalAuthResult {
    isAuthenticated: boolean;
    token: string | null;
    mode: 'supabase' | 'password' | null;
    user: User | { email: string; role: string } | null;
}

const DEBUG_PREFIX = '[PortalAuth]';

function dlog(...args: any[]) {
    if (import.meta.env.DEV || window.location.host.includes('localhost')) {
        console.log(DEBUG_PREFIX, ...args);
    }
}

/**
 * Single source of truth for Portal Authentication.
 * Checks Supabase (SDK + LocalStorage) and Legacy Cookies.
 */
export async function ensureAuthenticated(): Promise<PortalAuthResult> {
    dlog('Starting authentication check...');

    // 1. Try Supabase SDK (Fast & Standard)
    try {
        const supabase = getSupabaseBrowserClient();
        if (supabase) {
            const { data } = await supabase.auth.getSession();
            if (data?.session?.access_token) {
                dlog('Authenticated via Supabase SDK');
                return {
                    isAuthenticated: true,
                    token: data.session.access_token,
                    mode: 'supabase',
                    user: data.session.user
                };
            }
        }
    } catch (err) {
        console.warn(DEBUG_PREFIX, 'Supabase SDK check failed:', err);
    }

    // 2. Try LocalStorage Fallback (Robust against SDK race conditions)
    try {
        const key = Object.keys(localStorage).find(k => k.startsWith('sb-') && k.endsWith('-auth-token'));
        if (key) {
            const sessionStr = localStorage.getItem(key);
            if (sessionStr) {
                const sessionObj = JSON.parse(sessionStr);
                if (sessionObj.access_token) {
                    dlog('Authenticated via LocalStorage Fallback');
                    // We don't have the full User object here easily without validating,
                    // but the token is enough for the API to validate us.
                    // We'll let the API return the profile.
                    return {
                        isAuthenticated: true,
                        token: sessionObj.access_token,
                        mode: 'supabase',
                        user: sessionObj.user || { email: 'recovered@session', role: 'authenticated' }
                    };
                }
            }
        }
    } catch (err) {
        console.error(DEBUG_PREFIX, 'LocalStorage check failed:', err);
    }

    // 3. Try Legacy Password Session (Cookie-based)
    try {
        const res = await fetch('/api/portal/password-session', { credentials: 'include' });
        if (res.ok) {
            const data = await res.json();
            if (data.ok && data.profile) {
                dlog('Authenticated via Password Session Cookie');
                return {
                    isAuthenticated: true,
                    token: null, // No bearer token needed, cookie handles it
                    mode: 'password',
                    user: data.profile
                };
            }
        }
    } catch (err) {
        console.warn(DEBUG_PREFIX, 'Password session check failed:', err);
    }

    dlog('Authentication failed. No valid session found.');
    return {
        isAuthenticated: false,
        token: null,
        mode: null,
        user: null
    };
}

export function redirectToLogin() {
    window.location.href = '/portal/ingresar';
}
