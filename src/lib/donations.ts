export const MIN_DONATION_USD = 5;
export const MAX_DONATION_USD = 5000;
export const MIN_DONATION_COP = 5_000;
export const MAX_DONATION_COP = 50_000_000;

export function sanitizeDescription(input: string | null | undefined, fallback: string, maxLength = 80): string {
  const trimmed = (input || '').trim().slice(0, maxLength);
  if (!trimmed) return fallback;
  const cleaned = trimmed.replace(/[^\p{L}\p{N}\s\.,:&@'/-]+/gu, '').trim();
  if (/https?:\/\//i.test(cleaned)) {
    return fallback;
  }
  return cleaned || fallback;
}

export function validateUsdAmount(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error('Monto inválido');
  }
  const rounded = Math.round(value * 100) / 100;
  if (rounded < MIN_DONATION_USD) throw new Error(`Monto mínimo ${MIN_DONATION_USD} USD`);
  if (rounded > MAX_DONATION_USD) throw new Error(`Monto máximo ${MAX_DONATION_USD} USD`);
  return rounded;
}

export function validateCopAmount(value: number): number {
  if (!Number.isFinite(value)) {
    throw new Error('Monto inválido');
  }
  const rounded = Math.round(value);
  if (rounded < MIN_DONATION_COP) throw new Error(`Monto mínimo ${MIN_DONATION_COP.toLocaleString('es-CO')} COP`);
  if (rounded > MAX_DONATION_COP) throw new Error(`Monto máximo ${MAX_DONATION_COP.toLocaleString('es-CO')} COP`);
  return rounded;
}

export function safeCountry(input: string | null | undefined): string | null {
  const value = (input || '').trim().toUpperCase().slice(0, 2);
  if (!value) return null;
  if (!/^[A-Z]{2}$/.test(value)) return null;
  return value;
}
