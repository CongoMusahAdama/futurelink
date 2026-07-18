import EventTicket from "./EventTicket";
import { downloadNameBadgePdf } from "../lib/nameBadgePdf";
import { downloadTicketPdf, printTicket } from "../lib/ticketPdf";

export default function CheckInPass({ registrationId, fullName, category, checkedInTime, attendee }) {
  const ticketData = attendee || { registrationId, fullName, category };

  if (!registrationId) return null;

  const statusLine = checkedInTime ? `Checked in at ${checkedInTime}` : "Fast Lane · Kumasi";

  return (
    <div className="checkin-pass">
      <EventTicket
        attendee={ticketData}
        statusLine={statusLine}
        showActions
        onPrint={() => printTicket(ticketData)}
        onDownload={() => downloadTicketPdf(ticketData)}
        onBadge={() => downloadNameBadgePdf(ticketData)}
      />
    </div>
  );
}
