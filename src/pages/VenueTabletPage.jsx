import { useEffect, useRef, useState } from "react";
import {
  ArrowRight,
  ChevronLeft,
  Crown,
  Headphones,
  LayoutDashboard,
  Radio,
  Zap,
} from "lucide-react";
import EventLogo from "../components/EventLogo";
import CheckInPass from "../components/CheckInPass";
import Logo from "../components/Logo";
import QrScanner, { FastLaneManualEntry, FastLaneModeToggle } from "../components/QrScanner";
import { AlreadyCheckedInScreen, CheckInErrorScreen } from "../components/VenueStatusScreen";
import { computeStatsFromAttendees, DUMMY_ATTENDEES } from "../data/dummyAttendees";
import { api } from "../lib/api";
import {
  formatGhanaPhone,
  phoneValidationMessage,
  sanitizePhoneInput,
} from "../lib/phone";
import { CATEGORIES, REGIONS } from "../data/checkin";
import { useConnectionStatus, useLiveStats } from "../hooks/useVenue";

const STATIONS = [
  {
    id: "help-desk",
    num: "01",
    label: "Help Desk",
    hint: "Walk-ins & registration",
    detail: "Register new attendees on-site",
    icon: Headphones,
  },
  {
    id: "fast-lane",
    num: "02",
    label: "Fast Lane",
    hint: "Registration ID check-in",
    detail: "Scan or enter GH-001 style IDs",
    icon: Zap,
    featured: true,
  },
  {
    id: "vip",
    num: "03",
    label: "VIP Desk",
    hint: "Speakers & sponsors",
    detail: "Priority lane for VIP guests",
    icon: Crown,
  },
];

const emptyForm = {
  fullName: "",
  phone: "",
  organisation: "",
  hub: "",
  region: "Ashanti",
  category: "Guest",
  futureLinkOptIn: false,
};

