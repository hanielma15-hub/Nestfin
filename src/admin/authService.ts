import { AdminRole } from '../types';

export interface CorporateUser {
  id: string;
  email: string;
  name: string;
  role: AdminRole;
  department: string;
  phone?: string;
  lastLogin?: string;
}

export interface AuthAttemptResult {
  success: boolean;
  user?: CorporateUser;
  error?: string;
  isLocked?: boolean;
  lockedUntil?: number;
  remainingAttempts?: number;
}

// Pre-configured authorized corporate directory for NestFind
export const CORPORATE_USERS_DIRECTORY: Array<CorporateUser & { password: string }> = [
  {
    id: 'corp-usr-01',
    email: 'admin@nestfind.com',
    name: 'Lic. Roberto Garza Treviño',
    role: 'superadmin',
    department: 'Dirección General & Estrategia',
    phone: '+52 (826) 263-4900',
    password: 'montemorelos2026',
  },
  {
    id: 'corp-usr-02',
    email: 'operaciones@nestfind.com',
    name: 'Ing. Mariana Morales Cantú',
    role: 'ops_admin',
    department: 'Operaciones & Catálogo Montemorelos',
    phone: '+52 (826) 263-4901',
    password: 'ops@nestfind',
  },
  {
    id: 'corp-usr-03',
    email: 'analitica@nestfind.com',
    name: 'Lic. Daniel Hinojosa Leal',
    role: 'analyst',
    department: 'Inteligencia de Mercado & Finanzas',
    phone: '+52 (826) 263-4902',
    password: 'metricas2026',
  },
  {
    id: 'corp-usr-04',
    email: 'dev@nestfind.com',
    name: 'Ing. Carlos Salazar Bazán',
    role: 'developer',
    department: 'Infraestructura Web & Panoramas 360°',
    phone: '+52 (826) 263-4903',
    password: 'dev#nestfind',
  },
  {
    id: 'corp-usr-05',
    email: 'soporte@nestfind.com',
    name: 'Elena Treviño González',
    role: 'support',
    department: 'Atención al Cliente & Arrendatarios',
    phone: '+52 (826) 263-4904',
    password: 'soporte@nest',
  },
];

const SESSION_STORAGE_KEY = 'nestfind_corporate_session';
const FAILED_ATTEMPTS_KEY = 'nestfind_auth_failed_attempts';
const LOCKOUT_TIMESTAMP_KEY = 'nestfind_auth_lockout_until';
const MAX_ATTEMPTS = 5;
const LOCKOUT_DURATION_MS = 30 * 1000; // 30 seconds

/**
 * Authenticate corporate user with rate-limiting and brute-force lock
 */
export function authenticateCorporateUser(
  email: string,
  pass: string
): AuthAttemptResult {
  const cleanEmail = email.trim().toLowerCase();
  const cleanPass = pass.trim();

  // Check lockout
  const now = Date.now();
  const lockoutUntil = getLockoutUntil();
  if (lockoutUntil && now < lockoutUntil) {
    const secondsRemaining = Math.ceil((lockoutUntil - now) / 1000);
    return {
      success: false,
      isLocked: true,
      lockedUntil: lockoutUntil,
      error: `Acceso temporalmente bloqueado por múltiples intentos. Espera ${secondsRemaining} segundos antes de reintentar.`,
    };
  }

  // Find user
  const found = CORPORATE_USERS_DIRECTORY.find(
    (u) => u.email.toLowerCase() === cleanEmail && u.password === cleanPass
  );

  if (found) {
    // Reset failed attempts on success
    resetFailedAttempts();

    const authenticatedUser: CorporateUser = {
      id: found.id,
      email: found.email,
      name: found.name,
      role: found.role,
      department: found.department,
      phone: found.phone,
      lastLogin: new Date().toISOString(),
    };

    saveCorporateSession(authenticatedUser);

    return {
      success: true,
      user: authenticatedUser,
    };
  }

  // Handle failure
  const currentAttempts = recordFailedAttempt();
  const remaining = Math.max(0, MAX_ATTEMPTS - currentAttempts);

  if (currentAttempts >= MAX_ATTEMPTS) {
    const lockExpiry = Date.now() + LOCKOUT_DURATION_MS;
    setLockoutUntil(lockExpiry);
    return {
      success: false,
      isLocked: true,
      lockedUntil: lockExpiry,
      remainingAttempts: 0,
      error: 'Límite de intentos excedido. El acceso corporativo ha sido bloqueado por 30 segundos por motivos de seguridad.',
    };
  }

  return {
    success: false,
    remainingAttempts: remaining,
    error: `Credenciales corporativas inválidas. Te quedan ${remaining} ${remaining === 1 ? 'intento' : 'intentos'} antes del bloqueo temporal.`,
  };
}

export function getStoredCorporateSession(): CorporateUser | null {
  if (typeof window === 'undefined') return null;
  try {
    const stored = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
    if (!stored) return null;
    return JSON.parse(stored) as CorporateUser;
  } catch {
    return null;
  }
}

export function saveCorporateSession(user: CorporateUser): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(user));
  } catch (err) {
    console.error('Error saving corporate session', err);
  }
}

export function clearCorporateSession(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(SESSION_STORAGE_KEY);
  } catch (err) {
    console.error('Error clearing corporate session', err);
  }
}

function getFailedAttempts(): number {
  if (typeof window === 'undefined') return 0;
  try {
    const val = window.sessionStorage.getItem(FAILED_ATTEMPTS_KEY);
    return val ? parseInt(val, 10) : 0;
  } catch {
    return 0;
  }
}

function recordFailedAttempt(): number {
  if (typeof window === 'undefined') return 1;
  const next = getFailedAttempts() + 1;
  try {
    window.sessionStorage.setItem(FAILED_ATTEMPTS_KEY, String(next));
  } catch {
    // fallback
  }
  return next;
}

function resetFailedAttempts(): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.removeItem(FAILED_ATTEMPTS_KEY);
    window.sessionStorage.removeItem(LOCKOUT_TIMESTAMP_KEY);
  } catch {
    // fallback
  }
}

function getLockoutUntil(): number | null {
  if (typeof window === 'undefined') return null;
  try {
    const val = window.sessionStorage.getItem(LOCKOUT_TIMESTAMP_KEY);
    return val ? parseInt(val, 10) : null;
  } catch {
    return null;
  }
}

function setLockoutUntil(timestamp: number): void {
  if (typeof window === 'undefined') return;
  try {
    window.sessionStorage.setItem(LOCKOUT_TIMESTAMP_KEY, String(timestamp));
  } catch {
    // fallback
  }
}
