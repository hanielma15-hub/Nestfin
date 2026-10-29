import {
  CrmLead,
  CommissionTransaction,
  CommissionSchemeConfig,
  SupportTicket,
  SystemServiceHealth,
  SystemLogEntry,
  AuditLogEntry,
  AdminNotification,
  BusinessGoal,
} from '../types';

// ==========================================
// 1. COMMISSION SCHEMES (CONFIGURABLE)
// ==========================================

export const INITIAL_COMMISSION_SCHEMES: CommissionSchemeConfig[] = [
  {
    id: 'scheme-habitacion',
    propertyType: 'habitacion',
    label: 'Habitaciones & Cuartos para estudiantes',
    ratePercent: 7.5,
    minFixedFeeMxn: 350,
    isActive: true,
    description: 'Comisión reducida para estudiantes universitarios y estancias por semestre.',
  },
  {
    id: 'scheme-depto',
    propertyType: 'departamento',
    label: 'Departamentos independientes',
    ratePercent: 8.5,
    minFixedFeeMxn: 600,
    isActive: true,
    description: 'Tarifa estándar para departamentos amueblados y no amueblados.',
  },
  {
    id: 'scheme-casa',
    propertyType: 'casa',
    label: 'Casas residenciales unifamiliares',
    ratePercent: 9.0,
    minFixedFeeMxn: 900,
    isActive: true,
    description: 'Comisión con paquete de fotografía 360° y promoción destacada incluida.',
  },
];

// ==========================================
// 2. FINANCIAL TRANSACTIONS (MONTEMORELOS)
// ==========================================

export const INITIAL_COMMISSION_TRANSACTIONS: CommissionTransaction[] = [
  {
    id: 'tx-101',
    propertyId: 'prop-1',
    propertyTitle: 'Casa Residencial Las Huertas con Alberca',
    hostName: 'Ing. Fernando Cavazos M.',
    tenantName: 'Dra. Rebeca Salazar & Familia',
    rentAmount: 14500,
    period: 'mensual',
    commissionRatePercent: 9.0,
    commissionAmount: 1305,
    status: 'cobrada',
    invoiceDate: '2026-03-01',
    dueDate: '2026-03-08',
    paidDate: '2026-03-04',
    paymentMethod: 'SPEI BBVA',
    notes: 'Intermediación concretada con contrato por 12 meses.',
  },
  {
    id: 'tx-102',
    propertyId: 'prop-2',
    propertyTitle: 'Departamento Ejecutivo Zona Centro Histórico',
    hostName: 'Lic. Mariana Garza T.',
    tenantName: 'Prof. Carlos Eduardo Peña',
    rentAmount: 7800,
    period: 'mensual',
    commissionRatePercent: 8.5,
    commissionAmount: 663,
    status: 'cobrada',
    invoiceDate: '2026-03-05',
    dueDate: '2026-03-12',
    paidDate: '2026-03-07',
    paymentMethod: 'SPEI Banorte',
    notes: 'Inquilino docente de la región.',
  },
  {
    id: 'tx-103',
    propertyId: 'prop-3',
    propertyTitle: 'Cuarto Estudiantil UMontemorelos Amueblado',
    hostName: 'Doña Elena Rodríguez Vda. de Gómez',
    tenantName: 'Samuel David Torres (Est. Medicina)',
    rentAmount: 3800,
    period: 'mensual',
    commissionRatePercent: 7.5,
    commissionAmount: 350, // Applied minimum fee
    status: 'cobrada',
    invoiceDate: '2026-03-10',
    dueDate: '2026-03-17',
    paidDate: '2026-03-12',
    paymentMethod: 'Transferencia Directa',
    notes: 'Estudiante foráneo UMontemorelos.',
  },
  {
    id: 'tx-104',
    propertyId: 'prop-4',
    propertyTitle: 'Casa Quinta Familiar Fraccionamiento Bugambilias',
    hostName: 'Arq. Roberto Lozano Benítez',
    tenantName: 'Ing. Alejandro Villarreal C.',
    rentAmount: 12000,
    period: 'mensual',
    commissionRatePercent: 9.0,
    commissionAmount: 1080,
    status: 'pendiente',
    invoiceDate: '2026-03-15',
    dueDate: '2026-03-25',
    notes: 'Contrato firmado, depósito en custodia.',
  },
  {
    id: 'tx-105',
    propertyId: 'prop-6',
    propertyTitle: 'Estudio Loft Independiente Colonia Gil de Leyva',
    hostName: 'Patricio Morales Cantú',
    tenantName: 'Valeria Nicole Ríos',
    rentAmount: 4900,
    period: 'mensual',
    commissionRatePercent: 8.5,
    commissionAmount: 417,
    status: 'pendiente',
    invoiceDate: '2026-03-18',
    dueDate: '2026-03-26',
    notes: 'En proceso de verificación de fiador.',
  },
  {
    id: 'tx-106',
    propertyId: 'prop-5',
    propertyTitle: 'Habitación Privada en Residencia Estudiantil Matamoros',
    hostName: 'Prof. Héctor Manuel Treviño',
    tenantName: 'Jorge Andrés Morales',
    rentAmount: 3200,
    period: 'mensual',
    commissionRatePercent: 7.5,
    commissionAmount: 350, // Applied min fee
    status: 'vencida',
    invoiceDate: '2026-02-15',
    dueDate: '2026-02-28',
    notes: 'Aviso de cobranza enviado al anfitrión.',
  },
];

