import React, { useState } from 'react';
import {
  Heart,
  Sparkles,
  BedDouble,
  Bath,
  Maximize,
  Car,
  MapPin,
  Eye,
  Info,
  ChevronLeft,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react';
import { Property } from '../types';
import { formatPrice } from '../utils/filterProperties';

interface PropertyCardProps {
  property: Property;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onSelectProperty: (property: Property) => void;
  onOpen360Tour: (property: Property) => void;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  isFavorite,
  onToggleFavorite,
  onSelectProperty,
  onOpen360Tour,
}) => {
  const [currentImgIndex, setCurrentImgIndex] = useState(0);

  const hasTour = Boolean(property.virtualTour?.enabled && property.virtualTour.rooms.length > 0);
  const images = property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
  ];

  const handlePrevImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImg = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentImgIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  return (
    <div
      onClick={() => onSelectProperty(property)}
      className="group bg-white rounded-3xl overflow-hidden border border-stone-200/90 shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col cursor-pointer hover:-translate-y-1"
    >
      {/* Image Container */}
      <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
        <img
          src={images[currentImgIndex]}
          alt={property.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 ease-out"
          loading="lazy"
        />

        {/* Demo property disclaimer badge */}
        {property.isDemo && (
          <div className="absolute top-3 left-3 z-10">
            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-stone-900/85 text-amber-300 backdrop-blur-md border border-amber-400/30 shadow-md">
              <ShieldAlert className="w-3 h-3 text-amber-400" />
              Propiedad de demostración
            </span>
          </div>
        )}

        {/* 360 Tour badge */}
        {hasTour && (
          <div className="absolute bottom-3 left-3 z-10">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold bg-forest-900/90 text-white backdrop-blur-md border border-emerald-400/40 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              Recorrido 360° disponible
            </span>
          </div>
        )}

        {/* Favorite Button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(property.id);
          }}
          aria-label={isFavorite ? 'Eliminar de favoritos' : 'Guardar en favoritos'}
          className="absolute top-3 right-3 z-10 p-2.5 rounded-full bg-white/90 hover:bg-white text-stone-700 hover:text-rose-600 shadow-md backdrop-blur transition cursor-pointer"
        >
          <Heart
            className={`w-4 h-4 transition ${
              isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-700'
            }`}
          />
        </button>

        {/* Image slider arrows (visible on hover) */}
        {images.length > 1 && (
          <>
            <button
              onClick={handlePrevImg}
              aria-label="Foto anterior"
              className="absolute left-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextImg}
              aria-label="Foto siguiente"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow opacity-0 group-hover:opacity-100 transition duration-200 cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
            {/* Dots */}
            <div className="absolute bottom-3 right-3 z-10 flex gap-1 bg-stone-900/50 backdrop-blur px-2 py-1 rounded-full text-[10px] text-white font-medium">
              <span>{currentImgIndex + 1}</span>
              <span>/</span>
              <span>{images.length}</span>
            </div>
          </>
        )}
      </div>

      {/* Card Content */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Location & Type Tag */}
          <div className="flex items-center justify-between text-xs text-stone-500 mb-2">
            <div className="flex items-center gap-1 font-medium truncate">
              <MapPin className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
              <span className="truncate">{property.colonia}</span>
              {property.postalCode && (
                <span className="font-mono text-[10px] text-stone-500 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200 shrink-0">
                  C.P. {property.postalCode}
                </span>
              )}
            </div>
            <span className="capitalize font-semibold text-stone-700 bg-stone-100 px-2 py-0.5 rounded-md shrink-0">
              {property.type}
            </span>
          </div>

          {/* Title */}
          <h3 className="font-bold text-base text-stone-900 line-clamp-1 group-hover:text-forest-800 transition">
            {property.title}
          </h3>

          {/* Price & Period */}
          <div className="mt-2.5 flex items-baseline gap-1.5">
            <span className="text-xl font-extrabold text-forest-900 font-display">
              {formatPrice(property.price, property.period)}
            </span>
          </div>

          {/* Key Specs */}
          <div className="grid grid-cols-3 gap-2 py-3 my-3 border-y border-stone-100 text-stone-600 text-xs">
            <div className="flex items-center gap-1.5">
              <BedDouble className="w-4 h-4 text-stone-400" />
              <span>{property.bedrooms} {property.bedrooms === 1 ? 'hab.' : 'habs.'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Bath className="w-4 h-4 text-stone-400" />
              <span>{property.bathrooms} {property.bathrooms === 1 ? 'baño' : 'baños'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <Car className="w-4 h-4 text-stone-400" />
              <span>{property.parkingSpots > 0 ? `${property.parkingSpots} cochera` : 'Sin cochera'}</span>
            </div>
          </div>
        </div>

        {/* Card Action Buttons (Directly satisfying requirement 5) */}
        <div className="pt-1 flex flex-col gap-2">
          {hasTour && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onOpen360Tour(property);
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-semibold text-xs shadow-sm transition hover:shadow cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Recorrer en 360°</span>
            </button>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProperty(property);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-semibold text-xs transition cursor-pointer"
            >
              <Eye className="w-3.5 h-3.5 text-stone-500" />
              <span>Ver fotografías</span>
            </button>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectProperty(property);
              }}
              className="flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl border border-stone-200 hover:border-stone-300 text-forest-900 font-semibold text-xs transition cursor-pointer"
            >
              <Info className="w-3.5 h-3.5 text-emerald-700" />
              <span>Consultar detalles</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
