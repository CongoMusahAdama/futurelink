/**
 * Dynamic event store — events listed by organizers (public form or admin).
 * Stored in localStorage under EE_EVENTS_KEY as a JSON array.
 *
 * Shape:
 *   { id, title, category, date, location, startsAt, excerpt,
 *     image, logo?, criteria[], registrationUrl, organizerName?, organizerEmail?,
 *     upcoming, createdAt, dynamic }
 */

const EE_EVENTS_KEY = "ee-events";

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

function generateId(title) {
  return `${slugify(title)}-${Date.now().toString(36)}`;
}

function readAll() {
  try {
    const raw = window.localStorage.getItem(EE_EVENTS_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    window.localStorage.setItem(EE_EVENTS_KEY, JSON.stringify(list));
  } catch {
    // Ignore quota errors
  }
}

function normalizeRegistrationUrl(url) {
  const trimmed = String(url || "").trim();
  if (!trimmed) return "";
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
}

/**
 * Save a new event listing. Returns the saved entry.
 * @param {{ status?: 'pending' | 'approved' }} data — public submissions default to pending
 */
export function saveEvent(data) {
  const list = readAll();
  const status = data.status === "approved" ? "approved" : "pending";
  const entry = {
    id: generateId(data.title),
    title: data.title,
    category: data.category || "Conference",
    date: data.date,
    location: data.location,
    startsAt: data.startsAt || null,
    excerpt: data.excerpt || "",
    image: data.image || null,
    logo: data.logo || null,
    criteria: Array.isArray(data.criteria) ? data.criteria : [],
    registrationUrl: normalizeRegistrationUrl(data.registrationUrl),
    organizerName: data.organizerName?.trim() || "",
    organizerEmail: data.organizerEmail?.trim() || "",
    status,
    upcoming: data.startsAt ? new Date(data.startsAt).getTime() > Date.now() : true,
    createdAt: new Date().toISOString(),
    dynamic: true,
  };
  list.unshift(entry);
  writeAll(list);
  return entry;
}

/** All stored events (including pending). Prefer getPublishedEvents for public pages. */
export function getDynamicEvents() {
  return readAll().map((e) => ({
    ...e,
    // Older events without status were already live
    status: e.status || "approved",
  }));
}

/** Events approved for the public Events directory. */
export function getPublishedEvents() {
  return getDynamicEvents().filter((e) => e.status === "approved");
}

export function getPendingEvents() {
  return getDynamicEvents().filter((e) => e.status === "pending");
}

export function setEventStatus(id, status) {
  return updateDynamicEvent(id, { status });
}

export function deleteDynamicEvent(id) {
  writeAll(readAll().filter((e) => e.id !== id));
}

export function updateDynamicEvent(id, updates) {
  const list = readAll();
  const idx = list.findIndex((e) => e.id === id);
  if (idx === -1) return null;
  const next = { ...list[idx], ...updates };
  if (updates.registrationUrl !== undefined) {
    next.registrationUrl = normalizeRegistrationUrl(updates.registrationUrl);
  }
  list[idx] = next;
  writeAll(list);
  return list[idx];
}
