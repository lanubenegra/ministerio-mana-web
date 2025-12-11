import { l as logSecurityEvent } from './securityEvents_Qegq-P8G.mjs';

const __vite_import_meta_env__ = {"ASSETS_PREFIX": undefined, "BASE_URL": "/", "DEV": false, "MODE": "production", "PROD": true, "SITE": "https://www.ejemplo-ministeriomana.org", "SSR": true};
const FX_TTL_MS = 1e3 * 60 * 60 * 3;
const SUPPORTED = [
  "USD",
  "EUR",
  "GBP",
  "COP",
  "MXN",
  "PEN",
  "ARS",
  "CLP",
  "BRL",
  "UYU",
  "PYG",
  "BOB",
  "CRC",
  "GTQ",
  "HNL",
  "NIO",
  "DOP",
  "BZD",
  "CAD",
  "AUD"
];
const SUPPORTED_CURRENCIES = SUPPORTED;
let cache;
const STATIC_FX = {
  timestamp: Date.now(),
  provider: "exchangerate.host",
  rates: {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    COP: 4e3,
    MXN: 17,
    PEN: 3.7,
    ARS: 900,
    CLP: 930,
    BRL: 5,
    UYU: 39,
    PYG: 7400,
    BOB: 6.9,
    CRC: 520,
    GTQ: 7.8,
    HNL: 24.5,
    NIO: 36,
    DOP: 59,
    BZD: 2,
    CAD: 1.36,
    AUD: 1.55
  }
};
function env(key) {
  return Object.assign(__vite_import_meta_env__, { _: process.env._ })?.[key] ?? process.env?.[key];
}
function mapRates(base) {
  if (!base || typeof base !== "object") return null;
  const mapped = {};
  for (const code of SUPPORTED) {
    if (code === "USD") {
      mapped.USD = 1;
      continue;
    }
    const value = Number(base[code]);
    if (!value || Number.isNaN(value)) return null;
    mapped[code] = value;
  }
  return mapped;
}
async function fetchFromOpenExchange() {
  const key = env("FX_API_KEY");
  if (!key) return null;
  const url = new URL("https://openexchangerates.org/api/latest.json");
  url.searchParams.set("app_id", key);
  url.searchParams.set("symbols", SUPPORTED.join(","));
  url.searchParams.set("prettyprint", "false");
  try {
    const res = await fetch(url.toString(), { headers: { "user-agent": "ministeriomana.org/fx-service" } });
    if (!res.ok) {
      void logSecurityEvent({
        type: "fx_fallback",
        detail: "Error de OpenExchangeRates",
        meta: { status: res.status }
      });
      return null;
    }
    const data = await res.json();
    const rates = mapRates(data?.rates);
    if (!rates) return null;
    return {
      timestamp: Date.now(),
      rates,
      provider: "openexchangerates"
    };
  } catch (error) {
    void logSecurityEvent({
      type: "fx_fallback",
      detail: "Falló OpenExchangeRates",
      meta: { error: error?.message || String(error) }
    });
    return null;
  }
}
async function fetchFromFallback() {
  const url = new URL("https://api.exchangerate.host/latest");
  url.searchParams.set("base", "USD");
  url.searchParams.set("symbols", SUPPORTED.join(","));
  try {
    const res = await fetch(url.toString(), { headers: { "user-agent": "ministeriomana.org/fx-fallback" } });
    if (!res.ok) {
      void logSecurityEvent({
        type: "fx_fallback",
        detail: "Error exchangerate.host",
        meta: { status: res.status }
      });
      return null;
    }
    const data = await res.json();
    const rates = mapRates(data?.rates);
    if (!rates) return null;
    return {
      timestamp: Date.now(),
      rates,
      provider: "exchangerate.host"
    };
  } catch (error) {
    void logSecurityEvent({
      type: "fx_fallback",
      detail: "Falló exchangerate.host",
      meta: { error: error?.message || String(error) }
    });
    return null;
  }
}
async function refreshRates() {
  const primary = await fetchFromOpenExchange();
  if (primary) {
    cache = primary;
    return primary;
  }
  void logSecurityEvent({
    type: "fx_fallback",
    detail: "Usando proveedor alterno de FX"
  });
  const fallback = await fetchFromFallback();
  if (fallback) {
    cache = fallback;
    return fallback;
  }
  if (cache) return cache;
  void logSecurityEvent({
    type: "fx_fallback",
    detail: "Usando tasas estáticas por falta de conexión"
  });
  cache = { ...STATIC_FX, timestamp: Date.now() };
  return cache;
}
async function getFxSnapshot() {
  if (cache && Date.now() - cache.timestamp < FX_TTL_MS) {
    return cache;
  }
  return refreshRates();
}

export { SUPPORTED_CURRENCIES as S, getFxSnapshot as g };
