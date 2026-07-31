import { useMemo, useState, useEffect } from "react";
import { ArrowRight, ArrowUpRight, Calendar, MapPin, Search, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import EventCountdown from "../components/EventCountdown";
import {
  getAllEvents,
  getEventCategoryFilters,
  getEventStatus,
  getSortedEvents,
  getUpcomingEvents,
  isEventUpcoming,
  openAttendeeRegistration,
} from "../data/events";
import { useRegistrationModal } from "../context/RegistrationModalContext";

function matchesSearch(event, query) {
  const haystack = [
    event.title,
    event.location,
    event.category,
    event.date,
    event.excerpt,
    ...(event.criteria ?? []),
  ]
    .join(" ")
    .toLowerCase();

  return haystack.includes(query);
}

function EventCriteria({ items }) {
  return (
    <ul className="event-criteria">
      {items.map((item) => (
        <li key={item} className="event-criteria-tag">
          {item}
        </li>
      ))}
    </ul>
  );
}

function EventCard({ event, featured = false }) {
  const upcoming = isEventUpcoming(event);
  const status = getEventStatus(event);
  const hasRegLink = Boolean(event.registrationUrl?.trim());

  return (
    <article
      id={event.id}
      className={`event-card group ${featured ? "event-card--featured" : ""}`}
    >
      <div className="event-card-media">
        {event.image ? (
          <img
            src={event.image}
            alt={event.title}
            className={`h-full w-full ${event.imageClass ?? "object-cover object-center"}`}
            loading="lazy"
          />
        ) : (
          <div className="flex h-full min-h-[11rem] w-full items-center justify-center bg-navy">
            <span className="text-4xl font-bold text-brand-blue/30">{event.title?.[0] ?? "E"}</span>
          </div>
        )}
        <span className={`event-card-status event-card-status--${status}`}>
          {upcoming ? "Upcoming" : "Completed"}
        </span>
      </div>

      <div className="event-card-body">
        <div className="event-card-meta">
          <span className="event-card-category">{event.category}</span>
          <span className="event-card-meta-sep" aria-hidden="true">
            ·
          </span>
          <span className="event-card-date">
            <Calendar className="h-3.5 w-3.5" aria-hidden="true" />
            {event.date}
          </span>
        </div>

        <h3 className="event-card-title">{event.title}</h3>

        <p className="event-card-location">
          <MapPin className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
          {event.location}
        </p>

        {event.excerpt && <p className="event-card-excerpt">{event.excerpt}</p>}

        {event.criteria?.length > 0 && <EventCriteria items={event.criteria} />}

        {featured && upcoming && event.startsAt && (
          <EventCountdown
            startsAt={event.startsAt}
            label="Starts in"
            variant="compact"
            className="event-card-countdown mt-4"
          />
        )}

        <div className="event-card-actions">
          {upcoming && hasRegLink ? (
            <button
              type="button"
              onClick={() => openAttendeeRegistration(event)}
              className="event-card-register"
            >
              Register
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : upcoming ? (
            <span className="event-card-past-label">Registration link coming soon</span>
          ) : (
            <span className="event-card-past-label">Event completed</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const { openRegistration } = useRegistrationModal();
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");
  const [allEvents, setAllEvents] = useState(() => getAllEvents());

  useEffect(() => {
    const refresh = () => setAllEvents(getAllEvents());
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

  const upcomingCount = allEvents.filter(isEventUpcoming).length;
  const totalCount = allEvents.length;

  const filteredEvents = useMemo(() => {
    let list = getSortedEvents(allEvents);

    if (activeCategory !== "All") {
      list = list.filter((event) => event.category === activeCategory);
    }

    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      list = list.filter((event) => matchesSearch(event, normalizedQuery));
    }

    return list;
  }, [activeCategory, query, allEvents]);

  const showFeaturedHighlight = !query.trim() && activeCategory === "All";
  const featuredEvent = showFeaturedHighlight ? getUpcomingEvents()[0] : null;
  const gridEvents = featuredEvent
    ? filteredEvents.filter((event) => event.id !== featuredEvent.id)
    : filteredEvents;

  const hasActiveFilters = activeCategory !== "All" || query.trim().length > 0;

  return (
    <>
      <Header />
      <main className="events-page">
        <section className="events-page-hero pt-32 pb-12 sm:pt-40 sm:pb-14">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <ScrollReveal as="p" variant="subtle" className="text-sm font-semibold uppercase tracking-wide text-slate-500">
              Events
            </ScrollReveal>
            <ScrollReveal as="h1" variant="heading" delay={80} className="services-heading mt-3">
              Conferences, AGMs &{" "}
              <span className="hero-headline-highlight">Experiences.</span>
            </ScrollReveal>
            <ScrollReveal
              as="p"
              variant="subtle"
              delay={160}
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              Search and browse events listed by organizers — open each event&apos;s registration
              link to sign up as an attendee.
            </ScrollReveal>
            <ScrollReveal delay={220} className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
              <span className="events-stat-pill">{upcomingCount} upcoming</span>
              <span aria-hidden="true">·</span>
              <span className="events-stat-pill">{totalCount} total</span>
            </ScrollReveal>
            <ScrollReveal delay={280} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <button type="button" onClick={() => openRegistration()} className="hero-cta hero-cta-primary inline-flex">
                <span>Register an Event</span>
                <span className="hero-cta-icon" aria-hidden="true">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
              <a href="#" className="hero-cta hero-cta-secondary inline-flex">
                <span>Back to Home</span>
                <span className="hero-cta-icon" aria-hidden="true">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </ScrollReveal>
          </div>
        </section>

        <section id="all-events" className="events-main border-t border-slate-100 py-12 sm:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <ScrollReveal delay={60} className="events-toolbar">
              <label htmlFor="events-search" className="sr-only">
                Search events
              </label>
              <div className="events-search">
                <Search className="events-search-icon" aria-hidden="true" />
                <input
                  id="events-search"
                  type="search"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search by name, location, category, or service…"
                  className="events-search-input"
                  autoComplete="off"
                />
                {query && (
                  <button
                    type="button"
                    onClick={() => setQuery("")}
                    className="events-search-clear"
                    aria-label="Clear search"
                  >
                    <X className="h-4 w-4" />
                  </button>
                )}
              </div>

              <div className="events-filter" role="group" aria-label="Filter by category">
                {getEventCategoryFilters(allEvents).map((category) => (
                  <button
                    key={category}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                    className={`events-filter-btn ${activeCategory === category ? "events-filter-btn--active" : ""}`}
                  >
                    {category}
                  </button>
                ))}
              </div>

              <div className="events-toolbar-meta">
                <p className="events-results-count">
                  {filteredEvents.length} {filteredEvents.length === 1 ? "event" : "events"}
                  {hasActiveFilters ? " found" : ""}
                </p>
                {hasActiveFilters && (
                  <button
                    type="button"
                    className="events-clear-filters"
                    onClick={() => {
                      setQuery("");
                      setActiveCategory("All");
                    }}
                  >
                    Clear filters
                  </button>
                )}
              </div>
            </ScrollReveal>

            {featuredEvent && (
              <ScrollReveal delay={100} className="mt-10">
                <p className="events-section-label">Next up</p>
                <EventCard event={featuredEvent} featured />
              </ScrollReveal>
            )}

            {gridEvents.length > 0 && (
              <div className={`events-grid ${featuredEvent ? "mt-10" : "mt-10"}`}>
                {gridEvents.map((event, index) => (
                  <ScrollReveal key={event.id} delay={80 + index * 40} className="h-full">
                    <EventCard event={event} />
                  </ScrollReveal>
                ))}
              </div>
            )}

            {filteredEvents.length === 0 && (
              <div className="events-empty mt-10">
                <p className="events-empty-title">
                  {allEvents.length === 0 ? "No events listed yet" : "No events match your search"}
                </p>
                <p className="events-empty-text">
                  {allEvents.length === 0
                    ? "Organizers can publish an event and add their attendee registration link — it will show up here."
                    : "Try a different keyword or category, or clear your filters to see everything."}
                </p>
                {allEvents.length === 0 ? (
                  <button
                    type="button"
                    className="events-clear-filters events-clear-filters--button"
                    onClick={() => openRegistration()}
                  >
                    Register an Event
                  </button>
                ) : (
                  <button
                    type="button"
                    className="events-clear-filters events-clear-filters--button"
                    onClick={() => {
                      setQuery("");
                      setActiveCategory("All");
                    }}
                  >
                    Show all events
                  </button>
                )}
              </div>
            )}
          </div>
        </section>

        <section className="border-t border-slate-100 bg-slate-50 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <ScrollReveal as="h2" variant="heading" className="text-2xl font-bold text-navy sm:text-3xl">
              Planning your own event?
            </ScrollReveal>
            <ScrollReveal as="p" variant="subtle" delay={100} className="mx-auto mt-4 max-w-xl text-base text-slate-600">
              List your event on Future-Link and share your registration link. Attendees discover
              you on our Events page and sign up through your form.
            </ScrollReveal>
            <ScrollReveal delay={180} className="mt-8">
              <button type="button" onClick={() => openRegistration()} className="hero-cta hero-cta-primary inline-flex">
                <span>Register an Event</span>
                <span className="hero-cta-icon" aria-hidden="true">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </button>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
