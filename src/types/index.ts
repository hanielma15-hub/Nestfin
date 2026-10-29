export type PropertyType = 'casa' | 'departamento' | 'habitacion';

export type RentPeriod = 'quincenal' | 'mensual' | 'trimestral';

export type PropertyStatus = 'borrador' | 'pendiente' | 'publicado' | 'pausado' | 'rentado';

export interface Hotspot {
  id: string;
  targetRoomId: string;
  label: string;
  // Spherical coordinates in degrees (yaw / pitch)
  yaw: number;
  pitch: number;
}

export interface RoomPanorama {
  id: string;
  name: string; // e.g. "Sala principal", "Cocina", "Recámara 1", "Patio"
  type: 'sala' | 'cocina' | 'recamara' | 'bano' | 'patio' | 'entrada' | 'comedor' | 'otro';
  panoramaUrl: string; // Equirectangular image URL or canvas data URL
  hotspots?: Hotspot[];
  description?: string;
  isInitial?: boolean;
}

export interface VirtualTourData {
  enabled: boolean;
  isDemoTour: boolean;
  rooms: RoomPanorama[];
}

export interface Property {
  id: string;
  regionId: string; // reference to Region id, e.g. 'montemorelos-nl'
  title: string;
  type: PropertyType;
  price: number;
  currency: string; // 'MXN'
  period: RentPeriod;
  isDemo: boolean; // Flag identifying demo test listings
  status: PropertyStatus;
  colonia: string;
  postalCode: string; // e.g. '67510', '67500', '67520'
  city: string;
  state: string;
  referenceLocation?: string;
  bedrooms: number;
  bathrooms: number;
  surfaceM2?: number;
  furnished: boolean;
  petsAllowed: boolean;
  parkingSpots: number;
  images: string[];
  virtualTour?: VirtualTourData;
  amenities: string[];
  description: string;
  coexistenceRules: string[];
  rentalRequirements: string[];
  availableDate: string;
  host: {
    name: string;
    role: string;
    phone?: string;
    email?: string;
    verifiedIdentity: boolean;
    responseRate: string;
    responseTime: string;
  };
  featured?: boolean;
}

export interface Region {
  id: string;
  name: string;
  state: string;
  code: string;
  isActivePublic: boolean; // Only true for Montemorelos at launch
  isComingSoon: boolean;
  description: string;
  listingCount: number;
  waitlistCount: number;
}

export interface FilterState {
  regionId: string;
  colonia: string;
  colonias: string[]; // Multiple colonias selection
  postalCode: string; // Postal code or range query (e.g. '67500', '67500-67520', '67500, 67510')
  type: PropertyType | 'todas';
  minPrice: number;
  maxPrice: number;
  period: RentPeriod | 'todas';
  bedrooms: number | 'todos';
  bathrooms: number | 'todos';
  furnished: boolean | 'todos';
  petsAllowed: boolean | 'todos';
  has360TourOnly: boolean;
  amenities: string[];
  searchQuery: string;
}

export interface WaitlistEntry {
  id: string;
  email: string;
  city: string;
  state: string;
  propertyTypeInterest: PropertyType | 'cualquiera';
  createdAt: string;
}

// ==========================================
// ADMINISTRATIVE & OPERATIONAL TYPES
// ==========================================

export type AdminRole = 'superadmin' | 'ops_admin' | 'analyst' | 'developer' | 'support';

export type CrmLeadStage = 'nuevo' | 'seguimiento' | 'visita' | 'solicitud' | 'concretada' | 'descartada';

export type LeadChannel = 'sitio_web' | 'whatsapp' | 'telefono' | 'correo';

export interface CrmLead {
  id: string;
  propertyId: string;
  propertyTitle: string;
  propertyColonia: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  stage: CrmLeadStage;
  channel: LeadChannel;
  monthlyBudget: number;
  desiredMoveInDate: string;
  assignedTo: string;
  notes: string[];
  lastActivityHoursAgo: number;
  isOverdue: boolean; // Flagged if >24 hours without contact in early stages
  createdAt: string;
  updatedAt: string;
}

export type FinancialStatus = 'cobrada' | 'pendiente' | 'vencida';

export interface CommissionTransaction {
  id: string;
  propertyId: string;
  propertyTitle: string;
  hostName: string;
  tenantName: string;
  rentAmount: number;
  period: RentPeriod;
  commissionRatePercent: number; // e.g. 8.0 for 8%
  commissionAmount: number; // in MXN
  status: FinancialStatus;
  invoiceDate: string;
  dueDate: string;
  paidDate?: string;
  paymentMethod?: string;
  notes?: string;
}

export interface CommissionSchemeConfig {
  id: string;
  propertyType: PropertyType;
  label: string;
  ratePercent: number;
  minFixedFeeMxn: number;
  isActive: boolean;
  description: string;
}

export type SupportTicketCategory = 'dudas_contrato' | 'problema_360' | 'reporte_propiedad' | 'pago' | 'otro';
export type SupportTicketPriority = 'alta' | 'media' | 'baja';
export type SupportTicketStatus = 'abierta' | 'en_progreso' | 'resuelta';

export interface SupportTicket {
  id: string;
  title: string;
  description: string;
  category: SupportTicketCategory;
  priority: SupportTicketPriority;
  status: SupportTicketStatus;
  applicantName: string;
  applicantContact: string;
  propertyId?: string;
  propertyTitle?: string;
  assignee: string;
  createdAt: string;
  resolvedAt?: string;
  resolutionNote?: string;
}

export type LogLevel = 'error' | 'warning' | 'info';

export interface SystemLogEntry {
  id: string;
  timestamp: string;
  level: LogLevel;
  service: string;
  message: string;
  details?: string;
}

export interface SystemServiceHealth {
  serviceId: string;
  name: string;
  status: 'operational' | 'degraded' | 'maintenance';
  latencyMs: number;
  uptimePercent: number;
  lastChecked: string;
}

export interface AuditLogEntry {
  id: string;
  timestamp: string;
  actor: string;
  role: AdminRole;
  action: string;
  targetType: string;
  targetId: string;
  details: string;
}

export type NotificationCategory = 'urgente' | 'propiedad' | 'crm' | 'finanzas' | 'sistema';

export interface AdminNotification {
  id: string;
  title: string;
  message: string;
  category: NotificationCategory;
  unread: boolean;
  createdAt: string;
  targetTab?: string;
}

export interface BusinessGoal {
  id: string;
  title: string;
  current: number;
  target: number;
  unit: string;
  deadline: string;
  category: 'inventario' | 'ingresos' | 'conversion' | 'satisfaccion';
}
