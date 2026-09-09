// src/App.jsx
import React, { useEffect, Suspense, lazy } from "react";
import { Route, Navigate, useLocation } from "react-router-dom";
import { useAppLoader } from "./context/AppLoaderContext";
import {
  LOADER_HOLD_MS,
  LOADER_EXIT_MS,
  LOADER_TOTAL_MS,
} from "./constants/appLoader";
import { isKnownSpaRoute } from "../spaRouteAllowlist.js";

import Navbar from "./components/HomeComponent/Navbar";
import Footer from "./components/HomeComponent/Footer";
import CookieBanner from "./components/CookieBanner";
import { AnalyticsPageViews } from "./context/CookieConsentContext";
import { AnimatedRoutes } from "./components/AnimatedRoutes";
import NotFoundPage from "./Pages/NotFoundPage";

// Home is imported eagerly so the first paint after the splash does not wait on a lazy chunk (hero is above the fold)
import HomePage from "./Render_Pages/HomePage";
// Route-based code splitting: load other pages only when their route is visited
const ServiceDetail = lazy(() => import("./Render_Pages/service-detail"));
const Contact = lazy(() => import("./components/ServicesComponent/contact"));
const InsightPage = lazy(() => import("./Pages/InsightPage"));
const CommunityPage = lazy(() => import("./Pages/CommunitPage"));
const DeveloperTeam = lazy(() => import("./Pages/DeveloperTeam"));
const ContactUsPage = lazy(() => import("./Pages/ContactUsPage"));
const AboutCache = lazy(() => import("./Pages/AboutPage"));
const InnovationsPage = lazy(() => import("./Pages/InnovationsPage"));
const InnovationsProjectPage = lazy(() => import("./Pages/InnovationsProjectPage"));
const Profile = lazy(() => import("./components/AboutPageComponent/profile"));
const AwardsAndCertificationsPage = lazy(() => import("./Pages/AwardsAndCertificationsPage"));
const PartnershipCards = lazy(() => import("./components/AboutPageComponent/Cards"));
const TeamSection = lazy(() => import("./components/AboutPageComponent/Team"));
const PrivacyPolicyPage = lazy(() => import("./Pages/PrivacyPolicyPage"));
const TermsOfUsePage = lazy(() => import("./Pages/TermsOfUse"));
const EPFAmendmentNotice = lazy(() => import("./Pages/EPFAmendmentNotice"));
const CloudServicesPage = lazy(() => import("./Pages/coudpage"));
const CloudSubServicePage = lazy(() => import("./Pages/CloudSubServicePage"));
const ServiceSubPage = lazy(() => import("./Pages/ServiceSubPage"));
const CybersecurityServicesPage = lazy(() => import("./Pages/cybersecurity"));
const InfrastructureServicesPage = lazy(() => import("./Pages/infrastructureservicepage"));
const NetworkingServicesPage = lazy(() => import("./Pages/NetworkingServicepage"));
const AIDataServicesPage = lazy(() => import("./Pages/aianddataservicepage"));
const TelecomPage = lazy(() => import("./Pages/TelecomePage"));
const NetworkingConsultingPage = lazy(() => import("./Pages/consultingservicePage"));
const ManagedServicesPage = lazy(() => import("./Pages/ManagedServices"));
const GRC = lazy(() => import("./Pages/GRCDashbaord"));
const BlogDetailPage = lazy(() => import("./Pages/BlogDetailPage"));
const BlogsPage = lazy(() => import("./Pages/BlogsPage"));
const CaseStudiesPage = lazy(() => import("./Pages/CaseStudiesPage"));
const CampaignsPage = lazy(() => import("./Pages/CampaignsPage"));
const NewsletterPage = lazy(() => import("./Pages/NewsletterPage"));
const OffersPage = lazy(() => import("./Pages/OffersPage"));
const HowWeDeliverPage = lazy(() => import("./Pages/HowWeDeliverPage"));

