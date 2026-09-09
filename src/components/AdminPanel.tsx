import React, { useState, useEffect } from 'react';
import { 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Package, 
  ShoppingBag, 
  DollarSign, 
  X, 
  ShieldCheck,
  Settings as SettingsIcon,
  Upload,
  Image as ImageIcon,
  Check,
  Mail,
  Phone,
  Tag,
  Sparkles,
  Save,
  Landmark,
  Building2,
  AlertTriangle,
  Star,
  Eye,
  ExternalLink,
  LayoutTemplate,
  Layers
} from 'lucide-react';
import { Jersey, Order, OrderStatus, League, JerseyType, JerseyVersion, GenderCategory, Size, StoreSettings, SportCategory, DiscountCode } from '../types';
import { formatPrice, getCleanCRC } from '../utils/storage';
import { handleImageError, compressImageFile } from '../utils/imageUtils';
import { INITIAL_LEAGUES, LEAGUE_FLAGS, SPORTS_LIST } from '../data/mockData';

interface AdminPanelProps {
  jerseys: Jersey[];
  orders: Order[];
  currency: 'CRC' | 'USD';
  settings: StoreSettings;
  discountCodes: DiscountCode[];
  onUpdateJerseys: (updated: Jersey[]) => void;
  onSaveJersey?: (jersey: Jersey) => Promise<void>;
  onDeleteJersey?: (jerseyId: string) => Promise<void>;
  onUpdateOrders: (updated: Order[]) => void;
  onUpdateSettings: (updated: StoreSettings) => void;
  onUpdateDiscountCodes: (updated: DiscountCode[]) => void;
  onClose: () => void;
  initialTab?: 'inventory' | 'hero' | 'settings' | 'orders' | 'stats' | 'coupons';
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  jerseys,
  orders,
  currency,
  settings,
  discountCodes,
  onUpdateJerseys,
  onSaveJersey,
  onDeleteJersey,
  onUpdateOrders,
  onUpdateSettings,
  onUpdateDiscountCodes,
  onClose,
  initialTab = 'inventory'
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('offside_admin_auth') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState('Bryanq1462@gmail.com');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'inventory' | 'hero' | 'settings' | 'orders' | 'stats' | 'coupons'>(initialTab);
  const [showJerseyPicker, setShowJerseyPicker] = useState(false);

  useEffect(() => {
    if (initialTab) {
      setActiveTab(initialTab);
    }
  }, [initialTab]);

  useEffect(() => {
    if (settings) {
      setLocalSettings(settings);
    }
  }, [settings]);

  // Coupon Creation & Editing State
  const [newCouponCode, setNewCouponCode] = useState('');
  const [newCouponPercent, setNewCouponPercent] = useState<number>(10);
  const [couponSuccessMsg, setCouponSuccessMsg] = useState(false);
  const [couponErrorMsg, setCouponErrorMsg] = useState('');
  const [editingCouponId, setEditingCouponId] = useState<string | null>(null);
  const [editCouponCode, setEditCouponCode] = useState('');
  const [editCouponPercent, setEditCouponPercent] = useState<number>(10);

  // Custom Deletion Confirmation Modal State
  const [deleteTarget, setDeleteTarget] = useState<{
    type: 'jersey' | 'coupon';
    id: string;
    title: string;
  } | null>(null);

  // Settings State
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Search in admin
  const [adminSearch, setAdminSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Jersey Add/Edit Modal
  const [editingJersey, setEditingJersey] = useState<Partial<Jersey> | null>(null);
  const [crcInputValue, setCrcInputValue] = useState<string>('');
  const [usdInputValue, setUsdInputValue] = useState<string>('');
  const [showOriginalPrice, setShowOriginalPrice] = useState<boolean>(false);
  const [originalCrcInputValue, setOriginalCrcInputValue] = useState<string>('');
  const [originalUsdInputValue, setOriginalUsdInputValue] = useState<string>('');
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);
  const [isSavingJersey, setIsSavingJersey] = useState(false);
  const [jerseySaveStatus, setJerseySaveStatus] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Selected Order Detail Modal
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  // Statistics
  const totalRevenueUSD = orders.reduce((sum, o) => sum + o.total, 0);
  const pendingOrders = orders.filter(o => o.status === 'Pendiente' || o.status === 'En Proceso').length;
  const lowStockCount = jerseys.filter(j => j.stock <= 5).length;

  // Filtered lists
  const filteredJerseys = jerseys.filter(j => 
    j.name.toLowerCase().includes(adminSearch.toLowerCase()) ||
    j.team.toLowerCase().includes(adminSearch.toLowerCase()) ||
    j.league.toLowerCase().includes(adminSearch.toLowerCase())
  );

  const filteredOrders = orders.filter(o => {
    const matchesSearch = 
      o.id.toLowerCase().includes(adminSearch.toLowerCase()) ||
      o.customer.fullName.toLowerCase().includes(adminSearch.toLowerCase()) ||
      o.customer.email.toLowerCase().includes(adminSearch.toLowerCase());
    
    const matchesStatus = orderStatusFilter === 'all' || o.status === orderStatusFilter;
    return matchesSearch && matchesStatus;
  });

