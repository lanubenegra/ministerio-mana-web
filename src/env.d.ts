/// <reference path="../.astro/types.d.ts" />
/// <reference types="astro/client" />
/// <reference types="@clerk/astro/env" />

declare namespace App {
  interface Locals {
    geo?: {
      country: string;
      lang: string;
    };
    turnstile?: {
      siteKey: string;
    };
    cspNonce?: string;
  }
}

interface ImportMetaEnv {
  readonly PUBLIC_CLERK_PUBLISHABLE_KEY?: string;
  readonly PUBLIC_CLERK_SIGN_IN_URL?: string;
  readonly PUBLIC_CLERK_SIGN_UP_URL?: string;
  readonly PUBLIC_CLERK_SIGN_IN_FORCE_REDIRECT_URL?: string;
  readonly PUBLIC_CLERK_SIGN_UP_FORCE_REDIRECT_URL?: string;
  readonly PUBLIC_CLERK_DOMAIN?: string;
  readonly PUBLIC_CLERK_PROXY_URL?: string;
  readonly PUBLIC_CLERK_JS_URL?: string;
  readonly CLERK_SECRET_KEY?: string;
  readonly SUPABASE_URL?: string;
  readonly SUPABASE_ANON_KEY?: string;
  readonly PUBLIC_SUPABASE_URL?: string;
  readonly PUBLIC_SUPABASE_ANON_KEY?: string;
  readonly TURNSTILE_SITE_KEY?: string;
  readonly TURNSTILE_SECRET_KEY?: string;
  readonly STRIPE_SECRET_KEY?: string;
  readonly STRIPE_WEBHOOK_SECRET?: string;
  readonly STRIPE_SUCCESS_URL?: string;
  readonly STRIPE_CANCEL_URL?: string;
  readonly WOMPI_PUBLIC_KEY?: string;
  readonly WOMPI_INTEGRITY_KEY?: string;
  readonly WOMPI_WEBHOOK_SECRET?: string;
  readonly PUBLIC_SITE_URL?: string;
  readonly FX_API_KEY?: string;
}
