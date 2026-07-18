import ScrollReveal from "./ScrollReveal";
import { ghanaHubsEvent } from "../data/events";

const stats = [
  {
    value: "180+",
    label: "Events Managed",
    description: "Conferences, AGMs, and workshops supported across Ghana.",
  },
  {
    value: "50K+",
    label: "Attendees Registered",
    description: "Fast QR check-in and paperless registration at every event.",
  },
  {
    value: "5–10s",
    label: "Average Check-in",
    description: "Pre-registered guests scanned and checked in within seconds.",
  },
  {
    value: "100%",
    label: "Paperless",
    description: "Digital records, live dashboards, and exportable reports.",
  },
];

const milestones = [
  {
    year: "2024",
    title: "Future-Link Services launched",
    description:
      "Future-Link Services set out to help event organizers move beyond manual registration toward smarter event management.",
  },
  {
    year: "2025",
    title: "Smart event platform launched",
    description:
      "We built our digital registration and live analytics platform for conferences and AGMs across Ghana.",
    image: "/events/educators-conference.jpg",
  },
  {
    year: "2026",
    title: "Ghana Hubs Network AGM",
    description: `Upcoming next week in Kumasi — ${ghanaHubsEvent.title} with QR check-in, live dashboard, and end-of-day analytics.`,
  },
  {
    year: "Today",
    title: "Smart Event Intelligence",
    description:
      "We help organizers understand their audience, measure engagement, and improve every event they run.",
  },
];

export default function About() {
  return (
    <section className="border-t border-blue-100 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        {/* Impact stats */}
        <div id="impact" className="scroll-mt-28 text-center">
          <ScrollReveal as="h2" className="text-2xl font-bold text-navy sm:text-4xl">
            Our Impact by the Numbers
          </ScrollReveal>
          <ScrollReveal as="p" delay={100} className="mx-auto mt-4 max-w-2xl text-sm text-slate-500 sm:text-base">
            Future-Link Services delivers professional registration and real-time intelligence
            that helps organizers run smoother, data-driven events.
          </ScrollReveal>
        </div>

        <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat, index) => (
            <ScrollReveal key={stat.label} delay={120 + index * 80}>
              <div className="rounded-2xl bg-blue-50 p-6 text-center sm:p-8">
                <p className="text-3xl font-bold text-navy sm:text-4xl">{stat.value}</p>
                <p className="mt-3 text-sm font-bold text-navy">{stat.label}</p>
                <p className="mt-2 text-xs leading-relaxed text-slate-500 sm:text-sm">
                  {stat.description}
                </p>
              </div>
            </ScrollReveal>
          ))}
        </div>

        {/* Timeline */}
        <div id="about" className="scroll-mt-28 mt-24 grid gap-12 lg:grid-cols-2 lg:gap-16">
          <div className="lg:sticky lg:top-28 lg:self-start">
            <ScrollReveal as="h2" className="text-2xl font-bold leading-tight text-navy sm:text-3xl lg:text-4xl">
              Building Better Events, One Milestone at a Time
            </ScrollReveal>
            <ScrollReveal as="p" delay={100} className="mt-5 text-sm leading-relaxed text-slate-500 sm:text-base">
              From our first vision to the upcoming Ghana Hubs Network AGM in
              Kumasi, we are helping organizers deliver professional attendee experiences
              with real-time intelligence.
            </ScrollReveal>
          </div>

          <div className="relative border-l-2 border-blue-100 pl-8 sm:pl-10">
            {milestones.map((item, index) => (
              <ScrollReveal key={item.year + item.title} delay={150 + index * 100} className="relative pb-12 last:pb-0">
                <span className="absolute -left-[41px] top-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-brand-blue sm:-left-[45px]" />

                <p className="text-sm font-semibold text-brand-blue">{item.year}</p>
                <h3 className="mt-1 text-base font-bold text-navy sm:text-lg">{item.title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-500">{item.description}</p>

                {item.image && (
                  <img
                    src={item.image}
                    alt="Conference event"
                    className="mt-4 w-full rounded-xl border border-blue-100 object-cover"
                  />
                )}
              </ScrollReveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
