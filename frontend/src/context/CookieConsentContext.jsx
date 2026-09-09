import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { getConsent, setConsent as setConsentStorage, resetConsent as resetConsentStorage } from '../utils/cookieManager';

const CookieConsentContext = createContext(null);

/** GA4 Measurement ID - only load when consent === 'accepted' */
const GA_MEASUREMENT_ID = 'G-HZ6PE1Q290';

function loadGoogleAnalytics() {
  if (typeof window === 'undefined' || window.gtag) return;
  window.dataLayer = window.dataLayer || [];
  function gtag() {
    window.dataLayer.push(arguments);
  }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', GA_MEASUREMENT_ID);
}

function injectGoogleAnalyticsScript() {
  if (document.getElementById('ga-consent-script')) return;
  const script = document.createElement('script');
  script.id = 'ga-consent-script';
  script.async = true;
  script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
  document.head.appendChild(script);
  script.onload = loadGoogleAnalytics;
}

export function CookieConsentProvider({ children }) {
  const [consent, setConsentState] = useState(null);

  useEffect(() => {
    const initial = getConsent();
    setConsentState(initial);
    if (initial === 'accepted') {
      injectGoogleAnalyticsScript();
    }
  }, []);

  const setConsent = useCallback((value) => {
    setConsentStorage(value);
    setConsentState(value);
    if (value === 'accepted') {
      injectGoogleAnalyticsScript();
    }
  }, []);

  const resetConsent = useCallback(() => {
    resetConsentStorage();
    setConsentState(null);
  }, []);

  const value = {
    consent,
    setConsent,
    resetConsent,
    hasResponded: consent !== null,
  };

  return (
    <CookieConsentContext.Provider value={value}>
      {children}
    </CookieConsentContext.Provider>
  );
}

export function useCookieConsent() {
  const ctx = useContext(CookieConsentContext);
  if (!ctx) {
    throw new Error('useCookieConsent must be used within CookieConsentProvider');
  }
  return ctx;
}

/** Send SPA page views to GA4 after cookie consent. */
export function AnalyticsPageViews() {
  const location = useLocation();
  const { consent } = useCookieConsent();

  useEffect(() => {
    if (consent !== 'accepted' || typeof window.gtag !== 'function') return;
    window.gtag('config', GA_MEASUREMENT_ID, {
      page_path: location.pathname + location.search,
    });
  }, [location.pathname, location.search, consent]);

  return null;
}
