import { Download, Printer, Ticket, UserRound } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import { getTicketFields } from "../lib/eventTicketMeta";
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

  return (
    <article className="event-ticket">
      <div className="event-ticket-card">
        <header className="event-ticket-band">
          <div className="event-ticket-band-copy">
            <p className="event-ticket-band-kicker">
              {statusLine || "Ghana Hubs Network · AGM 2026"}
            </p>
            <p className="event-ticket-band-title">You're checked in</p>
          </div>
          <img src={t.eventLogo} alt="" className="event-ticket-band-logo" />
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
                <span className="event-ticket-code">GHN</span>
                <span className="event-ticket-hub-sub">{t.city}</span>
              </div>
              <span className="event-ticket-route-icon" aria-hidden="true">
                <Ticket className="h-5 w-5" />
              </span>
              <div className="event-ticket-hub">
                <span className="event-ticket-code">AGM</span>
                <span className="event-ticket-hub-sub">2026</span>
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
              <button type="button" onClick={onPrint} className="event-ticket-btn event-ticket-btn-outline">
                <Printer className="h-4 w-4" />
                Print
              </button>
            )}
          </div>
        )}

        {showActions && onBadge && (
          <div className="event-ticket-badge-row">
            <button type="button" onClick={onBadge} className="event-ticket-btn event-ticket-btn-badge">
              <UserRound className="h-4 w-4" />
              Name badge (PDF)
            </button>
          </div>
        )}

        <footer className="event-ticket-foot">
          <img src={t.brandLogo} alt={t.brandName} className="event-ticket-brand-logo" />
        </footer>
      </div>
    </article>
  );
}
