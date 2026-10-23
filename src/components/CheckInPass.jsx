import EventTicket from "./EventTicket";
import { EVENT } from "../data/checkin";
import { downloadNameBadgePdf } from "../lib/nameBadgePdf";
import { downloadTicketPdf, printTicket } from "../lib/ticketPdf";
import { runWithFeedback as run } from "../lib/alerts";

export default function CheckInPass({ registrationId, fullName, category, checkedInTime, attendee }) {
  const ticketData = attendee || { registrationId, fullName, category };

  if (!registrationId) return null;

  const statusLine = checkedInTime ? `Checked in at ${checkedInTime}` : `Fast Lane · ${EVENT.city}`;

  return (
    <div className="checkin-pass">
      <EventTicket
        attendee={ticketData}
        statusLine={statusLine}
        showActions
        onPrint={() => run(() => printTicket(ticketData), null, "Could not print ticket")}
        onDownload={() => run(() => downloadTicketPdf(ticketData), "Ticket saved", "Could not save ticket")}
        onBadge={() => run(() => downloadNameBadgePdf(ticketData), "Name badge saved", "Could not create badge")}
      />
    </div>
  );
}
