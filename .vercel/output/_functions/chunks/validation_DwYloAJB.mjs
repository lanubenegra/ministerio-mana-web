const BLOCKED_PATTERN = /https?:\/\//i;
const ALLOWED_CHARS = /[^\p{L}\p{N}\s\.,:;@'"\-\(\)\+]/gu;
function sanitizePlainText(value, maxLength = 120) {
  const trimmed = (value ?? "").trim().slice(0, maxLength);
  if (!trimmed) return "";
  return trimmed.replace(ALLOWED_CHARS, "").replace(/\s+/g, " ").trim();
}
function containsBlockedSequence(value) {
  if (!value) return false;
  return BLOCKED_PATTERN.test(value);
}

export { containsBlockedSequence as c, sanitizePlainText as s };
