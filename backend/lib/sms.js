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

const BULK_BATCH_SIZE = 200;

export function isSmsConfigured() {
  return Boolean(process.env.MNOTIFY_API_KEY && process.env.MNOTIFY_SENDER_ID);
}

/**
 * Send one message to many numbers via mNotify, in batches.
 * Returns { sent, failed, batches: [{ ok, count, response }] }.
 */
export async function sendBulkSms(phones, message) {
  const key = process.env.MNOTIFY_API_KEY;
  const sender = process.env.MNOTIFY_SENDER_ID;
  if (!key || !sender) throw new Error("SMS is not configured (MNOTIFY_API_KEY / MNOTIFY_SENDER_ID).");

  const batches = [];
  for (let i = 0; i < phones.length; i += BULK_BATCH_SIZE) {
    const recipient = phones.slice(i, i + BULK_BATCH_SIZE);
    try {
      const res = await fetch(`${MNOTIFY_URL}?key=${encodeURIComponent(key)}`, {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({ recipient, sender, message, is_schedule: false, schedule_date: "" }),
      });
      const body = await res.json().catch(() => ({}));
      const ok = res.ok && body.status === "success";
      if (!ok) console.error("mNotify bulk batch failed:", res.status, JSON.stringify(body));
      batches.push({ ok, count: recipient.length, response: body });
    } catch (err) {
      console.error("mNotify bulk batch error:", err.message);
      batches.push({ ok: false, count: recipient.length, response: { error: err.message } });
    }
  }
  const sent = batches.filter((b) => b.ok).reduce((n, b) => n + b.count, 0);
  return { sent, failed: phones.length - sent, batches };
}

/** mNotify SMS credit balance, or null if unavailable. */
export async function getSmsBalance() {
  const key = process.env.MNOTIFY_API_KEY;
  if (!key) return null;
  try {
    const res = await fetch(`https://api.mnotify.com/api/balance/sms?key=${encodeURIComponent(key)}`);
    const body = await res.json().catch(() => ({}));
    return res.ok && body.balance != null ? body.balance : null;
  } catch {
    return null;
  }
}
