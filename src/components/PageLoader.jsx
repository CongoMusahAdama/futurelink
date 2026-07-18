import { useEffect, useState } from "react";
import { BRAND_NAME, LOGO_SRC } from "../lib/brand";

const MIN_VISIBLE_MS = 900;
const EXIT_MS = 500;

export default function PageLoader() {
  const [phase, setPhase] = useState("loading");

  useEffect(() => {
    document.body.classList.add("page-loading");

    const started = Date.now();

    const finish = () => {
      const elapsed = Date.now() - started;
      const wait = Math.max(0, MIN_VISIBLE_MS - elapsed);

      window.setTimeout(() => setPhase("exit"), wait);
      window.setTimeout(() => {
        setPhase("hidden");
        document.body.classList.remove("page-loading");
      }, wait + EXIT_MS);
    };

    if (document.readyState === "complete") {
      finish();
    } else {
      window.addEventListener("load", finish, { once: true });
    }

    return () => document.body.classList.remove("page-loading");
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={`page-loader page-loader--${phase}`}
      role="status"
      aria-live="polite"
      aria-label="Loading Future-Link Services"
    >
      <div className="page-loader-inner">
        <div className="page-loader-logo-wrap">
          <img src={LOGO_SRC} alt={BRAND_NAME} className="page-loader-logo" />
        </div>
        <p className="page-loader-tagline">Skills. Business. Opportunity.</p>
        <div className="page-loader-bar" aria-hidden="true">
          <span className="page-loader-bar-fill" />
        </div>
      </div>
    </div>
  );
}
