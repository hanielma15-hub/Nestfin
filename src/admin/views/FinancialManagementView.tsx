import React, { useState, useMemo } from 'react';
import {
  DollarSign,
  CheckCircle2,
  Clock,
  AlertTriangle,
  Download,
  Search,
  Filter,
  Sliders,
  FileText,
  Lock,
  Plus,
  ArrowUpDown,
} from 'lucide-react';
import {
  AdminRole,
  CommissionTransaction,
  CommissionSchemeConfig,
  FinancialStatus,
} from '../../types';
import {
  formatMxn,
  canModifyCommissionScheme,
  triggerCsvDownload,
  generateCsvContent,
  calculateCommission,
} from '../adminPermissions';

interface FinancialManagementProps {
  currentRole: AdminRole;
  transactions: CommissionTransaction[];
  schemes: CommissionSchemeConfig[];
  onUpdateTransactionStatus: (txId: string, newStatus: FinancialStatus) => void;
  onUpdateCommissionScheme: (updatedSchemes: CommissionSchemeConfig[]) => void;
}

export const FinancialManagementView: React.FC<FinancialManagementProps> = ({
  currentRole,
  transactions,
  schemes,
  onUpdateTransactionStatus,
  onUpdateCommissionScheme,
}) => {
  const [statusFilter, setStatusFilter] = useState<'todas' | FinancialStatus>('todas');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingSchemes, setEditingSchemes] = useState<CommissionSchemeConfig[]>(schemes);
  const [isEditingSchemeModalOpen, setIsEditingSchemeModalOpen] = useState(false);
  const [selectedReceiptTx, setSelectedReceiptTx] = useState<CommissionTransaction | null>(null);

  const canEditScheme = canModifyCommissionScheme(currentRole);

  // Financial calculations
  const totals = useMemo(() => {
    const grossRent = transactions.reduce((acc, t) => acc + t.rentAmount, 0);
    const totalCommissions = transactions.reduce((acc, t) => acc + t.commissionAmount, 0);
    const collected = transactions
      .filter((t) => t.status === 'cobrada')
      .reduce((acc, t) => acc + t.commissionAmount, 0);
    const pending = transactions
      .filter((t) => t.status === 'pendiente')
      .reduce((acc, t) => acc + t.commissionAmount, 0);
    const overdue = transactions
      .filter((t) => t.status === 'vencida')
      .reduce((acc, t) => acc + t.commissionAmount, 0);

    return { grossRent, totalCommissions, collected, pending, overdue };
  }, [transactions]);

  // Filtered transactions
  const filteredTransactions = useMemo(() => {
    return transactions.filter((tx) => {
      const matchStatus = statusFilter === 'todas' || tx.status === statusFilter;
      const q = searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        tx.propertyTitle.toLowerCase().includes(q) ||
        tx.hostName.toLowerCase().includes(q) ||
        tx.tenantName.toLowerCase().includes(q) ||
        tx.id.toLowerCase().includes(q);

      return matchStatus && matchQuery;
    });
  }, [transactions, statusFilter, searchQuery]);

  // CSV export
  const handleExportCsv = () => {
    const headers = [
      'ID Transacción',
      'Propiedad',
      'Anfitrión',
      'Inquilino',
      'Renta Mensual MXN',
      'Periodo',
      'Tasa Comisión %',
      'Comisión MXN',
      'Estatus',
      'Fecha Emisión',
      'Fecha Vencimiento',
      'Método de Pago',
      'Notas',
    ];
    const rows = filteredTransactions.map((tx) => [
      tx.id,
      tx.propertyTitle,
      tx.hostName,
      tx.tenantName,
      tx.rentAmount,
      tx.period,
      tx.commissionRatePercent,
      tx.commissionAmount,
      tx.status,
      tx.invoiceDate,
      tx.dueDate,
      tx.paymentMethod || 'Pendiente',
      tx.notes || '',
    ]);

    const csv = generateCsvContent(headers, rows);
    triggerCsvDownload('nestfind_comisiones_transacciones_montemorelos', csv);
  };

  const handleSaveSchemes = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateCommissionScheme(editingSchemes);
    setIsEditingSchemeModalOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 font-display">
              Administración Financiera & Comisiones
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Cuentas Claras
            </span>
          </div>
          <p className="text-stone-500 text-xs mt-1">
            Control de rentas brutas intermediadas, cobranza a anfitriones y esquemas de comisión acordados en Montemorelos.
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canEditScheme && (
            <button
              onClick={() => {
                setEditingSchemes(schemes);
                setIsEditingSchemeModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition cursor-pointer"
            >
              <Sliders className="w-3.5 h-3.5 text-stone-600" />
              <span>Esquema Tarifario</span>
            </button>
          )}

          <button
            onClick={handleExportCsv}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Exportar Transacciones (.csv)</span>
          </button>
        </div>
      </div>

      {/* Financial KPI Banner */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase">
            Renta Bruta Total
          </span>
          <div className="text-xl font-bold text-stone-900 mt-1">
            {formatMxn(totals.grossRent)}
          </div>
          <span className="text-[10px] text-stone-500">6 contratos intermediados</span>
        </div>

        <div className="bg-white p-4 rounded-xl border border-stone-200">
          <span className="text-[11px] font-semibold text-stone-400 block uppercase">
            Comisiones Totales
          </span>
          <div className="text-xl font-bold text-forest-900 mt-1">
            {formatMxn(totals.totalCommissions)}
          </div>
          <span className="text-[10px] text-emerald-700 font-medium">Promedio 8.3%</span>
        </div>

        <div className="bg-emerald-50/70 p-4 rounded-xl border border-emerald-200">
          <span className="text-[11px] font-semibold text-emerald-700 block uppercase flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3" />
            Cobradas
          </span>
          <div className="text-xl font-bold text-emerald-950 mt-1">
            {formatMxn(totals.collected)}
          </div>
          <span className="text-[10px] text-emerald-700">En banco / SPEI</span>
        </div>

        <div className="bg-amber-50/70 p-4 rounded-xl border border-amber-200">
          <span className="text-[11px] font-semibold text-amber-700 block uppercase flex items-center gap-1">
            <Clock className="w-3 h-3" />
            Por Cobrar
          </span>
          <div className="text-xl font-bold text-amber-950 mt-1">
            {formatMxn(totals.pending)}
          </div>
          <span className="text-[10px] text-amber-700">Dentro de fecha límite</span>
        </div>

        <div className="bg-rose-50/70 p-4 rounded-xl border border-rose-200">
          <span className="text-[11px] font-semibold text-rose-700 block uppercase flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            Vencidas
          </span>
          <div className="text-xl font-bold text-rose-950 mt-1">
            {formatMxn(totals.overdue)}
          </div>
          <span className="text-[10px] text-rose-700">Gestión de cobranza activa</span>
        </div>
      </div>

      {/* Commission Scheme Summary Cards */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <DollarSign className="w-4 h-4 text-emerald-700" />
            <span>Esquema de Comisiones Vigente en Montemorelos</span>
          </h2>
          {!canEditScheme && (
            <span className="text-[11px] text-stone-400 flex items-center gap-1">
              <Lock className="w-3 h-3" />
              Solo modificable por Superadministrador
            </span>
          )}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {schemes.map((scheme) => (
            <div key={scheme.id} className="p-4 rounded-xl bg-stone-50 border border-stone-200 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-stone-800">{scheme.label}</span>
                <span className="px-2 py-0.5 rounded text-xs font-bold bg-forest-800 text-white">
                  {scheme.ratePercent}%
                </span>
              </div>
              <p className="text-[11px] text-stone-500 leading-relaxed">{scheme.description}</p>
              <div className="pt-2 border-t border-stone-200 text-[11px] text-stone-600 font-medium">
                Tarifa mínima de intermediación: <strong>{formatMxn(scheme.minFixedFeeMxn)} MXN</strong>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Transactions Ledger Table */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        {/* Filters and search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-xs text-stone-500 font-medium">Filtrar por estatus:</span>
            {(['todas', 'cobrada', 'pendiente', 'vencida'] as const).map((st) => (
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
              placeholder="Buscar por anfitrión, título o ID..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
            />
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold">
                <th className="py-2.5 px-3">ID / Fecha</th>
                <th className="py-2.5 px-3">Propiedad</th>
                <th className="py-2.5 px-3">Anfitrión & Inquilino</th>
                <th className="py-2.5 px-3">Renta</th>
                <th className="py-2.5 px-3">Comisión</th>
                <th className="py-2.5 px-3">Estatus</th>
                <th className="py-2.5 px-3 text-right">Acciones</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredTransactions.map((tx) => (
                <tr key={tx.id} className="hover:bg-stone-50/70 transition">
                  <td className="py-3 px-3">
                    <span className="font-mono font-bold text-stone-800 block">{tx.id}</span>
                    <span className="text-[10px] text-stone-400">{tx.invoiceDate}</span>
                  </td>
                  <td className="py-3 px-3 max-w-xs font-medium text-stone-800">
                    <div className="truncate">{tx.propertyTitle}</div>
                    <span className="text-[10px] text-stone-500">Periodo: {tx.period}</span>
                  </td>
                  <td className="py-3 px-3 text-stone-700">
                    <div className="font-semibold text-stone-900">{tx.hostName}</div>
                    <div className="text-[10px] text-stone-500">Inquilino: {tx.tenantName}</div>
                  </td>
                  <td className="py-3 px-3 font-semibold text-stone-800">
                    {formatMxn(tx.rentAmount)}
                  </td>
                  <td className="py-3 px-3">
                    <span className="font-bold text-emerald-800 block">
                      {formatMxn(tx.commissionAmount)}
                    </span>
                    <span className="text-[10px] text-stone-400">({tx.commissionRatePercent}%)</span>
                  </td>
                  <td className="py-3 px-3">
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold capitalize ${
                        tx.status === 'cobrada'
                          ? 'bg-emerald-100 text-emerald-800'
                          : tx.status === 'pendiente'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {tx.status}
                    </span>
                  </td>
                  <td className="py-3 px-3 text-right">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        onClick={() => setSelectedReceiptTx(tx)}
                        className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                        title="Ver Recibo de Comisión"
                      >
                        <FileText className="w-4 h-4" />
                      </button>

                      {tx.status !== 'cobrada' && (
                        <button
                          onClick={() => onUpdateTransactionStatus(tx.id, 'cobrada')}
                          className="px-2 py-1 rounded-lg bg-emerald-700 text-white text-[11px] font-semibold hover:bg-emerald-800 transition cursor-pointer"
                        >
                          Cobrar
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Receipt Modal */}
      {selectedReceiptTx && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <FileText className="w-5 h-5 text-forest-800" />
                <h3 className="font-bold text-stone-900 text-sm">Recibo de Intermediación NestFind</h3>
              </div>
              <span className="font-mono text-xs text-stone-500 font-bold">{selectedReceiptTx.id}</span>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="bg-stone-50 p-3 rounded-xl space-y-1">
                <p><strong>Inmueble:</strong> {selectedReceiptTx.propertyTitle}</p>
                <p><strong>Anfitrión:</strong> {selectedReceiptTx.hostName}</p>
                <p><strong>Inquilino:</strong> {selectedReceiptTx.tenantName}</p>
                <p><strong>Ubicación:</strong> Montemorelos, Nuevo León</p>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Renta mensual pactada:</span>
                <span className="font-semibold">{formatMxn(selectedReceiptTx.rentAmount)} MXN</span>
              </div>

              <div className="flex justify-between py-1 border-b border-stone-100">
                <span>Tasa de comisión acordada ({selectedReceiptTx.commissionRatePercent}%):</span>
                <span className="font-semibold text-emerald-800">{formatMxn(selectedReceiptTx.commissionAmount)} MXN</span>
              </div>

              <div className="flex justify-between py-1">
                <span>Estatus de pago:</span>
                <span className="font-bold capitalize text-stone-900">{selectedReceiptTx.status}</span>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                onClick={() => setSelectedReceiptTx(null)}
                className="px-4 py-2 rounded-xl text-stone-700 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
              >
                Cerrar
              </button>
              <button
                onClick={() => {
                  alert(`Recibo para ${selectedReceiptTx.id} descargado en formato imprimible.`);
                  setSelectedReceiptTx(null);
                }}
                className="px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-semibold hover:bg-forest-700 cursor-pointer"
              >
                Imprimir / PDF
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Commission Scheme Config Modal (Superadmin) */}
      {isEditingSchemeModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleSaveSchemes}
            className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <div className="border-b border-stone-200 pb-3">
              <h3 className="font-bold text-stone-900 text-base">Configuración de Esquemas Tarifarios</h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Ajuste de comisiones porcentuales y tarifas mínimas para Montemorelos.
              </p>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {editingSchemes.map((sch, idx) => (
                <div key={sch.id} className="p-3.5 rounded-xl border border-stone-200 space-y-3">
                  <div className="font-semibold text-xs text-stone-800">{sch.label}</div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Tasa Comisión (%)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="25"
                        value={sch.ratePercent}
                        onChange={(e) => {
                          const updated = [...editingSchemes];
                          updated[idx] = { ...sch, ratePercent: parseFloat(e.target.value) || 0 };
                          setEditingSchemes(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold"
                        required
                      />
                    </div>

                    <div>
                      <label className="text-[11px] font-semibold text-stone-600 block mb-1">
                        Tarifa Mínima (MXN)
                      </label>
                      <input
                        type="number"
                        step="50"
                        min="0"
                        value={sch.minFixedFeeMxn}
                        onChange={(e) => {
                          const updated = [...editingSchemes];
                          updated[idx] = { ...sch, minFixedFeeMxn: parseInt(e.target.value, 10) || 0 };
                          setEditingSchemes(updated);
                        }}
                        className="w-full px-3 py-1.5 rounded-lg border border-stone-200 text-xs font-semibold"
                        required
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="flex items-center justify-end gap-2 pt-3 border-t border-stone-200">
              <button
                type="button"
                onClick={() => setIsEditingSchemeModalOpen(false)}
                className="px-4 py-2 rounded-xl text-stone-700 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-semibold hover:bg-forest-700 cursor-pointer"
              >
                Guardar Esquemas
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
