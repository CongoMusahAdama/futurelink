import { useEffect, useState } from "react";
import { RegistrationProvider, useRegistrationModal } from "./context/RegistrationModalContext";
import Header from "./components/Header";
import Hero from "./components/Hero";
import Categories from "./components/Categories";
import FeaturedEvents from "./components/FeaturedEvents";
import Services from "./components/Services";
import HowItWorks from "./components/HowItWorks";
import DashboardPreview from "./components/DashboardPreview";
import Pricing from "./components/Pricing";
import About from "./components/About";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import RegistrationPage from "./components/RegistrationPage";
import VenueTabletPage from "./pages/VenueTabletPage";
import LiveDashboardPage from "./pages/LiveDashboardPage";
import TvDashboardPage from "./pages/TvDashboardPage";
import SignagePage from "./pages/SignagePage";
import AdminPage from "./pages/AdminPage";

function getOpsRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === "venue" || hash === "checkin") return "venue";
  if (hash === "dashboard") return "dashboard";
  if (hash === "dashboard-tv" || hash === "tv") return "tv";
  if (hash === "signage") return "signage";
  if (hash === "admin") return "admin";
  return null;
}

function AppContent() {
  const { activeEvent } = useRegistrationModal();
  const [opsRoute, setOpsRoute] = useState(getOpsRoute);

  useEffect(() => {
    const onHashChange = () => setOpsRoute(getOpsRoute());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  if (opsRoute === "venue") return <VenueTabletPage />;
  if (opsRoute === "dashboard") return <LiveDashboardPage />;
  if (opsRoute === "tv") return <TvDashboardPage />;
  if (opsRoute === "signage") return <SignagePage />;
  if (opsRoute === "admin") return <AdminPage />;
  if (activeEvent) return <RegistrationPage event={activeEvent} />;

  return (
    <>
      <Header />
      <main>
        <Hero />
        <Categories />
        <FeaturedEvents />
        <Services />
        <HowItWorks />
        <DashboardPreview />
        <Pricing />
        <About />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <RegistrationProvider>
      <AppContent />
    </RegistrationProvider>
  );
}
