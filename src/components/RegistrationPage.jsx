import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import Logo from "./Logo";
import { useRegistrationModal } from "../context/RegistrationModalContext";

const initialForm = {
  firstName: "",
  lastName: "",
  email: "",
  company: "",
  agreeTerms: false,
};

function Field({ id, label, type = "text", value, onChange, required = true }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-navy">
        {label}
        {required && <span className="text-brand-blue">*</span>}
      </label>
      <input
        id={id}
        name={id}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        className="mt-1.5 w-full rounded-lg border border-blue-100 bg-white px-3 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20"
      />
    </div>
  );
}

export default function RegistrationPage({ event }) {
  const { closeRegistration } = useRegistrationModal();
  const [form, setForm] = useState(initialForm);
  const [submitted, setSubmitted] = useState(false);

  const year = event.date.match(/\d{4}/)?.[0] ?? "2026";
  const eventLabel = event.title
    .replace(new RegExp(`\\s*${event.category}\\s*`, "i"), " ")
    .replace(/\d{4}/, "")
    .trim()
    .toUpperCase();
  const headline = event.category.toUpperCase();

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen bg-blue-50">
      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between px-5 py-4">
          <button
            type="button"
            onClick={closeRegistration}
            className="rounded-lg transition-opacity hover:opacity-80"
            aria-label="Future-Link Services home"
          >
            <Logo size="xl" />
          </button>
          <button
            type="button"
            onClick={closeRegistration}
            className="inline-flex items-center gap-2 rounded-full bg-blue-50 px-4 py-2 text-sm font-medium text-navy transition-colors hover:bg-blue-100"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-5 sm:py-10">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-blue-100">
          <div className="relative h-48 overflow-hidden sm:h-60">
            <img
              src={event.image}
              alt=""
              className={`absolute inset-0 h-full w-full ${
                event.heroImageClass ?? "object-cover object-center"
              }`}
            />
            <div className="absolute inset-0 bg-navy/78" />

            <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center text-white">
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-blue-100">
                {eventLabel}
              </p>
              <h1 className="mt-2 text-3xl font-bold uppercase tracking-wide sm:text-5xl">
                {headline}
              </h1>
              <div className="mt-3 flex items-center gap-3">
                <span className="h-px w-10 bg-white/40 sm:w-14" />
                <span className="text-sm font-medium">{year}</span>
                <span className="h-px w-10 bg-white/40 sm:w-14" />
              </div>
            </div>
          </div>

          <div className="px-6 py-8 sm:px-10 sm:py-10">
            {submitted ? (
              <div className="py-8 text-center">
                <p className="text-xl font-bold text-navy">Registration received</p>
                <p className="mx-auto mt-3 max-w-md text-sm text-slate-500">
                  Thank you, {form.firstName}. We&apos;ll send your confirmation for{" "}
                  {event.title} shortly.
                </p>
                <button
                  type="button"
                  onClick={closeRegistration}
                  className="mt-8 rounded-lg bg-brand-blue px-8 py-3 text-sm font-semibold text-navy transition-colors hover:bg-brand-blue-dark"
                >
                  Back to home
                </button>
              </div>
            ) : (
              <>
                <h2 className="text-center text-xl font-bold text-brand-blue sm:text-2xl">
                  Register for {event.title}
                </h2>
                <p className="mx-auto mt-3 max-w-xl text-center text-sm italic text-slate-500">
                  Secure your spot at {event.location} on {event.date}. Complete the form
                  below to register.
                </p>
                <p className="mt-1 text-center text-xs text-slate-400">
                  We&apos;ll only use your details for this event — no spam.
                </p>

                <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-3xl space-y-5">
                  <div className="grid gap-4 sm:grid-cols-2">
                    <Field
                      id="firstName"
                      label="First Name"
                      value={form.firstName}
                      onChange={handleChange}
                    />
                    <Field
                      id="lastName"
                      label="Last Name"
                      value={form.lastName}
                      onChange={handleChange}
                    />
                    <Field
                      id="email"
                      label="Email Address"
                      type="email"
                      value={form.email}
                      onChange={handleChange}
                    />
                    <Field
                      id="company"
                      label="Company / Organisation"
                      value={form.company}
                      onChange={handleChange}
                    />
                  </div>

                  <label className="flex items-start gap-3 text-xs leading-relaxed text-slate-500">
                    <input
                      type="checkbox"
                      name="agreeTerms"
                      checked={form.agreeTerms}
                      onChange={handleChange}
                      required
                      className="mt-0.5 h-4 w-4 rounded border-blue-100 text-brand-blue focus:ring-brand-blue/30"
                    />
                    <span>
                      By checking this box, you agree to our{" "}
                      <a href="/#contact" className="font-medium text-brand-blue hover:underline">
                        Terms
                      </a>{" "}
                      and{" "}
                      <a href="/#contact" className="font-medium text-brand-blue hover:underline">
                        Privacy Policy
                      </a>
                      .
                    </span>
                  </label>

                  <button
                    type="submit"
                    className="w-full rounded-lg bg-orange py-3.5 text-sm font-bold text-navy transition-colors hover:bg-orange-dark"
                  >
                    Complete Registration
                  </button>
                </form>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
