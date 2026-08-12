/**
 * Input Sanitization and Validation Helper for UNSW Club Portal
 * Prevents XSS, Script Injection, Null Byte attacks, and Payload Flooding.
 */

export function sanitizeText(input: unknown, maxLength: number = 1000): string {
  if (typeof input !== "string") return "";
  
  // Remove null bytes
  let cleaned = input.replace(/\0/g, "");

  // Strip HTML / Script tags
  cleaned = cleaned
    .replace(/<script\b[^<]*>([\s\S]*?)<\/script>/gi, "")
    .replace(/<[^>]+>/g, "")
    .replace(/javascript:/gi, "")
    .replace(/data:/gi, "");

  // Normalize whitespace and clamp max length
  cleaned = cleaned.trim();
  if (cleaned.length > maxLength) {
    cleaned = cleaned.slice(0, maxLength);
  }

  return cleaned;
}

export function sanitizeEmail(email: unknown): string {
  if (typeof email !== "string") return "";
  const cleaned = sanitizeText(email, 120).toLowerCase();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(cleaned)) return "";
  return cleaned;
}

export function sanitizeUrl(url: unknown): string | null {
  if (typeof url !== "string" || !url.trim()) return null;
  const cleaned = url.trim();
  if (cleaned.startsWith("http://") || cleaned.startsWith("https://")) {
    return sanitizeText(cleaned, 500);
  }
  return null;
}
