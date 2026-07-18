import { BADGE_ORG, BADGE_ROLES, getRoleColors } from "../lib/badgeMeta";

function cssRgb([r, g, b]) {
  return `rgb(${r}, ${g}, ${b})`;
}

export function NameBadgeFace({ role = "Guest", name = "Attendee Name", compact = false }) {
  const colors = getRoleColors(role);
  const pillBg = cssRgb(colors.fill);
  const pillText = cssRgb(colors.text);

  return (
    <div className={`badge-face${compact ? " badge-face-compact" : ""}`}>
      <div className="badge-face-accent" />
      <div className="badge-face-punch" aria-hidden />

      <div className="badge-face-org">
        <img src={BADGE_ORG.orgLogo} alt="" className="badge-face-logo" />
        <div className="badge-face-org-text">
          <p className="badge-face-org-name">{BADGE_ORG.organizationName}</p>
          <p className="badge-face-powered">Powered by {BADGE_ORG.brandName}</p>
        </div>
      </div>

      <h3 className="badge-face-event">{BADGE_ORG.eventTitle}</h3>
      <p className="badge-face-subtitle">{BADGE_ORG.eventSubtitle}</p>

      <p className="badge-face-theme-label">{BADGE_ORG.themeLabel}</p>
      <div className="badge-face-theme-box">
        &ldquo;{BADGE_ORG.themeQuote.toUpperCase()}&rdquo;
      </div>

      <p className="badge-face-name">{name.toUpperCase()}</p>

      <div className="badge-face-role" style={{ background: pillBg, color: pillText }}>
        {role.toUpperCase()}
      </div>

      <p className="badge-face-contact">Contact: {BADGE_ORG.phones}</p>

      <div className="badge-face-footer">
        <span>{BADGE_ORG.website}</span>
        <span className="badge-face-footer-dot">·</span>
        <span>{BADGE_ORG.email}</span>
      </div>
    </div>
  );
}

export default function NameBadgePreviewGrid() {
  return (
    <div className="badge-preview-grid">
      {BADGE_ROLES.map((role) => (
        <article key={role} className="badge-preview-card">
          <NameBadgeFace role={role} />
          <p className="badge-preview-label">{role}</p>
        </article>
      ))}
    </div>
  );
}
