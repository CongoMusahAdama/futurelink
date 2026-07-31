import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";

const RegistrationContext = createContext(null);
const ORGANIZER_HASH = "register-event";

function isOrganizerHash() {
  return window.location.hash.replace(/^#/, "") === ORGANIZER_HASH;
}

export function RegistrationProvider({ children }) {
  const [isOrganizerForm, setIsOrganizerForm] = useState(isOrganizerHash);

  useEffect(() => {
    const onHashChange = () => setIsOrganizerForm(isOrganizerHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  /** Opens the public form for organizers to list their event on the platform. */
  const openRegistration = useCallback(() => {
    window.location.hash = ORGANIZER_HASH;
    setIsOrganizerForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const closeRegistration = useCallback(() => {
    if (isOrganizerHash()) {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    }
    setIsOrganizerForm(false);
  }, []);

  const value = useMemo(
    () => ({
      openRegistration,
      closeRegistration,
      isRegistrationPage: isOrganizerForm,
      /** @deprecated Attendee sign-up is via each event's registrationUrl */
      activeEvent: null,
    }),
    [openRegistration, closeRegistration, isOrganizerForm]
  );

  return (
    <RegistrationContext.Provider value={value}>{children}</RegistrationContext.Provider>
  );
}

export function useRegistrationModal() {
  const context = useContext(RegistrationContext);
  if (!context) {
    throw new Error("useRegistrationModal must be used within RegistrationProvider");
  }
  return context;
}
