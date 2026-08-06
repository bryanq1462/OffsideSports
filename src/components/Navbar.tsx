import React, { useState } from 'react';
import { 
  ShoppingBag, 
  Search, 
  ShieldCheck, 
  MessageCircle, 
  UserCheck, 
  Menu, 
  X, 
  Shirt, 
  DollarSign, 
  SlidersHorizontal,
  Instagram
} from 'lucide-react';
import { formatPrice } from '../utils/storage';

import { StoreSettings } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  cartCount: number;
  cartTotalUSD: number;
  onOpenCart: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  currency: 'CRC' | 'USD';
  setCurrency: (currency: 'CRC' | 'USD') => void;
  onOpenAdmin: () => void;
  settings?: StoreSettings;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  cartCount,
  cartTotalUSD,
  onOpenCart,
  searchQuery,
  setSearchQuery,
  currency,
  setCurrency,
  onOpenAdmin,
  settings
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const phoneDisplay = settings?.contactPhone || '+506 8559 5192';

  const navItems = [
    { id: 'catalog', label: 'Catálogo', icon: Shirt },
    { id: 'filters', label: 'Buscador & Filtros', icon: SlidersHorizontal },
    { id: 'reviews', label: 'Reseñas Verificadas', icon: UserCheck },
    { id: 'contact', label: 'Contacto & WhatsApp', icon: MessageCircle }
  ];

  return (
    <header className="sticky top-0 z-40 bg-[#0a0a0a]/95 backdrop-blur-md border-b border-white/10 text-white shadow-2xl">
      {/* Top Banner */}
      <div className="bg-[#000000] border-b border-white/10 text-white/80 px-4 py-1.5 text-xs font-bold tracking-widest uppercase flex items-center justify-between">
        <div className="max-w-7xl mx-auto w-full flex justify-between items-center px-2">
          <div className="flex items-center gap-2">
            <span className="bg-[#ccff00] text-black text-[10px] font-black uppercase px-2 py-0.5 rounded-sm">
              COSTA RICA
            </span>
            <span className="hidden sm:inline text-white/70">Envíos a todo Costa Rica por Correos de CR y Mensajería | WhatsApp: {phoneDisplay}</span>
            <span className="sm:hidden text-white/70">Envíos a todo Costa Rica ({phoneDisplay})</span>
          </div>
          <div className="flex items-center gap-2 sm:gap-3 text-[11px]">
            <a
              href="https://www.instagram.com/offside_sports22?igsh=MXZib2J3cjV2bnl1YQ=="
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-extrabold px-2.5 py-1 rounded-md shadow-md hover:scale-105 transition-all cursor-pointer"
              title="Síguenos en Instagram @offside_sports22"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span className="hidden sm:inline font-black text-[10px] tracking-wider">INSTAGRAM</span>
            </a>
            <button
              onClick={() => setCurrency(currency === 'CRC' ? 'USD' : 'CRC')}
              className="hover:text-[#ccff00] flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-md border border-white/10 transition cursor-pointer font-extrabold"
              title="Cambiar Moneda"
            >
              <DollarSign className="w-3 h-3 text-[#ccff00]" />
              <span>MONEDA:</span> <span className="font-black text-[#ccff00]">{currency}</span>
            </button>
            <button 
              onClick={onOpenAdmin}
              className="hover:text-[#ccff00] transition flex items-center gap-1 font-black cursor-pointer text-white/80"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#ccff00]" />
              <span className="hidden md:inline">ADMIN</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Navbar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20 gap-4">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => { setActiveTab('catalog'); window.scrollTo({ top: 0, behavior: 'smooth' }); }}
              className="flex items-center gap-2 group text-left cursor-pointer"
            >
              <div className="text-3xl sm:text-4xl font-black italic tracking-tighter uppercase text-white">
                OFFSIDE<span className="text-[#ccff00]">.</span>
              </div>
              <span className="hidden sm:inline-block text-[9px] font-black uppercase tracking-[0.2em] bg-white/10 text-white/70 px-2 py-0.5 rounded border border-white/10">
                KITS & RETRO
              </span>
            </button>
          </div>

          {/* Quick Search Input (Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-md mx-4 relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'filters' && activeTab !== 'catalog') {
                  setActiveTab('catalog');
                }
              }}
              placeholder="Buscar camisetas, equipos, ligas o jugadores..."
              className="w-full bg-white/5 border border-white/20 rounded-full py-2 pl-10 pr-10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ccff00] transition-all font-semibold"
            />
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-2.5" />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-white/40 hover:text-white text-xs font-black"
              >
                ✕
              </button>
            )}
          </div>

          {/* Desktop Nav Items */}
          <nav className="hidden md:flex items-center gap-1 lg:gap-3 text-xs font-black uppercase tracking-widest">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => {
                    setActiveTab(item.id);
                    setMobileMenuOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-2 rounded-lg transition-all cursor-pointer ${
                    isActive
                      ? 'text-[#ccff00] border-b-2 border-[#ccff00]'
                      : 'text-white/70 hover:text-[#ccff00] hover:bg-white/5'
                  }`}
                >
                  <Icon className={`w-3.5 h-3.5 ${isActive ? 'text-[#ccff00]' : 'text-white/40'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Cart Button */}
          <div className="flex items-center gap-3">
            <button
              onClick={onOpenCart}
              className="relative flex items-center gap-3 bg-[#ccff00] hover:bg-white text-black font-black px-5 py-2.5 uppercase tracking-wider skew-x-[-10deg] transition-all shadow-lg cursor-pointer group"
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <div className="relative">
                  <ShoppingBag className="w-5 h-5 stroke-[2.5]" />
                  {cartCount > 0 && (
                    <span className="absolute -top-2 -right-2 bg-black text-[#ccff00] text-[10px] font-black w-5 h-5 rounded-full flex items-center justify-center border border-[#ccff00]">
                      {cartCount}
                    </span>
                  )}
                </div>
                <div className="hidden sm:block text-left text-xs leading-none">
                  <p className="font-black text-black text-[10px] uppercase tracking-wider">CARRITO</p>
                  <p className="font-black text-black text-xs mt-0.5">{formatPrice(cartTotalUSD, currency)}</p>
                </div>
              </div>
            </button>

            {/* Mobile menu burger */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 text-white/80 hover:text-white bg-white/5 rounded-lg border border-white/20"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>

        {/* Mobile Search bar */}
        <div className="lg:hidden pb-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                if (activeTab !== 'filters' && activeTab !== 'catalog') {
                  setActiveTab('catalog');
                }
              }}
              placeholder="Buscar camisetas, equipos o ligas..."
              className="w-full bg-white/5 border border-white/20 rounded-full py-2 pl-9 pr-9 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#ccff00]"
            />
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-3" />
          </div>
        </div>

      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#121212] border-b border-white/10 px-4 py-4 space-y-2 animate-in slide-in-from-top-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${
                  isActive
                    ? 'bg-[#ccff00] text-black font-black'
                    : 'text-white/80 hover:bg-white/5'
                }`}
              >
                <Icon className={`w-5 h-5 ${isActive ? 'text-black' : 'text-[#ccff00]'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
          <div className="pt-2 border-t border-white/10 flex justify-between items-center text-xs text-white/60 font-bold uppercase">
            <span>Cambiar Moneda:</span>
            <button
              onClick={() => setCurrency(currency === 'CRC' ? 'USD' : 'CRC')}
              className="bg-white/10 text-[#ccff00] px-3 py-1.5 rounded-lg font-black border border-white/20"
            >
              {currency === 'CRC' ? '₡ COLONES (CRC)' : '$ DÓLARES (USD)'}
            </button>
          </div>
          <a
            href="https://www.instagram.com/offside_sports22?igsh=MXZib2J3cjV2bnl1YQ=="
            target="_blank"
            rel="noreferrer"
            className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-pink-600 text-white py-2.5 rounded-lg text-xs font-black uppercase tracking-wider shadow-lg"
          >
            <Instagram className="w-4 h-4" />
            <span>Síguenos en Instagram @offside_sports22</span>
          </a>
          <button
            onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
            className="w-full mt-2 flex items-center justify-center gap-2 bg-white/10 hover:bg-white/20 text-white py-2.5 rounded-lg text-xs font-black uppercase tracking-wider border border-white/20"
          >
            <ShieldCheck className="w-4 h-4 text-[#ccff00]" />
            Acceder al Panel Administrativo
          </button>
        </div>
      )}
    </header>
  );
};

