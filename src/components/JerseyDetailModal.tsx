import React, { useState } from 'react';
import { 
  X, 
  Star, 
  ShoppingBag, 
  MessageCircle, 
  Sparkles, 
  Check, 
  Ruler, 
  Truck, 
  ShieldCheck, 
  Flame,
  Info
} from 'lucide-react';
import { Jersey, Size, CustomStamping } from '../types';
import { formatPrice } from '../utils/storage';

interface JerseyDetailModalProps {
  jersey: Jersey | null;
  currency: 'USD' | 'COP';
  onClose: () => void;
  onAddToCart: (jersey: Jersey, size: Size, quantity: number, customStamping?: CustomStamping) => void;
  onBuyWhatsApp: (jersey: Jersey, size: Size, customStamping?: CustomStamping) => void;
}

export const JerseyDetailModal: React.FC<JerseyDetailModalProps> = ({
  jersey,
  currency,
  onClose,
  onAddToCart,
  onBuyWhatsApp
}) => {
  if (!jersey) return null;

  const [selectedSize, setSelectedSize] = useState<Size>(jersey.sizesAvailable[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'front' | 'back'>('front');
  
  // Custom Stamping State
  const [stampEnabled, setStampEnabled] = useState(false);
  const [stampName, setStampName] = useState('');
  const [stampNumber, setStampNumber] = useState('');
  const [selectedPatch, setSelectedPatch] = useState('Sin Parche');
  
  const [showSizeGuide, setShowSizeGuide] = useState(false);
  const [added, setAdded] = useState(false);

  const STAMP_PRICE_USD = 10;
  const totalPriceUSD = (jersey.price + (stampEnabled ? STAMP_PRICE_USD : 0)) * quantity;

  const handleAddToCart = () => {
    const custom: CustomStamping | undefined = stampEnabled ? {
      enabled: true,
      name: stampName.trim().toUpperCase() || 'JUGADOR',
      number: stampNumber.trim() || '10',
      patch: selectedPatch !== 'Sin Parche' ? selectedPatch : undefined
    } : undefined;

    onAddToCart(jersey, selectedSize, quantity, custom);
    setAdded(true);
    setTimeout(() => {
      setAdded(false);
      onClose();
    }, 1200);
  };

  const handleWhatsApp = () => {
    const custom: CustomStamping | undefined = stampEnabled ? {
      enabled: true,
      name: stampName.trim().toUpperCase() || 'JUGADOR',
      number: stampNumber.trim() || '10',
      patch: selectedPatch !== 'Sin Parche' ? selectedPatch : undefined
    } : undefined;

    onBuyWhatsApp(jersey, selectedSize, custom);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-4xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col text-white animate-in zoom-in-95 duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-800 bg-slate-950/60 sticky top-0 z-20">
          <div className="flex items-center gap-2">
            <span className="bg-emerald-500 text-slate-950 text-[10px] font-black uppercase px-2.5 py-0.5 rounded">
              {jersey.league}
            </span>
            <span className="text-xs text-slate-400 font-bold">{jersey.yearSeason}</span>
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
          
          {/* Left Column: Image & Back Live Preview */}
          <div className="md:col-span-6 space-y-4">
            
            {/* View Switcher Tabs */}
            <div className="flex gap-2 justify-center bg-slate-950 p-1 rounded-xl border border-slate-800 max-w-xs mx-auto text-xs">
              <button
                onClick={() => setActiveTab('front')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                  activeTab === 'front'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Frente
              </button>
              <button
                onClick={() => setActiveTab('back')}
                className={`flex-1 py-1.5 rounded-lg font-bold transition ${
                  activeTab === 'back'
                    ? 'bg-emerald-500 text-slate-950'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                Dorsal (Espalda)
              </button>
            </div>

            {/* Display Area */}
            <div className="relative h-80 sm:h-96 w-full rounded-2xl bg-slate-950 border border-slate-800 flex items-center justify-center p-4 overflow-hidden">
              {activeTab === 'front' ? (
                <img
                  src={jersey.image}
                  alt={jersey.name}
                  className="h-full object-contain rounded-lg"
                />
              ) : (
                <div className="relative h-full w-full flex items-center justify-center bg-gradient-to-b from-slate-950 to-slate-900 rounded-lg overflow-hidden">
                  <img
                    src={jersey.backImage || jersey.image}
                    alt="Jersey Back"
                    className="h-full object-contain opacity-80"
                  />
                  {/* Live Stamp overlay */}
                  <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-4 pointer-events-none">
                    <p className="text-amber-300 font-black tracking-widest text-xl sm:text-2xl uppercase drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)] font-mono">
                      {stampEnabled && stampName ? stampName.toUpperCase() : (stampEnabled ? 'TU NOMBRE' : '')}
                    </p>
                    <p className="text-amber-400 font-black text-6xl sm:text-7xl tracking-tighter drop-shadow-[0_4px_8px_rgba(0,0,0,0.9)] font-mono mt-1">
                      {stampEnabled && stampNumber ? stampNumber : (stampEnabled ? '10' : '')}
                    </p>
                    {!stampEnabled && (
                      <div className="bg-slate-950/90 text-emerald-400 text-xs px-3 py-1.5 rounded-lg border border-emerald-500/30 font-semibold backdrop-blur">
                        💡 Activa el estampado abajo para personalizar
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Product Guarantee highlights */}
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                <Truck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Envío asegurado a todo el país</span>
              </div>
              <div className="flex items-center gap-2 p-2.5 bg-slate-950 rounded-xl border border-slate-800 text-slate-300">
                <ShieldCheck className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <span>Garantía de calidad 100%</span>
              </div>
            </div>

          </div>

          {/* Right Column: Options & Controls */}
          <div className="md:col-span-6 space-y-5">
            
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-emerald-400 uppercase tracking-wider mb-1">
                <span>{jersey.team}</span>
                <span>•</span>
                <span>{jersey.type}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-black text-white">{jersey.name}</h2>
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-amber-400 text-sm">★★★★★</div>
                <span className="text-xs text-slate-300 font-bold">{jersey.rating.toFixed(1)}</span>
                <span className="text-xs text-slate-500">({jersey.reviewsCount} reseñas verificadas)</span>
              </div>
            </div>

            {/* Price display */}
            <div className="bg-slate-950 p-3.5 rounded-xl border border-slate-800 flex items-baseline justify-between">
              <div>
                <span className="text-2xl font-black text-emerald-400">
                  {formatPrice(totalPriceUSD, currency)}
                </span>
                {stampEnabled && (
                  <p className="text-[11px] text-amber-400 font-medium">
                    Incluye +{formatPrice(STAMP_PRICE_USD * quantity, currency)} por estampado personalizado
                  </p>
                )}
              </div>
              {jersey.stock > 0 ? (
                <span className="bg-emerald-500/20 text-emerald-400 text-xs px-2.5 py-1 rounded-md font-bold border border-emerald-500/30">
                  Disponible ({jersey.stock} en stock)
                </span>
              ) : (
                <span className="bg-rose-950 text-rose-400 text-xs px-2.5 py-1 rounded-md font-bold">
                  Sin Stock
                </span>
              )}
            </div>

            {/* Size Selector */}
            <div className="space-y-2">
              <div className="flex justify-between items-center text-xs">
                <span className="font-extrabold text-slate-200 uppercase">1. Selecciona tu Talla:</span>
                <button
                  onClick={() => setShowSizeGuide(!showSizeGuide)}
                  className="text-emerald-400 hover:underline flex items-center gap-1 font-bold cursor-pointer"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Guía de Tallas</span>
                </button>
              </div>

              <div className="flex gap-2">
                {jersey.sizesAvailable.map((size) => (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`flex-1 py-2.5 rounded-xl text-xs font-black transition-all cursor-pointer ${
                      selectedSize === size
                        ? 'bg-emerald-500 text-slate-950 shadow-md shadow-emerald-500/20'
                        : 'bg-slate-950 text-slate-300 border border-slate-800 hover:bg-slate-800'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>

              {showSizeGuide && (
                <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 space-y-1 animate-in fade-in">
                  <p className="font-bold text-emerald-400">Medidas Aproximadas (Pecho x Largo):</p>
                  <p>• S: 50 cm x 70 cm (Estatura 1.65m - 1.72m)</p>
                  <p>• M: 52 cm x 72 cm (Estatura 1.72m - 1.78m)</p>
                  <p>• L: 54 cm x 74 cm (Estatura 1.78m - 1.83m)</p>
                  <p>• XL: 56 cm x 76 cm (Estatura 1.83m - 1.88m)</p>
                  <p>• XXL: 58 cm x 78 cm (Estatura +1.88m)</p>
                </div>
              )}
            </div>

            {/* Custom Stamping Customizer */}
            <div className="p-4 bg-slate-950/80 border border-slate-800 rounded-2xl space-y-3">
              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={stampEnabled}
                    onChange={(e) => {
                      setStampEnabled(e.target.checked);
                      if (e.target.checked) setActiveTab('back');
                    }}
                    className="w-4 h-4 rounded text-emerald-500 focus:ring-emerald-500 bg-slate-900 border-slate-700"
                  />
                  <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-amber-400" />
                    2. Personalizar Nombre & Dorsal (+{formatPrice(STAMP_PRICE_USD, currency)})
                  </span>
                </label>
              </div>

              {stampEnabled && (
                <div className="space-y-3 pt-2 animate-in fade-in">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    <div className="sm:col-span-2">
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                        Nombre / Apellido:
                      </label>
                      <input
                        type="text"
                        maxLength={14}
                        placeholder="ej: MBAPPÉ / JAMES / TU NOMBRE"
                        value={stampName}
                        onChange={(e) => setStampName(e.target.value.toUpperCase())}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-amber-300 placeholder-slate-500 focus:border-emerald-500 uppercase"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                        Número (Dorsal):
                      </label>
                      <input
                        type="text"
                        maxLength={2}
                        placeholder="10"
                        value={stampNumber}
                        onChange={(e) => setStampNumber(e.target.value.replace(/\D/g, ''))}
                        className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs font-mono font-bold text-amber-400 placeholder-slate-500 focus:border-emerald-500 text-center"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-[10px] text-slate-400 uppercase font-bold mb-1">
                      Parches Oficiales de Torneo:
                    </label>
                    <select
                      value={selectedPatch}
                      onChange={(e) => setSelectedPatch(e.target.value)}
                      className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-xs text-slate-200 focus:border-emerald-500"
                    >
                      <option value="Sin Parche">Sin Parches Adicionales</option>
                      <option value="Parche Champions League + Foundation">Parche UEFA Champions League</option>
                      <option value="Parche Campeón del Mundo FIFA">Parche Campeón del Mundo FIFA</option>
                      <option value="Parche Liga Local EA Sports / Premier">Parche Oficial de Liga Local</option>
                    </select>
                  </div>
                </div>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4">
              <span className="text-xs font-extrabold uppercase text-slate-300">Cantidad:</span>
              <div className="flex items-center bg-slate-950 border border-slate-800 rounded-xl">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-1.5 text-slate-300 hover:text-white font-bold"
                >
                  -
                </button>
                <span className="px-3 text-xs font-black text-emerald-400">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-1.5 text-slate-300 hover:text-white font-bold"
                >
                  +
                </button>
              </div>
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
                    <span>Agregar al Carrito ({formatPrice(totalPriceUSD, currency)})</span>
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
