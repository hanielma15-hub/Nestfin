import { AdminRole, PropertyType } from '../types';

export interface RoleConfig {
  role: AdminRole;
  title: string;
  badgeLabel: string;
  description: string;
  badgeStyle: {
    bg: string;
    text: string;
    border: string;
  };
}

export const ADMIN_ROLES: Record<AdminRole, RoleConfig> = {
  superadmin: {
    role: 'superadmin',
    title: 'Superadministrador',
    badgeLabel: 'Super Admin',
    description: 'Control integral de la plataforma, configuraciones, comisiones, usuarios y seguridad.',
    badgeStyle: {
      bg: 'bg-purple-100',
      text: 'text-purple-800',
      border: 'border-purple-300',
    },
  },
  ops_admin: {
    role: 'ops_admin',
    title: 'Administrador de Operaciones',
    badgeLabel: 'Operaciones',
    description: 'Gestión de catálogo, aprobación de propiedades, seguimiento de leads e incidencias.',
    badgeStyle: {
      bg: 'bg-emerald-100',
      text: 'text-emerald-800',
      border: 'border-emerald-300',
    },
  },
  analyst: {
    role: 'analyst',
    title: 'Analista de Negocio',
    badgeLabel: 'Analista',
    description: 'Métricas de rendimiento, embudo de conversión, analítica 360° y exportación de reportes.',
    badgeStyle: {
      bg: 'bg-blue-100',
      text: 'text-blue-800',
      border: 'border-blue-300',
    },
  },
  developer: {
    role: 'developer',
    title: 'Desarrollador de Software',
    badgeLabel: 'Desarrollador',
    description: 'Monitoreo técnico de servicios, logs de excepción, diagnósticos 360° y auditoría.',
    badgeStyle: {
      bg: 'bg-amber-100',
      text: 'text-amber-800',
      border: 'border-amber-300',
    },
  },
  support: {
    role: 'support',
    title: 'Atención al Cliente',
    badgeLabel: 'Soporte',
    description: 'Gestión de tickets de incidencia, dudas de arrendatarios y seguimiento de solicitudes.',
    badgeStyle: {
      bg: 'bg-teal-100',
      text: 'text-teal-800',
      border: 'border-teal-300',
    },
  },
};

// ==========================================
// RBAC PERMISSION EVALUATORS
// ==========================================

export function canAccessFinancials(role: AdminRole): boolean {
  // Superadmin, operations, and analyst have access. Developer and Support are strictly prohibited.
  return role === 'superadmin' || role === 'ops_admin' || role === 'analyst';
}

export function canModifyCommissionScheme(role: AdminRole): boolean {
  // Only superadmin can modify global commission rates and fees
  return role === 'superadmin';
}

export function canApproveOrRejectProperties(role: AdminRole): boolean {
  // Superadmin and operations admins can approve/reject properties
  return role === 'superadmin' || role === 'ops_admin';
}

export function canManageLeads(role: AdminRole): boolean {
  // Superadmin, operations, and support can manage CRM leads
  return role === 'superadmin' || role === 'ops_admin' || role === 'support';
}

export function canManageSupportTickets(role: AdminRole): boolean {
  return role === 'superadmin' || role === 'ops_admin' || role === 'support';
}

export function canAccessTechnicalPanel(role: AdminRole): boolean {
  // Developer and Superadmin only. Analysts and Support are not allowed to inspect system errors or server internals.
  return role === 'developer' || role === 'superadmin';
}

export function canExportReports(role: AdminRole): boolean {
  // Superadmin, analyst, and ops_admin can export authorized CSV reports
  return role === 'superadmin' || role === 'analyst' || role === 'ops_admin';
}

export function canManageTerritorialExpansion(role: AdminRole): boolean {
  return role === 'superadmin' || role === 'ops_admin';
}

// ==========================================
// FINANCIAL UTILITIES
// ==========================================

/**
 * Calculates intermediate commission respecting minimum fixed fee
 */
export function calculateCommission(
  rentAmount: number,
  ratePercent: number,
  minFixedFeeMxn: number = 0
): number {
  if (rentAmount <= 0) return 0;
  const percentageCut = Math.round((rentAmount * ratePercent) / 100);
  return Math.max(percentageCut, minFixedFeeMxn);
}

/**
 * Currency formatter for Mexican Pesos
 */
export function formatMxn(amount: number): string {
  return new Intl.NumberFormat('es-MX', {
    style: 'currency',
    currency: 'MXN',
    maximumFractionDigits: 0,
  }).format(amount);
}

/**
 * Formats CSV string escaping special characters, quotes, and commas
 */
export function generateCsvContent(headers: string[], rows: (string | number | boolean)[][]): string {
  const sanitize = (val: string | number | boolean): string => {
    const str = String(val ?? '');
    if (str.includes(',') || str.includes('"') || str.includes('\n')) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  const headerLine = headers.map(sanitize).join(',');
  const rowLines = rows.map((row) => row.map(sanitize).join(','));
  return [headerLine, ...rowLines].join('\n');
}

/**
 * Browser CSV trigger
 */
export function triggerCsvDownload(filename: string, csvContent: string): void {
  const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.setAttribute('href', url);
  link.setAttribute('download', filename.endsWith('.csv') ? filename : `${filename}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
