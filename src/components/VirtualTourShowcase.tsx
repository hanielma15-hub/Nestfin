import React from 'react';
import {
  Sparkles,
  Compass,
  ArrowRight,
  Eye,
  CheckCircle2,
  MousePointerClick,
  Smartphone,
  ShieldCheck,
} from 'lucide-react';
import { Property } from '../types';

interface VirtualTourShowcaseProps {
  onExplore360: () => void;
  featuredPropertyWithTour?: Property;
  onOpenTour: (property: Property) => void;
}

export const VirtualTourShowcase: React.FC<VirtualTourShowcaseProps> = ({
  onExplore360,
  featuredPropertyWithTour,
  onOpenTour,
}) => {
  return (
    <section className="py-14 bg-gradient-to-br from-forest-950 via-forest-900 to-forest-950 text-white relative overflow-hidden my-8 rounded-3xl mx-4 sm:mx-6 lg:mx-8 shadow-2xl">
      {/* Decorative background aura */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-emerald-700/10 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          {/* Left Column: Copy & Benefits */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-800/60 border border-emerald-400/30 text-emerald-300 text-xs font-semibold backdrop-blur">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tecnología Panorámica Inmersiva</span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight font-display leading-[1.15]">
              Antes de visitarlo, <span className="text-emerald-400">recórrelo</span>.
            </h2>

            <p className="text-base sm:text-lg text-stone-300 leading-relaxed font-normal">
              Explora los espacios de una propiedad en 360° y descubre cada rincón desde tu teléfono o computadora.
              Ahorra tiempo en traslados, visualiza la distribución real y toma decisiones con total transparencia.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <Compass className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-stone-100">Vista esférica real</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Gira en 360° arriba, abajo y a los lados sin distorsiones.
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-xl bg-emerald-900/60 border border-emerald-500/30 flex items-center justify-center shrink-0">
                  <MousePointerClick className="w-4 h-4 text-emerald-300" />
                </div>
                <div>
                  <h4 className="font-semibold text-sm text-stone-100">Navega entre cuartos</h4>
                  <p className="text-xs text-stone-400 mt-0.5">
                    Transita de la sala a la cocina o el patio tocando puntos interactivos.
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={onExplore360}
                className="inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-sm shadow-lg shadow-emerald-950/40 transition-all duration-200 hover:scale-105 cursor-pointer"
              >
                <span>Explorar recorridos virtuales</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Right Column: Visual Interactive Teaser */}
          <div className="lg:col-span-5">
            {featuredPropertyWithTour ? (
              <div className="bg-stone-900/80 border border-emerald-500/30 rounded-3xl p-5 shadow-2xl backdrop-blur-md relative group">
                <div className="relative aspect-16/10 rounded-2xl overflow-hidden bg-stone-950">
                  <img
                    src={featuredPropertyWithTour.images[0]}
                    alt={featuredPropertyWithTour.title}
                    className="w-full h-full object-cover opacity-80 group-hover:scale-105 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-transparent flex flex-col justify-end p-4">
                    <span className="text-[11px] font-mono text-emerald-400 uppercase tracking-widest font-bold">
                      Vista previa 360° disponible
                    </span>
                    <h3 className="font-bold text-sm text-white mt-1">
                      {featuredPropertyWithTour.title}
                    </h3>
                    <p className="text-xs text-stone-300 mt-0.5">
                      {featuredPropertyWithTour.colonia}, Montemorelos
                    </p>
                  </div>

                  <button
                    onClick={() => onOpenTour(featuredPropertyWithTour)}
                    aria-label={`Iniciar recorrido de ${featuredPropertyWithTour.title}`}
                    className="absolute inset-0 m-auto w-16 h-16 rounded-full bg-emerald-600/90 hover:bg-emerald-500 text-stone-950 flex items-center justify-center shadow-xl transition-all duration-200 hover:scale-110 cursor-pointer"
                  >
                    <Compass className="w-8 h-8 animate-spin-slow" />
                  </button>
                </div>

                <div className="mt-4 flex items-center justify-between text-xs text-stone-400">
                  <span className="flex items-center gap-1.5">
                    <Smartphone className="w-3.5 h-3.5 text-emerald-400" />
                    Compatible con móvil y PC
                  </span>
                  <span className="text-stone-300 font-semibold">
                    {featuredPropertyWithTour.virtualTour?.rooms.length} habitaciones disponibles
                  </span>
                </div>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
};
