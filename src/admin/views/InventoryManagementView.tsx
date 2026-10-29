import React, { useState, useMemo } from 'react';
import {
  Home,
  CheckCircle2,
  XCircle,
  PauseCircle,
  Eye,
  ShieldCheck,
  Search,
  Sparkles,
  AlertCircle,
  Download,
  CopyCheck,
  Filter,
} from 'lucide-react';
import { AdminRole, Property, PropertyStatus } from '../../types';
import {
  canApproveOrRejectProperties,
  triggerCsvDownload,
  generateCsvContent,
  formatMxn,
} from '../adminPermissions';

interface InventoryManagementProps {
  currentRole: AdminRole;
  properties: Property[];
  onUpdatePropertyStatus: (propertyId: string, newStatus: PropertyStatus, notes?: string) => void;
  onToggleVerifiedHost: (propertyId: string) => void;
  onPreviewProperty: (property: Property) => void;
}

export const InventoryManagementView: React.FC<InventoryManagementProps> = ({
  currentRole,
  properties,
  onUpdatePropertyStatus,
  onToggleVerifiedHost,
  onPreviewProperty,
}) => {
  const [statusFilter, setStatusFilter] = useState<'todas' | PropertyStatus>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [rejectingPropertyId, setRejectingPropertyId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [duplicateCheckResult, setDuplicateCheckResult] = useState<string | null>(null);

  const canApprove = canApproveOrRejectProperties(currentRole);

  const filteredProperties = useMemo(() => {
    return properties.filter((p) => {
      const matchStatus = statusFilter === 'todas' || p.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        p.title.toLowerCase().includes(q) ||
        p.colonia.toLowerCase().includes(q) ||
        p.postalCode.includes(q) ||
        p.host.name.toLowerCase().includes(q);

      return matchStatus && matchQuery;
    });
  }, [properties, statusFilter, searchQuery]);

  const handleConfirmRejection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!rejectingPropertyId || !rejectionReason.trim()) return;
    onUpdatePropertyStatus(rejectingPropertyId, 'borrador', `Rechazada: ${rejectionReason}`);
    setRejectingPropertyId(null);
    setRejectionReason('');
  };

  const handleDuplicateScan = () => {
    // Check if any listings share identical price and colonia
    const seen = new Map<string, string>();
    let duplicatesFound = 0;

    properties.forEach((p) => {
      const key = `${p.type}-${p.price}-${p.colonia}`;
      if (seen.has(key)) {
        duplicatesFound++;
      } else {
        seen.set(key, p.id);
      }
    });

    if (duplicatesFound === 0) {
      setDuplicateCheckResult('No se detectaron duplicados en Montemorelos. Todo el inventario es único.');
    } else {
      setDuplicateCheckResult(`Se identificaron ${duplicatesFound} posible(s) publicación(es) con tipo, colonia y precio idéntico para revisión.`);
    }
  };

  const handleExportInventoryCsv = () => {
    const headers = [
      'ID',
      'Título',
      'Tipo',
      'Estatus',
      'Colonia',
      'Código Postal',
      'Precio MXN',
      'Periodo',
      'Recámara(s)',
      'Baño(s)',
      'Tiene Tour 360',
      'Anfitrión',
      'Verificado',
    ];
    const rows = filteredProperties.map((p) => [
      p.id,
      p.title,
      p.type,
      p.status,
      p.colonia,
      p.postalCode,
      p.price,
      p.period,
      p.bedrooms,
      p.bathrooms,
      p.virtualTour?.enabled ? 'SÍ' : 'NO',
      p.host.name,
      p.host.verifiedIdentity ? 'SÍ' : 'NO',
    ]);
    const csv = generateCsvContent(headers, rows);
    triggerCsvDownload('nestfind_inventario_propiedades_montemorelos', csv);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 font-display">
              Gestión de Inventario & Publicaciones
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Montemorelos
            </span>
          </div>
          <p className="text-stone-500 text-xs mt-1">
            Supervisión, flujo de aprobación, sellos de verificación y auditoría del catálogo local.
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={handleDuplicateScan}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition cursor-pointer"
          >
            <CopyCheck className="w-3.5 h-3.5 text-stone-600" />
            <span>Auditar Duplicados</span>
          </button>

          <button
            onClick={handleExportInventoryCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Inventario (.csv)</span>
          </button>
        </div>
      </div>

      {duplicateCheckResult && (
        <div className="p-3.5 rounded-xl bg-blue-50 border border-blue-200 text-xs text-blue-900 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-blue-700 shrink-0" />
            <span>{duplicateCheckResult}</span>
          </div>
          <button
            onClick={() => setDuplicateCheckResult(null)}
            className="text-blue-700 hover:text-blue-900 font-bold ml-2 cursor-pointer"
          >
            ×
          </button>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-stone-500 font-medium">Estatus:</span>
            {(['todas', 'publicado', 'pendiente', 'pausado', 'rentado'] as const).map((st) => (
              <button
                key={st}
                onClick={() => setStatusFilter(st)}
                className={`px-3 py-1 rounded-lg text-xs font-semibold capitalize transition cursor-pointer ${
                  statusFilter === st
                    ? 'bg-forest-800 text-white shadow-xs'
                    : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                }`}
              >
                {st === 'todas' ? 'Todas' : st}
              </button>
            ))}
          </div>

          <div className="relative min-w-[240px]">
            <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por título, colonia, C.P. o anfitrión..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Properties Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold">
                <th className="py-2.5 px-3">Inmueble</th>
                <th className="py-2.5 px-3">Ubicación / C.P.</th>
                <th className="py-2.5 px-3">Precio</th>
                <th className="py-2.5 px-3">Recorrido 360°</th>
                <th className="py-2.5 px-3">Anfitrión</th>
                <th className="py-2.5 px-3">Estatus</th>
                <th className="py-2.5 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredProperties.map((p) => {
                const hasTour = !!(p.virtualTour?.enabled && p.virtualTour.rooms.length > 0);
                return (
                  <tr key={p.id} className="hover:bg-stone-50/70 transition">
                    <td className="py-3 px-3">
                      <div className="font-semibold text-stone-900 max-w-xs truncate">{p.title}</div>
                      <div className="text-[10px] text-stone-400 capitalize">
                        {p.type} • {p.bedrooms} rec. • {p.bathrooms} baño(s)
                      </div>
                    </td>

                    <td className="py-3 px-3 text-stone-700">
                      <div>{p.colonia}</div>
                      <span className="font-mono text-[10px] bg-stone-100 px-1 rounded text-stone-600">
                        C.P. {p.postalCode}
                      </span>
                    </td>

                    <td className="py-3 px-3 font-semibold text-stone-900">
                      {formatMxn(p.price)}
                      <span className="text-[10px] font-normal text-stone-400 block">/{p.period}</span>
                    </td>

                    <td className="py-3 px-3">
                      {hasTour ? (
                        <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                          <Sparkles className="w-3 h-3 text-emerald-600" />
                          {p.virtualTour?.rooms.length} estancias
                        </span>
                      ) : (
                        <span className="text-[10px] text-stone-400">Sin 360°</span>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <div className="font-medium text-stone-800">{p.host.name}</div>
                      <button
                        onClick={() => onToggleVerifiedHost(p.id)}
                        className="inline-flex items-center gap-1 text-[10px] font-semibold mt-0.5 cursor-pointer text-emerald-700 hover:underline"
                        title="Alternar verificación"
                      >
                        <ShieldCheck className="w-3 h-3" />
                        <span>{p.host.verifiedIdentity ? 'Verificado' : 'Sin verificar'}</span>
                      </button>
                    </td>

                    <td className="py-3 px-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                          p.status === 'publicado'
                            ? 'bg-emerald-100 text-emerald-800'
                            : p.status === 'pendiente'
                            ? 'bg-amber-100 text-amber-800'
                            : p.status === 'pausado'
                            ? 'bg-stone-200 text-stone-700'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {p.status}
                      </span>
                    </td>

                    <td className="py-3 px-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => onPreviewProperty(p)}
                          className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                          title="Ver ficha pública"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {canApprove && p.status === 'pendiente' && (
                          <>
                            <button
                              onClick={() => onUpdatePropertyStatus(p.id, 'publicado')}
                              className="px-2 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-semibold hover:bg-emerald-800 transition cursor-pointer"
                            >
                              Aprobar
                            </button>
                            <button
                              onClick={() => setRejectingPropertyId(p.id)}
                              className="px-2 py-1 rounded-lg bg-rose-700 text-white text-[11px] font-semibold hover:bg-rose-800 transition cursor-pointer"
                            >
                              Rechazar
                            </button>
                          </>
                        )}

                        {canApprove && p.status === 'publicado' && (
                          <button
                            onClick={() => onUpdatePropertyStatus(p.id, 'pausado')}
                            className="px-2 py-1 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-700 text-[11px] font-semibold transition cursor-pointer"
                          >
                            Pausar
                          </button>
                        )}

                        {canApprove && p.status === 'pausado' && (
                          <button
                            onClick={() => onUpdatePropertyStatus(p.id, 'publicado')}
                            className="px-2 py-1 rounded-lg bg-forest-800 text-white text-[11px] font-semibold hover:bg-forest-700 transition cursor-pointer"
                          >
                            Reactivar
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Rejection Modal with Mandatory Reason */}
      {rejectingPropertyId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleConfirmRejection}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="flex items-center gap-2 text-rose-700">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <h3 className="font-bold text-stone-900 text-base">Motivo de Rechazo Obligatorio</h3>
            </div>
            <p className="text-xs text-stone-500">
              Explica con claridad al propietario por qué no cumple con los estándares de NestFind en Montemorelos (ej. fotografías deficientes, código postal incongruente o falta de acreditación).
            </p>

            <textarea
              rows={3}
              value={rejectionReason}
              onChange={(e) => setRejectionReason(e.target.value)}
              placeholder="Ej. Las fotografías son de baja resolución y no corresponden con la colonia especificada..."
              className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-rose-600"
              required
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => {
                  setRejectingPropertyId(null);
                  setRejectionReason('');
                }}
                className="px-4 py-2 rounded-xl text-stone-700 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition cursor-pointer"
              >
                Confirmar Rechazo
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
