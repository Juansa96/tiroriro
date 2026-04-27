import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import FloatingButtons from "@/components/FloatingButtons";
import CookieBanner from "@/components/CookieBanner";
import ScrollToTop from "@/components/ScrollToTop";
import Index from "./pages/Index";
import ProductsPage from "./pages/ProductsPage";
import CategoryPage from "./pages/CategoryPage";
import ConfiguratorPage from "./pages/ConfiguratorPage";
import TryOnPage from "./pages/TryOnPage";
import TeamPage from "./pages/TeamPage";
import TelasPage from "./pages/TelasPage";
import PrivacyPage from "./pages/PrivacyPage";
import LegalPage from "./pages/LegalPage";
import CookiesPage from "./pages/CookiesPage";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();
const categoryRoutes = [
  { path: "/productos/cabeceros", categoryKey: "cabeceros" },
  { path: "/productos/bancos", categoryKey: "bancos" },
  { path: "/productos/cojines", categoryKey: "cojines" },
  { path: "/productos/puffs", categoryKey: "puffs" },
  { path: "/productos/mesas-centro", categoryKey: "mesas-centro" },
  { path: "/productos/mesitas-de-centro", categoryKey: "mesas-centro" },
];

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <ScrollToTop />
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
          <Route path="/nosotros" element={<TeamPage />} />
          <Route path="/equipo" element={<TeamPage />} />
          <Route path="/contacto" element={<Navigate to="/#contacto" replace />} />
          <Route path="/quienes-somos" element={<Navigate to="/nosotros" replace />} />
          <Route path="/privacidad" element={<PrivacyPage />} />
          <Route path="/aviso-legal" element={<LegalPage />} />
          <Route path="/cookies" element={<CookiesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
        <FloatingButtons />
        <CookieBanner />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
