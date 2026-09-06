import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingButtons from "@/components/FloatingButtons";
import MobileStickyCTA from "@/components/MobileStickyCTA";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTop from "@/components/ScrollToTop";
import AnalyticsTracker from "@/components/AnalyticsTracker";
import { useMetaPixelPageView } from "@/hooks/useMetaPixelPageView";
import { Suspense, useEffect } from "react";
import { captureClickIds } from "@/lib/tracking";
import { captureAttribution } from "@/lib/attribution";

import AppRoutes from "./AppRoutes";

const queryClient = new QueryClient();

function MetaPixelTracker() {
  useMetaPixelPageView();
  return null;
}

const App = () => {
  useEffect(() => {
    captureClickIds();
    captureAttribution();
  }, []);


  return (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <ScrollToTop />
        <AnalyticsTracker />
        <MetaPixelTracker />
        <Suspense fallback={null}>
        <AppRoutes />
        </Suspense>
        <FloatingButtons />
        <MobileStickyCTA />
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
  );
};

export default App;
