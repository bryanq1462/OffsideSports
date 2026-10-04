import React, { useState } from 'react';
import { ShoppingBag, Star, Eye, ShieldCheck, Flame, Sparkles, Check } from 'lucide-react';
import { Ball } from '../types';
import { formatPrice } from '../utils/storage';
import { handleBallImageError, DEFAULT_BALL_FALLBACK_IMAGE } from '../utils/imageUtils';

interface BallCardProps {
  ball: Ball;
  currency: 'CRC' | 'USD';
  onQuickAdd: (ball: Ball, size: string) => void;
  onOpenDetail: (ball: Ball) => void;
  isHalloween?: boolean;
}

export const BallCard: React.FC<BallCardProps> = ({
  ball,
  currency,
  onQuickAdd,
  onOpenDetail,
  isHalloween
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    ball.sizesAvailable?.[0] || 'Talla 5 (Oficial)'
  );
  const [justAdded, setJustAdded] = useState(false);

  const priceCRC = ball.priceCRC ?? ball.price;
  const originalPriceCRC = ball.originalPriceCRC ?? ball.originalPrice;
  const hasDiscount = originalPriceCRC && originalPriceCRC > priceCRC;

  const handleAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    onQuickAdd(ball, selectedSize);
    setJustAdded(true);
    setTimeout(() => setJustAdded(false), 1500);
  };

  return (
    <div 
      onClick={() => onOpenDetail(ball)}
      className={`group relative bg-[#111111] rounded-2xl sm:rounded-3xl border transition-all duration-300 flex flex-col justify-between overflow-hidden shadow-lg cursor-pointer ${
        isHalloween
          ? 'border-orange-500/20 hover:border-orange-500/80 hover:shadow-[0_0_25px_rgba(255,107,0,0.25)]'
          : 'border-white/10 hover:border-[#00e652]/60 hover:shadow-[0_0_25px_rgba(0,230,82,0.15)]'
      }`}
    >
      {/* Top Badges */}
      <div className="absolute top-2.5 left-2.5 sm:top-3.5 sm:left-3.5 z-10 flex flex-col gap-1.5 items-start">
        {ball.isNew && (
          <span className={`${isHalloween ? 'bg-orange-500' : 'bg-[#00e652]'} text-black text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1`}>
            <Sparkles className="w-2.5 h-2.5" /> {isHalloween ? '🎃 NUEVO' : 'NUEVO'}
          </span>
        )}
        {ball.isPopular && (
          <span className="bg-amber-500 text-black text-[9px] sm:text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md shadow-md flex items-center gap-1">
            <Flame className="w-2.5 h-2.5" /> TOP VENTAS
          </span>
        )}
        {ball.category && (
          <span className="bg-black/80 backdrop-blur-md text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md border border-white/20">
            {ball.category}
          </span>
        )}
      </div>

      {/* Stock warning */}
      {ball.stock <= 5 && ball.stock > 0 && (
        <div className="absolute top-2.5 right-2.5 sm:top-3.5 sm:right-3.5 z-10">
          <span className="bg-rose-500/90 text-white text-[8px] sm:text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-md">
            Solo {ball.stock} disp.
          </span>
        </div>
      )}

      {/* Ball Image Stage */}
      <div className="relative aspect-square w-full bg-gradient-to-b from-[#18181b] to-[#0c0c0e] flex items-center justify-center p-4 sm:p-6 overflow-hidden">
        {/* Glow backdrop effect */}
        <div className={`absolute w-36 h-36 rounded-full blur-2xl transition-all duration-500 ${
          isHalloween
            ? 'bg-orange-600/15 group-hover:bg-orange-600/25'
            : 'bg-[#00e652]/10 group-hover:bg-[#00e652]/20'
        }`} />
        
        <img
          src={ball.image || DEFAULT_BALL_FALLBACK_IMAGE}
          alt={ball.name}
          referrerPolicy="no-referrer"
          onError={handleBallImageError}
          className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_15px_15px_rgba(0,0,0,0.7)] group-hover:scale-108 group-hover:rotate-6 transition-transform duration-500"
        />

        {/* Quick View Button on Hover */}
        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center z-20">
          <span className="bg-[#00e652] text-black font-black text-xs uppercase px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-xl scale-95 group-hover:scale-100 transition-transform">
            <Eye className="w-3.5 h-3.5 stroke-[2.5]" /> Ver Detalles
          </span>
        </div>
      </div>

      {/* Content Info */}
      <div className="p-3.5 sm:p-5 flex-1 flex flex-col justify-between space-y-3 bg-[#111111]">
        <div className="space-y-1.5">
          {/* Brand & Tournament */}
          <div className="flex items-center justify-between gap-1 text-[10px] sm:text-xs">
            <span className="font-black text-[#00e652] uppercase tracking-wider">
              {ball.brand}
            </span>
            {ball.tournament && (
              <span className="text-white/50 text-[10px] font-semibold truncate max-w-[120px]">
                {ball.tournament}
              </span>
            )}
          </div>

          {/* Name */}
          <h3 className="text-xs sm:text-sm font-black text-white group-hover:text-[#00e652] transition-colors line-clamp-2 uppercase leading-tight tracking-wide">
            {ball.name}
          </h3>

          {/* Rating */}
          <div className="flex items-center gap-1 text-[10px] text-amber-400 font-bold">
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < Math.floor(ball.rating)
                      ? 'fill-amber-400 text-amber-400'
                      : 'text-zinc-600'
                  }`}
                />
              ))}
            </div>
            <span className="text-white/60">({ball.reviewsCount})</span>
          </div>
        </div>

        {/* Sizes & Pricing Controls */}
        <div className="space-y-2.5 pt-2 border-t border-white/5">
          {/* Size Selector Pills */}
          <div className="flex items-center gap-1.5 flex-wrap" onClick={(e) => e.stopPropagation()}>
            <span className="text-[10px] font-black text-white/40 uppercase mr-0.5">Talla:</span>
            {ball.sizesAvailable.map((sz) => {
              const isSelected = selectedSize === sz;
              // Clean label for display (e.g. "Talla 5" -> "5", "Fútbol Sala" -> "Futsal")
              const short = sz.includes('5') ? 'Talla 5' : sz.includes('4') ? 'Talla 4' : sz.includes('3') ? 'Talla 3' : sz.includes('Futsal') ? 'Futsal' : 'Mini';
              return (
                <button
                  key={sz}
                  type="button"
                  onClick={() => setSelectedSize(sz)}
                  className={`px-2 py-0.5 rounded text-[10px] font-black uppercase transition-all cursor-pointer ${
                    isSelected
                      ? isHalloween
                        ? 'bg-orange-500 text-black shadow-sm'
                        : 'bg-[#00e652] text-black shadow-sm'
                      : 'bg-white/5 text-white/70 hover:bg-white/10 hover:text-white border border-white/10'
                  }`}
                >
                  {short}
                </button>
              );
            })}
          </div>

          {/* Price & Add to Cart button */}
          <div className="flex items-center justify-between gap-2 pt-1">
            <div>
              <div className="flex items-baseline gap-1.5">
                <span className={`text-sm sm:text-base font-black ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`}>
                  {formatPrice(priceCRC, currency)}
                </span>
                {hasDiscount && (
                  <span className="text-[10px] sm:text-xs text-white/40 line-through">
                    {formatPrice(originalPriceCRC, currency)}
                  </span>
                )}
              </div>
              <span className="text-[9px] text-white/40 font-semibold block uppercase">
                {currency === 'CRC' ? 'Colones CR' : 'Dólares USD'}
              </span>
            </div>

            <button
              type="button"
              onClick={handleAdd}
              disabled={ball.stock <= 0}
              className={`p-2 sm:px-3 sm:py-2 rounded-xl font-black text-xs uppercase tracking-wider flex items-center gap-1.5 transition-all cursor-pointer ${
                justAdded
                  ? 'bg-white text-black scale-95'
                  : ball.stock <= 0
                  ? 'bg-zinc-800 text-white/40 cursor-not-allowed'
                  : isHalloween
                  ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-md hover:scale-105 shadow-orange-500/30'
                  : 'bg-[#00e652] hover:bg-white text-black shadow-md hover:scale-105'
              }`}
              title="Agregar al carrito"
            >
              {justAdded ? (
                <>
                  <Check className="w-3.5 h-3.5 stroke-[3]" />
                  <span className="hidden sm:inline">¡Listo!</span>
                </>
              ) : (
                <>
                  <ShoppingBag className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span className="hidden sm:inline">Agregar</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
