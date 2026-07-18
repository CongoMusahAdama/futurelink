import { useEffect, useRef, useState } from "react";
import { Camera, Keyboard, ScanLine } from "lucide-react";
import { Html5Qrcode } from "html5-qrcode";
import { useTabletLayout } from "../hooks/useTabletLayout";

const SCANNER_ID = "fast-lane-qr-scanner";

function normalizeScannedCode(raw) {
  const text = String(raw || "").trim().toUpperCase();
  const match = text.match(/GH-\d{3,}/);
  return match ? match[0] : text;
}

export default function QrScanner({ onScan, onManual }) {
  const [error, setError] = useState("");
  const [ready, setReady] = useState(false);
  const scannerRef = useRef(null);
  const handledRef = useRef(false);
  const isTablet = useTabletLayout();
  const qrbox = isTablet ? 280 : 220;

  useEffect(() => {
    handledRef.current = false;
    setReady(false);
    setError("");
    const scanner = new Html5Qrcode(SCANNER_ID);
    scannerRef.current = scanner;

    scanner
      .start(
        { facingMode: "environment" },
        { fps: 12, qrbox: { width: qrbox, height: qrbox } },
        (decoded) => {
          if (handledRef.current) return;
          handledRef.current = true;
          onScan(normalizeScannedCode(decoded));
        },
        () => {}
      )
      .then(() => setReady(true))
      .catch((err) => {
        setError(err?.message || "Camera unavailable — use manual entry");
      });

    return () => {
      setReady(false);
      const instance = scannerRef.current;
      scannerRef.current = null;
      if (instance?.isScanning) {
        instance.stop().catch(() => {});
      }
    };
  }, [onScan, qrbox]);

  return (
    <div className="venue-scanner">
      <div className="venue-scanner-frame">
        <div id={SCANNER_ID} className="qr-scanner-view venue-scanner-viewport" />

        {!ready && !error && (
          <div className="venue-scanner-overlay venue-scanner-loading">
            <div className="venue-scanner-spinner" aria-hidden />
            <p>Starting camera…</p>
          </div>
        )}

        {ready && (
          <div className="venue-scanner-overlay venue-scanner-viewfinder" aria-hidden>
            <span className="venue-scanner-corner venue-scanner-corner-tl" />
            <span className="venue-scanner-corner venue-scanner-corner-tr" />
            <span className="venue-scanner-corner venue-scanner-corner-bl" />
            <span className="venue-scanner-corner venue-scanner-corner-br" />
            <span className="venue-scanner-scanline" />
          </div>
        )}

        {error && (
          <div className="venue-scanner-overlay venue-scanner-fallback">
            <ScanLine className="venue-scanner-fallback-icon" strokeWidth={1.5} />
            <p className="venue-scanner-fallback-title">Camera not available</p>
            <p className="venue-scanner-fallback-text">Use manual entry or allow camera access</p>
          </div>
        )}
      </div>

      {error && <p className="venue-scanner-error">{error}</p>}

      <div className="venue-scanner-tips">
        <p className="venue-scanner-hint">
          {ready ? "Align the QR code inside the frame" : "Point camera at attendee ticket or pass"}
        </p>
        <div className="venue-scanner-tip-chips">
          <span className="venue-scanner-chip">Ticket QR</span>
          <span className="venue-scanner-chip">Digital pass</span>
          <span className="venue-scanner-chip">GH- ID</span>
        </div>
      </div>

      <button type="button" onClick={onManual} className="venue-scanner-manual venue-touch-btn">
        <Keyboard className="h-5 w-5" />
        Enter ID manually
      </button>
    </div>
  );
}

export function FastLaneModeToggle({ mode, onChange }) {
  return (
    <div className="venue-mode-toggle" role="tablist" aria-label="Check-in mode">
      <button
        type="button"
        role="tab"
        aria-selected={mode === "scan"}
        onClick={() => onChange("scan")}
        className={`venue-mode-tab venue-touch-btn${mode === "scan" ? " venue-mode-tab-active" : ""}`}
      >
        <Camera className="h-5 w-5" />
        Scan QR
      </button>
      <button
        type="button"
        role="tab"
        aria-selected={mode === "manual"}
        onClick={() => onChange("manual")}
        className={`venue-mode-tab venue-touch-btn${mode === "manual" ? " venue-mode-tab-active" : ""}`}
      >
        <Keyboard className="h-5 w-5" />
        Manual
      </button>
    </div>
  );
}

export function FastLaneManualEntry({ lookupId, onChange, onSubmit, loading, onScanMode }) {
  return (
    <form onSubmit={onSubmit} className="venue-manual-form">
      <div className="venue-manual-shell">
        <p className="venue-manual-label">Registration ID</p>
        <div className="venue-manual-input-row">
          <span className="venue-manual-prefix">GH-</span>
          <input
            value={lookupId.replace(/^GH-/i, "")}
            onChange={(e) => onChange(`GH-${e.target.value.replace(/[^0-9]/g, "").slice(0, 4)}`)}
            placeholder="001"
            className="venue-manual-input"
            autoComplete="off"
            autoFocus
            inputMode="numeric"
            aria-label="Registration ID number"
          />
        </div>
        <p className="venue-manual-hint">Enter the ID from the attendee ticket (e.g. GH-001)</p>
      </div>

      <button type="submit" disabled={loading || lookupId.length < 6} className="venue-btn-primary venue-btn-fastlane w-full">
        {loading ? "Checking in…" : "Check in attendee"}
      </button>

      <button type="button" onClick={onScanMode} className="venue-manual-back venue-touch-btn">
        <Camera className="h-4 w-4" />
        Back to QR scan
      </button>
    </form>
  );
}
