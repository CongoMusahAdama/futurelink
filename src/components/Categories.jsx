import { ArrowRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";

const categories = [
  {
    name: "AGM",
    count: "08",
    description:
      "Annual general meetings with member registration, QR check-in, and live attendance tracking.",
    image: "/events/ghana-hubs-summit.png",
    featuredLabel: "Member gatherings",
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
    <section id="categories" className="border-t border-blue-100 bg-white py-16 sm:py-20">
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
                  className="aspect-[16/10] w-full object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                  loading="lazy"
                />
              </div>

              <h3 className="mt-5 text-xl font-bold text-navy sm:text-2xl">{featured.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-slate-500 sm:text-base">
                {featured.description}
              </p>

              {featured.featuredLabel && (
                <p className="mt-4 text-xs font-semibold uppercase tracking-wide text-brand-blue-dark">
                  {featured.featuredLabel}
                </p>
              )}

              <span className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-navy transition-colors group-hover:text-brand-blue">
                Explore {featured.name}
                <ArrowRight className="h-4 w-4" />
              </span>
            </a>
          </ScrollReveal>

          <div className="grid gap-6 sm:grid-cols-2">
            {rest.map((category, index) => (
              <ScrollReveal key={category.name} delay={180 + index * 60}>
                <a href="#events" className="group block">
                  <div className="overflow-hidden rounded-xl bg-blue-50">
                    <img
                      src={category.image}
                      alt={category.name}
                      className="aspect-[4/3] w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
                      loading="lazy"
                    />
                  </div>
                  <div className="mt-3 flex items-baseline justify-between gap-2">
                    <h3 className="font-bold text-navy">{category.name}</h3>
                    <span className="text-xs font-semibold text-slate-400">{category.count}</span>
                  </div>
                  <p className="mt-1.5 text-xs leading-relaxed text-slate-500 sm:text-sm">
                    {category.description}
                  </p>
                </a>
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
