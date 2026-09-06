import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Helmet } from "react-helmet-async";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <>
      <Helmet>
        <title>Página no encontrada | Tiroriro</title>
        <meta name="robots" content="noindex, follow" />
      </Helmet>
      <Navbar />
      <main className="pt-20 md:pt-24">
        <section className="py-24 px-6 text-center">
          <p className="text-[10px] tracking-[0.22em] uppercase text-muted-foreground mb-4">Error 404</p>
          <h1 className="font-serif text-4xl md:text-5xl font-light text-foreground">Esta página no existe</h1>
          <p className="mt-6 text-base text-muted-foreground font-light max-w-md mx-auto">
            Puede que el enlace esté mal escrito o que la página se haya movido. Estas te llevan a buen puerto:
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link to="/" className="inline-flex items-center text-xs font-medium text-foreground border border-border rounded-full px-5 py-2.5 hover:border-foreground/60 transition-colors">Inicio</Link>
            <Link to="/productos" className="inline-flex items-center text-xs font-medium text-foreground border border-border rounded-full px-5 py-2.5 hover:border-foreground/60 transition-colors">Productos</Link>
            <Link to="/telas" className="inline-flex items-center text-xs font-medium text-foreground border border-border rounded-full px-5 py-2.5 hover:border-foreground/60 transition-colors">Telas</Link>
            <Link to="/configurador" className="inline-flex items-center text-xs font-medium text-foreground border border-border rounded-full px-5 py-2.5 hover:border-foreground/60 transition-colors">Diseña el tuyo</Link>
          </div>
        </section>
      </main>
      <Footer />
    </>
  );
};

export default NotFound;
