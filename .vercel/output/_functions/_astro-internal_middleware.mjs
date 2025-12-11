import { randomBytes } from 'node:crypto';
import 'es-module-lexer';
import './chunks/astro-designed-error-pages_CpYxP_E6.mjs';
import './chunks/astro/server_BHL5z7kF.mjs';
import 'clsx';
import 'cookie';
import { s as sequence } from './chunks/index_B7FQ6NZQ.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://www.ejemplo-ministeriomana.org", "SSR": true};
const GEO_COOKIE_NAME = "mana_geo";
const GEO_COOKIE_TTL = 60 * 60 * 12;
const NODE_ENV = process.env.NODE_ENV || "development";
const IS_PROD = NODE_ENV === "production";
const SCRIPT_SRC_BASE = [
  "'self'",
  "https://challenges.cloudflare.com",
  "https://js.stripe.com",
  "https://checkout.wompi.co",
  "https://unpkg.com"
];
const FRAME_SRC = [
  "'self'",
  "https://www.youtube.com",
  "https://www.youtube-nocookie.com",
  "https://player.vimeo.com",
  "https://checkout.stripe.com",
  "https://checkout.wompi.co",
  "https://challenges.cloudflare.com"
];
const HSTS_HEADER = "max-age=31536000; includeSubDomains; preload";
const ENGLISH_COUNTRIES = /* @__PURE__ */ new Set([
  "US",
  "GB",
  "UK",
  "AU",
  "NZ",
  "CA",
  "IE",
  "TT",
  "JM",
  "BZ",
  "BB",
  "LC",
  "GD"
]);
function parseGeoCookie(value) {
  if (!value) return void 0;
  try {
    const parsed = JSON.parse(value);
    if (!parsed?.country || !parsed?.lang || !parsed?.ts) return void 0;
    return parsed;
  } catch {
    return void 0;
  }
}
function computeLanguage(code) {
  return ENGLISH_COUNTRIES.has(code) ? "en" : "es";
}
async function lookupCountry(request) {
  const fallback = {
    country: "CO",
    lang: "es",
    ts: Date.now()
  };
  const cfIpCountry = request.headers.get("cf-ipcountry");
  if (cfIpCountry && cfIpCountry !== "XX") {
    const country = cfIpCountry.toUpperCase();
    return { country, lang: computeLanguage(country), ts: Date.now() };
  }
  const ip = getRequestIp(request);
  if (!ip || ip.startsWith("127.") || ip.startsWith("10.") || ip.startsWith("192.168")) {
    return fallback;
  }
  try {
    const res = await fetch(`https://ipapi.co/${ip}/json/`, {
      headers: { "user-agent": "ministeriomana.org/geo-middleware" }
    });
    if (!res.ok) return fallback;
    const data = await res.json();
    const country = typeof data?.country === "string" ? data.country.toUpperCase() : "CO";
    const lang = computeLanguage(country);
    return { country, lang, ts: Date.now() };
  } catch {
    return fallback;
  }
}
function getRequestIp(request) {
  const headers = request.headers;
  const cf = headers.get("cf-connecting-ip");
  if (cf) return cf;
  const xff = headers.get("x-forwarded-for");
  if (xff) return xff.split(",")[0]?.trim();
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp;
  return void 0;
}
function isSecureRequest(request) {
  const url = new URL(request.url);
  if (url.protocol === "https:") return true;
  const forwarded = request.headers.get("x-forwarded-proto");
  if (forwarded && forwarded.split(",")[0]?.trim() === "https") return true;
  return false;
}
function isLocalhost(request) {
  const host = request.headers.get("host") || new URL(request.url).host;
  return host.startsWith("localhost") || host.startsWith("127.") || host.endsWith(".local");
}
const onRequest$1 = async (context, next) => {
  const { cookies, locals, request } = context;
  const isSecure = isSecureRequest(request);
  const nonce = randomBytes(16).toString("base64");
  if (IS_PROD && !isSecure && !isLocalhost(request)) {
    const url = new URL(request.url);
    url.protocol = "https:";
    return new Response(null, {
      status: 308,
      headers: { location: url.toString() }
    });
  }
  let geo = parseGeoCookie(cookies.get(GEO_COOKIE_NAME)?.value);
  const isExpired = geo ? (Date.now() - geo.ts) / 1e3 > GEO_COOKIE_TTL : true;
  if (!geo || isExpired) {
    geo = await lookupCountry(request);
    cookies.set(GEO_COOKIE_NAME, JSON.stringify(geo), {
      path: "/",
      maxAge: GEO_COOKIE_TTL,
      sameSite: "lax",
      httpOnly: false,
      secure: isSecure
    });
  }
  locals.geo = {
    country: geo.country,
    lang: geo.lang
  };
  locals.cspNonce = nonce;
  const turnstileSiteKey = Object.assign(__vite_import_meta_env__, { NODE: process.env.NODE, _: process.env._, NODE_ENV: process.env.NODE_ENV })?.TURNSTILE_SITE_KEY ?? process.env?.TURNSTILE_SITE_KEY ?? "";
  locals.turnstile = { siteKey: turnstileSiteKey };
  const hasLangCookie = Boolean(cookies.get("lang"));
  if (!hasLangCookie) {
    cookies.set("lang", geo.lang, {
      path: "/",
      sameSite: "lax",
      secure: isSecure,
      maxAge: 60 * 60 * 24 * 365
    });
  }
  const response = await next();
  if (isSecure) {
    response.headers.set("Strict-Transport-Security", HSTS_HEADER);
  }
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set("Permissions-Policy", "geolocation=(), microphone=(), camera=(), interest-cohort=()");
  response.headers.set("X-Permitted-Cross-Domain-Policies", "none");
  const scriptSrc = [...SCRIPT_SRC_BASE, `'nonce-${nonce}'`];
  if (!IS_PROD) {
    scriptSrc.push("'unsafe-eval'");
    scriptSrc.push("'unsafe-inline'");
  }
  const cspDirectives = [
    "default-src 'self'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline' https://unpkg.com",
    "img-src 'self' data: https://*.tile.openstreetmap.org https://i.ytimg.com",
    "font-src 'self' data:",
    "connect-src 'self' https://challenges.cloudflare.com https://api.resend.com https://checkout.stripe.com https://checkout.wompi.co https://js.stripe.com",
    `frame-src ${FRAME_SRC.join(" ")}`,
    "frame-ancestors 'self'",
    "form-action 'self' https://checkout.stripe.com https://checkout.wompi.co",
    "base-uri 'self'",
    "object-src 'none'",
    "upgrade-insecure-requests"
  ].join("; ");
  response.headers.set("Content-Security-Policy", cspDirectives);
  response.headers.set("Cross-Origin-Opener-Policy", "same-origin");
  response.headers.set("Cross-Origin-Resource-Policy", "same-origin");
  return response;
};

const onRequest = sequence(
	
	onRequest$1
	
);

export { onRequest };
