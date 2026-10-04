import React, { useState } from 'react';
import { 
  X, 
  Trash2, 
  ShoppingBag, 
  ArrowRight, 
  Tag, 
  Truck, 
  Check, 
  MessageCircle 
} from 'lucide-react';
import { CartItem, StoreSettings, DiscountCode } from '../types';
import { formatPrice } from '../utils/storage';
import { handleImageError, DEFAULT_JERSEY_FALLBACK_IMAGE, handleBallImageError, DEFAULT_BALL_FALLBACK_IMAGE } from '../utils/imageUtils';
import { getJerseyVersionInfo } from '../utils/jerseyUtils';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  currency: 'CRC' | 'USD';
  settings?: StoreSettings;
  discountCodes?: DiscountCode[];
  onUpdateQuantity: (cartItemId: string, newQty: number) => void;
  onRemoveItem: (cartItemId: string) => void;
  onProceedToCheckout: (appliedDiscount: number) => void;
  onWhatsAppOrder: () => void;
}

export const CartDrawer: React.FC<CartDrawerProps> = ({
  isOpen,
  onClose,
  cart,
  currency,
  settings,
  discountCodes = [],
  onUpdateQuantity,
  onRemoveItem,
  onProceedToCheckout,
  onWhatsAppOrder
}) => {
  const [couponCode, setCouponCode] = useState('');
  const [couponApplied, setCouponApplied] = useState<{ code: string; percent: number } | null>(null);
  const [couponError, setCouponError] = useState('');

  if (!isOpen) return null;

  const stampFee = settings?.customizationPriceCRC ?? 0;
  const shippingFee = settings?.shippingFeeCRC ?? 2500;

  // Calculate Subtotal in CRC (base price + stamp)
  const calculateItemPrice = (item: CartItem) => {
    const itemPrice = item.jersey.priceCRC ?? item.jersey.price;
    const stampExtra = item.customStamping?.enabled ? stampFee : 0;
    return (itemPrice + stampExtra) * item.quantity;
  };

  const subtotal = cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const discountPercent = couponApplied ? couponApplied.percent : 0;
  const discount = Math.round(subtotal * (discountPercent / 100));
  const shipping = subtotal > 0 ? shippingFee : 0;
  const total = subtotal - discount + shipping;

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponError('');
    const code = couponCode.trim().toUpperCase();
    if (!code) return;

    // Search in dynamic discount codes first
    const match = discountCodes.find(d => d.code.toUpperCase() === code && d.active);
    if (match) {
      setCouponApplied({ code: match.code, percent: match.percentage });
      setCouponError('');
    } else if (code === 'OFFSIDE10') {
      setCouponApplied({ code, percent: 10 });
    } else if (code === 'GOLAZO' || code === 'CR7') {
      setCouponApplied({ code, percent: 15 });
    } else if (code === 'BIENVENIDO') {
      setCouponApplied({ code, percent: 20 });
    } else {
      const activeCodesList = discountCodes.filter(d => d.active).map(d => d.code).join(', ');
      setCouponError(
        activeCodesList
          ? `Cupón no válido. Cupones activos: ${activeCodesList}`
          : 'Cupón no válido. Por favor verifica el código ingresado.'
      );
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="absolute inset-0" onClick={onClose} />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#0a0a0a] border-l border-white/10 text-white flex flex-col shadow-2xl">
          
          {/* Header */}
          <div className="p-5 border-b border-white/10 bg-black flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-[#00e652] text-black font-black skew-x-[-10deg]">
                <ShoppingBag className="w-5 h-5 stroke-[3] skew-x-[10deg]" />
              </div>
              <div>
                <h2 className="text-lg font-black italic uppercase tracking-wider text-white">TU CARRITO DE COMPRAS</h2>
                <p className="text-[11px] text-[#00e652] font-black uppercase tracking-widest">{cart.length} {cart.length === 1 ? 'PRODUCTO' : 'PRODUCTOS'}</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-[#00e652] text-white hover:text-black transition cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Shipping notice */}
          <div className="p-3 bg-[#121212] border-b border-white/10 text-xs">
            <div className="flex items-center gap-2 text-[#00e652] font-bold text-[11px] uppercase tracking-wider">
              <Truck className="w-4 h-4 text-[#00e652] flex-shrink-0" />
              <span>Envíos a todo Costa Rica por Correos de CR o Mensajería Express</span>
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 bg-[#121212] border border-white/10 flex items-center justify-center text-[#00e652] skew-x-[-10deg]">
                  <ShoppingBag className="w-8 h-8 stroke-[2.5] skew-x-[10deg]" />
                </div>
                <div>
                  <h3 className="text-lg font-black italic uppercase text-white">TU CARRITO ESTÁ VACÍO</h3>
                  <p className="text-xs text-white/60 font-semibold mt-1">Explora nuestro catálogo y agrega tus camisetas oficiales y retro favoritas.</p>
                </div>
                <button
                  onClick={onClose}
                  className="bg-[#00e652] hover:bg-white text-black font-black px-6 py-3 uppercase text-xs tracking-widest skew-x-[-10deg] cursor-pointer shadow-xl"
                >
                  <span className="skew-x-[10deg] inline-block">EXPLORAR CAMISETAS</span>
                </button>
              </div>
            ) : (
              cart.map((item) => {
                const itemTotal = calculateItemPrice(item);
                return (
                  <div 
                    key={item.cartItemId}
                    className="p-3.5 bg-[#121212] rounded-2xl border border-white/10 space-y-3 relative group shadow-md"
                  >
                    <div className="flex gap-3">
                      {/* Image */}
                      <img
                        src={item.jersey.image || (item.itemType === 'ball' ? DEFAULT_BALL_FALLBACK_IMAGE : DEFAULT_JERSEY_FALLBACK_IMAGE)}
                        alt={item.jersey.name}
                        referrerPolicy="no-referrer"
                        onError={(e) => item.itemType === 'ball' ? handleBallImageError(e) : handleImageError(e)}
                        className="w-16 h-20 object-contain rounded-lg bg-black border border-white/10 flex-shrink-0 p-1"
                      />

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                          <h4 className="text-xs font-black uppercase tracking-wide text-white line-clamp-1 pr-2">
                            {item.jersey.name}
                          </h4>
                          <button
                            onClick={() => onRemoveItem(item.cartItemId)}
                            className="text-white/40 hover:text-rose-500 p-1 cursor-pointer"
                            title="Eliminar producto"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>

                        <div className="flex items-center gap-1.5 flex-wrap mt-1">
                          <span className="text-[10px] text-[#00e652] font-black uppercase tracking-wider">
                            TALLA: <span className="text-white bg-black border border-white/20 px-1.5 py-0.2 rounded ml-0.5">{item.size}</span>
                          </span>
                          {item.itemType === 'ball' ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded border border-[#00e652]/40 bg-[#00e652]/10 text-[#00e652] inline-flex items-center gap-1 uppercase font-black">
                              <span>⚽</span>
                              <span>BALÓN OFICIAL</span>
                            </span>
                          ) : (
                            <span className={`text-[9px] px-1.5 py-0.2 rounded border inline-flex items-center gap-1 uppercase font-black ${getJerseyVersionInfo(item.jersey.version).pillClass}`}>
                              <span>{getJerseyVersionInfo(item.jersey.version).icon}</span>
                              <span>{getJerseyVersionInfo(item.jersey.version).shortLabel}</span>
                            </span>
                          )}
                        </div>

                        {/* Stamping details badge */}
                        {item.customStamping?.enabled && (
                          <div className="mt-1.5 p-1.5 bg-black border border-[#00e652]/40 text-[10px] text-[#00e652] font-mono uppercase tracking-wider">
                            <span className="font-black">ESTAMPADO GRATIS 🎁:</span> {item.customStamping.name} #{item.customStamping.number}
                            {item.customStamping.patch && (
                              <p className="text-[9px] text-white/80 mt-0.5">+{item.customStamping.patch}</p>
                            )}
                          </div>
                        )}

                        {/* Price & Quantity Controls */}
                        <div className="flex justify-between items-center mt-3">
                          <div className="flex items-center bg-black border border-white/20">
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity - 1)}
                              className="px-2 py-0.5 text-white/70 hover:text-[#00e652] font-black text-xs cursor-pointer"
                            >
                              -
                            </button>
                            <span className="px-2 text-xs font-black text-[#00e652]">{item.quantity}</span>
                            <button
                              onClick={() => onUpdateQuantity(item.cartItemId, item.quantity + 1)}
                              className="px-2 py-0.5 text-white/70 hover:text-[#00e652] font-black text-xs cursor-pointer"
                            >
                              +
                            </button>
                          </div>

                          <span className="text-xs font-black text-white">
                            {formatPrice(itemTotal, currency)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-white/10 bg-black space-y-4">
              
              {/* Coupon input */}
              <form onSubmit={handleApplyCoupon} className="space-y-1">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="Código cupón (ej: OFFSIDE10)"
                      value={couponCode}
                      onChange={(e) => setCouponCode(e.target.value)}
                      className="w-full bg-[#121212] border border-white/20 rounded-xl py-2 pl-8 pr-3 text-xs text-white uppercase font-bold placeholder-white/40 focus:border-[#00e652]"
                    />
                    <Tag className="w-3.5 h-3.5 text-[#00e652] absolute left-2.5 top-2.5 stroke-[2.5]" />
                  </div>
                  <button
                    type="submit"
                    className="bg-[#00e652] hover:bg-white text-black font-black px-4 py-2 text-xs uppercase tracking-wider cursor-pointer skew-x-[-10deg]"
                  >
                    <span className="skew-x-[10deg] inline-block">APLICAR</span>
                  </button>
                </div>
                {couponApplied && (
                  <p className="text-[11px] text-[#00e652] font-black uppercase tracking-wider flex items-center gap-1">
                    <Check className="w-3.5 h-3.5 stroke-[2.5]" />
                    Cupón {couponApplied.code} aplicado ({couponApplied.percent}% de descuento)
                  </p>
                )}
                {couponError && (
                  <p className="text-[11px] text-rose-400 font-bold">{couponError}</p>
                )}
              </form>

              {/* Summary Breakdown */}
              <div className="space-y-1.5 text-xs text-white/70 border-t border-white/10 pt-3 font-semibold">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span className="font-bold text-white">{formatPrice(subtotal, currency)}</span>
                </div>
                
                {couponApplied && (
                  <div className="flex justify-between text-[#00e652]">
                    <span>Descuento ({couponApplied.percent}%):</span>
                    <span className="font-bold">-{formatPrice(discount, currency)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Envío a todo el país:</span>
                  <span className="font-bold text-white">
                    {formatPrice(shipping, currency)}
                  </span>
                </div>

                <div className="flex justify-between text-base font-black text-white pt-2 border-t border-white/10 uppercase italic">
                  <span>TOTAL A PAGAR:</span>
                  <span className="text-[#00e652]">{formatPrice(total, currency)}</span>
                </div>
              </div>

              {/* Action buttons */}
              <div className="space-y-2 pt-1">
                <button
                  onClick={() => onProceedToCheckout(discount)}
                  className="w-full py-4 bg-[#00e652] hover:bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 shadow-2xl cursor-pointer skew-x-[-10deg]"
                >
                  <div className="skew-x-[10deg] flex items-center gap-2">
                    <span>IR A PASARELA DE PAGOS</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </div>
                </button>

                <button
                  onClick={onWhatsAppOrder}
                  className="w-full py-3 bg-white/5 hover:bg-white/10 text-[#00e652] border border-[#00e652]/40 font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer skew-x-[-10deg]"
                >
                  <div className="skew-x-[10deg] flex items-center gap-2">
                    <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                    <span>COMPRAR POR WHATSAPP</span>
                  </div>
                </button>
              </div>

            </div>
          )}

        </div>
      </div>
    </div>
  );
};

