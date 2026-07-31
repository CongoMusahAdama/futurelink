import { getPublishedEvents } from "../lib/eventStore";

/** Fixed category filters for the events directory (no placeholder listings). */
export const eventCategories = [
  "All",
  "Conference",
  "AGM",
  "Summit",
  "Networking",
  "Workshop",
  "Other",
];

/** Preset options for organizer/admin forms (excludes "All"). */
export const EVENT_CATEGORY_OPTIONS = eventCategories.filter((c) => c !== "All");

/**
 * Filter chips including any custom categories already used on published events.
 */
export function getEventCategoryFilters(list) {
  const src = list ?? getAllEvents();
  const custom = src
    .map((e) => e.category)
    .filter(Boolean)
    .filter((c) => !EVENT_CATEGORY_OPTIONS.includes(c));
  return ["All", ...EVENT_CATEGORY_OPTIONS.filter((c) => c !== "Other"), ...new Set(custom), "Other"].filter(
    (c, i, arr) => arr.indexOf(c) === i
  );
}

/**
 * Returns published (admin-approved) events for the public directory.
 */
export function getAllEvents() {
  return getPublishedEvents();
}

/** @deprecated Prefer getAllEvents() — kept empty for any legacy imports. */
export const events = [];
export const staticEvents = [];
export const carouselEvents = [];
export const featuredLargeEvents = [];
export const featuredSmallEvents = [];

export function isEventUpcoming(event) {
  if (!event?.startsAt) return Boolean(event?.upcoming);
  return new Date(event.startsAt).getTime() > Date.now();
}

export function getEventStatus(event) {
  return isEventUpcoming(event) ? "upcoming" : "past";
}

export function getSortedEvents(list) {
  const src = list ?? getAllEvents();
  const upcoming = src
    .filter(isEventUpcoming)
    .sort((a, b) => new Date(a.startsAt ?? 0).getTime() - new Date(b.startsAt ?? 0).getTime());
  const past = src
    .filter((e) => !isEventUpcoming(e))
    .sort((a, b) => new Date(b.startsAt ?? 0).getTime() - new Date(a.startsAt ?? 0).getTime());
  return [...upcoming, ...past];
}

export function getUpcomingEvents() {
  return getSortedEvents().filter(isEventUpcoming);
}

export function getEventById(id) {
  return getAllEvents().find((e) => e.id === id) ?? null;
}

/** Open the organizer's attendee registration link in a new tab. */
export function openAttendeeRegistration(event) {
  const url = event?.registrationUrl?.trim();
  if (!url) return false;
  const href = /^https?:\/\//i.test(url) ? url : `https://${url}`;
  window.open(href, "_blank", "noopener,noreferrer");
  return true;
}
