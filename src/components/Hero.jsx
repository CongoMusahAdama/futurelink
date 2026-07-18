import { ArrowUpRight } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import TicketButton from "./TicketButton";
import Typewriter from "./Typewriter";
import HeroCountdownSplash from "./HeroCountdownSplash";
import { useRegistrationModal } from "../context/RegistrationModalContext";
import { ghanaHubsEvent } from "../data/events";
import { heroGalleryImages } from "../data/heroServices";

function HeroCta({ href, onClick, variant = "primary", children }) {
  const className = `hero-cta ${variant === "primary" ? "hero-cta-primary" : "hero-cta-secondary"}`;
  const icon = (
    <span className="hero-cta-icon" aria-hidden="true">
      <ArrowUpRight className="h-4 w-4" />
    </span>
  );

  if (href) {
    return (
      <a href={href} className={className}>
        <span>{children}</span>
        {icon}
      </a>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      <span>{children}</span>
      {icon}
    </button>
  );
}

export default function Hero() {
  const { openRegistration } = useRegistrationModal();

  return (
    <section className="bg-blue-50 pb-16 pt-32 sm:pb-24 sm:pt-40 lg:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-5">
        <div className="mx-auto max-w-4xl text-center">
          {ghanaHubsEvent.upcoming && ghanaHubsEvent.startsAt && (
            <HeroCountdownSplash
              startsAt={ghanaHubsEvent.startsAt}
              label="Ghana Hubs AGM 2026 starts in"
            />
          )}

          <h1 className="hero-animate-line hero-animate-delay-2 text-3xl font-bold leading-[1.15] tracking-tight text-navy sm:text-5xl lg:text-[3.5rem]">
            Skills. Business.
            <br className="sm:hidden" />{" "}
            <Typewriter
              className="hero-headline-highlight hero-headline-typewriter"
              words={["Opportunity.", "Growth.", "Income.", "Success."]}
            />
          </h1>

          <p className="hero-animate hero-animate-delay-3 mx-auto mt-5 max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
            Future-Link Services equips individuals and businesses with workforce training,
            skills-to-income programmes, SME support, community initiatives, and smart
            event check-in — the tools you need to grow, earn, and succeed.
          </p>

          <div className="hero-animate hero-animate-delay-4 mt-8 flex flex-wrap items-center justify-center gap-3">
            <HeroCta href="#services">Explore Our Services</HeroCta>
            <TicketButton onClick={() => openRegistration(ghanaHubsEvent)}>
              Register an Event
            </TicketButton>
          </div>
        </div>

        <ScrollReveal delay={120} className="hero-animate hero-animate-delay-5 mx-auto mt-6 max-w-6xl sm:mt-8">
          <div className="hero-gallery-frame">
            <div className="hero-gallery-grid">
              {heroGalleryImages.map((image) => (
                <div key={image.src} className="hero-gallery-item">
                  <img src={image.src} alt={image.alt} loading="eager" />
                </div>
              ))}
            </div>
          </div>
        </ScrollReveal>
      </div>
    </section>
  );
}
