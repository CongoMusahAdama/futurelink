import { useMemo, useState } from "react";
import { ArrowRight, ArrowUpRight, Calendar, MapPin, Search, X } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import EventCountdown from "../components/EventCountdown";
import { useRegistrationModal } from "../context/RegistrationModalContext";
import {
  eventCategories,
  events,
  getEventStatus,
  getSortedEvents,
  getUpcomingEvents,
  isEventUpcoming,
} from "../data/events";
import { CONTACT_EMAIL } from "../lib/brand";

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
  const { openRegistration } = useRegistrationModal();
  const upcoming = isEventUpcoming(event);
  const status = getEventStatus(event);

  return (
    <article
      id={event.id}
      className={`event-card group ${featured ? "event-card--featured" : ""}`}
    >
      <div className="event-card-media">
        <img
          src={event.image}
          alt={event.title}
          className={`h-full w-full ${event.imageClass ?? "object-cover object-center"}`}
          loading="lazy"
        />
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

        <p className="event-card-excerpt">{event.excerpt}</p>

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
          {upcoming ? (
            <button
              type="button"
              onClick={() => openRegistration(event)}
              className="event-card-register"
            >
              Register
              <ArrowRight className="h-4 w-4" />
            </button>
          ) : (
            <span className="event-card-past-label">Event completed</span>
          )}
        </div>
      </div>
    </article>
  );
}

export default function EventsPage() {
  const [activeCategory, setActiveCategory] = useState("All");
  const [query, setQuery] = useState("");

  const upcomingCount = getUpcomingEvents().length;
  const totalCount = events.length;

  const filteredEvents = useMemo(() => {
    let list = getSortedEvents();

    if (activeCategory !== "All") {
      list = list.filter((event) => event.category === activeCategory);
    }

    const normalizedQuery = query.trim().toLowerCase();
    if (normalizedQuery) {
      list = list.filter((event) => matchesSearch(event, normalizedQuery));
    }

    return list;
  }, [activeCategory, query]);

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
              Search and browse every event Future-Link supports — dates, locations, and the
              services we deliver at each one.
            </ScrollReveal>
            <ScrollReveal delay={220} className="mt-6 flex flex-wrap items-center justify-center gap-2 text-sm text-slate-500">
              <span className="events-stat-pill">{upcomingCount} upcoming</span>
              <span aria-hidden="true">·</span>
              <span className="events-stat-pill">{totalCount} total</span>
            </ScrollReveal>
            <ScrollReveal delay={280} className="mt-8">
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
                {eventCategories.map((category) => (
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
                <p className="events-empty-title">No events match your search</p>
                <p className="events-empty-text">
                  Try a different keyword or category, or clear your filters to see everything.
                </p>
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
              Future-Link handles registration, QR check-in, live dashboards, and post-event
              analytics for conferences and AGMs across Ghana.
            </ScrollReveal>
            <ScrollReveal delay={180} className="mt-8">
              <a href={`mailto:${CONTACT_EMAIL}`} className="hero-cta hero-cta-primary inline-flex">
                <span>Get in Touch</span>
                <span className="hero-cta-icon" aria-hidden="true">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </ScrollReveal>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
}
