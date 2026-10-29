import React, { useState, useMemo } from 'react';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Home,
  Users,
  Compass,
  Sparkles,
  Clock,
  ArrowRight,
  AlertTriangle,
  CheckCircle2,
  Calendar,
  Filter,
} from 'lucide-react';
import { AdminRole, Property, CommissionTransaction, CrmLead } from '../../types';
import { formatMxn, canAccessFinancials } from '../adminPermissions';

interface ExecutiveDashboardProps {
  currentRole: AdminRole;
  properties: Property[];
  transactions: CommissionTransaction[];
  leads: CrmLead[];
  onNavigateTab: (tabId: string) => void;
}

export const ExecutiveDashboardView: React.FC<ExecutiveDashboardProps> = ({
  currentRole,
  properties,
  transactions,
  leads,
  onNavigateTab,
}) => {
  const [periodFilter, setPeriodFilter] = useState<'30d' | '7d' | 'este_mes' | 'trimestre'>('30d');
  const [coloniaFilter, setColoniaFilter] = useState<string>('todas');

  const hasFinancialAccess = canAccessFinancials(currentRole);

  // Financial metrics
  const financialTotals = useMemo(() => {
    const grossRentIntermediated = transactions.reduce((acc, t) => acc + t.rentAmount, 0);
    const totalCommissionsEarned = transactions.reduce((acc, t) => acc + t.commissionAmount, 0);
    const collectedCommissions = transactions
      .filter((t) => t.status === 'cobrada')
      .reduce((acc, t) => acc + t.commissionAmount, 0);
    const pendingCommissions = transactions
      .filter((t) => t.status === 'pendiente')
      .reduce((acc, t) => acc + t.commissionAmount, 0);

    return {
      grossRentIntermediated,
      totalCommissionsEarned,
      collectedCommissions,
      pendingCommissions,
    };
  }, [transactions]);

  // Inventory metrics
  const inventoryStats = useMemo(() => {
    const totalActive = properties.filter((p) => p.status === 'publicado').length;
    const with360Tour = properties.filter((p) => p.virtualTour?.enabled && p.virtualTour.rooms.length > 0).length;
    const pendingReview = properties.filter((p) => p.status === 'pendiente').length;
    return { totalActive, with360Tour, pendingReview };
  }, [properties]);

  // CRM metrics
  const crmStats = useMemo(() => {
    const totalLeads = leads.length;
    const overdueLeads = leads.filter((l) => l.isOverdue).length;
    const closedLeads = leads.filter((l) => l.stage === 'concretada').length;
    const activeInPipeline = leads.filter((l) => l.stage !== 'concretada' && l.stage !== 'descartada').length;
    const conversionRate = totalLeads > 0 ? Math.round((closedLeads / totalLeads) * 100) : 0;
    return { totalLeads, overdueLeads, closedLeads, activeInPipeline, conversionRate };
  }, [leads]);

  return (
    <div className="space-y-6">
      {/* Top Welcome & Global Filter Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 font-display">
              Tablero Ejecutivo Montemorelos
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Operación Activa
            </span>
          </div>
          <p className="text-stone-500 text-xs mt-1">
            Resumen en tiempo real del marketplace inmobiliario y operaciones locales en Montemorelos, N.L.
          </p>
        </div>

        {/* Global Filter Bar */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 text-xs">
            <Calendar className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={periodFilter}
              onChange={(e) => setPeriodFilter(e.target.value as any)}
              className="bg-transparent font-medium text-stone-700 outline-none cursor-pointer"
            >
              <option value="7d">Últimos 7 días</option>
              <option value="30d">Últimos 30 días</option>
              <option value="este_mes">Este mes (Marzo 2026)</option>
              <option value="trimestre">Primer Trimestre (Q1)</option>
            </select>
          </div>

          <div className="flex items-center gap-1.5 bg-stone-100 px-3 py-1.5 rounded-xl border border-stone-200 text-xs">
            <Filter className="w-3.5 h-3.5 text-stone-500" />
            <select
              value={coloniaFilter}
              onChange={(e) => setColoniaFilter(e.target.value)}
              className="bg-transparent font-medium text-stone-700 outline-none cursor-pointer"
            >
              <option value="todas">Todas las zonas (Montemorelos)</option>
              <option value="Centro">Zona Centro (67500)</option>
              <option value="Las Huertas">Fracc. Las Huertas (67510)</option>
              <option value="Matamoros">Colonia Matamoros (67520)</option>
              <option value="Gil de Leyva">Gil de Leyva (67512)</option>
            </select>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Intermediated Rent & Commissions (Only if role has financial clearance) */}
        {hasFinancialAccess ? (
          <div
            onClick={() => onNavigateTab('financials')}
            className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:shadow-md transition cursor-pointer group relative overflow-hidden"
          >
            <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-2">
              <span>Renta Bruta Intermediada</span>
              <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:scale-110 transition">
                <DollarSign className="w-4 h-4" />
              </div>
            </div>
            <div className="text-2xl font-bold text-stone-900 tracking-tight">
              {formatMxn(financialTotals.grossRentIntermediated)}
            </div>
            <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
              <TrendingUp className="w-3.5 h-3.5" />
              <span>+18.4% vs mes anterior</span>
            </div>
            <p className="text-[11px] text-stone-400 mt-2">
              Comisiones generadas: <strong className="text-stone-700">{formatMxn(financialTotals.totalCommissionsEarned)}</strong>
            </p>
          </div>
        ) : (
          <div className="bg-stone-50 p-5 rounded-2xl border border-dashed border-stone-300 text-stone-400 text-xs flex flex-col justify-center items-center text-center">
            <span className="font-semibold text-stone-600">Métricas Financieras Privadas</span>
            <span className="text-[11px] mt-1 text-stone-400">Restringido para rol técnico/soporte</span>
          </div>
        )}

        {/* KPI 2: Active Inventory */}
        <div
          onClick={() => onNavigateTab('inventory')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-2">
            <span>Propiedades Activas</span>
            <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center group-hover:scale-110 transition">
              <Home className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            {inventoryStats.totalActive}{' '}
            <span className="text-xs font-normal text-stone-400">inmuebles</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+3 nuevas esta semana</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            {inventoryStats.with360Tour} con Recorridos 360° ({Math.round((inventoryStats.with360Tour / (inventoryStats.totalActive || 1)) * 100)}%)
          </p>
        </div>

        {/* KPI 3: CRM Leads & Inquiries */}
        <div
          onClick={() => onNavigateTab('crm')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-2">
            <span>Prospectos & Leads en Pipeline</span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-700 flex items-center justify-center group-hover:scale-110 transition">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            {crmStats.activeInPipeline}{' '}
            <span className="text-xs font-normal text-stone-400">en proceso</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-emerald-700">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Tasa de cierre: {crmStats.conversionRate}%</span>
          </div>
          <div className="mt-2 flex items-center gap-1.5">
            {crmStats.overdueLeads > 0 ? (
              <span className="text-[11px] font-semibold text-rose-600 flex items-center gap-1">
                <AlertTriangle className="w-3 h-3" />
                {crmStats.overdueLeads} lead(s) vencidos (&gt;24h)
              </span>
            ) : (
              <span className="text-[11px] font-medium text-emerald-600 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                SLA al día
              </span>
            )}
          </div>
        </div>

        {/* KPI 4: 360 Tour Engagement & Response Time */}
        <div
          onClick={() => onNavigateTab('analytics')}
          className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 hover:shadow-md transition cursor-pointer group"
        >
          <div className="flex items-center justify-between text-stone-500 text-xs font-medium mb-2">
            <span>Rendimiento Recorridos 360°</span>
            <div className="w-8 h-8 rounded-xl bg-purple-50 text-purple-700 flex items-center justify-center group-hover:scale-110 transition">
              <Sparkles className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-bold text-stone-900 tracking-tight">
            3.4x <span className="text-xs font-normal text-stone-400">más consultas</span>
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-semibold text-purple-700">
            <Clock className="w-3.5 h-3.5" />
            <span>4m 12s tiempo promedio de vista</span>
          </div>
          <p className="text-[11px] text-stone-400 mt-2">
            vs 1m 05s en fotos estándar
          </p>
        </div>
      </div>

      {/* Actionable Alerts & Operations Quick-Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Urgent Actions & Pending Queue */}
        <div className="lg:col-span-2 bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-amber-500" />
              <span>Prioridades Operativas de Montemorelos</span>
            </h2>
            <button
              onClick={() => onNavigateTab('crm')}
              className="text-emerald-700 hover:text-emerald-800 text-xs font-semibold flex items-center gap-1 cursor-pointer"
            >
              <span>Ver todas</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-2.5">
            {leads.filter((l) => l.isOverdue).map((lead) => (
              <div
                key={lead.id}
                className="p-3.5 rounded-xl bg-amber-50/70 border border-amber-200 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-amber-900">{lead.applicantName}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-200 text-amber-900">
                      SLA Alerta: {lead.lastActivityHoursAgo}h sin contacto
                    </span>
                  </div>
                  <p className="text-xs text-amber-800 mt-0.5">
                    Interés en: {lead.propertyTitle} ({lead.propertyColonia})
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('crm')}
                  className="px-3 py-1.5 rounded-lg bg-amber-700 text-white text-xs font-semibold hover:bg-amber-800 transition shrink-0 cursor-pointer"
                >
                  Atender Lead
                </button>
              </div>
            ))}

            {hasFinancialAccess && transactions.filter((t) => t.status === 'vencida').map((tx) => (
              <div
                key={tx.id}
                className="p-3.5 rounded-xl bg-rose-50/70 border border-rose-200 flex items-center justify-between gap-4"
              >
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold text-rose-900">Comisión Vencida: {formatMxn(tx.commissionAmount)}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-rose-200 text-rose-900">
                      Venció el {tx.dueDate}
                    </span>
                  </div>
                  <p className="text-xs text-rose-800 mt-0.5">
                    Anfitrión: {tx.hostName} • Inmueble: {tx.propertyTitle}
                  </p>
                </div>
                <button
                  onClick={() => onNavigateTab('financials')}
                  className="px-3 py-1.5 rounded-lg bg-rose-700 text-white text-xs font-semibold hover:bg-rose-800 transition shrink-0 cursor-pointer"
                >
                  Cobranza
                </button>
              </div>
            ))}

            <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-800 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-stone-800">
                    Sello de Verificación NestFind
                  </p>
                  <p className="text-[11px] text-stone-500">
                    6 de 6 propiedades del catálogo cuentan con visita técnica y validación catastral.
                  </p>
                </div>
              </div>
              <button
                onClick={() => onNavigateTab('inventory')}
                className="text-xs font-semibold text-stone-600 hover:text-stone-900 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-white transition cursor-pointer"
              >
                Ver Catálogo
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Local Montemorelos Market Pulse */}
        <div className="bg-white p-5 rounded-2xl border border-stone-200 space-y-4">
          <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-700" />
            <span>Demanda por Zona en Montemorelos</span>
          </h2>

          <div className="space-y-3">
            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Fracc. Las Huertas (C.P. 67510)</span>
                <span>42% del interés</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-emerald-700 h-full rounded-full" style={{ width: '42%' }}></div>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Demanda alta de familias y casas con alberca.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Centro Histórico (C.P. 67500)</span>
                <span>31% del interés</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-forest-800 h-full rounded-full" style={{ width: '31%' }}></div>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Profesionistas y ejecutivos de comercio cítrico.</p>
            </div>

            <div>
              <div className="flex justify-between text-xs font-semibold text-stone-700 mb-1">
                <span>Col. Matamoros / UMontemorelos (67520)</span>
                <span>27% del interés</span>
              </div>
              <div className="w-full bg-stone-100 h-2 rounded-full overflow-hidden">
                <div className="bg-amber-600 h-full rounded-full" style={{ width: '27%' }}></div>
              </div>
              <p className="text-[11px] text-stone-400 mt-1">Estudiantes universitarios (medicina, enfermería, teología).</p>
            </div>
          </div>

          <div className="pt-2 border-t border-stone-100">
            <button
              onClick={() => onNavigateTab('bi')}
              className="w-full py-2 rounded-xl bg-forest-50 hover:bg-forest-100 text-forest-900 text-xs font-semibold transition flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <span>Ver Insights de Inteligencia de Negocio</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
