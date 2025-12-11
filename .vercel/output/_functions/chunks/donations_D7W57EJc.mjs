const MIN_DONATION_USD = 5;
const MAX_DONATION_USD = 5e3;
const MIN_DONATION_COP = 5e3;
const MAX_DONATION_COP = 5e7;
function sanitizeDescription(input, fallback, maxLength = 80) {
  const trimmed = (input || "").trim().slice(0, maxLength);
  if (!trimmed) return fallback;
  const cleaned = trimmed.replace(/[^\p{L}\p{N}\s\.,:&@'/-]+/gu, "").trim();
  if (/https?:\/\//i.test(cleaned)) {
    return fallback;
  }
  return cleaned || fallback;
}
function validateUsdAmount(value) {
  if (!Number.isFinite(value)) {
    throw new Error("Monto inválido");
  }
  const rounded = Math.round(value * 100) / 100;
  if (rounded < MIN_DONATION_USD) throw new Error(`Monto mínimo ${MIN_DONATION_USD} USD`);
  if (rounded > MAX_DONATION_USD) throw new Error(`Monto máximo ${MAX_DONATION_USD} USD`);
  return rounded;
}
function validateCopAmount(value) {
  if (!Number.isFinite(value)) {
    throw new Error("Monto inválido");
  }
  const rounded = Math.round(value);
  if (rounded < MIN_DONATION_COP) throw new Error(`Monto mínimo ${MIN_DONATION_COP.toLocaleString("es-CO")} COP`);
  if (rounded > MAX_DONATION_COP) throw new Error(`Monto máximo ${MAX_DONATION_COP.toLocaleString("es-CO")} COP`);
  return rounded;
}
function safeCountry(input) {
  const value = (input || "").trim().toUpperCase().slice(0, 2);
  if (!value) return null;
  if (!/^[A-Z]{2}$/.test(value)) return null;
  return value;
}

export { sanitizeDescription as a, validateCopAmount as b, safeCountry as s, validateUsdAmount as v };