  // Save Settings Handler
  const handleSaveSettingsSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateSettings(localSettings);
    setSettingsSavedMessage(true);
    setTimeout(() => setSettingsSavedMessage(false), 3000);
  };

  // Coupon Handlers
  const handleCreateCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    setCouponErrorMsg('');
    const cleanCode = newCouponCode.trim().toUpperCase();
    if (!cleanCode) return;
    const exists = discountCodes.some(d => d.code.toUpperCase() === cleanCode);
    if (exists) {
      setCouponErrorMsg('¡Ese código de descuento ya existe!');
      return;
    }
    const newCodeItem: DiscountCode = {
      id: `dc-${Date.now()}`,
      code: cleanCode,
      percentage: Number(newCouponPercent),
      active: true
    };
    onUpdateDiscountCodes([...discountCodes, newCodeItem]);
    setNewCouponCode('');
    setNewCouponPercent(10);
    setCouponSuccessMsg(true);
    setTimeout(() => setCouponSuccessMsg(false), 3000);
  };

  const handleToggleCouponActive = (id: string) => {
    const updated = discountCodes.map(d => d.id === id ? { ...d, active: !d.active } : d);
    onUpdateDiscountCodes(updated);
  };

  const handleDeleteCoupon = (id: string) => {
    const coupon = discountCodes.find(d => d.id === id);
    if (coupon) {
      setDeleteTarget({
        type: 'coupon',
        id: coupon.id,
        title: `Cupón ${coupon.code}`
      });
    }
  };

  const handleStartEditCoupon = (coupon: DiscountCode) => {
    setEditingCouponId(coupon.id);
    setEditCouponCode(coupon.code);
    setEditCouponPercent(coupon.percentage);
    setCouponErrorMsg('');
  };

  const handleSaveEditCoupon = (id: string) => {
    setCouponErrorMsg('');
    const cleanCode = editCouponCode.trim().toUpperCase();
    if (!cleanCode) return;
    const existsOther = discountCodes.some(d => d.id !== id && d.code.toUpperCase() === cleanCode);
    if (existsOther) {
      setCouponErrorMsg('¡Ya existe otro cupón con ese mismo código!');
      return;
    }
    const updated = discountCodes.map(d => d.id === id ? {
      ...d,
      code: cleanCode,
      percentage: Number(editCouponPercent) || 10
    } : d);
    onUpdateDiscountCodes(updated);
    setEditingCouponId(null);
  };

  const handleCancelEditCoupon = () => {
    setEditingCouponId(null);
    setCouponErrorMsg('');
  };

  // Image Upload Handler (reads local file from disk and compresses to lightweight Base64)
  const handleImageFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'image' | 'backImage' | 'gallery'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedUrl = await compressImageFile(file);
      if (compressedUrl) {
        if (field === 'gallery') {
          const currentImages = editingJersey?.images || [];
          setEditingJersey(prev => ({
            ...prev,
            images: [...currentImages, compressedUrl]
          }));
        } else {
          setEditingJersey(prev => ({
            ...prev,
            [field]: compressedUrl
          }));
        }
      }
    } catch (err) {
      console.error('Error compressing image', err);
    }
  };

  const handleFeaturedImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const compressedUrl = await compressImageFile(file);
      if (compressedUrl) {
        setLocalSettings(prev => ({
          ...prev,
          featuredImage: compressedUrl
        }));
      }
    } catch (err) {
      console.error('Error compressing featured image', err);
    }
  };

  // Save/Update Jersey Handler
  const handleSaveJersey = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJersey || !editingJersey.name?.trim() || !editingJersey.team?.trim()) {
      setJerseySaveStatus({ type: 'error', message: 'Por favor ingresa al menos el Nombre de la camiseta y el Equipo.' });
      return;
    }

    setIsSavingJersey(true);
    setJerseySaveStatus(null);

    const enteredCrc = crcInputValue ? Number(crcInputValue) : (typeof editingJersey.price === 'number' && !isNaN(editingJersey.price) ? editingJersey.price : 25000);
    const finalPriceCRC = enteredCrc >= 500 ? enteredCrc : Math.round(enteredCrc * 520);
    const stockNum = typeof editingJersey.stock === 'number' && !isNaN(editingJersey.stock) ? editingJersey.stock : (Number(editingJersey.stock) ?? 15);

    // Strikethrough original price in Colones: only set if user actively enabled and provided it
    let finalOriginalPriceCRC: number | undefined = undefined;
    if (showOriginalPrice && originalCrcInputValue && Number(originalCrcInputValue) > 0) {
      finalOriginalPriceCRC = Number(originalCrcInputValue);
    }

    try {
      if (editingJersey.id) {
        // Edit existing jersey
        const updatedJersey: Jersey = {
          ...editingJersey,
          id: editingJersey.id,
          name: editingJersey.name.trim(),
          team: editingJersey.team.trim(),
          league: (editingJersey.league as League) || 'Liga Promerica (CR)',
          version: editingJersey.version || 'Versión Jugador (Player Issue)',
          genderCategory: editingJersey.genderCategory || 'Unisex (Adulto)',
          price: finalPriceCRC,
          priceCRC: finalPriceCRC,
          yearSeason: editingJersey.yearSeason || '2025/2026',
          type: (editingJersey.type as JerseyType) || 'Local',
          image: editingJersey.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
          images: editingJersey.images || [],
          sizesAvailable: editingJersey.sizesAvailable || ['S', 'M', 'L', 'XL', 'XXL'],
          description: editingJersey.description || 'Camiseta oficial versión jugador con tela de alta definición.',
          fabricInfo: editingJersey.fabricInfo || '100% Poliéster Reciclado Dri-FIT ADV',
          rating: editingJersey.rating || 5.0,
          reviewsCount: editingJersey.reviewsCount || 1,
          stock: stockNum,
          badgeTags: editingJersey.badgeTags || ['Nuevo Lanzamiento']
        };

        if (finalOriginalPriceCRC && finalOriginalPriceCRC > 0) {
          updatedJersey.originalPrice = finalOriginalPriceCRC;
          updatedJersey.originalPriceCRC = finalOriginalPriceCRC;
        } else {
          delete updatedJersey.originalPrice;
          delete updatedJersey.originalPriceCRC;
        }

        if (editingJersey.backImage && editingJersey.backImage.trim()) {
          updatedJersey.backImage = editingJersey.backImage;
        } else {
          delete updatedJersey.backImage;
        }

        if (onSaveJersey) {
          await onSaveJersey(updatedJersey);
        } else {
          const updated = jerseys.map(j => j.id === updatedJersey.id ? updatedJersey : j);
          onUpdateJerseys(updated);
        }
      } else {
        // Create new jersey
        const newJerseyId = `off-custom-${Date.now()}`;
        const newJersey: Jersey = {
          id: newJerseyId,
          name: editingJersey.name.trim() || 'Nueva Camiseta',
          team: editingJersey.team.trim() || 'Equipo',
          league: (editingJersey.league as League) || 'Liga Promerica (CR)',
          version: editingJersey.version || 'Versión Jugador (Player Issue)',
          genderCategory: editingJersey.genderCategory || 'Unisex (Adulto)',
          price: finalPriceCRC,
          priceCRC: finalPriceCRC,
          yearSeason: editingJersey.yearSeason || '2025/2026',
          type: (editingJersey.type as JerseyType) || 'Local',
          image: editingJersey.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
          images: editingJersey.images || [],
          sizesAvailable: editingJersey.sizesAvailable || ['S', 'M', 'L', 'XL', 'XXL'],
          description: editingJersey.description || 'Camiseta oficial versión jugador con tela de alta definición.',
          fabricInfo: editingJersey.fabricInfo || '100% Poliéster Reciclado Dri-FIT ADV',
          rating: 5.0,
          reviewsCount: 1,
          stock: stockNum,
          isNew: true,
          badgeTags: editingJersey.badgeTags || ['Nuevo Lanzamiento']
        };

        if (finalOriginalPriceCRC && finalOriginalPriceCRC > 0) {
          newJersey.originalPrice = finalOriginalPriceCRC;
          newJersey.originalPriceCRC = finalOriginalPriceCRC;
        }

        if (editingJersey.backImage && editingJersey.backImage.trim()) {
          newJersey.backImage = editingJersey.backImage;
        }

        if (onSaveJersey) {
          await onSaveJersey(newJersey);
        } else {
          onUpdateJerseys([newJersey, ...jerseys]);
        }
      }

      setJerseySaveStatus({ type: 'success', message: '¡Camiseta guardada permanentemente en la nube y catálogo!' });
      setTimeout(() => {
        setIsSavingJersey(false);
        setEditingJersey(null);
        setIsNewModalOpen(false);
        setJerseySaveStatus(null);
      }, 700);
    } catch (err: any) {
      console.error('Error saving jersey:', err);
      setIsSavingJersey(false);
      setJerseySaveStatus({ type: 'error', message: `Error al guardar: ${err.message || 'Verifica la conexión con Firestore'}` });
    }
  };

  // Delete Jersey
  const handleDeleteJersey = (id: string) => {
    const jersey = jerseys.find(j => j.id === id);
    if (jersey) {
      setDeleteTarget({
        type: 'jersey',
        id: jersey.id,
        title: jersey.name
      });
    }
  };

  const confirmDeleteAction = async () => {
    if (!deleteTarget) return;
    if (deleteTarget.type === 'jersey') {
      if (onDeleteJersey) {
        await onDeleteJersey(deleteTarget.id);
      } else {
        onUpdateJerseys(jerseys.filter(j => j.id !== deleteTarget.id));
      }
    } else if (deleteTarget.type === 'coupon') {
      onUpdateDiscountCodes(discountCodes.filter(d => d.id !== deleteTarget.id));
    }
    setDeleteTarget(null);
  };

  // Change Order Status
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    onUpdateOrders(updated);
  };
  const handleAdminLogin = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setLoginError('');
    localStorage.setItem('offside_admin_auth', 'true');
    setIsAuthenticated(true);
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl p-6 sm:p-8 text-white animate-in zoom-in-95">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-[#00e652] text-white hover:text-black transition cursor-pointer rounded-full"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 bg-[#00e652] text-black mx-auto flex items-center justify-center rounded-2xl skew-x-[-10deg] shadow-lg">
              <ShieldCheck className="w-8 h-8 stroke-[2.5] skew-x-[10deg]" />
            </div>
            <div>
              <span className="bg-[#00e652] text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-widest rounded-sm">
                ACCESO AUTORIZADO
              </span>
              <h2 className="text-xl font-black italic uppercase text-white mt-2">PANEL ADMINISTRATIVO</h2>
              <p className="text-xs text-white/60 mt-1">Acceso de edición total para Bryan (OFFSIDE Sports)</p>
            </div>
          </div>

          <div className="space-y-4">
            {/* Direct Instant Access Button */}
            <button
              type="button"
              onClick={() => handleAdminLogin()}
              className="w-full bg-[#00e652] hover:bg-white text-black font-black py-4 px-4 rounded-xl text-xs uppercase tracking-widest transition cursor-pointer shadow-xl flex items-center justify-center gap-2 skew-x-[-10deg]"
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>⚡ ACCEDER DIRECTAMENTE (ADMINISTRADOR)</span>
              </div>
            </button>

            <div className="flex items-center gap-3 my-2">
              <div className="h-px bg-white/10 flex-1" />
              <span className="text-[10px] text-white/40 font-bold uppercase">o ingresa tus datos</span>
              <div className="h-px bg-white/10 flex-1" />
            </div>

            <form onSubmit={handleAdminLogin} className="space-y-3">
              <div>
                <label className="block text-[10px] font-black text-[#00e652] uppercase tracking-widest mb-1">
                  CORREO DE ADMINISTRADOR
                </label>
                <input
                  type="email"
                  placeholder="Bryanq1462@gmail.com"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold placeholder-white/30 focus:border-[#00e652] outline-none"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#00e652] uppercase tracking-widest mb-1">
                  CONTRASEÑA ADMINISTRATIVA (OPCIONAL)
                </label>
                <input
                  type="password"
                  placeholder="••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-2.5 text-xs text-white font-bold placeholder-white/30 focus:border-[#00e652] outline-none"
                />
              </div>

              {loginError && (
                <p className="text-xs font-bold text-rose-400 bg-rose-950/50 border border-rose-500/30 p-2.5 rounded-xl text-center">
                  {loginError}
                </p>
              )}

              <button
                type="submit"
                className="w-full bg-white/10 hover:bg-white/20 text-white font-black py-3 rounded-xl text-xs uppercase tracking-widest transition cursor-pointer border border-white/20"
              >
                INGRESAR CON CREDENCIALES
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6">
      <div className="relative w-full max-w-6xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[92vh] text-white overflow-hidden animate-in zoom-in-95">
        
        {/* Header */}
        <div className="p-5 border-b border-white/10 bg-black flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-[#00e652] text-black skew-x-[-10deg]">
              <ShieldCheck className="w-6 h-6 stroke-[2.5] skew-x-[10deg]" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-xl font-black italic uppercase text-white tracking-wider">PANEL ADMINISTRATIVO</h2>
                <span className="bg-[#00e652] text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-widest">
                  OFFSIDE ADMIN
                </span>
                <span className="inline-flex items-center gap-1.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-black uppercase px-2.5 py-0.5 rounded-full tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
                  Cloud Firestore Activo
                </span>
              </div>
              <p className="text-xs text-white/60 font-semibold mt-0.5">Control total de inventario, pedidos y sincronización en la nube en tiempo real</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                localStorage.removeItem('offside_admin_auth');
                setIsAuthenticated(false);
              }}
              className="text-[11px] text-white/50 hover:text-rose-400 font-bold uppercase transition px-3 py-1.5 rounded-lg border border-white/10 hover:border-rose-500/40"
              title="Cerrar sesión de administrador"
            >
              Cerrar Sesión
            </button>
            <button
              onClick={onClose}
              className="p-2 bg-white/10 hover:bg-[#00e652] text-white hover:text-black transition cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="px-3 sm:px-6 py-2.5 sm:py-3 bg-[#121212] border-b border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-3 text-xs font-black uppercase tracking-wider">
          <div className="flex items-center gap-2 overflow-x-auto w-full md:w-auto pb-1.5 md:pb-0 scrollbar-thin scrollbar-thumb-[#00e652]/40 touch-pan-x">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`shrink-0 px-3 sm:px-4 py-2 flex items-center gap-2 transition cursor-pointer skew-x-[-10deg] ${
                activeTab === 'inventory'
                  ? 'bg-[#00e652] text-black font-black'
                  : 'bg-black text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="skew-x-[10deg] flex items-center gap-1.5 sm:gap-2">
                <Package className="w-4 h-4 stroke-[2.5]" />
                <span className="whitespace-nowrap">INVENTARIO ({jerseys.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('hero')}
              className={`shrink-0 px-3 sm:px-4 py-2 flex items-center gap-2 transition cursor-pointer skew-x-[-10deg] ${
                activeTab === 'hero'
                  ? 'bg-[#00e652] text-black font-black'
                  : 'bg-black text-[#00e652] hover:bg-white/10 border border-[#00e652]/40'
              }`}
            >
              <div className="skew-x-[10deg] flex items-center gap-1.5 sm:gap-2">
                <Sparkles className="w-4 h-4 stroke-[2.5]" />
                <span className="whitespace-nowrap">PORTADA & BANNER HERO</span>
                <span className="bg-[#00e652] text-black text-[9px] px-1 py-0 font-black">
                  FOTO & TEXTO
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`shrink-0 px-3 sm:px-4 py-2 flex items-center gap-2 transition cursor-pointer skew-x-[-10deg] ${
                activeTab === 'settings'
                  ? 'bg-[#00e652] text-black font-black'
                  : 'bg-black text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="skew-x-[10deg] flex items-center gap-1.5 sm:gap-2">
                <SettingsIcon className="w-4 h-4 stroke-[2.5]" />
                <span className="whitespace-nowrap">PRECIOS & CONFIGURACIÓN</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`shrink-0 px-3 sm:px-4 py-2 flex items-center gap-2 transition cursor-pointer skew-x-[-10deg] ${
                activeTab === 'orders'
                  ? 'bg-[#00e652] text-black font-black'
                  : 'bg-black text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="skew-x-[10deg] flex items-center gap-1.5 sm:gap-2">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span className="whitespace-nowrap">PEDIDOS ({orders.length})</span>
                {pendingOrders > 0 && (
                  <span className="bg-black text-[#00e652] border border-[#00e652] text-[10px] px-1.5 py-0.2 font-black">
                    {pendingOrders}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('coupons')}
              className={`shrink-0 px-3 sm:px-4 py-2 flex items-center gap-2 transition cursor-pointer skew-x-[-10deg] ${
                activeTab === 'coupons'
                  ? 'bg-[#00e652] text-black font-black'
                  : 'bg-black text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="skew-x-[10deg] flex items-center gap-1.5 sm:gap-2">
                <Tag className="w-4 h-4 stroke-[2.5]" />
                <span className="whitespace-nowrap">CUPONES ({discountCodes.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`shrink-0 px-3 sm:px-4 py-2 flex items-center gap-2 transition cursor-pointer skew-x-[-10deg] ${
                activeTab === 'stats'
                  ? 'bg-[#00e652] text-black font-black'
                  : 'bg-black text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="skew-x-[10deg] flex items-center gap-1.5 sm:gap-2">
                <DollarSign className="w-4 h-4 stroke-[2.5]" />
                <span className="whitespace-nowrap">ESTADÍSTICAS</span>
              </div>
            </button>
          </div>

          {activeTab === 'inventory' && (
            <button
              onClick={() => {
                setEditingJersey({
                  name: '',
                  team: '',
                  league: 'Liga Promerica (CR)',
                  price: 25000,
                  priceCRC: 25000,
                  originalPrice: undefined,
                  originalPriceCRC: undefined,
                  stock: 15,
                  yearSeason: '2024/2025',
                  type: 'Local',
                  sizesAvailable: ['S', 'M', 'L', 'XL', 'XXL'],
                  image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800'
                });
                setCrcInputValue('25000');
                setUsdInputValue('');
                setShowOriginalPrice(false);
                setOriginalCrcInputValue('');
                setOriginalUsdInputValue('');
                setIsNewModalOpen(true);
              }}
              className="shrink-0 bg-[#00e652] hover:bg-white text-black px-4 py-2 flex items-center justify-center gap-2 font-black cursor-pointer shadow-xl skew-x-[-10deg] text-xs"
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span className="whitespace-nowrap">NUEVA CAMISETA</span>
              </div>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-6 space-y-4 sm:space-y-6">
          
          {/* TAB 1: INVENTORY MANAGEMENT */}
          {activeTab === 'inventory' && (
            <div className="space-y-4">
              {/* Search Bar */}
              <div className="relative max-w-md">
                <input
                  type="text"
                  placeholder="Buscar en inventario por equipo o liga..."
                  value={adminSearch}
                  onChange={(e) => setAdminSearch(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-white/40 focus:border-[#00e652]"
                />
                <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 top-2.5" />
              </div>

              {/* Inventory Table */}
              <div className="bg-black border border-white/10 overflow-x-auto shadow-inner">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121212] border-b border-white/10 text-[#00e652] uppercase font-black text-[10px] tracking-widest">
                    <tr>
                      <th className="p-3">CAMISETA</th>
                      <th className="p-3">LIGA / EQUIPO</th>
                      <th className="p-3">PRECIO</th>
                      <th className="p-3">STOCK</th>
                      <th className="p-3 text-right">ACCIONES</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredJerseys.map((jersey) => (
                      <tr key={jersey.id} className="hover:bg-white/5 transition">
                        <td className="p-3 flex items-center gap-3">
                          <img
                            src={jersey.image}
                            alt={jersey.name}
                            referrerPolicy="no-referrer"
                            onError={handleImageError}
                            className="w-10 h-12 object-cover bg-black border border-white/20"
                          />
                          <div>
                            <p className="font-black italic uppercase text-white line-clamp-1">{jersey.name}</p>
                            <p className="text-[10px] text-[#00e652] font-mono">{jersey.type} • {jersey.yearSeason}</p>
                          </div>
                        </td>

                        <td className="p-3">
                          <p className="font-bold text-white">{jersey.team}</p>
                          <p className="text-[10px] text-white/60">{jersey.league}</p>
                        </td>

                        <td className="p-3">
                          <div className="font-black text-[#00e652] text-sm italic">
                            {formatPrice(jersey.price, currency, jersey.priceCRC)}
                          </div>
                          {jersey.originalPrice && jersey.originalPrice > jersey.price ? (
                            <div className="text-[10px] text-white/40 line-through font-bold">
                              {formatPrice(jersey.originalPrice, currency, jersey.originalPriceCRC)}
                            </div>
                          ) : null}
                        </td>

                        <td className="p-3">
                          {jersey.stock > 0 ? (
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                              jersey.stock <= 5 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-[#00e652]/20 text-[#00e652] border border-[#00e652]/40'
                            }`}>
                              {jersey.stock} UNDS.
                            </span>
                          ) : (
                            <span className="bg-rose-500/20 text-rose-400 border border-rose-500/40 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider">
                              AGOTADO
                            </span>
                          )}
                        </td>

                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => {
                              setEditingJersey(jersey);
                              const crcVal = jersey.priceCRC || (jersey.price && jersey.price >= 500 ? jersey.price : (jersey.price ? Math.round(jersey.price * 520) : 25000));
                              setCrcInputValue(crcVal ? String(crcVal) : '');
                              setUsdInputValue('');

                              // Initialize original/strikethrough price
                              const hasOrig = !!(jersey.originalPrice && jersey.originalPrice > (jersey.price || 0));
                              setShowOriginalPrice(hasOrig);
                              if (hasOrig && jersey.originalPrice) {
                                const origCrc = jersey.originalPriceCRC || (jersey.originalPrice >= 500 ? jersey.originalPrice : Math.round(jersey.originalPrice * 520));
                                setOriginalCrcInputValue(origCrc ? String(origCrc) : '');
                              } else {
                                setOriginalCrcInputValue('');
                              }
                              setOriginalUsdInputValue('');
                              setIsNewModalOpen(true);
                            }}
                            className="p-1.5 bg-white/10 hover:bg-[#00e652] text-white hover:text-black transition cursor-pointer"
                            title="Editar Camiseta"
                          >
                            <Edit className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                          <button
                            onClick={() => handleDeleteJersey(jersey.id)}
                            className="p-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white transition cursor-pointer"
                            title="Eliminar Camiseta"
                          >
                            <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB: HERO & BANNER CUSTOMIZATION */}
          {activeTab === 'hero' && (
            <div className="max-w-6xl mx-auto space-y-6">
              {/* Header Banner */}
              <div className="bg-black border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/10 pb-4">
                  <div>
                    <div className="inline-flex items-center gap-2 bg-[#00e652]/10 border border-[#00e652]/30 px-3 py-1 text-[11px] font-black uppercase text-[#00e652] tracking-wider mb-2">
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>PORTADA & BANNER HERO (EDICIÓN EN VIVO)</span>
                    </div>
                    <h3 className="text-2xl sm:text-3xl font-black italic uppercase text-white tracking-wider">
                      EDITAR CAMISETA DESTACADA Y TEXTOS DE PORTADA
                    </h3>
                    <p className="text-xs text-white/60 font-medium mt-1 max-w-2xl">
                      Reemplaza la fotografía de la camiseta destacada que se muestra en la portada (sustituyendo cualquier imagen de prueba), personaliza el título, la liga, la insignia superior y todos los textos del banner principal.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleSaveSettingsSubmit}
                    className="bg-[#00e652] hover:bg-white text-black font-black uppercase px-6 py-3 text-xs tracking-widest skew-x-[-10deg] transition cursor-pointer shadow-xl flex items-center gap-2"
                  >
                    <div className="skew-x-[10deg] flex items-center gap-2">
                      <Save className="w-4 h-4 stroke-[2.5]" />
                      <span>GUARDAR CAMBIOS EN VIVO</span>
                    </div>
                  </button>
                </div>

                {settingsSavedMessage && (
                  <div className="bg-[#00e652] text-black p-4 font-black uppercase text-xs flex items-center justify-between shadow-xl rounded-2xl animate-bounce">
                    <div className="flex items-center gap-2">
                      <Check className="w-5 h-5 stroke-[2.5]" />
                      <span>¡PORTADA Y CAMISETA DESTACADA GUARDADAS Y SINCRONIZADAS EN LA NUBE!</span>
                    </div>
                  </div>
                )}
              </div>

              {/* 2-Column Layout: Controls on Left, Live Mockup on Right */}
              <form onSubmit={handleSaveSettingsSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                
                {/* Form Controls (Left Column) */}
                <div className="lg:col-span-7 space-y-6">
                  
                  {/* Card 1: FOTO DE LA CAMISETA DESTACADA */}
                  <div className="bg-black border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <h4 className="text-sm font-black italic uppercase text-[#00e652] flex items-center gap-2">
                        <ImageIcon className="w-4 h-4 stroke-[2.5]" />
                        <span>1. FOTO DE LA CAMISETA DESTACADA (CARD DERECHO)</span>
                      </h4>
                      <span className="text-[10px] text-white/50 uppercase font-bold">Tarjeta principal</span>
                    </div>

                    {/* Quick Inventory Selector Button */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 space-y-3">
                      <div className="flex items-center justify-between flex-wrap gap-2">
                        <div>
                          <p className="text-xs font-black text-white uppercase">¿Quieres usar una camiseta de tu catálogo?</p>
                          <p className="text-[10px] text-white/50">Selecciona con 1 clic para cargar automáticamente su foto, nombre y liga</p>
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowJerseyPicker(!showJerseyPicker)}
                          className="bg-[#00e652]/10 hover:bg-[#00e652] text-[#00e652] hover:text-black border border-[#00e652]/40 text-xs font-black uppercase px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                        >
                          <Package className="w-3.5 h-3.5" />
                          <span>{showJerseyPicker ? 'Cerrar Catálogo' : `Elegir de mi Inventario (${jerseys.length})`}</span>
                        </button>
                      </div>

                      {/* Dropdown / Grid of Jerseys */}
                      {showJerseyPicker && (
                        <div className="mt-3 pt-3 border-t border-white/10 max-h-60 overflow-y-auto space-y-2 pr-1 scrollbar-thin scrollbar-thumb-[#00e652]/40">
                          <p className="text-[10px] text-[#00e652] font-black uppercase tracking-wider">Haz clic sobre cualquier camiseta para aplicarla al banner:</p>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {jerseys.map((j) => (
                              <button
                                key={j.id}
                                type="button"
                                onClick={() => {
                                  setLocalSettings(prev => ({
                                    ...prev,
                                    featuredImage: j.image,
                                    featuredTitle: j.name,
                                    featuredLeague: j.league
                                  }));
                                  setShowJerseyPicker(false);
                                }}
                                className="flex items-center gap-2.5 p-2 bg-black hover:bg-[#00e652]/20 border border-white/10 hover:border-[#00e652] rounded-xl text-left transition group cursor-pointer"
                              >
                                <img
                                  src={j.image}
                                  alt={j.name}
                                  className="w-10 h-10 object-cover rounded-lg bg-neutral-900 shrink-0"
                                  onError={handleImageError}
                                />
                                <div className="min-w-0 flex-1">
                                  <p className="text-xs font-black text-white group-hover:text-[#00e652] truncate">{j.name}</p>
                                  <p className="text-[10px] text-white/50 truncate">{j.team} • {j.league}</p>
                                </div>
                              </button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* URL Direct Input */}
                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase text-white tracking-wider">
                        URL Directa de la Imagen de la Camiseta:
                      </label>
                      <input
                        type="url"
                        required
                        value={localSettings.featuredImage || ''}
                        onChange={(e) => setLocalSettings({ ...localSettings, featuredImage: e.target.value })}
                        className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-white font-mono focus:border-[#00e652] outline-none"
                        placeholder="https://..."
                      />
                      <p className="text-[10px] text-white/40">
                        Pega aquí el enlace de la imagen oficial de la camiseta que deseas exhibir.
                      </p>
                    </div>

                    {/* Upload from device button */}
                    <div className="flex flex-wrap items-center gap-3 pt-1">
                      <label className="bg-white/10 hover:bg-white/20 border border-white/20 text-white font-bold text-xs px-3.5 py-2 rounded-xl cursor-pointer transition flex items-center gap-2">
                        <Upload className="w-3.5 h-3.5 text-[#00e652]" />
                        <span>Subir Foto desde mi Dispositivo (PC / Móvil)</span>
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handleFeaturedImageUpload}
                          className="hidden"
                        />
                      </label>

                      {/* Quick presets */}
                      <span className="text-[10px] text-white/40 font-bold uppercase">o prueba presets:</span>
                      <button
                        type="button"
                        onClick={() => setLocalSettings(prev => ({
                          ...prev,
                          featuredImage: 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=800',
                          featuredTitle: 'Real Madrid Local 2024/25',
                          featuredLeague: 'LaLiga EA Sports'
                        }))}
                        className="text-[10px] font-black bg-white/5 hover:bg-white/15 px-2.5 py-1 rounded border border-white/10 text-white transition"
                      >
                        Real Madrid
                      </button>
                      <button
                        type="button"
                        onClick={() => setLocalSettings(prev => ({
                          ...prev,
                          featuredImage: 'https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?auto=format&fit=crop&q=80&w=800',
                          featuredTitle: 'FC Barcelona Local 2024/25',
                          featuredLeague: 'LaLiga EA Sports'
                        }))}
                        className="text-[10px] font-black bg-white/5 hover:bg-white/15 px-2.5 py-1 rounded border border-white/10 text-white transition"
                      >
                        Barcelona
                      </button>
                    </div>
                  </div>

                  {/* Card 2: TEXTOS DE LA TARJETA DESTACADA */}
                  <div className="bg-black border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="border-b border-white/10 pb-3">
                      <h4 className="text-sm font-black italic uppercase text-[#00e652] flex items-center gap-2">
                        <Tag className="w-4 h-4 stroke-[2.5]" />
                        <span>2. TEXTOS E INSIGNIAS DE LA TARJETA DESTACADA</span>
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          Insignia Superior (Badge Verde):
                        </label>
                        <input
                          type="text"
                          value={localSettings.featuredBadge || 'EDICIÓN DESTACADA'}
                          onChange={(e) => setLocalSettings({ ...localSettings, featuredBadge: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-white font-bold focus:border-[#00e652] outline-none"
                          placeholder="EDICIÓN DESTACADA"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          Liga / Competición (Texto Verde):
                        </label>
                        <input
                          type="text"
                          value={localSettings.featuredLeague || 'LaLiga EA Sports'}
                          onChange={(e) => setLocalSettings({ ...localSettings, featuredLeague: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-[#00e652] font-black focus:border-[#00e652] outline-none"
                          placeholder="LaLiga EA Sports"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          Título de la Camiseta Destacada:
                        </label>
                        <input
                          type="text"
                          value={localSettings.featuredTitle || 'Real Madrid Local 2024/25'}
                          onChange={(e) => setLocalSettings({ ...localSettings, featuredTitle: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-white font-black uppercase italic focus:border-[#00e652] outline-none"
                          placeholder="Real Madrid Local 2024/25"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          Opiniones / Calificación:
                        </label>
                        <input
                          type="text"
                          value={localSettings.featuredRatingText || '(42 opiniones verificadas)'}
                          onChange={(e) => setLocalSettings({ ...localSettings, featuredRatingText: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-white font-bold focus:border-[#00e652] outline-none"
                          placeholder="(42 opiniones verificadas)"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          Texto Promocional (Estampado):
                        </label>
                        <input
                          type="text"
                          value={localSettings.featuredPromoText || 'Estampado Nombre & Dorsal'}
                          onChange={(e) => setLocalSettings({ ...localSettings, featuredPromoText: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-white font-bold focus:border-[#00e652] outline-none"
                          placeholder="Estampado Nombre & Dorsal"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          Insignia de Promoción (Regalo):
                        </label>
                        <input
                          type="text"
                          value={localSettings.featuredPromoBadge || '¡GRATIS! 🎁'}
                          onChange={(e) => setLocalSettings({ ...localSettings, featuredPromoBadge: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-[#00e652] font-black focus:border-[#00e652] outline-none"
                          placeholder="¡GRATIS! 🎁"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 3: TEXTOS DEL BANNER PRINCIPAL (HERO) */}
                  <div className="bg-black border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="border-b border-white/10 pb-3">
                      <h4 className="text-sm font-black italic uppercase text-[#00e652] flex items-center gap-2">
                        <Sparkles className="w-4 h-4 stroke-[2.5]" />
                        <span>3. TÍTULO Y TEXTOS DEL BANNER PRINCIPAL (HERO)</span>
                      </h4>
                    </div>

                    <div className="space-y-3">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          Etiqueta Superior Animada (Tagline):
                        </label>
                        <input
                          type="text"
                          value={localSettings.heroTagline || 'NEW ARRIVAL / TEMPORADA 24-25'}
                          onChange={(e) => setLocalSettings({ ...localSettings, heroTagline: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-[#00e652] font-black focus:border-[#00e652] outline-none"
                          placeholder="NEW ARRIVAL / TEMPORADA 24-25"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          Título Principal en Tipografía Deportiva:
                        </label>
                        <input
                          type="text"
                          value={localSettings.heroMainTitle || 'PASIÓN EN CADA PIEL'}
                          onChange={(e) => setLocalSettings({ ...localSettings, heroMainTitle: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-sm text-white font-black italic uppercase focus:border-[#00e652] outline-none"
                          placeholder="PASIÓN EN CADA PIEL"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          Subtítulo Descriptivo:
                        </label>
                        <textarea
                          rows={3}
                          value={localSettings.heroSubtitle || ''}
                          onChange={(e) => setLocalSettings({ ...localSettings, heroSubtitle: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-white font-medium focus:border-[#00e652] outline-none"
                          placeholder="Consigue las camisetas oficiales de tus equipos favoritos..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Card 4: REDES SOCIALES & CONTACTO */}
                  <div className="bg-black border border-white/10 rounded-3xl p-6 shadow-xl space-y-4">
                    <div className="border-b border-white/10 pb-3">
                      <h4 className="text-sm font-black italic uppercase text-[#00e652] flex items-center gap-2">
                        <Phone className="w-4 h-4 stroke-[2.5]" />
                        <span>4. REDES SOCIALES Y CONTACTO (BOTONES DE LA PORTADA)</span>
                      </h4>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          Usuario / Handle Instagram:
                        </label>
                        <input
                          type="text"
                          value={localSettings.instagramHandle || '@OFFSIDE_SPORTS22'}
                          onChange={(e) => setLocalSettings({ ...localSettings, instagramHandle: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-white font-bold focus:border-[#00e652] outline-none"
                          placeholder="@OFFSIDE_SPORTS22"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          WhatsApp de Atención Directa:
                        </label>
                        <input
                          type="text"
                          value={localSettings.whatsappPhone || '+506 8559 5192'}
                          onChange={(e) => setLocalSettings({ ...localSettings, whatsappPhone: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-white font-bold focus:border-[#00e652] outline-none"
                          placeholder="+506 8559 5192"
                        />
                      </div>

                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="block text-[11px] font-black uppercase text-white tracking-wider">
                          Enlace URL de Instagram:
                        </label>
                        <input
                          type="url"
                          value={localSettings.instagramUrl || ''}
                          onChange={(e) => setLocalSettings({ ...localSettings, instagramUrl: e.target.value })}
                          className="w-full bg-[#121212] border border-white/20 rounded-xl p-3 text-xs text-white font-mono focus:border-[#00e652] outline-none"
                          placeholder="https://www.instagram.com/..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Save Button */}
                  <div className="pt-2 flex justify-end gap-3">
                    <button
                      type="submit"
                      className="w-full sm:w-auto bg-[#00e652] hover:bg-white text-black font-black uppercase px-8 py-4 text-xs tracking-widest skew-x-[-10deg] transition cursor-pointer shadow-2xl flex items-center justify-center gap-2"
                    >
                      <div className="skew-x-[10deg] flex items-center gap-2">
                        <Save className="w-5 h-5 stroke-[2.5]" />
                        <span>GUARDAR CAMBIOS EN LA NUBE (FIRESTORE)</span>
                      </div>
                    </button>
                  </div>
                </div>

                {/* Live Mockup Preview (Right Column) */}
                <div className="lg:col-span-5 sticky top-4 space-y-4">
                  <div className="bg-black border border-white/15 rounded-3xl p-5 shadow-2xl space-y-4">
                    <div className="flex items-center justify-between border-b border-white/10 pb-3">
                      <div className="flex items-center gap-2">
                        <Eye className="w-4 h-4 text-[#00e652]" />
                        <span className="text-xs font-black uppercase tracking-wider text-white">VISTA PREVIA EN VIVO</span>
                      </div>
                      <span className="bg-[#00e652]/10 border border-[#00e652]/40 text-[#00e652] text-[10px] font-black px-2 py-0.5 uppercase tracking-wider rounded">
                        Mockup Portada
                      </span>
                    </div>

                    {/* Exact Hero Card replica */}
                    <div className="relative group max-w-sm mx-auto">
                      <div className="absolute -inset-1 bg-gradient-to-r from-[#00e652] to-emerald-600 rounded-3xl blur opacity-30"></div>
                      
                      <div className="relative bg-[#121212] border border-white/20 rounded-3xl overflow-hidden shadow-2xl">
                        {/* Top Badge */}
                        <div className="absolute top-4 right-4 z-20">
                          <span className="bg-[#00e652] text-black font-black text-[10px] sm:text-xs px-3 py-1 uppercase tracking-widest shadow-lg rounded-sm">
                            {localSettings.featuredBadge || 'EDICIÓN DESTACADA'}
                          </span>
                        </div>

                        {/* Image */}
                        <div className="aspect-[4/5] sm:aspect-square relative overflow-hidden bg-neutral-900">
                          <img
                            src={localSettings.featuredImage || 'https://images.unsplash.com/photo-1518091043644-c1d4457512c6?auto=format&fit=crop&q=80&w=800'}
                            alt={localSettings.featuredTitle || 'Camiseta Destacada'}
                            className="w-full h-full object-cover"
                            onError={handleImageError}
                          />
                          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent"></div>

                          {/* Overlaid details at bottom of image */}
                          <div className="absolute bottom-4 left-4 right-4 text-left">
                            <span className="text-[#00e652] text-[10px] sm:text-xs font-black uppercase tracking-widest block mb-0.5">
                              {localSettings.featuredLeague || 'LALIGA EA SPORTS'}
                            </span>
                            <h3 className="text-base sm:text-lg font-black text-white italic uppercase tracking-wider leading-tight">
                              {localSettings.featuredTitle || 'Real Madrid Local 2024/25'}
                            </h3>
                            <div className="flex items-center gap-1.5 text-[#00e652] text-xs mt-1">
                              <div className="flex">
                                {[...Array(5)].map((_, i) => (
                                  <Star key={i} className="w-3 h-3 fill-current" />
                                ))}
                              </div>
                              <span className="text-white/60 text-[10px] font-bold">
                                {localSettings.featuredRatingText || '(42 opiniones verificadas)'}
                              </span>
                            </div>
                          </div>
                        </div>

                        {/* Bottom Promo bar */}
                        <div className="p-3.5 bg-black/80 border-t border-white/10 flex items-center justify-between text-xs">
                          <div className="flex items-center gap-1.5 text-white/80 font-bold">
                            <Sparkles className="w-3.5 h-3.5 text-[#00e652]" />
                            <span className="text-[11px]">{localSettings.featuredPromoText || 'Estampado Nombre & Dorsal'}</span>
                          </div>
                          <span className="bg-[#00e652] text-black font-black px-2 py-0.5 text-[10px] rounded tracking-wider">
                            {localSettings.featuredPromoBadge || '¡GRATIS! 🎁'}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Social Buttons Mockup */}
                    <div className="space-y-2 pt-2">
                      <div className="w-full bg-gradient-to-r from-purple-600 via-pink-600 to-rose-500 text-white font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg">
                        <span>INSTAGRAM {localSettings.instagramHandle || '@OFFSIDE_SPORTS22'}</span>
                      </div>
                      <div className="w-full bg-[#25D366] text-black font-black py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg">
                        <span>WHATSAPP DIRECTO ({localSettings.whatsappPhone || '+506 8559 5192'})</span>
                      </div>
                    </div>

                    {/* Banner Text Snippet Preview */}
                    <div className="bg-[#121212] border border-white/10 rounded-2xl p-4 space-y-2 text-left">
                      <p className="text-[10px] text-[#00e652] font-black uppercase tracking-wider">
                        TAGLINE: {localSettings.heroTagline || 'NEW ARRIVAL / TEMPORADA 24-25'}
                      </p>
                      <h4 className="text-base font-black italic uppercase text-white tracking-wider">
                        {localSettings.heroMainTitle || 'PASIÓN EN CADA PIEL'}
                      </h4>
                      <p className="text-[11px] text-white/60 line-clamp-3">
                        {localSettings.heroSubtitle}
                      </p>
                    </div>
                  </div>
                </div>

              </form>
            </div>
          )}

          {/* TAB: STORE SETTINGS & PRICES */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6 bg-black border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="border-b border-white/10 pb-4 space-y-1">
                <div className="inline-flex items-center gap-2 bg-[#00e652]/10 border border-[#00e652]/30 px-3 py-1 text-[11px] font-black uppercase text-[#00e652] tracking-wider">
                  <SettingsIcon className="w-3.5 h-3.5" />
                  <span>AJUSTES GLOBALES DE LA TIENDA</span>
                </div>
                <h3 className="text-2xl font-black italic uppercase text-white">CONFIGURACIÓN DE PRECIOS & CONTACTO</h3>
                <p className="text-xs text-white/60 font-medium">
                  Modifica los costos globales de personalización de camisetas, tarifas de envío y los canales de atención al cliente.
                </p>
              </div>

              {settingsSavedMessage && (
                <div className="bg-[#00e652] text-black p-4 font-black uppercase text-xs flex items-center justify-between shadow-xl animate-bounce">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>¡CONFIGURACIÓN GUARDADA Y ACTUALIZADA EN TODA LA PLATAFORMA!</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveSettingsSubmit} className="space-y-6 text-xs font-semibold">
                
                {/* Prices Section - CRC & USD */}
                <div className="space-y-4 bg-[#121212] p-5 border border-white/10 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black italic uppercase text-[#00e652] flex items-center gap-2">
                      <DollarSign className="w-4 h-4 stroke-[2.5]" />
                      <span>TARIFAS DE LA TIENDA (EN COLONES ₡ CRC)</span>
                    </h4>
                    <span className="text-[10px] bg-[#00e652]/10 text-[#00e652] px-2 py-0.5 border border-[#00e652]/30 font-black uppercase">
                      COSTA RICA (₡ CRC)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    {/* Estampado / Personalización */}
                    <div className="space-y-2 bg-black/60 p-3.5 border border-white/10 rounded-xl">
                      <label className="block font-black uppercase text-white tracking-wider text-xs">
                        PRECIO DE ESTAMPADO / PERSONALIZACIÓN (₡ CRC):
                      </label>
                      <p className="text-[10px] text-white/50">Costo adicional si el cliente solicita nombre y número (0 para gratis)</p>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-[#00e652] font-black">₡</span>
                        <input
                          type="number"
                          step="100"
                          min="0"
                          required
                          value={localSettings.customizationPriceCRC ?? Math.round((localSettings.customizationPriceUSD || 10) * 520)}
                          onChange={(e) => {
                            const crc = Number(e.target.value);
                            setLocalSettings({
                              ...localSettings,
                              customizationPriceCRC: crc,
                              customizationPriceUSD: Number((crc / 520).toFixed(2))
                            });
                          }}
                          className="w-full bg-black border border-white/20 rounded-xl pl-7 pr-3 py-2 text-[#00e652] font-mono font-black text-sm focus:border-[#00e652]"
                        />
                      </div>
                    </div>

                    {/* Envío Estándar */}
                    <div className="space-y-2 bg-black/60 p-3.5 border border-white/10 rounded-xl">
                      <label className="block font-black uppercase text-white tracking-wider text-xs">
                        TARIFA DE ENVÍO ESTÁNDAR (₡ CRC):
                      </label>
                      <p className="text-[10px] text-white/50">Costo de envío a todo el país vía Correos de Costa Rica</p>
                      <div className="relative">
                        <span className="absolute left-3 top-2.5 text-[#00e652] font-black">₡</span>
                        <input
                          type="number"
                          step="100"
                          min="0"
                          required
                          value={localSettings.shippingFeeCRC ?? Math.round((localSettings.shippingFeeUSD || 5) * 520)}
                          onChange={(e) => {
                            const crc = Number(e.target.value);
                            setLocalSettings({
                              ...localSettings,
                              shippingFeeCRC: crc,
                              shippingFeeUSD: Number((crc / 520).toFixed(2))
                            });
                          }}
                          className="w-full bg-black border border-white/20 rounded-xl pl-7 pr-3 py-2 text-[#00e652] font-mono font-black text-sm focus:border-[#00e652]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Bank Account Receiver Section */}
                <div className="space-y-4 bg-[#121212] p-5 border border-[#00e652]/30 rounded-2xl">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-black italic uppercase text-[#00e652] flex items-center gap-2">
                      <Landmark className="w-4 h-4 stroke-[2.5]" />
                      <span>CUENTA BANCARIA & RECEPCIÓN DE FONDOS DE CLIENTES</span>
                    </h4>
                    <span className="text-[10px] bg-[#00e652] text-black px-2 py-0.5 font-black uppercase">
                      CUENTA DE INGRESO
                    </span>
                  </div>
                  <p className="text-[11px] text-white/70 font-medium">
                    Configura la cuenta bancaria donde los clientes depositarán o realizarán transferencias IBAN y SINPE Móvil al comprar.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block font-black uppercase text-white tracking-wider flex items-center gap-2">
                        <Building2 className="w-3.5 h-3.5 text-[#00e652]" />
                        <span>TITULAR DE LA CUENTA / NOMBRE DE EMPRESA:</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={localSettings.bankAccountHolder || ''}
                        onChange={(e) => setLocalSettings({ ...localSettings, bankAccountHolder: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold focus:border-[#00e652]"
                        placeholder="Ej: OFFSIDE Sports Costa Rica S.A. (3-101-882910)"
                      />
                      <p className="text-[10px] text-white/50">
                        Nombre que le aparecerá al cliente al confirmar su transferencia o depósito.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-black uppercase text-white tracking-wider">
                        BANCO DESTINO DE RECEPCIÓN:
                      </label>
                      <input
                        type="text"
                        required
                        value={localSettings.bankName || ''}
                        onChange={(e) => setLocalSettings({ ...localSettings, bankName: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold focus:border-[#00e652]"
                        placeholder="Ej: BAC Credomatic Costa Rica / Banco Nacional"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-black uppercase text-white tracking-wider">
                        TELÉFONO REGISTRADO PARA SINPE MÓVIL:
                      </label>
                      <input
                        type="text"
                        required
                        value={localSettings.sinpePhone || localSettings.contactPhone || ''}
                        onChange={(e) => setLocalSettings({ ...localSettings, sinpePhone: e.target.value, contactPhone: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-[#00e652] font-mono font-black focus:border-[#00e652]"
                        placeholder="+506 8559 5192"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block font-black uppercase text-white tracking-wider">
                        NÚMERO DE CUENTA IBAN (22 DÍGITOS):
                      </label>
                      <input
                        type="text"
                        required
                        value={localSettings.bankAccountIBAN || ''}
                        onChange={(e) => setLocalSettings({ ...localSettings, bankAccountIBAN: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-[#00e652] font-mono font-black focus:border-[#00e652]"
                        placeholder="CR05015202001026384920"
                      />
                      <p className="text-[10px] text-white/50">
                        Cuenta IBAN oficial de Costa Rica a la cual los clientes realizarán las transferencias bancarias.
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact & Messages Section */}
                <div className="space-y-4 bg-[#121212] p-5 border border-white/10 rounded-2xl">
                  <h4 className="text-sm font-black italic uppercase text-[#00e652] flex items-center gap-2">
                    <Mail className="w-4 h-4 stroke-[2.5]" />
                    <span>CANALES DE MENSAJES & NOTIFICACIONES</span>
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block font-black uppercase text-white tracking-wider flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#00e652]" />
                        <span>CORREO PARA RECIBIR CONSULTAS Y NOTIFICACIONES DE COMPRA:</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={localSettings.contactEmail}
                        onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold focus:border-[#00e652]"
                        placeholder="contacto@offsidesports.cr"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-black uppercase text-white tracking-wider flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#00e652]" />
                        <span>TELÉFONO PRINCIPAL ATENCIÓN WHATSAPP:</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={localSettings.contactPhone}
                        onChange={(e) => setLocalSettings({ ...localSettings, contactPhone: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold font-mono focus:border-[#00e652]"
                        placeholder="+506 8559 5192"
                      />
                    </div>
                  </div>
                </div>

                {/* Banner & Hero Customization Section */}
                <div className="space-y-4 bg-[#121212] p-5 border border-white/10 rounded-2xl">
                  <div className="flex items-center justify-between flex-wrap gap-2">
                    <h4 className="text-sm font-black italic uppercase text-[#00e652] flex items-center gap-2">
                      <Sparkles className="w-4 h-4 stroke-[2.5]" />
                      <span>CAMISETA DESTACADA Y PORTADA DE LA TIENDA (HERO)</span>
                    </h4>
                    <button
                      type="button"
                      onClick={() => setActiveTab('hero')}
                      className="text-xs font-black uppercase text-black bg-[#00e652] hover:bg-white px-3 py-1.5 rounded-lg transition flex items-center gap-1.5 cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Abrir Editor Visual con Vista Previa</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-black uppercase text-white tracking-wider">
                        FOTO DE LA CAMISETA DESTACADA (URL):
                      </label>
                      <input
                        type="url"
                        value={localSettings.featuredImage || ''}
                        onChange={(e) => setLocalSettings({ ...localSettings, featuredImage: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-white font-mono focus:border-[#00e652]"
                        placeholder="https://..."
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase text-white tracking-wider">
                        TÍTULO DE LA CAMISETA:
                      </label>
                      <input
                        type="text"
                        value={localSettings.featuredTitle || 'Real Madrid Local 2024/25'}
                        onChange={(e) => setLocalSettings({ ...localSettings, featuredTitle: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-white font-black uppercase italic focus:border-[#00e652]"
                        placeholder="Real Madrid Local 2024/25"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="block text-xs font-black uppercase text-white tracking-wider">
                        LIGA / COMPETICIÓN:
                      </label>
                      <input
                        type="text"
                        value={localSettings.featuredLeague || 'LaLiga EA Sports'}
                        onChange={(e) => setLocalSettings({ ...localSettings, featuredLeague: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-[#00e652] font-black focus:border-[#00e652]"
                        placeholder="LaLiga EA Sports"
                      />
                    </div>

                    <div className="space-y-1.5 sm:col-span-2">
                      <label className="block text-xs font-black uppercase text-white tracking-wider">
                        ETIQUETA ANIMADA DE INICIO (TAGLINE):
                      </label>
                      <input
                        type="text"
                        value={localSettings.heroTagline || 'NEW ARRIVAL / TEMPORADA 24-25'}
                        onChange={(e) => setLocalSettings({ ...localSettings, heroTagline: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-xs text-[#00e652] font-black focus:border-[#00e652]"
                        placeholder="NEW ARRIVAL / TEMPORADA 24-25"
                      />
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#00e652] hover:bg-white text-black font-black uppercase px-8 py-4 text-xs tracking-widest skew-x-[-10deg] transition cursor-pointer shadow-2xl flex items-center gap-2"
                  >
                    <div className="skew-x-[10deg] flex items-center gap-2">
                      <Save className="w-4 h-4 stroke-[2.5]" />
                      <span>GUARDAR CAMBIOS DE CONFIGURACIÓN</span>
                    </div>
                  </button>
                </div>

              </form>
            </div>
          )}

          {/* TAB: DISCOUNT CODES */}
          {activeTab === 'coupons' && (
            <div className="max-w-4xl mx-auto space-y-4 sm:space-y-6 bg-black border border-white/10 rounded-2xl sm:rounded-3xl p-3.5 sm:p-6 shadow-2xl">
              <div className="border-b border-white/10 pb-4 space-y-1">
                <div className="inline-flex items-center gap-2 bg-[#00e652]/10 border border-[#00e652]/30 px-3 py-1 text-[11px] font-black uppercase text-[#00e652] tracking-wider">
                  <Tag className="w-3.5 h-3.5" />
                  <span>GESTIÓN DE CUPONES DE DESCUENTO</span>
                </div>
                <h3 className="text-xl sm:text-2xl font-black italic uppercase text-white">CÓDIGOS DE DESCUENTO PARA EL CARRITO</h3>
                <p className="text-xs text-white/60 font-medium">
                  Crea, edita y administra cupones promocionales que los clientes podrán aplicar durante el proceso de compra.
                </p>
              </div>

              {couponSuccessMsg && (
                <div className="bg-[#00e652] text-black p-3.5 font-black uppercase text-xs flex items-center justify-between shadow-xl animate-bounce rounded-xl">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>¡CÓDIGO DE DESCUENTO GUARDADO Y ACTIVADO CON ÉXITO!</span>
                  </div>
                </div>
              )}

              {couponErrorMsg && (
                <div className="bg-rose-500 text-white p-3.5 font-black uppercase text-xs flex items-center justify-between shadow-xl rounded-xl">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-5 h-5 stroke-[3]" />
                    <span>{couponErrorMsg}</span>
                  </div>
                  <button onClick={() => setCouponErrorMsg('')} className="p-1 hover:bg-black/20 rounded cursor-pointer">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Create New Coupon Form */}
              <form onSubmit={handleCreateCoupon} className="bg-[#121212] p-4 sm:p-5 border border-white/10 rounded-2xl space-y-4">
                <h4 className="text-xs sm:text-sm font-black italic uppercase text-[#00e652] flex items-center gap-2">
                  <Plus className="w-4 h-4 stroke-[2.5]" />
                  <span>CREAR NUEVO CÓDIGO DE DESCUENTO</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 items-end">
                  <div>
                    <label className="block text-[11px] font-black uppercase text-white mb-1">CÓDIGO DEL CUPÓN:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: OFFSIDE20, VERANO25, CR7"
                      value={newCouponCode}
                      onChange={(e) => setNewCouponCode(e.target.value.toUpperCase())}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-xs text-white font-mono font-black uppercase focus:border-[#00e652]"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-black uppercase text-white mb-1">PORCENTAJE DE DESCUENTO (%):</label>
                    <div className="relative">
                      <input
                        type="number"
                        min="1"
                        max="100"
                        required
                        value={newCouponPercent}
                        onChange={(e) => setNewCouponPercent(Number(e.target.value))}
                        className="w-full bg-black border border-white/20 rounded-xl p-2.5 pr-8 text-xs text-[#00e652] font-mono font-black focus:border-[#00e652]"
                      />
                      <span className="absolute right-3 top-2.5 text-xs text-[#00e652] font-black">%</span>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full bg-[#00e652] hover:bg-white text-black font-black uppercase p-2.5 text-xs tracking-wider cursor-pointer skew-x-[-10deg] transition shadow-lg flex items-center justify-center gap-2"
                    >
                      <div className="skew-x-[10deg] flex items-center gap-1.5">
                        <Plus className="w-4 h-4 stroke-[2.5]" />
                        <span>CREAR CUPÓN</span>
                      </div>
                    </button>
                  </div>
                </div>
              </form>

              {/* Coupon List Table */}
              <div className="bg-black border border-white/10 rounded-2xl overflow-hidden">
                <div className="p-3.5 sm:p-4 bg-[#121212] border-b border-white/10 flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-white tracking-wider">CUPONES REGISTRADOS ({discountCodes.length})</h4>
                  <span className="text-[10px] text-[#00e652] font-mono font-bold">Aplica al subtotal</span>
                </div>

                {discountCodes.length === 0 ? (
                  <div className="p-8 text-center text-white/40 text-xs italic">
                    No hay códigos de descuento registrados. ¡Crea el primero arriba!
                  </div>
                ) : (
                  <div className="divide-y divide-white/10">
                    {discountCodes.map((coupon) => {
                      const isEditingThis = editingCouponId === coupon.id;

                      if (isEditingThis) {
                        return (
                          <div key={coupon.id} className="p-4 bg-[#121212] border-l-4 border-[#00e652] space-y-3">
                            <div className="flex items-center justify-between">
                              <span className="text-xs font-black text-[#00e652] uppercase tracking-wider flex items-center gap-1.5">
                                <Edit className="w-3.5 h-3.5" />
                                <span>EDITANDO CUPÓN</span>
                              </span>
                              <span className="text-[10px] text-white/40 font-mono">ID: {coupon.id}</span>
                            </div>

                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                              <div>
                                <label className="block text-[10px] font-black uppercase text-white/80 mb-1">CÓDIGO DEL CUPÓN:</label>
                                <input
                                  type="text"
                                  required
                                  value={editCouponCode}
                                  onChange={(e) => setEditCouponCode(e.target.value.toUpperCase())}
                                  className="w-full bg-black border border-white/30 rounded-lg p-2 text-xs text-white font-mono font-black uppercase focus:border-[#00e652]"
                                />
                              </div>

                              <div>
                                <label className="block text-[10px] font-black uppercase text-white/80 mb-1">PORCENTAJE DE DESCUENTO (%):</label>
                                <input
                                  type="number"
                                  min="1"
                                  max="100"
                                  required
                                  value={editCouponPercent}
                                  onChange={(e) => setEditCouponPercent(Number(e.target.value))}
                                  className="w-full bg-black border border-white/30 rounded-lg p-2 text-xs text-[#00e652] font-mono font-black focus:border-[#00e652]"
                                />
                              </div>
                            </div>

                            <div className="flex items-center justify-end gap-2 pt-1">
                              <button
                                type="button"
                                onClick={handleCancelEditCoupon}
                                className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white font-black text-[10px] uppercase rounded transition cursor-pointer flex items-center gap-1"
                              >
                                <X className="w-3.5 h-3.5" />
                                <span>CANCELAR</span>
                              </button>
                              <button
                                type="button"
                                onClick={() => handleSaveEditCoupon(coupon.id)}
                                className="px-4 py-1.5 bg-[#00e652] hover:bg-white text-black font-black text-[10px] uppercase rounded transition cursor-pointer flex items-center gap-1 shadow-md"
                              >
                                <Save className="w-3.5 h-3.5 stroke-[2.5]" />
                                <span>GUARDAR</span>
                              </button>
                            </div>
                          </div>
                        );
                      }

                      return (
                        <div key={coupon.id} className="p-3.5 sm:p-4 flex flex-col sm:flex-row sm:items-center justify-between hover:bg-white/5 transition gap-3 sm:gap-4">
                          <div className="flex items-start sm:items-center gap-3">
                            <div className="shrink-0 p-1.5 bg-[#00e652]/10 border border-[#00e652]/30 text-[#00e652] font-mono font-black text-xs sm:text-sm px-2.5 py-1 skew-x-[-10deg]">
                              <span className="skew-x-[10deg] inline-block">{coupon.code}</span>
                            </div>
                            <div>
                              <p className="text-xs sm:text-sm font-black text-white">{coupon.percentage}% DE DESCUENTO</p>
                              <p className="text-[10px] text-white/50 font-mono">
                                Estado: {coupon.active ? '🟢 Activo en carrito' : '🔴 Inactivo (Pausado)'}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t sm:border-0 border-white/10">
                            <button
                              type="button"
                              onClick={() => handleStartEditCoupon(coupon)}
                              className="px-2.5 py-1.5 bg-amber-400/20 hover:bg-amber-400 text-amber-300 hover:text-black border border-amber-400/40 text-[10px] font-black uppercase transition cursor-pointer flex items-center gap-1 rounded"
                              title="Editar Cupón"
                            >
                              <Edit className="w-3.5 h-3.5 stroke-[2.5]" />
                              <span>EDITAR</span>
                            </button>

                            <button
                              type="button"
                              onClick={() => handleToggleCouponActive(coupon.id)}
                              className={`px-2.5 py-1.5 text-[10px] font-black uppercase transition cursor-pointer rounded ${
                                coupon.active
                                  ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500 hover:text-black'
                                  : 'bg-white/10 text-white/60 border border-white/20 hover:bg-white/20'
                              }`}
                            >
                              {coupon.active ? 'DESACTIVAR' : 'ACTIVAR'}
                            </button>

                            <button
                              type="button"
                              onClick={() => handleDeleteCoupon(coupon.id)}
                              className="p-1.5 bg-rose-500/20 hover:bg-rose-500 text-rose-300 hover:text-white border border-rose-500/30 transition cursor-pointer rounded"
                              title="Eliminar Cupón"
                            >
                              <Trash2 className="w-3.5 h-3.5 stroke-[2.5]" />
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 2: ORDERS MANAGEMENT */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              {/* Filters */}
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div className="relative max-w-xs flex-1">
                  <input
                    type="text"
                    placeholder="Buscar por ID de orden o cliente..."
                    value={adminSearch}
                    onChange={(e) => setAdminSearch(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-white/40 focus:border-[#00e652]"
                  />
                  <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white/70 font-black uppercase tracking-wider">ESTADO:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-black border border-white/20 text-white font-bold rounded-xl py-1.5 px-3 focus:border-[#00e652]"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="Solicitado">🟡 Solicitado</option>
                    <option value="Empaquetando">📦 Empaquetando</option>
                    <option value="Listo">⚡ Listo</option>
                    <option value="Proceso de entrega">🚚 Proceso de entrega</option>
                    <option value="Entregado">✅ Entregado</option>
                    <option value="Cancelado">❌ Cancelado</option>
                    <option value="Pendiente">Pendiente (Legacy)</option>
                    <option value="En Proceso">En Proceso (Legacy)</option>
                    <option value="Enviado">Enviado (Legacy)</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-black border border-white/10 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121212] border-b border-white/10 text-[#00e652] uppercase font-black text-[10px] tracking-widest">
                    <tr>
                      <th className="p-3">ORDEN ID</th>
                      <th className="p-3">CLIENTE</th>
                      <th className="p-3">FECHA</th>
                      <th className="p-3">TOTAL</th>
                      <th className="p-3">ESTADO DEL PEDIDO</th>
                      <th className="p-3 text-right">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-mono font-black text-[#00e652]">
                          {order.id}
                        </td>
                        <td className="p-3">
                          <p className="font-bold text-white">{order.customer.fullName}</p>
                          <p className="text-[10px] text-white/60">{order.customer.city} • {order.customer.phone}</p>
                        </td>
                        <td className="p-3 text-white/70">{order.date}</td>
                        <td className="p-3 font-black text-white italic text-sm">{formatPrice(order.total, currency)}</td>
                        <td className="p-3">
                          <select
                            value={order.status}
                            onChange={(e) => handleStatusChange(order.id, e.target.value as OrderStatus)}
                            className="bg-black border border-[#00e652]/40 text-xs font-black uppercase rounded-lg px-2.5 py-1.5 text-[#00e652] focus:outline-none cursor-pointer"
                          >
                            <option value="Solicitado">🟡 Solicitado</option>
                            <option value="Empaquetando">📦 Empaquetando</option>
                            <option value="Listo">⚡ Listo</option>
                            <option value="Proceso de entrega">🚚 Proceso de entrega</option>
                            <option value="Entregado">✅ Entregado</option>
                            <option value="Cancelado">❌ Cancelado</option>
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Enviado">Enviado</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 bg-[#00e652] hover:bg-white text-black font-black uppercase tracking-wider text-[10px] cursor-pointer skew-x-[-10deg]"
                          >
                            <span className="skew-x-[10deg] inline-block">VER DETALLES</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* TAB 3: STATISTICS */}
          {activeTab === 'stats' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-5 bg-black border border-white/10 space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-[#00e652]">VENTAS TOTALES</p>
                <p className="text-3xl font-black italic text-white">{formatPrice(totalRevenueUSD, currency)}</p>
                <p className="text-[10px] text-white/50 font-mono uppercase">Facturación acumulada</p>
              </div>

              <div className="p-5 bg-black border border-white/10 space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-[#00e652]">TOTAL DE PEDIDOS</p>
                <p className="text-3xl font-black italic text-white">{orders.length}</p>
                <p className="text-[10px] text-white/50 font-mono uppercase">{pendingOrders} pedidos en proceso</p>
              </div>

              <div className="p-5 bg-black border border-white/10 space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-[#00e652]">CATÁLOGO ACTIVO</p>
                <p className="text-3xl font-black italic text-white">{jerseys.length} MODELOS</p>
                <p className="text-[10px] text-white/50 font-mono uppercase">Disponibles en tienda</p>
              </div>

              <div className="p-5 bg-black border border-white/10 space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-[#00e652]">BAJO STOCK</p>
                <p className="text-3xl font-black italic text-amber-400">{lowStockCount}</p>
                <p className="text-[10px] text-white/50 font-mono uppercase">Camisetas con ≤5 unds</p>
              </div>
            </div>
          )}

        </div>

      </div>

      {/* Jersey Edit / Add Modal */}
      {isNewModalOpen && editingJersey && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 w-full max-w-3xl text-white space-y-5 max-h-[90vh] overflow-y-auto">
            
            {/* Header */}
            <div className="flex justify-between items-center border-b border-white/10 pb-4">
              <div className="flex items-center gap-2">
                <div className="p-2 bg-[#00e652] text-black skew-x-[-10deg]">
                  <Package className="w-5 h-5 stroke-[2.5] skew-x-[10deg]" />
                </div>
                <div>
                  <h3 className="text-base font-black italic uppercase text-white">
                    {editingJersey.id ? 'PUBLICACIÓN / EDITAR CAMISETA' : 'NUEVA PUBLICACIÓN EN CATÁLOGO'}
                  </h3>
                  <p className="text-[11px] text-white/60 font-semibold">
                    Personaliza los detalles del producto e imágenes desde tu dispositivo
                  </p>
                </div>
              </div>
              <button 
                onClick={() => setIsNewModalOpen(false)} 
                className="p-2 bg-white/10 hover:bg-[#00e652] text-white hover:text-black transition cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSaveJersey} className="space-y-5 text-xs font-semibold">
              
              {/* Sección 1: Datos Principales del Producto */}
              <div className="space-y-3 bg-[#121212] p-4 border border-white/10 rounded-2xl">
                <h4 className="text-xs font-black uppercase text-[#00e652] tracking-wider flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#00e652]" />
                  <span>DATOS GENERALES DE LA CAMISETA</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="sm:col-span-2">
                    <label className="block text-white font-black uppercase tracking-wider mb-1">NOMBRE COMPLETO DE LA PUBLICACIÓN:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Real Madrid Local 2025/2026 Versión Jugador"
                      value={editingJersey.name || ''}
                      onChange={(e) => setEditingJersey({ ...editingJersey, name: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#00e652]"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">EQUIPO / CLUB / SELECCIÓN:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Saprissa, Real Madrid, Selección Costa Rica"
                      value={editingJersey.team || ''}
                      onChange={(e) => setEditingJersey({ ...editingJersey, team: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#00e652]"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">DEPORTE / CATEGORÍA:</label>
                    <select
                      value={editingJersey.sportCategory || 'Fútbol'}
                      onChange={(e) => setEditingJersey({ ...editingJersey, sportCategory: e.target.value as SportCategory })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#00e652]"
                    >
                      {SPORTS_LIST.filter(s => s.id !== 'all').map(sp => (
                        <option key={sp.id} value={sp.id}>{sp.icon} {sp.name}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">LIGA / COMPETICIÓN / TORNEO:</label>
                    <select
                      value={editingJersey.league || 'Liga Promerica (CR)'}
                      onChange={(e) => setEditingJersey({ ...editingJersey, league: e.target.value as League })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#00e652]"
                    >
                      {INITIAL_LEAGUES.map(lg => (
                        <option key={lg} value={lg}>
                          {LEAGUE_FLAGS[lg] || '🏆'} {lg}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">VERSIÓN DE FABRICACIÓN:</label>
                    <select
                      value={editingJersey.version || 'Versión Jugador (Player Issue)'}
                      onChange={(e) => setEditingJersey({ ...editingJersey, version: e.target.value as JerseyVersion })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#00e652]"
                    >
                      <option value="Versión Jugador (Player Issue)">⚡ Versión Jugador (Player Issue / Premium)</option>
                      <option value="Versión Fan (Aficionado)">🧢 Versión Fan (Aficionado / Stadium)</option>
                      <option value="Manga Larga">🧥 Manga Larga (Long Sleeve)</option>
                      <option value="Chaqueta / Rompevientos">🌪️ Chaqueta / Rompevientos</option>
                      <option value="Conjunto Completo">⚽ Conjunto Completo (Camiseta + Short)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">PÚBLICO / GÉNERO:</label>
                    <select
                      value={editingJersey.genderCategory || 'Unisex (Adulto)'}
                      onChange={(e) => setEditingJersey({ ...editingJersey, genderCategory: e.target.value as GenderCategory })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#00e652]"
                    >
                      <option value="Unisex (Adulto)">👥 Unisex / Adulto (Hombre / Mujer)</option>
                      <option value="Femenina (Mujer)">👚 Corte Femenino (Mujer)</option>
                      <option value="Niños / Infantil">👶 Niños / Infantil (Kids / Youth)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">TIPO DE KIT / EDICIÓN:</label>
                    <select
                      value={editingJersey.type || 'Local'}
                      onChange={(e) => setEditingJersey({ ...editingJersey, type: e.target.value as JerseyType })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#00e652]"
                    >
                      <option value="Local">🏠 Local (Home Kit)</option>
                      <option value="Visitante">✈️ Visitante (Away Kit)</option>
                      <option value="Tercera">🌟 Tercera (Third Kit)</option>
                      <option value="Edición Especial">🔥 Edición Especial / Conmemorativa</option>
                      <option value="Retro">🏛️ Clásica Retro (Legendary Edition)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">TEMPORADA / AÑO:</label>
                    <input
                      type="text"
                      placeholder="2025/2026"
                      value={editingJersey.yearSeason || '2025/2026'}
                      onChange={(e) => setEditingJersey({ ...editingJersey, yearSeason: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#00e652]"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Precios y Stock */}
              <div className="space-y-3 bg-[#121212] p-4 border border-white/10 rounded-2xl">
                <h4 className="text-xs font-black uppercase text-[#00e652] tracking-wider flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-[#00e652]" />
                  <span>PRECIO DE VENTA EN COLONES (₡ CRC) & INVENTARIO</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">
                      PRECIO DE VENTA (₡ CRC):
                    </label>
                    <div className="relative">
                      <span className="absolute left-3 top-2.5 text-[#00e652] font-black z-10 pointer-events-none text-base">₡</span>
                      <input
                        type="text"
                        inputMode="numeric"
                        required
                        placeholder="Ej: 25000"
                        value={crcInputValue}
                        onFocus={(e) => e.target.select()}
                        onChange={(e) => {
                          let raw = e.target.value.replace(/[^0-9]/g, '');
                          if (raw.length > 1 && raw.startsWith('0')) {
                            raw = raw.replace(/^0+/, '');
                          }
                          setCrcInputValue(raw);
                          if (raw === '') {
                            setEditingJersey({ ...editingJersey, price: '' as unknown as number, priceCRC: undefined });
                          } else {
                            const crc = Number(raw);
                            setEditingJersey({ ...editingJersey, price: crc, priceCRC: crc });
                          }
                        }}
                        className="w-full bg-black border border-white/20 rounded-xl pl-9 pr-3 py-2.5 text-[#00e652] font-mono font-black text-base focus:border-[#00e652] outline-none"
                      />
                    </div>
                    <p className="text-[10px] text-white/50 mt-1">
                      {crcInputValue ? `Precio fijado: ₡${Number(crcInputValue).toLocaleString('es-CR')} exactos` : 'Ingresa el monto en Colones (Ej: 25000, 20000)'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">STOCK DISPONIBLE:</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={
                        editingJersey.stock === '' || editingJersey.stock === undefined || editingJersey.stock === null
                          ? ''
                          : editingJersey.stock
                      }
                      onChange={(e) => {
                        const val = e.target.value;
                        setEditingJersey({
                          ...editingJersey,
                          stock: val === '' ? ('' as unknown as number) : Number(val)
                        });
                      }}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#00e652]"
                    />
                    <p className="text-[10px] text-white/50 mt-1">Unidades físicas disponibles en bodega</p>
                  </div>
                </div>

                {/* PRECIO ANTERIOR TACHADO (OFERTA / REBAJA) */}
                <div className="bg-black/50 p-3.5 border border-white/10 rounded-xl space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <span className="text-xs font-black uppercase text-white flex items-center gap-1.5">
                        <Tag className="w-3.5 h-3.5 text-[#00e652]" />
                        <span>PRECIO ANTERIOR TACHADO (OFERTA)</span>
                      </span>
                      <p className="text-[10px] text-white/50 mt-0.5">
                        {showOriginalPrice
                          ? 'Aparece tachado al lado del precio de venta para indicar rebaja'
                          : 'Desactivado: sólo se mostrará el precio real de venta'}
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        const next = !showOriginalPrice;
                        setShowOriginalPrice(next);
                        if (!next) {
                          setEditingJersey({ ...editingJersey, originalPrice: undefined, originalPriceCRC: undefined });
                          setOriginalCrcInputValue('');
                          setOriginalUsdInputValue('');
                        } else {
                          const currentCRC = Number(crcInputValue) || 25000;
                          const suggestedCRC = Math.round((currentCRC * 1.2) / 1000) * 1000;
                          setEditingJersey({ ...editingJersey, originalPrice: suggestedCRC, originalPriceCRC: suggestedCRC });
                          setOriginalCrcInputValue(String(suggestedCRC));
                          setOriginalUsdInputValue('');
                        }
                      }}
                      className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wider transition cursor-pointer self-start sm:self-auto ${
                        showOriginalPrice
                          ? 'bg-[#00e652] text-black shadow-md'
                          : 'bg-white/10 text-white/70 hover:bg-white/20'
                      }`}
                    >
                      {showOriginalPrice ? '✓ Con Precio Tachado' : '✕ Sin Precio Tachado (Solo Precio Real)'}
                    </button>
                  </div>

                  {showOriginalPrice && (
                    <div className="pt-2 border-t border-white/10 space-y-2.5">
                      <div>
                        <label className="block text-white/80 text-[10px] font-bold uppercase mb-1">
                          PRECIO ANTERIOR TACHADO EN COLONES (₡ CRC):
                        </label>
                        <div className="relative">
                          <span className="absolute left-3 top-2 text-white/40 font-black z-10 pointer-events-none">₡</span>
                          <input
                            type="text"
                            inputMode="numeric"
                            placeholder="Ej: 30000"
                            value={originalCrcInputValue}
                            onFocus={(e) => e.target.select()}
                            onChange={(e) => {
                              let raw = e.target.value.replace(/[^0-9]/g, '');
                              if (raw.length > 1 && raw.startsWith('0')) raw = raw.replace(/^0+/, '');
                              setOriginalCrcInputValue(raw);
                              if (raw === '') {
                                setEditingJersey({ ...editingJersey, originalPrice: undefined, originalPriceCRC: undefined });
                              } else {
                                const origCrc = Number(raw);
                                setEditingJersey({ ...editingJersey, originalPrice: origCrc, originalPriceCRC: origCrc });
                              }
                            }}
                            className="w-full bg-[#181818] border border-white/20 rounded-xl pl-7 pr-2.5 py-2 text-white font-mono text-sm focus:border-[#00e652] outline-none"
                          />
                        </div>
                        <p className="text-[10px] text-white/40 mt-1">
                          Debe ser mayor al precio de venta para que se muestre como rebaja.
                        </p>
                      </div>

                      <div className="flex items-center justify-between text-[11px] bg-white/5 px-2.5 py-1.5 rounded-lg">
                        <span className="text-white/70">
                          Vista previa:{' '}
                          <span className="text-[#00e652] font-black">{crcInputValue ? `₡${Number(crcInputValue).toLocaleString('es-CR')}` : '₡0'}</span>{' '}
                          {originalCrcInputValue ? (
                            <span className="line-through text-white/40 font-bold ml-1">
                              ₡{Number(originalCrcInputValue).toLocaleString('es-CR')}
                            </span>
                          ) : null}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            setShowOriginalPrice(false);
                            setEditingJersey({ ...editingJersey, originalPrice: undefined, originalPriceCRC: undefined });
                            setOriginalCrcInputValue('');
                            setOriginalUsdInputValue('');
                          }}
                          className="text-rose-400 hover:text-rose-300 font-bold underline cursor-pointer text-[10px]"
                        >
                          Quitar precio tachado
                        </button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Individual Product Discount & Badge Tags */}
                <div className="pt-2 border-t border-white/10 grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-[#00e652] font-black uppercase tracking-wider mb-1">
                      DESCUENTO INDIVIDUAL EN ESTE PRODUCTO (%):
                    </label>
                    <select
                      value={editingJersey.discountPercent ?? 0}
                      onChange={(e) => {
                        const pct = Number(e.target.value);
                        setEditingJersey({
                          ...editingJersey,
                          discountPercent: pct
                        });
                      }}
                      className="w-full bg-black border border-[#00e652]/40 rounded-xl p-2.5 text-[#00e652] font-black focus:border-[#00e652]"
                    >
                      <option value={0}>Sin Descuento Individual (0% OFF)</option>
                      <option value={5}>🔥 5% de Descuento</option>
                      <option value={10}>🔥 10% de Descuento</option>
                      <option value={15}>🔥 15% de Descuento</option>
                      <option value={20}>🔥 20% de Descuento</option>
                      <option value={25}>🔥 25% de Descuento</option>
                      <option value={30}>🔥 30% de Descuento</option>
                      <option value={40}>🔥 40% de Descuento</option>
                      <option value={50}>🔥 50% de Descuento (MITAD DE PRECIO)</option>
                    </select>
                    <p className="text-[10px] text-white/50 mt-1">
                      {editingJersey.discountPercent && editingJersey.discountPercent > 0
                        ? `Muestra insignia 🔥 -${editingJersey.discountPercent}% OFF y precio anterior tachado`
                        : 'Aplica un porcentaje de rebaja exclusivo a esta camiseta'}
                    </p>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">
                      ETIQUETA DESTACADA (BADGE):
                    </label>
                    <input
                      type="text"
                      placeholder="Ej: NEW ARRIVAL, MÁS VENDIDO, EDICIÓN LIMITADA"
                      value={(editingJersey.badgeTags || []).join(', ')}
                      onChange={(e) => {
                        const tags = e.target.value.split(',').map(t => t.trim()).filter(Boolean);
                        setEditingJersey({ ...editingJersey, badgeTags: tags });
                      }}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#00e652]"
                    />
                    <p className="text-[10px] text-white/50 mt-1">Etiqueta personalizada para destacar la camiseta</p>
                  </div>
                </div>
              </div>

              {/* Sección 3: Carga de Fotos (Dispositivo Local vs URL) */}
              <div className="space-y-4 bg-[#121212] p-4 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-[#00e652] tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-[#00e652]" />
                    <span>FOTOS DEL PRODUCTO (DESDE EL DISPOSITIVO O URL)</span>
                  </h4>
                  <span className="text-[10px] bg-[#00e652]/10 text-[#00e652] px-2 py-0.5 border border-[#00e652]/30 font-black">
                    NUEVA FUNCIÓN: CARGA LOCAL ACTIVADA
                  </span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  
                  {/* Imagen Principal (Frente) */}
                  <div className="bg-black p-3 border border-white/10 rounded-xl space-y-3">
                    <label className="block text-xs font-black uppercase text-white">1. IMAGEN PRINCIPAL (FRENTE):</label>
                    
                    {/* Preview Box */}
                    <div className="h-36 bg-[#1a1a1a] border border-dashed border-white/20 rounded-lg flex items-center justify-center overflow-hidden relative group">
                      {editingJersey.image ? (
                        <>
                          <img 
                            src={editingJersey.image} 
                            alt="Vista Previa Frente" 
                            referrerPolicy="no-referrer"
                            onError={handleImageError}
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <span className="text-[10px] text-[#00e652] font-black uppercase">Vista Previa Frente</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-white/40 space-y-1">
                          <Upload className="w-6 h-6 mx-auto text-[#00e652]" />
                          <p className="text-[10px]">Sin imagen principal</p>
                        </div>
                      )}
                    </div>

                    {/* File Upload Button */}
                    <div>
                      <label className="block w-full bg-[#00e652] hover:bg-white text-black font-black uppercase text-[10px] tracking-wider text-center py-2 px-3 rounded-lg cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5 inline mr-1 stroke-[3]" />
                        SELECCIONAR FOTO DEL DISPOSITIVO
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'image')}
                          className="hidden" 
                        />
                      </label>
                    </div>

                    {/* URL Input Alternative */}
                    <div>
                      <p className="text-[10px] text-white/50 mb-1">O ingresa URL de internet:</p>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={editingJersey.image || ''}
                        onChange={(e) => setEditingJersey({ ...editingJersey, image: e.target.value })}
                        className="w-full bg-[#121212] border border-white/20 rounded-lg p-2 text-white text-[11px] font-mono focus:border-[#00e652]"
                      />
                    </div>
                  </div>

                  {/* Imagen Trasera (Dorsal / Espalda) */}
                  <div className="bg-black p-3 border border-white/10 rounded-xl space-y-3">
                    <label className="block text-xs font-black uppercase text-white">2. IMAGEN TRASERA (ESPALDA):</label>
                    
                    {/* Preview Box */}
                    <div className="h-36 bg-[#1a1a1a] border border-dashed border-white/20 rounded-lg flex items-center justify-center overflow-hidden relative group">
                      {editingJersey.backImage ? (
                        <>
                          <img 
                            src={editingJersey.backImage} 
                            alt="Vista Previa Espalda" 
                            referrerPolicy="no-referrer"
                            onError={handleImageError}
                            className="w-full h-full object-contain"
                          />
                          <button
                            type="button"
                            onClick={() => setEditingJersey({ ...editingJersey, backImage: undefined })}
                            className="absolute top-2 right-2 bg-red-600 text-white p-1 rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
                            title="Quitar imagen"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </>
                      ) : (
                        <div className="text-center text-white/40 space-y-1">
                          <Upload className="w-6 h-6 mx-auto text-white/30" />
                          <p className="text-[10px]">Opcional: Dorsal o Espalda</p>
                        </div>
                      )}
                    </div>

                    {/* File Upload Button */}
                    <div>
                      <label className="block w-full bg-white/10 hover:bg-[#00e652] text-white hover:text-black font-black uppercase text-[10px] tracking-wider text-center py-2 px-3 rounded-lg cursor-pointer transition">
                        <Upload className="w-3.5 h-3.5 inline mr-1 stroke-[2.5]" />
                        SUBIR ESPALDA DESDE ARCHIVOS
                        <input 
                          type="file" 
                          accept="image/*"
                          onChange={(e) => handleImageFileUpload(e, 'backImage')}
                          className="hidden" 
                        />
                      </label>
                    </div>

                    {/* URL Input Alternative */}
                    <div>
                      <p className="text-[10px] text-white/50 mb-1">O ingresa URL de la espalda:</p>
                      <input
                        type="text"
                        placeholder="https://..."
                        value={editingJersey.backImage || ''}
                        onChange={(e) => setEditingJersey({ ...editingJersey, backImage: e.target.value })}
                        className="w-full bg-[#121212] border border-white/20 rounded-lg p-2 text-white text-[11px] font-mono focus:border-[#00e652]"
                      />
                    </div>
                  </div>

                </div>

                {/* Galería de Fotos Adicionales */}
                <div className="pt-2 space-y-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase text-white">3. GALERÍA ADICIONAL (DETALLES / PARCHES):</label>
                    <label className="inline-flex items-center gap-1.5 bg-[#00e652]/10 hover:bg-[#00e652] text-[#00e652] hover:text-black border border-[#00e652]/30 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition">
                      <Plus className="w-3 h-3" />
                      <span>AGREGAR FOTO DESDE DISPOSITIVO</span>
                      <input 
                        type="file" 
                        accept="image/*"
                        onChange={(e) => handleImageFileUpload(e, 'gallery')}
                        className="hidden" 
                      />
                    </label>
                  </div>

                  {editingJersey.images && editingJersey.images.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pt-1">
                      {editingJersey.images.map((imgUrl, idx) => (
                        <div key={idx} className="relative w-16 h-20 bg-black border border-white/20 rounded-lg overflow-hidden group">
                          <img src={imgUrl} alt={`Detalle ${idx + 1}`} referrerPolicy="no-referrer" onError={handleImageError} className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => {
                              const updatedGallery = (editingJersey.images || []).filter((_, i) => i !== idx);
                              setEditingJersey({ ...editingJersey, images: updatedGallery });
                            }}
                            className="absolute top-1 right-1 bg-red-600 text-white p-0.5 rounded-full hover:bg-red-700 opacity-0 group-hover:opacity-100 transition"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <p className="text-[10px] text-white/40 italic">No se han añadido fotos adicionales a la galería.</p>
                  )}
                </div>

              </div>

              {/* Sección 4: Tallas, Telas y Descripción */}
              <div className="space-y-3 bg-[#121212] p-4 border border-white/10 rounded-2xl">
                <h4 className="text-xs font-black uppercase text-[#00e652] tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#00e652]" />
                  <span>ESPECIFICACIONES TÉCNICAS Y TALLAS</span>
                </h4>

                <div className="space-y-3">
                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1.5">TALLAS DISPONIBLES EN STOCK:</label>
                    <div className="flex flex-wrap gap-2">
                      {(['S', 'M', 'L', 'XL', 'XXL'] as Size[]).map((sz) => {
                        const isSelected = (editingJersey.sizesAvailable || []).includes(sz);
                        return (
                          <button
                            key={sz}
                            type="button"
                            onClick={() => {
                              const currentSizes = editingJersey.sizesAvailable || [];
                              const newSizes = isSelected
                                ? currentSizes.filter(s => s !== sz)
                                : [...currentSizes, sz];
                              setEditingJersey({ ...editingJersey, sizesAvailable: newSizes });
                            }}
                            className={`px-3.5 py-1.5 text-xs font-black border transition cursor-pointer skew-x-[-10deg] ${
                              isSelected
                                ? 'bg-[#00e652] text-black border-[#00e652]'
                                : 'bg-black text-white/60 border-white/20 hover:border-white'
                            }`}
                          >
                            <span className="skew-x-[10deg] inline-block">{sz}</span>
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">MATERIAL Y TELA:</label>
                    <input
                      type="text"
                      placeholder="Ej: 100% Poliéster Reciclado Dri-FIT ADV / Heat.RDY"
                      value={editingJersey.fabricInfo || ''}
                      onChange={(e) => setEditingJersey({ ...editingJersey, fabricInfo: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-medium focus:border-[#00e652]"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">DESCRIPCIÓN DEL PRODUCTO:</label>
                    <textarea
                      rows={3}
                      placeholder="Escribe detalles del diseño, tecnología, historia o parches oficiales..."
                      value={editingJersey.description || ''}
                      onChange={(e) => setEditingJersey({ ...editingJersey, description: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-medium focus:border-[#00e652]"
                    />
                  </div>
                </div>
              </div>

              {/* Feedback and Alert Banners */}
              {jerseySaveStatus && (
                <div
                  className={`p-3 rounded-xl text-xs font-black flex items-center gap-2 ${
                    jerseySaveStatus.type === 'success'
                      ? 'bg-emerald-950/80 border border-emerald-500/50 text-[#00e652]'
                      : 'bg-rose-950/80 border border-rose-500/50 text-rose-300'
                  }`}
                >
                  {jerseySaveStatus.type === 'success' ? (
                    <Check className="w-4 h-4 stroke-[3]" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 stroke-[2.5]" />
                  )}
                  <span>{jerseySaveStatus.message}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-3 items-center">
                <button
                  type="button"
                  disabled={isSavingJersey}
                  onClick={() => {
                    setJerseySaveStatus(null);
                    setIsNewModalOpen(false);
                  }}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider rounded-xl transition cursor-pointer disabled:opacity-50"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  disabled={isSavingJersey}
                  className="px-8 py-2.5 bg-[#00e652] hover:bg-white text-black font-black uppercase tracking-widest cursor-pointer skew-x-[-10deg] transition shadow-2xl disabled:opacity-60 flex items-center gap-2"
                >
                  <span className="skew-x-[10deg] inline-flex items-center gap-2">
                    {isSavingJersey ? (
                      <>
                        <div className="w-4 h-4 border-2 border-black border-t-transparent rounded-full animate-spin" />
                        <span>GUARDANDO EN LA NUBE...</span>
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 stroke-[2.5]" />
                        <span>GUARDAR PUBLICACIÓN EN INVENTARIO</span>
                      </>
                    )}
                  </span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-60 bg-black/85 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 w-full max-w-xl text-white space-y-4">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black italic uppercase text-[#00e652]">
                DETALLES DE PEDIDO #{selectedOrder.id}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 bg-white/10 hover:bg-[#00e652] text-white hover:text-black">✕</button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <p><strong className="text-white/60">CLIENTE:</strong> {selectedOrder.customer.fullName} ({selectedOrder.customer.phone})</p>
              <p><strong className="text-white/60">CORREO:</strong> {selectedOrder.customer.email}</p>
              <p><strong className="text-white/60">DIRECCIÓN:</strong> {selectedOrder.customer.address}, {selectedOrder.customer.city}</p>
              <p><strong className="text-white/60">MÉTODO DE PAGO:</strong> {selectedOrder.paymentMethod.toUpperCase()}</p>
              
              <div className="bg-black p-3 border border-[#00e652]/40 rounded-xl space-y-1">
                <label className="block text-white/80 font-black text-[10px] uppercase">CAMBIAR ESTADO DEL PEDIDO:</label>
                <select
                  value={selectedOrder.status}
                  onChange={(e) => {
                    const newStatus = e.target.value as OrderStatus;
                    handleStatusChange(selectedOrder.id, newStatus);
                    setSelectedOrder({ ...selectedOrder, status: newStatus });
                  }}
                  className="w-full bg-[#121212] border border-[#00e652] text-[#00e652] font-black text-xs p-2 rounded-lg cursor-pointer"
                >
                  <option value="Solicitado">🟡 Solicitado (Pendiente de Verificación)</option>
                  <option value="Empaquetando">📦 Empaquetando (Preparando en Bodega)</option>
                  <option value="Listo">⚡ Listo (Listo para Despacho)</option>
                  <option value="Proceso de entrega">🚚 Proceso de entrega (En Ruta Correos CR/Mensajero)</option>
                  <option value="Entregado">✅ Entregado Exitosamente</option>
                  <option value="Cancelado">❌ Cancelado</option>
                  <option value="Pendiente">Pendiente</option>
                  <option value="En Proceso">En Proceso</option>
                  <option value="Enviado">Enviado</option>
                </select>
              </div>

              <div className="border-t border-white/10 pt-2 space-y-2">
                <p className="font-black text-[#00e652] uppercase">PRODUCTOS:</p>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 bg-black border border-white/10 flex justify-between">
                    <div>
                      <p className="font-bold text-white">{it.jersey.name} (TALLA: {it.size})</p>
                      {it.customStamping?.enabled && (
                        <p className="text-[10px] text-[#00e652]">DORSAL: {it.customStamping.name} #{it.customStamping.number}</p>
                      )}
                    </div>
                    <span className="font-black text-[#00e652]">{it.quantity} x {formatPrice(it.jersey.price, currency)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-2 flex justify-between font-black text-sm">
                <span className="uppercase text-white/60">TOTAL:</span>
                <span className="text-[#00e652]">{formatPrice(selectedOrder.total, currency)}</span>
              </div>
            </div>

            <button
              onClick={() => setSelectedOrder(null)}
              className="w-full py-3 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-widest cursor-pointer"
            >
              CERRAR
            </button>
          </div>
        </div>
      )}

      {/* CUSTOM IN-APP DELETE CONFIRMATION MODAL */}
      {deleteTarget && (
        <div className="fixed inset-0 z-[120] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="bg-[#121212] border-2 border-rose-500/50 rounded-2xl max-w-sm sm:max-w-md w-full p-6 shadow-2xl space-y-4 text-center">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-500 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6 stroke-[2.5]" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-xl font-black italic uppercase text-white">
                ¿ELIMINAR {deleteTarget.type === 'jersey' ? 'CAMISETA' : 'CUPÓN'}?
              </h3>
              <p className="text-xs text-white/70 font-medium leading-relaxed">
                ¿Estás seguro de que deseas eliminar permanentemente{' '}
                <span className="text-[#00e652] font-bold">"{deleteTarget.title}"</span>? Esta acción no se podrá deshacer.
              </p>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => setDeleteTarget(null)}
                className="flex-1 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase py-3 rounded-xl transition cursor-pointer"
              >
                CANCELAR
              </button>
              <button
                type="button"
                onClick={confirmDeleteAction}
                className="flex-1 bg-rose-600 hover:bg-rose-500 text-white font-black text-xs uppercase py-3 rounded-xl shadow-lg transition cursor-pointer flex items-center justify-center gap-1.5"
              >
                <Trash2 className="w-4 h-4 stroke-[2.5]" />
                <span>ELIMINAR</span>
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

