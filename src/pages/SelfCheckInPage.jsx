import { useState } from "react";
import { CalendarDays, CheckCircle2, MapPin, Phone, ShieldCheck, UserRound } from "lucide-react";
import CheckInPass from "../components/CheckInPass";
import { EVENT, REGIONS } from "../data/checkin";
import { api } from "../lib/api";
import { alertCheckedIn, alertError } from "../lib/alerts";
import { formatGhanaPhone, phoneValidationMessage, sanitizePhoneInput } from "../lib/phone";
import { useVenueTheme } from "../hooks/useVenueTheme";

const STATION = "self-service";

const emptyForm = { fullName: "", phone: "", hub: "", region: "Western" };

function formatCheckedInTime(attendee) {
  return attendee?.checkedInAt
    ? new Date(attendee.checkedInAt).toLocaleTimeString("en-GH", { hour: "2-digit", minute: "2-digit" })
    : null;
}

/** Public, phone-first self check-in reached by scanning the event QR poster. */
export default function SelfCheckInPage() {
  useVenueTheme();
  const [form, setForm] = useState(emptyForm);
  // Always open on the form, so a shared phone never shows the previous person's ticket.
  // A returning attendee gets their ticket back by entering the same phone number.
  const [ticket, setTicket] = useState(null);
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
    setTicket(null);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
              Tap “Save ticket” to keep it on your phone, and show it to the team at the venue if asked.
            </p>
            <button type="button" onClick={startOver} className="self-checkin-link">
              Check in someone else
            </button>
          </>
        ) : (
          <form onSubmit={handleSubmit} className="venue-card self-checkin-card">
            <div className="self-checkin-head">
              <p className="self-checkin-kicker">Self check-in</p>
              <h1 className="self-checkin-title">Welcome! Let's check you in</h1>
              <div className="self-checkin-chips">
                <span className="self-checkin-chip">
                  <CalendarDays className="h-3.5 w-3.5" aria-hidden="true" />
                  {EVENT.dateLabel} · {EVENT.time}
                </span>
                <span className="self-checkin-chip">
                  <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
                  {EVENT.venue}
                </span>
              </div>
            </div>

            <div className="self-checkin-fields">
              <div>
                <label className="self-checkin-label" htmlFor="self-name">Full name</label>
                <div className="self-checkin-field">
                  <UserRound className="self-checkin-icon" aria-hidden="true" />
                  <input
                    id="self-name"
                    name="fullName"
                    required
                    autoComplete="name"
                    value={form.fullName}
                    onChange={handleChange}
                    className="venue-input self-checkin-input"
                    placeholder="e.g. Akosua Boatemaa"
                  />
                </div>
              </div>

              <div>
                <label className="self-checkin-label" htmlFor="self-phone">Phone number</label>
                <div className="self-checkin-field">
                  <Phone className="self-checkin-icon" aria-hidden="true" />
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
                    className={`venue-input self-checkin-input ${phoneError ? "!border-red-400" : ""}`}
                    placeholder="024 123 4567"
                  />
                </div>
                {phoneError && <p className="mt-1.5 text-sm text-red-600">{phoneError}</p>}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <label className="self-checkin-label" htmlFor="self-area">
                    Community / Area <span className="self-checkin-optional">Optional</span>
                  </label>
                  <div className="self-checkin-field">
                    <MapPin className="self-checkin-icon" aria-hidden="true" />
                    <input
                      id="self-area"
                      name="hub"
                      value={form.hub}
                      onChange={handleChange}
                      className="venue-input self-checkin-input"
                      placeholder="e.g. Anaji, Adentem"
                    />
                  </div>
                </div>
                <div>
                  <label className="self-checkin-label" htmlFor="self-region">Region</label>
                  <select id="self-region" name="region" value={form.region} onChange={handleChange} className="venue-input">
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>{r}</option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            <button type="submit" disabled={loading} className="venue-btn-primary self-checkin-submit">
              {loading ? (
                "Checking you in…"
              ) : (
                <>
                  <CheckCircle2 className="h-5 w-5" aria-hidden="true" />
                  Check me in
                </>
              )}
            </button>
            <p className="self-checkin-fine">
              Already registered? Enter the same phone number to get your ticket.
            </p>
            <p className="self-checkin-privacy">
              <ShieldCheck className="h-3.5 w-3.5" aria-hidden="true" />
              Your details are only used for this event.
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
