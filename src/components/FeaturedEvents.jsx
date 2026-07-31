import { useState, useEffect } from "react";
import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import EventCountdown from "./EventCountdown";
import {
  getAllEvents,
  isEventUpcoming,
  getSortedEvents,
  openAttendeeRegistration,
} from "../data/events";
import { useRegistrationModal } from "../context/RegistrationModalContext";

function EventMeta({ category, date, location }) {
  return (
    <p className="text-xs text-slate-400">
      <span className="font-medium text-brand-blue">{category}</span>
      {" · "}
      {date}
      {" · "}
      {location}
    </p>
  );
}

export default function FeaturedEvents() {
  const { openRegistration } = useRegistrationModal();
  const [allEvents, setAllEvents] = useState(() => getSortedEvents(getAllEvents()));

  useEffect(() => {
    const refresh = () => setAllEvents(getSortedEvents(getAllEvents()));
    const onStorage = (e) => {
      if (e.key === "ee-events") refresh();
    };
    window.addEventListener("storage", onStorage);
    window.addEventListener("ee-events-updated", refresh);
    return () => {
      window.removeEventListener("storage", onStorage);
      window.removeEventListener("ee-events-updated", refresh);
    };
  }, []);

  const featuredLarge = allEvents.slice(0, 2);
  const featuredSmall = allEvents.slice(2, 6);

  return (
    <section id="events-preview" className="border-t border-blue-100 bg-blue-50 py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex items-end justify-between">
          <ScrollReveal as="h2" className="text-2xl font-bold text-navy sm:text-3xl">
            Featured Events
          </ScrollReveal>
          <ScrollReveal delay={120}>
            <a
              href="#events"
              className="inline-flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-navy"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </a>
          </ScrollReveal>
        </div>

        {allEvents.length === 0 ? (
          <ScrollReveal delay={100} className="mt-10 rounded-2xl border border-dashed border-blue-100 bg-white px-6 py-12 text-center">
            <p className="text-base font-semibold text-navy">No events listed yet</p>
            <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">
              Organizers can publish their event and share a registration link — attendees will find
              it here.
            </p>
            <button
              type="button"
              onClick={() => openRegistration()}
              className="mt-6 inline-flex items-center gap-1.5 text-sm font-semibold text-navy hover:text-brand-blue"
            >
              Register an Event
              <ArrowRight className="h-4 w-4" />
            </button>
          </ScrollReveal>
        ) : (
          <>
            <div className="mt-10 space-y-6">
              {featuredLarge.map((event) => (
                <article
                  key={event.id}
                  className="group grid overflow-hidden rounded-xl border border-blue-100 bg-white sm:grid-cols-2"
                >
                  <div className="overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-56 w-full object-cover object-center transition-transform duration-300 group-hover:scale-[1.02] sm:h-full sm:min-h-[220px]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-56 w-full items-center justify-center bg-gradient-to-br from-navy/90 to-navy sm:h-full sm:min-h-[220px]">
                        <span className="text-4xl font-bold text-brand-blue/30">{event.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col justify-center p-6 sm:p-8">
                    <EventMeta
                      category={event.category}
                      date={event.date}
                      location={event.location}
                    />
                    <h3 className="mt-3 text-xl font-bold leading-snug text-navy sm:text-2xl">
                      {event.title}
                    </h3>
                    {event.excerpt && (
                      <p className="mt-3 text-sm leading-relaxed text-slate-500">{event.excerpt}</p>
                    )}
                    {isEventUpcoming(event) && event.startsAt && (
                      <EventCountdown
                        startsAt={event.startsAt}
                        label="Starts in"
                        variant="compact"
                        className="mt-4"
                      />
                    )}
                    {isEventUpcoming(event) && event.registrationUrl && (
                      <button
                        type="button"
                        onClick={() => openAttendeeRegistration(event)}
                        className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-navy hover:text-brand-blue"
                      >
                        Register
                        <ArrowRight className="h-4 w-4" />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>

            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {featuredSmall.map((event) => (
                <article
                  key={event.id}
                  className="group overflow-hidden rounded-xl border border-blue-100 bg-white"
                >
                  <div className="overflow-hidden">
                    {event.image ? (
                      <img
                        src={event.image}
                        alt={event.title}
                        className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                        loading="lazy"
                      />
                    ) : (
                      <div className="flex h-40 w-full items-center justify-center bg-navy">
                        <span className="text-3xl font-bold text-brand-blue/30">{event.title[0]}</span>
                      </div>
                    )}
                  </div>
                  <div className="p-4">
                    <EventMeta
                      category={event.category}
                      date={event.date}
                      location={event.location}
                    />
                    <h3 className="mt-2 text-sm font-bold leading-snug text-navy">{event.title}</h3>
                    {isEventUpcoming(event) && event.registrationUrl && (
                      <button
                        type="button"
                        onClick={() => openAttendeeRegistration(event)}
                        className="mt-3 inline-flex items-center gap-1 text-xs font-semibold text-navy hover:text-brand-blue"
                      >
                        Register
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
