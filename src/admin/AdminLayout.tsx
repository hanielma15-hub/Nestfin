import React, { useState } from 'react';
import {
  Home,
  LayoutDashboard,
  Building2,
  Users,
  DollarSign,
  BarChart3,
  Lightbulb,
  Terminal,
  FileSpreadsheet,
  Globe2,
  Bell,
  ArrowLeft,
  ChevronDown,
  Menu,
  X,
  Shield,
  CheckCircle2,
  Clock,
  Sparkles,
  LogOut,
  SlidersHorizontal,
} from 'lucide-react';
import {
  AdminRole,
  Property,
  CommissionTransaction,
  CommissionSchemeConfig,
  CrmLead,
  SupportTicket,
  SystemServiceHealth,
  SystemLogEntry,
  AuditLogEntry,
  AdminNotification,
  BusinessGoal,
  Region,
} from '../types';
import {
  ADMIN_ROLES,
  canAccessFinancials,
  canAccessTechnicalPanel,
} from './adminPermissions';
import { CorporateUser } from './authService';
import { ExecutiveDashboardView } from './views/ExecutiveDashboardView';
import { AnalyticsCenterView } from './views/AnalyticsCenterView';
import { FinancialManagementView } from './views/FinancialManagementView';
import { InventoryManagementView } from './views/InventoryManagementView';
import { CrmAndInquiriesView } from './views/CrmAndInquiriesView';
import { TechnicalPanelView } from './views/TechnicalPanelView';
import { BusinessIntelligenceView } from './views/BusinessIntelligenceView';
import { ReportsCenterView } from './views/ReportsCenterView';
import { AdminExpansionModal } from '../components/AdminExpansionModal';

interface AdminLayoutProps {
  currentRole: AdminRole;
  currentUser?: CorporateUser | null;
  onRoleChange: (role: AdminRole) => void;
  onExitAdminToPublic: () => void;
  onLogout?: () => void;
  properties: Property[];
  transactions: CommissionTransaction[];
  schemes: CommissionSchemeConfig[];
  leads: CrmLead[];
  tickets: SupportTicket[];
  services: SystemServiceHealth[];
  logs: SystemLogEntry[];
  auditLogs: AuditLogEntry[];
  notifications: AdminNotification[];
  goals: BusinessGoal[];
  regions: Region[];
  activeRegion: Region;
  onToggleRegionStatus: (regionId: string, newActiveState: boolean) => void;
  onCreateRegion: (regionData: Omit<Region, 'id' | 'listingCount' | 'waitlistCount'>) => void;
  onUpdatePropertyStatus: (propertyId: string, status: any, notes?: string) => void;
  onToggleVerifiedHost: (propertyId: string) => void;
  onPreviewProperty: (property: Property) => void;
  onUpdateTransactionStatus: (txId: string, status: any) => void;
  onUpdateCommissionScheme: (schemes: CommissionSchemeConfig[]) => void;
  onUpdateLeadStage: (leadId: string, stage: any) => void;
  onAddLeadNote: (leadId: string, note: string) => void;
  onUpdateTicketStatus: (ticketId: string, status: any, resolution?: string) => void;
  onCreateTicket: (ticket: any) => void;
  onClearLogs: () => void;
  onMarkNotificationRead: (notifId: string) => void;
}