function App() {
  const { setLoaderDone } = useAppLoader();
  const location = useLocation();
  const skipSplash =
    typeof window !== "undefined" &&
    (window.__CACHE_SKIP_APP_LOADER__ === true ||
      !isKnownSpaRoute(location.pathname));

  // Framer Page Loader: hold → split panels apart → reveal app (loaderDone)
  // Skipped entirely for unknown URLs (404 pages)
  useEffect(() => {
    const loader = document.getElementById("app-loader");
    const topPanel = loader?.querySelector(".page-loader__panel--top");
    const bottomPanel = loader?.querySelector(".page-loader__panel--bottom");
    let holdTimer;
    let exitTimer;
    let startedExit = false;
    let onPanelTransitionEnd;

    const finishLoader = () => {
      if (loader?.parentNode) loader.remove();
      document.documentElement.classList.remove("app-loader-active");
      setLoaderDone(true);
    };

    if (!loader || skipSplash) {
      finishLoader();
      return undefined;
    }

    const startExit = () => {
      if (startedExit || !loader) return;
      startedExit = true;
      clearTimeout(holdTimer);
      loader.classList.add("app-loader--exit");
      loader.setAttribute("aria-hidden", "true");

      let endedPanels = 0;
      onPanelTransitionEnd = (e) => {
        if (e.propertyName !== "transform") return;
        if (e.target !== topPanel && e.target !== bottomPanel) return;
        endedPanels += 1;
        if (endedPanels < 2) return;
        topPanel?.removeEventListener("transitionend", onPanelTransitionEnd);
        bottomPanel?.removeEventListener("transitionend", onPanelTransitionEnd);
        clearTimeout(exitTimer);
        finishLoader();
      };

      topPanel?.addEventListener("transitionend", onPanelTransitionEnd);
      bottomPanel?.addEventListener("transitionend", onPanelTransitionEnd);
      exitTimer = window.setTimeout(finishLoader, LOADER_EXIT_MS + 120);
    };

    document.documentElement.classList.add("app-loader-active");
    holdTimer = window.setTimeout(startExit, LOADER_HOLD_MS);
    const fallbackTimer = window.setTimeout(startExit, LOADER_TOTAL_MS);

    return () => {
      clearTimeout(holdTimer);
      clearTimeout(fallbackTimer);
      clearTimeout(exitTimer);
      topPanel?.removeEventListener("transitionend", onPanelTransitionEnd);
      bottomPanel?.removeEventListener("transitionend", onPanelTransitionEnd);
      document.documentElement.classList.remove("app-loader-active");
    };
  }, [setLoaderDone, skipSplash]);

  return (
    <>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 min-h-0">
          <AnimatedRoutes>
            <Route path="/" element={<HomePage />} />
            <Route path="/service/infra" element={<InfrastructureServicesPage />} />
            <Route path="/service/network" element={<NetworkingServicesPage />} />
            <Route path="/service/cloud-solutions" element={<CloudServicesPage />} />
            <Route path="/cloudservices" element={<CloudServicesPage />} />
            <Route path="/cloud/:slug" element={<CloudSubServicePage />} />
            <Route path="/cybersecurity/:slug" element={<ServiceSubPage section="cybersecurity" />} />
            <Route path="/cybersecurity" element={<CybersecurityServicesPage />} />
            <Route path="/infrastructure/:slug" element={<ServiceSubPage section="infrastructure" />} />
            <Route path="/infrastructureservice" element={<InfrastructureServicesPage />} />
            <Route path="/data-analytics/:slug" element={<ServiceSubPage section="data-analytics" />} />
            <Route path="/aianddataservice" element={<AIDataServicesPage />} />
            <Route path="/managed-services/:slug" element={<ServiceSubPage section="managed-services" />} />
            <Route path="/manageservices" element={<ManagedServicesPage />} />
            <Route path="/consulting/:slug" element={<ServiceSubPage section="consulting" />} />
            <Route path="/consultingservice" element={<NetworkingConsultingPage />} />
            <Route path="/grc-dashboard" element={<GRC />} />
            <Route path="/telecom" element={<TelecomPage />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/insights" element={<InsightPage />} />
            <Route path="/blogs" element={<BlogsPage />} />
            <Route path="/case-studies" element={<CaseStudiesPage />} />
            <Route path="/blog/:id" element={<BlogDetailPage />} />
            <Route path="/admin" element={<Navigate to="/" replace />} />
            <Route path="/community" element={<CommunityPage />} />
            <Route path="/developerteam" element={<DeveloperTeam />} />
            <Route path="/contactus" element={<ContactUsPage />} />
            <Route path="/about" element={<AboutCache />} />
            <Route path="/innovations" element={<InnovationsPage />} />
            <Route path="/innovations/projects/:slug" element={<InnovationsProjectPage />} />
            <Route path="/about/profile" element={<Profile />} />
            <Route path="/about/awards" element={<AwardsAndCertificationsPage />} />
            <Route path="/about/certifications" element={<Navigate to="/about/awards" replace />} />
            <Route path="/about/alliances" element={<PartnershipCards />} />
            <Route path="/about/leadership" element={<TeamSection />} />
            <Route path="/privacy-policy" element={<PrivacyPolicyPage />} />
            <Route path="/terms-of-use" element={<TermsOfUsePage />} />
            <Route path="/careers" element={<Navigate to="/" replace />} />
            <Route path="/epf-amendment-notice" element={<EPFAmendmentNotice />} />

            {/* Notification pages */}
            <Route path="/campaigns" element={<CampaignsPage />} />
            <Route path="/newsletter" element={<NewsletterPage />} />
            <Route path="/offers" element={<OffersPage />} />
            <Route path="/how-we-deliver" element={<HowWeDeliverPage />} />

            <Route path="*" element={<NotFoundPage />} />

          </AnimatedRoutes>
        </main>
        <Footer />
        <CookieBanner />
        <AnalyticsPageViews />
      </div>
    </>
  );
}

export default App;
