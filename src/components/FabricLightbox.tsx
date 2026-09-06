import { useEffect, useState } from "react";
import * as DialogPrimitive from "@radix-ui/react-dialog";
import { X, ZoomIn, ZoomOut } from "lucide-react";

export interface LightboxFabric {
  name: string;
  hex: string;
  image?: string;
  descripcion?: string;
  coleccion?: string;
}

interface Props {
  fabric: LightboxFabric | null;
  onClose: () => void;
}

/**
 * Visor de tela a pantalla completa. Se abre al pulsar una tela (página de
 * telas, muestras y rejillas del configurador) y enseña la foto a su
 * resolución real: primero encajada en pantalla y, al tocarla, ampliada con
 * desplazamiento. En móvil y iPad el pinch-zoom nativo sigue funcionando.
 */
const FabricLightbox = ({ fabric, onClose }: Props) => {
  const [zoomed, setZoomed] = useState(false);
  useEffect(() => {
    setZoomed(false);
  }, [fabric]);

  return (
    <DialogPrimitive.Root open={!!fabric} onOpenChange={(open) => { if (!open) onClose(); }}>
      <DialogPrimitive.Portal>
        <DialogPrimitive.Overlay className="fixed inset-0 z-[70] bg-black/85 backdrop-blur-sm data-[state=open]:animate-in data-[state=open]:fade-in-0 data-[state=closed]:animate-out data-[state=closed]:fade-out-0" />
        <DialogPrimitive.Content
          className="fixed inset-0 z-[71] flex flex-col outline-none data-[state=open]:animate-in data-[state=open]:fade-in-0"
          aria-describedby={undefined}
          onClick={onClose}
        >
          <DialogPrimitive.Title className="sr-only">{fabric ? `Tela ${fabric.name}` : "Tela"}</DialogPrimitive.Title>

          {/* Cabecera: nombre, colección, zoom y cerrar */}
          <div
            className="flex items-center justify-between gap-3 px-4 py-3 text-white"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="min-w-0">
              <p className="font-serif text-lg md:text-xl font-light leading-tight truncate">{fabric?.name}</p>
              {fabric?.coleccion && (
                <p className="text-[10px] tracking-[0.2em] uppercase text-white/60">Colección {fabric.coleccion}</p>
              )}
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              {fabric?.image && (
                <button
                  type="button"
                  onClick={() => setZoomed((z) => !z)}
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                  aria-label={zoomed ? "Ver la tela completa" : "Ampliar la tela"}
                >
                  {zoomed ? <ZoomOut size={18} /> : <ZoomIn size={18} />}
                </button>
              )}
              <DialogPrimitive.Close
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/10 hover:bg-white/20 transition-colors"
                aria-label="Cerrar"
              >
                <X size={20} />
              </DialogPrimitive.Close>
            </div>
          </div>

          {/* Foto de la tela */}
          <div
            className={`flex-1 min-h-0 px-2 ${zoomed ? "overflow-auto" : "overflow-hidden flex items-center justify-center"}`}
            style={{ touchAction: "pan-x pan-y pinch-zoom" }}
          >
            {fabric?.image ? (
              <img
                src={fabric.image}
                alt={`Tela ${fabric.name} en detalle`}
                draggable={false}
                decoding="async"
                onClick={(e) => { e.stopPropagation(); setZoomed((z) => !z); }}
                className={zoomed
                  ? "block max-w-none mx-auto cursor-zoom-out"
                  : "max-h-full max-w-full object-contain rounded-md shadow-2xl cursor-zoom-in"}
                style={zoomed ? { width: "min(max(150vw, 900px), 1600px)" } : undefined}
              />
            ) : (
              <div
                className="w-[70vmin] h-[70vmin] rounded-md shadow-2xl"
                style={{ backgroundColor: fabric?.hex }}
                onClick={(e) => e.stopPropagation()}
              />
            )}
          </div>

          {/* Pie: descripción y ayuda */}
          <div className="px-4 py-3 text-center text-white/80" onClick={(e) => e.stopPropagation()}>
            {fabric?.descripcion && (
              <p className="text-sm font-light max-w-xl mx-auto leading-relaxed">{fabric.descripcion}</p>
            )}
            <p className="mt-1 text-[11px] text-white/50 font-light italic">
              {fabric?.image ? "Toca la foto para ampliarla · " : ""}Los colores en pantalla son orientativos
            </p>
          </div>
        </DialogPrimitive.Content>
      </DialogPrimitive.Portal>
    </DialogPrimitive.Root>
  );
};

export default FabricLightbox;
