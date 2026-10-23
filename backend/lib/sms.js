import { EVENT } from "../../src/data/checkin.js";

const MNOTIFY_URL = "https://api.mnotify.com/api/sms/quick";
const TIMEOUT_MS = 5000;

/** Confirmation text, kept within one 160-character SMS where possible. */
export function checkInMessage(attendee) {
  const firstName = String(attendee.preferredName || attendee.fullName || "").trim().split(/\s+/)[0] || "there";
  return `Hi ${firstName}, you're checked in to ${EVENT.title} at ${EVENT.venue}. Your ID: ${attendee.registrationId}. Thank you!`;
}

/**
 * Send the check-in confirmation via mNotify. Never throws: SMS problems
 * (missing key, no credit, network) must not block a check-in.
 * Disabled until MNOTIFY_API_KEY is set; sender defaults to MNOTIFY_SENDER_ID.
 */
export async function sendCheckInSms(attendee) {
  const key = process.env.MNOTIFY_API_KEY;
  const sender = process.env.MNOTIFY_SENDER_ID;
  const phone = String(attendee?.phone || "").replace(/\D/g, "");
  if (!key || !sender || !phone) return { sent: false, reason: "not configured or no phone" };

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(`${MNOTIFY_URL}?key=${encodeURIComponent(key)}`, {
      method: "POST",
      headers: { "Content-Type": "application/json", Accept: "application/json" },
      body: JSON.stringify({
        recipient: [phone],
        sender,
        message: checkInMessage(attendee),
        is_schedule: false,
        schedule_date: "",
      }),
      signal: controller.signal,
    });
    const body = await res.json().catch(() => ({}));
    const sent = res.ok && body.status === "success";
    if (!sent) console.error("mNotify SMS failed:", res.status, JSON.stringify(body));
    return { sent, response: body };
  } catch (err) {
    console.error("mNotify SMS error:", err.message);
    return { sent: false, reason: err.message };
  } finally {
    clearTimeout(timer);
  }
}
