export const ghanaHubsEvent = {
  id: "ghana-hubs-agm",
  title: "Ghana Hubs Network AGM 2026",
  category: "AGM",
  date: "Mon, 21 Jul 2026",
  location: "Kumasi, Ghana",
  image: "/events/ghana-hubs-summit.png",
  logo: "/events/ghana-hubs-network.png",
  imageClass: "object-left",
  heroImageClass: "object-contain object-center p-2 sm:p-3",
  upcoming: true,
  upcomingLabel: "Next week in Kumasi",
  startsAt: "2026-07-21T09:00:00+00:00",
  excerpt:
    "Upcoming AGM next week in Kumasi — annual general meeting for Ghana Hubs Network members with professional QR check-in, live dashboard, and end-of-day analytics.",
  criteria: ["QR Check-in", "Live Dashboard", "Badge Printing", "Member Registration"],
};

export const events = [
  ghanaHubsEvent,
  {
    id: "educators-conference",
    title: "National Educators Conference",
    category: "Conference",
    date: "Sat, 18 Jul 2026",
    location: "Madina, Ghana",
    image: "/events/educators-conference.jpg",
    startsAt: "2026-07-18T08:00:00+00:00",
    upcoming: true,
    excerpt:
      "Full digital registration setup with fast-lane QR scanning, instant name-tag printing, and real-time attendance tracking for 500+ educators.",
    criteria: ["QR Check-in", "Fast Lane", "Name Tags", "Attendance Export"],
  },
  {
    id: "sales-leaders-conference",
    title: "National Sales Leaders Conference",
    category: "Conference",
    date: "Wed, 17 Jun 2026",
    location: "Accra, Ghana",
    image: "/events/sales-leaders-conference.jpg",
    startsAt: "2026-06-17T09:00:00+00:00",
    excerpt:
      "Executive conference with VIP registration desk, branded badges, and real-time attendance dashboard.",
    criteria: ["VIP Desk", "Branded Badges", "Live Dashboard", "Executive Check-in"],
  },
  {
    id: "media-creators-networking",
    title: "Digital Media Creators Networking",
    category: "Networking",
    date: "Thu, 30 Apr 2026",
    location: "Accra, Ghana",
    image: "/events/media-creators-networking.jpg",
    startsAt: "2026-04-30T17:00:00+00:00",
    excerpt:
      "Creative industry networking event with walk-in support and instant participant data exports.",
    criteria: ["Walk-in Desk", "QR Check-in", "Networking Tags", "Data Export"],
  },
  {
    id: "digital-innovation-week",
    title: "Digital Innovation Week",
    category: "Summit",
    date: "Wed, 12 Nov 2025",
    location: "Accra, Ghana",
    image: "/events/digital-innovation-week.jpg",
    startsAt: "2025-11-12T09:00:00+00:00",
    excerpt:
      "Nationwide summit on digital transformation with live attendance tracking and regional delegate analytics.",
    criteria: ["Multi-day Tracking", "Regional Analytics", "Summit Badges", "Live TV Dashboard"],
  },
  {
    id: "youth-convention",
    title: "International Youth Convention",
    category: "Conference",
    date: "Wed, 17 Sep 2025",
    location: "Kumasi, Ghana",
    image: "/events/youth-convention.jpg",
    startsAt: "2025-09-17T08:30:00+00:00",
    excerpt:
      "Large-scale youth gathering with QR check-in, category tracking, and post-event engagement reports.",
    criteria: ["Youth Categories", "QR Check-in", "Engagement Reports", "Group Registration"],
  },
];

export const eventCategories = ["All", ...new Set(events.map((event) => event.category))];

export const carouselEvents = events.slice(0, 5);

export const featuredLargeEvents = events.slice(0, 2);

export const featuredSmallEvents = events.slice(2);

export function isEventUpcoming(event) {
  if (!event.startsAt) return Boolean(event.upcoming);
  return new Date(event.startsAt).getTime() > Date.now();
}

export function getEventStatus(event) {
  return isEventUpcoming(event) ? "upcoming" : "past";
}

export function getSortedEvents(list = events) {
  const upcoming = list.filter(isEventUpcoming).sort(
    (a, b) => new Date(a.startsAt).getTime() - new Date(b.startsAt).getTime()
  );
  const past = list.filter((event) => !isEventUpcoming(event)).sort(
    (a, b) => new Date(b.startsAt).getTime() - new Date(a.startsAt).getTime()
  );
  return [...upcoming, ...past];
}

/** Events with a future start date for countdowns */
export function getUpcomingEvents() {
  return getSortedEvents().filter(isEventUpcoming);
}

export function getEventById(id) {
  return events.find((event) => event.id === id);
}
