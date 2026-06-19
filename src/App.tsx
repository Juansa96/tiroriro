import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingButtons from "@/components/FloatingButtons";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTop from "@/components/ScrollToTop";
import { lazy, Suspense } from "react";
import Index from "./pages/Index"; // home se mantiene eager (LCP)
const ProductsPage = lazy(() => import("./pages/ProductsPage"));
const CategoryPage = lazy(() => import("./pages/CategoryPage"));
const ConfiguratorPage = lazy(() => import("./pages/ConfiguratorPage"));
const TryOnPage = lazy(() => import("./pages/TryOnPage"));
const TeamPage = lazy(() => import("./pages/TeamPage"));
const TelasPage = lazy(() => import("./pages/TelasPage"));
const PrivacyPage = lazy(() => import("./pages/PrivacyPage"));
const LegalPage = lazy(() => import("./pages/LegalPage"));
const CookiesPage = lazy(() => import("./pages/CookiesPage"));
const GraciasPage = lazy(() => import("./pages/GraciasPage"));
const UnsubscribePage = lazy(() => import("./pages/UnsubscribePage"));
const GuiaMedidasCabecerosPage = lazy(() => import("./pages/GuiaMedidasCabecerosPage"));
const NotFound = lazy(() => import("./pages/NotFound"));

const queryClient = new QueryClient();
const categoryRoutes = [
  { path: "/productos/cabeceros", categoryKey: "cabeceros" },
  { path: "/productos/bancos", categoryKey: "bancos" },
  { path: "/productos/cojines", categoryKey: "cojines" },
  { path: "/productos/pufs", categoryKey: "pufs" },
  { path: "/productos/mesas-centro", categoryKey: "mesas-centro" },
  { path: "/productos/mesitas-de-centro", categoryKey: "mesas-centro" },
  { path: "/productos/pantallas-lampara", categoryKey: "pantallas-lampara" },
];

const App = () => (
  <HelmetProvider>
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
        <Suspense fallback={null}>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/productos" element={<ProductsPage />} />
          {categoryRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<CategoryPage categoryKey={route.categoryKey} />}
            />
          ))}
          <Route path="/configurador" element={<ConfiguratorPage />} />
          <Route path="/probador" element={<TryOnPage />} />
          <Route path="/telas" element={<TelasPage />} />
          <Route path="/guia-medidas-cabeceros" element={<GuiaMedidasCabecerosPage />} />
          <Route path="/nosotros" element={<TeamPage />} />
          <Route path="/equipo" element={<TeamPage />} />
          <Route path="/contacto" element={<Navigate to="/#contacto" replace />} />
          <Route path="/quienes-somos" element={<Navigate to="/nosotros" replace />} />
          <Route path="/gracias" element={<GraciasPage />} />
          <Route path="/unsubscribe" element={<UnsubscribePage />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="/aviso-legal" element={<LegalPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        </Suspense>
        <FloatingButtons />
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
  </HelmetProvider>
);

export default App;
