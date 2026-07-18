import { useEffect, useRef, useState } from "react";
import { Headphones, Mail, MessageCircle, Phone, X } from "lucide-react";
import { CONTACT_EMAIL, CONTACT_PHONES } from "../lib/brand";

function toInternational(phone) {
  return `233${phone.replace(/\D/g, "").replace(/^0/, "")}`;
}

function formatPhone(phone) {
  return phone.replace(/(\d{3})(\d{3})(\d{4})/, "$1 $2 $3");
}

export default function SupportWidget() {
  const [open, setOpen] = useState(false);
  const panelRef = useRef(null);

  const primaryPhone = CONTACT_PHONES[0];

  useEffect(() => {
    if (!open) return undefined;

    const onKey = (event) => {
      if (event.key === "Escape") setOpen(false);
    };
    const onClick = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onClick);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  return (
    <div className="support-widget" ref={panelRef}>
      {open && (
        <div className="support-panel" role="dialog" aria-label="Contact support">
          <div className="support-panel-header">
            <div>
              <p className="support-panel-title">Need a hand?</p>
              <p className="support-panel-subtitle">
                We usually reply within a few minutes.
              </p>
            </div>
            <button
              type="button"
              className="support-panel-close"
              onClick={() => setOpen(false)}
              aria-label="Close support"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="support-options">
            <a
              href={`https://wa.me/${toInternational(primaryPhone)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="support-option"
            >
              <span className="support-option-icon support-option-icon--whatsapp">
                <MessageCircle className="h-5 w-5" />
              </span>
              <span className="support-option-text">
                <span className="support-option-label">Chat on WhatsApp</span>
                <span className="support-option-meta">{formatPhone(primaryPhone)}</span>
              </span>
            </a>

            <a href={`tel:+${toInternational(primaryPhone)}`} className="support-option">
              <span className="support-option-icon support-option-icon--call">
                <Phone className="h-5 w-5" />
              </span>
              <span className="support-option-text">
                <span className="support-option-label">Call us</span>
                <span className="support-option-meta">{formatPhone(primaryPhone)}</span>
              </span>
            </a>

            <a href={`mailto:${CONTACT_EMAIL}`} className="support-option">
              <span className="support-option-icon support-option-icon--email">
                <Mail className="h-5 w-5" />
              </span>
              <span className="support-option-text">
                <span className="support-option-label">Email us</span>
                <span className="support-option-meta">{CONTACT_EMAIL}</span>
              </span>
            </a>
          </div>
        </div>
      )}

      <button
        type="button"
        className={`support-fab ${open ? "support-fab--open" : ""}`}
        onClick={() => setOpen((value) => !value)}
        aria-expanded={open}
        aria-label={open ? "Close support" : "Contact support"}
      >
        {open ? <X className="h-6 w-6" /> : <Headphones className="h-6 w-6" />}
        {!open && <span className="support-fab-label">Support</span>}
      </button>
    </div>
  );
}
