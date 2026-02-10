import React, { useState, useEffect } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
// Layout & UI
import Header from "./components/layout/header";
import Footer from "./components/layout/footer";
import Hero from "./components/ui/hero";
import Events from "./components/ui/events";
import Services from "./components/ui/services";
import SermonPreview from "./components/ui/sermonpreview";
import BookingCTA from "./components/ui/bookingcta";
import ContactSection from "./components/ui/contactsection";
// Modals
import PrayerModal from "./components/modals/prayermodal";
import VisitorModal from "./components/modals/visitormodal";
import JoinCommunityModal from "./components/modals/joincommunity";
// Pages
import About from "./pages/about";
import DistrictDetail from "./pages/districtdetail";
import Sermons from "./pages/sermons";
import WatchSermon from "./pages/watchsermon";
import LivePage from "./pages/live";
import Give from "./pages/give";
import Contact from "./pages/contact";
import Ministries from "./pages/ministries";
import MinistryDetail from "./pages/ministrydetail";
import EventsPage from "./pages/events";
import EventDetail from "./pages/eventdetail";
import Intimations from "./pages/intimations";
import IntimationPreview from "./pages/intimationpreview";
import Shop from "./pages/shop";
import Checkout from "./pages/checkout";
import SpaceBooking from "./pages/spacebooking";
import Opportunities from "./pages/opportunities";
import PrivacyPolicy from "./pages/privacypolicy";
import Terms from "./pages/terms";
import ICTMediaPage from "./pages/ictmedia";
// Admin
import AdminLayout from "./components/layout/adminlayout";
import AdminDashboard from "./pages/admin/dashboard";
import SermonsManager from "./pages/admin/sermons";
import EventsManager from "./pages/admin/events";
import RegistrationsManager from "./pages/admin/registrations";
import IntimationsManager from "./pages/admin/intimations";
import PrayersManager from "./pages/admin/prayers";
import VisitorsManager from "./pages/admin/visitors";
import JoinCommunityManager from "./pages/admin/joincommunity";
import AdminSettings from "./pages/admin/settings";
import HeroManager from "./pages/admin/heromanager";
import AboutManager from "./pages/admin/aboutmanager";
import LivestreamManager from "./pages/admin/livestreams";
import MinistriesManager from "./pages/admin/ministries";
import ProductsManager from "./pages/admin/products";
import OrdersManager from "./pages/admin/orders";
import SpaceBookingManager from "./pages/admin/spacebooking.js";
import RoomsManager from "./pages/admin/rooms";
import ContactFeedback from "./pages/admin/contactfeedback";
import ICTManager from "./pages/admin/ictmanager";
import ICTVolunteers from "./pages/admin/ictvolunteers";
// Auth
import ProtectedRoute from "./components/auth/protectedroute";
import AdminLogin from "./pages/admin/login";

