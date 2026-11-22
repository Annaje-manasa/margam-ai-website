import React, { useState, useEffect, useRef } from 'react';
import { landingHTML } from './landing_markup.js';
import { useLandingScript } from './useLandingScript.js';
import CheckoutPage from './CheckoutPage.jsx';

export default function App() {
  const [route, setRoute] = useState(() => {
    const p = window.location.pathname.toLowerCase();
    const h = window.location.hash.toLowerCase();
    if (p.includes('/checkout') || p.includes('/step/checkout') || h.includes('checkout')) {
      return 'checkout';
    }
    return 'landing';
  });

  const containerRef = useRef(null);

  // Sync route on popstate (browser back / forward buttons)
  useEffect(() => {
    const handlePopState = () => {
      const p = window.location.pathname.toLowerCase();
      const h = window.location.hash.toLowerCase();
      if (p.includes('/checkout') || p.includes('/step/checkout') || h.includes('checkout')) {
        setRoute('checkout');
      } else {
        setRoute('landing');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToCheckout = () => {
    window.history.pushState({}, '', '/step/checkout-ai-reel-system/');
    setRoute('checkout');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setRoute('landing');
    window.scrollTo({ top: 0, behavior: 'instant' });
  };

  // Only run landing page interactive script when on landing page
  useLandingScript(containerRef, landingHTML, route === 'landing');

  // Intercept clicks on checkout buttons on the landing page
  useEffect(() => {
    if (route !== 'landing' || !containerRef.current) return;
    const el = containerRef.current;
    const clickHandler = (e) => {
      const btn = e.target.closest('a[href*="checkout"], .header-cta-btn, .bz-b1, .elementor-button');
      if (btn) {
        e.preventDefault();
        navigateToCheckout();
      }
    };
    el.addEventListener('click', clickHandler);
    return () => el.removeEventListener('click', clickHandler);
  }, [route]);

  if (route === 'checkout') {
    return <CheckoutPage onNavigateHome={navigateToHome} />;
  }

  return (
    <div
      ref={containerRef}
      className="blizmatt-root"
      dangerouslySetInnerHTML={{ __html: landingHTML }}
    />
  );
}
