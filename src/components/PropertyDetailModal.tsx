import React, { useState } from 'react';
import {
  X,
  Heart,
  Sparkles,
  MapPin,
  BedDouble,
  Bath,
  Maximize,
  Car,
  Calendar,
  CheckCircle2,
  ShieldCheck,
  Phone,
  Mail,
  Share2,
  Clock,
  AlertCircle,
  FileText,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Camera,
  MessageSquare,
} from 'lucide-react';
import { Property } from '../types';
import { formatPrice } from '../utils/filterProperties';
import { VirtualTour360Viewer } from './VirtualTour360Viewer';

interface PropertyDetailModalProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
  isFavorite: boolean;
  onToggleFavorite: (id: string) => void;
  onOpenContact: (property: Property) => void;
  onSelectSimilarProperty: (property: Property) => void;
  allProperties: Property[];
}

export const PropertyDetailModal: React.FC<PropertyDetailModalProps> = ({
  property,
  isOpen,
  onClose,
  isFavorite,
  onToggleFavorite,
  onOpenContact,
  onSelectSimilarProperty,
  allProperties,
}) => {
  // Tab: 'photos' | 'virtual360'
  const [activeTab, setActiveTab] = useState<'photos' | 'virtual360'>(
    property.virtualTour?.enabled ? 'photos' : 'photos'
  );
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(0);

  if (!isOpen) return null;

  const hasTour = Boolean(property.virtualTour?.enabled && property.virtualTour.rooms.length > 0);
  const images = property.images.length > 0 ? property.images : [
    'https://images.unsplash.com/photo-1568605114967-8130f3a36994?auto=format&fit=crop&w=1200&q=80',
  ];

  const similarProperties = allProperties
    .filter((p) => p.id !== property.id && p.regionId === property.regionId)
    .slice(0, 2);

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-2 sm:p-4 md:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-5xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-stone-200">
        {/* Sticky Header with Controls */}
        <div className="p-4 sm:p-5 border-b border-stone-200 flex items-center justify-between bg-white z-20 shrink-0">
          <div className="flex items-center gap-3">
            <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-1 rounded-full bg-forest-100 text-forest-800">
              {property.type}
            </span>
            {property.isDemo && (
              <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                Propiedad de demostración
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onToggleFavorite(property.id)}
              aria-label={isFavorite ? 'Quitar de favoritos' : 'Guardar en favoritos'}
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-700 transition"
              title="Guardar en favoritos"
            >
              <Heart
                className={`w-5 h-5 ${
                  isFavorite ? 'fill-rose-500 text-rose-500' : 'text-stone-600'
                }`}
              />
            </button>
            <button
              onClick={onClose}
              aria-label="Cerrar detalle de propiedad"
              className="p-2 rounded-xl border border-stone-200 hover:bg-stone-100 text-stone-600 hover:text-stone-900 transition"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-4 sm:p-6 md:p-8 space-y-8">
          {/* Main Visual Section with Two Distinct Tabs (Photos vs 360 Tour) */}
          <div>
            {/* View Switcher Tabs (Fulfills Section 4C) */}
            <div className="flex items-center justify-between mb-4 border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setActiveTab('photos')}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer ${
                    activeTab === 'photos'
                      ? 'bg-stone-900 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  <Camera className="w-4 h-4" />
                  <span>Ver fotografías ({images.length})</span>
                </button>

                {hasTour && (
                  <button
                    onClick={() => setActiveTab('virtual360')}
                    className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-sm transition cursor-pointer border ${
                      activeTab === 'virtual360'
                        ? 'bg-emerald-700 text-white border-emerald-800 shadow-md ring-2 ring-emerald-300'
                        : 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-emerald-500" />
                    <span>Recorrer en 360° ({property.virtualTour?.rooms.length} habitaciones)</span>
                  </button>
                )}
              </div>

              {hasTour && activeTab === 'photos' && (
                <button
                  onClick={() => setActiveTab('virtual360')}
                  className="hidden sm:flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition underline-offset-4 hover:underline"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>¿Prefieres recorrerla en 360°? Haz clic aquí</span>
                </button>
              )}
            </div>

            {/* Tab 1: Interactive 360° Panorama Viewer */}
            {activeTab === 'virtual360' && property.virtualTour ? (
              <div className="space-y-2">
                <VirtualTour360Viewer
                  tourData={property.virtualTour}
                  propertyTitle={property.title}
                  isModal={true}
                />
                <p className="text-xs text-stone-500 text-center">
                  💡 Pasa el cursor o arrastra con el dedo en cualquier ángulo para explorar. Toca los puntos interactivos para cambiar de habitación.
                </p>
              </div>
            ) : null}

            {/* Tab 2: High Quality Photo Gallery */}
            {activeTab === 'photos' && (
              <div className="space-y-3">
                <div className="relative aspect-16/9 rounded-3xl overflow-hidden bg-stone-100 shadow-md">
                  <img
                    src={images[selectedPhotoIndex]}
                    alt={`${property.title} - Imagen ${selectedPhotoIndex + 1}`}
                    className="w-full h-full object-cover"
                  />

                  {images.length > 1 && (
                    <>
                      <button
                        onClick={() =>
                          setSelectedPhotoIndex((prev) =>
                            prev === 0 ? images.length - 1 : prev - 1
                          )
                        }
                        aria-label="Foto anterior"
                        className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow transition"
                      >
                        <ChevronLeft className="w-5 h-5" />
                      </button>
                      <button
                        onClick={() =>
                          setSelectedPhotoIndex((prev) =>
                            prev === images.length - 1 ? 0 : prev + 1
                          )
                        }
                        aria-label="Foto siguiente"
                        className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 hover:bg-white text-stone-800 shadow transition"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </>
                  )}
                </div>

                {/* Thumbnail Strip */}
                {images.length > 1 && (
                  <div className="flex gap-2.5 overflow-x-auto pb-2">
                    {images.map((img, idx) => (
                      <button
                        key={idx}
                        onClick={() => setSelectedPhotoIndex(idx)}
                        className={`relative w-20 h-16 rounded-xl overflow-hidden shrink-0 transition border-2 ${
                          selectedPhotoIndex === idx
                            ? 'border-forest-800 scale-105'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img src={img} alt="Miniatura" className="w-full h-full object-cover" />
                      </button>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Title, Location & Price Banner */}
          <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 pb-6 border-b border-stone-200">
            <div>
              <div className="flex items-center gap-1.5 text-stone-500 text-xs mb-1">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>
                  {property.colonia}, {property.city}, {property.state}
                </span>
                {property.postalCode && (
                  <span className="font-mono text-[10px] text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                    C.P. {property.postalCode}
                  </span>
                )}
                {property.referenceLocation && (
                  <span className="text-stone-400">({property.referenceLocation})</span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-stone-900 font-display">
                {property.title}
              </h1>
            </div>

            <div className="bg-stone-50 p-4 rounded-2xl border border-stone-200/90 text-right md:min-w-[220px]">
              <div className="text-2xl sm:text-3xl font-extrabold text-forest-900 font-display">
                {formatPrice(property.price, property.period)}
              </div>
              <div className="text-xs text-stone-500 mt-0.5">
                Modalidad: {property.period} • Moneda: MXN
              </div>
            </div>
          </div>

          {/* Key Specifications Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-stone-50 border border-stone-200/80 text-center">
            <div className="flex flex-col items-center">
              <BedDouble className="w-5 h-5 text-emerald-800 mb-1" />
              <span className="text-xs text-stone-500">Recámaras</span>
              <span className="font-bold text-sm text-stone-800">{property.bedrooms}</span>
            </div>
            <div className="flex flex-col items-center">
              <Bath className="w-5 h-5 text-emerald-800 mb-1" />
              <span className="text-xs text-stone-500">Baños</span>
              <span className="font-bold text-sm text-stone-800">{property.bathrooms}</span>
            </div>
            <div className="flex flex-col items-center">
              <Car className="w-5 h-5 text-emerald-800 mb-1" />
              <span className="text-xs text-stone-500">Estacionamiento</span>
              <span className="font-bold text-sm text-stone-800">
                {property.parkingSpots > 0 ? `${property.parkingSpots} autos` : 'No asignado'}
              </span>
            </div>
            <div className="flex flex-col items-center">
              <Maximize className="w-5 h-5 text-emerald-800 mb-1" />
              <span className="text-xs text-stone-500">Superficie</span>
              <span className="font-bold text-sm text-stone-800">
                {property.surfaceM2 ? `${property.surfaceM2} m²` : 'N/D'}
              </span>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-2">Descripción del espacio</h3>
            <p className="text-sm text-stone-700 leading-relaxed whitespace-pre-line">
              {property.description}
            </p>
          </div>

          {/* Amenities & Services */}
          <div>
            <h3 className="text-base font-bold text-stone-900 mb-3">Servicios y amenidades</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
              {property.amenities.map((item, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-50 border border-stone-200/60 text-xs font-medium text-stone-800"
                >
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Coexistence Rules & Rental Requirements */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3">
                <FileText className="w-4 h-4 text-emerald-800" />
                <span>Reglas de convivencia</span>
              </h4>
              <ul className="space-y-2 text-xs text-stone-600">
                {property.coexistenceRules.map((rule, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                    <span>{rule}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200">
              <h4 className="text-sm font-bold text-stone-900 flex items-center gap-2 mb-3">
                <ShieldCheck className="w-4 h-4 text-emerald-800" />
                <span>Requisitos de arrendamiento</span>
              </h4>
              <ul className="space-y-2 text-xs text-stone-600">
                {property.rentalRequirements.map((req, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-700 mt-1.5 shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Availability & Host Information (Clear marketplace intermediary distinction) */}
          <div className="p-6 rounded-3xl bg-forest-950 text-white flex flex-col md:flex-row md:items-center justify-between gap-6 shadow-lg">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-xs text-emerald-300">
                <Calendar className="w-4 h-4" />
                <span>Disponibilidad declarada: <strong>{property.availableDate}</strong></span>
              </div>
              <h3 className="text-lg font-bold">Publicado por {property.host.name}</h3>
              <p className="text-xs text-stone-300">
                {property.host.role} • Identidad verificada con documentación local en Montemorelos.
              </p>
              <div className="flex items-center gap-4 text-xs text-stone-400 pt-1">
                <span>Tasa de respuesta: <strong className="text-emerald-300">{property.host.responseRate}</strong></span>
                <span>•</span>
                <span>Tiempo habitual: <strong className="text-emerald-300">{property.host.responseTime}</strong></span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 shrink-0">
              <button
                onClick={() => onOpenContact(property)}
                className="px-6 py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-500 text-stone-950 font-bold text-sm shadow-md transition flex items-center justify-center gap-2 cursor-pointer"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Solicitar información / Visita</span>
              </button>
            </div>
          </div>

          {/* Transparency Disclaimer Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Aviso de transparencia NestFind</p>
              <p className="mt-0.5 text-amber-800">
                NestFind actúa como una plataforma intermediaria que conecta propietarios independientes con arrendatarios en Montemorelos.
                {property.isDemo && ' Esta es una ficha demostrativa con datos de prueba creada para evaluar el diseño y el visor 360°.'}
              </p>
            </div>
          </div>

          {/* Similar Properties in Montemorelos */}
          {similarProperties.length > 0 && (
            <div className="pt-4 border-t border-stone-200">
              <h4 className="text-base font-bold text-stone-900 mb-3">
                Otras opciones en Montemorelos
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {similarProperties.map((simProp) => (
                  <div
                    key={simProp.id}
                    onClick={() => {
                      onSelectSimilarProperty(simProp);
                      setSelectedPhotoIndex(0);
                      setActiveTab('photos');
                    }}
                    className="p-3 rounded-2xl border border-stone-200 hover:border-forest-700 bg-white hover:bg-stone-50 transition cursor-pointer flex items-center gap-3"
                  >
                    <img
                      src={simProp.images[0]}
                      alt={simProp.title}
                      className="w-16 h-16 rounded-xl object-cover"
                    />
                    <div className="min-w-0 flex-1">
                      <h5 className="font-bold text-xs text-stone-900 truncate">
                        {simProp.title}
                      </h5>
                      <p className="text-[11px] text-stone-500">{simProp.colonia}</p>
                      <span className="text-xs font-extrabold text-forest-800">
                        {formatPrice(simProp.price, simProp.period)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
