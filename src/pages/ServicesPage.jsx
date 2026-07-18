import { ArrowRight, ArrowUpRight, Check } from "lucide-react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import ScrollReveal from "../components/ScrollReveal";
import ServiceCard from "../components/ServiceCard";
import { getPillarLabel, servicePillars, services } from "../data/services";
import { CONTACT_EMAIL } from "../lib/brand";

function SectionIntro({ label, title, description, className = "" }) {
  return (
    <div className={`mx-auto max-w-2xl text-center ${className}`}>
      <ScrollReveal as="p" variant="subtle" className="text-sm font-semibold text-brand-blue">
        {label}
      </ScrollReveal>
      <ScrollReveal as="h2" variant="heading" delay={80} className="mt-3 text-2xl font-bold text-navy sm:text-3xl">
        {title}
      </ScrollReveal>
      {description && (
        <ScrollReveal as="p" variant="subtle" delay={160} className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          {description}
        </ScrollReveal>
      )}
    </div>
  );
}

function ServiceDetail({ service, index }) {
  const reversed = index % 2 === 1;

  return (
    <section
      id={service.id}
      className={`service-detail ${index % 2 === 0 ? "service-detail--light" : "service-detail--white"}`}
    >
      <div className="mx-auto max-w-6xl px-5">
        <div className={`service-detail-grid ${reversed ? "service-detail-grid--reverse" : ""}`}>
          <ScrollReveal delay={60} className="service-detail-media-wrap">
            <div className="service-detail-media">
              <img
                src={service.image}
                alt={service.title}
                className={service.imageClass ?? "object-cover object-center"}
                loading="lazy"
              />
              <span className="service-detail-index">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>
          </ScrollReveal>

          <div className="service-detail-content">
            <ScrollReveal as="span" variant="subtle" className="service-detail-pillar">
              {getPillarLabel(service.pillar)}
            </ScrollReveal>
            <ScrollReveal as="h2" variant="heading" delay={80} className="service-detail-title">
              {service.title}
            </ScrollReveal>
            <ScrollReveal as="p" variant="subtle" delay={140} className="service-detail-summary">
              {service.summary}
            </ScrollReveal>
            <ScrollReveal as="p" variant="subtle" delay={200} className="service-detail-description">
              {service.description}
            </ScrollReveal>

            <ScrollReveal delay={260}>
              <ul className="service-detail-list">
                {service.items.map((item) => (
                  <li key={item} className="service-detail-item">
                    <Check className="service-detail-check" strokeWidth={2.5} aria-hidden="true" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </ScrollReveal>

            <ScrollReveal delay={320}>
              <a href="#contact" className="service-detail-cta">
                <span>Enquire about this service</span>
                <span className="service-detail-cta-icon" aria-hidden="true">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </ScrollReveal>
          </div>
        </div>
      </div>
    </section>
  );
}

export default function ServicesPage() {
  return (
    <>
      <Header />
      <main className="services-page">
        <section className="services-page-hero bg-blue-50 pt-32 pb-14 sm:pt-40 sm:pb-16">
          <div className="mx-auto max-w-4xl px-5 text-center">
            <ScrollReveal as="p" variant="subtle" className="text-sm font-semibold text-brand-blue">
              Our Services
            </ScrollReveal>
            <ScrollReveal as="h1" variant="heading" delay={80} className="services-heading mt-3">
              Skills. Business.{" "}
              <span className="hero-headline-highlight">Opportunity.</span>
            </ScrollReveal>
            <ScrollReveal
              as="p"
              variant="subtle"
              delay={160}
              className="mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg"
            >
              Future-Link Services equips individuals, SMEs, and communities across Ghana with
              workforce training, income-generating skills, business support, community
              programmes, and smart event technology.
            </ScrollReveal>
            <ScrollReveal delay={240} className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <a href="#contact" className="hero-cta hero-cta-primary">
                <span>Talk to Our Team</span>
                <span className="hero-cta-icon" aria-hidden="true">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
              <a href="#" className="hero-cta hero-cta-secondary">
                <span>Back to Home</span>
                <span className="hero-cta-icon" aria-hidden="true">
                  <ArrowRight className="h-4 w-4" />
                </span>
              </a>
            </ScrollReveal>
          </div>
        </section>

        <section className="border-t border-blue-100 bg-white py-14 sm:py-16">
          <div className="mx-auto max-w-6xl px-5">
            <SectionIntro
              label="What We Deliver"
              title="Three pillars. One mission."
              description="Every programme we run connects back to building skills, strengthening businesses, and creating opportunity for Ghanaian communities."
            />

            <div className="services-pillars mt-10">
              {servicePillars.map((pillar, index) => (
                <ScrollReveal key={pillar.id} delay={100 + index * 80} className="h-full">
                  <article className="services-pillar-card">
                    <span className="services-pillar-label">{pillar.label}</span>
                    <h3 className="services-pillar-title">{pillar.tagline}</h3>
                    <p className="services-pillar-copy">{pillar.description}</p>
                  </article>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-blue-100 bg-white py-4 sm:py-6">
          <div className="mx-auto max-w-6xl px-5">
            <SectionIntro label="At a Glance" title="All six service areas" />

            <div className="services-grid mt-10">
              {services.map((service, index) => (
                <ScrollReveal key={service.id} delay={100 + index * 60} className="h-full">
                  <a href={`#${service.id}`} className="block h-full">
                    <ServiceCard service={service} index={index} />
                  </a>
                </ScrollReveal>
              ))}
            </div>
          </div>
        </section>

        {services.map((service, index) => (
          <ServiceDetail key={service.id} service={service} index={index} />
        ))}

        <section className="border-t border-blue-100 bg-blue-50 py-16 sm:py-20">
          <div className="mx-auto max-w-3xl px-5 text-center">
            <ScrollReveal as="h2" variant="heading" className="text-2xl font-bold text-navy sm:text-3xl">
              Ready to get started?
            </ScrollReveal>
            <ScrollReveal as="p" variant="subtle" delay={100} className="mx-auto mt-4 max-w-xl text-base text-slate-600">
              Whether you need workforce training, SME support, community programmes, or smart
              event check-in — our team will help you plan the right solution.
            </ScrollReveal>
            <ScrollReveal delay={180} className="mt-8">
              <a href="#contact" className="hero-cta hero-cta-primary inline-flex">
                <span>Contact Future-Link</span>
                <span className="hero-cta-icon" aria-hidden="true">
                  <ArrowUpRight className="h-4 w-4" />
                </span>
              </a>
            </ScrollReveal>
          </div>
        </section>

        <ContactStrip />
      </main>
      <Footer />
    </>
  );
}

function ContactStrip() {
  return (
    <section id="contact" className="border-t border-blue-100 bg-white py-16 sm:py-20">
      <div className="mx-auto max-w-3xl px-5 text-center">
        <ScrollReveal as="h2" variant="heading" className="text-2xl font-bold text-navy sm:text-3xl">
          Get in touch
        </ScrollReveal>
        <ScrollReveal as="p" variant="subtle" delay={100} className="mt-4 text-sm leading-relaxed text-slate-600 sm:text-base">
          Tell us about your training needs, business goals, or upcoming event. We respond
          within 24 hours.
        </ScrollReveal>
        <ScrollReveal delay={180}>
          <a
            href={`mailto:${CONTACT_EMAIL}`}
            className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-brand-blue transition-colors hover:text-navy"
          >
            {CONTACT_EMAIL}
            <ArrowUpRight className="h-4 w-4" />
          </a>
        </ScrollReveal>
      </div>
    </section>
  );
}
