import React, { useState, useEffect } from 'react';
import { 
  X, 
  ShoppingBag, 
  MessageCircle, 
  Check, 
  Ruler, 
  Truck, 
  ShieldCheck 
} from 'lucide-react';
import { Jersey, Size, CustomStamping, StoreSettings } from '../types';
import { formatPrice } from '../utils/storage';
import { handleImageError } from '../utils/imageUtils';
import { getJerseyVersionInfo } from '../utils/jerseyUtils';

interface JerseyDetailModalProps {
  jersey: Jersey | null;
  currency: 'CRC' | 'USD';
  settings?: StoreSettings;
  onClose: () => void;
  onAddToCart: (jersey: Jersey, size: Size, quantity: number, customStamping?: CustomStamping) => void;
  onBuyWhatsApp: (jersey: Jersey, size: Size, customStamping?: CustomStamping) => void;
}

const ALL_SIZES: Size[] = ['S', 'M', 'L', 'XL', 'XXL'];

export const JerseyDetailModal: React.FC<JerseyDetailModalProps> = ({
  jersey,
  currency,
  settings,
  onClose,
  onAddToCart,
  onBuyWhatsApp
}) => {
  if (!jersey) return null;

  const versionInfo = getJerseyVersionInfo(jersey.version);

  const availableSizes = (jersey?.sizesAvailable || []).filter(() => jersey.stock > 0);
  const initialSize = availableSizes.length > 0 
    ? availableSizes[0] 
    : (jersey?.sizesAvailable?.[0] || 'M');

  const [selectedSize, setSelectedSize] = useState<Size>(initialSize);

  useEffect(() => {
    if (jersey) {
      const currentAvailable = (jersey.sizesAvailable || []).filter(() => jersey.stock > 0);
      if (currentAvailable.length > 0) {
        if (!currentAvailable.includes(selectedSize)) {
          setSelectedSize(currentAvailable[0]);
        }
      }
    }
  }, [jersey]);

  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [added, setAdded] = useState(false);

  const unitCRC = jersey.priceCRC || jersey.price;
  const totalPriceCRC = unitCRC * quantity;
  const totalPrice = jersey.price * quantity;

  const handleAddToCart = () => {
    onAddToCart(jersey, selectedSize, quantity, undefined);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleWhatsApp = () => {
    onBuyWhatsApp(jersey, selectedSize, undefined);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-20">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="bg-[#00e652] text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded">
              {jersey.league}
            </span>
            <span className="text-xs text-slate-400 font-bold">{jersey.yearSeason}</span>
            <span className="text-white/20">•</span>
            <span className={`text-[10px] uppercase font-black px-2 py-0.5 rounded flex items-center gap-1 ${versionInfo.badgeClass}`}>
              <span>{versionInfo.icon}</span>
              <span>{versionInfo.label}</span>
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Scroll Content */}
        <div className="p-6 overflow-y-auto grid grid-cols-1 md:grid-cols-12 gap-8">
          
          {/* Left Column: Image & Back View */}
          <div className="md:col-span-6 space-y-4">
            
            {/* View Switcher Tabs */}
            <div className="flex gap-2 justify-center bg-slate-950 p-1 rounded-xl border border-slate-800 max-w-xs mx-auto text-xs">
              <button
                onClick={() => setActiveTab('front')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'front'
                    ? 'bg-[#00e652] text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Frente
              </button>
              <button
                onClick={() => setActiveTab('back')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition cursor-pointer ${
                  activeTab === 'back'
                    ? 'bg-[#00e652] text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Espalda / Reverso
              </button>
            </div>

            {/* Display Area */}
            <div className="relative h-80 sm:h-96 w-full rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 overflow-hidden">
              {activeTab === 'front' ? (
                <img
                  src={jersey.image}
                  alt={jersey.name}
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="h-full object-contain rounded-lg"
                />
              ) : (
                <img
                  src={jersey.backImage || jersey.image}
                  alt={`${jersey.name} Espalda`}
                  referrerPolicy="no-referrer"
                  onError={handleImageError}
                  className="h-full object-contain rounded-lg"
                />
              )}
            </div>

            {/* Product Guarantee highlights */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                <Truck className="w-4 h-4 text-[#00e652] flex-shrink-0" />
                <span>Envío asegurado a todo el país</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-[#00e652] flex-shrink-0" />
                <span>Prenda física 100% original en stock</span>
              </div>
            </div>

          </div>

          {/* Right Column: Options & Controls */}
          <div className="md:col-span-6 space-y-5">
            
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#00e652] uppercase tracking-wider mb-1 flex-wrap">
                <span>{jersey.team}</span>
                <span className="text-slate-600">•</span>
                <span>{jersey.type}</span>
                <span className="text-slate-600">•</span>
                <span className={`text-[10px] px-2 py-0.5 rounded uppercase font-black inline-flex items-center gap-1 ${versionInfo.pillClass}`}>
                  <span>{versionInfo.icon}</span>
                  <span>{versionInfo.label}</span>
                </span>
                {jersey.genderCategory && (
                  <>
                    <span className="text-slate-600">•</span>
                    <span className="text-[10px] bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-bold">
                      {jersey.genderCategory}
                    </span>
                  </>
                )}
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{jersey.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <span className="text-xs text-slate-300 font-bold">{jersey.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-500">({jersey.reviewsCount} reseñas verificadas)</span>
              </div>
            </div>

            {/* Version Information Card */}
            <div className="p-3.5 bg-slate-950 rounded-2xl border border-slate-800 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-black tracking-widest text-[#00e652] flex items-center gap-1.5">
                  <span>{versionInfo.icon}</span>
                  <span>VERSIÓN DE FABRICACIÓN</span>
                </span>
                <span className="text-[9px] uppercase px-2 py-0.5 rounded font-black bg-[#00e652]/15 text-[#00e652] border border-[#00e652]/30">
                  OFICIAL
                </span>
              </div>
              <p className="text-sm font-black text-white flex items-center gap-2">
                <span>{versionInfo.icon}</span>
                <span>{versionInfo.label}</span>
              </p>
              <p className="text-[11px] text-slate-400 leading-relaxed">{versionInfo.description}</p>
            </div>

            {/* Price display */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-baseline justify-between">
              <div>
                <div className="flex items-baseline gap-2">
                  <span className="text-2xl font-black text-[#00e652]">
                    {formatPrice(totalPriceCRC, currency)}
                  </span>
                  {jersey.originalPrice && jersey.originalPrice > jersey.price && (
                    <span className="text-xs text-white/40 line-through font-bold">
                      {formatPrice(
                        jersey.originalPrice * quantity,
                        currency,
                        jersey.originalPriceCRC ? jersey.originalPriceCRC * quantity : undefined
                      )}
                    </span>
                  )}
                  {jersey.discountPercent && jersey.discountPercent > 0 ? (
                    <span className="bg-rose-600 text-white font-black text-[10px] uppercase px-2 py-0.5 rounded">
                      -{jersey.discountPercent}% OFF
                    </span>
                  ) : null}
                </div>
              </div>
              {jersey.stock > 0 ? (
                <span className="bg-[#00e652]/20 text-[#00e652] text-xs px-2.5 py-1 rounded-md font-bold border border-[#00e652]/30">
                  Disponible ({jersey.stock} en stock)
                </span>
              ) : (
                <span className="bg-rose-950 text-rose-400 text-xs px-2.5 py-1 rounded-md font-bold">
                  Sin Stock
                </span>
              )}
            </div>

            {/* Size Selector with Strikethrough for unavailable sizes */}
            <div className="space-y-2.5">
              <div className="flex justify-between items-center text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-slate-200 uppercase">TALLAS EN BODEGA:</span>
                  {selectedSize && (jersey.sizesAvailable || []).includes(selectedSize) && jersey.stock > 0 && (
                    <span className="bg-[#00e652]/10 text-[#00e652] text-[11px] font-black px-2 py-0.5 rounded border border-[#00e652]/30 uppercase">
                      Talla Seleccionada: {selectedSize}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-[#00e652] hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Guía de Tallas</span>
                </button>
              </div>

              {/* Grid of all standard sizes */}
              <div className="grid grid-cols-5 gap-2">
                {ALL_SIZES.map((size) => {
                  const isAvailable = jersey.stock > 0 && (jersey.sizesAvailable || []).includes(size);
                  const isSelected = selectedSize === size && isAvailable;

                  return (
                    <button
                      key={size}
                      type="button"
                      disabled={!isAvailable}
                      onClick={() => {
                        if (isAvailable) setSelectedSize(size);
                      }}
                      title={isAvailable ? `Talla ${size} disponible para entrega inmediata` : `Talla ${size} agotada / no disponible`}
                      className={`relative py-3 rounded-xl text-xs font-black transition-all flex items-center justify-center overflow-hidden select-none ${
                        !isAvailable
                          ? 'bg-slate-950/40 text-slate-600 border border-slate-800/80 cursor-not-allowed opacity-50'
                          : isSelected
                          ? 'bg-[#00e652] text-slate-950 shadow-lg shadow-[#00e652]/20 border border-[#00e652] cursor-pointer'
                          : 'bg-slate-950 text-slate-200 border border-slate-800 hover:border-white/40 hover:bg-slate-800 cursor-pointer'
                      }`}
                    >
                      {/* Size text */}
                      <span className={`relative z-10 ${!isAvailable ? 'line-through text-slate-600' : ''}`}>
                        {size}
                      </span>

                      {/* Rayita diagonal roja que indica que no está disponible */}
                      {!isAvailable && (
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                          <div className="w-[140%] h-[2px] bg-red-500/90 -rotate-45 transform origin-center shadow-[0_0_2px_rgba(239,68,68,0.9)]" />
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>

              {/* Legend explaining the rayita */}
              <div className="flex items-center justify-between text-[11px] text-slate-400 pt-0.5">
                <div className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#00e652] inline-block" />
                  <span className="text-slate-300">Talla Disponible</span>
                </div>
                <div className="flex items-center gap-1.5 text-slate-400">
                  <span className="relative w-3.5 h-3.5 rounded bg-slate-950 border border-slate-800 inline-flex items-center justify-center overflow-hidden">
                    <span className="w-full h-[2px] bg-red-500 -rotate-45 block" />
                  </span>
                  <span className="text-red-400/90 font-medium">Rayita: Talla no disponible</span>
                </div>
              </div>

              {showSizeGuide && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 animate-in fade-in">
                  <p className="font-bold text-[#00e652]">Medidas Aproximadas (Pecho x Largo):</p>
                  <p>• S: 50 cm x 70 cm (Estatura 1.65m - 1.72m)</p>
                  <p>• M: 52 cm x 72 cm (Estatura 1.72m - 1.78m)</p>
                  <p>• L: 54 cm x 74 cm (Estatura 1.78m - 1.83m)</p>
                  <p>• XL: 56 cm x 76 cm (Estatura 1.83m - 1.88m)</p>
                  <p>• XXL: 58 cm x 78 cm (Estatura +1.88m)</p>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-extrabold uppercase text-slate-300">Cantidad:</span>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  type="button"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-300 hover:text-white font-bold cursor-pointer"
                >
                  -
                </button>
                <span className="px-3 text-xs font-black text-[#00e652]">{quantity}</span>
                <button
                  type="button"
                  onClick={() => setQuantity(Math.min(jersey.stock || 10, quantity + 1))}
                  className="px-3 py-1.5 text-slate-300 hover:text-white font-bold cursor-pointer"
                >
                  +
                </button>
              </div>
              <span className="text-[11px] text-slate-500">
                Máximo {jersey.stock} unidad{jersey.stock === 1 ? '' : 'es'} en bodega
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-2 pt-2">
              <button
                onClick={handleAddToCart}
                disabled={jersey.stock <= 0}
                className={`w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-lg ${
                  added
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950'
                }`}
              >
                {added ? (
                  <>
                    <Check className="w-5 h-5" />
                    <span>¡Agregada con éxito!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-5 h-5" />
                    <span>Agregar al Carrito ({formatPrice(totalPriceCRC, currency)})</span>
                  </>
                )}
              </button>

              <button
                onClick={handleWhatsApp}
                className="w-full py-3.5 rounded-xl text-xs font-black uppercase tracking-wider bg-emerald-950/80 hover:bg-emerald-900/90 text-emerald-400 border border-emerald-500/40 flex items-center justify-center gap-2 transition-all cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 text-emerald-400" />
                <span>Comprar directamente por WhatsApp</span>
              </button>
            </div>

            {/* Description */}
            <div className="pt-2 text-xs text-slate-400 space-y-1">
              <p className="font-bold text-slate-200">Descripción del Producto:</p>
              <p className="leading-relaxed">{jersey.description}</p>
              {jersey.fabricInfo && (
                <p className="text-[11px] text-slate-500 pt-1">
                  <strong className="text-slate-400">Tejido:</strong> {jersey.fabricInfo}
                </p>
              )}
            </div>

          </div>

        </div>
      </div>
    </div>
  );
};
