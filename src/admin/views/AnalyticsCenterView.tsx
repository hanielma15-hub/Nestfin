import React, { useState } from 'react';
import {
  BarChart3,
  Sparkles,
  Smartphone,
  Laptop,
  Tablet,
  TrendingUp,
  Eye,
  Clock,
  MessageSquare,
  ArrowDown,
  Filter,
  Download,
  Info,
} from 'lucide-react';
import { Property } from '../../types';
import { triggerCsvDownload, generateCsvContent } from '../adminPermissions';

interface AnalyticsCenterProps {
  properties: Property[];
}

export const AnalyticsCenterView: React.FC<AnalyticsCenterProps> = ({ properties }) => {
  const [selectedFunnelStage, setSelectedFunnelStage] = useState<number>(2); // 360 Tour default

  const funnelStages = [
    {
      id: 1,
      name: '1. Visitas a Catálogo',
      count: 1420,
      percent: 100,
      dropoff: null,
      insight: 'Tráfico orgánico atraído principalmente por búsquedas "rentas Montemorelos" y "cuartos UMontemorelos".',
    },
    {
      id: 2,
      name: '2. Vista de Detalle de Ficha',
      count: 880,
      percent: 62.0,
      dropoff: '38.0% de abandono',
      insight: 'Usuarios exploran amenidades, precio, colonia y reglas de convivencia.',
    },
    {
      id: 3,
      name: '3. Exploración Recorrido 360°',
      count: 582,
      percent: 41.0,
      dropoff: '21.0% de abandono',
      insight: 'Punto de mayor retención: usuarios que abren el 360° permanecen 4x más tiempo navegando estancias.',
    },
    {
      id: 4,
      name: '4. Contacto con Anfitrión',
      count: 256,
      percent: 18.0,
      dropoff: '23.0% de abandono',
      insight: 'Envío de mensaje, solicitud de llamada o consulta directa por WhatsApp.',
    },
    {
      id: 5,
      name: '5. Solicitud Formal / Visita Presencial',
      count: 104,
      percent: 7.3,
      dropoff: '10.7% de abandono',
      insight: 'Validación de fiador, depósito en garantía y entrega de documentos.',
    },
    {
      id: 6,
      name: '6. Renta Concretada & Comisión',
      count: 54,
      percent: 3.8,
      dropoff: '3.5% de abandono',
      insight: 'Firma de contrato de arrendamiento y cobro de comisión acordada.',
    },
  ];

  // Inventory analytics mock metrics based on actual properties
  const inventoryMetrics = properties.map((prop, idx) => {
    const hasTour = !!(prop.virtualTour?.enabled && prop.virtualTour.rooms.length > 0);
    const views = 120 + (idx * 45) + (hasTour ? 180 : 0);
    const inquiries = 12 + (idx * 5) + (hasTour ? 24 : 0);
    const conversionRate = Math.round((inquiries / views) * 100);
    const avgTimeMinutes = hasTour ? 4.5 : 1.2;

    return {
      id: prop.id,
      title: prop.title,
      type: prop.type,
      colonia: prop.colonia,
      postalCode: prop.postalCode,
      price: prop.price,
      hasTour,
      views,
      inquiries,
      conversionRate,
      avgTimeMinutes,
    };
  });

  const handleExportAnalyticsCsv = () => {
    const headers = ['ID', 'Título', 'Tipo', 'Colonia', 'C.P.', 'Precio MXN', 'Tiene 360', 'Vistas', 'Consultas', 'Tasa Conv %', 'Tiempo Prom (min)'];
    const rows = inventoryMetrics.map((item) => [
      item.id,
      item.title,
      item.type,
      item.colonia,
      item.postalCode,
      item.price,
      item.hasTour ? 'SÍ' : 'NO',
      item.views,
      item.inquiries,
      item.conversionRate,
      item.avgTimeMinutes,
    ]);
    const csv = generateCsvContent(headers, rows);
    triggerCsvDownload('nestfind_analitica_inventario_montemorelos', csv);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 font-display">
              Centro de Analítica & Rendimiento
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
              Datos Agregados
            </span>
          </div>
          <p className="text-stone-500 text-xs mt-1">
            Comportamiento de usuarios, impacto de recorridos virtuales 360° y embudo de conversión en Montemorelos.
          </p>
        </div>

        <button
          onClick={handleExportAnalyticsCsv}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Exportar Datos (.csv)</span>
        </button>
      </div>

      {/* 360° Tour Comparative Impact Banner */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-white p-6 rounded-2xl shadow-sm border border-forest-700">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-5 h-5 text-emerald-400" />
          <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
            Impacto Comprobado de los Recorridos 360° en Montemorelos
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="text-3xl font-extrabold text-white tracking-tight">3.4x</div>
            <div className="text-xs font-medium text-emerald-200 mt-1">Mayor tasa de consultas</div>
            <p className="text-[11px] text-stone-300 mt-2">
              Los inquilinos contactan 340% más a propiedades que permiten recorrer la habitación o casa en 360°.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="text-3xl font-extrabold text-white tracking-tight">4m 12s</div>
            <div className="text-xs font-medium text-emerald-200 mt-1">Permanencia promedio</div>
            <p className="text-[11px] text-stone-300 mt-2">
              Frente a tan solo 1m 05s en inmuebles con galerías de fotos tradicionales estáticas.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-xs p-4 rounded-xl border border-white/10">
            <div className="text-3xl font-extrabold text-white tracking-tight">-52%</div>
            <div className="text-xs font-medium text-emerald-200 mt-1">Visitas presenciales descartadas</div>
            <p className="text-[11px] text-stone-300 mt-2">
              Reduce pérdidas de tiempo para el anfitrión porque el interesado ya conoció la distribución exacta antes.
            </p>
          </div>
        </div>
      </div>

      {/* Interactive Conversion Funnel Section */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-5">
        <div>
          <h2 className="font-bold text-stone-900 text-base flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-700" />
            <span>Embudo de Conversión de Arrendamiento (Montemorelos)</span>
          </h2>
          <p className="text-xs text-stone-500 mt-1">
            Visualiza en qué punto los prospectos avanzan o abandonan el proceso de renta. Haz clic en cada etapa para ver su análisis.
          </p>
        </div>

        <div className="space-y-2">
          {funnelStages.map((stage) => {
            const isSelected = selectedFunnelStage === stage.id;
            return (
              <div
                key={stage.id}
                onClick={() => setSelectedFunnelStage(stage.id)}
                className={`p-3.5 rounded-xl border transition cursor-pointer ${
                  isSelected
                    ? 'border-emerald-500 bg-emerald-50/70 shadow-xs'
                    : 'border-stone-200 hover:border-stone-300 bg-white'
                }`}
              >
                <div className="flex items-center justify-between gap-4 text-xs">
                  <div className="flex items-center gap-2.5 font-semibold text-stone-800">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-700"></span>
                    <span>{stage.name}</span>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-bold text-stone-900">{stage.count.toLocaleString()} usuarios</span>
                    <span className="font-mono text-emerald-800 font-bold bg-white px-2 py-0.5 rounded border border-emerald-200">
                      {stage.percent}%
                    </span>
                    {stage.dropoff && (
                      <span className="text-[11px] text-stone-400 hidden sm:inline">
                        ({stage.dropoff})
                      </span>
                    )}
                  </div>
                </div>

                {/* Progress bar visualizing funnel width */}
                <div className="w-full bg-stone-100 h-2.5 rounded-full mt-2 overflow-hidden">
                  <div
                    className="h-full rounded-full transition-all duration-500 bg-gradient-to-r from-forest-800 to-emerald-600"
                    style={{ width: `${stage.percent}%` }}
                  ></div>
                </div>

                {/* Expanded detail when selected */}
                {isSelected && (
                  <div className="mt-3 pt-3 border-t border-emerald-200/80 text-xs text-stone-700 flex items-start gap-2">
                    <Info className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                    <div>
                      <strong className="text-emerald-950">Diagnóstico estratégico: </strong>
                      <span>{stage.insight}</span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Traffic Sources & Device Distribution */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Device breakdown */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm">Dispositivos Utilizados por Inquilinos</h3>

          <div className="space-y-3">
            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-2 text-stone-700 font-medium">
                  <Smartphone className="w-4 h-4 text-stone-500" />
                  Smartphones (iOS / Android)
                </span>
                <span className="font-bold text-stone-900">72.4%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-600 h-full rounded-full" style={{ width: '72.4%' }}></div>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Estudiantes y profesionistas exploran desde móviles.</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-2 text-stone-700 font-medium">
                  <Laptop className="w-4 h-4 text-stone-500" />
                  Computadoras de Escritorio / Laptops
                </span>
                <span className="font-bold text-stone-900">22.8%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-forest-800 h-full rounded-full" style={{ width: '22.8%' }}></div>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Familias comparando casas con plano y alberca.</p>
            </div>

            <div>
              <div className="flex items-center justify-between text-xs mb-1">
                <span className="flex items-center gap-2 text-stone-700 font-medium">
                  <Tablet className="w-4 h-4 text-stone-500" />
                  Tablets (iPads)
                </span>
                <span className="font-bold text-stone-900">4.8%</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '4.8%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Geographic Demand in Montemorelos */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
          <h3 className="font-bold text-stone-900 text-sm">Distribución de Demanda por Código Postal</h3>

          <div className="space-y-3">
            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-stone-800 block">C.P. 67510 (Fracc. Las Huertas)</span>
                <span className="text-[11px] text-stone-500">Perfil: Residencial familiar, quintas</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800">
                42% búsquedas
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-stone-800 block">C.P. 67500 (Zona Centro)</span>
                <span className="text-[11px] text-stone-500">Perfil: Departamentos ejecutivos, comercio</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-blue-100 text-blue-800">
                31% búsquedas
              </span>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between">
              <div>
                <span className="font-semibold text-xs text-stone-800 block">C.P. 67520 (Matamoros / UMontemorelos)</span>
                <span className="text-[11px] text-stone-500">Perfil: Estudiantes universitarios foráneos</span>
              </div>
              <span className="text-xs font-bold px-2.5 py-1 rounded-full bg-amber-100 text-amber-800">
                27% búsquedas
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Inventory Performance Table */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div>
            <h3 className="font-bold text-stone-900 text-sm">Desempeño Individual del Inventario Activo</h3>
            <p className="text-xs text-stone-500">Comparativa de vistas, consultas generadas y retención por propiedad.</p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold">
                <th className="py-2.5 px-3">Propiedad</th>
                <th className="py-2.5 px-3">Colonia / C.P.</th>
                <th className="py-2.5 px-3">Modalidad 360°</th>
                <th className="py-2.5 px-3">Vistas</th>
                <th className="py-2.5 px-3">Consultas</th>
                <th className="py-2.5 px-3">Tasa Conv.</th>
                <th className="py-2.5 px-3">Tiempo Prom.</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {inventoryMetrics.map((item) => (
                <tr key={item.id} className="hover:bg-stone-50/70 transition">
                  <td className="py-3 px-3 font-medium text-stone-800 max-w-xs truncate">
                    {item.title}
                  </td>
                  <td className="py-3 px-3 text-stone-600">
                    {item.colonia} ({item.postalCode})
                  </td>
                  <td className="py-3 px-3">
                    {item.hasTour ? (
                      <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        <Sparkles className="w-3 h-3" />
                        Tour 360° Activo
                      </span>
                    ) : (
                      <span className="text-[10px] font-semibold text-stone-400">
                        Solo Fotos
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-3 font-semibold text-stone-700">{item.views}</td>
                  <td className="py-3 px-3 font-semibold text-stone-900">{item.inquiries}</td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-700">{item.conversionRate}%</span>
                  </td>
                  <td className="py-3 px-3 text-stone-600">{item.avgTimeMinutes} min</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