export const AdminLayout: React.FC<AdminLayoutProps> = ({
  currentRole,
  currentUser,
  onRoleChange,
  onExitAdminToPublic,
  onLogout,
  properties,
  transactions,
  schemes,
  leads,
  tickets,
  services,
  logs,
  auditLogs,
  notifications,
  goals,
  regions,
  activeRegion,
  onToggleRegionStatus,
  onCreateRegion,
  onUpdatePropertyStatus,
  onToggleVerifiedHost,
  onPreviewProperty,
  onUpdateTransactionStatus,
  onUpdateCommissionScheme,
  onUpdateLeadStage,
  onAddLeadNote,
  onUpdateTicketStatus,
  onCreateTicket,
  onClearLogs,
  onMarkNotificationRead,
}) => {
  const [activeTab, setActiveTab] = useState<string>('dashboard');
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [isExpansionModalOpen, setIsExpansionModalOpen] = useState(false);

  const roleMeta = ADMIN_ROLES[currentRole];
  const unreadNotifsCount = notifications.filter((n) => n.unread).length;

  const navigationItems = [
    {
      id: 'dashboard',
      label: 'Tablero Ejecutivo',
      icon: LayoutDashboard,
      restricted: false,
    },
    {
      id: 'inventory',
      label: 'Inventario de Inmuebles',
      icon: Building2,
      restricted: false,
      badge: `${properties.length}`,
    },
    {
      id: 'crm',
      label: 'Prospectos & CRM',
      icon: Users,
      restricted: false,
      badge: leads.some((l) => l.isOverdue) ? '! SLA' : `${leads.length}`,
      badgeColor: leads.some((l) => l.isOverdue) ? 'bg-rose-500 text-white' : undefined,
    },
    {
      id: 'financials',
      label: 'Finanzas & Comisiones',
      icon: DollarSign,
      restricted: !canAccessFinancials(currentRole),
      lockNotice: 'Restringido por rol',
    },
    {
      id: 'analytics',
      label: 'Centro de Analítica 360°',
      icon: BarChart3,
      restricted: false,
    },
    {
      id: 'bi',
      label: 'Inteligencia de Negocio',
      icon: Lightbulb,
      restricted: false,
    },
    {
      id: 'technical',
      label: 'Panel Técnico & Logs',
      icon: Terminal,
      restricted: !canAccessTechnicalPanel(currentRole),
      lockNotice: 'Dev / Superadmin',
    },
    {
      id: 'reports',
      label: 'Reportes & CSV',
      icon: FileSpreadsheet,
      restricted: false,
    },
    {
      id: 'expansion',
      label: 'Expansión Territorial',
      icon: Globe2,
      restricted: false,
      action: () => setIsExpansionModalOpen(true),
    },
  ];

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans text-stone-900">
      {/* Top Banner Notice */}
      <div className="bg-gradient-to-r from-forest-950 via-forest-900 to-forest-950 text-white text-xs py-1.5 px-4 border-b border-forest-800 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span className="font-semibold text-emerald-200">
            Panel de Operaciones NestFind • Montemorelos, N.L.
          </span>
          <span className="hidden md:inline text-stone-400">
            | Entorno privado de gestión administrativa y análisis de mercado
          </span>
        </div>

        <button
          onClick={onExitAdminToPublic}
          className="text-stone-300 hover:text-white transition flex items-center gap-1 font-medium text-xs cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al sitio público</span>
        </button>
      </div>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar Desktop */}
        <aside className="hidden lg:flex flex-col w-64 bg-forest-950 text-stone-300 border-r border-forest-900 shrink-0">
          {/* Brand */}
          <div className="p-5 border-b border-forest-900">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-forest-800 flex items-center justify-center text-white">
                <Home className="w-4 h-4 text-emerald-300" />
              </div>
              <div>
                <span className="text-base font-bold text-white font-display tracking-tight">
                  Nest<span className="text-emerald-400">Find</span>
                </span>
                <span className="text-[10px] block text-stone-400 -mt-0.5 uppercase tracking-wider font-semibold">
                  Operaciones Montemorelos
                </span>
              </div>
            </div>
          </div>

          {/* Current Role Card */}
          <div className="p-4 mx-3 my-3 rounded-xl bg-forest-900/80 border border-forest-800 text-xs">
            <div className="flex items-center justify-between mb-1">
              <span className="text-[10px] uppercase font-bold text-stone-400">Perfil Activo</span>
              <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${roleMeta.badgeStyle.bg} ${roleMeta.badgeStyle.text}`}>
                {roleMeta.badgeLabel}
              </span>
            </div>
            <p className="font-semibold text-white text-xs">{roleMeta.title}</p>
            <p className="text-[10px] text-stone-400 mt-1 line-clamp-2 leading-tight">
              {roleMeta.description}
            </p>
          </div>

          {/* Nav List */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isRestricted = item.restricted;

              return (
                <button
                  key={item.id}
                  onClick={() => {
                    if (item.action) {
                      item.action();
                    } else if (!isRestricted) {
                      setActiveTab(item.id);
                    }
                  }}
                  disabled={isRestricted}
                  className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                    isActive
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isRestricted
                      ? 'opacity-40 text-stone-500 cursor-not-allowed'
                      : 'text-stone-300 hover:text-white hover:bg-forest-900/60'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <Icon className="w-4 h-4 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>

                  {item.badge && (
                    <span
                      className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                        item.badgeColor || (isActive ? 'bg-forest-900 text-white' : 'bg-forest-900 text-stone-300')
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}

                  {isRestricted && (
                    <span className="text-[9px] uppercase tracking-wider text-stone-500">
                      {item.lockNotice}
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Bottom Exit */}
          <div className="p-3 border-t border-forest-900">
            <button
              onClick={onLogout || onExitAdminToPublic}
              className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-forest-900 hover:bg-rose-950/70 text-stone-300 hover:text-rose-200 text-xs font-semibold transition cursor-pointer"
            >
              <LogOut className="w-3.5 h-3.5 text-stone-400" />
              <span>Cerrar Sesión Corporativa</span>
            </button>
          </div>
        </aside>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col min-w-0 overflow-y-auto">
          {/* Top Admin Header Bar */}
          <header className="sticky top-0 z-30 bg-white border-b border-stone-200 px-4 sm:px-6 py-3 flex items-center justify-between gap-4 shadow-xs">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setMobileSidebarOpen(!mobileSidebarOpen)}
                className="lg:hidden p-2 rounded-xl text-stone-700 hover:bg-stone-100 cursor-pointer"
                aria-label="Abrir menú administrativo"
              >
                <Menu className="w-5 h-5" />
              </button>

              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-stone-800 hidden sm:inline">
                  Cambiar Rol de Demostración (RBAC):
                </span>
                {/* Role Switcher */}
                <select
                  value={currentRole}
                  onChange={(e) => onRoleChange(e.target.value as AdminRole)}
                  className="bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold py-1.5 px-3 rounded-xl border border-stone-200 outline-none cursor-pointer"
                >
                  <option value="superadmin">👑 Superadministrador</option>
                  <option value="ops_admin">🏢 Administrador de Operaciones</option>
                  <option value="analyst">📊 Analista de Negocio</option>
                  <option value="developer">💻 Desarrollador de Software</option>
                  <option value="support">🎧 Atención al Cliente</option>
                </select>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Notifications Popover Trigger */}
              <div className="relative">
                <button
                  onClick={() => setNotificationsOpen(!notificationsOpen)}
                  className="relative p-2 rounded-xl text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition cursor-pointer"
                  title="Notificaciones internas"
                >
                  <Bell className="w-5 h-5" />
                  {unreadNotifsCount > 0 && (
                    <span className="absolute top-1 right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[9px] font-bold flex items-center justify-center">
                      {unreadNotifsCount}
                    </span>
                  )}
                </button>

                {/* Notifications Drawer */}
                {notificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-2xl shadow-2xl border border-stone-200 p-4 space-y-3 z-50">
                    <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                      <span className="font-bold text-xs text-stone-900">
                        Centro de Notificaciones ({unreadNotifsCount} sin leer)
                      </span>
                      <button
                        onClick={() => setNotificationsOpen(false)}
                        className="text-stone-400 hover:text-stone-600 cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="space-y-2 max-h-72 overflow-y-auto">
                      {notifications.map((notif) => (
                        <div
                          key={notif.id}
                          onClick={() => {
                            onMarkNotificationRead(notif.id);
                            if (notif.targetTab) setActiveTab(notif.targetTab);
                            setNotificationsOpen(false);
                          }}
                          className={`p-3 rounded-xl border text-xs cursor-pointer transition ${
                            notif.unread
                              ? 'bg-emerald-50/60 border-emerald-200'
                              : 'bg-white border-stone-200'
                          }`}
                        >
                          <div className="flex items-center justify-between text-[10px] text-stone-400 mb-1">
                            <span className="font-bold uppercase tracking-wider text-emerald-800">
                              {notif.category}
                            </span>
                            <span>{notif.createdAt}</span>
                          </div>
                          <p className="font-bold text-stone-900">{notif.title}</p>
                          <p className="text-stone-600 text-[11px] mt-0.5">{notif.message}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Authenticated user badge */}
              {currentUser && (
                <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-stone-100 border border-stone-200 text-xs">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                  <span className="font-semibold text-stone-800">{currentUser.name}</span>
                  <span className="text-stone-400 font-mono text-[10px]">{currentUser.email}</span>
                </div>
              )}

              {/* Logout button */}
              <button
                onClick={onLogout || onExitAdminToPublic}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 border border-rose-200 text-rose-700 text-xs font-semibold transition cursor-pointer"
                title="Cerrar sesión corporativa y volver al catálogo público"
              >
                <LogOut className="w-3.5 h-3.5 text-rose-600" />
                <span className="hidden sm:inline">Cerrar Sesión</span>
              </button>
            </div>
          </header>

          {/* Active View Content Container */}
          <main className="p-4 sm:p-6 lg:p-8 flex-1">
            {activeTab === 'dashboard' && (
              <ExecutiveDashboardView
                currentRole={currentRole}
                properties={properties}
                transactions={transactions}
                leads={leads}
                onNavigateTab={(tab) => setActiveTab(tab)}
              />
            )}

            {activeTab === 'inventory' && (
              <InventoryManagementView
                currentRole={currentRole}
                properties={properties}
                onUpdatePropertyStatus={onUpdatePropertyStatus}
                onToggleVerifiedHost={onToggleVerifiedHost}
                onPreviewProperty={onPreviewProperty}
              />
            )}

            {activeTab === 'crm' && (
              <CrmAndInquiriesView
                currentRole={currentRole}
                leads={leads}
                tickets={tickets}
                onUpdateLeadStage={onUpdateLeadStage}
                onAddLeadNote={onAddLeadNote}
                onUpdateTicketStatus={onUpdateTicketStatus}
                onCreateTicket={onCreateTicket}
              />
            )}

            {activeTab === 'financials' && (
              <FinancialManagementView
                currentRole={currentRole}
                transactions={transactions}
                schemes={schemes}
                onUpdateTransactionStatus={onUpdateTransactionStatus}
                onUpdateCommissionScheme={onUpdateCommissionScheme}
              />
            )}

            {activeTab === 'analytics' && (
              <AnalyticsCenterView properties={properties} />
            )}

            {activeTab === 'bi' && (
              <BusinessIntelligenceView goals={goals} />
            )}

            {activeTab === 'technical' && (
              <TechnicalPanelView
                currentRole={currentRole}
                services={services}
                logs={logs}
                auditLogs={auditLogs}
                onClearLogs={onClearLogs}
              />
            )}

            {activeTab === 'reports' && (
              <ReportsCenterView
                properties={properties}
                transactions={transactions}
                leads={leads}
              />
            )}
          </main>
        </div>
      </div>

      {/* Mobile Sidebar Drawer */}
      {mobileSidebarOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs lg:hidden flex">
          <div className="w-72 bg-forest-950 text-stone-300 p-4 flex flex-col justify-between h-full space-y-4">
            <div>
              <div className="flex items-center justify-between border-b border-forest-900 pb-3 mb-3">
                <span className="font-bold text-white text-base font-display">
                  NestFind Operaciones
                </span>
                <button
                  onClick={() => setMobileSidebarOpen(false)}
                  className="text-stone-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="space-y-1">
                {navigationItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  const isRestricted = item.restricted;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        if (item.action) {
                          item.action();
                        } else if (!isRestricted) {
                          setActiveTab(item.id);
                        }
                        setMobileSidebarOpen(false);
                      }}
                      disabled={isRestricted}
                      className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold ${
                        isActive
                          ? 'bg-emerald-600 text-white'
                          : isRestricted
                          ? 'opacity-40 text-stone-500'
                          : 'text-stone-300 hover:bg-forest-900'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <Icon className="w-4 h-4" />
                        <span>{item.label}</span>
                      </div>
                      {item.badge && (
                        <span className="px-1.5 py-0.5 rounded text-[10px] bg-forest-900 text-white">
                          {item.badge}
                        </span>
                      )}
                    </button>
                  );
                })}
              </nav>
            </div>

            <button
              onClick={() => {
                setMobileSidebarOpen(false);
                onExitAdminToPublic();
              }}
              className="w-full py-2.5 rounded-xl bg-forest-900 text-stone-300 text-xs font-semibold flex items-center justify-center gap-2"
            >
              <LogOut className="w-4 h-4" />
              <span>Volver al sitio público</span>
            </button>
          </div>
        </div>
      )}

      {/* Territorial Expansion Modal */}
      {isExpansionModalOpen && (
        <AdminExpansionModal
          isOpen={isExpansionModalOpen}
          onClose={() => setIsExpansionModalOpen(false)}
          regions={regions}
          onToggleRegion={onToggleRegionStatus}
          onCreateRegion={onCreateRegion}
        />
      )}
    </div>
  );
};
