import React, { useState, useEffect } from 'react';
import {
  ShieldCheck,
  Lock,
  KeyRound,
  Eye,
  EyeOff,
  AlertTriangle,
  ArrowLeft,
  Building2,
  CheckCircle2,
  Sparkles,
  UserCheck,
  Info,
} from 'lucide-react';
import {
  authenticateCorporateUser,
  CORPORATE_USERS_DIRECTORY,
  CorporateUser,
} from './authService';

interface AdminAuthGateProps {
  onLoginSuccess: (user: CorporateUser) => void;
  onCancel: () => void;
}

export const AdminAuthGate: React.FC<AdminAuthGateProps> = ({
  onLoginSuccess,
  onCancel,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutSeconds, setLockoutSeconds] = useState<number | null>(null);
  const [showQuickAccess, setShowQuickAccess] = useState(true);

  // Lockout countdown timer
  useEffect(() => {
    if (!lockoutSeconds || lockoutSeconds <= 0) return;
    const timer = setInterval(() => {
      setLockoutSeconds((prev) => {
        if (!prev || prev <= 1) {
          setError(null);
          return null;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutSeconds]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutSeconds && lockoutSeconds > 0) return;

    if (!email.trim() || !password.trim()) {
      setError('Por favor ingresa tanto tu correo corporativo como tu clave de acceso.');
      return;
    }

    setIsLoading(true);
    setError(null);

    // Small delay to simulate credential verification
    setTimeout(() => {
      const result = authenticateCorporateUser(email, password);
      setIsLoading(false);

      if (result.success && result.user) {
        onLoginSuccess(result.user);
      } else {
        setError(result.error || 'Credenciales corporativas inválidas.');
        if (result.isLocked && result.lockedUntil) {
          const seconds = Math.ceil((result.lockedUntil - Date.now()) / 1000);
          setLockoutSeconds(Math.max(1, seconds));
        }
      }
    }, 350);
  };

  const handleSelectRolePreset = (preset: typeof CORPORATE_USERS_DIRECTORY[0]) => {
    setEmail(preset.email);
    setPassword(preset.password);
    setError(null);
  };

  return (
    <div className="min-h-screen bg-stone-950 flex flex-col justify-between text-stone-100 font-sans selection:bg-emerald-500 selection:text-white relative overflow-hidden">
      {/* Background ambient lighting */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[500px] bg-emerald-950/20 blur-[140px] pointer-events-none rounded-full" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[400px] bg-forest-900/15 blur-[120px] pointer-events-none rounded-full" />

      {/* Top Header */}
      <header className="relative z-10 max-w-6xl w-full mx-auto px-4 sm:px-6 py-6 flex items-center justify-between">
        <button
          onClick={onCancel}
          className="flex items-center gap-2 text-xs font-semibold text-stone-400 hover:text-white transition px-3 py-2 rounded-xl bg-stone-900/80 border border-stone-800 hover:border-stone-700 cursor-pointer"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Volver al sitio público</span>
        </button>

        <div className="flex items-center gap-2 text-stone-400 text-xs">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-[11px] tracking-wider uppercase text-emerald-300">
            SSL 256-Bit • Acceso Encriptado
          </span>
        </div>
      </header>

      {/* Main Authentication Box */}
      <main className="relative z-10 max-w-xl w-full mx-auto px-4 py-8">
        <div className="bg-stone-900/90 backdrop-blur-xl border border-stone-800/90 rounded-3xl p-6 sm:p-9 shadow-2xl shadow-black/80 space-y-6">
          {/* Brand & Security Header */}
          <div className="text-center space-y-2.5">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-forest-800 to-forest-950 border border-forest-700 flex items-center justify-center mx-auto text-emerald-400 shadow-lg shadow-forest-950/60">
              <Lock className="w-6 h-6" />
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-800/60 text-emerald-300 text-[11px] font-semibold tracking-wide uppercase">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              Portal Corporativo Privado
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight font-display">
              Nest<span className="text-emerald-400">Find</span> Operaciones
            </h1>
            <p className="text-xs text-stone-400 max-w-md mx-auto leading-relaxed">
              Acceso restringido exclusivamente a socios, directivos, equipo de operaciones y desarrolladores autorizados de NestFind México.
            </p>
          </div>

          {/* Error / Lockout Alert */}
          {error && (
            <div className="p-4 rounded-2xl bg-rose-950/70 border border-rose-800/80 text-rose-200 text-xs flex items-start gap-3 animate-fade-in">
              <AlertTriangle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
              <div>
                <p className="font-semibold text-rose-100">Acceso Denegado</p>
                <p className="mt-0.5 text-rose-300/90 leading-relaxed">{error}</p>
                {lockoutSeconds && lockoutSeconds > 0 && (
                  <p className="mt-2 text-xs font-mono font-bold text-amber-300">
                    Tiempo de espera obligatorio: {lockoutSeconds}s
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                Correo Electrónico Corporativo
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="ejemplo@nestfind.com"
                  required
                  disabled={Boolean(lockoutSeconds && lockoutSeconds > 0) || isLoading}
                  className="w-full bg-stone-950/80 border border-stone-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 text-sm text-white placeholder-stone-600 outline-none transition disabled:opacity-50"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="block text-xs font-semibold text-stone-300">
                  Clave de Acceso Corporativa / PIN
                </label>
                <span className="text-[10px] text-stone-500">Mínimo 8 caracteres</span>
              </div>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••••••"
                  required
                  disabled={Boolean(lockoutSeconds && lockoutSeconds > 0) || isLoading}
                  className="w-full bg-stone-950/80 border border-stone-800 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 rounded-xl px-4 py-3 pr-11 text-sm text-white placeholder-stone-600 outline-none transition font-mono disabled:opacity-50"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-500 hover:text-stone-300 p-1 cursor-pointer"
                  aria-label={showPassword ? 'Ocultar clave' : 'Mostrar clave'}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading || Boolean(lockoutSeconds && lockoutSeconds > 0)}
              className="w-full py-3.5 px-4 rounded-xl bg-gradient-to-r from-emerald-600 to-forest-700 hover:from-emerald-500 hover:to-forest-600 text-white font-bold text-sm shadow-lg shadow-emerald-950/50 transition duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
            >
              {isLoading ? (
                <>
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                  <span>Verificando credenciales...</span>
                </>
              ) : (
                <>
                  <KeyRound className="w-4 h-4" />
                  <span>Validar Credenciales Corporativas</span>
                </>
              )}
            </button>
          </form>

          {/* Quick-Access Test Panel for Personnel / Reviewers */}
          <div className="pt-4 border-t border-stone-800/80">
            <button
              type="button"
              onClick={() => setShowQuickAccess(!showQuickAccess)}
              className="w-full flex items-center justify-between text-left text-xs font-semibold text-stone-400 hover:text-emerald-300 transition cursor-pointer"
            >
              <div className="flex items-center gap-1.5">
                <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                <span>Credenciales Corporativas Autorizadas (Demostración)</span>
              </div>
              <span className="text-[10px] text-stone-500 underline">
                {showQuickAccess ? 'Ocultar' : 'Ver perfiles autorizados'}
              </span>
            </button>

            {showQuickAccess && (
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {CORPORATE_USERS_DIRECTORY.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectRolePreset(user)}
                    className="p-2.5 rounded-xl bg-stone-950/90 border border-stone-800 hover:border-emerald-600/60 hover:bg-forest-950/30 text-left transition cursor-pointer group"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-bold text-stone-200 group-hover:text-emerald-300 transition text-[11px]">
                        {user.name.split(' ')[0]} {user.name.split(' ')[1] || ''}
                      </span>
                      <span className="text-[9px] uppercase font-mono px-1.5 py-0.5 rounded bg-stone-800 text-stone-400">
                        {user.role}
                      </span>
                    </div>
                    <div className="text-[10px] text-stone-400 font-mono truncate">
                      {user.email}
                    </div>
                    <div className="text-[10px] text-emerald-400/80 font-mono mt-0.5">
                      Clave: {user.password}
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Confidentiality Notice */}
          <div className="pt-3 border-t border-stone-800/50 flex items-start gap-2.5 text-[10px] text-stone-500 leading-relaxed">
            <Info className="w-3.5 h-3.5 text-stone-400 shrink-0 mt-0.5" />
            <p>
              <strong>Aviso de Confidencialidad y Seguridad:</strong> El acceso a este panel está estrictamente restringido a directivos y empleados autorizados de NestFind México. Todos los accesos son auditados conforme a la Ley Federal de Protección de Datos Personales (LFPDPPP). El uso no autorizado será perseguido civil y penalmente.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 max-w-6xl w-full mx-auto px-4 py-4 text-center text-stone-500 text-[11px]">
        © {new Date().getFullYear()} NestFind México • Sistema de Administración y Operaciones Inmobiliarias
      </footer>
    </div>
  );
};
