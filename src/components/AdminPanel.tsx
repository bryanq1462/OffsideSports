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
  ShieldCheck
} from 'lucide-react';
import { Jersey, Order, OrderStatus, League, JerseyType } from '../types';
import { formatPrice } from '../utils/storage';
import { INITIAL_LEAGUES } from '../data/mockData';

interface AdminPanelProps {
  jerseys: Jersey[];
  orders: Order[];
  currency: 'CRC' | 'USD';
  onUpdateJerseys: (updated: Jersey[]) => void;
  onUpdateOrders: (updated: Order[]) => void;
  onClose: () => void;
}

export const AdminPanel: React.FC<AdminPanelProps> = ({
  jerseys,
  orders,
  currency,
  onUpdateJerseys,
  onUpdateOrders,
  onClose
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState('');

  const [activeTab, setActiveTab] = useState<'inventory' | 'orders' | 'stats'>('inventory');

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

  // Save/Update Jersey Handler
  const handleSaveJersey = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingJersey || !editingJersey.name || !editingJersey.team) return;

    if (editingJersey.id) {
      // Edit existing
      const updated = jerseys.map(j => j.id === editingJersey.id ? (editingJersey as Jersey) : j);
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
        yearSeason: editingJersey.yearSeason || '2024/2025',
        type: (editingJersey.type as JerseyType) || 'Local',
        image: editingJersey.image || 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?auto=format&fit=crop&q=80&w=800',
        sizesAvailable: editingJersey.sizesAvailable || ['S', 'M', 'L', 'XL'],
        description: editingJersey.description || 'Camiseta oficial con tela de alta definición.',
        rating: 5.0,
        reviewsCount: 1,
        stock: Number(editingJersey.stock) || 20,
        badgeTags: ['Nueva Adición']
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
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl p-6 w-full max-w-2xl text-white space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-base font-black italic uppercase text-white">
                {editingJersey.id ? 'EDITAR CAMISETA' : 'AGREGAR NUEVA CAMISETA AL INVENTARIO'}
              </h3>
              <button onClick={() => setIsNewModalOpen(false)} className="p-1 bg-white/10 hover:bg-[#ccff00] text-white hover:text-black">✕</button>
            </div>

            <form onSubmit={handleSaveJersey} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block text-[#ccff00] font-black uppercase tracking-wider mb-1">NOMBRE DE LA CAMISETA:</label>
                  <input
                    type="text"
                    required
                    value={editingJersey.name || ''}
                    onChange={(e) => setEditingJersey({ ...editingJersey, name: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="block text-[#ccff00] font-black uppercase tracking-wider mb-1">EQUIPO / CLUB:</label>
                  <input
                    type="text"
                    required
                    value={editingJersey.team || ''}
                    onChange={(e) => setEditingJersey({ ...editingJersey, team: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="block text-[#ccff00] font-black uppercase tracking-wider mb-1">LIGA / TORNEO:</label>
                  <select
                    value={editingJersey.league || 'LaLiga'}
                    onChange={(e) => setEditingJersey({ ...editingJersey, league: e.target.value as League })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#ccff00]"
                  >
                    {INITIAL_LEAGUES.map(lg => <option key={lg} value={lg}>{lg}</option>)}
                  </select>
                </div>

                <div>
                  <label className="block text-[#ccff00] font-black uppercase tracking-wider mb-1">PRECIO ($ USD):</label>
                  <input
                    type="number"
                    required
                    value={editingJersey.price || 60}
                    onChange={(e) => setEditingJersey({ ...editingJersey, price: Number(e.target.value) })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="block text-[#ccff00] font-black uppercase tracking-wider mb-1">STOCK DISPONIBLE:</label>
                  <input
                    type="number"
                    required
                    value={editingJersey.stock || 20}
                    onChange={(e) => setEditingJersey({ ...editingJersey, stock: Number(e.target.value) })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-bold focus:border-[#ccff00]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[#ccff00] font-black uppercase tracking-wider mb-1">URL DE LA IMAGEN:</label>
                  <input
                    type="url"
                    required
                    value={editingJersey.image || ''}
                    onChange={(e) => setEditingJersey({ ...editingJersey, image: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-mono focus:border-[#ccff00]"
                  />
                </div>

                <div className="col-span-2">
                  <label className="block text-[#ccff00] font-black uppercase tracking-wider mb-1">DESCRIPCIÓN:</label>
                  <textarea
                    rows={2}
                    value={editingJersey.description || ''}
                    onChange={(e) => setEditingJersey({ ...editingJersey, description: e.target.value })}
                    className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-white font-medium focus:border-[#ccff00]"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsNewModalOpen(false)}
                  className="px-4 py-2 bg-white/10 hover:bg-white/20 text-white font-black uppercase tracking-wider"
                >
                  CANCELAR
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-[#ccff00] hover:bg-white text-black font-black uppercase tracking-wider cursor-pointer skew-x-[-10deg]"
                >
                  <span className="skew-x-[10deg] inline-block">GUARDAR EN INVENTARIO</span>
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