function App() {
  const location = useLocation();
  const isAdminPath = location.pathname.startsWith("/admin");

  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem("theme");
    return saved
      ? saved === "dark"
      : window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  // Modal States
  const [isPrayerModalOpen, setIsPrayerModalOpen] = useState(false);
  const [isVisitorOpen, setIsVisitorOpen] = useState(false);
  const [visitorMode, setVisitorMode] = useState("New Visitor");
  const [isCommunityOpen, setIsCommunityOpen] = useState(false);
  const [communityMode, setCommunityMode] = useState("Community Join");

  useEffect(() => {
    const root = window.document.documentElement;
    if (darkMode) {
      root.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      root.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  }, [darkMode]);

  // Helpers to open Visitor Modal with specific context
  const openVisitorModal = () => {
    console.log("Opening Visitor Modal...");
    setVisitorMode("New Visitor");
    setIsVisitorOpen(true);
  };

  const openCommunityModal = () => {
    console.log("Opening Community Modal...");
    setCommunityMode("Community Join");
    setIsCommunityOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-[#0D1117] transition-colors duration-300">
      {!isAdminPath && (
        <Header
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          openPrayerModal={() => setIsPrayerModalOpen(true)}
        />
      )}

      <main className="flex-grow">
        <Routes>
          {/* Public Home Route */}
          <Route
            path="/"
            element={
              <>
                <Hero />
                <Services />
                <SermonPreview />
                <Events />
                <BookingCTA />
                <ContactSection
                  onOpenVisitor={openVisitorModal}
                  onOpenCommunity={openCommunityModal}
                />
              </>
            }
          />

          {/* Other Public Routes */}
          <Route path="/about" element={<About />} />
          <Route path="/about/district/:id" element={<DistrictDetail />} />
          <Route path="/sermons" element={<Sermons />} />
          <Route path="/sermons/:id" element={<WatchSermon />} />
          <Route path="/live" element={<LivePage />} />
          <Route path="/events" element={<EventsPage />} />
          <Route path="/events/:id" element={<EventDetail />} />
          <Route path="/ministries" element={<Ministries />} />
          <Route path="/ministries/:id" element={<MinistryDetail />} />
          <Route path="/intimations" element={<Intimations />} />
          <Route
            path="/intimations/preview/:id"
            element={<IntimationPreview />}
          />
          <Route path="/give" element={<Give />} />
          <Route path="/shop" element={<Shop />} />
          <Route path="/checkout" element={<Checkout />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/book-a-space" element={<SpaceBooking />} />
          <Route path="/opportunities" element={<Opportunities />} />
          <Route path="/privacy-policy" element={<PrivacyPolicy />} />
          <Route path="/terms-of-service" element={<Terms />} />
          <Route path="/ictmedia" element={<ICTMediaPage />} />

          {/* Admin Login Route */}
          <Route path="/admin-login" element={<AdminLogin />} />

          {/* Admin Nested Routes */}
          <Route
            path="/admin/*"
            element={
              <ProtectedRoute>
                <AdminLayout darkMode={darkMode} setDarkMode={setDarkMode}>
                  <Routes>
                    <Route path="dashboard" element={<AdminDashboard />} />
                    <Route path="sermons" element={<SermonsManager />} />
                    <Route path="events" element={<EventsManager />} />
                    <Route
                      path="registrations"
                      element={<RegistrationsManager />}
                    />
                    <Route
                      path="intimations"
                      element={<IntimationsManager />}
                    />
                    <Route path="prayers" element={<PrayersManager />} />
                    <Route path="visitors" element={<VisitorsManager />} />
                    <Route
                      path="join-community"
                      element={<JoinCommunityManager />}
                    />
                    <Route path="settings" element={<AdminSettings />} />
                    <Route path="hero-manager" element={<HeroManager />} />
                    <Route path="about-manager" element={<AboutManager />} />
                    <Route path="live-streams" element={<LivestreamManager />} />
                    <Route
                      path="ministries-manager"
                      element={<MinistriesManager />}
                    />
                    <Route path="products" element={<ProductsManager />} />
                    <Route path="orders" element={<OrdersManager />} />
                    <Route
                      path="space-bookings"
                      element={<SpaceBookingManager />}
                    />
                    <Route path="rooms" element={<RoomsManager />} />
                    <Route path="contact-feedback" element={<ContactFeedback />} />
                    <Route path="ict-manager" element={<ICTManager />} />
                    <Route path="ict-volunteers" element={<ICTVolunteers />} />
                  </Routes>
                </AdminLayout>
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>

      {!isAdminPath && <Footer />}

      {/* Persistent Modals */}
      <PrayerModal
        isOpen={isPrayerModalOpen}
        onClose={() => setIsPrayerModalOpen(false)}
      />
      <VisitorModal
        isOpen={isVisitorOpen}
        onClose={() => setIsVisitorOpen(false)}
        mode={visitorMode}
      />
      <JoinCommunityModal
        isOpen={isCommunityOpen}
        onClose={() => setIsCommunityOpen(false)}
        mode={communityMode}
      />
    </div>
  );
}

export default App;
