import { Ticket } from "lucide-react";

export default function TicketButton({ onClick, children }) {
  return (
    <button type="button" onClick={onClick} className="ticket-btn group">
      <span className="ticket-notch ticket-notch-tl" aria-hidden="true" />
      <span className="ticket-notch ticket-notch-tr" aria-hidden="true" />
      <span className="ticket-notch ticket-notch-bl" aria-hidden="true" />
      <span className="ticket-notch ticket-notch-br" aria-hidden="true" />

      <span className="ticket-btn-stub ticket-btn-stub-left" aria-hidden="true">
        <span className="ticket-serial">072126</span>
      </span>

      <span className="ticket-btn-main">
        <Ticket className="h-4 w-4 shrink-0 opacity-80" strokeWidth={2.25} />
        <span>{children}</span>
      </span>

      <span className="ticket-btn-stub ticket-btn-stub-right" aria-hidden="true">
        <span className="ticket-serial">072126</span>
      </span>
    </button>
  );
}
