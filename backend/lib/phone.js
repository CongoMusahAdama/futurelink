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
  if (!/^0\d{9}$/.test(normalized)) return String(phone || "").trim();
  return `${normalized.slice(0, 3)} ${normalized.slice(3, 6)} ${normalized.slice(6)}`;
}

export async function findAttendeeByPhone(Attendee, phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;

  const attendees = await Attendee.find({ phone: { $ne: "" } }).lean();
  return attendees.find((a) => normalizePhone(a.phone) === normalized) || null;
}
