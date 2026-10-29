import React, { useState } from 'react';
import {
  X,
  Globe2,
  Plus,
  CheckCircle2,
  AlertTriangle,
  MapPin,
  Building,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
} from 'lucide-react';
import { Region } from '../types';

interface AdminExpansionModalProps {
  isOpen: boolean;
  onClose: () => void;
  regions: Region[];
  onToggleRegion: (regionId: string, newActiveState: boolean) => void;
  onCreateRegion: (regionData: Omit<Region, 'id' | 'listingCount' | 'waitlistCount'>) => void;
}

export const AdminExpansionModal: React.FC<AdminExpansionModalProps> = ({
  isOpen,
  onClose,
  regions,
  onToggleRegion,
  onCreateRegion,
}) => {
  const [showCreateForm, setShowCreateForm] = useState(false);
  const [name, setName] = useState('');
  const [state, setState] = useState('Nuevo León');
  const [code, setCode] = useState('');
  const [description, setDescription] = useState('');

  if (!isOpen) return null;

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onCreateRegion({
      name: name.trim(),
      state: state.trim(),
      code: code.trim() || `NL-${name.substring(0, 3).toUpperCase()}-0${regions.length + 1}`,
      isActivePublic: false,
      isComingSoon: true,
      description: description.trim() || `Nueva plaza de expansión en ${name}, ${state}.`,
    });

    setName('');
    setCode('');
    setDescription('');
    setShowCreateForm(false);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-4xl rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh] border border-stone-200">
        {/* Header */}
        <div className="p-5 border-b border-stone-200 flex items-center justify-between bg-stone-900 text-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-forest-800 flex items-center justify-center text-emerald-300">
              <Globe2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold">Gestión de Expansión de NestFind</h2>
              <p className="text-xs text-stone-300">
                Arquitectura multi-región para escalar a nuevas ciudades de México
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Cerrar módulo de expansión"
            className="p-2 rounded-xl text-stone-400 hover:text-white hover:bg-stone-800 transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {/* Official Launch Policy Notice */}
          <div className="p-4 rounded-2xl bg-amber-50 border border-amber-300/80 text-xs text-amber-900 flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-bold">Política de Lanzamiento Exclusivo</p>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                Durante el lanzamiento inicial, el catálogo público y el buscador se encuentran
                limitados estrictamente a <strong>Montemorelos, Nuevo León</strong>. Las demás plazas
                permanecen en estatus de preparación hasta que el administrador decida habilitar su
                operación pública.
              </p>
            </div>
          </div>

          {/* Action to create new expansion city */}
          <div className="flex items-center justify-between">
            <div>
              <h3 className="font-bold text-stone-900 text-sm">Plazas registradas en el sistema</h3>
              <p className="text-xs text-stone-500">
                {regions.filter((r) => r.isActivePublic).length} región activa pública •{' '}
                {regions.filter((r) => !r.isActivePublic).length} regiones en preparación
              </p>
            </div>

            <button
              onClick={() => setShowCreateForm(!showCreateForm)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-forest-900 hover:bg-forest-800 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <Plus className="w-4 h-4 text-emerald-300" />
              <span>{showCreateForm ? 'Cancelar' : 'Registrar nueva ciudad'}</span>
            </button>
          </div>

          {/* Form to add a new expansion region */}
          {showCreateForm && (
            <form
              onSubmit={handleCreateSubmit}
              className="p-5 rounded-2xl bg-stone-50 border border-stone-300/80 space-y-4 animate-fade-in"
            >
              <h4 className="font-bold text-xs uppercase tracking-wider text-stone-600">
                Registrar nueva región en evaluación
              </h4>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                    Ciudad / Municipio
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="ej. Cadereyta, San Pedro..."
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                    Estado
                  </label>
                  <input
                    type="text"
                    required
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                    Código geográfico
                  </label>
                  <input
                    type="text"
                    placeholder="ej. NL-CAD-06"
                    value={code}
                    onChange={(e) => setCode(e.target.value)}
                    className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[11px] font-bold uppercase text-stone-500 mb-1">
                  Descripción o nota estratégica
                </label>
                <input
                  type="text"
                  placeholder="ej. Zona con alto crecimiento habitacional e interés estudiantil..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs p-2.5 rounded-xl border border-stone-300 bg-white"
                />
              </div>

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowCreateForm(false)}
                  className="px-3 py-1.5 text-xs text-stone-600 hover:text-stone-900"
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-bold hover:bg-forest-700 shadow-xs"
                >
                  Guardar región
                </button>
              </div>
            </form>
          )}

          {/* Regions Cards List */}
          <div className="space-y-3">
            {regions.map((region) => {
              const isActive = region.isActivePublic;
              return (
                <div
                  key={region.id}
                  className={`p-4 rounded-2xl border transition flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                    isActive
                      ? 'bg-emerald-50/70 border-emerald-300 shadow-sm'
                      : 'bg-stone-50 border-stone-200'
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-stone-900">
                        {region.name}, {region.state}
                      </span>
                      <span className="font-mono text-[10px] px-2 py-0.5 rounded bg-stone-200/80 text-stone-700 font-semibold">
                        {region.code}
                      </span>
                      {isActive ? (
                        <span className="text-[11px] font-bold px-2 py-0.5 rounded-full bg-emerald-600 text-white flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          Activa en Catálogo Público
                        </span>
                      ) : (
                        <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-stone-200 text-stone-600">
                          En preparación (Oculta al público)
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-stone-500 max-w-xl">{region.description}</p>
                    <div className="flex items-center gap-4 text-xs text-stone-600 pt-1">
                      <span className="flex items-center gap-1">
                        <Building className="w-3.5 h-3.5 text-stone-400" />
                        <strong>{region.listingCount}</strong> inmuebles asociados
                      </span>
                      <span className="flex items-center gap-1">
                        <Users className="w-3.5 h-3.5 text-stone-400" />
                        <strong>{region.waitlistCount}</strong> personas en lista de espera
                      </span>
                    </div>
                  </div>

                  {/* Toggle Active Switch */}
                  <div className="shrink-0 flex items-center gap-3">
                    <button
                      onClick={() => onToggleRegion(region.id, !isActive)}
                      className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-xs font-bold transition shadow-xs cursor-pointer border ${
                        isActive
                          ? 'bg-white hover:bg-stone-100 text-stone-800 border-stone-300'
                          : 'bg-emerald-700 hover:bg-emerald-600 text-white border-emerald-800'
                      }`}
                    >
                      {isActive ? (
                        <>
                          <EyeOff className="w-3.5 h-3.5 text-stone-500" />
                          <span>Desactivar región</span>
                        </>
                      ) : (
                        <>
                          <Eye className="w-3.5 h-3.5 text-emerald-200" />
                          <span>Habilitar para el público</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-200 bg-stone-50 flex items-center justify-between text-xs text-stone-500">
          <span>Configuración centralizada para escalamiento geográfico.</span>
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-stone-900 text-white font-bold hover:bg-stone-800 transition"
          >
            Aceptar y volver
          </button>
        </div>
      </div>
    </div>
  );
};
