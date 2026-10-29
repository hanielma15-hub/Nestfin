import React, { useState } from 'react';
import {
  X,
  RotateCcw,
  Sparkles,
  Check,
  Building2,
  DollarSign,
  Calendar,
  Bed,
  Bath,
  Home,
  Dog,
  CheckCircle2,
  MapPin,
  Mail,
  AlertCircle,
  HelpCircle,
} from 'lucide-react';
import { FilterState, PropertyType, RentPeriod } from '../types';
import {
  INITIAL_FILTERS,
  MONTEMORELOS_COLONIAS,
  MONTEMORELOS_POSTAL_CODES,
  validateMontemorelosPostalCode,
} from '../utils/filterProperties';

interface FilterBarProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFilterChange: (updates: Partial<FilterState>) => void;
  onResetFilters: () => void;
  resultsCount: number;
}

const COMMON_AMENITIES = [
  'Clima',
  'Estacionamiento',
  'Wi-Fi',
  'Cocina integral',
  'Patio',
  'Lavandería',
  'Amueblado',
  'Seguridad',
];

export const FilterBar: React.FC<FilterBarProps> = ({
  isOpen,
  onClose,
  filters,
  onFilterChange,
  onResetFilters,
  resultsCount,
}) => {
  const [coloniaSearch, setColoniaSearch] = useState('');

  if (!isOpen) return null;

  const postalValidation = filters.postalCode
    ? validateMontemorelosPostalCode(filters.postalCode)
    : { isValid: true, codes: [], ranges: [], errorMessage: null };

  const toggleColonia = (coloniaName: string) => {
    const current = filters.colonias || [];
    if (current.includes(coloniaName)) {
      onFilterChange({
        colonias: current.filter((c) => c !== coloniaName),
      });
    } else {
      onFilterChange({
        colonias: [...current, coloniaName],
      });
    }
  };

  const toggleAmenity = (amenity: string) => {
    const exists = filters.amenities.includes(amenity);
    if (exists) {
      onFilterChange({
        amenities: filters.amenities.filter((a) => a !== amenity),
      });
    } else {
      onFilterChange({
        amenities: [...filters.amenities, amenity],
      });
    }
  };

  const filteredColoniasList = MONTEMORELOS_COLONIAS.filter((c) =>
    c.name.toLowerCase().includes(coloniaSearch.toLowerCase()) ||
    c.postalCode.includes(coloniaSearch)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/60 backdrop-blur-xs flex justify-end animate-fade-in">
      <div className="w-full max-w-xl bg-white h-full min-h-screen shadow-2xl flex flex-col justify-between">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between sticky top-0 bg-white z-10">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Filtros de búsqueda</h2>
            <p className="text-xs text-stone-500">Montemorelos, Nuevo León</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar filtros"
            className="p-2 rounded-xl text-stone-500 hover:text-stone-800 hover:bg-stone-100 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Filters Content */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1">
          {/* 360 Virtual Tour Highlighted Toggle */}
          <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-emerald-700 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-emerald-950">Solo con recorrido 360°</h4>
                <p className="text-xs text-emerald-700">Explora la propiedad en vista esférica interactiva</p>
              </div>
            </div>
            <button
              onClick={() => onFilterChange({ has360TourOnly: !filters.has360TourOnly })}
              role="switch"
              aria-checked={filters.has360TourOnly}
              aria-label="Filtrar solo con recorrido 360"
              className={`w-12 h-6 flex items-center rounded-full p-1 cursor-pointer transition duration-300 ${
                filters.has360TourOnly ? 'bg-emerald-700' : 'bg-stone-300'
              }`}
            >
              <div
                className={`bg-white w-4 h-4 rounded-full shadow-md transform transition duration-300 ${
                  filters.has360TourOnly ? 'translate-x-6' : 'translate-x-0'
                }`}
              />
            </button>
          </div>

          {/* CÓDIGO POSTAL EN MONTEMORELOS (Single, Comma or Range) */}
          <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <Mail className="w-4 h-4 text-emerald-700" />
                <span>Código Postal (Montemorelos)</span>
              </label>
              <span className="text-[11px] font-mono text-stone-400 bg-white px-2 py-0.5 rounded border border-stone-200">
                67500 - 67599
              </span>
            </div>

            <div>
              <div className="relative">
                <input
                  type="text"
                  placeholder="ej. 67500, o rango 67500-67520, o 67510, 67520..."
                  value={filters.postalCode}
                  onChange={(e) => onFilterChange({ postalCode: e.target.value })}
                  className={`w-full text-xs font-semibold p-3 rounded-xl border bg-white focus:outline-hidden ${
                    !postalValidation.isValid && filters.postalCode.trim()
                      ? 'border-rose-400 text-rose-800'
                      : 'border-stone-300 focus:border-forest-800 text-stone-900'
                  }`}
                />
                {filters.postalCode && (
                  <button
                    onClick={() => onFilterChange({ postalCode: '' })}
                    className="absolute right-3 top-3 text-stone-400 hover:text-stone-600"
                    aria-label="Borrar código postal"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* Validation Warning */}
              {!postalValidation.isValid && postalValidation.errorMessage && (
                <div className="mt-2 p-2 rounded-lg bg-rose-100/70 border border-rose-300 text-rose-900 text-[11px] flex items-start gap-1.5">
                  <AlertCircle className="w-3.5 h-3.5 shrink-0 text-rose-600 mt-0.5" />
                  <span>{postalValidation.errorMessage}</span>
                </div>
              )}

              {/* Success validation indicator */}
              {postalValidation.isValid && filters.postalCode.trim() && (
                <div className="mt-1.5 text-[11px] text-emerald-700 flex items-center gap-1 font-medium">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                  <span>Código postal válido para Montemorelos, N.L.</span>
                </div>
              )}
            </div>

            {/* Quick Postal Code Chips */}
            <div>
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block mb-1.5">
                Accesos rápidos por C.P.:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {MONTEMORELOS_POSTAL_CODES.slice(0, 5).map((pc) => {
                  const isActive = filters.postalCode === pc.code;
                  return (
                    <button
                      key={pc.code}
                      onClick={() =>
                        onFilterChange({
                          postalCode: isActive ? '' : pc.code,
                        })
                      }
                      className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition cursor-pointer ${
                        isActive
                          ? 'bg-forest-900 text-white border-forest-950 font-bold'
                          : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                      title={pc.description}
                    >
                      {pc.code} ({pc.description.split(',')[0]})
                    </button>
                  );
                })}
                <button
                  onClick={() => onFilterChange({ postalCode: '67500-67520' })}
                  className={`text-[11px] px-2.5 py-1 rounded-lg border font-mono transition cursor-pointer ${
                    filters.postalCode === '67500-67520'
                      ? 'bg-forest-900 text-white border-forest-950 font-bold'
                      : 'bg-white hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                  title="Rango: Centro a Las Huertas y Matamoros"
                >
                  Rango 67500-67520
                </button>
              </div>
            </div>
          </div>

          {/* COLONIAS EN MONTEMORELOS (Multiple selection) */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-700 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-emerald-700" />
                <span>Colonias en Montemorelos (Selección múltiple)</span>
              </label>
              {filters.colonias && filters.colonias.length > 0 && (
                <button
                  onClick={() => onFilterChange({ colonias: [] })}
                  className="text-[11px] text-emerald-800 hover:underline font-semibold"
                >
                  Limpiar colonias ({filters.colonias.length})
                </button>
              )}
            </div>

            {/* Quick search input within colonias list */}
            <input
              type="text"
              placeholder="Filtrar colonias (ej. Huertas, Centro, Matamoros)..."
              value={coloniaSearch}
              onChange={(e) => setColoniaSearch(e.target.value)}
              className="w-full text-xs p-2.5 rounded-xl border border-stone-200 bg-stone-50 mb-2 focus:bg-white focus:outline-hidden"
            />

            <div className="max-h-48 overflow-y-auto space-y-1.5 p-2 rounded-2xl bg-stone-50 border border-stone-200">
              {filteredColoniasList.map((col) => {
                const isSelected = filters.colonias?.includes(col.name);
                return (
                  <button
                    key={col.name}
                    type="button"
                    onClick={() => toggleColonia(col.name)}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-xs transition cursor-pointer text-left border ${
                      isSelected
                        ? 'bg-forest-900 text-white border-forest-950 shadow-xs'
                        : 'bg-white hover:bg-stone-100 text-stone-800 border-stone-200'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <div
                        className={`w-4 h-4 rounded-md flex items-center justify-center border ${
                          isSelected
                            ? 'bg-emerald-600 border-emerald-500 text-white'
                            : 'border-stone-300 bg-white'
                        }`}
                      >
                        {isSelected && <Check className="w-3 h-3 text-white" />}
                      </div>
                      <span className="font-semibold">{col.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                          isSelected
                            ? 'bg-forest-800 text-emerald-200'
                            : 'bg-stone-100 text-stone-500'
                        }`}
                      >
                        C.P. {col.postalCode}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Tipo de Inmueble */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
              Tipo de propiedad
            </label>
            <div className="grid grid-cols-2 gap-2">
              {[
                { type: 'todas', label: 'Todos los tipos' },
                { type: 'casa', label: 'Casa completa' },
                { type: 'departamento', label: 'Departamento' },
                { type: 'habitacion', label: 'Habitación / Cuarto' },
              ].map((item) => (
                <button
                  key={item.type}
                  onClick={() => onFilterChange({ type: item.type as PropertyType | 'todas' })}
                  className={`p-3 rounded-xl text-xs font-semibold text-left transition border cursor-pointer ${
                    filters.type === item.type
                      ? 'bg-forest-900 text-white border-forest-950 shadow-xs'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Periodicidad de Renta */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
              Modalidad de pago
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { period: 'todas', label: 'Cualquiera' },
                { period: 'quincenal', label: 'Quincenal' },
                { period: 'mensual', label: 'Mensual' },
              ].map((item) => (
                <button
                  key={item.period}
                  onClick={() => onFilterChange({ period: item.period as RentPeriod | 'todas' })}
                  className={`p-2.5 rounded-xl text-xs font-semibold text-center transition border cursor-pointer ${
                    filters.period === item.period
                      ? 'bg-forest-900 text-white border-forest-950'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Rango de Precio */}
          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="text-xs font-bold uppercase tracking-wider text-stone-500">
                Rango de precio (MXN)
              </label>
              <span className="text-xs font-bold text-forest-800">
                Hasta ${filters.maxPrice.toLocaleString('es-MX')} MXN
              </span>
            </div>
            <input
              type="range"
              min="2000"
              max="25000"
              step="500"
              value={filters.maxPrice}
              onChange={(e) => onFilterChange({ maxPrice: Number(e.target.value) })}
              className="w-full accent-emerald-700 cursor-pointer"
            />
            <div className="flex justify-between text-[11px] text-stone-400 mt-1">
              <span>$2,000 MXN</span>
              <span>$12,000 MXN</span>
              <span>$25,000+ MXN</span>
            </div>
          </div>

          {/* Habitaciones */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
              Habitaciones mínimas
            </label>
            <div className="flex gap-2">
              {[
                { val: 'todos', label: 'Cualquiera' },
                { val: 1, label: '1+' },
                { val: 2, label: '2+' },
                { val: 3, label: '3+' },
              ].map((item) => (
                <button
                  key={String(item.val)}
                  onClick={() => onFilterChange({ bedrooms: item.val as number | 'todos' })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                    filters.bedrooms === item.val
                      ? 'bg-forest-900 text-white border-forest-950'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Baños */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
              Baños completos
            </label>
            <div className="flex gap-2">
              {[
                { val: 'todos', label: 'Cualquiera' },
                { val: 1, label: '1+' },
                { val: 2, label: '2+' },
              ].map((item) => (
                <button
                  key={String(item.val)}
                  onClick={() => onFilterChange({ bathrooms: item.val as number | 'todos' })}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold transition border cursor-pointer ${
                    filters.bathrooms === item.val
                      ? 'bg-forest-900 text-white border-forest-950'
                      : 'bg-stone-50 hover:bg-stone-100 text-stone-700 border-stone-200'
                  }`}
                >
                  {item.label}
                </button>
              ))}
            </div>
          </div>

          {/* Amueblado y Mascotas */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Amueblado
              </label>
              <select
                value={String(filters.furnished)}
                onChange={(e) => {
                  const val = e.target.value === 'todos' ? 'todos' : e.target.value === 'true';
                  onFilterChange({ furnished: val });
                }}
                className="w-full text-xs font-medium p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              >
                <option value="todos">Todos</option>
                <option value="true">Amueblado</option>
                <option value="false">Sin amueblar</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2">
                Mascotas
              </label>
              <select
                value={String(filters.petsAllowed)}
                onChange={(e) => {
                  const val = e.target.value === 'todos' ? 'todos' : e.target.value === 'true';
                  onFilterChange({ petsAllowed: val });
                }}
                className="w-full text-xs font-medium p-2.5 rounded-xl border border-stone-200 bg-stone-50"
              >
                <option value="todos">Todos</option>
                <option value="true">Acepta mascotas</option>
                <option value="false">No permitidas</option>
              </select>
            </div>
          </div>

          {/* Amenidades */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wider text-stone-500 mb-2.5">
              Servicios y amenidades
            </label>
            <div className="flex flex-wrap gap-2">
              {COMMON_AMENITIES.map((amenity) => {
                const isSelected = filters.amenities.includes(amenity);
                return (
                  <button
                    key={amenity}
                    onClick={() => toggleAmenity(amenity)}
                    className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition cursor-pointer border ${
                      isSelected
                        ? 'bg-emerald-700 text-white border-emerald-800'
                        : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border-stone-200'
                    }`}
                  >
                    {isSelected && <Check className="w-3.5 h-3.5 text-emerald-200" />}
                    <span>{amenity}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between gap-3 sticky bottom-0">
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Limpiar filtros</span>
          </button>

          <button
            onClick={onClose}
            className="flex-1 py-3 px-4 rounded-xl bg-forest-900 hover:bg-forest-800 text-white font-bold text-xs shadow-md transition text-center"
          >
            Mostrar {resultsCount} {resultsCount === 1 ? 'resultado' : 'resultados'}
          </button>
        </div>
      </div>
    </div>
  );
};
