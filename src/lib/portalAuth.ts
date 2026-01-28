import type { User } from '@supabase/supabase-js';
import { supabaseAdmin } from '@lib/supabaseAdmin';

export type PortalRole = 'user' | 'admin' | 'superadmin';
export type ChurchRole = 'church_admin' | 'church_member';

export type UserProfile = {
  user_id: string;
  email: string;
  full_name: string | null;
  role: PortalRole;
  created_at?: string;
  updated_at?: string;
};

function env(key: string): string | undefined {
  return import.meta.env?.[key] ?? process.env?.[key];
}

function parseEmails(raw?: string | null): Set<string> {
  if (!raw) return new Set();
  return new Set(
    raw
      .split(',')
      .map((item) => item.trim().toLowerCase())
      .filter(Boolean),
  );
}

function isSuperadminEmail(email?: string | null): boolean {
  const list = parseEmails(env('PORTAL_SUPERADMIN_EMAILS'));
  if (!email) return false;
  return list.has(email.toLowerCase());
}

export async function ensureUserProfile(user: User): Promise<UserProfile | null> {
  if (!supabaseAdmin) return null;
  const email = user.email?.toLowerCase();
  if (!email) return null;

  const desiredRole: PortalRole = isSuperadminEmail(email) ? 'superadmin' : 'user';

  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .upsert(
      {
        user_id: user.id,
        email,
        full_name: (user.user_metadata as any)?.full_name ?? null,
        role: desiredRole,
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id' },
    )
    .select('*')
    .single();

  if (error) {
    console.error('[portal.profile] upsert error', error);
    return null;
  }

  return data as UserProfile;
}

export async function getUserProfile(userId: string): Promise<UserProfile | null> {
  if (!supabaseAdmin) return null;
  const { data, error } = await supabaseAdmin
    .from('user_profiles')
    .select('*')
    .eq('user_id', userId)
    .maybeSingle();
  if (error) {
    console.error('[portal.profile] fetch error', error);
    return null;
  }
  return data as UserProfile | null;
}

export async function listUserMemberships(userId: string) {
  if (!supabaseAdmin) return [];
  const { data, error } = await supabaseAdmin
    .from('church_memberships')
    .select('id, role, status, church:churches(id, name, city, country)')
    .eq('user_id', userId);
  if (error) {
    console.error('[portal.memberships] fetch error', error);
    return [];
  }
  return data ?? [];
}

export function isAdminRole(role?: string | null): boolean {
  return role === 'admin' || role === 'superadmin';
}
