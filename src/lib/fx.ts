import { logSecurityEvent } from './securityEvents';

const FX_TTL_MS = 1000 * 60 * 60 * 3; // 3 hours
const SUPPORTED = [
  'USD',
  'EUR',
  'GBP',
  'COP',
  'MXN',
  'PEN',
  'ARS',
  'CLP',
  'BRL',
  'UYU',
  'PYG',
  'BOB',
  'CRC',
  'GTQ',
  'HNL',
  'NIO',
  'DOP',
  'BZD',
  'CAD',
  'AUD'
] as const;

export type Currency = (typeof SUPPORTED)[number];
export const SUPPORTED_CURRENCIES = SUPPORTED;

export type FxSnapshot = {
  timestamp: number;
  rates: Record<Currency, number>;
  provider: 'openexchangerates' | 'exchangerate.host';
};

let cache: FxSnapshot | undefined;
const STATIC_FX: FxSnapshot = {
  timestamp: Date.now(),
  provider: 'exchangerate.host',
  rates: {
    USD: 1,
    EUR: 0.92,
    GBP: 0.78,
    COP: 4000,
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
    AUD: 1.55,
  },
};

function env(key: string): string | undefined {
  return import.meta.env?.[key] ?? process.env?.[key];
}

function mapRates(base: any): Record<Currency, number> | null {
  if (!base || typeof base !== 'object') return null;
  const mapped: Partial<Record<Currency, number>> = {};
  for (const code of SUPPORTED) {
    if (code === 'USD') {
      mapped.USD = 1;
      continue;
    }
    const value = Number(base[code]);
    if (!value || Number.isNaN(value)) return null;
    mapped[code] = value;
  }
  return mapped as Record<Currency, number>;
}

async function fetchFromOpenExchange(): Promise<FxSnapshot | null> {
  const key = env('FX_API_KEY');
  if (!key) return null;
  const url = new URL('https://openexchangerates.org/api/latest.json');
  url.searchParams.set('app_id', key);
  url.searchParams.set('symbols', SUPPORTED.join(','));
  url.searchParams.set('prettyprint', 'false');

  try {
    const res = await fetch(url.toString(), { headers: { 'user-agent': 'ministeriomana.org/fx-service' } });
    if (!res.ok) {
      void logSecurityEvent({
        type: 'fx_fallback',
        detail: 'Error de OpenExchangeRates',
        meta: { status: res.status },
      });
      return null;
    }
    const data = await res.json();
    const rates = mapRates(data?.rates);
    if (!rates) return null;
    return {
      timestamp: Date.now(),
      rates,
      provider: 'openexchangerates',
    };
  } catch (error: any) {
    void logSecurityEvent({
      type: 'fx_fallback',
      detail: 'Falló OpenExchangeRates',
      meta: { error: error?.message || String(error) },
    });
    return null;
  }
}

async function fetchFromFallback(): Promise<FxSnapshot | null> {
  const url = new URL('https://api.exchangerate.host/latest');
  url.searchParams.set('base', 'USD');
  url.searchParams.set('symbols', SUPPORTED.join(','));

  try {
    const res = await fetch(url.toString(), { headers: { 'user-agent': 'ministeriomana.org/fx-fallback' } });
    if (!res.ok) {
      void logSecurityEvent({
        type: 'fx_fallback',
        detail: 'Error exchangerate.host',
        meta: { status: res.status },
      });
      return null;
    }
    const data = await res.json();
    const rates = mapRates(data?.rates);
    if (!rates) return null;
    return {
      timestamp: Date.now(),
      rates,
      provider: 'exchangerate.host',
    };
  } catch (error: any) {
    void logSecurityEvent({
      type: 'fx_fallback',
      detail: 'Falló exchangerate.host',
      meta: { error: error?.message || String(error) },
    });
    return null;
  }
}

async function refreshRates(): Promise<FxSnapshot> {
  const primary = await fetchFromOpenExchange();
  if (primary) {
    cache = primary;
    return primary;
  }
  void logSecurityEvent({
    type: 'fx_fallback',
    detail: 'Usando proveedor alterno de FX',
  });
  const fallback = await fetchFromFallback();
  if (fallback) {
    cache = fallback;
    return fallback;
  }
  if (cache) return cache;
  void logSecurityEvent({
    type: 'fx_fallback',
    detail: 'Usando tasas estáticas por falta de conexión',
  });
  cache = { ...STATIC_FX, timestamp: Date.now() };
  return cache;
}

export async function getFxSnapshot(): Promise<FxSnapshot> {
  if (cache && Date.now() - cache.timestamp < FX_TTL_MS) {
    return cache;
  }
  return refreshRates();
}

export function convertAmount(value: number, from: Currency, to: Currency, rates: FxSnapshot['rates']): number {
  if (from === to) return value;
  const fromRate = rates[from];
  const toRate = rates[to];
  if (!fromRate || !toRate) throw new Error(`Conversión invalida de ${from} a ${to}`);
  // valores respecto a USD
  const usdValue = from === 'USD' ? value : value / fromRate;
  const target = to === 'USD' ? usdValue : usdValue * toRate;
  return target;
}

export function formatCurrency(amount: number, currency: Currency, locale = 'es-CO'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      maximumFractionDigits: currency === 'USD' ? 2 : 0,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

export function getSupportedCurrencies(): Currency[] {
  return Array.from(SUPPORTED);
}