export default function VenueTabletPage() {
  const [station, setStation] = useState(() => sessionStorage.getItem("venue-station"));
  const [form, setForm] = useState(emptyForm);
  const [showMore, setShowMore] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(null);
  const [lookupId, setLookupId] = useState("");
  const [fastLaneMode, setFastLaneMode] = useState("scan");
  const [alreadyCheckedIn, setAlreadyCheckedIn] = useState(null);
  const [errorScreen, setErrorScreen] = useState(null);
  const [phoneError, setPhoneError] = useState("");
  const [phoneChecking, setPhoneChecking] = useState(false);
  const nameRef = useRef(null);

  const { connected } = useConnectionStatus();
  const stats = useLiveStats();

  useEffect(() => {
    document.documentElement.classList.add("venue-tablet");
    return () => document.documentElement.classList.remove("venue-tablet");
  }, []);

  useEffect(() => {
    if (station && nameRef.current && station !== "fast-lane" && !success) {
      nameRef.current.focus();
    }
  }, [station, success]);

  const pickStation = (id) => {
    sessionStorage.setItem("venue-station", id);
    setStation(id);
    resetFlow();
  };

  const resetFlow = () => {
    setSuccess(null);
    setError("");
    setErrorScreen(null);
    setAlreadyCheckedIn(null);
    setLookupId("");
    setForm(emptyForm);
    setShowMore(false);
    setPhoneError("");
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "phone") {
      const sanitized = sanitizePhoneInput(value);
      setForm((prev) => ({ ...prev, phone: sanitized }));
      setPhoneError(phoneValidationMessage(sanitized));
      return;
    }
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const verifyPhoneRegistration = async (phone) => {
    const trimmed = phone.trim();
    if (!trimmed) {
      setPhoneError("");
      return true;
    }

    const formatError = phoneValidationMessage(trimmed);
    if (formatError) {
      setPhoneError(formatError);
      return false;
    }

    setPhoneChecking(true);
    try {
      const result = await api.checkPhone(trimmed);
      if (!result.available) {
        const who = result.attendee;
        const status = who?.checkedIn ? "already checked in" : "already registered";
        setPhoneError(
          who
            ? `This number is ${status} as ${who.registrationId} (${who.fullName}).`
            : "This phone number is already registered."
        );
        return false;
      }
      setPhoneError("");
      return true;
    } catch (err) {
      // Don't block registration when duplicate check is temporarily unavailable
      const msg = err.message || "";
      if (msg.includes("unavailable") || msg.includes("404") || msg.includes("fetch")) {
        setPhoneError("");
        return true;
      }
      setPhoneError(msg);
      return false;
    } finally {
      setPhoneChecking(false);
    }
  };

  const handlePhoneBlur = () => {
    if (form.phone.trim()) {
      verifyPhoneRegistration(form.phone);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError("");
    setPhoneError("");

    const trimmedPhone = form.phone.trim();
    if (trimmedPhone) {
      const formatError = phoneValidationMessage(trimmedPhone);
      if (formatError) {
        setPhoneError(formatError);
        return;
      }
      const phoneOk = await verifyPhoneRegistration(trimmedPhone);
      if (!phoneOk) return;
    }

    setLoading(true);
    try {
      const attendee = await api.createAttendee({
        ...form,
        phone: trimmedPhone ? formatGhanaPhone(trimmedPhone) : "",
        checkInStation: station,
        checkInNow: true,
      });
      setSuccess(attendee);
      setForm(emptyForm);
      setShowMore(false);
      setPhoneError("");
    } catch (err) {
      setError(err.message);
      if (err.message.toLowerCase().includes("phone")) {
        setPhoneError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFastLaneCheckIn = async (rawId) => {
    let id = String(rawId || lookupId).trim().toUpperCase();
    const ghMatch = id.match(/^GH-(\d+)$/);
    if (ghMatch) {
      id = `GH-${ghMatch[1].padStart(3, "0")}`;
    }
    if (!id) return;
    setLoading(true);
    setError("");
    setErrorScreen(null);
    setAlreadyCheckedIn(null);
    try {
      const attendee = await api.lookup(id);
      if (attendee.checkedIn) {
        setAlreadyCheckedIn(attendee);
        return;
      }
      const updated = await api.checkIn(attendee._id, "fast-lane");
      setSuccess(updated);
      setLookupId("");
    } catch {
      setErrorScreen({
        message: "Registration not found",
        hint: "Verify the ID or visit Help Desk for walk-in registration.",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleLookup = async (e) => {
    e.preventDefault();
    await handleFastLaneCheckIn(lookupId);
  };

  if (!station) {
    const displayStats =
      stats && stats.total > 0 ? stats : computeStatsFromAttendees(DUMMY_ATTENDEES);
    const usingDemoStats = !stats || stats.total === 0;

    return (
      <div className="venue-screen venue-home">
        <div className="venue-home-banner">
          <div className="venue-wrap-wide flex flex-wrap items-center justify-between gap-4 py-4">
            <EventLogo variant="light" size="lg" />
            <div className="flex items-center gap-3">
              <span className={`venue-pill ${connected ? "venue-pill-live" : "venue-pill-off"}`}>
                {connected ? "Live" : "Offline"}
              </span>
              <a href="#dashboard" className="venue-dash-link">
                <LayoutDashboard className="h-4 w-4 text-brand-blue" />
                Dashboard
              </a>
            </div>
          </div>
        </div>

        <main className="venue-wrap-wide flex-1 pb-12 pt-8">
          <div className="venue-home-hero">
            <div className="flex flex-wrap items-start justify-between gap-6">
              <div className="max-w-2xl">
                <EventLogo size="md" className="mb-4 lg:hidden" />
                <p className="text-xs font-semibold uppercase tracking-wider text-brand-blue">
                  Future-Link · Venue Check-in
                </p>
                <h1 className="mt-2 text-3xl font-bold tracking-tight text-navy sm:text-4xl">
                  Ghana Hubs Network AGM 2026
                </h1>
                <p className="mt-2 text-slate-500">Kumasi · Choose a registration station to begin</p>
                <span className="mt-4 inline-flex rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-brand-blue ring-1 ring-blue-100">
                  Mon 21 Jul 2026
                </span>
              </div>

              <div className="grid w-full grid-cols-3 gap-3 sm:w-auto sm:min-w-[280px]">
                <div className="venue-stat-chip">
                  <p className="venue-stat-value">{displayStats.total}</p>
                  <p className="venue-stat-label">Registered</p>
                </div>
                <div className="venue-stat-chip venue-stat-chip-accent">
                  <p className="venue-stat-value">{displayStats.checkedIn}</p>
                  <p className="venue-stat-label">Checked in</p>
                </div>
                <div className="venue-stat-chip">
                  <p className="venue-stat-value">{displayStats.rate}%</p>
                  <p className="venue-stat-label">Rate</p>
                </div>
              </div>
            </div>

            {usingDemoStats && (
              <p className="mt-4 text-xs text-amber-700">
                Sample stats shown for preview — live counts appear after check-ins start.
              </p>
            )}
          </div>

          <section className="venue-stations-panel">
            <div className="venue-stations-panel-head">
              <div>
                <p className="venue-section-label !mt-0 !mb-1">Registration stations</p>
                <p className="text-sm text-slate-500">Tap a station to open the check-in flow</p>
              </div>
              <span className="venue-stations-count">{STATIONS.length} lanes open</span>
            </div>

            <div className="venue-stations-grid">
              {STATIONS.map((s) => {
                const Icon = s.icon;
                return (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => pickStation(s.id)}
                    className={`venue-station-card venue-station-${s.id}${s.featured ? " venue-station-featured" : ""}`}
                  >
                    <span className="venue-station-num">{s.num}</span>

                    <div className="venue-station-icon-wrap">
                      <Icon className="h-7 w-7" strokeWidth={2} />
                    </div>

                    <div className="venue-station-copy">
                      <div className="venue-station-title-row">
                        <h3 className="venue-station-title">{s.label}</h3>
                        <span className="venue-station-open">Open</span>
                      </div>
                      <p className="venue-station-hint">{s.hint}</p>
                      <p className="venue-station-detail">{s.detail}</p>
                    </div>

                    <div className="venue-station-action">
                      <span className="venue-station-action-text">Start session</span>
                      <span className="venue-station-go">
                        <ArrowRight className="h-4 w-4" />
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </section>

          <div className="venue-home-footer">
            <div className="flex items-center gap-2 text-sm text-slate-500">
              <Radio className="h-4 w-4 text-brand-blue" />
              <span>Updates every 8 seconds</span>
            </div>
            <div className="flex items-center gap-2 text-xs text-slate-400">
              <span>Powered by</span>
              <Logo size="sm" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  const stationLabel = STATIONS.find((s) => s.id === station)?.label;

  if (success) {
    const checkedInTime = success.checkedInAt
      ? new Date(success.checkedInAt).toLocaleTimeString("en-GH", {
          hour: "2-digit",
          minute: "2-digit",
        })
      : null;

    return (
      <div className="venue-screen venue-success-screen venue-success-flow">
        <div className="venue-home-banner relative z-10 py-4">
          <div className="venue-wrap-wide flex justify-center">
            <EventLogo variant="light" size="md" />
          </div>
        </div>

        <div className="venue-success-body">
          <div className="venue-wrap relative z-10 flex flex-col justify-center px-4 py-6">
            <CheckInPass
              registrationId={success.registrationId}
              fullName={success.fullName}
              category={success.category}
              checkedInTime={checkedInTime}
              attendee={success}
            />
          </div>
        </div>

        <div className="venue-sticky-footer">
          <div className="venue-wrap">
            <button type="button" onClick={resetFlow} className="venue-btn-primary venue-btn-hero w-full">
              Next attendee
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (alreadyCheckedIn) {
    return (
      <AlreadyCheckedInScreen attendee={alreadyCheckedIn} onNext={resetFlow} />
    );
  }

  if (errorScreen) {
    return (
      <CheckInErrorScreen
        message={errorScreen.message}
        hint={errorScreen.hint}
        onRetry={resetFlow}
      />
    );
  }

  return (
    <div className="venue-screen venue-station-screen">
      <header className="venue-topbar">
        <button
          type="button"
          onClick={() => {
            sessionStorage.removeItem("venue-station");
            setStation(null);
          }}
          className="venue-touch-back venue-touch-btn flex items-center gap-1.5 text-sm font-semibold text-slate-600"
        >
          <ChevronLeft className="h-5 w-5" />
          Stations
        </button>
        <EventLogo size="md" className="venue-topbar-logo justify-self-center" />
        <div className="flex flex-col items-end gap-1">
          <p className="text-xs font-semibold uppercase tracking-wide text-brand-blue">{stationLabel}</p>
          <span className={`venue-pill ${connected ? "venue-pill-live" : "venue-pill-off"}`}>
            {connected ? "Live" : "Offline"}
          </span>
          {stats && stats.total > 0 && (
            <span className="text-xs text-slate-400">{stats.checkedIn} in</span>
          )}
        </div>
      </header>

      <main className="venue-wrap flex-1 py-6">
        {error && (
          <div className="mb-5 rounded-2xl bg-red-50 px-4 py-3 text-center text-sm text-red-700">{error}</div>
        )}

        {station === "fast-lane" ? (
          <div className="venue-fastlane mx-auto max-w-lg">
            <div className="venue-fastlane-card">
              <div className="venue-fastlane-header">
                <div className="venue-fastlane-icon">
                  <Zap className="h-7 w-7" strokeWidth={2.25} />
                </div>
                <div>
                  <p className="venue-fastlane-kicker">Station 02 · Fast Lane</p>
                  <h2 className="venue-fastlane-title">Quick check-in</h2>
                </div>
                {stats && stats.total > 0 && (
                  <div className="venue-fastlane-stat">
                    <span className="venue-fastlane-stat-value">{stats.checkedIn}</span>
                    <span className="venue-fastlane-stat-label">checked in</span>
                  </div>
                )}
              </div>

              <div className="venue-fastlane-body">
                <p className="venue-fastlane-subtitle">Scan QR code or enter registration ID</p>

                <FastLaneModeToggle mode={fastLaneMode} onChange={setFastLaneMode} />

                {loading && (
                  <div className="venue-fastlane-loading">
                    <div className="venue-scanner-spinner" aria-hidden />
                    <p>Checking in…</p>
                  </div>
                )}

                {!loading && fastLaneMode === "scan" ? (
                  <QrScanner
                    key="scan"
                    onScan={handleFastLaneCheckIn}
                    onManual={() => setFastLaneMode("manual")}
                  />
                ) : !loading ? (
                  <FastLaneManualEntry
                    lookupId={lookupId}
                    onChange={setLookupId}
                    onSubmit={handleLookup}
                    loading={loading}
                    onScanMode={() => setFastLaneMode("scan")}
                  />
                ) : null}
              </div>
            </div>
          </div>
        ) : (
          <form onSubmit={handleRegister} className="venue-card venue-card-tablet mx-auto max-w-xl space-y-5 p-6 sm:p-8">
            <div className="text-center">
              {station === "vip" && <Crown className="mx-auto mb-2 h-8 w-8 text-orange" />}
              <h2 className="text-xl font-bold text-navy">
                {station === "vip" ? "VIP check-in" : "Register attendee"}
              </h2>
              <p className="mt-1 text-sm text-slate-500">Fill in the details below</p>
            </div>

            <div>
              <label className="venue-label">Full name</label>
              <input
                ref={nameRef}
                name="fullName"
                required
                value={form.fullName}
                onChange={handleChange}
                className="venue-input venue-input-hero"
                placeholder="Enter full name"
              />
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <label className="venue-label">Phone</label>
                <input
                  name="phone"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  pattern="[0-9+\s-]*"
                  value={form.phone}
                  onChange={handleChange}
                  onBlur={handlePhoneBlur}
                  aria-invalid={Boolean(phoneError)}
                  aria-describedby={phoneError ? "phone-error" : undefined}
                  className={`venue-input${phoneError ? " ring-2 ring-red-300" : ""}`}
                  placeholder="024 123 4567"
                />
                {phoneChecking && (
                  <p className="mt-1.5 text-xs text-slate-400">Checking phone number…</p>
                )}
                {phoneError && (
                  <p id="phone-error" className="mt-1.5 text-xs font-medium text-red-600">
                    {phoneError}
                  </p>
                )}
              </div>
              <div>
                <label className="venue-label">Organisation</label>
                <input
                  name="organisation"
                  value={form.organisation}
                  onChange={handleChange}
                  className="venue-input"
                  placeholder="Optional"
                />
              </div>
            </div>

            <div>
              <label className="venue-label">Category</label>
              <select name="category" value={form.category} onChange={handleChange} className="venue-input">
                {(station === "vip"
                  ? ["Speaker", "Sponsor", "Partner", "Hub Lead"]
                  : CATEGORIES
                ).map((c) => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </select>
            </div>

            {!showMore ? (
              <button
                type="button"
                onClick={() => setShowMore(true)}
                className="w-full text-sm font-medium text-brand-blue"
              >
                + More details
              </button>
            ) : (
              <div className="space-y-4 border-t border-blue-100 pt-4">
                <div>
                  <label className="venue-label">Hub</label>
                  <input
                    name="hub"
                    value={form.hub}
                    onChange={handleChange}
                    className="venue-input"
                    placeholder="Hub affiliation"
                  />
                </div>
                <div>
                  <label className="venue-label">Region</label>
                  <select name="region" value={form.region} onChange={handleChange} className="venue-input">
                    {REGIONS.map((r) => (
                      <option key={r} value={r}>
                        {r}
                      </option>
                    ))}
                  </select>
                </div>
                <label className="flex items-center gap-3 text-sm text-slate-500">
                  <input
                    type="checkbox"
                    name="futureLinkOptIn"
                    checked={form.futureLinkOptIn}
                    onChange={handleChange}
                    className="h-5 w-5 rounded border-blue-100 text-brand-blue"
                  />
                  Contact me about Future-Link services
                </label>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || phoneChecking || Boolean(phoneError)}
              className="venue-btn-primary w-full !mt-8"
            >
              {loading ? "Saving..." : "Register & check in"}
            </button>
          </form>
        )}
      </main>
    </div>
  );
}
