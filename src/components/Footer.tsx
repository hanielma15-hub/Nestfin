import React from 'react';
import {
  Home,
  MapPin,
  Mail,
  Phone,
  ShieldCheck,
  Globe2,
  Heart,
  Sparkles,
  Lock,
} from 'lucide-react';
import { Region } from '../types';

interface FooterProps {
  activeRegion: Region;
  onOpenAdminExpansion: () => void;
  onOpenAdminPanel?: () => void;
  onFilter360Tours: () => void;
  onOpenPublishModal: () => void;
}

export const Footer: React.FC<FooterProps> = ({
  activeRegion,
  onOpenAdminExpansion,
  onOpenAdminPanel,
  onFilter360Tours,
  onOpenPublishModal,
}) => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800 text-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 mb-10">
          {/* Brand Info */}
          <div className="md:col-span-5 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-forest-800 flex items-center justify-center text-emerald-300">
                <Home className="w-4 h-4" />
              </div>
              <span className="text-xl font-bold tracking-tight text-white font-display">
                Nest<span className="text-emerald-400">Find</span>
              </span>
            </div>
            <p className="text-stone-400 text-xs leading-relaxed max-w-sm">
              Plataforma inmobiliaria profesional para buscar y rentar habitaciones, cuartos, departamentos y casas, con recorridos virtuales interactivos en 360°.
            </p>
            <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold pt-1">
              <MapPin className="w-3.5 h-3.5" />
              <span>Operación inicial activa: {activeRegion.name}, Nuevo León, México</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="md:col-span-2 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Navegación
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>
                <a href="#catalogo" className="hover:text-white transition">
                  Catálogo en Montemorelos
                </a>
              </li>
              <li>
                <button
                  onClick={onFilter360Tours}
                  className="hover:text-emerald-300 transition text-left cursor-pointer flex items-center gap-1"
                >
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  <span>Recorridos 360°</span>
                </button>
              </li>
              <li>
                <button
                  onClick={onOpenPublishModal}
                  className="hover:text-white transition text-left cursor-pointer"
                >
                  Publicar inmueble
                </button>
              </li>
              <li>
                <a
                  href="#preguntas"
                  className="hover:text-stone-300 transition text-left cursor-pointer"
                >
                  Preguntas frecuentes
                </a>
              </li>
            </ul>
          </div>

          {/* Local Information in Montemorelos */}
          <div className="md:col-span-2 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Zonas clave
            </h4>
            <ul className="space-y-1.5 text-stone-400">
              <li>Zona Centro</li>
              <li>Fracc. Las Huertas</li>
              <li>Colonia Matamoros</li>
              <li>Gil de Leyva</li>
              <li>Área UMontemorelos</li>
            </ul>
          </div>

          {/* Transparency & Business Model */}
          <div className="md:col-span-3 space-y-2">
            <h4 className="font-bold text-white uppercase text-[11px] tracking-wider">
              Modelo de Operación
            </h4>
            <p className="text-stone-400 text-[11px] leading-relaxed">
              NestFind conecta a propietarios particulares y administradores con personas que buscan un hogar en renta. Obtenemos ingresos mediante comisiones acordadas por intermediación. No somos propietarios de todos los inmuebles listados.
            </p>
            <div className="pt-1 flex items-center gap-2 text-stone-400 text-[11px]">
              <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
              <span>Modalidades: Quincenal, Mensual y Trimestral</span>
            </div>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-stone-500 text-[11px]">
          <div>
            © {new Date().getFullYear()} NestFind Montemorelos. “Tu próximo hogar, más cerca”. Todos los derechos reservados.
          </div>
          <div className="flex items-center gap-4 flex-wrap">
            <span className="hover:text-stone-400 cursor-pointer">Términos del Servicio</span>
            <span>•</span>
            <span className="hover:text-stone-400 cursor-pointer">Aviso de Privacidad</span>
            <span>•</span>
            <span className="hover:text-stone-400 cursor-pointer">Transparencia Inmobiliaria</span>
            {onOpenAdminPanel && (
              <>
                <span>•</span>
                <button
                  onClick={onOpenAdminPanel}
                  className="text-stone-600 hover:text-stone-400 transition flex items-center gap-1 cursor-pointer"
                  title="Acceso exclusivo para colaboradores autorizados de NestFind"
                  aria-label="Portal de Colaboradores"
                >
                  <Lock className="w-2.5 h-2.5 text-stone-600" />
                  <span className="text-[10px]">Colaboradores</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </footer>
  );
};
