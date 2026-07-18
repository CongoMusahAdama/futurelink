import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import { ghanaHubsEvent } from "../data/events";

const categories = [
  {
    name: "AGM",
    count: "08",
    description: `${ghanaHubsEvent.title} — upcoming next week in Kumasi with member registration and live attendance tracking.`,
    image: ghanaHubsEvent.image,
    imageClass: ghanaHubsEvent.imageClass,
    featuredLabel: "Upcoming next week",
  },
  {
    name: "Conference",
    count: "12",
    description:
      "Large professional gatherings with keynotes, panels, and industry sessions across Ghana.",
    image: "/events/educators-conference.jpg",
  },
  {
    name: "Workshop",
    count: "06",
    description: "Hands-on learning sessions for teams, educators, and professionals.",
    image: "/events/digital-innovation-week.jpg",
  },
  {
    name: "Summit",
    count: "05",
    description: "High-level summits connecting leaders, innovators, and ecosystem builders.",
    image: "/events/sales-leaders-conference.jpg",
  },
  {
    name: "Networking",
    count: "04",
    description: "Creative and professional meetups for collaboration and community building.",
    image: "/events/media-creators-networking.jpg",
  },
  {
    name: "Training",
    count: "03",
    description: "Skills development and capacity-building programmes for organisations.",
    image: "/events/youth-convention.jpg",
  },
];

const [featured, ...rest] = categories;

export default function Categories() {
  return (
    <section className="border-t border-blue-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-6xl px-5">
        <div className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between">
          <div className="max-w-xl">
            <ScrollReveal as="h2" className="text-2xl font-bold text-navy sm:text-3xl">
              Explore Categories
            </ScrollReveal>
            <ScrollReveal as="p" delay={100} className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
              Browse upcoming events across Ghana by type — from conferences and AGMs to
              workshops and networking sessions.
            </ScrollReveal>
          </div>

          <ScrollReveal delay={120}>
            <a
              href="#events"
              className="inline-flex shrink-0 items-center gap-2 rounded-full bg-brand-blue px-5 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-brand-blue-dark"
            >
              View All
              <ArrowRight className="h-4 w-4" />
            </a>
          </ScrollReveal>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[1.15fr_1fr] lg:gap-12">
          <ScrollReveal delay={140}>
            <a href="#events" className="group block">
              <div className="overflow-hidden rounded-2xl bg-blue-50">
                <img
                  src={featured.image}
                  alt={featured.name}
                  className={`aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02] ${featured.imageClass ?? ""}`}
                  loading="lazy"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-navy sm:text-2xl">{featured.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                {featured.description}
              </p>

              <div className="mt-5 flex items-center justify-between border-t border-blue-100 pt-5 text-sm">
                <span className="font-medium text-navy">{featured.count} upcoming events</span>
                <span className="font-medium text-orange">{featured.featuredLabel ?? "Most popular"}</span>
              </div>
            </a>
          </ScrollReveal>

          <div className="divide-y divide-blue-100">
            {rest.map((cat, i) => (
              <ScrollReveal key={cat.name} delay={180 + i * 60}>
                <a href="#events" className="group flex gap-4 py-5 first:pt-0 last:pb-0">
                  <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl sm:h-24 sm:w-24">
                    <img
                      src={cat.image}
                      alt={cat.name}
                      className={`h-full w-full object-cover transition-transform duration-300 group-hover:scale-105 ${cat.imageClass ?? ""}`}
                      loading="lazy"
                    />
                  </div>

                  <div className="flex min-w-0 flex-1 flex-col justify-center">
                    <h4 className="font-bold text-navy transition-colors group-hover:text-brand-blue">
                      {cat.name}
                    </h4>
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                      {cat.description}
                    </p>
                    <div className="mt-3 flex items-center justify-between text-xs text-slate-400">
                      <span>{cat.count} events</span>
                      <span className="font-medium text-brand-blue opacity-0 transition-opacity group-hover:opacity-100">
                        Browse
                      </span>
                    </div>
                  </div>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
