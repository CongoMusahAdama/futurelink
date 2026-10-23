import EventTicket from "./EventTicket";
import { EVENT } from "../data/checkin";
import { downloadBadge80x80Pdf, downloadTicketPdf, printTicket } from "../lib/ticketPdf";
import { runWithFeedback as run } from "../lib/alerts";

export default function CheckInPass({ registrationId, fullName, category, organisation, checkedInTime, attendee }) {
  const ticketData = attendee || { registrationId, fullName, category, organisation };

  if (!registrationId) return null;

  const statusLine = checkedInTime ? `Checked in at ${checkedInTime}` : `Fast Lane · ${EVENT.city}`;

  return (
    <div className="checkin-pass">
      <EventTicket
        attendee={ticketData}
        statusLine={statusLine}
        showActions
        onPrint={() => run(() => printTicket(ticketData), null, "Could not print badge")}
        onDownload={() => run(() => downloadTicketPdf(ticketData), "Ticket saved", "Could not save ticket")}
        onBadge={() => run(() => downloadBadge80x80Pdf(ticketData), "80×80 badge saved", "Could not save badge")}
      />
    </div>
  );
}
