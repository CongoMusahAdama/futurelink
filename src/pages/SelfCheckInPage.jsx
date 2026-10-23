import { useState } from "react";
import CheckInPass from "../components/CheckInPass";
import { EVENT, REGIONS } from "../data/checkin";
import { api } from "../lib/api";
import { alertCheckedIn, alertError } from "../lib/alerts";
import { formatGhanaPhone, phoneValidationMessage, sanitizePhoneInput } from "../lib/phone";
import { useVenueTheme } from "../hooks/useVenueTheme";

const STATION = "self-service";
const STORAGE_KEY = `fl-self-ticket-${EVENT.fileSlug}`;

const emptyForm = { fullName: "", phone: "", hub: "", region: "Western" };

function readSavedTicket() {
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveTicket(attendee) {
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(attendee));
  } catch {
    // Ticket still shows; it just won't be remembered on this phone.
  }
}

function formatCheckedInTime(attendee) {
  return attendee?.checkedInAt
    ? new Date(attendee.checkedInAt).toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit" })
    : null;
}

/** Public, phone-first self check-in reached by scanning the event QR poster. */
export default function SelfCheckInPage() {
  useVenueTheme();
  const [form, setForm] = useState(emptyForm);
  const [ticket, setTicket] = useState(readSavedTicket);
  const [phoneError, setPhoneError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "phone") {
      const sanitized = sanitizePhoneInput(value);
      setForm((prev) => ({ ...prev, phone: sanitized }));
      if (phoneError) setPhoneError(phoneValidationMessage(sanitized));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const finish = (attendee, isNew) => {
    saveTicket(attendee);
    setTicket(attendee);
    setForm(emptyForm);
    window.scrollTo({ top: 0, behavior: "smooth" });
    alertCheckedIn(attendee, { isNew });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const phone = form.phone.trim();
    const formatError = phoneValidationMessage(phone) || (!phone ? "Enter your phone number." : "");
    if (formatError) {
      setPhoneError(formatError);
      return;
    }

    setLoading(true);
    try {
      // Already registered with this number? Check them in and show their existing ticket.
      const check = await api.checkPhone(phone);
      if (!check.available && check.attendee?.registrationId) {
        let attendee = await api.lookup(check.attendee.registrationId);
        if (!attendee.checkedIn) attendee = await api.checkIn(attendee._id, STATION);
        finish(attendee, false);
        return;
      }

      const attendee = await api.createAttendee({
        fullName: form.fullName,
        phone: formatGhanaPhone(phone),
        hub: form.hub,
        region: form.region,
        category: "Participant",
        checkInStation: STATION,
        checkInNow: true,
      });
      finish(attendee, true);
    } catch (err) {
      if (err.message.toLowerCase().includes("phone")) setPhoneError(err.message);
      else alertError("Could not check you in", err.message || "Please try again or visit the help desk.");
    } finally {
      setLoading(false);
    }
  };

  const startOver = () => {
    try {
      window.localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
    setTicket(null);
  };

  return (
    <div className="self-checkin">
      {EVENT.flyer && !ticket && (
        <div className="self-checkin-hero">
          <img src={EVENT.flyer} alt={`${EVENT.title} flyer`} />
        </div>
      )}

      <main className={`self-checkin-main ${ticket ? "self-checkin-main--ticket" : ""}`}>
        {ticket ? (
          <>
            <CheckInPass
              registrationId={ticket.registrationId}
              fullName={ticket.fullName}
              category={ticket.category}
              checkedInTime={formatCheckedInTime(ticket)}
              attendee={ticket}
            />
            <p className="self-checkin-note">
              Keep this ticket on your phone. Show it to the team at the venue if asked.
            </p>
            <button type="button" onClick={startOver} className="self-checkin-link">
              Check in someone else
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="venue-card self-checkin-card space-y-5">
            <div className="text-center">
              <p className="self-checkin-kicker">Self check-in</p>
              <h1 className="self-checkin-title">{EVENT.title}</h1>
              <p className="self-checkin-meta">
                {EVENT.dateLabel} · {EVENT.time}
                <br />
                {EVENT.venue}
              </p>
            </div>

            <div>
              <label className="venue-label" htmlFor="self-name">Full name</label>
              <input
                id="self-name"
                name="fullName"
                required
                autoComplete="name"
                value={form.fullName}
                onChange={handleChange}
                className="venue-input venue-input-hero"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="venue-label" htmlFor="self-phone">Phone number</label>
              <input
                id="self-phone"
                name="phone"
                type="tel"
                inputMode="numeric"
                required
                autoComplete="tel"
                value={form.phone}
                onChange={handleChange}
                onBlur={() => setPhoneError(phoneValidationMessage(form.phone.trim()))}
                className={`venue-input ${phoneError ? "!border-red-400" : ""}`}
                placeholder="024 123 4567"
              />
              {phoneError && <p className="mt-1.5 text-sm text-red-600">{phoneError}</p>}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="venue-label" htmlFor="self-area">Community / Area</label>
                <input
                  id="self-area"
                  name="hub"
                  value={form.hub}
                  onChange={handleChange}
                  className="venue-input"
                  placeholder="e.g. Anaji, Adentem"
                />
              </div>
              <div>
                <label className="venue-label" htmlFor="self-region">Region</label>
                <select id="self-region" name="region" value={form.region} onChange={handleChange} className="venue-input">
                  {REGIONS.map((r) => (
                    <option key={r} value={r}>{r}</option>
                  ))}
                </select>
              </div>
            </div>

            <button type="submit" disabled={loading} className="venue-btn-primary w-full">
              {loading ? "Checking you in…" : "Check me in"}
            </button>
            <p className="self-checkin-fine">
              Already registered? Enter the same phone number to get your ticket.
            </p>
          </form>
        )}
      </main>

      <footer className="self-checkin-foot">
        {EVENT.organizer} · Check-in powered by Future-Link Services
      </footer>
    </div>
  );
}
