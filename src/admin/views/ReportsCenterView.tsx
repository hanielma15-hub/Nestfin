import React, { useState } from 'react';
import {
  FileSpreadsheet,
  Download,
  Calendar,
  CheckCircle2,
  Table,
  Filter,
} from 'lucide-react';
import { Property, CommissionTransaction, CrmLead } from '../../types';
import { triggerCsvDownload, generateCsvContent, formatMxn } from '../adminPermissions';

interface ReportsCenterProps {
  properties: Property[];
  transactions: CommissionTransaction[];
  leads: CrmLead[];
}

export const ReportsCenterView: React.FC<ReportsCenterProps> = ({
  properties,
  transactions,
  leads,
}) => {
  const [selectedReportType, setSelectedReportType] = useState<
    'transacciones' | 'inventario' | 'leads' | 'tours360'
  >('transacciones');

  const handleDownloadReport = () => {
    if (selectedReportType === 'transacciones') {
      const headers = ['ID', 'Propiedad', 'Anfitrión', 'Inquilino', 'Renta MXN', 'Comisión %', 'Comisión MXN', 'Estatus', 'Fecha Emisión', 'Fecha Vencimiento'];
      const rows = transactions.map((t) => [
        t.id,
        t.propertyTitle,
        t.hostName,
        t.tenantName,
        t.rentAmount,
        t.commissionRatePercent,
        t.commissionAmount,
        t.status,
        t.invoiceDate,
        t.dueDate,
      ]);
      const csv = generateCsvContent(headers, rows);
      triggerCsvDownload('nestfind_reporte_financiero_transacciones', csv);
    } else if (selectedReportType === 'inventario') {
      const headers = ['ID', 'Título', 'Tipo', 'Colonia', 'C.P.', 'Precio MXN', 'Estatus', 'Tiene 360', 'Anfitrión'];
      const rows = properties.map((p) => [
        p.id,
        p.title,
        p.type,
        p.colonia,
        p.postalCode,
        p.price,
        p.status,
        p.virtualTour?.enabled ? 'SÍ' : 'NO',
        p.host.name,
      ]);
      const csv = generateCsvContent(headers, rows);
      triggerCsvDownload('nestfind_reporte_inventario_propiedades', csv);
    } else if (selectedReportType === 'leads') {
      const headers = ['ID', 'Nombre Prospecto', 'Teléfono', 'Email', 'Propiedad', 'Etapa Pipeline', 'Canal', 'Presupuesto MXN', 'Vencido SLA'];
      const rows = leads.map((l) => [
        l.id,
        l.applicantName,
        l.applicantPhone,
        l.applicantEmail,
        l.propertyTitle,
        l.stage,
        l.channel,
        l.monthlyBudget,
        l.isOverdue ? 'SÍ (>24h)' : 'NO',
      ]);
      const csv = generateCsvContent(headers, rows);
      triggerCsvDownload('nestfind_reporte_crm_prospectos', csv);
    } else {
      const headers = ['ID', 'Inmueble', 'Colonia', 'C.P.', 'Salas en 360', 'Vistas Estimadas', 'Permanencia Promedio (min)'];
      const rows = properties.map((p, idx) => [
        p.id,
        p.title,
        p.colonia,
        p.postalCode,
        p.virtualTour?.rooms.length || 0,
        140 + idx * 45,
        p.virtualTour?.enabled ? 4.4 : 1.1,
      ]);
      const csv = generateCsvContent(headers, rows);
      triggerCsvDownload('nestfind_reporte_rendimiento_360', csv);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 font-display">
              Centro de Reportes & Exportación
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              CSV Descargables
            </span>
          </div>
          <p className="text-stone-500 text-xs mt-1">
            Generación de archivos tabulares con codificación UTF-8 para análisis en Excel, Google Sheets o auditorías fiscales.
          </p>
        </div>

        <button
          onClick={handleDownloadReport}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto"
        >
          <Download className="w-4 h-4" />
          <span>Descargar Reporte Actual (.csv)</span>
        </button>
      </div>

      {/* Report Type Selector Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            id: 'transacciones',
            title: 'Finanzas & Comisiones',
            records: `${transactions.length} transacciones`,
            desc: 'Cobranza, comisiones pactadas, ingresos y fechas de vencimiento.',
          },
          {
            id: 'inventario',
            title: 'Inventario de Propiedades',
            records: `${properties.length} inmuebles`,
            desc: 'Catálogo de casas, departamentos y habitaciones en Montemorelos.',
          },
          {
            id: 'leads',
            title: 'Prospectos & CRM',
            records: `${leads.length} solicitudes`,
            desc: 'Historial de interesados, canal de origen y tiempos de atención.',
          },
          {
            id: 'tours360',
            title: 'Rendimiento 360°',
            records: 'Métricas agregadas',
            desc: 'Estadísticas de estancias virtuales, vistas y retención.',
          },
        ].map((card) => {
          const isSelected = selectedReportType === card.id;
          return (
            <div
              key={card.id}
              onClick={() => setSelectedReportType(card.id as any)}
              className={`p-4 rounded-xl border transition cursor-pointer ${
                isSelected
                  ? 'border-emerald-600 bg-emerald-50/70 shadow-xs'
                  : 'border-stone-200 bg-white hover:border-stone-300'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <FileSpreadsheet
                  className={`w-5 h-5 ${isSelected ? 'text-emerald-700' : 'text-stone-400'}`}
                />
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-stone-100 text-stone-600">
                  {card.records}
                </span>
              </div>
              <h3 className="font-bold text-xs text-stone-900">{card.title}</h3>
              <p className="text-[11px] text-stone-500 mt-1">{card.desc}</p>
            </div>
          );
        })}
      </div>

      {/* Live Table Preview */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Table className="w-4 h-4 text-emerald-700" />
            <h3 className="font-bold text-stone-900 text-sm">Vista Previa del Reporte</h3>
          </div>
          <span className="text-[11px] text-stone-400">
            Formato estándar compatible con Microsoft Excel y Google Sheets
          </span>
        </div>

        <div className="overflow-x-auto max-h-72">
          {selectedReportType === 'transacciones' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold">
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Propiedad</th>
                  <th className="py-2 px-3">Anfitrión</th>
                  <th className="py-2 px-3">Renta</th>
                  <th className="py-2 px-3">Comisión</th>
                  <th className="py-2 px-3">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {transactions.map((t) => (
                  <tr key={t.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-800">{t.id}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate">{t.propertyTitle}</td>
                    <td className="py-2.5 px-3">{t.hostName}</td>
                    <td className="py-2.5 px-3 font-semibold">{formatMxn(t.rentAmount)}</td>
                    <td className="py-2.5 px-3 text-emerald-800 font-bold">{formatMxn(t.commissionAmount)}</td>
                    <td className="py-2.5 px-3 capitalize">{t.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReportType === 'inventario' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold">
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Inmueble</th>
                  <th className="py-2 px-3">Colonia</th>
                  <th className="py-2 px-3">C.P.</th>
                  <th className="py-2 px-3">Precio</th>
                  <th className="py-2 px-3">Tour 360°</th>
                  <th className="py-2 px-3">Estatus</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-800">{p.id}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate font-medium">{p.title}</td>
                    <td className="py-2.5 px-3">{p.colonia}</td>
                    <td className="py-2.5 px-3 font-mono">{p.postalCode}</td>
                    <td className="py-2.5 px-3 font-semibold">{formatMxn(p.price)}</td>
                    <td className="py-2.5 px-3">{p.virtualTour?.enabled ? 'Sí' : 'No'}</td>
                    <td className="py-2.5 px-3 capitalize">{p.status}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReportType === 'leads' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold">
                  <th className="py-2 px-3">ID</th>
                  <th className="py-2 px-3">Prospecto</th>
                  <th className="py-2 px-3">Propiedad</th>
                  <th className="py-2 px-3">Canal</th>
                  <th className="py-2 px-3">Presupuesto</th>
                  <th className="py-2 px-3">Etapa</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 font-mono font-bold text-stone-800">{l.id}</td>
                    <td className="py-2.5 px-3 font-medium">{l.applicantName}</td>
                    <td className="py-2.5 px-3 max-w-xs truncate">{l.propertyTitle}</td>
                    <td className="py-2.5 px-3 capitalize">{l.channel}</td>
                    <td className="py-2.5 px-3 font-semibold">{formatMxn(l.monthlyBudget)}</td>
                    <td className="py-2.5 px-3 capitalize">{l.stage}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}

          {selectedReportType === 'tours360' && (
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold">
                  <th className="py-2 px-3">Propiedad</th>
                  <th className="py-2 px-3">Colonia / C.P.</th>
                  <th className="py-2 px-3">Estancias 360°</th>
                  <th className="py-2 px-3">Vistas Estimadas</th>
                  <th className="py-2 px-3">Tiempo Promedio</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {properties.map((p, idx) => (
                  <tr key={p.id} className="hover:bg-stone-50">
                    <td className="py-2.5 px-3 max-w-xs truncate font-medium">{p.title}</td>
                    <td className="py-2.5 px-3">{p.colonia} ({p.postalCode})</td>
                    <td className="py-2.5 px-3 font-semibold">{p.virtualTour?.rooms.length || 0} estancias</td>
                    <td className="py-2.5 px-3">{140 + idx * 45}</td>
                    <td className="py-2.5 px-3">{p.virtualTour?.enabled ? '4.4 min' : '1.1 min'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};
