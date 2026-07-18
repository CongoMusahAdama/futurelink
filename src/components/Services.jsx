import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import ServiceCard from "./ServiceCard";
import { services } from "../data/services";

export default function Services() {
  return (
    <section id="services-preview" className="services-section border-t border-blue-100 bg-white py-16 sm:py-24">
      <div className="mx-auto max-w-6xl px-5">
        <div className="mx-auto max-w-3xl text-center">
          <ScrollReveal as="p" className="text-sm font-semibold text-brand-blue">
            Our Services
          </ScrollReveal>
          <ScrollReveal as="h2" delay={100} className="services-heading mt-3">
            Skills. Business.{" "}
            <span className="hero-headline-highlight">Opportunity.</span>
          </ScrollReveal>
          <ScrollReveal
            as="p"
            delay={200}
            className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600"
          >
            We equip individuals and businesses with the skills, tools, and support needed to
            grow and succeed — from workforce training and SME coaching to smart event
            registration.
          </ScrollReveal>
        </div>

        <div className="services-grid mt-12 sm:mt-14">
          {services.map((service, index) => (
            <ScrollReveal key={service.id} delay={120 + index * 60} className="h-full">
              <ServiceCard service={service} index={index} />
            </ScrollReveal>
          ))}
        </div>

        <ScrollReveal delay={400} className="mt-12 text-center">
          <a href="#services" className="hero-cta hero-cta-primary inline-flex">
            <span>View All Services</span>
            <span className="hero-cta-icon" aria-hidden="true">
              <ArrowUpRight className="h-4 w-4" />
            </span>
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
