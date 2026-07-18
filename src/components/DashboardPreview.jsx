import { ghanaHubsEvent } from "../data/events";
import ScrollReveal from "./ScrollReveal";

const metrics = [
  { label: "Registered", value: "180" },
  { label: "Checked In", value: "142" },
  { label: "Attendance", value: "78.9%" },
  { label: "Walk-ins", value: "12" },
];

export default function DashboardPreview() {
  return (
    <section id="dashboard" className="border-t border-blue-100 bg-blue-50 py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <ScrollReveal as="p" className="text-sm font-medium text-brand-blue">
          Live Dashboard and Analytics
        </ScrollReveal>
        <ScrollReveal as="h2" delay={100} className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
          Real-Time Event Intelligence
        </ScrollReveal>
        <ScrollReveal as="p" delay={200} className="mx-auto mt-4 max-w-lg text-sm text-slate-600">
          Watch attendance update live on screen. Get a clear report when the event ends.
        </ScrollReveal>

        <ScrollReveal delay={300}>
          <div className="mt-10 overflow-hidden rounded-2xl border border-blue-100 bg-white text-left">
            <div className="flex items-center justify-between border-b border-blue-100 px-5 py-3">
              <div>
                <p className="text-xs text-slate-400">Live</p>
                <p className="text-sm font-semibold text-navy">{ghanaHubsEvent.title}</p>
              </div>
              <span className="text-xs font-medium text-brand-blue">Kumasi</span>
            </div>

            <div className="grid grid-cols-2 divide-x divide-blue-100 sm:grid-cols-4">
              {metrics.map((metric) => (
                <div key={metric.label} className="px-4 py-5 text-center">
                  <p className="text-xl font-bold text-navy sm:text-2xl">{metric.value}</p>
                  <p className="mt-1 text-xs text-slate-400">{metric.label}</p>
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
