import { SUPPORTED_CURRENCIES } from './fx';

type Gateway = 'wompi' | 'stripe';

const SUPPORTED_SET = new Set(SUPPORTED_CURRENCIES.map((code) => code.toUpperCase()));

export function preferredGatewayForCountry(country?: string): Gateway {
  if (!country) return 'stripe';
  if (country.toUpperCase() === 'CO') return 'wompi';
  return 'stripe';
}

export function languageForCountry(country?: string): 'es' | 'en' {
  if (!country) return 'es';
  const code = country.toUpperCase();
  if (['US', 'GB', 'UK', 'AU', 'NZ', 'CA', 'IE'].includes(code)) return 'en';
  return 'es';
}

export function isSpanishSpeaking(country?: string): boolean {
  if (!country) return true;
  return !['US', 'GB', 'UK', 'AU', 'NZ', 'CA', 'IE'].includes(country.toUpperCase());
}

export function stripeSupportedCurrencyCodes(): string[] {
  return ['USD', 'EUR', 'GBP', 'MXN', 'PEN', 'ARS', 'CLP', 'BRL', 'CAD', 'AUD'];
}

export function displayCurrencyOrder(country?: string): string[] {
  const defaults = ['USD', 'EUR', 'GBP', 'COP', 'MXN', 'BRL', 'CLP', 'ARS', 'PEN', 'UYU', 'PYG', 'BOB', 'CRC', 'GTQ', 'HNL', 'NIO', 'DOP', 'BZD', 'CAD', 'AUD'];

  const buildOrder = (priority: string[]): string[] => {
    const seen = new Set<string>();
    const result: string[] = [];
    for (const code of [...priority, ...defaults, ...SUPPORTED_CURRENCIES]) {
      const upper = (code || '').toUpperCase();
      if (!upper || !SUPPORTED_SET.has(upper)) continue;
      if (seen.has(upper)) continue;
      seen.add(upper);
      result.push(upper);
    }
    return result;
  };

  if (!country) return buildOrder([]);
  const code = country.toUpperCase();
  switch (code) {
    case 'MX':
      return buildOrder(['USD', 'MXN', 'COP', 'BRL', 'ARS']);
    case 'CL':
      return buildOrder(['USD', 'CLP', 'EUR', 'ARS', 'COP']);
    case 'AR':
      return buildOrder(['USD', 'ARS', 'EUR', 'BRL', 'COP']);
    case 'PE':
      return buildOrder(['USD', 'PEN', 'EUR', 'COP', 'CLP']);
    case 'BR':
      return buildOrder(['USD', 'BRL', 'EUR', 'COP', 'MXN']);
    case 'UY':
      return buildOrder(['USD', 'UYU', 'EUR', 'ARS']);
    case 'PY':
      return buildOrder(['USD', 'PYG', 'EUR', 'BRL']);
    case 'BO':
      return buildOrder(['USD', 'BOB', 'EUR', 'BRL']);
    case 'CO':
      return buildOrder(['COP', 'USD', 'EUR', 'MXN']);
    case 'GT':
      return buildOrder(['USD', 'GTQ', 'MXN', 'COP']);
    case 'CR':
      return buildOrder(['USD', 'CRC', 'MXN', 'COP']);
    case 'HN':
      return buildOrder(['USD', 'HNL', 'MXN', 'COP']);
    case 'NI':
      return buildOrder(['USD', 'NIO', 'MXN', 'COP']);
    case 'DO':
      return buildOrder(['USD', 'DOP', 'MXN', 'COP']);
    case 'BZ':
      return buildOrder(['USD', 'BZD', 'MXN', 'COP']);
    case 'CA':
      return buildOrder(['CAD', 'USD', 'EUR']);
    case 'AU':
      return buildOrder(['AUD', 'USD', 'EUR']);
    case 'ES':
      return buildOrder(['EUR', 'USD', 'GBP']);
    case 'GB':
    case 'UK':
      return buildOrder(['GBP', 'USD', 'EUR']);
    default:
      return buildOrder([]);
  }
}
