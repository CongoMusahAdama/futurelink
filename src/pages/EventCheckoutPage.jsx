import { useEffect, useState, useRef } from "react";
import { ArrowLeft, ArrowRight, Calendar, MapPin, CheckCircle2, Sparkles } from "lucide-react";
import Logo from "../components/Logo";
import EventCountdown from "../components/EventCountdown";
import { saveRegistration } from "../lib/registrations";

// ─── Helpers ───────────────────────────────────────────────────────────────

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  phone: "",
  agreeTerms: false,
};

function Field({ id, label, type = "text", value, onChange, required = true, placeholder = "" }) {
  return (
    <div className="checkout-field">
      <label htmlFor={id} className="checkout-field-label">
        {label}
        {required && <span className="checkout-field-required">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="checkout-field-input"
        autoComplete={type === "email" ? "email" : type === "tel" ? "tel" : "off"}
      />
    </div>
  );
}

// ─── Splash Screen ─────────────────────────────────────────────────────────

function SplashScreen({ event, onContinue }) {
  const [ready, setReady] = useState(false);
  const timerRef = useRef(null);

  // fade in after mount
  useEffect(() => {
    const t = setTimeout(() => setReady(true), 80);
    // Auto-advance after 4s
    timerRef.current = setTimeout(onContinue, 4200);
    return () => {
      clearTimeout(t);
      clearTimeout(timerRef.current);
    };
  }, [onContinue]);

  return (
    <div className={`checkout-splash ${ready ? "checkout-splash--visible" : ""}`}>
      {/* Background image */}
      {event.image && (
        <img
          src={event.image}
          alt=""
          aria-hidden
          className="checkout-splash-bg"
        />
      )}
      <div className="checkout-splash-overlay" />

      {/* Content */}
      <div className="checkout-splash-body">
        {/* Logo / Brand */}
        <div className="checkout-splash-brand">
          <Logo markOnly size="lg" />
        </div>

        {/* Event logo or title */}
        <div className="checkout-splash-event">
          {event.logo ? (
            <img
              src={event.logo}
              alt={event.title}
              className="checkout-splash-event-logo"
            />
          ) : (
            <h1 className="checkout-splash-event-title">{event.title}</h1>
          )}
          {event.logo && (
            <p className="checkout-splash-event-subtitle">{event.title}</p>
          )}
        </div>

        {/* Meta row */}
        <div className="checkout-splash-meta">
          <span className="checkout-splash-meta-item">
            <Calendar className="h-4 w-4" />
            {event.date}
          </span>
          <span className="checkout-splash-meta-dot" aria-hidden>·</span>
          <span className="checkout-splash-meta-item">
            <MapPin className="h-4 w-4" />
            {event.location}
          </span>
        </div>

        {/* Countdown */}
        {event.upcoming && event.startsAt && (
          <div className="checkout-splash-countdown">
            <EventCountdown startsAt={event.startsAt} label="Event starts in" variant="hero" />
          </div>
        )}

        {/* CTA */}
        <button
          type="button"
          onClick={() => {
            clearTimeout(timerRef.current);
            onContinue();
          }}
          className="checkout-splash-cta"
        >
          <Sparkles className="h-4 w-4" aria-hidden />
          Register Now
          <ArrowRight className="h-4 w-4" aria-hidden />
        </button>

        <p className="checkout-splash-hint">Auto-advancing in a moment…</p>
      </div>
    </div>
  );
}

// ─── Success Screen ─────────────────────────────────────────────────────────

function SuccessScreen({ event, firstName }) {
  return (
    <div className="checkout-success">
      <div className="checkout-success-icon">
        <CheckCircle2 className="h-14 w-14 text-emerald-400" strokeWidth={1.5} />
      </div>
      <h2 className="checkout-success-title">You're registered! 🎉</h2>
      <p className="checkout-success-text">
        Thank you, <strong>{firstName}</strong>. Your registration for{" "}
        <strong>{event.title}</strong> has been received and is pending
        admin approval. We'll be in touch shortly.
      </p>
      <div className="checkout-success-event">
        <span className="checkout-success-event-name">{event.title}</span>
        <span className="checkout-success-event-meta">
          {event.date} · {event.location}
        </span>
      </div>
      <a href="/" className="checkout-success-home">
        <ArrowLeft className="h-4 w-4" aria-hidden />
        Back to home
      </a>
    </div>
  );
}

// ─── Main Page ──────────────────────────────────────────────────────────────

export default function EventCheckoutPage({ event }) {
  const [phase, setPhase] = useState("splash"); // "splash" | "form" | "success"
  const [form, setForm] = useState(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitting(true);
    setError("");
    try {
      saveRegistration({
        eventId: event.id,
        eventTitle: event.title,
        firstName: form.firstName,
        lastName: form.lastName,
        email: form.email,
        company: form.company,
        phone: form.phone,
      });
      setPhase("success");
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Splash ──
  if (phase === "splash") {
    return <SplashScreen event={event} onContinue={() => setPhase("form")} />;
  }

  // ── Success ──
  if (phase === "success") {
    return (
      <div className="checkout-page">
        <header className="checkout-header">
          <div className="checkout-header-inner">
            <a href="/" aria-label="Future-Link home">
              <Logo size="xl" markOnly />
            </a>
          </div>
        </header>
        <main className="checkout-main">
          <SuccessScreen event={event} firstName={form.firstName} />
        </main>
      </div>
    );
  }

  // ── Form ──
  return (
    <div className="checkout-page">
      <header className="checkout-header">
        <div className="checkout-header-inner">
          <a href="/" aria-label="Future-Link home">
            <Logo size="xl" markOnly />
          </a>
          <button
            type="button"
            onClick={() => setPhase("splash")}
            className="checkout-back-btn"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            Back
          </button>
        </div>
      </header>

      <main className="checkout-main">
        <div className="checkout-card">
          {/* Event hero banner */}
          <div className="checkout-card-hero">
            {event.image && (
              <img
                src={event.image}
                alt=""
                aria-hidden
                className="checkout-card-hero-bg"
              />
            )}
            <div className="checkout-card-hero-overlay" />
            <div className="checkout-card-hero-content">
              {event.logo ? (
                <img
                  src={event.logo}
                  alt={event.title}
                  className="checkout-card-hero-logo"
                />
              ) : (
                <h1 className="checkout-card-hero-title">{event.title}</h1>
              )}
              {event.logo && (
                <p className="checkout-card-hero-name">{event.title}</p>
              )}
              <div className="checkout-card-hero-meta">
                <span className="checkout-card-hero-meta-item">
                  <Calendar className="h-3.5 w-3.5" />
                  {event.date}
                </span>
                <span aria-hidden>·</span>
                <span className="checkout-card-hero-meta-item">
                  <MapPin className="h-3.5 w-3.5" />
                  {event.location}
                </span>
              </div>

              {event.upcoming && event.startsAt && (
                <EventCountdown startsAt={event.startsAt} label="Starts in" variant="hero" />
              )}
            </div>
          </div>

          {/* Form body */}
          <div className="checkout-card-body">
            <h2 className="checkout-form-title">Complete Your Registration</h2>
            <p className="checkout-form-subtitle">
              Secure your spot at <strong>{event.location}</strong> on{" "}
              <strong>{event.date}</strong>. Fill in your details below.
            </p>

            {error && <p className="checkout-form-error">{error}</p>}

            <form onSubmit={handleSubmit} className="checkout-form">
              <div className="checkout-form-grid">
                <Field
                  id="firstName"
                  label="First Name"
                  value={form.firstName}
                  onChange={handleChange}
                  placeholder="John"
                />
                <Field
                  id="lastName"
                  label="Last Name"
                  value={form.lastName}
                  onChange={handleChange}
                  placeholder="Doe"
                />
                <Field
                  id="email"
                  label="Email Address"
                  type="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="john@example.com"
                />
                <Field
                  id="phone"
                  label="Phone Number"
                  type="tel"
                  value={form.phone}
                  onChange={handleChange}
                  placeholder="+233 xx xxx xxxx"
                  required={false}
                />
                <div className="checkout-field-full">
                  <Field
                    id="company"
                    label="Company / Organisation"
                    value={form.company}
                    onChange={handleChange}
                    placeholder="Your organisation"
                    required={false}
                  />
                </div>
              </div>

              <label className="checkout-terms">
                <input
                  type="checkbox"
                  name="agreeTerms"
                  checked={form.agreeTerms}
                  onChange={handleChange}
                  required
                  className="checkout-terms-check"
                />
                <span>
                  I agree to the{" "}
                  <a href="/#contact" className="checkout-terms-link">
                    Terms &amp; Privacy Policy
                  </a>
                  . My details will only be used for this event.
                </span>
              </label>

              <button
                type="submit"
                className="checkout-submit-btn"
                disabled={submitting}
              >
                {submitting ? (
                  "Submitting…"
                ) : (
                  <>
                    <Sparkles className="h-4 w-4" aria-hidden />
                    Complete Registration
                  </>
                )}
              </button>
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}
