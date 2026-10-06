import React, { useState } from 'react';
import { 
  X, 
  ShoppingBag, 
  MessageCircle, 
  Star, 
  ShieldCheck, 
  Check, 
  Truck, 
  RotateCcw, 
  Sparkles,
  Award,
  Layers,
  Wind
} from 'lucide-react';
import { Ball, StoreSettings } from '../types';
import { formatPrice } from '../utils/storage';
import { handleBallImageError, DEFAULT_BALL_FALLBACK_IMAGE } from '../utils/imageUtils';

interface BallDetailModalProps {
  ball: Ball;
  currency: 'CRC' | 'USD';
  settings?: StoreSettings;
  onClose: () => void;
  onAddToCart: (ball: Ball, size: string, quantity: number) => void;
  onBuyWhatsApp?: (ball: Ball, size: string, quantity: number) => void;
}

export const BallDetailModal: React.FC<BallDetailModalProps> = ({
  ball,
  currency,
  settings,
  onClose,
  onAddToCart,
  onBuyWhatsApp
}) => {
  const [selectedSize, setSelectedSize] = useState<string>(
    ball.sizesAvailable?.[0] || 'Talla 5 (Oficial)'
  );
  const [quantity, setQuantity] = useState<number>(1);
  const [addedSuccess, setAddedSuccess] = useState<boolean>(false);

  const priceCRC = ball.priceCRC ?? ball.price;
  const originalPriceCRC = ball.originalPriceCRC ?? ball.originalPrice;
  const hasDiscount = originalPriceCRC && originalPriceCRC > priceCRC;
  const isHalloween = settings?.themeMode === 'halloween';

  const phoneDisplay = settings?.contactPhone || '+506 8559 5192';

  const handleAddToCartClick = () => {
    onAddToCart(ball, selectedSize, quantity);
    setAddedSuccess(true);
    setTimeout(() => {
      setAddedSuccess(false);
    }, 2000);
  };

  const handleWhatsAppClick = () => {
    if (onBuyWhatsApp) {
      onBuyWhatsApp(ball, selectedSize, quantity);
    } else {
      const cleanPhone = phoneDisplay.replace(/[^0-9]/g, '');
      const text = `¡Hola OFFSIDE Sports! ⚽ Quisiera pedir el siguiente balón:\n\n*${ball.name}*\nMarca: *${ball.brand}*\nTalla: *${selectedSize}*\nCantidad: *${quantity}*\nPrecio unitario: *${formatPrice(priceCRC, currency)}*\n\n¿Tienen disponible para entrega o envío en Costa Rica?`;
      window.open(`https://wa.me/${cleanPhone || '50685595192'}?text=${encodeURIComponent(text)}`, '_blank');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="fixed inset-0" onClick={onClose} />

      <div className="relative w-full max-w-4xl bg-[#0d0d0f] border border-white/15 rounded-3xl text-white overflow-hidden shadow-2xl z-10 max-h-[92vh] flex flex-col">
        {/* Header Bar */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-white/10 bg-black/60">
          <div className="flex items-center gap-2">
            <span className="bg-[#00e652] text-black font-black text-[10px] uppercase px-2 py-0.5 rounded tracking-wider">
              BALÓN OFICIAL
            </span>
            <span className="text-xs text-white/60 font-black uppercase tracking-wider">
              {ball.brand} {ball.tournament ? `• ${ball.tournament}` : ''}
            </span>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/70 hover:text-white transition cursor-pointer"
            title="Cerrar ventana"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-8 grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
          
          {/* Ball Image Column */}
          <div className="space-y-4">
            <div className="relative aspect-square w-full rounded-2xl bg-gradient-to-b from-[#18181b] to-[#0c0c0e] border border-white/10 p-8 flex items-center justify-center overflow-hidden shadow-inner group">
              <div className="absolute w-56 h-56 bg-[#00e652]/10 rounded-full blur-3xl" />
              
              <img
                src={ball.image || DEFAULT_BALL_FALLBACK_IMAGE}
                alt={ball.name}
                referrerPolicy="no-referrer"
                onError={handleBallImageError}
                className="relative z-10 w-full h-full object-contain filter drop-shadow-[0_20px_25px_rgba(0,0,0,0.8)] transition-transform duration-500 group-hover:scale-108"
              />

              {ball.category && (
                <div className="absolute top-4 left-4 z-20">
                  <span className="bg-black/80 backdrop-blur-md border border-white/20 text-[#00e652] text-[10px] font-black uppercase px-2.5 py-1 rounded-lg tracking-wider">
                    {ball.category}
                  </span>
                </div>
              )}
            </div>

            {/* Badges / Guarantees Banner */}
            <div className="grid grid-cols-3 gap-2">
              <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-center space-y-1">
                <ShieldCheck className="w-4 h-4 text-[#00e652] mx-auto" />
                <span className="text-[10px] font-black uppercase block text-white/90">Garantía</span>
                <span className="text-[8px] text-white/50 block">Calidad Pro</span>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-center space-y-1">
                <Truck className="w-4 h-4 text-[#00e652] mx-auto" />
                <span className="text-[10px] font-black uppercase block text-white/90">Costa Rica</span>
                <span className="text-[8px] text-white/50 block">Envíos rápidos</span>
              </div>
              <div className="p-2.5 bg-white/5 border border-white/10 rounded-xl text-center space-y-1">
                <Award className="w-4 h-4 text-[#00e652] mx-auto" />
                <span className="text-[10px] font-black uppercase block text-white/90">FIFA Spec</span>
                <span className="text-[8px] text-white/50 block">Termosellado</span>
              </div>
            </div>
          </div>

          {/* Details & Purchase Column */}
          <div className="space-y-6">
            
            {/* Title & Brand */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-black uppercase tracking-wider text-[#00e652]">
                  {ball.brand}
                </span>
                {ball.category && (
                  <span className="text-white/40 text-xs">• {ball.category}</span>
                )}
              </div>
              <h1 className="text-xl sm:text-2xl font-black uppercase text-white leading-tight">
                {ball.name}
              </h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <Star
                      key={i}
                      className={`w-4 h-4 ${
                        i < Math.floor(ball.rating)
                          ? 'fill-amber-400 text-amber-400'
                          : 'text-zinc-600'
                      }`}
                    />
                  ))}
                </div>
                <span className="text-xs font-bold text-white/70">
                  {ball.rating.toFixed(1)} ({ball.reviewsCount} reseñas verificadas)
                </span>
              </div>
            </div>

            {/* Pricing Box */}
            <div className="p-4 bg-white/5 border border-white/10 rounded-2xl flex items-baseline justify-between">
              <div>
                <span className="text-[10px] font-black uppercase text-white/50 block">Precio OFFSIDE</span>
                <div className="flex items-baseline gap-2 mt-0.5">
                  <span className={`text-2xl sm:text-3xl font-black ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`}>
                    {formatPrice(priceCRC, currency)}
                  </span>
                  {hasDiscount && (
                    <span className="text-sm text-white/40 line-through font-bold">
                      {formatPrice(originalPriceCRC, currency)}
                    </span>
                  )}
                </div>
              </div>

              {hasDiscount && (
                <span className={`${isHalloween ? 'bg-orange-500 shadow-orange-500/30' : 'bg-[#00e652]'} text-black font-black text-xs uppercase px-2.5 py-1 rounded-md shadow-sm`}>
                  {ball.discountPercent || 15}% OFF
                </span>
              )}
            </div>

            {/* Sizes Selection */}
            <div className="space-y-2">
              <label className="text-xs font-black uppercase tracking-wider text-white flex justify-between">
                <span>Selecciona la Talla del Balón:</span>
                <span className={`${isHalloween ? 'text-orange-400' : 'text-[#00e652]'} font-mono`}>{selectedSize}</span>
              </label>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {ball.sizesAvailable.map((sz) => {
                  const isSelected = selectedSize === sz;
                  return (
                    <button
                      key={sz}
                      type="button"
                      onClick={() => setSelectedSize(sz)}
                      className={`p-3 rounded-xl border text-xs font-black uppercase transition-all flex flex-col items-center justify-center gap-0.5 cursor-pointer ${
                        isSelected
                          ? isHalloween
                            ? 'bg-orange-500 border-orange-500 text-black shadow-md scale-102'
                            : 'bg-[#00e652] border-[#00e652] text-black shadow-md scale-102'
                          : isHalloween
                          ? 'bg-black border-white/15 text-white hover:border-orange-500/60 hover:bg-white/5'
                          : 'bg-black border-white/15 text-white hover:border-[#00e652]/60 hover:bg-white/5'
                      }`}
                    >
                      <span>{sz}</span>
                      <span className={`text-[9px] ${isSelected ? 'text-black/70' : 'text-white/40'}`}>
                        {sz.includes('5') ? 'Fútbol 11 Profesional' : sz.includes('4') ? 'Juvenil / Infantil' : sz.includes('Futsal') ? 'Bote Bajo' : 'Disponible'}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Quantity */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-black uppercase tracking-wider text-white">Cantidad:</span>
              <div className="flex items-center bg-black border border-white/20 rounded-xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className={`px-3 py-1.5 text-white/70 ${isHalloween ? 'hover:text-orange-400' : 'hover:text-[#00e652]'} font-black text-sm cursor-pointer`}
                >
                  -
                </button>
                <span className={`px-3 text-sm font-black ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`}>{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(ball.stock || 20, quantity + 1))}
                  className={`px-3 py-1.5 text-white/70 ${isHalloween ? 'hover:text-orange-400' : 'hover:text-[#00e652]'} font-black text-sm cursor-pointer`}
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-white/40">
                ({ball.stock} unidades en bodega)
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCartClick}
                disabled={ball.stock <= 0}
                className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                  addedSuccess
                    ? 'bg-white text-black'
                    : isHalloween
                    ? 'bg-orange-500 hover:bg-orange-400 text-black shadow-orange-500/30 hover:scale-[1.01]'
                    : 'bg-[#00e652] hover:bg-white text-black hover:scale-[1.01]'
                }`}
              >
                {addedSuccess ? (
                  <>
                    <Check className="w-4 h-4 stroke-[3]" />
                    <span>¡AGREGADO AL CARRITO!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                    <span>AGREGAR AL CARRITO ({formatPrice(priceCRC * quantity, currency)})</span>
                  </>
                )}
              </button>

              <button
                type="button"
                onClick={handleWhatsAppClick}
                className={`w-full py-3.5 rounded-2xl bg-black border ${
                  isHalloween
                    ? 'border-orange-500/60 hover:bg-orange-500/10 text-orange-400'
                    : 'border-[#00e652]/60 hover:bg-[#00e652]/10 text-[#00e652]'
                } font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 transition-all cursor-pointer`}
              >
                <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                <span>PEDIR DIRECTO POR WHATSAPP</span>
              </button>
            </div>

            {/* Description & Technical Specs */}
            <div className="space-y-3 pt-4 border-t border-white/10 text-xs">
              <h4 className="font-black uppercase tracking-wider text-white flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-[#00e652]" />
                Detalles Técnicos & Materiales:
              </h4>
              <p className="text-white/70 leading-relaxed font-medium">
                {ball.description}
              </p>
              {ball.material && (
                <div className="p-3 bg-black/60 border border-white/10 rounded-xl space-y-1">
                  <span className="text-[10px] font-black uppercase text-[#00e652] block">
                    Especificación de Construcción:
                  </span>
                  <p className="text-[11px] text-white/80 font-mono">
                    {ball.material}
                  </p>
                </div>
              )}
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
