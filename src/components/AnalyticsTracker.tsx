import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { initAnalyticsFromStorage, trackPageView } from "@/lib/analytics";

const AnalyticsTracker = () => {
  const location = useLocation();

  // On first mount, re-grant if the user had accepted in a previous visit.
  useEffect(() => {
    initAnalyticsFromStorage();
  }, []);

  // Fire a page_view on every SPA route change.
  useEffect(() => {
    const path = location.pathname + location.search;
    // Defer so document.title has updated (react-helmet writes async).
    const id = window.setTimeout(() => trackPageView(path), 0);
    return () => window.clearTimeout(id);
  }, [location.pathname, location.search]);

  return null;
};

export default AnalyticsTracker;