import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, HashRouter } from "react-router-dom";
import { ContentProvider } from "./context/ContentContext";
import { PlacementsProvider } from "./context/PlacementsContext";
import { AppLoaderProvider } from "./context/AppLoaderContext";
import { LenisProvider } from "./context/LenisContext";
import { CookieConsentProvider } from "./context/CookieConsentContext";
import { isKnownSpaRoute } from "../spaRouteAllowlist.js";

import "./index.css";
import App from "./App.jsx";

// HashRouter works when opening index.html via file:// (e.g. from dist folder)
const Router = window.location.protocol === "file:" ? HashRouter : BrowserRouter;

/** Path React Router will use on first paint (hash mode for file://). */
function bootPathname() {
  if (window.location.protocol === "file:") {
    const hash = window.location.hash.replace(/^#/, "") || "/";
    return hash.split("?")[0] || "/";
  }
  return window.location.pathname || "/";
}

// Skip splash immediately on unknown URLs (404) - before React mounts
if (!isKnownSpaRoute(bootPathname())) {
  document.getElementById("app-loader")?.remove();
  document.documentElement.classList.remove("app-loader-active");
  window.__CACHE_SKIP_APP_LOADER__ = true;
}

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Router>
      <AppLoaderProvider>
      <ContentProvider>
        <PlacementsProvider>
          <LenisProvider>
            <CookieConsentProvider>
              <App />
            </CookieConsentProvider>
          </LenisProvider>
        </PlacementsProvider>
      </ContentProvider>
      </AppLoaderProvider>
    </Router>
  </StrictMode>
);
