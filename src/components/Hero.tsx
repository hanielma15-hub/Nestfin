import React, { useState } from 'react';
import {
  Search,
  MapPin,
  Sparkles,
  Building2,
  Home,
  BedDouble,
  SlidersHorizontal,
  Mail,
  AlertCircle,
  X,
  Check,
} from 'lucide-react';
import { FilterState, PropertyType, Region } from '../types';
import {
  MONTEMORELOS_COLONIAS,
  MONTEMORELOS_POSTAL_CODES,
  validateMontemorelosPostalCode,
} from '../utils/filterProperties';

interface HeroProps {
  activeRegion: Region;
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onOpenAdvancedFilters: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  activeRegion,
  filters,
  onFilterChange,
  onOpenAdvancedFilters,
}) => {
  const [postalInput, setPostalInput] = useState(filters.postalCode || '');

  React.useEffect(() => {
    setPostalInput(filters.postalCode || '');
  }, [filters.postalCode]);

  const postalValidation = validateMontemorelosPostalCode(postalInput);

  const handlePostalChange = (val: string) => {
    setPostalInput(val);
    onFilterChange({ postalCode: val });
  };

  const propertyTypes: Array<{ type: PropertyType | 'todas'; label: string; icon: React.ReactNode }> = [
    { type: 'todas', label: 'Todos los tipos', icon: <Home className="w-4 h-4" /> },
    { type: 'casa', label: 'Casas', icon: <Building2 className="w-4 h-4" /> },
    { type: 'departamento', label: 'Departamentos', icon: <Building2 className="w-4 h-4" /> },
    { type: 'habitacion', label: 'Habitaciones', icon: <BedDouble className="w-4 h-4" /> },
  ];

  const toggleColonia = (coloniaName: string) => {
    const current = filters.colonias || [];
    if (current.includes(coloniaName)) {
      onFilterChange({ colonias: current.filter((c) => c !== coloniaName) });
    } else {
      onFilterChange({ colonias: [...current, coloniaName] });
    }
  };

  return (
    <div className="relative bg-gradient-to-b from-stone-100 via-sand-50 to-stone-50 border-b border-stone-200/60 pt-8 pb-12 overflow-hidden">
      {/* Subtle organic decorative background blurs */}
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-stone-300/30 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Launch City Pill */}
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-forest-900 text-white text-xs font-semibold mb-4 shadow-sm border border-forest-700/60">
          <MapPin className="w-3.5 h-3.5 text-emerald-300" />
          <span>Lanzamiento exclusivo en {activeRegion.name}, Nuevo León</span>
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400"></span>
        </div>

        {/* Hero Title & Subtitle */}
        <div className="max-w-3xl mb-8">
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-stone-900 tracking-tight font-display leading-[1.15]">
            Tu próximo hogar, <span className="text-forest-700 underline decoration-emerald-300 decoration-wavy decoration-2">más cerca</span>
          </h1>
          <p className="mt-3 text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
            Filtra por colonia y código postal en {activeRegion.name}.
            Explora cada rincón desde tu pantalla con recorridos virtuales inmersivos en 360° antes de visitar.
          </p>
        </div>

        {/* Main Search & Filter Console */}
        <div className="bg-white rounded-3xl p-3 sm:p-4 shadow-xl shadow-stone-900/5 border border-stone-200/90 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Ubicación / Búsqueda General */}
            <div className="md:col-span-4 px-3 py-2 rounded-2xl hover:bg-stone-50 transition border border-transparent hover:border-stone-200">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Búsqueda en Montemorelos
              </label>
              <div className="flex items-center gap-2 mt-1">
                <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
                <input
                  type="text"
                  placeholder="Colonia, calle o referencia..."
                  value={filters.searchQuery}
                  onChange={(e) => onFilterChange({ searchQuery: e.target.value })}
                  className="w-full text-sm font-semibold text-stone-800 placeholder:text-stone-400 bg-transparent focus:outline-hidden"
                />
              </div>
            </div>

            {/* Código Postal (Single, Comma or Range e.g. 67500-67520) */}
            <div className="md:col-span-3 px-3 py-2 rounded-2xl hover:bg-stone-50 transition border border-transparent hover:border-stone-200">
              <div className="flex items-center justify-between">
                <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                  Código Postal (C.P.)
                </label>
                <span className="text-[10px] text-stone-400 font-mono">675XX</span>
              </div>
              <div className="flex items-center gap-2 mt-1">
                <Mail className="w-4 h-4 text-emerald-700 shrink-0" />
                <input
                  type="text"
                  placeholder="ej. 67500 o 67500-67520"
                  value={postalInput}
                  onChange={(e) => handlePostalChange(e.target.value)}
                  className={`w-full text-sm font-semibold placeholder:text-stone-400 bg-transparent focus:outline-hidden ${
                    !postalValidation.isValid && postalInput.trim()
                      ? 'text-rose-600'
                      : 'text-stone-800'
                  }`}
                />
                {postalInput && (
                  <button
                    onClick={() => handlePostalChange('')}
                    className="text-stone-400 hover:text-stone-600 p-0.5"
                    aria-label="Borrar código postal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Tipo de Inmueble */}
            <div className="md:col-span-2 px-3 py-2 rounded-2xl hover:bg-stone-50 transition border border-transparent hover:border-stone-200">
              <label className="block text-[11px] font-bold uppercase tracking-wider text-stone-400">
                Tipo
              </label>
              <select
                value={filters.type}
                onChange={(e) => onFilterChange({ type: e.target.value as PropertyType | 'todas' })}
                aria-label="Tipo de inmueble"
                className="w-full text-sm font-semibold text-stone-800 bg-transparent focus:outline-hidden mt-1 cursor-pointer truncate"
              >
                <option value="todas">Todos</option>
                <option value="casa">Casas</option>
                <option value="departamento">Departamentos</option>
                <option value="habitacion">Habitaciones</option>
              </select>
            </div>

            {/* Action buttons (Filtros & 360 Toggle) */}
            <div className="md:col-span-3 flex items-center justify-end gap-2 pt-1 md:pt-0">
              <button
                onClick={onOpenAdvancedFilters}
                className="flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3 py-3 rounded-2xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-semibold text-xs transition cursor-pointer"
                title="Filtros avanzados de colonia, CP, precio y amenidades"
              >
                <SlidersHorizontal className="w-4 h-4 text-stone-600" />
                <span>Filtros</span>
                {(filters.colonias?.length > 0 || filters.postalCode) && (
                  <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
                )}
              </button>

              <button
                onClick={() => onFilterChange({ has360TourOnly: !filters.has360TourOnly })}
                aria-pressed={filters.has360TourOnly}
                className={`flex-1 md:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-3 rounded-2xl text-xs font-bold transition shadow-sm cursor-pointer border ${
                  filters.has360TourOnly
                    ? 'bg-emerald-700 text-white border-emerald-800 ring-2 ring-emerald-300'
                    : 'bg-emerald-50 text-emerald-900 border-emerald-300/80 hover:bg-emerald-100'
                }`}
              >
                <Sparkles className="w-3.5 h-3.5" />
                <span>360° {filters.has360TourOnly ? 'On' : 'Solo 360°'}</span>
              </button>
            </div>
          </div>

          {/* Real-time Postal Code Validation Message */}
          {!postalValidation.isValid && postalValidation.errorMessage && (
            <div className="mt-3 p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-xs text-rose-800 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{postalValidation.errorMessage}</span>
            </div>
          )}

          {/* Active Multi-Colonia selection chips preview */}
          {filters.colonias && filters.colonias.length > 0 && (
            <div className="mt-3 pt-3 border-t border-stone-100 flex flex-wrap items-center gap-1.5 text-xs">
              <span className="text-stone-400 font-semibold mr-1">Colonias seleccionadas:</span>
              {filters.colonias.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-forest-800 text-white text-[11px] font-medium"
                >
                  <span>{c}</span>
                  <button
                    onClick={() => toggleColonia(c)}
                    className="hover:text-rose-300 p-0.5 cursor-pointer"
                    aria-label={`Quitar filtro ${c}`}
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              <button
                onClick={() => onFilterChange({ colonias: [] })}
                className="text-[11px] text-stone-500 hover:text-stone-800 underline ml-1"
              >
                Limpiar colonias
              </button>
            </div>
          )}
        </div>

        {/* Quick Colonias & Postal Codes Shortcuts */}
        <div className="mt-4 flex items-center gap-2 overflow-x-auto pb-1 text-xs">
          <span className="text-stone-400 font-bold whitespace-nowrap uppercase tracking-wider text-[10px]">
            Colonias en Montemorelos:
          </span>
          {[
            { name: 'Centro', cp: '67500' },
            { name: 'Fraccionamiento Las Huertas', cp: '67510' },
            { name: 'Colonia Matamoros', cp: '67520' },
            { name: 'Gil de Leyva', cp: '67520' },
            { name: 'Bugambilias', cp: '67510' },
            { name: 'Fraccionamiento Universidad', cp: '67560' },
          ].map((col) => {
            const isSelected = filters.colonias?.includes(col.name);
            return (
              <button
                key={col.name}
                onClick={() => toggleColonia(col.name)}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full whitespace-nowrap transition cursor-pointer border ${
                  isSelected
                    ? 'bg-forest-900 text-white border-forest-950 font-bold shadow-xs'
                    : 'bg-white/80 hover:bg-white text-stone-700 border-stone-200/90 font-medium'
                }`}
              >
                {isSelected ? <Check className="w-3 h-3 text-emerald-300" /> : <MapPin className="w-3 h-3 text-emerald-700" />}
                <span>{col.name}</span>
                <span className={`text-[10px] font-mono px-1 rounded ${isSelected ? 'bg-forest-800 text-emerald-200' : 'bg-stone-100 text-stone-500'}`}>
                  {col.cp}
                </span>
              </button>
            );
          })}
        </div>

        {/* Property Category Chips */}
        <div className="flex items-center gap-2 mt-4 overflow-x-auto pb-1">
          {propertyTypes.map((item) => {
            const isSelected = filters.type === item.type;
            return (
              <button
                key={item.type}
                onClick={() => onFilterChange({ type: item.type })}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
                  isSelected
                    ? 'bg-forest-900 text-white border-forest-950 shadow-xs'
                    : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </button>
            );
          })}

          <button
            onClick={() => onFilterChange({ has360TourOnly: !filters.has360TourOnly })}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full text-xs font-semibold whitespace-nowrap transition cursor-pointer border ${
              filters.has360TourOnly
                ? 'bg-emerald-700 text-white border-emerald-800'
                : 'bg-emerald-50/80 hover:bg-emerald-100 text-emerald-800 border-emerald-200'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
            <span>Con recorrido 360°</span>
          </button>
        </div>
      </div>
    </div>
  );
};