// ==========================================
// 3. CRM LEADS & RENTAL INQUIRIES
// ==========================================

export const INITIAL_CRM_LEADS: CrmLead[] = [
  {
    id: 'lead-201',
    propertyId: 'prop-1',
    propertyTitle: 'Casa Residencial Las Huertas con Alberca',
    propertyColonia: 'Fracc. Las Huertas (C.P. 67510)',
    applicantName: 'Dr. Guillermo Treviño Martínez',
    applicantEmail: 'gtrevino.med@gmail.com',
    applicantPhone: '+52 826 104 8821',
    stage: 'visita',
    channel: 'whatsapp',
    monthlyBudget: 15000,
    desiredMoveInDate: '2026-04-01',
    assignedTo: 'Carlos Operaciones',
    notes: [
      'Interesado por cercanía a clínica médica.',
      'Recorrido 360° revisado desde su iPad.',
      'Visita presencial agendada para este sábado 11:00 AM.',
    ],
    lastActivityHoursAgo: 4,
    isOverdue: false,
    createdAt: '2026-03-16T10:30:00Z',
    updatedAt: '2026-03-18T14:20:00Z',
  },
  {
    id: 'lead-202',
    propertyId: 'prop-3',
    propertyTitle: 'Cuarto Estudiantil UMontemorelos Amueblado',
    propertyColonia: 'Colonia Matamoros (C.P. 67520)',
    applicantName: 'Esteban Coronado Garza',
    applicantEmail: 'esteban.coronado@edu.mx',
    applicantPhone: '+52 811 552 9012',
    stage: 'seguimiento',
    channel: 'sitio_web',
    monthlyBudget: 4000,
    desiredMoveInDate: '2026-03-25',
    assignedTo: 'Valeria Soporte',
    notes: [
      'Estudiante nuevo ingreso semestre primavera.',
      'Pregunta si los servicios de agua e internet de fibra óptica están incluidos.',
    ],
    lastActivityHoursAgo: 28, // Overdue (>24 hrs without follow up!)
    isOverdue: true,
    createdAt: '2026-03-17T09:00:00Z',
    updatedAt: '2026-03-17T09:00:00Z',
  },
  {
    id: 'lead-203',
    propertyId: 'prop-2',
    propertyTitle: 'Departamento Ejecutivo Zona Centro Histórico',
    propertyColonia: 'Centro (C.P. 67500)',
    applicantName: 'Ing. Sandra Patricia De la Rosa',
    applicantEmail: 'sandra.delarosa@citricosnl.com',
    applicantPhone: '+52 826 263 4410',
    stage: 'solicitud',
    channel: 'sitio_web',
    monthlyBudget: 8500,
    desiredMoveInDate: '2026-04-15',
    assignedTo: 'Carlos Operaciones',
    notes: [
      'Envió comprobantes de nómina e identificación oficial.',
      'Elaborando contrato de arrendamiento con Lic. Mariana Garza.',
    ],
    lastActivityHoursAgo: 2,
    isOverdue: false,
    createdAt: '2026-03-15T16:00:00Z',
    updatedAt: '2026-03-18T16:00:00Z',
  },
  {
    id: 'lead-204',
    propertyId: 'prop-6',
    propertyTitle: 'Estudio Loft Independiente Colonia Gil de Leyva',
    propertyColonia: 'Gil de Leyva (C.P. 67512)',
    applicantName: 'Luis Alfonso Salazar',
    applicantEmail: 'luis.alfonso@yahoo.com',
    applicantPhone: '+52 826 110 3345',
    stage: 'nuevo',
    channel: 'correo',
    monthlyBudget: 5000,
    desiredMoveInDate: '2026-04-01',
    assignedTo: 'Sin asignar',
    notes: ['Envió mensaje solicitando confirmar si aceptan mascota pequeña (gato esterilizado).'],
    lastActivityHoursAgo: 1,
    isOverdue: false,
    createdAt: '2026-03-18T17:15:00Z',
    updatedAt: '2026-03-18T17:15:00Z',
  },
  {
    id: 'lead-205',
    propertyId: 'prop-4',
    propertyTitle: 'Casa Quinta Familiar Fraccionamiento Bugambilias',
    propertyColonia: 'Fracc. Bugambilias (C.P. 67515)',
    applicantName: 'Mtro. Héctor Daniel Quiroga',
    applicantEmail: 'quiroga.hector@uanl.edu.mx',
    applicantPhone: '+52 818 201 9934',
    stage: 'concretada',
    channel: 'telefono',
    monthlyBudget: 12500,
    desiredMoveInDate: '2026-03-01',
    assignedTo: 'Carlos Operaciones',
    notes: ['Renta formalizada con éxito. Comisión cobrada vía SPEI.'],
    lastActivityHoursAgo: 120,
    isOverdue: false,
    createdAt: '2026-02-20T11:00:00Z',
    updatedAt: '2026-03-04T12:00:00Z',
  },
];

