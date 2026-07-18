import { ArrowRight } from "lucide-react";
import SectionHeading from "./SectionHeading";
import ScrollReveal from "./ScrollReveal";
import { CONTACT_EMAIL, CONTACT_PHONES } from "../lib/brand";

import { ghanaHubsEvent } from "../data/events";

export default function Contact() {
  return (
    <section id="contact" className="border-t border-blue-100 bg-blue-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="grid gap-12 lg:grid-cols-2">
          <div>
            <SectionHeading
              align="left"
              label="Get In Touch"
              title="Ready to transform your next event?"
              description={`Whether it is the ${ghanaHubsEvent.title} in Kumasi or your next conference, we will help you deliver a professional attendee experience with real-time intelligence.`}
            />

            <div className="mt-8 space-y-3 border-t border-slate-200 pt-8">
              <p className="text-sm text-slate-500">
                <span className="font-medium text-navy">Email:</span>{" "}
                <a href={`mailto:${CONTACT_EMAIL}`} className="hover:text-brand-blue">
                  {CONTACT_EMAIL}
                </a>
              </p>
              <div className="text-sm text-slate-500">
                <span className="font-medium text-navy">Phone:</span>
                <ul className="mt-1.5 space-y-1">
                  {CONTACT_PHONES.map((phone) => (
                    <li key={phone}>
                      <a href={`tel:+233${phone.replace(/^0/, "")}`} className="hover:text-brand-blue">
                        {phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3")}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
              <p className="text-sm text-slate-500">
                <span className="font-medium text-navy">Location:</span> Accra, Ghana
              </p>
            </div>
          </div>

          <ScrollReveal delay={150}>
            <form
              className="rounded-xl border border-blue-100 bg-white p-6 sm:p-8"
              onSubmit={(e) => e.preventDefault()}
            >
              <h3 className="text-sm font-bold text-navy">Request a Demo</h3>
              <p className="mt-1 text-xs text-slate-400">
                Tell us about your event. We respond within 24 hours.
              </p>

              <div className="mt-6 space-y-4">
                <div className="grid gap-4 sm:grid-cols-2">
                  <div>
                    <label htmlFor="name" className="block text-xs font-medium text-navy">
                      Full Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      className="mt-1 w-full rounded-lg border border-blue-100 px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
                    />
                  </div>
                  <div>
                    <label htmlFor="org" className="block text-xs font-medium text-navy">
                      Organisation
                    </label>
                    <input
                      id="org"
                      type="text"
                      className="mt-1 w-full rounded-lg border border-blue-100 px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
                    />
                  </div>
                </div>

                <div>
                  <label htmlFor="email" className="block text-xs font-medium text-navy">
                    Email
                  </label>
                  <input
                    id="email"
                    type="email"
                    className="mt-1 w-full rounded-lg border border-blue-100 px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
                  />
                </div>

                <div>
                  <label htmlFor="event" className="block text-xs font-medium text-navy">
                    Event Details
                  </label>
                  <textarea
                    id="event"
                    rows={4}
                    className="mt-1 w-full resize-none rounded-lg border border-blue-100 px-3 py-2.5 text-sm outline-none focus:border-brand-blue"
                  />
                </div>

                <button
                  type="submit"
                  className="inline-flex w-full items-center justify-center gap-2 rounded-lg bg-brand-blue py-3 text-sm font-medium text-navy transition-colors hover:bg-brand-blue-dark"
                >
                  Send Request
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </form>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
