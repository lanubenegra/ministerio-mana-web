const BLOCKED_PATTERN = /https?:\/\//i;
const ALLOWED_CHARS = /[^\p{L}\p{N}\s\.,:;@'"\-\(\)\+]/gu;

export function sanitizePlainText(value: string | null | undefined, maxLength = 120): string {
  const trimmed = (value ?? '').trim().slice(0, maxLength);
  if (!trimmed) return '';
  return trimmed.replace(ALLOWED_CHARS, '').replace(/\s+/g, ' ').trim();
}

export function containsBlockedSequence(value: string | null | undefined): boolean {
  if (!value) return false;
  return BLOCKED_PATTERN.test(value);
}