// ==========================================
// 4. SUPPORT INCIDENTS & TICKETING
// ==========================================

export const INITIAL_SUPPORT_TICKETS: SupportTicket[] = [
  {
    id: 'tkt-301',
    title: 'Duda sobre comprobante de depósito en garantía',
    description: 'El interesado pregunta si el depósito en garantía se retiene en cuenta custodia NestFind o directo con el anfitrión.',
    category: 'dudas_contrato',
    priority: 'alta',
    status: 'en_progreso',
    applicantName: 'Ing. Sandra Patricia De la Rosa',
    applicantContact: 'sandra.delarosa@citricosnl.com',
    propertyId: 'prop-2',
    propertyTitle: 'Departamento Ejecutivo Zona Centro Histórico',
    assignee: 'Valeria Soporte',
    createdAt: '2026-03-18T11:20:00Z',
  },
  {
    id: 'tkt-302',
    title: 'Visualización de Recorrido 360° en celular Android antiguo',
    description: 'Usuario reporta que en un dispositivo Android de 2GB RAM el giroscopio se desorientaba al rotar el cuarto.',
    category: 'problema_360',
    priority: 'media',
    status: 'resuelta',
    applicantName: 'Raúl Mendoza',
    applicantContact: '+52 826 109 2311',
    propertyId: 'prop-1',
    propertyTitle: 'Casa Residencial Las Huertas con Alberca',
    assignee: 'Equipo Técnico NestFind',
    createdAt: '2026-03-14T15:00:00Z',
    resolvedAt: '2026-03-15T10:00:00Z',
    resolutionNote: 'Se habilitó fallback táctil con drag suave cuando el sensor de giroscopio no responde.',
  },
  {
    id: 'tkt-303',
    title: 'Solicitud de verificación fotográfica presencial',
    description: 'Propietario en Fracc. Las Huertas solicita visita del equipo para tomar fotografías equirrectangulares 360° profesionales.',
    category: 'reporte_propiedad',
    priority: 'media',
    status: 'abierta',
    applicantName: 'Arq. Roberto Lozano Benítez',
    applicantContact: 'roberto.lozano@montemorelos.mx',
    propertyId: 'prop-4',
    propertyTitle: 'Casa Quinta Familiar Fraccionamiento Bugambilias',
    assignee: 'Carlos Operaciones',
    createdAt: '2026-03-17T16:45:00Z',
  },
];

// ==========================================
// 5. SYSTEM SERVICE HEALTH (DEVELOPER PANEL)
// ==========================================

export const INITIAL_SYSTEM_SERVICES: SystemServiceHealth[] = [
  {
    serviceId: 'srv-cdn',
    name: 'CDN & Almacenamiento de Panoramas 360°',
    status: 'operational',
    latencyMs: 38,
    uptimePercent: 99.98,
    lastChecked: 'Hace 2 minutos',
  },
  {
    serviceId: 'srv-webgl',
    name: 'Motor de Renderizado 360° (Three.js WebGL)',
    status: 'operational',
    latencyMs: 14,
    uptimePercent: 100.0,
    lastChecked: 'Hace 1 minuto',
  },
  {
    serviceId: 'srv-search',
    name: 'Indexador Geoespacial Montemorelos (C.P. / Colonias)',
    status: 'operational',
    latencyMs: 22,
    uptimePercent: 99.95,
    lastChecked: 'Hace 3 minutos',
  },
  {
    serviceId: 'srv-db',
    name: 'Persistencia de Catálogo & Leads (Sync LocalStorage)',
    status: 'operational',
    latencyMs: 5,
    uptimePercent: 100.0,
    lastChecked: 'Hace 30 segundos',
  },
  {
    serviceId: 'srv-analytics',
    name: 'Pipeline de Analítica de Visitas & Conversión',
    status: 'operational',
    latencyMs: 45,
    uptimePercent: 99.9,
    lastChecked: 'Hace 4 minutos',
  },
];

