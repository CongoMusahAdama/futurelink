import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { events, ghanaHubsEvent } from "../data/events";

const RegistrationContext = createContext(null);

function getEventFromHash() {
  const match = window.location.hash.match(/^#register\/([^/?]+)/);
  if (!match) return null;
  return events.find((event) => event.id === match[1]) ?? ghanaHubsEvent;
}

export function RegistrationProvider({ children }) {
  const [activeEvent, setActiveEvent] = useState(getEventFromHash);

  useEffect(() => {
    const onHashChange = () => setActiveEvent(getEventFromHash());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  const openRegistration = useCallback((selectedEvent = ghanaHubsEvent) => {
    window.location.hash = `#register/${selectedEvent.id}`;
    setActiveEvent(selectedEvent);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  const closeRegistration = useCallback(() => {
    if (window.location.hash.startsWith("#register")) {
      window.history.pushState(null, "", window.location.pathname + window.location.search);
    }
    setActiveEvent(null);
  }, []);

  const value = useMemo(
    () => ({
      openRegistration,
      closeRegistration,
      activeEvent,
      isRegistrationPage: Boolean(activeEvent),
    }),
    [openRegistration, closeRegistration, activeEvent]
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
