import { useRef, useState } from "react";
import { ArrowLeft, CalendarPlus, Check, ImageIcon, X } from "lucide-react";
import Logo from "./Logo";
import CategorySelect from "./CategorySelect";
import { saveEvent } from "../lib/eventStore";
import { useRegistrationModal } from "../context/RegistrationModalContext";

const blankForm = {
  title: "",
  category: "Conference",
  date: "",
  startsAt: "",
  location: "",
  excerpt: "",
  registrationUrl: "",
  organizerName: "",
  organizerEmail: "",
  image: null,
  imagePreview: null,
};

function Field({ id, label, required = true, hint, children }) {
  return (
    <div>
      <label htmlFor={id} className="text-xs font-medium text-navy">
        {label}
        {required && <span className="text-brand-blue">*</span>}
        {hint && <span className="ml-1 font-normal text-slate-400">{hint}</span>}
      </label>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}

const inputClass =
  "w-full rounded-lg border border-blue-100 bg-white px-3 py-2.5 text-sm text-navy outline-none transition-colors placeholder:text-slate-400 focus:border-brand-blue focus:ring-2 focus:ring-brand-blue/20";

export default function OrganizerEventPage() {
  const { closeRegistration } = useRegistrationModal();
  const [form, setForm] = useState(blankForm);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [savedEvent, setSavedEvent] = useState(null);
  const fileRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (file) => {
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be under 5 MB.");
      return;
    }
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm((prev) => ({
        ...prev,
        image: ev.target.result,
        imagePreview: ev.target.result,
      }));
    };
    reader.readAsDataURL(file);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    if (!form.title.trim()) {
      setError("Event title is required.");
      return;
    }
    if (!form.category.trim()) {
      setError("Please choose or enter a category.");
      return;
    }
    if (!form.date.trim()) {
      setError("Display date is required.");
      return;
    }
    if (!form.location.trim()) {
      setError("Location is required.");
      return;
    }
    if (!form.registrationUrl.trim()) {
      setError("Your attendee registration link is required.");
      return;
    }

    setSaving(true);
    try {
      const entry = saveEvent({
        title: form.title.trim(),
        category: form.category,
        date: form.date.trim(),
        startsAt: form.startsAt || null,
        location: form.location.trim(),
        excerpt: form.excerpt.trim(),
        registrationUrl: form.registrationUrl.trim(),
        organizerName: form.organizerName.trim(),
        organizerEmail: form.organizerEmail.trim(),
        image: form.image,
        status: "pending",
      });
      setSavedEvent(entry);
      setForm(blankForm);
      // Don't dispatch public refresh until approved
    } catch {
      setError("Could not submit your event. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-blue-50">
      {savedEvent && (
        <div className="event-sweet-overlay" role="dialog" aria-modal="true" aria-labelledby="event-pending-title">
          <div className="event-sweet-card">
            <div className="event-sweet-icon">
              <Check className="h-8 w-8" strokeWidth={2.5} />
            </div>
            <h2 id="event-pending-title" className="event-sweet-title">
              Thank you!
            </h2>
            <p className="event-sweet-text">
              <strong>{savedEvent.title}</strong> has been submitted successfully.
            </p>
            <p className="event-sweet-text event-sweet-text--muted">
              Your event is <span className="font-semibold text-navy">pending review</span>. A
              Future-Link admin will approve it before it appears on the Events page.
            </p>
            <button
              type="button"
              className="event-sweet-btn"
              onClick={closeRegistration}
            >
              Got it
            </button>
          </div>
        </div>
      )}

      <header className="border-b border-blue-100 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-4">
          <button
            type="button"
            onClick={closeRegistration}
            className="rounded-lg transition-opacity hover:opacity-80"
            aria-label="Future-Link Services home"
          >
            <Logo size="xl" markOnly />
          </button>
          <button
            type="button"
            onClick={closeRegistration}
            className="inline-flex shrink-0 items-center gap-2 rounded-full bg-blue-50 px-3 py-2 text-sm font-medium text-navy transition-colors hover:bg-blue-100 sm:px-4"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to home
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-5 sm:py-10">
        <div className="overflow-hidden rounded-2xl bg-white shadow-lg ring-1 ring-blue-100">
          <div className="bg-navy px-6 py-10 text-center sm:py-12">
            <p className="text-sm font-semibold text-brand-blue">For event organizers</p>
            <h1 className="mt-3 text-2xl font-bold text-white sm:text-3xl md:text-4xl">
              List your event on Future-Link
            </h1>
            <p className="mx-auto mt-3 max-w-xl text-sm text-white/70 sm:text-base">
              Publish your conference, AGM, or networking event. Share your registration link —
              attendees will find you on our Events page and register through your link.
            </p>
          </div>

          <div className="px-5 py-8 sm:px-10 sm:py-10">
            <>
                <div className="mx-auto max-w-2xl text-center">
                  <h2 className="text-xl font-bold text-brand-blue sm:text-2xl">
                    Register your event
                  </h2>
                  <p className="mt-2 text-sm italic text-slate-500">
                    Submit your event for listing. After admin approval, attendees will find it on
                    our Events page and register through your link.
                  </p>
                </div>

                {error && (
                  <p className="mx-auto mt-6 max-w-2xl rounded-xl bg-red-50 px-4 py-3 text-sm text-red-700 ring-1 ring-red-200">
                    {error}
                  </p>
                )}

                <form onSubmit={handleSubmit} className="mx-auto mt-8 max-w-2xl space-y-5">
                  <div
                    className={`relative flex min-h-[9rem] cursor-pointer flex-col items-center justify-center overflow-hidden rounded-xl border border-dashed border-blue-100 bg-blue-50/50 p-4 ${form.imagePreview ? "border-solid" : ""}`}
                    onClick={() => fileRef.current?.click()}
                    onDrop={(e) => {
                      e.preventDefault();
                      const file = e.dataTransfer.files?.[0];
                      if (file?.type.startsWith("image/")) handleImageChange(file);
                    }}
                    onDragOver={(e) => e.preventDefault()}
                    role="button"
                    tabIndex={0}
                    onKeyDown={(e) => e.key === "Enter" && fileRef.current?.click()}
                  >
                    {form.imagePreview ? (
                      <>
                        <img
                          src={form.imagePreview}
                          alt="Event preview"
                          className="max-h-40 w-full rounded-lg object-cover"
                        />
                        <button
                          type="button"
                          className="absolute right-3 top-3 rounded-full bg-white p-1.5 text-navy shadow"
                          onClick={(e) => {
                            e.stopPropagation();
                            setForm((prev) => ({ ...prev, image: null, imagePreview: null }));
                          }}
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <>
                        <ImageIcon className="h-8 w-8 text-slate-300" />
                        <p className="mt-2 text-sm text-slate-500">
                          <span className="font-semibold text-brand-blue">Upload event image</span>{" "}
                          (optional)
                        </p>
                      </>
                    )}
                    <input
                      ref={fileRef}
                      type="file"
                      accept="image/*"
                      className="sr-only"
                      onChange={(e) => handleImageChange(e.target.files?.[0])}
                    />
                  </div>

                  <div className="grid gap-5 sm:grid-cols-2">
                    <Field id="org-title" label="Event Title">
                      <input
                        id="org-title"
                        name="title"
                        required
                        value={form.title}
                        onChange={handleChange}
                        placeholder="e.g. National Tech Summit 2026"
                        className={inputClass}
                      />
                    </Field>
                    <Field id="org-category" label="Category">
                      <CategorySelect
                        id="org-category"
                        name="category"
                        value={form.category}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </Field>
                    <Field id="org-date" label="Display Date">
                      <input
                        id="org-date"
                        name="date"
                        required
                        value={form.date}
                        onChange={handleChange}
                        placeholder="e.g. Sat, 15 Aug 2026"
                        className={inputClass}
                      />
                    </Field>
                    <Field id="org-startsAt" label="Start Date & Time" required={false} hint="(optional)">
                      <input
                        id="org-startsAt"
                        name="startsAt"
                        type="datetime-local"
                        value={form.startsAt}
                        onChange={handleChange}
                        className={inputClass}
                      />
                    </Field>
                    <Field id="org-location" label="Location">
                      <input
                        id="org-location"
                        name="location"
                        required
                        value={form.location}
                        onChange={handleChange}
                        placeholder="e.g. Accra, Ghana"
                        className={inputClass}
                      />
                    </Field>
                    <Field id="org-name" label="Organizer Name" required={false} hint="(optional)">
                      <input
                        id="org-name"
                        name="organizerName"
                        value={form.organizerName}
                        onChange={handleChange}
                        placeholder="Your name or organisation"
                        className={inputClass}
                      />
                    </Field>
                  </div>

                  <Field
                    id="org-reg-url"
                    label="Attendee Registration Link"
                    hint="— where people sign up for your event"
                  >
                    <input
                      id="org-reg-url"
                      name="registrationUrl"
                      type="url"
                      required
                      value={form.registrationUrl}
                      onChange={handleChange}
                      placeholder="https://…"
                      className={inputClass}
                    />
                  </Field>

                  <Field id="org-email" label="Contact Email" required={false} hint="(optional)">
                    <input
                      id="org-email"
                      name="organizerEmail"
                      type="email"
                      value={form.organizerEmail}
                      onChange={handleChange}
                      placeholder="you@organisation.com"
                      className={inputClass}
                    />
                  </Field>

                  <Field id="org-excerpt" label="Short Description" required={false} hint="(optional)">
                    <textarea
                      id="org-excerpt"
                      name="excerpt"
                      rows={3}
                      value={form.excerpt}
                      onChange={handleChange}
                      placeholder="What attendees should know about your event…"
                      className={`${inputClass} resize-y`}
                    />
                  </Field>

                  <button
                    type="submit"
                    disabled={saving}
                    className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-navy px-6 py-3.5 text-sm font-bold text-white transition hover:bg-navy/90 disabled:opacity-70 sm:w-auto"
                  >
                    <CalendarPlus className="h-4 w-4" />
                    {saving ? "Submitting…" : "Submit for approval"}
                  </button>
                </form>
              </>
          </div>
        </div>
      </main>
    </div>
  );
}
