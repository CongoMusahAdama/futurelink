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
  excerpt:
    "Upcoming AGM next week in Kumasi — annual general meeting for Ghana Hubs Network members with professional QR check-in, live dashboard, and end-of-day analytics.",
};

export const events = [
  ghanaHubsEvent,
  {
    id: "educators-conference",
    title: "National Educators Conference",
    category: "Conference",
    date: "Jul 18, 2026",
    location: "Madina, Ghana",
    image: "/events/educators-conference.jpg",
    excerpt:
      "Full digital registration setup with fast-lane QR scanning, instant name-tag printing, and real-time attendance tracking for 500+ educators.",
  },
  {
    id: "digital-innovation-week",
    title: "Digital Innovation Week",
    category: "Summit",
    date: "Nov 12, 2025",
    location: "Accra, Ghana",
    image: "/events/digital-innovation-week.jpg",
    excerpt:
      "Nationwide summit on digital transformation with live attendance tracking and regional delegate analytics.",
  },
  {
    id: "youth-convention",
    title: "International Youth Convention",
    category: "Conference",
    date: "Sep 17, 2025",
    location: "Kumasi, Ghana",
    image: "/events/youth-convention.jpg",
    excerpt:
      "Large-scale youth gathering with QR check-in, category tracking, and post-event engagement reports.",
  },
  {
    id: "sales-leaders-conference",
    title: "National Sales Leaders Conference",
    category: "Conference",
    date: "Jun 17, 2026",
    location: "Accra, Ghana",
    image: "/events/sales-leaders-conference.jpg",
    excerpt:
      "Executive conference with VIP registration desk, branded badges, and real-time attendance dashboard.",
  },
  {
    id: "media-creators-networking",
    title: "Digital Media Creators Networking",
    category: "Networking",
    date: "Apr 30, 2026",
    location: "Accra, Ghana",
    image: "/events/media-creators-networking.jpg",
    excerpt:
      "Creative industry networking event with walk-in support and instant participant data exports.",
  },
];

export const carouselEvents = events.slice(0, 5);

export const featuredLargeEvents = events.slice(0, 2);

export const featuredSmallEvents = events.slice(2);
