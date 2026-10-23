import { Router } from "express";
import Attendee from "../models/Attendee.js";
import { isValidGhanaPhone, normalizePhone } from "../lib/phone.js";
import { getSmsBalance, isSmsConfigured, sendBulkSms } from "../lib/sms.js";
import { verifyOpsLogin } from "../lib/opsAuth.js";

const router = Router();
const MAX_MESSAGE_LENGTH = 612; // 4 SMS parts

/** Unique, valid phone numbers for the chosen audience ("all" or "checked-in"). */
async function audiencePhones(audience) {
  const filter = audience === "checked-in" ? { checkedIn: true } : {};
  const rows = await Attendee.find({ ...filter, phone: { $ne: "" } }, { phone: 1, _id: 0 }).lean();
  return [...new Set(rows.map((r) => normalizePhone(r.phone)).filter((p) => isValidGhanaPhone(p)))];
}

router.get("/status", async (req, res) => {
  try {
    const [all, checkedIn, balance] = await Promise.all([
      audiencePhones("all"),
      audiencePhones("checked-in"),
      getSmsBalance(),
    ]);
    res.json({
      configured: isSmsConfigured(),
      sender: process.env.MNOTIFY_SENDER_ID || null,
      balance,
      recipients: { all: all.length, "checked-in": checkedIn.length },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/bulk", async (req, res) => {
  try {
    const { email, password, message, audience = "all" } = req.body || {};
    if (!verifyOpsLogin(email, password)) {
      return res.status(401).json({ error: "Email or password is incorrect." });
    }
    const text = String(message || "").trim();
    if (!text) return res.status(400).json({ error: "Write a message first." });
    if (text.length > MAX_MESSAGE_LENGTH) {
      return res.status(400).json({ error: `Message is too long (max ${MAX_MESSAGE_LENGTH} characters).` });
    }
    if (!isSmsConfigured()) {
      return res.status(503).json({ error: "SMS is not set up yet — add MNOTIFY_API_KEY and MNOTIFY_SENDER_ID in Vercel." });
    }

    const phones = await audiencePhones(audience);
    if (phones.length === 0) return res.status(400).json({ error: "No attendees with phone numbers to send to." });

    const result = await sendBulkSms(phones, text);
    console.log(`Bulk SMS by ${email}: ${result.sent} sent, ${result.failed} failed`);
    res.status(result.sent > 0 ? 200 : 502).json({
      total: phones.length,
      sent: result.sent,
      failed: result.failed,
      error: result.sent > 0 ? undefined : result.batches[0]?.response?.error || result.batches[0]?.response?.message || "mNotify rejected the message.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
