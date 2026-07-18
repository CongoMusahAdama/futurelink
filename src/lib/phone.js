/** Strip letters/symbols — keep digits, spaces, dashes, and a leading + */
export function sanitizePhoneInput(value) {
  let cleaned = String(value).replace(/[^\d+\s-]/g, "");
  if (cleaned.includes("+")) {
    cleaned = `+${cleaned.replace(/\+/g, "")}`;
  }
  return cleaned.slice(0, 16);
}

/** Normalize to local Ghana format: 0XXXXXXXXX */
export function normalizePhone(phone) {
  const digits = String(phone || "").replace(/\D/g, "");
  if (!digits) return "";

  if (digits.startsWith("233") && digits.length >= 12) {
    return `0${digits.slice(3, 12)}`;
  }
  if (digits.length === 9 && !digits.startsWith("0")) {
    return `0${digits}`;
  }
  if (digits.startsWith("0") && digits.length >= 10) {
    return digits.slice(0, 10);
  }
  return digits;
}

export function isValidGhanaPhone(phone) {
  const normalized = normalizePhone(phone);
  return /^0[235]\d{8}$/.test(normalized);
}

export function formatGhanaPhone(phone) {
  const normalized = normalizePhone(phone);
  if (!/^0\d{9}$/.test(normalized)) return phone.trim();
  return `${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`;
}

export function phoneValidationMessage(phone) {
  const trimmed = String(phone || "").trim();
  if (!trimmed) return "";
  if (!isValidGhanaPhone(trimmed)) {
    return "Enter a valid 10-digit Ghana number (e.g. 024 123 4567).";
  }
  return "";
}