// ==========================================
// 6. SYSTEM LOGS & AUDIT TRAIL
// ==========================================

export const INITIAL_SYSTEM_LOGS: SystemLogEntry[] = [
  {
    id: 'log-501',
    timestamp: '2026-03-18 17:42:10',
    level: 'info',
    service: 'geo-filter',
    message: 'Búsqueda por filtro compuesta: colonia="Fracc. Las Huertas" + cp="67510" (3 resultados generados).',
  },
  {
    id: 'log-502',
    timestamp: '2026-03-18 17:30:05',
    level: 'info',
    service: 'tour360-viewer',
    message: 'Hotspot navegado: Sala Principal -> Cocina Integral en prop-1. Textura 4096x2048 precargada en 180ms.',
  },
  {
    id: 'log-503',
    timestamp: '2026-03-18 16:15:22',
    level: 'warning',
    service: 'lead-pipeline',
    message: 'Alerta SLA: Lead #lead-202 lleva 28 horas sin contacto inicial. Notificación enviada al equipo.',
  },
  {
    id: 'log-504',
    timestamp: '2026-03-18 14:02:11',
    level: 'info',
    service: 'auth-rbac',
    message: 'Sesión administrativa autenticada para rol "superadmin" (IP Localhost / Montemorelos Ops).',
  },
  {
    id: 'log-505',
    timestamp: '2026-03-17 19:40:55',
    level: 'error',
    service: 'tour360-viewer',
    message: 'WebGL Context Warning: Fallback a renderizado 2D estático activado temporalmente por dispositivo legado.',
    details: 'Dispositivo emulado: WebGL 1.0 sin soporte de float textures.',
  },
];

export const INITIAL_AUDIT_LOGS: AuditLogEntry[] = [
  {
    id: 'adt-601',
    timestamp: '2026-03-18 16:55:00',
    actor: 'Superadministrador',
    role: 'superadmin',
    action: 'ACTUALIZAR_ESTATUS_COMISION',
    targetType: 'Transacción',
    targetId: 'tx-101',
    details: 'Marcada comisión de $1,305 MXN como "Cobrada" con referencia SPEI BBVA.',
  },
  {
    id: 'adt-602',
    timestamp: '2026-03-18 14:30:15',
    actor: 'Carlos Operaciones',
    role: 'ops_admin',
    action: 'VERIFICAR_PROPIEDAD',
    targetType: 'Propiedad',
    targetId: 'prop-1',
    details: 'Asignado sello de "Identidad Verificada" y validación catastral de C.P. 67510.',
  },
  {
    id: 'adt-603',
    timestamp: '2026-03-17 11:20:00',
    actor: 'Superadministrador',
    role: 'superadmin',
    action: 'CONFIGURAR_ESQUEMA_COMISIONES',
    targetType: 'Esquema Tarifario',
    targetId: 'scheme-habitacion',
    details: 'Ajustada tasa base al 7.5% con mínimo de $350 MXN para cuartos estudiantiles.',
  },
];

// ==========================================
// 7. INTERNAL NOTIFICATIONS
// ==========================================

export const INITIAL_NOTIFICATIONS: AdminNotification[] = [
  {
    id: 'notif-1',
    title: 'Lead con tiempo de respuesta vencido (>24h)',
    message: 'Esteban Coronado Garza solicitó cuarto estudiantil en Matamoros. Requiere seguimiento urgente.',
    category: 'urgente',
    unread: true,
    createdAt: 'Hace 2 horas',
    targetTab: 'crm',
  },
  {
    id: 'notif-2',
    title: 'Nueva solicitud de publicación pendiente',
    message: 'Propietario registró departamento en Fracc. Bugambilias. Requiere validación de fotos y C.P.',
    category: 'propiedad',
    unread: true,
    createdAt: 'Hace 4 horas',
    targetTab: 'inventory',
  },
  {
    id: 'notif-3',
    title: 'Comisión pendiente de cobro ($1,080 MXN)',
    message: 'Transacción #tx-104 en Fraccionamiento Bugambilias está lista para emisión de recibo.',
    category: 'finanzas',
    unread: false,
    createdAt: 'Ayer',
    targetTab: 'financials',
  },
  {
    id: 'notif-4',
    title: 'Alta demanda estudiantil detectada',
    message: '68% de las búsquedas en Montemorelos con C.P. 67520 buscan cuartos amueblados con servicios.',
    category: 'sistema',
    unread: false,
    createdAt: 'Hace 2 días',
    targetTab: 'bi',
  },
];

