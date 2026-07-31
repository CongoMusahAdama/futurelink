/**
 * Client-side storage for event registrations.
 * Registrations are stored in localStorage under EE_REG_KEY as a JSON array.
 * Each entry:
 *   { id, eventId, eventTitle, firstName, lastName, email, company, phone,
 *     status: "pending"|"approved"|"rejected", submittedAt, reviewedAt? }
 */

const EE_REG_KEY = "ee-registrations";

function readAll() {
  try {
    const raw = window.localStorage.getItem(EE_REG_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeAll(list) {
  try {
    window.localStorage.setItem(EE_REG_KEY, JSON.stringify(list));
  } catch {
    // ignore quota errors
  }
}

function generateId() {
  return `REG-${Date.now().toString(36).toUpperCase()}-${Math.random()
    .toString(36)
    .slice(2, 6)
    .toUpperCase()}`;
}

/** Save a new registration (status = "pending"). Returns the saved entry. */
export function saveRegistration({ eventId, eventTitle, firstName, lastName, email, company, phone }) {
  const list = readAll();
  const entry = {
    id: generateId(),
    eventId,
    eventTitle,
    firstName,
    lastName,
    email,
    company: company || "",
    phone: phone || "",
    status: "pending",
    submittedAt: new Date().toISOString(),
  };
  list.push(entry);
  writeAll(list);
  return entry;
}

/** Return all registrations, optionally filtered by eventId. */
export function getRegistrations(eventId = null) {
  const list = readAll();
  if (!eventId) return list;
  return list.filter((r) => r.eventId === eventId);
}

/** Update the status of a registration by id. Returns updated entry or null. */
export function updateRegistrationStatus(id, status) {
  const list = readAll();
  const idx = list.findIndex((r) => r.id === id);
  if (idx === -1) return null;
  list[idx] = { ...list[idx], status, reviewedAt: new Date().toISOString() };
  writeAll(list);
  return list[idx];
}

/** Delete a registration by id. */
export function deleteRegistration(id) {
  const list = readAll().filter((r) => r.id !== id);
  writeAll(list);
}
