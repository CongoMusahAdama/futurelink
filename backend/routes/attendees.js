import { Router } from "express";
import Attendee from "../models/Attendee.js";
import {
  findAttendeeByPhone,
  formatGhanaPhone,
  isValidGhanaPhone,
  normalizePhone,
} from "../lib/phone.js";

const router = Router();

async function nextRegistrationId() {
  const count = await Attendee.countDocuments();
  return `GH-${String(count + 1).padStart(3, "0")}`;
}

router.get("/stats", async (_req, res) => {
  try {
    const attendees = await Attendee.find().lean();
    const total = attendees.length;
    const checkedIn = attendees.filter((a) => a.checkedIn).length;
    const walkIns = attendees.filter((a) => a.isWalkIn).length;

    const regionMap = {};
    const categoryMap = {};
    const hours = Object.fromEntries(
      Array.from({ length: 24 }, (_, i) => [String(i).padStart(2, "0"), 0])
    );

    for (const a of attendees) {
      if (!a.checkedIn) continue;
      const region = a.region?.trim() || "Unknown";
      const category = a.category?.trim() || "Guest";
      regionMap[region] = (regionMap[region] || 0) + 1;
      categoryMap[category] = (categoryMap[category] || 0) + 1;
      if (a.checkedInAt) {
        const h = String(new Date(a.checkedInAt).getHours()).padStart(2, "0");
        hours[h] += 1;
      }
    }

    const toSorted = (map) =>
      Object.entries(map)
        .map(([label, count]) => ({ label, count }))
        .sort((a, b) => b.count - a.count);

    const byHour = Object.entries(hours).map(([hour, count]) => ({ hour, count }));
    const peak = byHour.reduce((best, row) => (row.count > best.count ? row : best), byHour[0]);

    res.json({
      total,
      checkedIn,
      walkIns,
      pending: total - checkedIn,
      rate: total ? Math.round((checkedIn / total) * 100) : 0,
      byRegion: toSorted(regionMap),
      byCategory: toSorted(categoryMap),
      byHour,
      peakHour: peak.count > 0 ? `${peak.hour}:00` : "—",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/export", async (_req, res) => {
  try {
    const attendees = await Attendee.find().sort({ createdAt: 1 }).lean();
    const headers = [
      "registrationId",
      "fullName",
      "preferredName",
      "email",
      "phone",
      "organisation",
      "hub",
      "region",
      "category",
      "checkedIn",
      "checkedInAt",
      "checkInStation",
      "isWalkIn",
      "futureLinkOptIn",
    ];
    const rows = attendees.map((a) =>
      headers.map((h) => {
        const val = a[h];
        if (val === null || val === undefined) return "";
        if (val instanceof Date) return val.toISOString();
        return String(val).replace(/"/g, '""');
      })
    );
    const csv = [headers.join(","), ...rows.map((r) => r.map((c) => `"${c}"`).join(","))].join(
      "\n"
    );
    res.setHeader("Content-Type", "text/csv");
    res.setHeader("Content-Disposition", 'attachment; filename="ghana-hubs-agm-attendees.csv"');
    res.send(csv);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/", async (_req, res) => {
  try {
    const attendees = await Attendee.find().sort({ createdAt: -1 }).lean();
    res.json(attendees);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/phone-check", async (req, res) => {
  try {
    const phone = String(req.query.phone || "").trim();
    if (!phone) {
      return res.json({ available: true });
    }

    if (!isValidGhanaPhone(phone)) {
      return res.status(400).json({
        available: false,
        error: "Enter a valid 10-digit Ghana phone number (e.g. 024 123 4567).",
      });
    }

    const existing = await findAttendeeByPhone(Attendee, phone);
    if (existing) {
      return res.json({
        available: false,
        attendee: {
          registrationId: existing.registrationId,
          fullName: existing.fullName,
          checkedIn: existing.checkedIn,
        },
      });
    }

    res.json({ available: true, normalized: normalizePhone(phone) });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.get("/lookup/:registrationId", async (req, res) => {
  try {
    const id = req.params.registrationId.toUpperCase();
    const attendee = await Attendee.findOne({ registrationId: id });
    if (!attendee) return res.status(404).json({ error: "Not found" });
    res.json(attendee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      fullName,
      preferredName,
      email,
      phone,
      organisation,
      hub,
      region,
      category,
      checkInStation,
      checkInNow,
      futureLinkOptIn,
    } = req.body;

    if (!fullName?.trim()) {
      return res.status(400).json({ error: "Full name is required" });
    }

    const phoneTrimmed = phone?.trim() || "";
    if (phoneTrimmed) {
      if (!isValidGhanaPhone(phoneTrimmed)) {
        return res.status(400).json({
          error: "Enter a valid 10-digit Ghana phone number (e.g. 024 123 4567).",
        });
      }

      const existing = await findAttendeeByPhone(Attendee, phoneTrimmed);
      if (existing) {
        return res.status(409).json({
          error: `This phone number is already registered (${existing.registrationId} · ${existing.fullName}).`,
          registrationId: existing.registrationId,
          fullName: existing.fullName,
          checkedIn: existing.checkedIn,
        });
      }
    }

    const registrationId = await nextRegistrationId();
    const shouldCheckIn = checkInNow !== false;

    const attendee = await Attendee.create({
      registrationId,
      fullName: fullName.trim(),
      preferredName: preferredName?.trim() || fullName.trim(),
      email: email?.trim() || "",
      phone: phoneTrimmed ? formatGhanaPhone(phoneTrimmed) : "",
      organisation: organisation?.trim() || "",
      hub: hub?.trim() || "",
      region: region?.trim() || "",
      category: category || "Guest",
      isWalkIn: true,
      futureLinkOptIn: Boolean(futureLinkOptIn),
      checkedIn: shouldCheckIn,
      checkedInAt: shouldCheckIn ? new Date() : null,
      checkInStation: shouldCheckIn ? checkInStation || "help-desk" : "",
    });

    res.status(201).json(attendee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

router.patch("/:id/checkin", async (req, res) => {
  try {
    const { checkInStation } = req.body;
    const attendee = await Attendee.findByIdAndUpdate(
      req.params.id,
      {
        checkedIn: true,
        checkedInAt: new Date(),
        checkInStation: checkInStation || "fast-lane",
      },
      { new: true }
    );
    if (!attendee) return res.status(404).json({ error: "Not found" });
    res.json(attendee);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
