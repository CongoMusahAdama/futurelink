import { ghanaHubsEvent } from "../data/events";
import { BRAND_NAME, LOGO_SRC } from "./brand";

export const TICKET_EVENT = {
  badge: "AGM 2026",
  title: "GHANA HUBS NETWORK AGM",
  subtitle: "Annual General Meeting",
  date: ghanaHubsEvent.date,
  time: "9:00 AM",
  location: ghanaHubsEvent.location,
  hall: "Main Hall",
  eventLogo: ghanaHubsEvent.logo,
  brandLogo: LOGO_SRC,
  brandName: BRAND_NAME,
};

export function formatTicketDate(dateStr) {
  const match = String(dateStr || "").match(/(\d{1,2}\s+\w{3})/);
  return match ? match[1] : dateStr;
}

export function getTicketFields(attendee) {
  const fields = {
    ...TICKET_EVENT,
    registrationId: attendee.registrationId,
    fullName: attendee.fullName || "Attendee",
    category: attendee.category || "Guest",
    region: attendee.region || "—",
    hub: attendee.hub || "—",
    organisation: attendee.organisation || "",
  };
  return {
    ...fields,
    shortDate: formatTicketDate(fields.date),
    city: fields.location.split(",")[0]?.trim() || fields.location,
  };
}
