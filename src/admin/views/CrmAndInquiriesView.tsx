import React, { useState } from 'react';
import {
  Users,
  MessageSquare,
  AlertTriangle,
  Clock,
  Phone,
  Mail,
  Calendar,
  CheckCircle2,
  Plus,
  ArrowRight,
  Filter,
  FileCheck,
  LifeBuoy,
} from 'lucide-react';
import {
  AdminRole,
  CrmLead,
  CrmLeadStage,
  SupportTicket,
  SupportTicketStatus,
} from '../../types';
import { canManageLeads, formatMxn } from '../adminPermissions';

interface CrmAndInquiriesProps {
  currentRole: AdminRole;
  leads: CrmLead[];
  tickets: SupportTicket[];
  onUpdateLeadStage: (leadId: string, newStage: CrmLeadStage) => void;
  onAddLeadNote: (leadId: string, note: string) => void;
  onUpdateTicketStatus: (ticketId: string, status: SupportTicketStatus, resolutionNote?: string) => void;
  onCreateTicket: (ticket: Omit<SupportTicket, 'id' | 'createdAt'>) => void;
}

const STAGES_CONFIG: { id: CrmLeadStage; label: string; color: string }[] = [
  { id: 'nuevo', label: 'Nuevo Contacto', color: 'bg-blue-100 text-blue-800 border-blue-200' },
  { id: 'seguimiento', label: 'En Seguimiento', color: 'bg-amber-100 text-amber-800 border-amber-200' },
  { id: 'visita', label: 'Visita Agendada', color: 'bg-purple-100 text-purple-800 border-purple-200' },
  { id: 'solicitud', label: 'Solicitud Formal', color: 'bg-teal-100 text-teal-800 border-teal-200' },
  { id: 'concretada', label: 'Concretada', color: 'bg-emerald-100 text-emerald-800 border-emerald-200' },
  { id: 'descartada', label: 'Descartada', color: 'bg-stone-100 text-stone-600 border-stone-200' },
];

