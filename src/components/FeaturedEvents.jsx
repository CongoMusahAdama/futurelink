import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import EventCountdown from "./EventCountdown";
import { useRegistrationModal } from "../context/RegistrationModalContext";
import {
  featuredLargeEvents,
  featuredSmallEvents,
  ghanaHubsEvent,
} from "../data/events";

function EventMeta({ category, date, readTime }) {
  return (
    <p className="text-xs text-slate-400">
      <span className="font-medium text-brand-blue">{category}</span>
      {" · "}
      {date}
      {" · "}
      {readTime}
    </p>
  );
}

export default function FeaturedEvents() {
  const { openRegistration } = useRegistrationModal();

  return (
    <section id="events" className="border-t border-blue-100 bg-blue-50 py-16 sm:py-20">
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

        <div className="mt-10 space-y-6">
          {featuredLargeEvents.map((event) => (
            <article
              key={event.id}
              className="group grid overflow-hidden rounded-xl border border-blue-100 bg-white sm:grid-cols-2"
            >
              <div className="overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className={`h-56 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] sm:h-full sm:min-h-[220px] ${
                    event.image === ghanaHubsEvent.image ? "object-left" : ""
                  }`}
                  loading="lazy"
                />
              </div>
              <div className="flex flex-col justify-center p-6 sm:p-8">
                <EventMeta
                  category={event.category}
                  date={event.date}
                  readTime={event.location}
                />
                <h3 className="mt-3 text-xl font-bold leading-snug text-navy sm:text-2xl">
                  {event.title}
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-slate-500">{event.excerpt}</p>
                {event.upcoming && event.startsAt && (
                  <EventCountdown
                    startsAt={event.startsAt}
                    label="Starts in"
                    variant="compact"
                    className="mt-4"
                  />
                )}
                <button
                  type="button"
                  onClick={() => openRegistration(event)}
                  className="mt-5 inline-flex w-fit items-center gap-1.5 text-sm font-medium text-navy hover:text-brand-blue"
                >
                  Register
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </article>
          ))}
        </div>

        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {featuredSmallEvents.map((event) => (
            <article
              key={event.id}
              className="group overflow-hidden rounded-xl border border-blue-100 bg-white"
            >
              <div className="overflow-hidden">
                <img
                  src={event.image}
                  alt={event.title}
                  className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>
              <div className="p-4">
                <EventMeta
                  category={event.category}
                  date={event.date}
                  readTime={event.location}
                />
                <h3 className="mt-2 text-sm font-bold leading-snug text-navy">
                  {event.title}
                </h3>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
