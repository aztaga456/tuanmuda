/**
 * WhatsApp Helper Utilities for lomboXtudio Digital Solution
 * Ensures all customer inquiries route directly to the admin-configured WhatsApp number
 * with properly sanitized international format and tailored contextual pre-filled messages.
 */

export function cleanWhatsAppNumber(phone?: string | null): string {
  if (!phone || typeof phone !== "string") {
    return "6285955343737";
  }

  // Strip all non-digit characters (spaces, dashes, plus signs, brackets)
  let cleaned = phone.replace(/\D/g, "");

  if (!cleaned || cleaned === "6281234567890") {
    return "6285955343737";
  }

  // Indonesian local formats handling:
  // "0812..." -> "62812..."
  if (cleaned.startsWith("0")) {
    cleaned = "62" + cleaned.slice(1);
  }
  // "812..." -> "62812..."
  else if (cleaned.startsWith("8")) {
    cleaned = "62" + cleaned;
  }
  // If no country code, default to 62 prefix
  else if (!cleaned.startsWith("62")) {
    cleaned = "62" + cleaned;
  }

  return cleaned;
}

export function getWhatsAppUrl(message: string, phone?: string | null): string {
  const number = cleanWhatsAppNumber(phone);
  const encodedText = encodeURIComponent(message.trim());
  return `https://wa.me/${number}?text=${encodedText}`;
}

export function openWhatsApp(message: string, phone?: string | null): void {
  const url = getWhatsAppUrl(message, phone);
  if (typeof window !== "undefined") {
    window.open(url, "_blank", "noopener,noreferrer");
  }
}
