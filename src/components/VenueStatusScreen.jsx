import { AlertCircle, CheckCircle2 } from "lucide-react";
import EventLogo from "./EventLogo";
import EventTicket from "./EventTicket";
import { downloadNameBadgePdf } from "../lib/nameBadgePdf";
import { downloadTicketPdf, printTicket } from "../lib/ticketPdf";

export function AlreadyCheckedInScreen({ attendee, onNext }) {
  return (
    <div className="venue-screen venue-success-screen">
      <div className="venue-home-banner py-4">
        <div className="venue-wrap-wide flex justify-center">
          <EventLogo variant="light" size="md" />
        </div>
      </div>
      <div className="venue-wrap flex flex-1 flex-col justify-center px-4 py-6">
        <div className="mx-auto mb-4 flex items-center gap-2 text-center">
          <span className="venue-status-icon venue-status-icon-warn inline-flex h-10 w-10 shrink-0">
            <CheckCircle2 className="h-5 w-5" />
          </span>
          <div className="text-left">
            <h2 className="text-lg font-bold text-navy">Already checked in</h2>
            <p className="text-sm text-slate-500">Ticket is still valid for re-entry</p>
          </div>
        </div>

        <EventTicket
          attendee={attendee}
          statusLine="Already checked in"
          showActions
          onPrint={() => printTicket(attendee)}
          onDownload={() => downloadTicketPdf(attendee)}
          onBadge={() => downloadNameBadgePdf(attendee)}
        />

        <button type="button" onClick={onNext} className="venue-btn-primary venue-btn-hero mx-auto mt-8 w-full max-w-lg">
          Next attendee
        </button>
      </div>
    </div>
  );
}

export function CheckInErrorScreen({ message, hint, onRetry }) {
  return (
    <div className="venue-screen venue-success-screen">
      <div className="venue-wrap flex flex-1 flex-col justify-center px-4 py-8">
        <div className="venue-status-card mx-auto w-full max-w-md text-center">
          <span className="venue-status-icon venue-status-icon-error">
            <AlertCircle className="h-8 w-8" />
          </span>
          <h2 className="mt-5 text-2xl font-bold text-navy">Check-in issue</h2>
          <p className="mt-3 text-slate-600">{message}</p>
          {hint && <p className="mt-2 text-sm text-slate-500">{hint}</p>}
          <button type="button" onClick={onRetry} className="venue-btn-primary mt-8 w-full">
            Try again
          </button>
        </div>
      </div>
    </div>
  );
}
