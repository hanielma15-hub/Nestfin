import React, { useState } from 'react';
import {
  X,
  Upload,
  Sparkles,
  Building2,
  MapPin,
  DollarSign,
  BedDouble,
  Bath,
  CheckCircle2,
  Trash2,
  Plus,
  Eye,
  AlertCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Layers,
} from 'lucide-react';
import { Property, PropertyStatus, PropertyType, RentPeriod, RoomPanorama } from '../types';
import { generateEquirectangularPanorama } from '../data/panoramaGenerator';
import { VirtualTour360Viewer } from './VirtualTour360Viewer';

interface PublishPropertyModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSaveProperty: (property: Property) => void;
}

export const PublishPropertyModal: React.FC<PublishPropertyModalProps> = ({
  isOpen,
  onClose,
  onSaveProperty,
}) => {
  const [currentStep, setCurrentStep] = useState(1);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<PropertyType>('departamento');
  const [colonia, setColonia] = useState('Centro');
  const [postalCode, setPostalCode] = useState('67500');
  const [referenceLocation, setReferenceLocation] = useState('');
  const [price, setPrice] = useState(6500);
  const [period, setPeriod] = useState<RentPeriod>('mensual');
  const [bedrooms, setBedrooms] = useState(2);
  const [bathrooms, setBathrooms] = useState(1);
  const [surfaceM2, setSurfaceM2] = useState(70);
  const [furnished, setFurnished] = useState(true);
  const [petsAllowed, setPetsAllowed] = useState(false);
  const [parkingSpots, setParkingSpots] = useState(1);
  const [description, setDescription] = useState('');
  const [availableDate, setAvailableDate] = useState('Inmediata');
  const [status, setStatus] = useState<PropertyStatus>('publicado');

  // Amenities
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([
    'Clima',
    'Internet de alta velocidad',
    'Cocina integral',
  ]);

  // Photos
  const [images, setImages] = useState<string[]>([
    'https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?auto=format&fit=crop&w=1200&q=80',
    'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
  ]);
  const [newImageUrl, setNewImageUrl] = useState('');

  // 360 Tour State
  const [hasTour, setHasTour] = useState(true);
  const [tourRooms, setTourRooms] = useState<RoomPanorama[]>([
    {
      id: 'r-sala',
      name: 'Sala Principal',
      type: 'sala',
      panoramaUrl: generateEquirectangularPanorama('depto_sala'),
      description: 'Estancia principal luminosa',
      isInitial: true,
      hotspots: [
        { id: 'h1', targetRoomId: 'r-cocina', label: 'Ver Cocina', yaw: 45, pitch: -5 },
      ],
    },
    {
      id: 'r-cocina',
      name: 'Cocina',
      type: 'cocina',
      panoramaUrl: generateEquirectangularPanorama('depto_cocina'),
      description: 'Cocina integral equipada',
      hotspots: [
        { id: 'h2', targetRoomId: 'r-sala', label: 'Volver a Sala', yaw: 180, pitch: 0 },
      ],
    },
  ]);

  const [previewingTour, setPreviewingTour] = useState(false);
  const [fileValidationMessage, setFileValidationMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  // Add room panorama
  const handleAddRoom = (roomType: 'sala' | 'cocina' | 'recamara' | 'bano' | 'patio') => {
    let theme: Parameters<typeof generateEquirectangularPanorama>[0] = 'depto_sala';
    let name = 'Nueva Habitación';

    if (roomType === 'sala') {
      theme = 'sala_familiar';
      name = 'Sala de estar';
    } else if (roomType === 'cocina') {
      theme = 'cocina_familiar';
      name = 'Cocina';
    } else if (roomType === 'recamara') {
      theme = 'recamara_principal';
      name = `Recámara ${tourRooms.length}`;
    } else if (roomType === 'bano') {
      theme = 'depto_bano';
      name = 'Baño';
    } else if (roomType === 'patio') {
      theme = 'patio_jardin';
      name = 'Patio y terraza';
    }

    const newRoom: RoomPanorama = {
      id: `room-${Date.now()}`,
      name,
      type: roomType,
      panoramaUrl: generateEquirectangularPanorama(theme),
      description: `Espacio de ${name} para el recorrido virtual`,
      hotspots: [],
    };

    setTourRooms([...tourRooms, newRoom]);
  };

  const handleDeleteRoom = (id: string) => {
    if (tourRooms.length <= 1) {
      alert('Un recorrido virtual requiere al menos un espacio.');
      return;
    }
    setTourRooms(tourRooms.filter((r) => r.id !== id));
  };

  // Handle uploading panorama file
  const handlePanoramaFileUpload = (e: React.ChangeEvent<HTMLInputElement>, roomId: string) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setFileValidationMessage('Por favor selecciona un archivo de imagen válido (JPG o PNG).');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const ratio = img.width / img.height;
        // Equirectangular projection ideally has a 2:1 ratio (e.g. 2048x1024)
        if (Math.abs(ratio - 2.0) > 0.3) {
          setFileValidationMessage(
            `Aviso de formato: La imagen subida tiene proporción ${ratio.toFixed(2)}:1. Los panoramas esféricos recomendados son equirectangulares 2:1 (ej. 2048x1024 o 4096x2048).`
          );
        } else {
          setFileValidationMessage('Imagen equirectangular validada correctamente (2:1).');
        }

        setTourRooms((prev) =>
          prev.map((r) => (r.id === roomId ? { ...r, panoramaUrl: dataUrl } : r))
        );
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  const handleFinish = () => {
    const newProp: Property = {
      id: `prop-${Date.now()}`,
      regionId: 'montemorelos-nl',
      title: title || 'Inmueble en Montemorelos',
      type,
      price,
      currency: 'MXN',
      period,
      isDemo: false,
      status,
      colonia,
      postalCode: postalCode.trim() || '67500',
      city: 'Montemorelos',
      state: 'Nuevo León',
      referenceLocation,
      bedrooms,
      bathrooms,
      surfaceM2,
      furnished,
      petsAllowed,
      parkingSpots,
      images,
      virtualTour: hasTour
        ? {
            enabled: true,
            isDemoTour: false,
            rooms: tourRooms,
          }
        : undefined,
      amenities: selectedAmenities,
      description:
        description ||
        `Excelente ${type} ubicado en ${colonia}, Montemorelos, Nuevo León. Equipado y listo para habitar.`,
      coexistenceRules: [
        'Respeto vecinal y normas de convivencia de la colonia.',
        'Mantenimiento puntual y cuidado de las instalaciones.',
      ],
      rentalRequirements: [
        '1 mes de depósito en garantía.',
        'Identificación oficial vigente.',
        'Comprobante de ingresos comprobables.',
      ],
      availableDate,
      host: {
        name: 'Propietario NestFind',
        role: 'Propietario particular',
        verifiedIdentity: true,
        responseRate: '100%',
        responseTime: 'En 30 minutos',
      },
    };

    onSaveProperty(newProp);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh] border border-stone-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-50">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="text-lg font-bold text-stone-900">Publicar propiedad para renta</h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Paso {currentStep} de 5 • Región activa: Montemorelos, Nuevo León
            </p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar asistente de publicación"
            className="p-2 rounded-xl text-stone-400 hover:text-stone-700 hover:bg-stone-200/60 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Wizard Steps Indicator */}
        <div className="px-6 py-3 bg-stone-100 border-b border-stone-200 flex items-center justify-between text-xs font-semibold overflow-x-auto gap-2">
          {[
            { step: 1, label: '1. Datos y Zona' },
            { step: 2, label: '2. Precio y Plazo' },
            { step: 3, label: '3. Características' },
            { step: 4, label: '4. Recorrido 360°' },
            { step: 5, label: '5. Revisión y Estado' },
          ].map((item) => (
            <div
              key={item.step}
              onClick={() => setCurrentStep(item.step)}
              className={`flex items-center gap-1.5 cursor-pointer px-3 py-1.5 rounded-xl transition whitespace-nowrap ${
                currentStep === item.step
                  ? 'bg-forest-900 text-white'
                  : currentStep > item.step
                  ? 'text-emerald-800 bg-emerald-100/70'
                  : 'text-stone-500 hover:bg-stone-200'
              }`}
            >
              <span>{item.label}</span>
            </div>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-6">
          {/* STEP 1: Datos y Zona */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-base">Información general del inmueble</h3>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                  Título del anuncio
                </label>
                <input
                  type="text"
                  placeholder="ej. Departamento céntrico equipado con balcón"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:border-forest-800 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                    Tipo de inmueble
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as PropertyType)}
                    className="w-full text-sm p-3 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="casa">Casa completa</option>
                    <option value="departamento">Departamento</option>
                    <option value="habitacion">Habitación / Cuarto en vivienda</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                    Región (Exclusiva de lanzamiento)
                  </label>
                  <input
                    type="text"
                    disabled
                    value="Montemorelos, Nuevo León (Activa)"
                    className="w-full text-sm p-3 rounded-xl border border-stone-200 bg-stone-100 text-stone-700 font-semibold cursor-not-allowed"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                    Colonia o Fraccionamiento
                  </label>
                  <input
                    type="text"
                    placeholder="ej. Centro, Las Huertas, Matamoros, Bugambilias..."
                    value={colonia}
                    onChange={(e) => setColonia(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:border-forest-800 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                    Código Postal (C.P.)
                  </label>
                  <input
                    type="text"
                    maxLength={5}
                    placeholder="ej. 67500"
                    value={postalCode}
                    onChange={(e) => setPostalCode(e.target.value)}
                    className="w-full text-sm p-3 rounded-xl border border-stone-300 font-mono focus:border-forest-800 focus:outline-hidden"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Montemorelos: 67500 - 67599
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                  Referencia local (opcional)
                </label>
                <input
                  type="text"
                  placeholder="ej. Frente al parque, a 3 cuadras del hospital..."
                  value={referenceLocation}
                  onChange={(e) => setReferenceLocation(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-stone-300 focus:border-forest-800 focus:outline-hidden"
                />
              </div>
            </div>
          )}

          {/* STEP 2: Precios y Plazos */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-base">Precio y periodicidad de renta</h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                    Precio de renta en MXN
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-3 text-stone-400 font-bold">$</span>
                    <input
                      type="number"
                      min="1000"
                      step="500"
                      value={price}
                      onChange={(e) => setPrice(Number(e.target.value))}
                      className="w-full text-sm p-3 pl-8 rounded-xl border border-stone-300 font-bold"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                    Periodicidad de pago
                  </label>
                  <select
                    value={period}
                    onChange={(e) => setPeriod(e.target.value as RentPeriod)}
                    className="w-full text-sm p-3 rounded-xl border border-stone-300 bg-white"
                  >
                    <option value="mensual">Mensual (Más común)</option>
                    <option value="quincenal">Quincenal (Frecuente para cuartos y estudiantes)</option>
                    <option value="trimestral">Trimestral (Estancias temporales o quintas)</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                  Disponibilidad de entrega
                </label>
                <input
                  type="text"
                  placeholder="ej. Inmediata o A partir del 1 de Noviembre"
                  value={availableDate}
                  onChange={(e) => setAvailableDate(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-stone-300"
                />
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs text-stone-600">
                <p className="font-semibold text-stone-800">Condiciones comerciales:</p>
                <p className="mt-1">
                  NestFind conecta a propietarios e inquilinos mediante un proceso transparente.
                  La periodicidad elegida se reflejará claramente en el catálogo público de Montemorelos.
                </p>
              </div>
            </div>
          )}

          {/* STEP 3: Características y Amenidades */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-base">Distribución y comodidades</h3>

              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                    Recámaras
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bedrooms}
                    onChange={(e) => setBedrooms(Number(e.target.value))}
                    className="w-full text-sm p-3 rounded-xl border border-stone-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                    Baños completos
                  </label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={bathrooms}
                    onChange={(e) => setBathrooms(Number(e.target.value))}
                    className="w-full text-sm p-3 rounded-xl border border-stone-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                    Estacionamientos
                  </label>
                  <input
                    type="number"
                    min="0"
                    max="6"
                    value={parkingSpots}
                    onChange={(e) => setParkingSpots(Number(e.target.value))}
                    className="w-full text-sm p-3 rounded-xl border border-stone-300 font-bold"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                    Metros cuadrados (m²)
                  </label>
                  <input
                    type="number"
                    min="15"
                    max="1000"
                    value={surfaceM2}
                    onChange={(e) => setSurfaceM2(Number(e.target.value))}
                    className="w-full text-sm p-3 rounded-xl border border-stone-300 font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                  <input
                    type="checkbox"
                    checked={furnished}
                    onChange={(e) => setFurnished(e.target.checked)}
                    className="w-4 h-4 text-emerald-700 rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-900">Totalmente amueblado</div>
                    <div className="text-[11px] text-stone-500">Incluye muebles básicos y camas</div>
                  </div>
                </label>

                <label className="flex items-center gap-3 p-3.5 rounded-xl border border-stone-200 cursor-pointer hover:bg-stone-50">
                  <input
                    type="checkbox"
                    checked={petsAllowed}
                    onChange={(e) => setPetsAllowed(e.target.checked)}
                    className="w-4 h-4 text-emerald-700 rounded"
                  />
                  <div>
                    <div className="text-xs font-bold text-stone-900">Mascotas permitidas</div>
                    <div className="text-[11px] text-stone-500">Se aceptan perros/gatos pequeños</div>
                  </div>
                </label>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-1">
                  Descripción completa
                </label>
                <textarea
                  rows={3}
                  placeholder="Detalla las características del inmueble, ventilación, acabados y cercanía con avenidas..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-sm p-3 rounded-xl border border-stone-300"
                />
              </div>
            </div>
          )}

          {/* STEP 4: SECCIÓN ESPECÍFICA RECORRIDO VIRTUAL 360° (Section 4D Requirement) */}
          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300/80 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-700 text-white flex items-center justify-center">
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-emerald-950 text-sm">
                      Recorrido Virtual 360° Interactivo
                    </h4>
                    <p className="text-xs text-emerald-800">
                      Permite que los interesados exploren cada habitación antes de agendar visita
                    </p>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setHasTour(!hasTour)}
                  className={`px-4 py-2 rounded-xl text-xs font-bold transition border cursor-pointer ${
                    hasTour
                      ? 'bg-emerald-700 text-white border-emerald-800'
                      : 'bg-white text-stone-700 border-stone-300'
                  }`}
                >
                  {hasTour ? 'Activado' : 'Desactivado'}
                </button>
              </div>

              {hasTour && (
                <div className="space-y-4">
                  {fileValidationMessage && (
                    <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-blue-900 text-xs flex items-center gap-2">
                      <HelpCircle className="w-4 h-4 shrink-0 text-blue-600" />
                      <span>{fileValidationMessage}</span>
                    </div>
                  )}

                  {/* Room Panoramas List */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <h4 className="text-xs font-bold uppercase tracking-wider text-stone-500">
                        Habitaciones del recorrido ({tourRooms.length})
                      </h4>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setPreviewingTour(!previewingTour)}
                          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-emerald-400" />
                          <span>{previewingTour ? 'Ocultar vista previa' : 'Vista previa 360°'}</span>
                        </button>
                      </div>
                    </div>

                    {/* Live 360 Tour Interactive Preview */}
                    {previewingTour && (
                      <div className="p-3 rounded-2xl bg-stone-900 border border-stone-800">
                        <div className="text-xs font-semibold text-emerald-300 mb-2 flex items-center justify-between">
                          <span>Vista previa interactiva en vivo</span>
                          <span className="text-stone-400">Arrastra para girar</span>
                        </div>
                        <VirtualTour360Viewer
                          tourData={{
                            enabled: true,
                            isDemoTour: false,
                            rooms: tourRooms,
                          }}
                          propertyTitle={title || 'Vista previa del inmueble'}
                          isModal={false}
                        />
                      </div>
                    )}

                    {/* Room Config Cards */}
                    <div className="space-y-3">
                      {tourRooms.map((room, index) => (
                        <div
                          key={room.id}
                          className="p-4 rounded-2xl bg-stone-50 border border-stone-200/90 space-y-3"
                        >
                          <div className="flex items-center justify-between gap-2">
                            <div className="flex items-center gap-2">
                              <span className="w-6 h-6 rounded-lg bg-stone-200 text-stone-700 text-xs font-bold flex items-center justify-center">
                                {index + 1}
                              </span>
                              <input
                                type="text"
                                value={room.name}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTourRooms((prev) =>
                                    prev.map((r) => (r.id === room.id ? { ...r, name: val } : r))
                                  );
                                }}
                                className="font-bold text-sm text-stone-900 bg-transparent border-b border-stone-300 focus:border-emerald-600 focus:outline-hidden"
                              />
                            </div>

                            <button
                              type="button"
                              onClick={() => handleDeleteRoom(room.id)}
                              aria-label="Eliminar habitación"
                              className="text-stone-400 hover:text-rose-600 p-1"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-center">
                            {/* Panorama Thumbnail Preview */}
                            <div className="sm:col-span-4 relative aspect-2/1 rounded-xl overflow-hidden bg-stone-900 border border-stone-300">
                              <img
                                src={room.panoramaUrl}
                                alt={room.name}
                                className="w-full h-full object-cover"
                              />
                              <span className="absolute bottom-1 right-1 px-1.5 py-0.5 rounded bg-black/60 text-[9px] text-white font-mono">
                                360°
                              </span>
                            </div>

                            {/* Controls to upload or change image */}
                            <div className="sm:col-span-8 space-y-2">
                              <div className="flex items-center gap-2">
                                <label className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 cursor-pointer shadow-xs">
                                  <Upload className="w-3.5 h-3.5 text-emerald-700" />
                                  <span>Subir foto panorámica equirectangular (2:1)</span>
                                  <input
                                    type="file"
                                    accept="image/*"
                                    onChange={(e) => handlePanoramaFileUpload(e, room.id)}
                                    className="hidden"
                                  />
                                </label>
                              </div>
                              <input
                                type="text"
                                placeholder="Descripción de este espacio (opcional)"
                                value={room.description || ''}
                                onChange={(e) => {
                                  const val = e.target.value;
                                  setTourRooms((prev) =>
                                    prev.map((r) =>
                                      r.id === room.id ? { ...r, description: val } : r
                                    )
                                  );
                                }}
                                className="w-full text-xs p-2 rounded-xl border border-stone-200 bg-white"
                              />
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Add Room Selector Buttons */}
                    <div className="pt-2">
                      <span className="text-xs font-semibold text-stone-600 block mb-2">
                        + Añadir habitación o espacio al recorrido:
                      </span>
                      <div className="flex flex-wrap gap-2">
                        {[
                          { type: 'sala', label: 'Sala de estar' },
                          { type: 'cocina', label: 'Cocina' },
                          { type: 'recamara', label: 'Recámara' },
                          { type: 'bano', label: 'Baño' },
                          { type: 'patio', label: 'Patio / Jardín' },
                        ].map((btn) => (
                          <button
                            key={btn.type}
                            type="button"
                            onClick={() => handleAddRoom(btn.type as any)}
                            className="px-3 py-1.5 rounded-xl border border-stone-300 bg-white hover:bg-stone-50 text-xs font-semibold text-stone-700 shadow-xs cursor-pointer flex items-center gap-1.5"
                          >
                            <Plus className="w-3.5 h-3.5 text-emerald-700" />
                            <span>{btn.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* STEP 5: Revisión y Estado de Anuncio (Section 9 Requirement) */}
          {currentStep === 5 && (
            <div className="space-y-4">
              <h3 className="font-bold text-stone-900 text-base">Estado del anuncio y publicación</h3>

              <div>
                <label className="block text-xs font-bold uppercase text-stone-500 mb-2">
                  Estado del anuncio
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                  {[
                    {
                      id: 'publicado',
                      label: 'Publicado',
                      desc: 'Visible en el catálogo público de Montemorelos',
                    },
                    {
                      id: 'pendiente',
                      label: 'Pendiente de revisión',
                      desc: 'En validación de datos con el equipo NestFind',
                    },
                    {
                      id: 'borrador',
                      label: 'Borrador',
                      desc: 'Solo visible en tu panel de propietario',
                    },
                    {
                      id: 'pausado',
                      label: 'Pausado',
                      desc: 'Temporalmente oculto sin borrar la información',
                    },
                    {
                      id: 'rentado',
                      label: 'Rentado',
                      desc: 'Propiedad con inquilino activo',
                    },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setStatus(s.id as PropertyStatus)}
                      className={`p-3 rounded-2xl text-left border transition cursor-pointer ${
                        status === s.id
                          ? 'bg-forest-900 text-white border-forest-950 shadow-sm'
                          : 'bg-stone-50 hover:bg-stone-100 text-stone-800 border-stone-200'
                      }`}
                    >
                      <div className="font-bold text-xs capitalize">{s.label}</div>
                      <div
                        className={`text-[11px] mt-0.5 ${
                          status === s.id ? 'text-stone-300' : 'text-stone-500'
                        }`}
                      >
                        {s.desc}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Summary Card */}
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 text-xs space-y-2">
                <div className="flex justify-between">
                  <span className="text-stone-500">Inmueble:</span>
                  <span className="font-bold text-stone-800">{title || 'Sin título'}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Ubicación:</span>
                  <span className="font-bold text-stone-800">{colonia}, Montemorelos, N.L.</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Precio y Plazo:</span>
                  <span className="font-bold text-forest-800">
                    ${price.toLocaleString('es-MX')} MXN / {period}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Recorrido 360°:</span>
                  <span className="font-bold text-emerald-800">
                    {hasTour ? `Activado (${tourRooms.length} habitaciones)` : 'Sin recorrido'}
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between">
          {currentStep > 1 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev - 1)}
              className="flex items-center gap-1.5 px-4 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-semibold hover:bg-stone-100 transition cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Anterior</span>
            </button>
          ) : (
            <div></div>
          )}

          {currentStep < 5 ? (
            <button
              onClick={() => setCurrentStep((prev) => prev + 1)}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-forest-900 text-white text-xs font-bold hover:bg-forest-800 transition cursor-pointer"
            >
              <span>Continuar</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={handleFinish}
              className="flex items-center gap-1.5 px-6 py-2.5 rounded-xl bg-emerald-700 text-white text-xs font-bold hover:bg-emerald-600 shadow-md transition cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>Confirmar y Guardar Anuncio</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
