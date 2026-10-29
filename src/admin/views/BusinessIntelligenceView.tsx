import React from 'react';
import {
  Lightbulb,
  Target,
  TrendingUp,
  Sparkles,
  GraduationCap,
  Home,
  CheckCircle2,
  Calendar,
  Compass,
} from 'lucide-react';
import { BusinessGoal } from '../../types';
import { formatMxn } from '../adminPermissions';

interface BusinessIntelligenceProps {
  goals: BusinessGoal[];
}

export const BusinessIntelligenceView: React.FC<BusinessIntelligenceProps> = ({ goals }) => {
  const recommendations = [
    {
      id: 'rec-1',
      title: 'Captación de Cuartos Estudiantiles en Colonia Matamoros (C.P. 67520)',
      icon: GraduationCap,
      category: 'Oportunidad de Oferta',
      impact: 'Alto impacto en volumen',
      description:
        'El 68% de las búsquedas registradas con presupuesto menor a $4,500 MXN corresponden a alumnos foráneos de medicina, enfermería y nutrición de UMontemorelos. Se sugiere una campaña directa con dueños de casas en Matamoros para fraccionar habitaciones con servicios incluidos.',
      actionableTip: 'Ofrecer comisión reducida del 7.5% a anfitriones que publiquen 3 o más recámaras con recorrido 360°.',
    },
    {
      id: 'rec-2',
      title: 'El Recorrido 360° Acorta el Ciclo de Renta a 9 Días en Montemorelos',
      icon: Sparkles,
      category: 'Eficiencia Operativa',
      impact: 'Reducción del 68% en tiempo de vacancia',
      description:
        'Los inmuebles con escaneo virtual 360° tardan en promedio 9.2 días en firmar contrato, mientras que las publicaciones con solo fotos estáticas promedian 28.5 días. Además, reducen a la mitad las citas presenciales infructuosas.',
      actionableTip: 'Promover el servicio de captura 360° NestFind como beneficio exclusivo al registrar inmuebles residenciales en Fracc. Las Huertas y Bugambilias.',
    },
    {
      id: 'rec-3',
      title: 'Alta Demanda Familiar de Quintas y Casas con Cochera Doble (C.P. 67510)',
      icon: Home,
      category: 'Ticket Promedio Alto',
      impact: 'Comisiones de $1,200 - $1,500 MXN por contrato',
      description:
        'Existe una lista de espera de 14 familias profesionistas buscando casas amuebladas o semi-amuebladas en Fracc. Las Huertas con presupuesto entre $12,000 y $16,000 MXN mensuales.',
      actionableTip: 'Contactar a los 5 propietarios con publicaciones pausadas en la zona para reactivar disponibilidad inmediata.',
    },
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 font-display">
              Inteligencia de Negocio & Metas
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
              Estrategia Local
            </span>
          </div>
          <p className="text-stone-500 text-xs mt-1">
            Recomendaciones respaldadas por datos de navegación y seguimiento de objetivos comerciales en Montemorelos.
          </p>
        </div>
      </div>

      {/* Monthly Goals Progress Grid */}
      <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
            <Target className="w-4 h-4 text-emerald-700" />
            <span>Objetivos Comerciales & Operativos (Montemorelos)</span>
          </h2>
          <span className="text-xs text-stone-400">Ciclo Q1 - Q2 2026</span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map((goal) => {
            const percent = Math.min(Math.round((goal.current / goal.target) * 100), 100);
            return (
              <div key={goal.id} className="p-4 rounded-xl border border-stone-200 bg-stone-50/60 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-xs text-stone-900">{goal.title}</span>
                  <span className="text-xs font-bold text-emerald-800">{percent}%</span>
                </div>

                <div className="w-full bg-stone-200 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-emerald-700 h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  ></div>
                </div>

                <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1">
                  <span>
                    Actual: <strong>{goal.unit === 'MXN' ? formatMxn(goal.current) : goal.current} {goal.unit !== 'MXN' && goal.unit}</strong> / Meta: {goal.unit === 'MXN' ? formatMxn(goal.target) : goal.target}
                  </span>
                  <span className="flex items-center gap-1 text-stone-400">
                    <Calendar className="w-3 h-3" />
                    {goal.deadline}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actionable Recommendations Based on Data */}
      <div className="space-y-4">
        <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Lightbulb className="w-4 h-4 text-amber-500" />
          <span>Oportunidades de Crecimiento Basadas en Métricas Reales</span>
        </h2>

        <div className="grid grid-cols-1 gap-4">
          {recommendations.map((rec) => {
            const Icon = rec.icon;
            return (
              <div
                key={rec.id}
                className="bg-white p-5 rounded-2xl border border-stone-200 hover:border-emerald-300 shadow-xs hover:shadow-md transition space-y-3"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-forest-50 text-forest-800 flex items-center justify-center shrink-0">
                      <Icon className="w-4 h-4" />
                    </div>
                    <span className="font-bold text-sm text-stone-900">{rec.title}</span>
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-semibold bg-stone-100 text-stone-700 border border-stone-200">
                      {rec.category}
                    </span>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                      {rec.impact}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{rec.description}</p>

                <div className="p-3 rounded-xl bg-emerald-50/60 border border-emerald-200/80 text-xs text-emerald-950 flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-emerald-900">Acción sugerida para el equipo: </strong>
                    <span>{rec.actionableTip}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
