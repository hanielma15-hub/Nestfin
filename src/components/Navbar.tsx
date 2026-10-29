import React, { useState } from 'react';
import {
  Compass,
  Heart,
  PlusCircle,
  MapPin,
  Globe2,
  Menu,
  X,
  Sparkles,
  Home,
  ShieldCheck,
} from 'lucide-react';
import { Region } from '../types';

interface NavbarProps {
  activeRegion: Region;
  favoritesCount: number;
  onOpenFavorites: () => void;
  onOpenPublishModal: () => void;
  onOpenAdminExpansion: () => void;
  onOpenAdminPanel?: () => void;
  onFilter360Tours: () => void;
  onResetSearch: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeRegion,
  favoritesCount,
  onOpenFavorites,
  onOpenPublishModal,
  onOpenAdminExpansion,
  onOpenAdminPanel,
  onFilter360Tours,
  onResetSearch,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [logoClicks, setLogoClicks] = useState(0);

  const handleLogoClick = () => {
    onResetSearch();
    const next = logoClicks + 1;
    setLogoClicks(next);
    if (next >= 5) {
      setLogoClicks(0);
      onOpenAdminPanel?.();
    }
    setTimeout(() => {
      setLogoClicks(0);
    }, 2500);
  };

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200/80 shadow-xs">
      {/* Top Banner Notice for Active Region Transparency */}
      <div className="bg-gradient-to-r from-forest-900 via-forest-800 to-forest-900 text-stone-100 text-xs py-1.5 px-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-medium text-emerald-100">
              Lanzamiento oficial en {activeRegion.name}, {activeRegion.state}
            </span>
            <span className="hidden md:inline text-stone-300">• Tu próximo hogar, más cerca</span>
          </div>

          <div className="flex items-center gap-3 text-xs text-stone-300">
            <span className="hidden sm:inline text-emerald-200/90 font-medium">
              Atención y soporte local en Montemorelos
            </span>
            <span className="text-emerald-300 font-mono text-[11px]">
              contacto@nestfind.com
            </span>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Brand / Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={handleLogoClick}
            className="flex items-center gap-2.5 text-left group cursor-pointer"
            aria-label="Ir al inicio de NestFind"
          >
            <div className="w-10 h-10 rounded-2xl bg-forest-800 flex items-center justify-center text-white shadow-md shadow-forest-950/20 group-hover:bg-forest-700 transition">
              <Home className="w-5 h-5 text-emerald-300" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-xl font-bold tracking-tight text-forest-950 font-display">
                  Nest<span className="text-emerald-700">Find</span>
                </span>
                <span className="text-[11px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-stone-100 text-stone-700 border border-stone-200">
                  {activeRegion.name}
                </span>
              </div>
              <span className="text-[11px] text-stone-500 font-medium block -mt-0.5">
                Tu próximo hogar, más cerca
              </span>
            </div>
          </button>

          {/* Region Badge */}
          <div className="hidden lg:flex items-center gap-1.5 pl-3 border-l border-stone-200 text-xs text-stone-600">
            <MapPin className="w-3.5 h-3.5 text-emerald-700" />
            <span className="font-semibold text-stone-800">{activeRegion.name}, N.L.</span>
            <span className="text-stone-400 font-mono text-[10px] bg-stone-100 px-1.5 py-0.5 rounded">
              {activeRegion.code}
            </span>
          </div>
        </div>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center gap-2">
          <button
            onClick={onResetSearch}
            className="px-3.5 py-2 rounded-xl text-stone-700 hover:text-forest-900 hover:bg-stone-100 font-medium text-sm transition cursor-pointer"
          >
            Catálogo
          </button>

          <button
            onClick={onFilter360Tours}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-emerald-800 bg-emerald-50 hover:bg-emerald-100 font-medium text-sm transition border border-emerald-200/80 cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Recorridos 360°</span>
          </button>

          <button
            onClick={onOpenFavorites}
            aria-label={`Ver favoritos (${favoritesCount})`}
            className="relative p-2.5 rounded-xl text-stone-700 hover:text-forest-900 hover:bg-stone-100 font-medium text-sm transition cursor-pointer"
            title="Mis propiedades guardadas"
          >
            <Heart className="w-5 h-5 text-stone-600 hover:text-rose-600 transition" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center shadow-xs">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={onOpenPublishModal}
            className="flex items-center gap-2 px-4 py-2 rounded-xl bg-forest-800 hover:bg-forest-700 text-white font-medium text-sm shadow-sm transition hover:shadow-md cursor-pointer ml-2"
          >
            <PlusCircle className="w-4 h-4 text-emerald-300" />
            <span>Publicar inmueble</span>
          </button>
        </nav>

        {/* Mobile menu trigger */}
        <div className="flex items-center gap-2 md:hidden">
          <button
            onClick={onOpenFavorites}
            aria-label="Ver favoritos"
            className="relative p-2 rounded-xl text-stone-700 hover:bg-stone-100"
          >
            <Heart className="w-5 h-5" />
            {favoritesCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-rose-500 text-white text-[10px] font-bold flex items-center justify-center">
                {favoritesCount}
              </span>
            )}
          </button>

          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Menú principal"
            className="p-2 rounded-xl text-stone-700 hover:bg-stone-100"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-stone-200 bg-white px-4 pt-3 pb-6 space-y-3">
          <div className="flex items-center gap-2 p-2.5 rounded-xl bg-stone-100 text-xs text-stone-700">
            <MapPin className="w-4 h-4 text-emerald-700 shrink-0" />
            <span>Región activa: <strong>{activeRegion.name}, Nuevo León</strong></span>
          </div>

          <div className="space-y-1">
            <button
              onClick={() => {
                onResetSearch();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-stone-700 hover:bg-stone-100 flex items-center justify-between"
            >
              <span>Catálogo completo</span>
              <span className="text-xs text-stone-400">Montemorelos</span>
            </button>

            <button
              onClick={() => {
                onFilter360Tours();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-emerald-800 bg-emerald-50 flex items-center justify-between border border-emerald-200"
            >
              <span className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-emerald-600" />
                Recorridos Virtuales 360°
              </span>
              <span className="text-xs font-semibold px-2 py-0.5 rounded bg-emerald-600 text-white">
                360°
              </span>
            </button>

            <button
              onClick={() => {
                onOpenFavorites();
                setMobileMenuOpen(false);
              }}
              className="w-full text-left px-3 py-2.5 rounded-xl font-medium text-stone-700 hover:bg-stone-100 flex items-center justify-between"
            >
              <span>Favoritos guardados</span>
              <span className="text-xs bg-stone-200 px-2 py-0.5 rounded-full font-bold">
                {favoritesCount}
              </span>
            </button>

          </div>

          <div className="pt-2">
            <button
              onClick={() => {
                onOpenPublishModal();
                setMobileMenuOpen(false);
              }}
              className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-forest-800 text-white font-semibold text-sm shadow-md"
            >
              <PlusCircle className="w-4 h-4 text-emerald-300" />
              <span>Publicar Inmueble</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
