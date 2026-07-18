import { ArrowUpRight, Check } from "lucide-react";

export default function ServiceCard({ service, index }) {
  return (
    <article className="service-card group">
      <div className="service-card-media">
        <img
          src={service.image}
          alt={service.title}
          className={service.imageClass ?? "object-cover object-center"}
          loading="lazy"
        />
        <div className="service-card-media-overlay" aria-hidden="true" />
        <span className="service-card-index">{String(index + 1).padStart(2, "0")}</span>
      </div>

      <div className="service-card-body">
        <h3 className="service-card-title">{service.title}</h3>
        <ul className="service-card-list">
          {service.items.map((item) => (
            <li key={item} className="service-card-item">
              <Check className="service-card-check" strokeWidth={2.5} aria-hidden="true" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="service-card-footer">
        <span className="service-card-footer-label">Future-Link Services</span>
        <span className="service-card-footer-icon" aria-hidden="true">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
    </article>
  );
}
