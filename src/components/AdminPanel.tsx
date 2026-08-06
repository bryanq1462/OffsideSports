import React, { useState } from 'react';
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
  Save
} from 'lucide-react';
import { Jersey, Order, OrderStatus, League, JerseyType, Size, StoreSettings } from '../types';
import { formatPrice } from '../utils/storage';
import { INITIAL_LEAGUES } from '../data/mockData';

interface AdminPanelProps {
  jerseys: Jersey[];
  orders: Order[];
  currency: 'CRC' | 'USD';
  settings: StoreSettings;
  onUpdateJerseys: (updated: Jersey[]) => void;
  onUpdateOrders: (updated: Order[]) => void;
  onUpdateSettings: (updated: StoreSettings) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  jerseys,
  orders,
  currency,
  settings,
  onUpdateJerseys,
  onUpdateOrders,
  onUpdateSettings,
  onClose
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'inventory' | 'settings' | 'orders' | 'stats'>('inventory');

  // Settings State
  const [localSettings, setLocalSettings] = useState<StoreSettings>(settings);
  const [settingsSavedMessage, setSettingsSavedMessage] = useState(false);

  // Search in admin
  const [adminSearch, setAdminSearch] = useState('');
  const [orderStatusFilter, setOrderStatusFilter] = useState<string>('all');

  // Jersey Add/Edit Modal
  const [editingJersey, setEditingJersey] = useState<Partial<Jersey> | null>(null);
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

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

