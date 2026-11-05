import React from 'react';
import { Shirt, ShieldCheck, Truck, RotateCcw, Heart, Instagram, Lock } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
  onOpenOrderHistory?: () => void;
  settings?: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAdmin, onOpenOrderHistory, settings }) => {
  const phoneDisplay = settings?.contactPhone || '+506 8559 5192';
  const isHalloween = settings?.themeMode === 'halloween';
  const isChristmas = settings?.themeMode === 'christmas';
  return (
    <footer className={`${
      isChristmas ? 'bg-transparent border-t border-red-500/25' : 'bg-[#0a0a0a] border-t border-white/10'
    } text-white/70 text-xs transition-colors duration-500`}>
      
      {/* Top Value Badges Bar */}
      <div className={`border-b border-white/10 ${
        isChristmas ? 'bg-gradient-to-r from-[#170306] via-[#26050c] to-[#170306]' : isHalloween ? 'bg-gradient-to-r from-black via-orange-950/20 to-black' : 'bg-[#121212]'
      }`}>
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          
          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isChristmas ? 'bg-red-950/40 text-amber-300 border-red-500/40 shadow-md' : isHalloween ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-[#00e652]/10 text-[#00e652] border-[#00e652]/30'
            }`}>
              <Truck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-black text-white text-xs uppercase tracking-wider">Envíos Rápidos a Todo el País</p>
              <p className="text-[11px] text-white/60 font-semibold">Despachos asegurados en 24h a 48h</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isChristmas ? 'bg-red-950/40 text-amber-300 border-red-500/40 shadow-md' : isHalloween ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-[#00e652]/10 text-[#00e652] border-[#00e652]/30'
            }`}>
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-black text-white text-xs uppercase tracking-wider">Calidad Importada AAAA</p>
              <p className="text-[11px] text-white/60 font-semibold">Bordados y estampados oficiales</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isChristmas ? 'bg-red-950/40 text-amber-300 border-red-500/40 shadow-md' : isHalloween ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-[#00e652]/10 text-[#00e652] border-[#00e652]/30'
            }`}>
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-black text-white text-xs uppercase tracking-wider">Garantía de Satisfacción</p>
              <p className="text-[11px] text-white/60 font-semibold">Cambio inmediato por talla</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className={`p-2.5 rounded-xl border ${
              isChristmas ? 'bg-red-950/40 text-amber-300 border-red-500/40 shadow-md' : isHalloween ? 'bg-orange-500/10 text-orange-400 border-orange-500/30' : 'bg-[#00e652]/10 text-[#00e652] border-[#00e652]/30'
            }`}>
              <Shirt className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-black text-white text-xs uppercase tracking-wider">{isChristmas ? '🎄 Estampados para Regalo' : isHalloween ? '🎃 Estampados Embrujados' : 'Estampado Personalizado'}</p>
              <p className="text-[11px] text-white/60 font-semibold">{isChristmas ? '¡GRATIS para Navidad!' : isHalloween ? '¡GRATIS durante Halloween!' : 'Tu nombre y dorsal preferido'}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Brand info */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 ${
              isChristmas
                ? 'bg-gradient-to-r from-[#991b1b] via-[#dc2626] to-[#991b1b] text-white shadow-[0_0_20px_rgba(220,38,38,0.5)] border border-amber-400/50'
                : isHalloween
                ? 'bg-orange-500 shadow-[0_0_15px_rgba(255,107,0,0.5)]'
                : 'bg-[#00e652] shadow-[0_0_15px_rgba(0,230,82,0.4)]'
            } font-black flex items-center justify-center skew-x-[-10deg]`}>
              <Shirt className="w-5 h-5 stroke-[3] skew-x-[10deg] text-black" />
            </div>
            <div>
              <div className="flex items-center gap-1 text-2xl font-black italic tracking-tighter uppercase leading-none">
                <span className="text-white">OFF</span>
                <span className={isChristmas ? 'text-red-400' : isHalloween ? 'text-orange-500' : 'text-[#00e652]'}>side</span>
                <span className="text-white/80 text-xl font-black ml-1">Sports</span>
                {isChristmas ? <span className="text-sm">🎄</span> : isHalloween ? <span className="text-sm">🎃</span> : null}
              </div>
              <p className={`text-[8px] font-black uppercase tracking-[0.25em] ${isChristmas ? 'text-amber-400' : isHalloween ? 'text-orange-400' : 'text-[#00e652]'} mt-0.5`}>
                {isChristmas ? 'ROPA DEPORTIVA' : isHalloween ? 'TEMPORADA SPOOKY HALLOWEEN 👻' : 'ROPA DEPORTIVA'}
              </p>
            </div>
          </div>

          <p className="text-white/70 text-xs max-w-sm leading-relaxed font-semibold">
            La tienda en línea número 1 especialista en camisetas de fútbol oficiales, versiones jugador, ediciones retro históricas y estampados personalizados con nombres y dorsales de leyenda.
          </p>

          {/* Payment Methods */}
          <div className="pt-2">
            <p className={`text-[10px] font-black uppercase ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'} tracking-widest mb-2`}>MEDIOS DE PAGO ACEPTADOS:</p>
            <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase text-white/90">
              <span className={`bg-black border border-white/20 px-2.5 py-1 rounded-sm ${isHalloween ? 'text-orange-400 border-orange-500/30' : 'text-[#00e652]'}`}>SINPE Móvil ({phoneDisplay})</span>
              <span className="bg-black border border-white/20 px-2.5 py-1 rounded-sm">Visa</span>
              <span className="bg-black border border-white/20 px-2.5 py-1 rounded-sm">Mastercard</span>
              <span className="bg-black border border-white/20 px-2.5 py-1 rounded-sm">PayPal</span>
              <span className="bg-black border border-white/20 px-2.5 py-1 rounded-sm text-amber-400">Contra Entrega CR</span>
            </div>
          </div>
        </div>

        {/* Quick Links */}
        <div className="md:col-span-3 space-y-3">
          <h4 className="font-black italic uppercase text-white text-sm tracking-wider">NAVEGACIÓN RÁPIDA</h4>
          <ul className="space-y-2 text-xs font-bold uppercase tracking-wider">
            <li>
              <button onClick={() => setActiveTab('catalog')} className={`transition cursor-pointer ${isHalloween ? 'hover:text-orange-400' : 'hover:text-[#00e652]'}`}>
                Catálogo de Camisetas
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('balls')} className={`transition cursor-pointer font-black flex items-center gap-1 ${isHalloween ? 'text-orange-400 hover:text-white' : 'text-[#00e652] hover:text-white'}`}>
                {isHalloween ? '🎃 Balones de Terror' : '⚽ Balones a la Venta (Oficiales)'}
              </button>
            </li>
            {onOpenOrderHistory && (
              <li>
                <button onClick={onOpenOrderHistory} className={`hover:underline transition cursor-pointer font-black flex items-center gap-1 ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`}>
                  📦 Historial de Compras / Rastrear Pedido
                </button>
              </li>
            )}
            <li>
              <button onClick={() => setActiveTab('filters')} className={`transition cursor-pointer ${isHalloween ? 'hover:text-orange-400' : 'hover:text-[#00e652]'}`}>
                Buscador por Liga y Equipo
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('reviews')} className={`transition cursor-pointer ${isHalloween ? 'hover:text-orange-400' : 'hover:text-[#00e652]'}`}>
                Reseñas de Clientes Verificados
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('contact')} className={`transition cursor-pointer ${isHalloween ? 'hover:text-orange-400' : 'hover:text-[#00e652]'}`}>
                Atención por WhatsApp
              </button>
            </li>
          </ul>
        </div>

          {/* Social & Admin Access */}
          <div className="md:col-span-4 space-y-4">
            <h4 className="font-black italic uppercase text-white text-sm tracking-wider">COMUNIDAD & REDES SOCIALES</h4>
            <a
              href="https://www.instagram.com/offside_sports22?igsh=MXZib2J3cjV2bnl1YQ=="
              target="_blank"
              rel="noreferrer"
              className="group bg-gradient-to-r from-purple-900/60 via-pink-900/60 to-orange-900/60 hover:from-purple-600 hover:via-pink-600 hover:to-orange-500 border border-pink-500/30 p-4 rounded-2xl transition-all cursor-pointer flex items-center justify-between shadow-xl"
            >
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-gradient-to-tr from-yellow-500 via-pink-500 to-purple-600 text-white rounded-xl shadow-md">
                  <Instagram className="w-5 h-5 stroke-[2.5]" />
                </div>
                <div>
                  <p className="font-black text-white text-xs uppercase tracking-wider group-hover:text-white">SÍGUENOS EN INSTAGRAM</p>
                  <p className="text-[11px] text-pink-300 font-mono font-bold">@offside_sports22</p>
                </div>
              </div>
              <span className="text-[10px] font-black uppercase bg-white text-black px-2.5 py-1 rounded-lg group-hover:bg-[#00e652]">
                VER PERFIL
              </span>
            </a>

            <div className="pt-2">
              <p className="text-[11px] text-white/50 font-semibold mb-2">Acceso a gestión privada de inventario y pedidos:</p>
              <button
                onClick={onOpenAdmin}
                className={`${
                  isChristmas
                    ? 'bg-gradient-to-r from-[#991b1b] via-[#dc2626] to-[#991b1b] hover:from-[#b91c1c] hover:via-[#ef4444] hover:to-[#b91c1c] text-white border border-amber-400/40 shadow-lg shadow-red-700/40'
                    : 'bg-white/5 hover:bg-[#00e652] text-white hover:text-black border border-white/20 hover:border-[#00e652]'
                } px-4 py-2.5 text-xs font-black uppercase tracking-widest skew-x-[-10deg] transition-all cursor-pointer flex items-center gap-2`}
              >
                <div className="skew-x-[10deg] flex items-center gap-2">
                  <Lock className="w-4 h-4 stroke-[2.5]" />
                  <span>{isChristmas ? 'ACCESO PROPIETARIO 🎄' : 'ACCESO PROPIETARIO'}</span>
                </div>
              </button>
            </div>
          </div>

      </div>

      {/* Copyright Sub-footer */}
      <div className={`border-t border-white/10 ${isChristmas ? 'bg-[#030b07]/90 text-amber-200/60' : 'bg-black text-white/40'} py-4 text-center text-[11px] font-bold uppercase tracking-wider`}>
        <p className="flex items-center justify-center gap-1 flex-wrap">
          <span>© {new Date().getFullYear()} OFFSIDE sports. Todos los derechos reservados. Hecho con</span>
          <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500 inline mx-0.5" />
          <span>para fanáticos del fútbol.</span>
          {isChristmas && <span className="text-amber-300 font-black">· 🎄 ¡Feliz Navidad y Próspero Año Nuevo! 🎁</span>}
        </p>
      </div>

    </footer>
  );
};

