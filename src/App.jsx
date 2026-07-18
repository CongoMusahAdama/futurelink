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
import BlogPreview from "./components/BlogPreview";
import Contact from "./components/Contact";
import Footer from "./components/Footer";
import RegistrationPage from "./components/RegistrationPage";
import VenueTabletPage from "./pages/VenueTabletPage";
import LiveDashboardPage from "./pages/LiveDashboardPage";
import SignagePage from "./pages/SignagePage";
import AdminPage from "./pages/AdminPage";
import PageLoader from "./components/PageLoader";

import ServicesPage from "./pages/ServicesPage";
import EventsPage from "./pages/EventsPage";
import BlogPage from "./pages/BlogPage";
import BlogPostPage from "./pages/BlogPostPage";
import { services } from "./data/services";
import { events } from "./data/events";
import { blogPosts } from "./data/blog";

const serviceIds = new Set(services.map((service) => service.id));
const eventIds = new Set(events.map((event) => event.id));
const blogIds = new Set(blogPosts.map((post) => post.id));

function getOpsRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === "venue" || hash === "checkin") return "venue";
  if (hash === "dashboard") return "dashboard";
  if (hash === "signage") return "signage";
  if (hash === "admin") return "admin";
  return null;
}

function getPageRoute() {
  const hash = window.location.hash.replace(/^#/, "");
  if (hash === "services" || serviceIds.has(hash)) return "services";
  if (hash === "events" || eventIds.has(hash)) return "events";
  if (blogIds.has(hash)) return "blog-post";
  if (hash === "blog") return "blog";
  return null;
}

function AppContent() {
  const { activeEvent } = useRegistrationModal();
  const [opsRoute, setOpsRoute] = useState(getOpsRoute);
  const [pageRoute, setPageRoute] = useState(getPageRoute);

  useEffect(() => {
    const onHashChange = () => {
      setOpsRoute(getOpsRoute());
      setPageRoute(getPageRoute());
    };
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  useEffect(() => {
    const hash = window.location.hash.replace(/^#/, "");
    if (!hash) return;

    if (pageRoute) {
      const blogSections = new Set(["all-posts", "hub-topics"]);
      const isAnchor =
        hash !== pageRoute &&
        (serviceIds.has(hash) ||
          eventIds.has(hash) ||
          (pageRoute === "blog" && blogSections.has(hash)));

      if (isAnchor) {
        requestAnimationFrame(() => {
          document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
      } else if (hash === pageRoute || pageRoute === "blog-post") {
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
      return;
    }

    const homeSections = new Set([
      "impact",
      "about",
      "contact",
      "pricing",
      "categories",
      "how-it-works",
      "dashboard",
      "services-preview",
      "events-preview",
      "blog-preview",
    ]);

    if (homeSections.has(hash)) {
      requestAnimationFrame(() => {
        document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
      });
    }
  }, [pageRoute]);

  if (opsRoute === "venue") return <VenueTabletPage />;
  if (opsRoute === "dashboard") return <LiveDashboardPage />;
  if (opsRoute === "signage") return <SignagePage />;
  if (opsRoute === "admin") return <AdminPage />;
  if (activeEvent) return <RegistrationPage event={activeEvent} />;
  if (pageRoute === "services") return <ServicesPage />;
  if (pageRoute === "events") return <EventsPage />;
  if (pageRoute === "blog-post") {
    const postId = window.location.hash.replace(/^#/, "");
    return <BlogPostPage postId={postId} />;
  }
  if (pageRoute === "blog") return <BlogPage />;

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
        <BlogPreview />
        <Contact />
      </main>
      <Footer />
    </>
  );
}

export default function App() {
  return (
    <RegistrationProvider>
      <PageLoader />
      <AppContent />
    </RegistrationProvider>
  );
}
