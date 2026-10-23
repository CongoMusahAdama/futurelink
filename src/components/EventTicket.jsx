import { Download, Printer, Ticket, UserRound } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getTicketFields } from "../lib/eventTicketMeta";
import { EVENT } from "../data/checkin";
import { useTabletLayout } from "../hooks/useTabletLayout";

export default function EventTicket({
  attendee,
  showActions = false,
  onPrint,
  onDownload,
  onBadge,
  statusLine,
}) {
  const t = getTicketFields(attendee);
  const isTablet = useTabletLayout();
  const qrSize = isTablet ? 148 : 120;
  const theme = EVENT.ticketTheme;
  const themeStyle = theme
    ? {
        "--t-ink": theme.ink,
        "--t-accent": theme.accent,
        "--t-accent-ink": theme.accentInk,
        "--t-bg": theme.bg,
      }
    : undefined;

  return (
    <article className="event-ticket" style={themeStyle}>
      <div className="event-ticket-card">
        {EVENT.flyer && (
          <a
            href={EVENT.flyer}
            target="_blank"
            rel="noopener noreferrer"
            className="event-ticket-flyer"
            aria-label={`View the ${EVENT.title} flyer`}
          >
            <img src={EVENT.flyer} alt={`${EVENT.title} flyer`} />
          </a>
        )}

        <header className="event-ticket-band">
          <div className="event-ticket-band-copy">
            <p className="event-ticket-band-kicker">
              {statusLine || EVENT.title}
            </p>
            <p className="event-ticket-band-title">You're checked in</p>
          </div>
          {!EVENT.flyer && <img src={t.eventLogo} alt="" className="event-ticket-band-logo" />}
        </header>

        <div className="event-ticket-pass">
          <div className="event-ticket-qr-col">
            <QRCodeSVG
              value={t.registrationId}
              size={qrSize}
              level="M"
              includeMargin={false}
              aria-label={`Ticket QR for ${t.registrationId}`}
            />
          </div>

          <div className="event-ticket-details">
            <div className="event-ticket-route">
              <div className="event-ticket-hub">
                <span className="event-ticket-code">{EVENT.codeFrom}</span>
                <span className="event-ticket-hub-sub">{t.city}</span>
              </div>
              <span className="event-ticket-route-icon" aria-hidden="true">
                <Ticket className="h-5 w-5" />
              </span>
              <div className="event-ticket-hub">
                <span className="event-ticket-code">{EVENT.codeTo}</span>
                <span className="event-ticket-hub-sub">{EVENT.codeToLabel || EVENT.dateLabel}</span>
              </div>
            </div>

            <div className="event-ticket-meta-row">
              <div className="event-ticket-meta-item">
                <span className="event-ticket-label">Date</span>
                <span className="event-ticket-value">{t.shortDate}</span>
              </div>
              <div className="event-ticket-meta-item">
                <span className="event-ticket-label">Time</span>
                <span className="event-ticket-value">{t.time}</span>
              </div>
            </div>

            <div className="event-ticket-meta-row">
              <div className="event-ticket-meta-item">
                <span className="event-ticket-label">Attendee</span>
                <span className="event-ticket-value event-ticket-value-name">{t.fullName}</span>
              </div>
              <div className="event-ticket-meta-item">
                <span className="event-ticket-label">Category</span>
                <span className="event-ticket-value">{t.category}</span>
              </div>
            </div>

            <div className="event-ticket-id-row">
              <span className="event-ticket-id">{t.registrationId}</span>
              <span className="event-ticket-region">{t.region}</span>
            </div>
          </div>
        </div>

        {showActions && (
          <div className="event-ticket-actions">
            {onDownload && (
              <button type="button" onClick={onDownload} className="event-ticket-btn event-ticket-btn-primary">
                <Download className="h-4 w-4" />
                Save ticket
              </button>
            )}
            {onPrint && (
              <button type="button" onClick={onPrint} className="event-ticket-btn event-ticket-btn-outline" title="Print 80mm × 80mm check-in badge">
                <Printer className="h-4 w-4" />
                Print badge (80×80)
              </button>
            )}
          </div>
        )}

        {showActions && onBadge && (
          <div className="event-ticket-badge-row">
            <button type="button" onClick={onBadge} className="event-ticket-btn event-ticket-btn-badge" title="Save 80mm × 80mm badge as PDF">
              <UserRound className="h-4 w-4" />
              Badge PDF (80×80)
            </button>
          </div>
        )}

        <footer className="event-ticket-foot">
          <span className="event-ticket-foot-label">Check-in powered by</span>
          <img src={t.brandLogo} alt={t.brandName} className="event-ticket-brand-logo" />
        </footer>
      </div>
    </article>
  );
}
