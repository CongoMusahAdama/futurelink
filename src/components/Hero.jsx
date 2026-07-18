import { ArrowUpRight, Play } from "lucide-react";
import ScrollReveal from "./ScrollReveal";
import TicketButton from "./TicketButton";
import EventCountdown from "./EventCountdown";
import { useRegistrationModal } from "../context/RegistrationModalContext";
import { ghanaHubsEvent } from "../data/events";
import { heroAccentSpotlight, heroSpotlights } from "../data/heroServices";

function HeroSpotlightCard({ spotlight, tab = "tr" }) {
  const topRadius =
    tab === "tr"
      ? "rounded-t-[1.75rem] rounded-tr-[4rem]"
      : "rounded-t-[1.75rem] rounded-tl-[4rem]";

  return (
    <a
      href={spotlight.href}
      className="group flex h-full w-full min-h-[320px] flex-col overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-blue-100 lg:min-h-0"
    >
      <div className={`relative min-h-[220px] flex-1 overflow-hidden bg-blue-50 sm:min-h-[240px] ${topRadius}`}>
        {spotlight.upcoming && (
          <span className="absolute left-4 top-4 z-10 rounded-full bg-orange px-3 py-1 text-[11px] font-semibold text-navy">
            Upcoming · {spotlight.upcomingLabel ?? "Next week"}
          </span>
        )}
        <img
          src={spotlight.image}
          alt={spotlight.title}
          className={`absolute inset-0 h-full w-full transition-transform duration-700 group-hover:scale-[1.04] ${spotlight.imageClass ?? "object-cover object-center"}`}
          loading="eager"
        />
      </div>
      <div className="shrink-0 bg-navy px-5 py-4 text-white">
        <p className="text-[11px] font-semibold uppercase tracking-wide text-brand-blue">
          {spotlight.category}
        </p>
        <p className="mt-1 text-sm font-bold leading-snug">{spotlight.title}</p>
        {spotlight.subtitle && (
          <p className="mt-1 text-xs text-blue-100">{spotlight.subtitle}</p>
        )}
      </div>
    </a>
  );
}

function HeroAccentCard({ spotlight }) {
  return (
    <a
      href={spotlight.href}
      className="group relative flex h-full w-full min-h-[280px] flex-col overflow-hidden rounded-[1.75rem] rounded-tl-[4rem] bg-brand-blue ring-1 ring-blue-100 lg:min-h-0"
    >
      <div className="relative min-h-[220px] min-w-0 flex-1 overflow-hidden sm:min-h-[240px]">
        <img
          src={spotlight.image}
          alt={spotlight.title}
          className="absolute inset-0 h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-[1.04]"
          loading="lazy"
        />
      </div>
      <div className="flex shrink-0 items-center justify-between gap-3 bg-brand-blue px-5 py-4 text-navy">
        <div>
          <p className="text-[11px] font-semibold uppercase tracking-wide opacity-80">
            {spotlight.category}
          </p>
          <p className="text-sm font-bold leading-snug">{spotlight.cta ?? spotlight.title}</p>
        </div>
        <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white text-navy transition-transform group-hover:scale-105">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </a>
  );
}