// ==========================================
// 8. BUSINESS GOALS & MONTHLY TARGETS
// ==========================================

export const INITIAL_BUSINESS_GOALS: BusinessGoal[] = [
  {
    id: 'goal-1',
    title: 'Propiedades activas con recorrido 360° en Montemorelos',
    current: 6,
    target: 15,
    unit: 'propiedades',
    deadline: '30 de Abril 2026',
    category: 'inventario',
  },
  {
    id: 'goal-2',
    title: 'Volumen de comisiones intermediadas en el mes',
    current: 4165,
    target: 12000,
    unit: 'MXN',
    deadline: '31 de Marzo 2026',
    category: 'ingresos',
  },
  {
    id: 'goal-3',
    title: 'Tasa de conversión de visita a contacto formal',
    current: 12.8,
    target: 15.0,
    unit: '%',
    deadline: 'Trimestre Q2',
    category: 'conversion',
  },
  {
    id: 'goal-4',
    title: 'Tiempo promedio de respuesta a interesados (< 2 hrs)',
    current: 85,
    target: 95,
    unit: '% en SLA',
    deadline: 'Operación continua',
    category: 'satisfaccion',
  },
];

// ==========================================
// LOCAL STORAGE PERSISTENCE HELPERS
// ==========================================

const CRM_STORAGE_KEY = 'nestfind_crm_leads';
const TX_STORAGE_KEY = 'nestfind_commission_transactions';
const SCHEMES_STORAGE_KEY = 'nestfind_commission_schemes';
const TICKETS_STORAGE_KEY = 'nestfind_support_tickets';
const NOTIFS_STORAGE_KEY = 'nestfind_admin_notifications';

export function getStoredCrmLeads(): CrmLead[] {
  try {
    const raw = localStorage.getItem(CRM_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_CRM_LEADS;
  } catch {
    return INITIAL_CRM_LEADS;
  }
}

export function saveStoredCrmLeads(leads: CrmLead[]): void {
  try {
    localStorage.setItem(CRM_STORAGE_KEY, JSON.stringify(leads));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredTransactions(): CommissionTransaction[] {
  try {
    const raw = localStorage.getItem(TX_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_COMMISSION_TRANSACTIONS;
  } catch {
    return INITIAL_COMMISSION_TRANSACTIONS;
  }
}

export function saveStoredTransactions(transactions: CommissionTransaction[]): void {
  try {
    localStorage.setItem(TX_STORAGE_KEY, JSON.stringify(transactions));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredCommissionSchemes(): CommissionSchemeConfig[] {
  try {
    const raw = localStorage.getItem(SCHEMES_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_COMMISSION_SCHEMES;
  } catch {
    return INITIAL_COMMISSION_SCHEMES;
  }
}

export function saveStoredCommissionSchemes(schemes: CommissionSchemeConfig[]): void {
  try {
    localStorage.setItem(SCHEMES_STORAGE_KEY, JSON.stringify(schemes));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredTickets(): SupportTicket[] {
  try {
    const raw = localStorage.getItem(TICKETS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_SUPPORT_TICKETS;
  } catch {
    return INITIAL_SUPPORT_TICKETS;
  }
}

export function saveStoredTickets(tickets: SupportTicket[]): void {
  try {
    localStorage.setItem(TICKETS_STORAGE_KEY, JSON.stringify(tickets));
  } catch (e) {
    console.error(e);
  }
}

export function getStoredNotifications(): AdminNotification[] {
  try {
    const raw = localStorage.getItem(NOTIFS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : INITIAL_NOTIFICATIONS;
  } catch {
    return INITIAL_NOTIFICATIONS;
  }
}

export function saveStoredNotifications(notifs: AdminNotification[]): void {
  try {
    localStorage.setItem(NOTIFS_STORAGE_KEY, JSON.stringify(notifs));
  } catch (e) {
    console.error(e);
  }
}
