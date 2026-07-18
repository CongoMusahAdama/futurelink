import { carouselEvents } from "../data/events";

const loopedEvents = [...carouselEvents, ...carouselEvents];

const curvePattern = [
  { rotate: -12, y: 24 },
  { rotate: -6, y: 10 },
  { rotate: 0, y: 0 },
  { rotate: 6, y: 10 },
  { rotate: 12, y: 24 },
];

function EventCard({ event, index }) {
  const { rotate, y } = curvePattern[index % curvePattern.length];

  return (
    <div
      className="carousel-card w-60 shrink-0 origin-bottom sm:w-72"
      style={{ transform: `rotate(${rotate}deg) translateY(${y}px)` }}
    >
      <img
        src={event.image}
        alt={event.title}
        className={`h-44 w-full rounded-2xl object-cover shadow-lg sm:h-52 ${event.imageClass ?? ""}`}
        loading="lazy"
      />
      <div className="mt-3 px-1">
        <p className="text-[10px] font-semibold uppercase tracking-wide text-brand-blue">
          {event.category}
        </p>
        <p className="mt-1 line-clamp-2 text-sm font-bold leading-snug text-navy">
          {event.title}
        </p>
        <p className="mt-1.5 text-xs text-slate-500">{event.date}</p>
      </div>
    </div>
  );
}

export default function EventCarousel() {
  return (
    <div className="carousel-viewport mx-auto w-full max-w-6xl">
      <div className="carousel-track flex w-max items-end gap-14 sm:gap-20 lg:gap-28">
        {loopedEvents.map((event, index) => (
          <EventCard key={`${event.id}-${index}`} event={event} index={index} />
        ))}
      </div>
    </div>
  );
}
