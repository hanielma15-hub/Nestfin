import React, { useState, useEffect, useMemo } from 'react';
import {
  Sparkles,
  MapPin,
  SlidersHorizontal,
  RotateCcw,
  Home,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Heart,
  Eye,
  PlusCircle,
  ShieldAlert,
} from 'lucide-react';
import {
  FilterState,
  Property,
  Region,
  AdminRole,
  PropertyStatus,
  FinancialStatus,
  CrmLeadStage,
  SupportTicketStatus,
  CommissionTransaction,
  CommissionSchemeConfig,
  CrmLead,
  SupportTicket,
  AdminNotification,
  AuditLogEntry,
} from './types';
import {
  INITIAL_REGIONS,
  getActivePublicRegions,
  getDefaultRegion,
  getStoredRegions,
  saveStoredRegions,
  toggleRegionActiveStatus,
  createNewRegion,
  getUpcomingRegions,
} from './utils/regions';
import {
  INITIAL_FILTERS,
  filterProperties,
} from './utils/filterProperties';
import {
  getInitialDemoProperties,
  getStoredProperties,
  saveStoredProperties,
} from './data/mockProperties';
import {
  getStoredTransactions,
  saveStoredTransactions,
  getStoredCommissionSchemes,
  saveStoredCommissionSchemes,
  getStoredCrmLeads,
  saveStoredCrmLeads,
  getStoredTickets,
  saveStoredTickets,
  getStoredNotifications,
  saveStoredNotifications,
  INITIAL_SYSTEM_SERVICES,
  INITIAL_SYSTEM_LOGS,
  INITIAL_AUDIT_LOGS,
  INITIAL_BUSINESS_GOALS,
} from './admin/adminData';
import { AdminLayout } from './admin/AdminLayout';
import { AdminAuthGate } from './admin/AdminAuthGate';
import {
  getStoredCorporateSession,
  clearCorporateSession,
  CorporateUser,
} from './admin/authService';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { PropertyCard } from './components/PropertyCard';
import { PropertyDetailModal } from './components/PropertyDetailModal';
import { VirtualTour360Viewer } from './components/VirtualTour360Viewer';
import { FilterBar } from './components/FilterBar';
import { VirtualTourShowcase } from './components/VirtualTourShowcase';
import { PublishPropertyModal } from './components/PublishPropertyModal';
import { AdminExpansionModal } from './components/AdminExpansionModal';
import { ContactHostModal } from './components/ContactHostModal';
import { ExpansionWaitlistSection } from './components/ExpansionWaitlistSection';
import { TrustAndFaqSection } from './components/TrustAndFaqSection';
import { Footer } from './components/Footer';

