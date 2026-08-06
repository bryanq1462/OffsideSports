import React from 'react';
import { Shirt, ShieldCheck, Truck, RotateCcw, Heart } from 'lucide-react';
import { StoreSettings } from '../types';

interface FooterProps {
  setActiveTab: (tab: string) => void;
  onOpenAdmin: () => void;
  settings?: StoreSettings;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab, onOpenAdmin, settings }) => {
  const phoneDisplay = settings?.contactPhone || '+506 8559 5192';
  return (
    <footer className="bg-[#0a0a0a] text-white/70 border-t border-white/10 text-xs">
      
      {/* Top Value Badges Bar */}
      <div className="border-b border-white/10 bg-[#121212]">
        <div className="max-w-7xl mx-auto px-4 py-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 text-center sm:text-left">
          
          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
              <Truck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-black text-white text-xs uppercase tracking-wider">Envíos Rápidos a Todo el País</p>
              <p className="text-[11px] text-white/60 font-semibold">Despachos asegurados en 24h a 48h</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
              <ShieldCheck className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-black text-white text-xs uppercase tracking-wider">Calidad Importada AAAA</p>
              <p className="text-[11px] text-white/60 font-semibold">Bordados y estampados oficiales</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
              <RotateCcw className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-black text-white text-xs uppercase tracking-wider">Garantía de Satisfacción</p>
              <p className="text-[11px] text-white/60 font-semibold">Cambio inmediato por talla</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-[#ccff00]/10 text-[#ccff00] border border-[#ccff00]/30">
              <Shirt className="w-5 h-5 stroke-[2.5]" />
            </div>
            <div>
              <p className="font-black text-white text-xs uppercase tracking-wider">Estampado Personalizado</p>
              <p className="text-[11px] text-white/60 font-semibold">Tu nombre y dorsal preferido</p>
            </div>
          </div>

        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-12 gap-8">
        
        {/* Brand info */}
        <div className="md:col-span-5 space-y-4">
          <div className="flex items-center gap-2">
            <div className="w-9 h-9 bg-[#ccff00] text-black font-black flex items-center justify-center skew-x-[-10deg]">
              <Shirt className="w-5 h-5 stroke-[3] skew-x-[10deg]" />
            </div>
            <div className="flex items-center gap-1 text-2xl font-black italic tracking-tighter uppercase">
              <span className="text-white">OFFSIDE</span>
              <span className="text-[#ccff00]">sports</span>
            </div>
          </div>

          <p className="text-white/70 text-xs max-w-sm leading-relaxed font-semibold">
            La tienda en línea número 1 especialista en camisetas de fútbol oficiales, versiones jugador, ediciones retro históricas y estampados personalizados con nombres y dorsales de leyenda.
          </p>

          {/* Payment Methods */}
          <div className="pt-2">
            <p className="text-[10px] font-black uppercase text-[#ccff00] tracking-widest mb-2">MEDIOS DE PAGO ACEPTADOS:</p>
            <div className="flex flex-wrap gap-2 text-[10px] font-black uppercase text-white/90">
              <span className="bg-black border border-white/20 px-2.5 py-1 rounded-sm text-[#ccff00]">SINPE Móvil ({phoneDisplay})</span>
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
              <button onClick={() => setActiveTab('catalog')} className="hover:text-[#ccff00] transition cursor-pointer">
                Catálogo de Camisetas
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('filters')} className="hover:text-[#ccff00] transition cursor-pointer">
                Buscador por Liga y Equipo
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('reviews')} className="hover:text-[#ccff00] transition cursor-pointer">
                Reseñas de Clientes Verificados
              </button>
            </li>
            <li>
              <button onClick={() => setActiveTab('contact')} className="hover:text-[#ccff00] transition cursor-pointer">
                Atención por WhatsApp
              </button>
            </li>
          </ul>
        </div>

        {/* Admin Access & Legal */}
        <div className="md:col-span-4 space-y-3">
          <h4 className="font-black italic uppercase text-white text-sm tracking-wider">PANEL ADMINISTRATIVO</h4>
          <p className="text-xs text-white/70 font-semibold">Accede al panel privado para añadir nuevas camisetas al catálogo o actualizar el estado de los despachos.</p>
          <button
            onClick={onOpenAdmin}
            className="bg-white/5 hover:bg-[#ccff00] text-white hover:text-black border border-white/20 hover:border-[#ccff00] px-5 py-3 text-xs font-black uppercase tracking-widest skew-x-[-10deg] transition-all cursor-pointer flex items-center gap-2"
          >
            <div className="skew-x-[10deg] flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
              <span>PANEL DE ADMINISTRACIÓN</span>
            </div>
          </button>
        </div>

      </div>

      {/* Copyright Sub-footer */}
      <div className="border-t border-white/10 bg-black py-4 text-center text-[11px] text-white/40 font-bold uppercase tracking-wider">
        <p className="flex items-center justify-center gap-1">
          © {new Date().getFullYear()} OFFSIDE sports. Todos los derechos reservados. Hecho con <Heart className="w-3.5 h-3.5 text-rose-500 fill-rose-500" /> para fanáticos del fútbol.
        </p>
      </div>

    </footer>
  );
};

