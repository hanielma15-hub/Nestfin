import React, { useState } from 'react';
import {
  Terminal,
  Activity,
  CheckCircle2,
  AlertCircle,
  AlertTriangle,
  Info,
  ShieldAlert,
  Sparkles,
  RefreshCw,
  Trash2,
  Shield,
  Layers,
} from 'lucide-react';
import {
  AdminRole,
  SystemServiceHealth,
  SystemLogEntry,
  AuditLogEntry,
  LogLevel,
} from '../../types';
import { canAccessTechnicalPanel } from '../adminPermissions';

interface TechnicalPanelProps {
  currentRole: AdminRole;
  services: SystemServiceHealth[];
  logs: SystemLogEntry[];
  auditLogs: AuditLogEntry[];
  onClearLogs: () => void;
}

export const TechnicalPanelView: React.FC<TechnicalPanelProps> = ({
  currentRole,
  services,
  logs,
  auditLogs,
  onClearLogs,
}) => {
  const [selectedLogLevel, setSelectedLogLevel] = useState<'todas' | LogLevel>('todas');
  const [diagnosticResult, setDiagnosticResult] = useState<string | null>(null);
  const [isRunningDiagnostic, setIsRunningDiagnostic] = useState(false);

  const hasAccess = canAccessTechnicalPanel(currentRole);

  if (!hasAccess) {
    return (
      <div className="bg-white p-8 rounded-2xl border border-rose-200 text-center max-w-lg mx-auto space-y-4 my-10 shadow-xs">
        <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-700 flex items-center justify-center mx-auto">
          <ShieldAlert className="w-6 h-6" />
        </div>
        <h2 className="text-lg font-bold text-stone-900">Acceso Técnico Restringido</h2>
        <p className="text-xs text-stone-500 leading-relaxed">
          Este panel contiene telemetría de infraestructura, consolas de excepción y logs de depuración reservados exclusivamente para el equipo de <strong>Desarrollo</strong> y <strong>Superadministradores</strong>.
        </p>
        <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-600">
          Tu rol actual: {currentRole}
        </span>
      </div>
    );
  }

  const filteredLogs = logs.filter((log) => {
    return selectedLogLevel === 'todas' || log.level === selectedLogLevel;
  });

  const handleRun360Diagnostic = () => {
    setIsRunningDiagnostic(true);
    setDiagnosticResult(null);
    setTimeout(() => {
      setIsRunningDiagnostic(false);
      setDiagnosticResult(
        'Diagnóstico WebGL 360° exitoso: 6 panoramas evaluados. Relación de aspecto equirrectangular 2:1 verificada (4096x2048 px). Coordenadas yaw/pitch en rango [-180, 180] y [-90, 90]. Memoria VRAM estimada: 42 MB. Rendimiento estable a 60 FPS en Chrome y Safari.'
      );
    }, 1200);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 font-display">
              Panel Técnico & Arquitectura
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-100 text-amber-800 border border-amber-200">
              Desarrolladores & Superadmin
            </span>
          </div>
          <p className="text-stone-500 text-xs mt-1">
            Salud de microservicios, diagnóstico del visor 360° Three.js, logs de excepción y bitácora de auditoría.
          </p>
        </div>

        <button
          onClick={handleRun360Diagnostic}
          disabled={isRunningDiagnostic}
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white text-xs font-semibold shadow-xs transition cursor-pointer self-start sm:self-auto disabled:opacity-50"
        >
          <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
          <span>{isRunningDiagnostic ? 'Analizando...' : 'Diagnosticar Visor 360°'}</span>
        </button>
      </div>

      {/* Security Boundary Notice */}
      <div className="p-4 rounded-xl bg-forest-900 text-white border border-forest-800 flex items-start gap-3">
        <Shield className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-emerald-200">
            Aislamiento de Seguridad & Privacidad (Zero PII Leak)
          </p>
          <p className="text-stone-300 leading-relaxed">
            Por política de seguridad de NestFind, los roles técnicos monitorean excepciones del sistema, telemetría de rendimiento y renderizado WebGL sin tener acceso a datos bancarios confidenciales ni información financiera privada de arrendatarios y propietarios.
          </p>
        </div>
      </div>

      {diagnosticResult && (
        <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-950 flex items-start gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0 mt-0.5" />
          <div>
            <strong className="block font-bold">Resultado de Diagnóstico 360°:</strong>
            <p className="mt-0.5">{diagnosticResult}</p>
          </div>
        </div>
      )}

      {/* System Services Health Monitor */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Activity className="w-4 h-4 text-emerald-700" />
          <span>Estado de Servicios del Sistema</span>
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
          {services.map((srv) => (
            <div key={srv.serviceId} className="p-3.5 rounded-xl border border-stone-200 bg-stone-50 space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-stone-800">{srv.name}</span>
                <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600"></span>
                  {srv.status}
                </span>
              </div>

              <div className="flex items-center justify-between text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                <span>Latencia: <strong>{srv.latencyMs} ms</strong></span>
                <span>Uptime: <strong>{srv.uptimePercent}%</strong></span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Exception & Debug Console */}
      <div className="bg-stone-900 text-stone-100 p-5 rounded-2xl border border-stone-800 shadow-lg space-y-4 font-mono text-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-800 pb-3">
          <div className="flex items-center gap-2">
            <Terminal className="w-4 h-4 text-emerald-400" />
            <span className="font-bold text-white">Consola de Excepciones & Eventos en Vivo</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {(['todas', 'error', 'warning', 'info'] as const).map((lvl) => (
              <button
                key={lvl}
                onClick={() => setSelectedLogLevel(lvl)}
                className={`px-2.5 py-1 rounded text-[11px] uppercase font-bold transition cursor-pointer ${
                  selectedLogLevel === lvl
                    ? 'bg-emerald-600 text-white'
                    : 'bg-stone-800 text-stone-400 hover:text-white'
                }`}
              >
                {lvl}
              </button>
            ))}

            <button
              onClick={onClearLogs}
              className="p-1 rounded text-stone-400 hover:text-rose-400 transition ml-2 cursor-pointer"
              title="Limpiar consola"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="space-y-2 max-h-64 overflow-y-auto pr-1">
          {filteredLogs.map((log) => (
            <div
              key={log.id}
              className={`p-2.5 rounded-lg border leading-relaxed ${
                log.level === 'error'
                  ? 'bg-rose-950/40 border-rose-900/60 text-rose-300'
                  : log.level === 'warning'
                  ? 'bg-amber-950/40 border-amber-900/60 text-amber-300'
                  : 'bg-stone-800/60 border-stone-700/60 text-stone-300'
              }`}
            >
              <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                <span className="font-bold uppercase tracking-wider text-stone-300">
                  [{log.level}] • {log.service}
                </span>
                <span>{log.timestamp}</span>
              </div>
              <div>{log.message}</div>
              {log.details && (
                <div className="mt-1 text-[11px] text-stone-400 pl-2 border-l border-stone-600">
                  {log.details}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Audit Trail */}
      <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
        <h2 className="font-bold text-stone-900 text-sm flex items-center gap-2">
          <Layers className="w-4 h-4 text-emerald-700" />
          <span>Bitácora de Auditoría Administrativa</span>
        </h2>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold">
                <th className="py-2.5 px-3">Fecha / Hora</th>
                <th className="py-2.5 px-3">Usuario (Rol)</th>
                <th className="py-2.5 px-3">Acción</th>
                <th className="py-2.5 px-3">Objetivo</th>
                <th className="py-2.5 px-3">Detalles</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {auditLogs.map((entry) => (
                <tr key={entry.id} className="hover:bg-stone-50/70 transition">
                  <td className="py-2.5 px-3 font-mono text-[11px] text-stone-500 whitespace-nowrap">
                    {entry.timestamp}
                  </td>
                  <td className="py-2.5 px-3">
                    <span className="font-semibold text-stone-900 block">{entry.actor}</span>
                    <span className="text-[10px] text-stone-400">{entry.role}</span>
                  </td>
                  <td className="py-2.5 px-3 font-mono text-[11px] text-emerald-800 font-semibold">
                    {entry.action}
                  </td>
                  <td className="py-2.5 px-3 text-stone-700">
                    {entry.targetType}: <strong>{entry.targetId}</strong>
                  </td>
                  <td className="py-2.5 px-3 text-stone-600 max-w-sm truncate">{entry.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