export default function App() {
  // 0. Environment Routing State: Public Marketplace vs Private Operations Admin
  const [viewMode, setViewMode] = useState<'public' | 'admin'>(() => {
    if (typeof window !== 'undefined') {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path === '/admin' || path.startsWith('/admin/') || search.includes('view=admin')) {
        return 'admin';
      }
    }
    return 'public';
  });

  // URL Sync with browser popstate
  useEffect(() => {
    const handlePopState = () => {
      const path = window.location.pathname;
      const search = window.location.search;
      if (path === '/admin' || path.startsWith('/admin/') || search.includes('view=admin')) {
        setViewMode('admin');
      } else {
        setViewMode('public');
      }
    };
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  const navigateToAdmin = () => {
    setViewMode('admin');
    window.history.pushState(null, '', '/admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const navigateToPublic = () => {
    setViewMode('public');
    window.history.pushState(null, '', '/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Corporate Authentication State
  const [corporateUser, setCorporateUser] = useState<CorporateUser | null>(() => getStoredCorporateSession());

  // Discrete corporate keyboard shortcut (Ctrl+Shift+A / Cmd+Shift+A)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        navigateToAdmin();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleCorporateLoginSuccess = (user: CorporateUser) => {
    setCorporateUser(user);
    setAdminRole(user.role);
    const auditEntry: AuditLogEntry = {
      id: `audit-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit' }),
      actor: user.email,
      role: user.role,
      action: 'LOGIN_CORPORATIVO_EXITOSO',
      targetType: 'AUTH',
      targetId: user.id,
      details: `Acceso concedido a ${user.name} (${user.department})`,
    };
    setAuditLogs((prev) => [auditEntry, ...prev]);
  };

  const handleCorporateLogout = () => {
    clearCorporateSession();
    setCorporateUser(null);
    navigateToPublic();
  };

  // 1. Regional State
  const [regions, setRegions] = useState<Region[]>(() => getStoredRegions());
  const activeRegion = useMemo(() => getDefaultRegion(regions), [regions]);
  const upcomingRegions = useMemo(() => getUpcomingRegions(regions), [regions]);

  // 2. Properties Catalog State
  const [properties, setProperties] = useState<Property[]>(() => getStoredProperties());

  // 2.1 Administrative State
  const [adminRole, setAdminRole] = useState<AdminRole>('superadmin');
  const [transactions, setTransactions] = useState<CommissionTransaction[]>(() => getStoredTransactions());
  const [schemes, setSchemes] = useState<CommissionSchemeConfig[]>(() => getStoredCommissionSchemes());
  const [leads, setLeads] = useState<CrmLead[]>(() => getStoredCrmLeads());
  const [tickets, setTickets] = useState<SupportTicket[]>(() => getStoredTickets());
  const [services] = useState(INITIAL_SYSTEM_SERVICES);
  const [logs, setLogs] = useState(INITIAL_SYSTEM_LOGS);
  const [auditLogs, setAuditLogs] = useState<AuditLogEntry[]>(INITIAL_AUDIT_LOGS);
  const [notifications, setNotifications] = useState<AdminNotification[]>(() => getStoredNotifications());
  const [goals] = useState(INITIAL_BUSINESS_GOALS);

  // 3. Search & Filters State
  const [filters, setFilters] = useState<FilterState>(() => ({
    ...INITIAL_FILTERS,
    regionId: activeRegion.id,
  }));

  // 4. Favorites State
  const [favorites, setFavorites] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('nestfind_favorites');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [showingOnlyFavorites, setShowingOnlyFavorites] = useState(false);

  // 5. Modals State
  const [selectedPropertyForDetail, setSelectedPropertyForDetail] = useState<Property | null>(null);
  const [selectedPropertyFor360Tour, setSelectedPropertyFor360Tour] = useState<Property | null>(null);
  const [isFilterBarOpen, setIsFilterBarOpen] = useState(false);
  const [isPublishModalOpen, setIsPublishModalOpen] = useState(false);
  const [isAdminExpansionOpen, setIsAdminExpansionOpen] = useState(false);
  const [isContactModalOpen, setIsContactModalOpen] = useState(false);
  const [contactPropertyTarget, setContactPropertyTarget] = useState<Property | null>(null);

  // Sync regionId in filters whenever active region changes
  useEffect(() => {
    setFilters((prev) => ({
      ...prev,
      regionId: activeRegion.id,
    }));
  }, [activeRegion.id]);

  // Save favorites to localStorage
  const handleToggleFavorite = (propId: string) => {
    setFavorites((prev) => {
      const updated = prev.includes(propId)
        ? prev.filter((id) => id !== propId)
        : [...prev, propId];
      try {
        localStorage.setItem('nestfind_favorites', JSON.stringify(updated));
      } catch (e) {
        console.error(e);
      }
      return updated;
    });
  };

  // Filter properties logic
  const filteredProperties = useMemo(() => {
    let result = filterProperties(properties, filters, activeRegion.id);
    if (showingOnlyFavorites) {
      result = result.filter((p) => favorites.includes(p.id));
    }
    return result;
  }, [properties, filters, activeRegion.id, showingOnlyFavorites, favorites]);

  // Featured property with tour for the showcase
  const featuredTourProperty = useMemo(() => {
    return properties.find(
      (p) => p.regionId === activeRegion.id && p.virtualTour?.enabled && p.virtualTour.rooms.length > 0
    );
  }, [properties, activeRegion.id]);

  // Handlers
  const handleFilterChange = (updates: Partial<FilterState>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setShowingOnlyFavorites(false);
  };

  const handleResetFilters = () => {
    setFilters({
      ...INITIAL_FILTERS,
      regionId: activeRegion.id,
    });
    setShowingOnlyFavorites(false);
  };

  const handleFilter360Tours = () => {
    setFilters((prev) => ({
      ...prev,
      has360TourOnly: true,
    }));
    setShowingOnlyFavorites(false);
    const catalogEl = document.getElementById('catalogo');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSaveNewProperty = (newProperty: Property) => {
    const updated = [newProperty, ...properties];
    setProperties(updated);
    saveStoredProperties(updated);
  };

  const handleToggleRegionStatus = (regionId: string, newActiveState: boolean) => {
    const updated = toggleRegionActiveStatus(regions, regionId, newActiveState);
    setRegions(updated);
    saveStoredRegions(updated);
  };

  const handleCreateNewRegion = (
    data: Omit<Region, 'id' | 'listingCount' | 'waitlistCount'>
  ) => {
    const { updatedRegions } = createNewRegion(regions, data);
    setRegions(updatedRegions);
    saveStoredRegions(updatedRegions);
  };

  const handleAddWaitlist = (city: string, email: string) => {
    // Increment waitlist count in state
    setRegions((prev) =>
      prev.map((r) =>
        r.name.toLowerCase() === city.toLowerCase()
          ? { ...r, waitlistCount: r.waitlistCount + 1 }
          : r
      )
    );
  };

  // Admin Handlers
  const handleUpdatePropertyStatus = (propertyId: string, status: PropertyStatus, notes?: string) => {
    const updated = properties.map((p) => (p.id === propertyId ? { ...p, status } : p));
    setProperties(updated);
    saveStoredProperties(updated);

    const newAudit: AuditLogEntry = {
      id: `adt-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: adminRole === 'superadmin' ? 'Superadministrador' : 'Operaciones NestFind',
      role: adminRole,
      action: `CAMBIO_ESTATUS_${status.toUpperCase()}`,
      targetType: 'Propiedad',
      targetId: propertyId,
      details: notes ? `Estatus cambiado a "${status}": ${notes}` : `Estatus cambiado a "${status}"`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleToggleVerifiedHost = (propertyId: string) => {
    const updated = properties.map((p) => {
      if (p.id === propertyId) {
        return {
          ...p,
          host: {
            ...p.host,
            verifiedIdentity: !p.host.verifiedIdentity,
          },
        };
      }
      return p;
    });
    setProperties(updated);
    saveStoredProperties(updated);
  };

  const handleUpdateTransactionStatus = (txId: string, status: FinancialStatus) => {
    const updated = transactions.map((t) => (t.id === txId ? { ...t, status } : t));
    setTransactions(updated);
    saveStoredTransactions(updated);

    const newAudit: AuditLogEntry = {
      id: `adt-${Date.now()}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      actor: 'Superadministrador',
      role: adminRole,
      action: `ACTUALIZAR_COMISION_${status.toUpperCase()}`,
      targetType: 'Transacción',
      targetId: txId,
      details: `Marcado estatus como "${status}"`,
    };
    setAuditLogs((prev) => [newAudit, ...prev]);
  };

  const handleUpdateCommissionScheme = (updatedSchemes: CommissionSchemeConfig[]) => {
    setSchemes(updatedSchemes);
    saveStoredCommissionSchemes(updatedSchemes);
  };

  const handleUpdateLeadStage = (leadId: string, stage: CrmLeadStage) => {
    const updated = leads.map((l) =>
      l.id === leadId ? { ...l, stage, updatedAt: new Date().toISOString() } : l
    );
    setLeads(updated);
    saveStoredCrmLeads(updated);
  };

  const handleAddLeadNote = (leadId: string, note: string) => {
    const updated = leads.map((l) =>
      l.id === leadId
        ? { ...l, notes: [...l.notes, note], updatedAt: new Date().toISOString() }
        : l
    );
    setLeads(updated);
    saveStoredCrmLeads(updated);
  };

  const handleUpdateTicketStatus = (
    ticketId: string,
    status: SupportTicketStatus,
    resolution?: string
  ) => {
    const updated = tickets.map((t) =>
      t.id === ticketId
        ? {
            ...t,
            status,
            resolutionNote: resolution,
            resolvedAt: status === 'resuelta' ? new Date().toISOString() : undefined,
          }
        : t
    );
    setTickets(updated);
    saveStoredTickets(updated);
  };

  const handleCreateTicket = (ticketData: any) => {
    const newTkt: SupportTicket = {
      ...ticketData,
      id: `tkt-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };
    const updated = [newTkt, ...tickets];
    setTickets(updated);
    saveStoredTickets(updated);
  };

  const handleClearLogs = () => {
    setLogs([]);
  };

  const handleMarkNotificationRead = (notifId: string) => {
    const updated = notifications.map((n) => (n.id === notifId ? { ...n, unread: false } : n));
    setNotifications(updated);
    saveStoredNotifications(updated);
  };

  // If in Private Operations Admin mode, enforce Corporate Authentication Gate
  if (viewMode === 'admin') {
    if (!corporateUser) {
      return (
        <AdminAuthGate
          onLoginSuccess={handleCorporateLoginSuccess}
          onCancel={navigateToPublic}
        />
      );
    }

    return (
      <>
        <AdminLayout
          currentRole={adminRole}
          currentUser={corporateUser}
          onRoleChange={setAdminRole}
          onExitAdminToPublic={navigateToPublic}
          onLogout={handleCorporateLogout}
          properties={properties}
          transactions={transactions}
          schemes={schemes}
          leads={leads}
          tickets={tickets}
          services={services}
          logs={logs}
          auditLogs={auditLogs}
          notifications={notifications}
          goals={goals}
          regions={regions}
          activeRegion={activeRegion}
          onToggleRegionStatus={handleToggleRegionStatus}
          onCreateRegion={handleCreateNewRegion}
          onUpdatePropertyStatus={handleUpdatePropertyStatus}
          onToggleVerifiedHost={handleToggleVerifiedHost}
          onPreviewProperty={(prop) => setSelectedPropertyForDetail(prop)}
          onUpdateTransactionStatus={handleUpdateTransactionStatus}
          onUpdateCommissionScheme={handleUpdateCommissionScheme}
          onUpdateLeadStage={handleUpdateLeadStage}
          onAddLeadNote={handleAddLeadNote}
          onUpdateTicketStatus={handleUpdateTicketStatus}
          onCreateTicket={handleCreateTicket}
          onClearLogs={handleClearLogs}
          onMarkNotificationRead={handleMarkNotificationRead}
        />

        {/* Property Detail Modal for admin previewing */}
        {selectedPropertyForDetail && (
          <PropertyDetailModal
            property={selectedPropertyForDetail}
            isOpen={Boolean(selectedPropertyForDetail)}
            onClose={() => setSelectedPropertyForDetail(null)}
            isFavorite={favorites.includes(selectedPropertyForDetail.id)}
            onToggleFavorite={handleToggleFavorite}
            onOpenContact={(prop) => {
              setContactPropertyTarget(prop);
              setIsContactModalOpen(true);
            }}
            onSelectSimilarProperty={(prop) => setSelectedPropertyForDetail(prop)}
            allProperties={properties}
          />
        )}

        {/* 360 Panorama Tour Modal for admin previewing */}
        {selectedPropertyFor360Tour && selectedPropertyFor360Tour.virtualTour && (
          <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
            <div className="bg-stone-950 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
              <VirtualTour360Viewer
                tourData={selectedPropertyFor360Tour.virtualTour}
                propertyTitle={selectedPropertyFor360Tour.title}
                onClose={() => setSelectedPropertyFor360Tour(null)}
                isModal={true}
              />
            </div>
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-stone-50 flex flex-col font-sans selection:bg-emerald-200 selection:text-emerald-950">
      {/* 1. Header & Navigation */}
      <Navbar
        activeRegion={activeRegion}
        favoritesCount={favorites.length}
        onOpenFavorites={() => setShowOnlyFavoritesToggle()}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
        onOpenAdminExpansion={() => setIsAdminExpansionOpen(true)}
        onOpenAdminPanel={navigateToAdmin}
        onFilter360Tours={handleFilter360Tours}
        onResetSearch={handleResetFilters}
      />

      {/* 2. Hero Section with Search Bar */}
      <Hero
        activeRegion={activeRegion}
        filters={filters}
        onFilterChange={handleFilterChange}
        onOpenAdvancedFilters={() => setIsFilterBarOpen(true)}
      />

      {/* 3. Catalog Section */}
      <main id="catalogo" className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-10">
        {/* Catalog Header & Count Badge */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
          <div>
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
              <h2 className="text-2xl font-extrabold text-stone-900 font-display">
                {showingOnlyFavorites ? 'Tus Propiedades Favoritas' : `Inmuebles en ${activeRegion.name}`}
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-1">
              {showingOnlyFavorites
                ? 'Lista personalizada de inmuebles guardados'
                : `Mostrando catálogo exclusivo de ${activeRegion.name}, ${activeRegion.state}. Precios y características en moneda nacional.`}
            </p>
          </div>

          {/* Quick Controls */}
          <div className="flex items-center gap-2">
            {showingOnlyFavorites && (
              <button
                onClick={() => setShowingOnlyFavorites(false)}
                className="px-3 py-1.5 rounded-xl bg-stone-200 text-stone-800 text-xs font-semibold hover:bg-stone-300 transition"
              >
                Ver todo el catálogo
              </button>
            )}

            <button
              onClick={() => setIsFilterBarOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl border border-stone-300 hover:border-stone-400 bg-white text-stone-700 text-xs font-semibold shadow-xs transition cursor-pointer"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-stone-500" />
              <span>Filtros avanzados</span>
              {(filters.has360TourOnly ||
                filters.type !== 'todas' ||
                filters.period !== 'todas' ||
                filters.bedrooms !== 'todos' ||
                filters.amenities.length > 0) && (
                <span className="w-2 h-2 rounded-full bg-emerald-600"></span>
              )}
            </button>
          </div>
        </div>

        {/* Mandatory Transparency Banner for Demo Properties (Section 5 Requirement) */}
        <div className="mb-8 p-4 rounded-2xl bg-amber-50/90 border border-amber-300/80 text-amber-950 flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-xs">
          <div className="flex items-start gap-3">
            <ShieldAlert className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div className="text-xs leading-relaxed">
              <span className="font-bold">Aviso de demostración del sistema: </span>
              Los inmuebles listados a continuación son <strong>ejemplos ficticios de demostración</strong> creados para probar la interfaz, los filtros y los recorridos virtuales interactivos 360° en Montemorelos. No representan ofertas comerciales vigentes ni propiedades de arrendamiento real.
            </div>
          </div>
        </div>

        {/* Active Filter Pills Bar */}
        {(filters.colonias?.length > 0 ||
          filters.postalCode ||
          filters.type !== 'todas' ||
          filters.has360TourOnly ||
          filters.searchQuery) && (
          <div className="mb-6 flex flex-wrap items-center gap-2 text-xs">
            <span className="text-stone-400 font-semibold mr-1">Filtros aplicados:</span>

            {filters.searchQuery && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200">
                <span>Búsqueda: "{filters.searchQuery}"</span>
                <button
                  onClick={() => handleFilterChange({ searchQuery: '' })}
                  className="hover:text-rose-600 p-0.5"
                  aria-label="Quitar búsqueda"
                >
                  ×
                </button>
              </span>
            )}

            {filters.postalCode && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-forest-100 text-forest-900 border border-forest-200 font-mono">
                <span>C.P. {filters.postalCode}</span>
                <button
                  onClick={() => handleFilterChange({ postalCode: '' })}
                  className="hover:text-rose-600 p-0.5"
                  aria-label="Quitar filtro de código postal"
                >
                  ×
                </button>
              </span>
            )}

            {filters.colonias &&
              filters.colonias.map((c) => (
                <span
                  key={c}
                  className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200"
                >
                  <span>{c}</span>
                  <button
                    onClick={() =>
                      handleFilterChange({
                        colonias: filters.colonias.filter((item) => item !== c),
                      })
                    }
                    className="hover:text-rose-600 p-0.5"
                    aria-label={`Quitar filtro ${c}`}
                  >
                    ×
                  </button>
                </span>
              ))}

            {filters.type !== 'todas' && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-stone-100 text-stone-800 border border-stone-200 capitalize">
                <span>Tipo: {filters.type}</span>
                <button
                  onClick={() => handleFilterChange({ type: 'todas' })}
                  className="hover:text-rose-600 p-0.5"
                  aria-label="Quitar filtro de tipo"
                >
                  ×
                </button>
              </span>
            )}

            {filters.has360TourOnly && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300 font-semibold">
                <span>Solo 360°</span>
                <button
                  onClick={() => handleFilterChange({ has360TourOnly: false })}
                  className="hover:text-rose-600 p-0.5"
                  aria-label="Quitar filtro 360"
                >
                  ×
                </button>
              </span>
            )}

            <button
              onClick={handleResetFilters}
              className="text-stone-500 hover:text-stone-900 font-medium underline ml-2"
            >
              Limpiar todo
            </button>
          </div>
        )}

        {/* Properties Grid */}
        {filteredProperties.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {filteredProperties.map((property) => (
              <PropertyCard
                key={property.id}
                property={property}
                isFavorite={favorites.includes(property.id)}
                onToggleFavorite={handleToggleFavorite}
                onSelectProperty={(p) => setSelectedPropertyForDetail(p)}
                onOpen360Tour={(p) => setSelectedPropertyFor360Tour(p)}
              />
            ))}
          </div>
        ) : (
          /* Smart Empty State with suggestions to broaden search */
          <div className="p-8 sm:p-12 text-center bg-white rounded-3xl border border-stone-200/90 shadow-sm max-w-2xl mx-auto space-y-6 my-8">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center mx-auto">
              <AlertCircle className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <h3 className="font-extrabold text-xl text-stone-900 font-display">
                No encontramos inmuebles con estos criterios específicos
              </h3>

              <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
                {filters.postalCode && (
                  <span className="block font-medium text-stone-800 mb-1">
                    Búsqueda para Código Postal: <strong className="font-mono">{filters.postalCode}</strong>
                  </span>
                )}
                {filters.colonias && filters.colonias.length > 0 && (
                  <span className="block font-medium text-stone-800 mb-1">
                    Colonias seleccionadas: <strong>{filters.colonias.join(', ')}</strong>
                  </span>
                )}
                No hay propiedades que coincidan exactamente con todos los filtros combinados en {activeRegion.name}.
              </p>
            </div>

            {/* Suggestions Box */}
            <div className="p-5 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-3">
              <div className="flex items-center gap-2 font-bold text-stone-900">
                <HelpCircle className="w-4 h-4 text-emerald-700" />
                <span>Sugerencias para ampliar tu búsqueda en Montemorelos:</span>
              </div>

              <ul className="space-y-2 text-stone-600">
                {filters.postalCode && (
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>
                      <strong>Prueba con un rango de código postal:</strong> los códigos postales en Montemorelos van del <span className="font-mono">67500 al 67599</span> (ej. ingresa <span className="font-mono">67500-67520</span>).
                    </span>
                  </li>
                )}

                {filters.colonias && filters.colonias.length > 0 && (
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>
                      <strong>Selecciona colonias adicionales:</strong> agrega zonas populares cercanas como <em>Centro, Fracc. Las Huertas o Colonia Matamoros</em>.
                    </span>
                  </li>
                )}

                {filters.has360TourOnly && (
                  <li className="flex items-start gap-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                    <span>
                      <strong>Desactiva el filtro "Solo 360°"</strong> para visualizar todas las propiedades con fotografías estándar.
                    </span>
                  </li>
                )}

                <li className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 mt-1.5 shrink-0" />
                  <span>
                    <strong>Amplía el presupuesto o remueve filtros de amenidades específicas.</strong>
                  </span>
                </li>
              </ul>
            </div>

            {/* Quick Action Buttons to Broaden Search */}
            <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
              {filters.postalCode && (
                <button
                  onClick={() => handleFilterChange({ postalCode: '' })}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition"
                >
                  Quitar filtro de C.P. ({filters.postalCode})
                </button>
              )}

              {filters.colonias && filters.colonias.length > 0 && (
                <button
                  onClick={() => handleFilterChange({ colonias: [] })}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition"
                >
                  Ver todas las colonias
                </button>
              )}

              {filters.has360TourOnly && (
                <button
                  onClick={() => handleFilterChange({ has360TourOnly: false })}
                  className="px-4 py-2.5 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-semibold transition"
                >
                  Incluir fotos tradicionales
                </button>
              )}

              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-forest-900 text-white font-bold text-xs hover:bg-forest-800 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Ver todo el catálogo de Montemorelos</span>
              </button>
            </div>
          </div>
        )}

        {/* 4. Showcase: "Antes de visitarlo, recórrelo" */}
        <VirtualTourShowcase
          onExplore360={handleFilter360Tours}
          featuredPropertyWithTour={featuredTourProperty}
          onOpenTour={(p) => setSelectedPropertyFor360Tour(p)}
        />

        {/* 5. Trust, How-It-Works, Owner CTA & FAQs */}
        <TrustAndFaqSection onOpenPublishModal={() => setIsPublishModalOpen(true)} />

        {/* 6. Expansion Waitlist Section: "Próximamente, más cerca de ti" */}
        <ExpansionWaitlistSection
          upcomingRegions={upcomingRegions}
          onAddWaitlistEntry={handleAddWaitlist}
        />
      </main>

      {/* 7. Footer */}
      <Footer
        activeRegion={activeRegion}
        onOpenAdminExpansion={() => setIsAdminExpansionOpen(true)}
        onOpenAdminPanel={navigateToAdmin}
        onFilter360Tours={handleFilter360Tours}
        onOpenPublishModal={() => setIsPublishModalOpen(true)}
      />

      {/* MODAL 1: Property Detail Modal */}
      {selectedPropertyForDetail && (
        <PropertyDetailModal
          property={selectedPropertyForDetail}
          isOpen={Boolean(selectedPropertyForDetail)}
          onClose={() => setSelectedPropertyForDetail(null)}
          isFavorite={favorites.includes(selectedPropertyForDetail.id)}
          onToggleFavorite={handleToggleFavorite}
          onOpenContact={(prop) => {
            setContactPropertyTarget(prop);
            setIsContactModalOpen(true);
          }}
          onSelectSimilarProperty={(prop) => setSelectedPropertyForDetail(prop)}
          allProperties={properties}
        />
      )}

      {/* MODAL 2: Direct 360 Panorama Tour Modal */}
      {selectedPropertyFor360Tour && selectedPropertyFor360Tour.virtualTour && (
        <div className="fixed inset-0 z-50 overflow-hidden bg-stone-950/80 backdrop-blur-sm flex items-center justify-center p-2 sm:p-4 animate-fade-in">
          <div className="bg-stone-950 w-full max-w-5xl rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
            <VirtualTour360Viewer
              tourData={selectedPropertyFor360Tour.virtualTour}
              propertyTitle={selectedPropertyFor360Tour.title}
              onClose={() => setSelectedPropertyFor360Tour(null)}
              isModal={true}
            />
          </div>
        </div>
      )}

      {/* MODAL 3: Filter Bar Drawer */}
      <FilterBar
        isOpen={isFilterBarOpen}
        onClose={() => setIsFilterBarOpen(false)}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        resultsCount={filteredProperties.length}
      />

      {/* MODAL 4: Publish Property Wizard */}
      <PublishPropertyModal
        isOpen={isPublishModalOpen}
        onClose={() => setIsPublishModalOpen(false)}
        onSaveProperty={handleSaveNewProperty}
      />

      {/* MODAL 5: Regional Expansion Admin Panel */}
      <AdminExpansionModal
        isOpen={isAdminExpansionOpen}
        onClose={() => setIsAdminExpansionOpen(false)}
        regions={regions}
        onToggleRegion={handleToggleRegionStatus}
        onCreateRegion={handleCreateNewRegion}
      />

      {/* MODAL 6: Contact Host Modal */}
      <ContactHostModal
        property={contactPropertyTarget}
        isOpen={isContactModalOpen}
        onClose={() => {
          setIsContactModalOpen(false);
          setContactPropertyTarget(null);
        }}
      />
    </div>
  );

  function setShowOnlyFavoritesToggle() {
    if (favorites.length === 0) {
      alert('Aún no has guardado propiedades en tus favoritos. Haz clic en el corazón de cualquier inmueble para guardarlo.');
      return;
    }
    setShowingOnlyFavorites(true);
    const catalogEl = document.getElementById('catalogo');
    if (catalogEl) {
      catalogEl.scrollIntoView({ behavior: 'smooth' });
    }
  }
}
