import React, { createContext, useCallback, useContext, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import Lenis from 'lenis';

const LenisContext = createContext(null);

/** Active instance for helpers used outside React (hash links, etc.). */
let activeLenis = null;

/**
 * Shared Lenis config — lerp only (never set duration on the instance;
 * duration mode makes wheel scrolling feel too fast / uneven).
 */
const LENIS_OPTIONS = {
  lerp: 0.08,
  smoothWheel: true,
  syncTouch: false,
  wheelMultiplier: 0.85,
  touchMultiplier: 1.1,
  orientation: 'vertical',
  gestureOrientation: 'vertical',
  anchors: false,
  autoResize: true,
  autoRaf: true,
  allowNestedScroll: true,
};

/** Programmatic / hash scroll — uses Lenis when ready, else native. */
export function scrollToTarget(target, options = {}) {
  const { immediate = false, offset = 0, lerp = 0.1, ...rest } = options;
  const lenis = activeLenis;

  if (lenis) {
    const { duration: _d, easing: _e, ...safe } = rest;
    lenis.scrollTo(target, {
      offset,
      immediate,
      lerp: immediate ? undefined : lerp,
      ...safe,
    });
    return;
  }

  if (typeof window === 'undefined') return;
  const behavior = immediate ? 'auto' : 'smooth';

  if (typeof target === 'number') {
    window.scrollTo({ top: target + offset, left: 0, behavior });
    return;
  }

  const el =
    typeof target === 'string'
      ? document.querySelector(target)
      : target instanceof Element
        ? target
        : null;
  if (!el) return;

  const top = el.getBoundingClientRect().top + window.scrollY + offset;
  window.scrollTo({ top, left: 0, behavior });
}

export function LenisProvider({ children }) {
  const lenisRef = useRef(null);

  useEffect(() => {
    if (typeof window === 'undefined' || typeof document === 'undefined') return undefined;

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reducedMotion) {
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
      return undefined;
    }

    const lenis = new Lenis({
      ...LENIS_OPTIONS,
      wrapper: window,
      content: document.documentElement,
    });

    lenisRef.current = lenis;
    activeLenis = lenis;
    document.documentElement.classList.add('lenis', 'lenis-smooth');

    return () => {
      lenis.destroy();
      lenisRef.current = null;
      if (activeLenis === lenis) activeLenis = null;
      document.documentElement.classList.remove('lenis', 'lenis-smooth');
    };
  }, []);

  const scrollTo = useCallback((target, options = {}) => {
    scrollToTarget(target, options);
  }, []);

  const resize = useCallback(() => {
    lenisRef.current?.resize?.();
  }, []);

  return (
    <LenisContext.Provider value={{ lenisRef, scrollTo, resize }}>
      {children}
    </LenisContext.Provider>
  );
}

export function useLenis() {
  return useContext(LenisContext);
}

/**
 * Site-wide hash scroll via Lenis. Route top-scroll stays in AnimatedRoutes.
 */
export function useLenisPageScroll({ hashOffset = -80, delayMs = 80 } = {}) {
  const { pathname, hash } = useLocation();

  useEffect(() => {
    if (!hash || hash === '#') return undefined;

    const id = decodeURIComponent(hash.slice(1));
    if (!id) return undefined;

    const timer = window.setTimeout(() => {
      const el = document.getElementById(id);
      if (el) scrollToTarget(el, { offset: hashOffset, lerp: 0.1 });
    }, delayMs);

    return () => window.clearTimeout(timer);
  }, [pathname, hash, hashOffset, delayMs]);
}

/** Alias used by pages */
export const usePageScroll = useLenisPageScroll;

export default LenisContext;
