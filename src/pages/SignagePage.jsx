import { Download, FileImage, IdCard, Printer, QrCode } from "lucide-react";
import { QRCodeSVG } from "qrcode.react";
import OpsShell from "../components/OpsShell";
import NameBadgePreviewGrid from "../components/NameBadgePreview";
import { downloadLanyardStrapPdf, downloadRoleBadgeTemplatesPdf } from "../lib/nameBadgePdf";
import { downloadSignagePackPdf, SIGNS } from "../lib/signagePdf";
import { EVENT } from "../data/checkin";
import { SELF_CHECKIN_URL } from "../lib/brand";
import { downloadSelfCheckInPosterPdf } from "../lib/selfCheckInPoster";
import { runWithFeedback } from "../lib/alerts";

export default function SignagePage() {
  return (
    <OpsShell
      active="signage"
      title="Event Signage & Badges"
      subtitle={`Print-ready desk signs, lanyard badges & strap patterns · ${EVENT.title}`}
    >
      <div className="mb-8 rounded-2xl bg-navy p-6 text-white ring-1 ring-white/10">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <IdCard className="h-5 w-5 text-brand-blue" />
              <h2 className="text-lg font-bold">Name badge pack · 3.5″ × 5.5″ vertical</h2>
            </div>
            <p className="mt-2 max-w-xl text-sm text-white/70">
              Lanyard badge with org logo pill, event title, theme box, role pill (mint accent),
              contact & footer. Includes 0.125″ bleed and crop marks.
            </p>
            <p className="mt-2 text-xs text-white/50">
              9 roles · color-coded pills · 3.5″ × 5.5″ print-ready
            </p>
          </div>
          <div className="flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={downloadRoleBadgeTemplatesPdf}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-bold text-navy sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Role templates (PDF)
            </button>
            <button
              type="button"
              onClick={downloadLanyardStrapPdf}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-white/10 px-5 py-3 text-sm font-bold text-white ring-1 ring-white/20 sm:w-auto"
            >
              <Download className="h-4 w-4" />
              Lanyard pattern
            </button>
          </div>
        </div>

        <div className="mt-6 overflow-hidden rounded-xl bg-white shadow-sm">
          <div className="h-1.5 bg-brand-blue" />
          <div className="lanyard-pattern-preview px-4 py-3">
            <span>{EVENT.lanyardPhrases[0]}</span>
            <span className="lanyard-pattern-dot" aria-hidden />
            <span>{EVENT.lanyardPhrases[1]}</span>
            <span className="lanyard-pattern-dot" aria-hidden />
            <span>{EVENT.lanyardPhrases[2]}</span>
            <span className="lanyard-pattern-dot" aria-hidden />
            <span>{EVENT.lanyardPhrases[0]}</span>
            <span className="lanyard-pattern-dot" aria-hidden />
            <span>{EVENT.lanyardPhrases[1]}</span>
            <span className="lanyard-pattern-dot" aria-hidden />
            <span>{EVENT.lanyardPhrases[2]}</span>
          </div>
          <div className="h-1.5 bg-brand-blue" />
        </div>
        <p className="mt-2 text-xs text-white/50">
          Lanyard strap preview — mint rails, navy type, repeating tile for 36″ strap print
        </p>

        <div className="mt-4 flex flex-wrap gap-3 text-xs">
          <a
            href="/templates/name-badge-template.svg"
            download
            className="rounded-lg bg-white/10 px-3 py-2 text-white/90 ring-1 ring-white/15 hover:bg-white/15"
          >
            Download SVG source (badge)
          </a>
          <a
            href="/templates/lanyard-strap.svg"
            download
            className="rounded-lg bg-white/10 px-3 py-2 text-white/90 ring-1 ring-white/15 hover:bg-white/15"
          >
            Download SVG source (lanyard)
          </a>
        </div>
      </div>

      <section className="mb-8">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
          <div>
            <h2 className="text-lg font-bold text-navy">Role badge previews</h2>
            <p className="mt-1 text-sm text-slate-500">
              Each role has a distinct pill color — download the PDF pack to print all templates.
            </p>
          </div>
        </div>
        <NameBadgePreviewGrid />
      </section>

      <div className="mb-6 flex flex-wrap items-center gap-6 rounded-2xl bg-white p-6 ring-1 ring-slate-200/80">
        <QRCodeSVG value={SELF_CHECKIN_URL} size={132} level="H" className="shrink-0 rounded-lg" />
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <QrCode className="h-5 w-5 text-brand-blue" />
            <h2 className="text-lg font-bold text-navy">Self check-in QR poster</h2>
          </div>
          <p className="mt-1 text-sm text-slate-500">
            Attendees scan this with their phone camera to check themselves in — no app or login needed.
          </p>
          <a href={SELF_CHECKIN_URL} target="_blank" rel="noopener noreferrer" className="mt-2 inline-block break-all text-sm font-semibold text-brand-blue underline">
            {SELF_CHECKIN_URL}
          </a>
        </div>
        <button
          type="button"
          onClick={() => runWithFeedback(downloadSelfCheckInPosterPdf, "Poster downloaded", "Could not create poster")}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-bold text-navy transition-opacity hover:opacity-90"
        >
          <Download className="h-4 w-4" />
          A4 QR poster (PDF)
        </button>
      </div>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl bg-white p-6 ring-1 ring-slate-200/80">
        <div>
          <h2 className="text-lg font-bold">Registration signage pack</h2>
          <p className="mt-1 text-sm text-white/70">
            {SIGNS.length} A4 landscape signs — Future-Link × {EVENT.host} branded
          </p>
        </div>
        <button
          type="button"
          onClick={downloadSignagePackPdf}
          className="inline-flex items-center gap-2 rounded-xl bg-brand-blue px-5 py-3 text-sm font-bold text-navy transition-opacity hover:opacity-90"
        >
          <Download className="h-4 w-4" />
          Download all signs (PDF)
        </button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {SIGNS.map((sign) => (
          <article
            key={sign.title}
            className="overflow-hidden rounded-2xl bg-white ring-1 ring-slate-200/80"
          >
            <div className="bg-navy px-4 py-6 text-center text-white">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand-blue text-sm font-bold text-navy">
                {sign.num}
              </span>
              <h3 className="mt-3 text-lg font-bold tracking-wide">{sign.title}</h3>
              <p className="mt-1 text-sm text-white/75">{sign.subtitle}</p>
            </div>
            <div className="px-4 py-3">
              <p className="text-sm text-slate-500">{sign.hint}</p>
            </div>
          </article>
        ))}
      </div>

      <div className="mt-8 rounded-2xl border border-blue-100 bg-blue-50 p-5">
        <div className="flex items-start gap-3">
          <Printer className="mt-0.5 h-5 w-5 shrink-0 text-brand-blue" />
          <div>
            <h3 className="font-semibold text-navy">Printing tips</h3>
            <ul className="mt-2 space-y-1 text-sm text-slate-600">
              <li>Badges: 3.5″ × 5.5″ card stock, punch slot at top, 0.125″ bleed</li>
              <li>Desk signs: A4 landscape at 100% scale</li>
              <li>Laminate badges and signs for durability</li>
              <li>Edit phone/email in <code className="text-xs">src/lib/badgeMeta.js</code> before printing</li>
            </ul>
          </div>
        </div>
        <p className="mt-4 flex items-center gap-2 text-xs text-slate-500">
          <FileImage className="h-3.5 w-3.5" />
          For roll-up banners and backdrops, send `public/events/TRANS.png` to your print vendor.
        </p>
      </div>
    </OpsShell>
  );
}