export const CrmAndInquiriesView: React.FC<CrmAndInquiriesProps> = ({
  currentRole,
  leads,
  tickets,
  onUpdateLeadStage,
  onAddLeadNote,
  onUpdateTicketStatus,
  onCreateTicket,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'pipeline' | 'tickets'>('pipeline');
  const [viewMode, setViewMode] = useState<'kanban' | 'table'>('kanban');
  const [selectedLead, setSelectedLead] = useState<CrmLead | null>(null);
  const [newNoteInput, setNewNoteInput] = useState('');
  const [resolvingTicketId, setResolvingTicketId] = useState<string | null>(null);
  const [resolutionText, setResolutionText] = useState('');

  const canManage = canManageLeads(currentRole);

  const handleAddNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLead || !newNoteInput.trim()) return;
    onAddLeadNote(selectedLead.id, newNoteInput.trim());
    setSelectedLead({
      ...selectedLead,
      notes: [...selectedLead.notes, newNoteInput.trim()],
    });
    setNewNoteInput('');
  };

  const handleResolveTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (!resolvingTicketId) return;
    onUpdateTicketStatus(resolvingTicketId, 'resuelta', resolutionText);
    setResolvingTicketId(null);
    setResolutionText('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-xl font-bold text-stone-900 font-display">
              CRM, Prospectos & Atención a Clientes
            </h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
              Pipeline Activo
            </span>
          </div>
          <p className="text-stone-500 text-xs mt-1">
            Seguimiento a interesados, tiempo de respuesta a arrendatarios e incidencias en Montemorelos.
          </p>
        </div>

        {/* Sub-tab Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-100 p-1 rounded-xl">
          <button
            onClick={() => setActiveSubTab('pipeline')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'pipeline'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Users className="w-3.5 h-3.5" />
            <span>Pipeline Leads ({leads.length})</span>
          </button>

          <button
            onClick={() => setActiveSubTab('tickets')}
            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition cursor-pointer flex items-center gap-1.5 ${
              activeSubTab === 'tickets'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <LifeBuoy className="w-3.5 h-3.5" />
            <span>Incidencias Soporte ({tickets.filter((t) => t.status !== 'resuelta').length})</span>
          </button>
        </div>
      </div>

      {/* PIPELINE TAB */}
      {activeSubTab === 'pipeline' && (
        <div className="space-y-4">
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs">
              <span className="text-stone-500">Vista:</span>
              <button
                onClick={() => setViewMode('kanban')}
                className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  viewMode === 'kanban' ? 'bg-forest-800 text-white' : 'bg-stone-100 text-stone-600'
                }`}
              >
                Tablero Kanban
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`px-3 py-1 rounded-lg font-semibold transition cursor-pointer ${
                  viewMode === 'table' ? 'bg-forest-800 text-white' : 'bg-stone-100 text-stone-600'
                }`}
              >
                Lista Detallada
              </button>
            </div>

            <div className="flex items-center gap-2 text-xs text-stone-500">
              <Clock className="w-3.5 h-3.5 text-amber-600" />
              <span>Alerta SLA: &gt;24 hrs sin contacto</span>
            </div>
          </div>

          {/* Kanban Board */}
          {viewMode === 'kanban' ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-3 overflow-x-auto pb-4">
              {STAGES_CONFIG.map((stage) => {
                const stageLeads = leads.filter((l) => l.stage === stage.id);
                return (
                  <div
                    key={stage.id}
                    className="bg-stone-100/70 p-3 rounded-2xl border border-stone-200/80 flex flex-col min-w-[200px]"
                  >
                    <div className="flex items-center justify-between mb-3 px-1">
                      <span className="text-xs font-bold text-stone-800">{stage.label}</span>
                      <span className="w-5 h-5 rounded-full bg-white text-stone-600 text-[10px] font-bold flex items-center justify-center border border-stone-200">
                        {stageLeads.length}
                      </span>
                    </div>

                    <div className="space-y-2.5 flex-1">
                      {stageLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`p-3 rounded-xl bg-white border shadow-xs hover:shadow-md transition cursor-pointer space-y-2 ${
                            lead.isOverdue ? 'border-amber-400 bg-amber-50/30' : 'border-stone-200'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-1">
                            <span className="font-semibold text-xs text-stone-900 block truncate">
                              {lead.applicantName}
                            </span>
                            {lead.isOverdue && (
                              <span
                                className="px-1.5 py-0.5 rounded bg-rose-100 text-rose-800 text-[9px] font-bold shrink-0"
                                title="Más de 24 horas sin respuesta"
                              >
                                ! SLA
                              </span>
                            )}
                          </div>

                          <p className="text-[11px] text-stone-600 line-clamp-2">
                            {lead.propertyTitle}
                          </p>

                          <div className="flex items-center justify-between text-[10px] text-stone-400 pt-1 border-t border-stone-100">
                            <span className="capitalize">{lead.channel}</span>
                            <span className="font-bold text-stone-700">{formatMxn(lead.monthlyBudget)}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Table View */
            <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-stone-200 bg-stone-50 text-stone-600 font-semibold">
                    <th className="py-2.5 px-3">Prospecto</th>
                    <th className="py-2.5 px-3">Propiedad Solicitada</th>
                    <th className="py-2.5 px-3">Canal</th>
                    <th className="py-2.5 px-3">Presupuesto</th>
                    <th className="py-2.5 px-3">Etapa</th>
                    <th className="py-2.5 px-3">Asignado</th>
                    <th className="py-2.5 px-3 text-right">Acción</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {leads.map((lead) => (
                    <tr key={lead.id} className="hover:bg-stone-50/70 transition">
                      <td className="py-3 px-3">
                        <div className="font-semibold text-stone-900">{lead.applicantName}</div>
                        <div className="text-[10px] text-stone-400">{lead.applicantPhone}</div>
                      </td>
                      <td className="py-3 px-3 text-stone-700 max-w-xs truncate">
                        {lead.propertyTitle}
                      </td>
                      <td className="py-3 px-3 capitalize text-stone-600">{lead.channel}</td>
                      <td className="py-3 px-3 font-semibold text-stone-800">
                        {formatMxn(lead.monthlyBudget)}
                      </td>
                      <td className="py-3 px-3">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700">
                          {lead.stage}
                        </span>
                      </td>
                      <td className="py-3 px-3 text-stone-600">{lead.assignedTo}</td>
                      <td className="py-3 px-3 text-right">
                        <button
                          onClick={() => setSelectedLead(lead)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold text-[11px] cursor-pointer"
                        >
                          Ver
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* TICKETS TAB */}
      {activeSubTab === 'tickets' && (
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-stone-900 text-sm">Tickets de Atención e Incidencias</h2>
          </div>

          <div className="space-y-3">
            {tickets.map((tkt) => (
              <div
                key={tkt.id}
                className="p-4 rounded-xl border border-stone-200 bg-stone-50/50 space-y-2 hover:border-stone-300 transition"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">{tkt.title}</span>
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        tkt.priority === 'alta'
                          ? 'bg-rose-100 text-rose-800'
                          : tkt.priority === 'media'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-stone-200 text-stone-700'
                      }`}
                    >
                      Prioridad {tkt.priority}
                    </span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-bold capitalize self-start sm:self-auto ${
                      tkt.status === 'resuelta'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-blue-100 text-blue-800'
                    }`}
                  >
                    {tkt.status}
                  </span>
                </div>

                <p className="text-xs text-stone-600 leading-relaxed">{tkt.description}</p>

                <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-stone-500 pt-2 border-t border-stone-200">
                  <div>
                    Solicitante: <strong>{tkt.applicantName}</strong> ({tkt.applicantContact})
                  </div>

                  <div className="flex items-center gap-2">
                    {tkt.status !== 'resuelta' && (
                      <button
                        onClick={() => setResolvingTicketId(tkt.id)}
                        className="px-3 py-1 rounded-lg bg-forest-800 text-white font-semibold hover:bg-forest-700 transition cursor-pointer"
                      >
                        Marcar Resuelto
                      </button>
                    )}
                  </div>
                </div>

                {tkt.resolutionNote && (
                  <div className="mt-2 p-2 rounded bg-emerald-50 text-[11px] text-emerald-900 border border-emerald-200">
                    <strong>Resolución:</strong> {tkt.resolutionNote}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Lead Detail & Actions Modal */}
      {selectedLead && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div>
                <h3 className="font-bold text-stone-900 text-base">{selectedLead.applicantName}</h3>
                <span className="text-xs text-stone-400">Prospecto ID: {selectedLead.id}</span>
              </div>
              <button
                onClick={() => setSelectedLead(null)}
                className="text-stone-400 hover:text-stone-600 text-lg cursor-pointer"
              >
                ×
              </button>
            </div>

            <div className="space-y-3 text-xs text-stone-700">
              <div className="bg-stone-50 p-3.5 rounded-xl space-y-1">
                <p><strong>Propiedad solicitada:</strong> {selectedLead.propertyTitle}</p>
                <p><strong>Colonia:</strong> {selectedLead.propertyColonia}</p>
                <p><strong>Presupuesto:</strong> {formatMxn(selectedLead.monthlyBudget)} MXN</p>
                <p><strong>Fecha estimada mudanza:</strong> {selectedLead.desiredMoveInDate}</p>
                <p><strong>Teléfono:</strong> {selectedLead.applicantPhone}</p>
                <p><strong>Email:</strong> {selectedLead.applicantEmail}</p>
              </div>

              {/* Stage switch buttons */}
              <div>
                <label className="font-bold text-stone-800 block mb-1.5">Mover etapa en Pipeline:</label>
                <div className="grid grid-cols-3 gap-1.5">
                  {STAGES_CONFIG.map((st) => (
                    <button
                      key={st.id}
                      onClick={() => {
                        onUpdateLeadStage(selectedLead.id, st.id);
                        setSelectedLead({ ...selectedLead, stage: st.id });
                      }}
                      className={`py-1.5 px-2 rounded-lg text-[11px] font-semibold border transition cursor-pointer ${
                        selectedLead.stage === st.id
                          ? 'bg-forest-800 text-white border-forest-900 shadow-xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {st.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes history */}
              <div>
                <label className="font-bold text-stone-800 block mb-1">Bitácora de Seguimiento:</label>
                <div className="space-y-1.5 max-h-32 overflow-y-auto bg-stone-50 p-2.5 rounded-xl border border-stone-200">
                  {selectedLead.notes.map((note, idx) => (
                    <div key={idx} className="text-[11px] text-stone-600 border-b border-stone-200/60 pb-1 last:border-0 last:pb-0">
                      • {note}
                    </div>
                  ))}
                </div>
              </div>

              {/* Add note form */}
              <form onSubmit={handleAddNote} className="space-y-2 pt-2">
                <input
                  type="text"
                  placeholder="Escribir nueva nota o actualización..."
                  value={newNoteInput}
                  onChange={(e) => setNewNoteInput(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
                />
                <button
                  type="submit"
                  className="w-full py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-semibold text-xs transition cursor-pointer"
                >
                  Agregar Nota al Historial
                </button>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Ticket Resolution Modal */}
      {resolvingTicketId && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <form
            onSubmit={handleResolveTicket}
            className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-4"
          >
            <h3 className="font-bold text-stone-900 text-base">Cerrar Ticket de Incidencia</h3>
            <p className="text-xs text-stone-500">
              Registra la solución brindada al usuario para mantener el historial de servicio al cliente.
            </p>

            <textarea
              rows={3}
              value={resolutionText}
              onChange={(e) => setResolutionText(e.target.value)}
              placeholder="Ej. Se contactó al inquilino y se le confirmó que el contrato se entrega en notaría local..."
              className="w-full p-3 rounded-xl border border-stone-300 text-xs focus:outline-none focus:ring-1 focus:ring-emerald-600"
              required
            />

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setResolvingTicketId(null)}
                className="px-4 py-2 rounded-xl text-stone-700 hover:bg-stone-100 text-xs font-semibold cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-forest-800 text-white text-xs font-semibold hover:bg-forest-700 transition cursor-pointer"
              >
                Guardar y Resolver
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
};
