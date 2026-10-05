import React, { useState, useMemo } from 'react';
import { 
  Search, 
  Sparkles, 
  Flame, 
  Trophy, 
  ShieldCheck, 
  Truck, 
  SlidersHorizontal, 
  Plus, 
  MessageCircle,
  RotateCcw
} from 'lucide-react';
import { Ball, StoreSettings } from '../types';
import { BallCard } from './BallCard';
import { BALL_BRANDS, BALL_CATEGORIES_LIST, BALL_SIZES_CATALOG } from '../data/mockBalls';

interface BallsSectionProps {
  balls: Ball[];
  currency: 'CRC' | 'USD';
  settings?: StoreSettings;
  onQuickAdd: (ball: Ball, size: string) => void;
  onOpenDetail: (ball: Ball) => void;
  onOpenAdminToBalls?: () => void;
}

export const BallsSection: React.FC<BallsSectionProps> = ({
  balls,
  currency,
  settings,
  onQuickAdd,
  onOpenDetail,
  onOpenAdminToBalls
}) => {
  const isHalloween = settings?.themeMode === 'halloween';
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBrand, setSelectedBrand] = useState('all');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSize, setSelectedSize] = useState('all');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');

  const filteredBalls = useMemo(() => {
    return balls.filter((b) => {
      // 1. Text Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchesName = b.name.toLowerCase().includes(q);
        const matchesBrand = b.brand.toLowerCase().includes(q);
        const matchesTournament = (b.tournament || '').toLowerCase().includes(q);
        const matchesCategory = (b.category || '').toLowerCase().includes(q);
        const matchesDesc = (b.description || '').toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesTournament && !matchesCategory && !matchesDesc) {
          return false;
        }
      }

      // 2. Brand
      if (selectedBrand !== 'all' && b.brand !== selectedBrand) {
        return false;
      }

      // 3. Category
      if (selectedCategory !== 'all' && b.category !== selectedCategory) {
        return false;
      }

      // 4. Size
      if (selectedSize !== 'all' && !b.sizesAvailable.includes(selectedSize)) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      const priceA = a.priceCRC ?? a.price;
      const priceB = b.priceCRC ?? b.price;
      if (sortBy === 'price-asc') return priceA - priceB;
      if (sortBy === 'price-desc') return priceB - priceA;
      if (sortBy === 'rating') return b.rating - a.rating;
      // 'recommended'
      return (b.isPopular ? 1 : 0) - (a.isPopular ? 1 : 0) || b.rating - a.rating;
    });
  }, [balls, searchQuery, selectedBrand, selectedCategory, selectedSize, sortBy]);

  const phoneDisplay = settings?.contactPhone || '+506 8559 5192';

  const resetFilters = () => {
    setSearchQuery('');
    setSelectedBrand('all');
    setSelectedCategory('all');
    setSelectedSize('all');
    setSortBy('recommended');
  };

  const hasActiveFilters = searchQuery !== '' || selectedBrand !== 'all' || selectedCategory !== 'all' || selectedSize !== 'all' || sortBy !== 'recommended';

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      
      {/* Hero Banner for Balls Section */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-zinc-950 via-[#0a1a0f] to-zinc-950 border border-white/15 p-6 sm:p-10 shadow-2xl">
        {/* Glow decoration */}
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#00e652]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 bg-[#00e652]/10 border border-[#00e652]/40 text-[#00e652] px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest">
            <Trophy className="w-3.5 h-3.5" />
            <span>BALONES OFICIALES & COMPETICIÓN</span>
          </div>

          <h1 className="text-2xl sm:text-4xl lg:text-5xl font-black italic tracking-tighter uppercase text-white leading-none">
            PASIÓN EN CADA <span className="text-[#00e652]">DISPARO</span>
          </h1>

          <p className="text-xs sm:text-sm text-white/70 leading-relaxed font-medium">
            Los balones de partido oficiales de las ligas y torneos más prestigiosos: UEFA Champions League, Eurocopa, Premier League, LaLiga, Mundial y fútbol sala. Tecnología de termosellado térmico sin costuras y certificación de rebote oficial.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2 text-xs font-black uppercase tracking-wider">
            <span className="flex items-center gap-1.5 text-white/90 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <ShieldCheck className="w-4 h-4 text-[#00e652]" /> Termosellado Pro
            </span>
            <span className="flex items-center gap-1.5 text-white/90 bg-white/5 border border-white/10 px-3 py-1.5 rounded-xl">
              <Truck className="w-4 h-4 text-[#00e652]" /> Envíos a todo Costa Rica
            </span>
            {onOpenAdminToBalls && (
              <button
                type="button"
                onClick={onOpenAdminToBalls}
                className="flex items-center gap-1.5 bg-[#00e652] hover:bg-white text-black font-black px-3.5 py-1.5 rounded-xl shadow-lg transition-all cursor-pointer hover:scale-105"
              >
                <Plus className="w-4 h-4 stroke-[3]" />
                <span>Poner Balón a la Venta</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-[#111111] border border-white/10 rounded-2xl p-4 sm:p-5 space-y-4 shadow-lg">
        
        {/* Top Search & Results Counter */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar por nombre, torneo (Champions, Eurocopa, Premier...), marca..."
              className="w-full bg-black border border-white/20 rounded-xl py-2 pl-10 pr-10 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#00e652] transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-2.5 text-white/40 hover:text-white text-xs font-black"
              >
                ✕
              </button>
            )}
          </div>

          <div className="flex items-center justify-between sm:justify-end gap-2 text-xs">
            <span className="text-white/60 font-black uppercase text-[11px]">
              {filteredBalls.length} {filteredBalls.length === 1 ? 'balón disponible' : 'balones disponibles'}
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={resetFilters}
                className="flex items-center gap-1 text-[#00e652] hover:text-white font-black uppercase text-[10px] bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg transition cursor-pointer"
              >
                <RotateCcw className="w-3 h-3" /> Limpiar
              </button>
            )}
          </div>
        </div>

        {/* Filter Pills */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2 border-t border-white/5 text-xs">
          
          {/* Brand select */}
          <div>
            <label className="text-[10px] font-black uppercase text-white/50 block mb-1">
              Marca:
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#00e652] cursor-pointer"
            >
              <option value="all">Todas las marcas</option>
              {BALL_BRANDS.map(brand => (
                <option key={brand} value={brand}>{brand}</option>
              ))}
            </select>
          </div>

          {/* Category select */}
          <div>
            <label className="text-[10px] font-black uppercase text-white/50 block mb-1">
              Tipo / Categoría:
            </label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#00e652] cursor-pointer"
            >
              <option value="all">Todas las categorías</option>
              {BALL_CATEGORIES_LIST.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          {/* Size select */}
          <div>
            <label className="text-[10px] font-black uppercase text-white/50 block mb-1">
              Talla de Balón:
            </label>
            <select
              value={selectedSize}
              onChange={(e) => setSelectedSize(e.target.value)}
              className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#00e652] cursor-pointer"
            >
              <option value="all">Todas las tallas</option>
              {BALL_SIZES_CATALOG.map(sz => (
                <option key={sz} value={sz}>{sz}</option>
              ))}
            </select>
          </div>

          {/* Sort By */}
          <div>
            <label className="text-[10px] font-black uppercase text-white/50 block mb-1">
              Ordenar por:
            </label>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="w-full bg-black border border-white/15 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#00e652] cursor-pointer"
            >
              <option value="recommended">Recomendados / Populares</option>
              <option value="price-asc">Menor Precio</option>
              <option value="price-desc">Mayor Precio</option>
              <option value="rating">Mejor Calificados</option>
            </select>
          </div>

        </div>

      </div>

      {/* Balls Grid */}
      {filteredBalls.length === 0 ? (
        <div className="bg-[#111111] border border-white/10 rounded-3xl p-12 text-center space-y-4 max-w-xl mx-auto my-8">
          <div className="w-16 h-16 rounded-full bg-black border border-white/10 flex items-center justify-center text-3xl mx-auto">
            ⚽
          </div>
          <h3 className="text-lg font-black uppercase text-white">No hay balones con estos filtros</h3>
          <p className="text-xs text-white/50">
            Intenta cambiar la marca, la categoría o restablece los filtros para ver todos los balones disponibles.
          </p>
          <button
            type="button"
            onClick={resetFilters}
            className="bg-[#00e652] hover:bg-white text-black font-black px-6 py-2.5 rounded-xl text-xs uppercase cursor-pointer"
          >
            Ver Todos los Balones
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {filteredBalls.map((ball) => (
            <BallCard
              key={ball.id}
              ball={ball}
              currency={currency}
              onQuickAdd={onQuickAdd}
              onOpenDetail={onOpenDetail}
              isHalloween={isHalloween}
            />
          ))}
        </div>
      )}

      {/* Wholesale & Custom Orders CTA */}
      <div className={`p-6 sm:p-8 rounded-3xl border flex flex-col sm:flex-row items-center justify-between gap-4 transition-all ${
        isHalloween
          ? 'bg-gradient-to-r from-orange-950/40 via-black to-purple-950/40 border-orange-500/40 shadow-[0_0_25px_rgba(255,107,0,0.15)]'
          : 'bg-gradient-to-r from-emerald-950/40 via-black to-emerald-950/40 border-[#00e652]/30'
      }`}>
        <div className="space-y-1 text-center sm:text-left">
          <span className={`text-[10px] font-black uppercase tracking-widest ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`}>
            {isHalloween ? '🎃 PRECIOS DE TERROR POR MAYOR & EQUIPOS' : 'PRECIOS POR MAYOR & EQUIPOS'}
          </span>
          <h3 className="text-lg sm:text-xl font-black uppercase text-white">
            ¿Ocupas balones para tu equipo, academia o torneo?
          </h3>
          <p className="text-xs text-white/60">
            Tenemos paquetes especiales a partir de 3, 5 y 10 balones con descuento exclusivo para Costa Rica.
          </p>
        </div>

        <a
          href={`https://wa.me/${phoneDisplay.replace(/[^0-9]/g, '') || '50685595192'}?text=${encodeURIComponent('¡Hola OFFSIDE Sports! ⚽ Quisiera cotizar balones por mayor para mi equipo o torneo.')}`}
          target="_blank"
          rel="noreferrer"
          className={`flex-shrink-0 font-black text-xs uppercase tracking-wider px-5 py-3 rounded-2xl flex items-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer ${
            isHalloween
              ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-orange-500/30'
              : 'bg-[#00e652] hover:bg-white text-black'
          }`}
        >
          <MessageCircle className="w-4 h-4 stroke-[2.5]" />
          <span>Cotizar por WhatsApp</span>
        </a>
      </div>

    </div>
  );
};
