import { useEffect, useMemo, useState } from "react";
import { Link2, MessageSquareText, Send } from "lucide-react";
import { EVENT } from "../data/checkin";
import { api } from "../lib/api";
import { getOpsEmail } from "../lib/opsAuth";
import { alertError, alertSuccess, confirmAction } from "../lib/alerts";

const DEFAULT_MESSAGE = `Thank you for attending ${EVENT.title}! View and download the event photos here: {link}`;

/** GSM SMS parts: 160 characters for one message, 153 per part after that. */
function smsParts(length) {
  if (length === 0) return 0;
  return length <= 160 ? 1 : Math.ceil(length / 153);
}

function escapeHtml(str) {
  return String(str || "").replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

/** Dashboard tool to text every registered attendee, e.g. a Google Drive photo link after the event. */
export default function BulkSmsPanel() {
  const [status, setStatus] = useState(null);
  const [message, setMessage] = useState(DEFAULT_MESSAGE);
  const [link, setLink] = useState("");
  const [audience, setAudience] = useState("all");
  const [email, setEmail] = useState(() => getOpsEmail() || "");
  const [password, setPassword] = useState("");
  const [sending, setSending] = useState(false);

  const loadStatus = () => api.smsStatus().then(setStatus).catch(() => setStatus(null));
  useEffect(() => {
    loadStatus();
  }, []);

  // Final text: {link} is replaced by the link; if there is no placeholder the link is added at the end.
  const finalText = useMemo(() => {
    const url = link.trim();
    if (message.includes("{link}")) return message.replace(/\{link\}/g, url).trim();
    return url ? `${message.trim()} ${url}` : message.trim();
  }, [message, link]);

  const recipients = status?.recipients?.[audience] ?? 0;
  const parts = smsParts(finalText.length);
  const needsLink = message.includes("{link}") && !link.trim();

  const handleSend = async (e) => {
    e.preventDefault();
    if (needsLink) {
      alertError("Add the link", "Paste the photo link (e.g. your Google Drive folder) or remove {link} from the message.");
      return;
    }
    const ok = await confirmAction(
      `Send to ${recipients} ${recipients === 1 ? "person" : "people"}?`,
      `<p style="text-align:left;white-space:pre-wrap;background:#f8fafc;border-radius:12px;padding:12px;font-size:14px">${escapeHtml(finalText)}</p>
       <p style="margin-top:10px;font-size:13px;color:#64748b">${parts} SMS part${parts === 1 ? "" : "s"} each · about ${recipients * parts} credits</p>`,
      "Send SMS"
    );
    if (!ok) return;

    setSending(true);
    try {
      const result = await api.sendBulkSms({ email, password, message: finalText, audience });
      alertSuccess(
        "SMS sent",
        `${result.sent} of ${result.total} sent${result.failed ? ` · ${result.failed} failed` : ""}.`
      );
      setPassword("");
      loadStatus();
    } catch (err) {
      alertError("Could not send SMS", err.message);
    } finally {
      setSending(false);
    }
  };

  return (
    <form onSubmit={handleSend} className="rounded-2xl bg-white ring-1 ring-slate-200/80">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 px-5 py-4">
        <div className="flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-brand-blue">
            <MessageSquareText className="h-5 w-5" />
          </span>
          <div>
            <h2 className="font-semibold text-navy">Send SMS to attendees</h2>
            <p className="text-xs text-slate-500">Share event photos or a thank-you message with everyone who registered</p>
          </div>
        </div>
        {status && (
          <span
            className={`rounded-full px-3 py-1 text-xs font-semibold ring-1 ${
              status.configured
                ? "bg-green-50 text-green-700 ring-green-100"
                : "bg-amber-50 text-amber-700 ring-amber-100"
            }`}
          >
            {status.configured
              ? `Sender “${status.sender}”${status.balance != null ? ` · ${status.balance} credits` : ""}`
              : "SMS not set up yet"}
          </span>
        )}
      </div>

      <div className="grid gap-5 p-5 lg:grid-cols-[minmax(0,1fr)_18rem]">
        <div className="space-y-4">
          <div>
            <label htmlFor="sms-link" className="mb-1.5 block text-sm font-semibold text-navy">
              Photo link
            </label>
            <div className="relative">
              <Link2 className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                id="sms-link"
                type="url"
                inputMode="url"
                value={link}
                onChange={(e) => setLink(e.target.value)}
                placeholder="https://drive.google.com/drive/folders/…"
                className="w-full rounded-xl border border-slate-200 py-2.5 pl-10 pr-3 text-sm text-navy outline-none focus:border-brand-blue"
              />
            </div>
            <p className="mt-1 text-xs text-slate-400">
              In Google Drive, set the folder to “Anyone with the link can view”, then copy the link here.
            </p>
          </div>

          <div>
            <label htmlFor="sms-message" className="mb-1.5 block text-sm font-semibold text-navy">
              Message <span className="font-normal text-slate-400">— {"{link}"} is replaced by the link</span>
            </label>
            <textarea
              id="sms-message"
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-navy outline-none focus:border-brand-blue"
            />
            <p className="mt-1 text-xs text-slate-500">
              {finalText.length} characters · {parts} SMS part{parts === 1 ? "" : "s"} per person
            </p>
          </div>

          <div className="rounded-xl bg-slate-50 px-4 py-3 text-sm text-slate-700">
            <p className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-400">Preview</p>
            <p className="whitespace-pre-wrap break-words">{finalText || "—"}</p>
          </div>
        </div>

        <div className="space-y-4">
          <div>
            <label htmlFor="sms-audience" className="mb-1.5 block text-sm font-semibold text-navy">
              Send to
            </label>
            <select
              id="sms-audience"
              value={audience}
              onChange={(e) => setAudience(e.target.value)}
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-navy outline-none focus:border-brand-blue"
            >
              <option value="all">Everyone registered ({status?.recipients?.all ?? "…"})</option>
              <option value="checked-in">Checked in only ({status?.recipients?.["checked-in"] ?? "…"})</option>
            </select>
          </div>

          <div>
            <label htmlFor="sms-email" className="mb-1.5 block text-sm font-semibold text-navy">
              Confirm with your login
            </label>
            <input
              id="sms-email"
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email"
              className="mb-2 w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-navy outline-none focus:border-brand-blue"
            />
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              required
              className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm text-navy outline-none focus:border-brand-blue"
            />
          </div>

          <button
            type="submit"
            disabled={sending || !finalText || recipients === 0 || !password}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-bold text-navy transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
            {sending ? "Sending…" : `Send to ${recipients} ${recipients === 1 ? "person" : "people"}`}
          </button>
          <p className="text-xs text-slate-400">
            One SMS per phone number — duplicates are skipped. Each person receives {parts || 1} SMS part
            {parts === 1 ? "" : "s"}.
          </p>
        </div>
      </div>
    </form>
  );
}