export default function Hero() {
  const [spotlightOne, spotlightTwo] = heroSpotlights;
  const { openRegistration } = useRegistrationModal();

  return (
    <section className="bg-blue-50 pb-16 pt-32 sm:pb-24 sm:pt-40 lg:pt-36">
      <div className="mx-auto max-w-7xl px-4 sm:px-5">
        <div className="mx-auto max-w-3xl text-center">
          <p className="hero-animate hero-animate-delay-1 text-sm font-medium text-brand-blue">
            Welcome to Future-Link Services
          </p>

          <h1 className="mt-3 text-3xl font-bold leading-tight tracking-tight text-navy sm:text-5xl lg:text-[3.25rem]">
            <span className="hero-animate-line hero-animate-delay-2 block">
              Skills. Business.
            </span>
            <span className="hero-animate-line hero-animate-delay-3 mt-1 block text-brand-blue">
              Opportunity.
            </span>
          </h1>

          <p className="hero-animate hero-animate-delay-4 mx-auto mt-5 max-w-2xl text-base text-slate-600">
            Future-Link Services equips individuals and businesses with workforce training,
            skills-to-income programmes, SME support, community initiatives, and smart
            event check-in — the tools you need to grow, earn, and succeed.
          </p>

          <div className="hero-animate hero-animate-delay-5 mt-8 flex flex-wrap items-center justify-center gap-3">
            <a
              href="#services"
              className="inline-flex items-center gap-2 rounded-full bg-brand-blue px-6 py-3 text-sm font-medium text-navy transition-colors hover:bg-brand-blue-dark"
            >
              Explore Our Services
              <ArrowUpRight className="h-4 w-4" />
            </a>
            <TicketButton onClick={() => openRegistration(ghanaHubsEvent)}>
              Register an Event
            </TicketButton>
            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-navy ring-1 ring-blue-100 transition-colors hover:bg-blue-100/50"
            >
              <Play className="h-4 w-4 fill-navy text-navy" />
              See How It Works
            </a>
          </div>

          {ghanaHubsEvent.upcoming && ghanaHubsEvent.startsAt && (
            <div className="hero-animate hero-animate-delay-6 mx-auto mt-8 max-w-md">
              <EventCountdown
                startsAt={ghanaHubsEvent.startsAt}
                label={`${ghanaHubsEvent.title} starts in`}
              />
            </div>
          )}
        </div>

        <div className="hero-bento mt-12 w-full sm:mt-16">
          <ScrollReveal delay={240} className="hero-stat h-full w-full">
            <div className="flex h-full w-full min-h-[240px] flex-col justify-between rounded-[1.75rem] rounded-tr-[4rem] bg-navy p-6 text-white lg:min-h-0 lg:p-7">
              <div>
                <p className="text-4xl font-bold sm:text-5xl">6+</p>
                <p className="mt-3 text-sm leading-relaxed text-blue-100 sm:text-base">
                  Service areas across workforce development, skills training, business
                  support, community work, builders academy, and event check-in.
                </p>
              </div>
              <a
                href="#services"
                className="mt-6 inline-flex w-fit items-center gap-2 rounded-full bg-brand-blue px-4 py-2.5 text-sm font-medium text-navy transition-colors hover:bg-brand-blue-dark"
              >
                View Services
                <ArrowUpRight className="h-4 w-4" />
              </a>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={280} className="hero-chip-left h-full w-full">
            <div className="flex h-full w-full min-h-[72px] items-center gap-3 rounded-2xl bg-navy-light px-5 py-4 text-white">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-sm font-bold">
                +
              </span>
              <p className="text-sm font-medium">Skills-to-income training</p>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={320} className="hero-photo-1 h-full w-full sm:col-span-2 lg:col-span-1">
            <HeroSpotlightCard spotlight={spotlightOne} tab="tr" />
          </ScrollReveal>

          <ScrollReveal delay={360} className="hero-center h-full w-full sm:col-span-2 lg:col-span-1">
            <div className="flex h-full w-full flex-col justify-center overflow-hidden rounded-[1.75rem] bg-white ring-1 ring-blue-100 sm:p-0">
              <div className="relative h-28 shrink-0 overflow-hidden sm:h-32">
                <img
                  src="/services/builders-academy.jpg"
                  alt="Builders Academy vocational training"
                  className="absolute inset-0 h-full w-full object-cover object-center"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-navy/40" />
                <p className="absolute bottom-3 left-5 text-[11px] font-semibold uppercase tracking-wide text-brand-blue">
                  Builders Academy
                </p>
              </div>
              <div className="flex flex-1 flex-col justify-center p-5 sm:p-6">
                <p className="text-lg font-bold leading-snug text-navy sm:text-xl">
                  Empowering people. Building communities.
                </p>
                <div className="mt-4 flex items-center justify-between gap-3">
                  <a href="#services" className="text-sm font-medium text-slate-500 hover:text-brand-blue">
                    Our services
                  </a>
                  <a
                    href="#services"
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-navy text-white transition-colors hover:bg-navy-light"
                    aria-label="View our services"
                  >
                    <ArrowUpRight className="h-4 w-4" />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={400} className="hero-photo-2 h-full w-full sm:col-span-2 lg:col-span-1">
            <HeroSpotlightCard spotlight={spotlightTwo} tab="tl" />
          </ScrollReveal>

          <ScrollReveal delay={440} className="hero-accent h-full w-full">
            <HeroAccentCard spotlight={heroAccentSpotlight} />
          </ScrollReveal>

          <ScrollReveal delay={480} className="hero-chip-right h-full w-full">
            <div className="flex h-full w-full min-h-[72px] items-center gap-3 rounded-2xl bg-navy px-5 py-4 text-white">
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-orange/20">
                <span className="h-2 w-2 rounded-full bg-orange" />
              </span>
              <p className="text-sm font-medium">Smart check-in & analytics</p>
            </div>
          </ScrollReveal>
        </div>
      </div>
    </section>
  );
}