  // Image Upload Handler (reads local file from disk and converts to Base64)
  const handleImageFileUpload = (
    e: React.ChangeEvent<HTMLInputElement>,
    field: 'image' | 'backImage' | 'gallery'
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      if (typeof reader.result === 'string') {
        if (field === 'gallery') {
          const currentImages = editingJersey?.images || [];
          setEditingJersey(prev => ({
            ...prev,
            images: [...currentImages, reader.result as string]
          }));
        } else {
          setEditingJersey(prev => ({
            ...prev,
            [field]: reader.result as string
          }));
        }
      }
    };
    reader.readAsDataURL(file);
  };

  // Save/Update Jersey Handler
  const handleSaveJersey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJersey || !editingJersey.name || !editingJersey.team) return;

    if (editingJersey.id) {
      // Edit existing
      const updated = jerseys.map(j => j.id === editingJersey.id ? ({
        ...j,
        ...editingJersey,
        price: Number(editingJersey.price) || j.price,
        originalPrice: Number(editingJersey.originalPrice) || (editingJersey.price ? Math.round(Number(editingJersey.price) * 1.2) : j.originalPrice),
        stock: Number(editingJersey.stock) ?? j.stock
      } as Jersey) : j);
      onUpdateJerseys(updated);
    } else {
      // Create new
      const newJersey: Jersey = {
        id: `off-custom-${Date.now()}`,
        name: editingJersey.name || 'Nueva Camiseta',
        team: editingJersey.team || 'Equipo',
        league: (editingJersey.league as League) || 'LaLiga',
        price: Number(editingJersey.price) || 60,
        originalPrice: Number(editingJersey.originalPrice) || 75,
        yearSeason: editingJersey.yearSeason || '2025/2026',
        type: (editingJersey.type as JerseyType) || 'Local',
        image: editingJersey.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
        backImage: editingJersey.backImage,
        images: editingJersey.images || [],
        sizesAvailable: editingJersey.sizesAvailable || ['S', 'M', 'L', 'XL', 'XXL'],
        description: editingJersey.description || 'Camiseta oficial versión jugador con tela de alta definición.',
        fabricInfo: editingJersey.fabricInfo || '100% Poliéster Reciclado Dri-FIT ADV',
        rating: 5.0,
        reviewsCount: 1,
        stock: Number(editingJersey.stock) ?? 20,
        badgeTags: editingJersey.badgeTags || ['Nuevo Lanzamiento']
      };
      onUpdateJerseys([newJersey, ...jerseys]);
    }

    setEditingJersey(null);
    setIsNewModalOpen(false);
  };

  // Delete Jersey
  const handleDeleteJersey = (id: string) => {
    if (confirm('¿Estás seguro de eliminar esta camiseta del inventario?')) {
      onUpdateJerseys(jerseys.filter(j => j.id !== id));
    }
  };

  // Change Order Status
  const handleStatusChange = (orderId: string, newStatus: OrderStatus) => {
    const updated = orders.map(o => o.id === orderId ? { ...o, status: newStatus } : o);
    onUpdateOrders(updated);
  };
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (adminPassword === 'admin' || adminPassword === 'admin123' || adminPassword === 'offside' || adminPassword === 'offside2026') {
      setIsAuthenticated(true);
    } else {
      setLoginError('Contraseña administrativa incorrecta.');
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="fixed inset-0 z-50 overflow-y-auto bg-black/90 backdrop-blur-md flex items-center justify-center p-4">
        <div className="relative w-full max-w-md bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl p-6 text-white animate-in zoom-in-95">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-[#ccff00] text-white hover:text-black transition cursor-pointer rounded-full"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>

          <div className="text-center space-y-3 mb-6">
            <div className="w-14 h-14 bg-[#ccff00] text-black mx-auto flex items-center justify-center rounded-2xl skew-x-[-10deg] shadow-lg">
              <ShieldCheck className="w-8 h-8 stroke-[2.5] skew-x-[10deg]" />
            </div>
            <div>
              <span className="bg-[#ccff00] text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-widest rounded-sm">
                ACCESO RESTRINGIDO
              </span>
              <h2 className="text-xl font-black italic uppercase text-white mt-2">PANEL ADMINISTRATIVO</h2>
              <p className="text-xs text-white/60 mt-1">Ingresa con tu cuenta de administrador autorizada de OFFSIDE Sports</p>
            </div>
          </div>

          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] font-black text-[#ccff00] uppercase tracking-widest mb-1">
                CORREO DE ADMINISTRADOR
              </label>
              <input
                type="email"
                required
                placeholder="admin@offsidesports.cr"
                value={adminEmail}
                onChange={(e) => setAdminEmail(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-3 text-xs text-white font-bold placeholder-white/30 focus:border-[#ccff00] outline-none"
              />
            </div>

            <div>
              <label className="block text-[10px] font-black text-[#ccff00] uppercase tracking-widest mb-1">
                CONTRASEÑA ADMINISTRATIVA
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={adminPassword}
                onChange={(e) => setAdminPassword(e.target.value)}
                className="w-full bg-black border border-white/20 rounded-xl px-3.5 py-3 text-xs text-white font-bold placeholder-white/30 focus:border-[#ccff00] outline-none"
              />
            </div>

            {loginError && (
              <p className="text-xs font-bold text-rose-400 bg-rose-950/50 border border-rose-500/30 p-2.5 rounded-xl text-center">
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="w-full bg-[#ccff00] hover:bg-white text-black font-black py-3.5 rounded-xl text-xs uppercase tracking-widest transition cursor-pointer shadow-xl skew-x-[-10deg] mt-2"
            >
              <span className="skew-x-[10deg] inline-block">INGRESAR AL PANEL</span>
            </button>
          </form>
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
            <div className="p-2.5 bg-[#ccff00] text-black skew-x-[-10deg]">
              <ShieldCheck className="w-6 h-6 stroke-[2.5] skew-x-[10deg]" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-black italic uppercase text-white tracking-wider">PANEL ADMINISTRATIVO</h2>
                <span className="bg-[#ccff00] text-black text-[10px] font-black uppercase px-2 py-0.5 tracking-widest">
                  OFFSIDE ADMIN
                </span>
              </div>
              <p className="text-xs text-white/60 font-semibold mt-0.5">Control total de inventario de camisetas y gestión de pedidos</p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-[#ccff00] text-white hover:text-black transition cursor-pointer"
          >
            <X className="w-5 h-5 stroke-[2.5]" />
          </button>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="px-6 py-3 bg-[#121212] border-b border-white/10 flex flex-wrap items-center justify-between gap-4 text-xs font-black uppercase tracking-wider">
          <div className="flex gap-2">
            <button
              onClick={() => setActiveTab('inventory')}
              className={`px-4 py-2 flex items-center gap-2 transition cursor-pointer skew-x-[-10deg] ${
                activeTab === 'inventory'
                  ? 'bg-[#ccff00] text-black font-black'
                  : 'bg-black text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <Package className="w-4 h-4 stroke-[2.5]" />
                <span>INVENTARIO ({jerseys.length})</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('settings')}
              className={`px-4 py-2 flex items-center gap-2 transition cursor-pointer skew-x-[-10deg] ${
                activeTab === 'settings'
                  ? 'bg-[#ccff00] text-black font-black'
                  : 'bg-black text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <SettingsIcon className="w-4 h-4 stroke-[2.5]" />
                <span>PRECIOS & CONFIGURACIÓN</span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab('orders')}
              className={`px-4 py-2 flex items-center gap-2 transition cursor-pointer skew-x-[-10deg] ${
                activeTab === 'orders'
                  ? 'bg-[#ccff00] text-black font-black'
                  : 'bg-black text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <ShoppingBag className="w-4 h-4 stroke-[2.5]" />
                <span>PEDIDOS ({orders.length})</span>
                {pendingOrders > 0 && (
                  <span className="bg-black text-[#ccff00] border border-[#ccff00] text-[10px] px-1.5 py-0.2 font-black">
                    {pendingOrders}
                  </span>
                )}
              </div>
            </button>

            <button
              onClick={() => setActiveTab('stats')}
              className={`px-4 py-2 flex items-center gap-2 transition cursor-pointer skew-x-[-10deg] ${
                activeTab === 'stats'
                  ? 'bg-[#ccff00] text-black font-black'
                  : 'bg-black text-white/70 hover:bg-white/10'
              }`}
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <DollarSign className="w-4 h-4 stroke-[2.5]" />
                <span>ESTADÍSTICAS</span>
              </div>
            </button>
          </div>

          {activeTab === 'inventory' && (
            <button
              onClick={() => {
                setEditingJersey({
                  name: '',
                  team: '',
                  league: 'LaLiga',
                  price: 60,
                  originalPrice: 75,
                  stock: 20,
                  yearSeason: '2024/2025',
                  type: 'Local',
                  sizesAvailable: ['S', 'M', 'L', 'XL'],
                  image: 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800'
                });
                setIsNewModalOpen(true);
              }}
              className="bg-[#ccff00] hover:bg-white text-black px-5 py-2 flex items-center gap-2 font-black cursor-pointer shadow-xl skew-x-[-10deg]"
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <Plus className="w-4 h-4 stroke-[2.5]" />
                <span>AGREGAR NUEVA CAMISETA</span>
              </div>
            </button>
          )}
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          
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
                  className="w-full bg-black border border-white/20 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-white/40 focus:border-[#ccff00]"
                />
                <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 top-2.5" />
              </div>

              {/* Inventory Table */}
              <div className="bg-black border border-white/10 overflow-x-auto shadow-inner">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121212] border-b border-white/10 text-[#ccff00] uppercase font-black text-[10px] tracking-widest">
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
                            className="w-10 h-12 object-cover bg-black border border-white/20"
                          />
                          <div>
                            <p className="font-black italic uppercase text-white line-clamp-1">{jersey.name}</p>
                            <p className="text-[10px] text-[#ccff00] font-mono">{jersey.type} • {jersey.yearSeason}</p>
                          </div>
                        </td>

                        <td className="p-3">
                          <p className="font-bold text-white">{jersey.team}</p>
                          <p className="text-[10px] text-white/60">{jersey.league}</p>
                        </td>

                        <td className="p-3 font-black text-[#ccff00] text-sm italic">
                          {formatPrice(jersey.price, currency)}
                        </td>

                        <td className="p-3">
                          {jersey.stock > 0 ? (
                            <span className={`px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${
                              jersey.stock <= 5 ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'bg-[#ccff00]/20 text-[#ccff00] border border-[#ccff00]/40'
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
                              setIsNewModalOpen(true);
                            }}
                            className="p-1.5 bg-white/10 hover:bg-[#ccff00] text-white hover:text-black transition cursor-pointer"
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

          {/* TAB: STORE SETTINGS & PRICES */}
          {activeTab === 'settings' && (
            <div className="max-w-3xl mx-auto space-y-6 bg-black border border-white/10 rounded-3xl p-6 sm:p-8 shadow-2xl">
              <div className="border-b border-white/10 pb-4 space-y-1">
                <div className="inline-flex items-center gap-2 bg-[#ccff00]/10 border border-[#ccff00]/30 px-3 py-1 text-[11px] font-black uppercase text-[#ccff00] tracking-wider">
                  <SettingsIcon className="w-3.5 h-3.5" />
                  <span>AJUSTES GLOBALES DE LA TIENDA</span>
                </div>
                <h3 className="text-2xl font-black italic uppercase text-white">CONFIGURACIÓN DE PRECIOS & CONTACTO</h3>
                <p className="text-xs text-white/60 font-medium">
                  Modifica los costos globales de personalización de camisetas, tarifas de envío y los canales de atención al cliente.
                </p>
              </div>

              {settingsSavedMessage && (
                <div className="bg-[#ccff00] text-black p-4 font-black uppercase text-xs flex items-center justify-between shadow-xl animate-bounce">
                  <div className="flex items-center gap-2">
                    <Check className="w-5 h-5 stroke-[3]" />
                    <span>¡CONFIGURACIÓN GUARDADA Y ACTUALIZADA EN TODA LA PLATAFORMA!</span>
                  </div>
                </div>
              )}

              <form onSubmit={handleSaveSettingsSubmit} className="space-y-6 text-xs font-semibold">
                
                {/* Prices Section */}
                <div className="space-y-4 bg-[#121212] p-5 border border-white/10">
                  <h4 className="text-sm font-black italic uppercase text-[#ccff00] flex items-center gap-2">
                    <DollarSign className="w-4 h-4 stroke-[2.5]" />
                    <span>GESTIÓN DE PRECIOS GLOBALES</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="block font-black uppercase text-white tracking-wider">
                        PRECIO DE PERSONALIZACIÓN / ESTAMPADO ($ USD):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          required
                          value={localSettings.customizationPriceUSD}
                          onChange={(e) => setLocalSettings({ ...localSettings, customizationPriceUSD: Number(e.target.value) })}
                          className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-black text-sm focus:border-[#ccff00]"
                        />
                      </div>
                      <p className="text-[11px] text-[#ccff00] font-mono font-bold">
                        Equivalente: {formatPrice(localSettings.customizationPriceUSD, 'CRC')}
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-black uppercase text-white tracking-wider">
                        TARIFA DE ENVÍO ESTÁNDAR ($ USD):
                      </label>
                      <div className="relative">
                        <input
                          type="number"
                          step="0.5"
                          min="0"
                          required
                          value={localSettings.shippingFeeUSD}
                          onChange={(e) => setLocalSettings({ ...localSettings, shippingFeeUSD: Number(e.target.value) })}
                          className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-black text-sm focus:border-[#ccff00]"
                        />
                      </div>
                      <p className="text-[11px] text-[#ccff00] font-mono font-bold">
                        Equivalente: {formatPrice(localSettings.shippingFeeUSD, 'CRC')}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Contact & Messages Section */}
                <div className="space-y-4 bg-[#121212] p-5 border border-white/10">
                  <h4 className="text-sm font-black italic uppercase text-[#ccff00] flex items-center gap-2">
                    <Mail className="w-4 h-4 stroke-[2.5]" />
                    <span>CANALES DE MENSAJES & ATENCIÓN DIRECTA</span>
                  </h4>

                  <div className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="block font-black uppercase text-white tracking-wider flex items-center gap-2">
                        <Mail className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span>CORREO PARA RECIBIR MENSAJES DIRECTOS:</span>
                      </label>
                      <input
                        type="email"
                        required
                        value={localSettings.contactEmail}
                        onChange={(e) => setLocalSettings({ ...localSettings, contactEmail: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold focus:border-[#ccff00]"
                        placeholder="contacto@offsidesports.cr"
                      />
                      <p className="text-[11px] text-white/50">
                        Dirección de correo a la que llegarán las consultas enviadas desde el formulario de contacto.
                      </p>
                    </div>

                    <div className="space-y-1.5">
                      <label className="block font-black uppercase text-white tracking-wider flex items-center gap-2">
                        <Phone className="w-3.5 h-3.5 text-[#ccff00]" />
                        <span>TELÉFONO DE ATENCIÓN & WHATSAPP / SINPE:</span>
                      </label>
                      <input
                        type="text"
                        required
                        value={localSettings.contactPhone}
                        onChange={(e) => setLocalSettings({ ...localSettings, contactPhone: e.target.value })}
                        className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold font-mono focus:border-[#ccff00]"
                        placeholder="+506 8559 5192"
                      />
                      <p className="text-[11px] text-white/50">
                        Número de WhatsApp usado en los botones flotantes, encabezado, pie de página y para cobros mediante SINPE Móvil.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="pt-2 flex justify-end">
                  <button
                    type="submit"
                    className="bg-[#ccff00] hover:bg-white text-black font-black uppercase px-8 py-4 text-xs tracking-widest skew-x-[-10deg] transition cursor-pointer shadow-2xl flex items-center gap-2"
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
                    className="w-full bg-black border border-white/20 rounded-xl py-2 pl-9 pr-4 text-xs text-white placeholder-white/40 focus:border-[#ccff00]"
                  />
                  <Search className="w-3.5 h-3.5 text-white/50 absolute left-3 top-2.5" />
                </div>

                <div className="flex items-center gap-2 text-xs">
                  <span className="text-white/70 font-black uppercase tracking-wider">ESTADO:</span>
                  <select
                    value={orderStatusFilter}
                    onChange={(e) => setOrderStatusFilter(e.target.value)}
                    className="bg-black border border-white/20 text-white font-bold rounded-xl py-1.5 px-3 focus:border-[#ccff00]"
                  >
                    <option value="all">Todos los Estados</option>
                    <option value="Pendiente">Pendiente</option>
                    <option value="En Proceso">En Proceso</option>
                    <option value="Enviado">Enviado</option>
                    <option value="Entregado">Entregado</option>
                    <option value="Cancelado">Cancelado</option>
                  </select>
                </div>
              </div>

              {/* Orders Table */}
              <div className="bg-black border border-white/10 overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-[#121212] border-b border-white/10 text-[#ccff00] uppercase font-black text-[10px] tracking-widest">
                    <tr>
                      <th className="p-3">ORDEN ID</th>
                      <th className="p-3">CLIENTE</th>
                      <th className="p-3">FECHA</th>
                      <th className="p-3">TOTAL</th>
                      <th className="p-3">ESTADO</th>
                      <th className="p-3 text-right">ACCIÓN</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/10">
                    {filteredOrders.map((order) => (
                      <tr key={order.id} className="hover:bg-white/5 transition">
                        <td className="p-3 font-mono font-black text-[#ccff00]">
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
                            className="bg-black border border-white/20 text-xs font-black uppercase rounded-lg px-2 py-1 text-[#ccff00] focus:outline-none"
                          >
                            <option value="Pendiente">Pendiente</option>
                            <option value="En Proceso">En Proceso</option>
                            <option value="Enviado">Enviado</option>
                            <option value="Entregado">Entregado</option>
                            <option value="Cancelado">Cancelado</option>
                          </select>
                        </td>
                        <td className="p-3 text-right">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="px-3 py-1.5 bg-[#ccff00] hover:bg-white text-black font-black uppercase tracking-wider text-[10px] cursor-pointer skew-x-[-10deg]"
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
                <p className="text-xs font-black uppercase tracking-widest text-[#ccff00]">VENTAS TOTALES</p>
                <p className="text-3xl font-black italic text-white">{formatPrice(totalRevenueUSD, currency)}</p>
                <p className="text-[10px] text-white/50 font-mono uppercase">Facturación acumulada</p>
              </div>

              <div className="p-5 bg-black border border-white/10 space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-[#ccff00]">TOTAL DE PEDIDOS</p>
                <p className="text-3xl font-black italic text-white">{orders.length}</p>
                <p className="text-[10px] text-white/50 font-mono uppercase">{pendingOrders} pedidos en proceso</p>
              </div>

              <div className="p-5 bg-black border border-white/10 space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-[#ccff00]">CATÁLOGO ACTIVO</p>
                <p className="text-3xl font-black italic text-white">{jerseys.length} MODELOS</p>
                <p className="text-[10px] text-white/50 font-mono uppercase">Disponibles en tienda</p>
              </div>

              <div className="p-5 bg-black border border-white/10 space-y-2">
                <p className="text-xs font-black uppercase tracking-widest text-[#ccff00]">BAJO STOCK</p>
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
                <div className="p-2 bg-[#ccff00] text-black skew-x-[-10deg]">
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
                className="p-2 bg-white/10 hover:bg-[#ccff00] text-white hover:text-black transition cursor-pointer"
              >
                <X className="w-4 h-4 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSaveJersey} className="space-y-5 text-xs font-semibold">
              
              {/* Sección 1: Datos Principales del Producto */}
              <div className="space-y-3 bg-[#121212] p-4 border border-white/10 rounded-2xl">
                <h4 className="text-xs font-black uppercase text-[#ccff00] tracking-wider flex items-center gap-2">
                  <Tag className="w-3.5 h-3.5 text-[#ccff00]" />
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
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#ccff00]"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">EQUIPO / CLUB / SELECCIÓN:</label>
                    <input
                      type="text"
                      required
                      placeholder="Ej: Barcelona, Argentina, Real Madrid"
                      value={editingJersey.team || ''}
                      onChange={(e) => setEditingJersey({ ...editingJersey, team: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#ccff00]"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">LIGA / COMPETICIÓN:</label>
                    <select
                      value={editingJersey.league || 'LaLiga'}
                      onChange={(e) => setEditingJersey({ ...editingJersey, league: e.target.value as League })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#ccff00]"
                    >
                      {INITIAL_LEAGUES.map(lg => <option key={lg} value={lg}>{lg}</option>)}
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">TIPO DE EDICIÓN:</label>
                    <select
                      value={editingJersey.type || 'Local'}
                      onChange={(e) => setEditingJersey({ ...editingJersey, type: e.target.value as JerseyType })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#ccff00]"
                    >
                      <option value="Local">Local (Home)</option>
                      <option value="Visitante">Visitante (Away)</option>
                      <option value="Tercera">Tercera (Third Kit)</option>
                      <option value="Edición Especial">Edición Especial</option>
                      <option value="Retro">Clásica Retro</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">TEMPORADA / AÑO:</label>
                    <input
                      type="text"
                      placeholder="2025/2026"
                      value={editingJersey.yearSeason || '2025/2026'}
                      onChange={(e) => setEditingJersey({ ...editingJersey, yearSeason: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#ccff00]"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 2: Precios y Stock */}
              <div className="space-y-3 bg-[#121212] p-4 border border-white/10 rounded-2xl">
                <h4 className="text-xs font-black uppercase text-[#ccff00] tracking-wider flex items-center gap-2">
                  <DollarSign className="w-3.5 h-3.5 text-[#ccff00]" />
                  <span>PRECIOS & INVENTARIO</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">PRECIO DE VENTA ($ USD):</label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={editingJersey.price || 60}
                      onChange={(e) => setEditingJersey({ ...editingJersey, price: Number(e.target.value) })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-[#ccff00] font-black text-sm focus:border-[#ccff00]"
                    />
                    <p className="text-[10px] text-white/50 mt-1">
                      En Colones: {formatPrice(editingJersey.price || 60, 'CRC')}
                    </p>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">PRECIO ANTERIOR ($ USD):</label>
                    <input
                      type="number"
                      min="0"
                      placeholder="75"
                      value={editingJersey.originalPrice || 75}
                      onChange={(e) => setEditingJersey({ ...editingJersey, originalPrice: Number(e.target.value) })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white/70 font-bold focus:border-[#ccff00]"
                    />
                    <p className="text-[10px] text-white/50 mt-1">Muestra descuento tachado</p>
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">STOCK DISPONIBLE:</label>
                    <input
                      type="number"
                      required
                      min="0"
                      value={editingJersey.stock ?? 20}
                      onChange={(e) => setEditingJersey({ ...editingJersey, stock: Number(e.target.value) })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#ccff00]"
                    />
                  </div>
                </div>
              </div>

              {/* Sección 3: Carga de Fotos (Dispositivo Local vs URL) */}
              <div className="space-y-4 bg-[#121212] p-4 border border-white/10 rounded-2xl">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase text-[#ccff00] tracking-wider flex items-center gap-2">
                    <ImageIcon className="w-3.5 h-3.5 text-[#ccff00]" />
                    <span>FOTOS DEL PRODUCTO (DESDE EL DISPOSITIVO O URL)</span>
                  </h4>
                  <span className="text-[10px] bg-[#ccff00]/10 text-[#ccff00] px-2 py-0.5 border border-[#ccff00]/30 font-black">
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
                            className="w-full h-full object-contain"
                          />
                          <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition">
                            <span className="text-[10px] text-[#ccff00] font-black uppercase">Vista Previa Frente</span>
                          </div>
                        </>
                      ) : (
                        <div className="text-center text-white/40 space-y-1">
                          <Upload className="w-6 h-6 mx-auto text-[#ccff00]" />
                          <p className="text-[10px]">Sin imagen principal</p>
                        </div>
                      )}
                    </div>

                    {/* File Upload Button */}
                    <div>
                      <label className="block w-full bg-[#ccff00] hover:bg-white text-black font-black uppercase text-[10px] tracking-wider text-center py-2 px-3 rounded-lg cursor-pointer transition">
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
                        className="w-full bg-[#121212] border border-white/20 rounded-lg p-2 text-white text-[11px] font-mono focus:border-[#ccff00]"
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
                      <label className="block w-full bg-white/10 hover:bg-[#ccff00] text-white hover:text-black font-black uppercase text-[10px] tracking-wider text-center py-2 px-3 rounded-lg cursor-pointer transition">
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
                        className="w-full bg-[#121212] border border-white/20 rounded-lg p-2 text-white text-[11px] font-mono focus:border-[#ccff00]"
                      />
                    </div>
                  </div>

                </div>

                {/* Galería de Fotos Adicionales */}
                <div className="pt-2 space-y-2 border-t border-white/10">
                  <div className="flex items-center justify-between">
                    <label className="block text-xs font-black uppercase text-white">3. GALERÍA ADICIONAL (DETALLES / PARCHES):</label>
                    <label className="inline-flex items-center gap-1.5 bg-[#ccff00]/10 hover:bg-[#ccff00] text-[#ccff00] hover:text-black border border-[#ccff00]/30 px-3 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider cursor-pointer transition">
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
                          <img src={imgUrl} alt={`Detalle ${idx + 1}`} className="w-full h-full object-cover" />
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
                <h4 className="text-xs font-black uppercase text-[#ccff00] tracking-wider flex items-center gap-2">
                  <Sparkles className="w-3.5 h-3.5 text-[#ccff00]" />
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
                                ? 'bg-[#ccff00] text-black border-[#ccff00]'
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
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-medium focus:border-[#ccff00]"
                    />
                  </div>

                  <div>
                    <label className="block text-white font-black uppercase tracking-wider mb-1">DESCRIPCIÓN DEL PRODUCTO:</label>
                    <textarea
                      rows={3}
                      placeholder="Escribe detalles del diseño, tecnología, historia o parches oficiales..."
                      value={editingJersey.description || ''}
                      onChange={(e) => setEditingJersey({ ...editingJersey, description: e.target.value })}
                      className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-medium focus:border-[#ccff00]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider rounded-xl transition cursor-pointer"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="px-8 py-2.5 bg-[#ccff00] hover:bg-white text-black font-black uppercase tracking-widest cursor-pointer skew-x-[-10deg] transition shadow-2xl"
                >
                  <span className="skew-x-[10deg] inline-block">GUARDAR PUBLICACIÓN EN INVENTARIO</span>
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
              <h3 className="text-base font-black italic uppercase text-[#ccff00]">
                DETALLES DE PEDIDO #{selectedOrder.id}
              </h3>
              <button onClick={() => setSelectedOrder(null)} className="p-1 bg-white/10 hover:bg-[#ccff00] text-white hover:text-black">✕</button>
            </div>

            <div className="space-y-3 text-xs font-mono">
              <p><strong className="text-white/60">CLIENTE:</strong> {selectedOrder.customer.fullName} ({selectedOrder.customer.phone})</p>
              <p><strong className="text-white/60">DIRECCIÓN:</strong> {selectedOrder.customer.address}, {selectedOrder.customer.city}</p>
              <p><strong className="text-white/60">MÉTODO DE PAGO:</strong> {selectedOrder.paymentMethod.toUpperCase()}</p>
              
              <div className="border-t border-white/10 pt-2 space-y-2">
                <p className="font-black text-[#ccff00] uppercase">PRODUCTOS:</p>
                {selectedOrder.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 bg-black border border-white/10 flex justify-between">
                    <div>
                      <p className="font-bold text-white">{it.jersey.name} (TALLA: {it.size})</p>
                      {it.customStamping?.enabled && (
                        <p className="text-[10px] text-[#ccff00]">DORSAL: {it.customStamping.name} #{it.customStamping.number}</p>
                      )}
                    </div>
                    <span className="font-black text-[#ccff00]">{it.quantity} x {formatPrice(it.jersey.price, currency)}</span>
                  </div>
                ))}
              </div>

              <div className="border-t border-white/10 pt-2 flex justify-between font-black text-sm">
                <span className="uppercase text-white/60">TOTAL:</span>
                <span className="text-[#ccff00]">{formatPrice(selectedOrder.total, currency)}</span>
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

    </div>
  );
};

