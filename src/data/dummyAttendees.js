import { computeEventAnalytics } from "../lib/analytics";

/** Derive dashboard stats from a live attendee list */
export function computeStatsFromAttendees(attendees) {
  return computeEventAnalytics(attendees);
}
