/**
 * Shared SPA route allowlist - keep in sync with public/.htaccess.
 * Used by Vite (dev/preview) to return HTTP 404 for unknown paths.
 */

const EXACT = new Set([
  "/",
  "/service/infra",
  "/service/network",
  "/service/cloud-solutions",
  "/cloudservices",
  "/cybersecurity",
  "/infrastructureservice",
  "/aianddataservice",
  "/manageservices",
  "/consultingservice",
  "/grc-dashboard",
  "/telecom",
  "/contact",
  "/insights",
  "/blogs",
  "/case-studies",
  "/admin",
  "/community",
  "/developerteam",
  "/contactus",
  "/about",
  "/about/profile",
  "/about/awards",
  "/about/certifications",
  "/about/alliances",
  "/about/leadership",
  "/innovations",
  "/ai-ops-coe",
  "/privacy-policy",
  "/terms-of-use",
  "/careers",
  "/epf-amendment-notice",
  "/campaigns",
  "/newsletter",
  "/offers",
  "/how-we-deliver",
]);

const DYNAMIC = [
  /^\/cloud\/[^/]+\/?$/,
  /^\/cybersecurity\/[^/]+\/?$/,
  /^\/infrastructure\/[^/]+\/?$/,
  /^\/data-analytics\/[^/]+\/?$/,
  /^\/managed-services\/[^/]+\/?$/,
  /^\/consulting\/[^/]+\/?$/,
  /^\/blog\/[^/]+\/?$/,
  /^\/innovations\/projects\/[^/]+\/?$/,
];

/** Normalize pathname: strip query/hash, collapse trailing slash (except root). */
export function normalizePathname(urlPath) {
  const pathOnly = (urlPath || "/").split("?")[0].split("#")[0] || "/";
  if (pathOnly.length > 1 && pathOnly.endsWith("/")) {
    return pathOnly.slice(0, -1);
  }
  return pathOnly || "/";
}

export function isKnownSpaRoute(urlPath) {
  const pathname = normalizePathname(urlPath).toLowerCase();
  if (EXACT.has(pathname)) return true;
  // Dynamic patterns allow optional trailing slash via regex
  const withSlash = pathname.endsWith("/") ? pathname : `${pathname}/`;
  return DYNAMIC.some((re) => re.test(pathname) || re.test(withSlash));
}

/** Vite / static asset requests that must not be treated as SPA navigations. */
export function shouldSkipSpaCheck(urlPath) {
  const pathname = normalizePathname(urlPath);
  if (
    pathname.startsWith("/@") ||
    pathname.startsWith("/src/") ||
    pathname.startsWith("/node_modules/") ||
    pathname.startsWith("/api") ||
    pathname.startsWith("/assets/")
  ) {
    return true;
  }
  // File-like requests (have an extension)
  const last = pathname.split("/").pop() || "";
  if (last.includes(".")) return true;
  return false;
}
