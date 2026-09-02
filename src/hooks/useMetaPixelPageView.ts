import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

export function useMetaPixelPageView() {
  const location = useLocation();

  useEffect(() => {
    if (typeof window === 'undefined' || !window.fbq) return;
    window.fbq('track', 'PageView');
  }, [location.pathname]);
}
