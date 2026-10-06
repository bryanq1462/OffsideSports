import React, { useState } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  Upload, 
  Image as ImageIcon, 
  Check, 
  Sparkles, 
  Flame, 
  DollarSign, 
  Tag, 
  Layers, 
  X, 
  AlertTriangle,
  RotateCcw
} from 'lucide-react';
import { Ball } from '../types';
import { formatPrice, CRC_RATE } from '../utils/storage';
import { handleBallImageError, DEFAULT_BALL_FALLBACK_IMAGE, compressImageFile } from '../utils/imageUtils';
import { BALL_BRANDS, BALL_CATEGORIES_LIST, BALL_SIZES_CATALOG } from '../data/mockBalls';

interface AdminBallsTabProps {
  balls: Ball[];
  currency: 'CRC' | 'USD';
  onUpdateBalls: (updated: Ball[]) => void;
  onSaveBall?: (ball: Ball) => Promise<void>;
  onDeleteBall?: (ballId: string) => Promise<void>;
  isHalloween?: boolean;
}

export const AdminBallsTab: React.FC<AdminBallsTabProps> = ({
  balls,
  currency,
  onUpdateBalls,
  onSaveBall,
  onDeleteBall,
  isHalloween = false
}) => {
  const [search, setSearch] = useState('');
  const [brandFilter, setBrandFilter] = useState('all');
  const [categoryFilter, setCategoryFilter] = useState('all');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBall, setEditingBall] = useState<Partial<Ball> | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Form price inputs
  const [priceCrcInput, setPriceCrcInput] = useState<string>('');
  const [hasOffer, setHasOffer] = useState<boolean>(false);
  const [originalPriceCrcInput, setOriginalPriceCrcInput] = useState<string>('');

  // Delete Confirmation State
  const [deleteTarget, setDeleteTarget] = useState<Ball | null>(null);

  // Filtered Balls
  const filteredBalls = balls.filter((b) => {
    const q = search.toLowerCase().trim();
    const matchesSearch = 
      !q ||
      b.name.toLowerCase().includes(q) ||
      b.brand.toLowerCase().includes(q) ||
      (b.tournament || '').toLowerCase().includes(q);
    const matchesBrand = brandFilter === 'all' || b.brand === brandFilter;
    const matchesCategory = categoryFilter === 'all' || b.category === categoryFilter;
    return matchesSearch && matchesBrand && matchesCategory;
  });

  // Open modal for new ball
  const handleOpenNewBall = () => {
    setEditingBall({
      id: '',
      name: '',
      brand: 'Adidas',
      tournament: 'UEFA Champions League',
      category: 'Oficial Pro Match',
      price: 28000,
      priceCRC: 28000,
      stock: 10,
      sizesAvailable: ['Talla 5 (Oficial)'],
      description: 'Balón oficial de competición con estructura de paneles termosellados de alta resistencia.',
      material: '100% poliuretano termosellado, cámara de butilo de alta retención de aire.',
      image: '',
      rating: 5.0,
      reviewsCount: 1,
      isPopular: false,
      isNew: true,
      badgeTags: ['Oficial Pro']
    });
    setPriceCrcInput('28000');
    setHasOffer(false);
    setOriginalPriceCrcInput('');
    setSaveStatus(null);
    setIsModalOpen(true);
  };

  // Open modal for editing existing ball
  const handleOpenEditBall = (ball: Ball) => {
    setEditingBall({ ...ball });
    const pCrc = ball.priceCRC ?? ball.price;
    setPriceCrcInput(String(pCrc));
    if (ball.originalPriceCRC && ball.originalPriceCRC > pCrc) {
      setHasOffer(true);
      setOriginalPriceCrcInput(String(ball.originalPriceCRC));
    } else {
      setHasOffer(false);
      setOriginalPriceCrcInput('');
    }
    setSaveStatus(null);
    setIsModalOpen(true);
  };

  // Upload image handler
  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressed = await compressImageFile(file, 800, 800, 0.75);
      if (compressed) {
        setEditingBall((prev) => ({
          ...prev,
          image: compressed
        }));
      }
    } catch (err) {
      console.error('Error compressing ball image:', err);
    }
  };

  // Toggle size in array
  const handleToggleSize = (sizeStr: string) => {
    if (!editingBall) return;
    const current = editingBall.sizesAvailable || [];
    if (current.includes(sizeStr)) {
      if (current.length === 1) return; // keep at least 1 size
      setEditingBall({
        ...editingBall,
        sizesAvailable: current.filter((s) => s !== sizeStr)
      });
    } else {
      setEditingBall({
        ...editingBall,
        sizesAvailable: [...current, sizeStr]
      });
    }
  };

  // Save Ball Handler
  const handleSaveBall = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBall) return;

    const name = (editingBall.name || '').trim();
    if (!name) {
      setSaveStatus({ type: 'error', message: 'El nombre del balón es requerido.' });
      return;
    }

    const priceNum = parseInt(priceCrcInput.replace(/[^0-9]/g, ''), 10);
    if (isNaN(priceNum) || priceNum <= 0) {
      setSaveStatus({ type: 'error', message: 'Por favor ingresa un precio válido en Colones (₡).' });
      return;
    }

    let origPriceNum: number | undefined = undefined;
    let discountPercent: number | undefined = undefined;
    if (hasOffer && originalPriceCrcInput) {
      const parsedOrig = parseInt(originalPriceCrcInput.replace(/[^0-9]/g, ''), 10);
      if (!isNaN(parsedOrig) && parsedOrig > priceNum) {
        origPriceNum = parsedOrig;
        discountPercent = Math.round(((origPriceNum - priceNum) / origPriceNum) * 100);
      }
    }

    setIsSaving(true);
    setSaveStatus(null);

    const ballId = editingBall.id && editingBall.id.trim() ? editingBall.id : `ball-${Date.now()}`;
    const finalizedBall: Ball = {
      id: ballId,
      name,
      brand: editingBall.brand || 'Adidas',
      tournament: editingBall.tournament || 'Torneo Oficial',
      category: editingBall.category || 'Oficial Pro Match',
      price: priceNum,
      priceCRC: priceNum,
      originalPrice: origPriceNum,
      originalPriceCRC: origPriceNum,
      discountPercent,
      sizesAvailable: editingBall.sizesAvailable && editingBall.sizesAvailable.length > 0
        ? editingBall.sizesAvailable
        : ['Talla 5 (Oficial)'],
      description: editingBall.description || 'Balón oficial de competición de alta calidad.',
      material: editingBall.material || 'Termosellado de poliuretano, cámara de butilo.',
      image: editingBall.image || 'https://images.unsplash.com/photo-1614632537423-1e6c2e7e0aab?auto=format&fit=crop&q=80&w=800',
      rating: editingBall.rating || 5.0,
      reviewsCount: editingBall.reviewsCount || 1,
      stock: Number(editingBall.stock) >= 0 ? Number(editingBall.stock) : 10,
      isPopular: Boolean(editingBall.isPopular),
      isNew: Boolean(editingBall.isNew),
      badgeTags: editingBall.badgeTags || ['Balón Oficial']
    };

    try {
      if (onSaveBall) {
        await onSaveBall(finalizedBall);
      } else {
        const exists = balls.some((b) => b.id === finalizedBall.id);
        const updated = exists
          ? balls.map((b) => (b.id === finalizedBall.id ? finalizedBall : b))
          : [finalizedBall, ...balls];
        onUpdateBalls(updated);
      }

      setSaveStatus({ type: 'success', message: '¡Balón guardado exitosamente y listo para la venta!' });
      setTimeout(() => {
        setIsSaving(false);
        setIsModalOpen(false);
        setEditingBall(null);
        setSaveStatus(null);
      }, 700);
    } catch (err: any) {
      setIsSaving(false);
      setSaveStatus({ type: 'error', message: `Error al guardar: ${err.message || 'Verifica la conexión'}` });
    }
  };

  // Quick Stock Modifier
  const handleQuickStockChange = async (ball: Ball, delta: number) => {
    const newStock = Math.max(0, ball.stock + delta);
    const updatedBall = { ...ball, stock: newStock };
    if (onSaveBall) {
      await onSaveBall(updatedBall);
    } else {
      onUpdateBalls(balls.map((b) => (b.id === ball.id ? updatedBall : b)));
    }
  };

  // Confirm delete ball
  const handleConfirmDelete = async () => {
    if (!deleteTarget) return;
    try {
      if (onDeleteBall) {
        await onDeleteBall(deleteTarget.id);
      } else {
        onUpdateBalls(balls.filter((b) => b.id !== deleteTarget.id));
      }
      setDeleteTarget(null);
    } catch (err: any) {
      console.error('Error deleting ball:', err);
    }
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner & Action */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-4 sm:p-5 border rounded-2xl ${
        isHalloween
          ? 'bg-gradient-to-r from-orange-950/60 via-black to-orange-950/60 border-orange-500/40 shadow-lg shadow-orange-950/30'
          : 'bg-gradient-to-r from-emerald-950/40 via-black to-emerald-950/40 border-[#00e652]/30'
      }`}>
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xl">{isHalloween ? '🎃' : '⚽'}</span>
            <h3 className="text-base sm:text-lg font-black uppercase text-white tracking-wide">
              {isHalloween ? 'Catálogo de Balones (Edición Halloween)' : 'Catálogo de Balones a la Venta'}
            </h3>
            <span className={`${isHalloween ? 'bg-orange-500' : 'bg-[#00e652]'} text-black text-[10px] font-black uppercase px-2 py-0.5 rounded`}>
              {balls.length} En Catálogo
            </span>
          </div>
          <p className="text-xs text-white/60 mt-1">
            Administra los balones oficiales disponibles en la tienda, actualiza precios en ₡ Colones y controla el stock en tiempo real.
          </p>
        </div>

        <button
          type="button"
          onClick={handleOpenNewBall}
          className={`shrink-0 ${isHalloween ? 'bg-orange-500 hover:bg-orange-400 shadow-orange-500/20' : 'bg-[#00e652] hover:bg-white'} text-black font-black px-5 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl hover:scale-105 transition-all cursor-pointer`}
        >
          <Plus className="w-4 h-4 stroke-[3]" />
          <span>Poner Nuevo Balón a la Venta</span>
        </button>
      </div>

      {/* Search and Filters Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 bg-[#111111] p-4 rounded-2xl border border-white/10 text-xs">
        <div className="relative">
          <Search className="w-4 h-4 text-white/40 absolute left-3 top-3" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar balón por nombre o marca..."
            className="w-full bg-black border border-white/20 rounded-xl py-2 pl-9 pr-3 text-xs text-white placeholder-white/40 focus:outline-none focus:border-[#00e652]"
          />
        </div>

        <div>
          <select
            value={brandFilter}
            onChange={(e) => setBrandFilter(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#00e652] cursor-pointer"
          >
            <option value="all">Todas las Marcas</option>
            {BALL_BRANDS.map((b) => (
              <option key={b} value={b}>{b}</option>
            ))}
          </select>
        </div>

        <div>
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-bold focus:outline-none focus:border-[#00e652] cursor-pointer"
          >
            <option value="all">Todas las Categorías</option>
            {BALL_CATEGORIES_LIST.map((c) => (
              <option key={c} value={c}>{c}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Balones Grid / Table */}
      {filteredBalls.length === 0 ? (
        <div className="bg-[#121212] border border-white/10 rounded-2xl p-10 text-center space-y-3">
          <div className="text-3xl">⚽</div>
          <h4 className="text-sm font-black uppercase text-white">No se encontraron balones</h4>
          <p className="text-xs text-white/50">Intenta con otro término de búsqueda o agrega un nuevo balón a la venta.</p>
          <button
            type="button"
            onClick={handleOpenNewBall}
            className="bg-[#00e652] text-black font-black px-4 py-2 rounded-xl text-xs uppercase cursor-pointer"
          >
            Poner Balón a la Venta
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredBalls.map((ball) => {
            const priceCRC = ball.priceCRC ?? ball.price;
            const originalPriceCRC = ball.originalPriceCRC ?? ball.originalPrice;
            const isLowStock = ball.stock <= 3;

            return (
              <div
                key={ball.id}
                className="bg-[#121212] border border-white/10 hover:border-[#00e652]/50 rounded-2xl p-4 flex flex-col justify-between space-y-3 shadow-md transition-all"
              >
                {/* Header info */}
                <div className="flex gap-3">
                  <div className="w-20 h-20 bg-black rounded-xl border border-white/10 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={ball.image || DEFAULT_BALL_FALLBACK_IMAGE}
                      alt={ball.name}
                      onError={handleBallImageError}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className="text-[10px] font-black text-[#00e652] uppercase">
                        {ball.brand}
                      </span>
                      {ball.category && (
                        <span className="text-[9px] bg-white/5 px-1.5 py-0.2 rounded border border-white/10 text-white/70 uppercase">
                          {ball.category}
                        </span>
                      )}
                    </div>

                    <h4 className="text-xs font-black text-white uppercase leading-snug line-clamp-2 mt-0.5">
                      {ball.name}
                    </h4>

                    {ball.tournament && (
                      <p className="text-[10px] text-white/40 truncate mt-0.5 font-semibold">
                        {ball.tournament}
                      </p>
                    )}
                  </div>
                </div>

                {/* Sizes and Price */}
                <div className="pt-2 border-t border-white/5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div>
                      <span className="text-[10px] text-white/50 uppercase font-black block">Precio</span>
                      <span className="text-sm font-black text-[#00e652]">
                        {formatPrice(priceCRC, currency)}
                      </span>
                      {originalPriceCRC && originalPriceCRC > priceCRC && (
                        <span className="text-[10px] text-white/40 line-through ml-1.5 font-bold">
                          {formatPrice(originalPriceCRC, currency)}
                        </span>
                      )}
                    </div>

                    {/* Stock modifier */}
                    <div className="text-right">
                      <span className={`text-[10px] uppercase font-black block ${isLowStock ? 'text-rose-400' : 'text-white/50'}`}>
                        {isLowStock ? '¡Bajo Stock!' : 'Stock'}
                      </span>
                      <div className="flex items-center gap-1.5 mt-0.5">
                        <button
                          type="button"
                          onClick={() => handleQuickStockChange(ball, -1)}
                          className="w-5 h-5 bg-black border border-white/20 hover:border-[#00e652] text-white/80 hover:text-white rounded flex items-center justify-center font-black text-xs cursor-pointer"
                          title="Restar 1 de stock"
                        >
                          -
                        </button>
                        <span className={`font-mono font-black text-xs px-1 ${isLowStock ? 'text-rose-400' : 'text-white'}`}>
                          {ball.stock}
                        </span>
                        <button
                          type="button"
                          onClick={() => handleQuickStockChange(ball, 1)}
                          className="w-5 h-5 bg-black border border-white/20 hover:border-[#00e652] text-white/80 hover:text-white rounded flex items-center justify-center font-black text-xs cursor-pointer"
                          title="Sumar 1 de stock"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Sizes pills */}
                  <div className="flex items-center gap-1 flex-wrap">
                    <span className="text-[9px] text-white/40 uppercase font-black">Tallas:</span>
                    {ball.sizesAvailable.map((sz) => (
                      <span key={sz} className="text-[9px] bg-black px-1.5 py-0.5 rounded border border-white/10 text-white/80 font-bold">
                        {sz.includes('5') ? 'Talla 5' : sz.includes('4') ? 'Talla 4' : sz.includes('Futsal') ? 'Futsal' : sz}
                      </span>
                    ))}
                  </div>
                </div>

                {/* Action buttons */}
                <div className="flex items-center gap-2 pt-2 border-t border-white/5">
                  <button
                    type="button"
                    onClick={() => handleOpenEditBall(ball)}
                    className="flex-1 bg-white/5 hover:bg-[#00e652] text-white hover:text-black font-black py-2 px-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Editar</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setDeleteTarget(ball)}
                    className="p-2 bg-white/5 hover:bg-rose-500/20 text-white/50 hover:text-rose-400 rounded-xl transition cursor-pointer"
                    title="Eliminar balón"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modal: Poner / Editar Balón a la Venta */}
      {isModalOpen && editingBall && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
          <div className="fixed inset-0" onClick={() => !isSaving && setIsModalOpen(false)} />

          <div className="relative w-full max-w-2xl bg-[#0e0e11] border border-white/15 rounded-3xl text-white overflow-hidden shadow-2xl z-10 max-h-[90vh] flex flex-col">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-white/10 bg-black flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-[#00e652] text-black rounded-lg font-black">
                  ⚽
                </div>
                <div>
                  <h3 className="text-base font-black uppercase text-white tracking-wider">
                    {editingBall.id ? 'Editar Balón a la Venta' : 'Poner Nuevo Balón a la Venta'}
                  </h3>
                  <p className="text-[11px] text-white/60">
                    Se publicará inmediatamente en la tienda y sincronizará en la nube
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => !isSaving && setIsModalOpen(false)}
                className="p-1.5 rounded-full bg-white/5 hover:bg-white/15 text-white/60 hover:text-white transition cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Form */}
            <form onSubmit={handleSaveBall} className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-5 text-xs">
              
              {/* Status Message */}
              {saveStatus && (
                <div
                  className={`p-3.5 rounded-xl text-xs font-black uppercase tracking-wider flex items-center gap-2 ${
                    saveStatus.type === 'success'
                      ? 'bg-emerald-950/80 border border-emerald-500/60 text-emerald-300'
                      : 'bg-rose-950/80 border border-rose-500/60 text-rose-300'
                  }`}
                >
                  {saveStatus.type === 'success' ? (
                    <Check className="w-4 h-4 text-emerald-400 stroke-[3]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-rose-400" />
                  )}
                  <span>{saveStatus.message}</span>
                </div>
              )}

              {/* Name */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-[#00e652] tracking-wider block">
                  Nombre Completo del Balón *
                </label>
                <input
                  type="text"
                  required
                  placeholder="ej: Adidas UCL Pro Champions League 2024/2025 Official Match Ball"
                  value={editingBall.name || ''}
                  onChange={(e) => setEditingBall({ ...editingBall, name: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-white font-bold focus:border-[#00e652] outline-none"
                />
              </div>

              {/* Brand, Tournament & Category */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/60 tracking-wider block">
                    Marca *
                  </label>
                  <select
                    value={editingBall.brand || 'Adidas'}
                    onChange={(e) => setEditingBall({ ...editingBall, brand: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-xs text-white font-bold focus:border-[#00e652] outline-none cursor-pointer"
                  >
                    {BALL_BRANDS.map((b) => (
                      <option key={b} value={b}>{b}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/60 tracking-wider block">
                    Torneo / Liga
                  </label>
                  <input
                    type="text"
                    placeholder="ej: UEFA Champions League"
                    value={editingBall.tournament || ''}
                    onChange={(e) => setEditingBall({ ...editingBall, tournament: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-xs text-white font-bold focus:border-[#00e652] outline-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/60 tracking-wider block">
                    Tipo / Categoría
                  </label>
                  <select
                    value={editingBall.category || 'Oficial Pro Match'}
                    onChange={(e) => setEditingBall({ ...editingBall, category: e.target.value as any })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-xs text-white font-bold focus:border-[#00e652] outline-none cursor-pointer"
                  >
                    {BALL_CATEGORIES_LIST.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Pricing Section (CRC & USD Conversion) */}
              <div className="p-4 bg-black/60 border border-white/10 rounded-2xl space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-black uppercase text-[#00e652] tracking-wider">
                    Precio de Venta en Costa Rica
                  </span>
                  <span className="text-[10px] text-white/50">
                    1 USD = ~{CRC_RATE} CRC
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 items-end">
                  <div className="space-y-1">
                    <label className="text-[10px] font-black uppercase text-white/70 block">
                      Precio Oficial (₡ CRC) *
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-white/50 font-black">₡</span>
                      <input
                        type="text"
                        required
                        placeholder="28000"
                        value={priceCrcInput}
                        onChange={(e) => setPriceCrcInput(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full bg-black border border-white/20 rounded-xl py-2 pl-8 pr-3 text-xs text-white font-black text-[#00e652] focus:border-[#00e652] outline-none"
                      />
                    </div>
                  </div>

                  <div className="p-2.5 bg-white/5 rounded-xl border border-white/10 text-xs">
                    <span className="text-[9px] text-white/50 uppercase font-black block">Equivalente en Dólares:</span>
                    <span className="text-sm font-black text-white">
                      ${((parseInt(priceCrcInput || '0', 10) || 0) / CRC_RATE).toFixed(2)} USD
                    </span>
                  </div>
                </div>

                {/* Offer Toggle */}
                <div className="pt-2 border-t border-white/5 space-y-2">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={hasOffer}
                      onChange={(e) => setHasOffer(e.target.checked)}
                      className="w-4 h-4 accent-[#00e652] cursor-pointer rounded"
                    />
                    <span className="text-xs font-black uppercase text-white/80">
                      ¿Mostrar precio anterior con descuento tachado? (Oferta)
                    </span>
                  </label>

                  {hasOffer && (
                    <div className="pl-6 space-y-1">
                      <label className="text-[10px] font-black uppercase text-white/50 block">
                        Precio Anterior / Sin Descuento (₡ CRC)
                      </label>
                      <input
                        type="text"
                        placeholder="ej: 35000"
                        value={originalPriceCrcInput}
                        onChange={(e) => setOriginalPriceCrcInput(e.target.value.replace(/[^0-9]/g, ''))}
                        className="w-full sm:w-1/2 bg-black border border-white/20 rounded-xl p-2 text-xs text-white/70 focus:border-[#00e652] outline-none font-bold"
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Sizes Available */}
              <div className="space-y-1.5">
                <label className="text-[10px] font-black uppercase text-[#00e652] tracking-wider block">
                  Tallas Disponibles del Balón *
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  {BALL_SIZES_CATALOG.map((sz) => {
                    const isChecked = (editingBall.sizesAvailable || []).includes(sz);
                    return (
                      <button
                        key={sz}
                        type="button"
                        onClick={() => handleToggleSize(sz)}
                        className={`p-2.5 rounded-xl border text-left font-black text-xs uppercase transition cursor-pointer flex items-center justify-between ${
                          isChecked
                            ? 'bg-[#00e652]/15 border-[#00e652] text-[#00e652]'
                            : 'bg-black border-white/15 text-white/60 hover:text-white hover:border-white/30'
                        }`}
                      >
                        <span>{sz}</span>
                        {isChecked && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Stock */}
              <div className="space-y-1">
                <label className="text-[10px] font-black uppercase text-white/70 tracking-wider block">
                  Stock / Cantidad de unidades disponibles en bodega *
                </label>
                <input
                  type="number"
                  min="0"
                  required
                  value={editingBall.stock ?? 10}
                  onChange={(e) => setEditingBall({ ...editingBall, stock: parseInt(e.target.value, 10) || 0 })}
                  className="w-full sm:w-1/3 bg-black border border-white/20 rounded-xl p-2.5 text-xs text-white font-mono font-bold focus:border-[#00e652] outline-none"
                />
              </div>

              {/* Image Input and Upload */}
              <div className="space-y-2 p-4 bg-black/60 border border-white/10 rounded-2xl">
                <label className="text-[10px] font-black uppercase text-[#00e652] tracking-wider block">
                  Fotografía del Balón
                </label>
                
                <div className="flex flex-col sm:flex-row gap-3 items-center">
                  <div className="w-24 h-24 bg-black rounded-xl border border-white/20 p-2 flex items-center justify-center shrink-0 overflow-hidden">
                    <img
                      src={editingBall.image || DEFAULT_BALL_FALLBACK_IMAGE}
                      alt="Previsualización"
                      onError={handleBallImageError}
                      className="w-full h-full object-contain filter drop-shadow-md"
                    />
                  </div>

                  <div className="flex-1 space-y-2 w-full">
                    <input
                      type="url"
                      placeholder="https://... URL de imagen del balón"
                      value={editingBall.image || ''}
                      onChange={(e) => setEditingBall({ ...editingBall, image: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-xs text-white font-medium focus:border-[#00e652] outline-none"
                    />

                    <div className="flex items-center gap-2">
                      <label className="bg-white/10 hover:bg-[#00e652] text-white hover:text-black font-black px-3 py-1.5 rounded-lg text-xs uppercase tracking-wider flex items-center gap-1.5 cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Subir Foto del Dispositivo</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleImageUpload}
                          className="hidden"
                        />
                      </label>
                      <span className="text-[10px] text-white/40 font-medium">
                        Optimiza y comprime automáticamente
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Description & Technical Specs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/60 tracking-wider block">
                    Descripción del Balón
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Detalles sobre el balón, agarre, competición, etc."
                    value={editingBall.description || ''}
                    onChange={(e) => setEditingBall({ ...editingBall, description: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-xs text-white font-medium focus:border-[#00e652] outline-none resize-none"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[10px] font-black uppercase text-white/60 tracking-wider block">
                    Material / Tecnología (opcional)
                  </label>
                  <textarea
                    rows={3}
                    placeholder="ej: Termosellado sin costuras, cámara de butilo, certificación FIFA Quality Pro."
                    value={editingBall.material || ''}
                    onChange={(e) => setEditingBall({ ...editingBall, material: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-xs text-white font-medium focus:border-[#00e652] outline-none resize-none"
                  />
                </div>
              </div>

              {/* Toggles: isNew / isPopular */}
              <div className="flex items-center gap-6 pt-2">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingBall.isNew)}
                    onChange={(e) => setEditingBall({ ...editingBall, isNew: e.target.checked })}
                    className="w-4 h-4 accent-[#00e652] cursor-pointer rounded"
                  />
                  <span className="text-xs font-black uppercase text-white/80 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-[#00e652]" /> Marcar como Novedad
                  </span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(editingBall.isPopular)}
                    onChange={(e) => setEditingBall({ ...editingBall, isPopular: e.target.checked })}
                    className="w-4 h-4 accent-[#00e652] cursor-pointer rounded"
                  />
                  <span className="text-xs font-black uppercase text-white/80 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400" /> Marcar como Más Vendido
                  </span>
                </label>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  disabled={isSaving}
                  className="px-4 py-2.5 bg-white/5 hover:bg-white/10 text-white/70 font-black rounded-xl text-xs uppercase cursor-pointer"
                >
                  Cancelar
                </button>

                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-6 py-2.5 bg-[#00e652] hover:bg-white text-black font-black rounded-xl text-xs uppercase tracking-wider flex items-center gap-2 shadow-xl hover:scale-102 transition cursor-pointer"
                >
                  {isSaving ? (
                    <span>Guardando en la Nube...</span>
                  ) : (
                    <>
                      <Check className="w-4 h-4 stroke-[3]" />
                      <span>{editingBall.id ? 'Guardar Cambios del Balón' : 'Publicar Balón a la Venta'}</span>
                    </>
                  )}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteTarget && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/15 rounded-3xl p-6 max-w-md w-full space-y-4 shadow-2xl">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto">
              <Trash2 className="w-6 h-6" />
            </div>

            <div className="text-center space-y-2">
              <h3 className="text-base font-black uppercase text-white">¿Eliminar este Balón?</h3>
              <p className="text-xs text-white/60">
                Estás a punto de retirar de la venta: <span className="text-white font-bold">{deleteTarget.name}</span>. Esta acción no se puede deshacer.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-black rounded-xl text-xs uppercase cursor-pointer"
              >
                Cancelar
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-5 py-2 bg-rose-600 hover:bg-rose-500 text-white font-black rounded-xl text-xs uppercase cursor-pointer"
              >
                Sí, Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
