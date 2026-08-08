import React, { useState } from 'react';
import { X, Search, PackageCheck, Clock, Truck, CheckCircle2, AlertCircle, ShoppingBag, MessageCircle, ExternalLink } from 'lucide-react';
import { Order, OrderStatus, StoreSettings } from '../types';
import { formatPrice } from '../utils/storage';
import { handleImageError } from '../utils/imageUtils';

interface CustomerOrderHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  orders: Order[];
  currency: 'CRC' | 'USD';
  settings?: StoreSettings;
}

export const CustomerOrderHistoryModal: React.FC<CustomerOrderHistoryModalProps> = ({
  isOpen,
  onClose,
  orders,
  currency,
  settings
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const contactPhoneClean = (settings?.contactPhone || '+506 8559 5192').replace(/[^0-9]/g, '');

  // Filter orders matching phone, email, or order ID
  const cleanSearch = searchQuery.trim().toLowerCase();
  const matchedOrders = orders.filter(order => {
    if (!cleanSearch) return false;
    const matchId = order.id.toLowerCase().includes(cleanSearch);
    const matchPhone = order.customer.phone.toLowerCase().replace(/[^0-9]/g, '').includes(cleanSearch.replace(/[^0-9]/g, ''));
    const matchEmail = order.customer.email.toLowerCase().includes(cleanSearch);
    const matchName = order.customer.fullName.toLowerCase().includes(cleanSearch);
    return matchId || matchPhone || matchEmail || matchName;
  });

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setHasSearched(true);
  };

  const getStatusBadge = (status: OrderStatus) => {
    switch (status) {
      case 'Solicitado':
      case 'Pendiente':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-500/20 text-amber-400 border border-amber-500/40">
            <Clock className="w-3.5 h-3.5" />
            Solicitado / Pendiente de Verificación
          </span>
        );
      case 'Empaquetando':
      case 'En Proceso':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-blue-500/20 text-blue-400 border border-blue-500/40">
            <PackageCheck className="w-3.5 h-3.5" />
            Empaquetando en Bodega
          </span>
        );
      case 'Listo':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Listo para Despacho
          </span>
        );
      case 'Proceso de entrega':
      case 'Enviado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-purple-500/20 text-purple-400 border border-purple-500/40">
            <Truck className="w-3.5 h-3.5" />
            Proceso de Entrega (Correos CR / Mensajero)
          </span>
        );
      case 'Entregado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-emerald-500/20 text-emerald-400 border border-emerald-500/40">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Entregado Exitosamente
          </span>
        );
      case 'Cancelado':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-rose-500/20 text-rose-400 border border-rose-500/40">
            <AlertCircle className="w-3.5 h-3.5" />
            Pedido Cancelado
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-gray-500/20 text-gray-300 border border-gray-500/40">
            {status}
          </span>
        );
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-[#121212] border border-white/20 rounded-2xl w-full max-w-3xl text-white shadow-2xl my-auto overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-black via-[#1a1a1a] to-black border-b border-white/10 p-5 flex justify-between items-center relative">
          <div>
            <div className="flex items-center gap-2">
              <PackageCheck className="w-6 h-6 text-[#ccff00]" />
              <h2 className="text-xl font-black italic tracking-tight uppercase text-white">
                HISTORIAL & RASTREO DE COMPRAS
              </h2>
            </div>
            <p className="text-xs text-white/60 font-medium mt-1">
              Consulta tus pedidos realizados en OFFSIDE Sports Costa Rica
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 bg-white/10 hover:bg-white/20 text-white rounded-full transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 space-y-6 max-h-[80vh] overflow-y-auto">
          
          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="space-y-2">
            <label className="block text-xs font-black uppercase tracking-wider text-[#ccff00]">
              BUSCAR TUS PEDIDOS (POR TELÉFONO, EMAIL O # DE PEDIDO):
            </label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Ej: 8559 5192, Juan Pérez, juan@gmail.com o #OFF-101..."
                  className="w-full bg-black border border-white/20 rounded-xl py-3 pl-10 pr-4 text-xs font-bold text-white placeholder-white/40 focus:outline-none focus:border-[#ccff00] transition"
                  required
                />
                <Search className="w-4 h-4 text-white/40 absolute left-3.5 top-3.5" />
              </div>
              <button
                type="submit"
                className="bg-[#ccff00] hover:bg-white text-black font-black px-6 py-3 rounded-xl uppercase text-xs tracking-wider transition shadow-md cursor-pointer"
              >
                BUSCAR
              </button>
            </div>
            <p className="text-[11px] text-white/50">
              💡 Tip: Puedes ingresar tu número de teléfono (+506 8559 5192), tu correo o tu código de pedido (ej: #OFF-101)
            </p>
          </form>

          {/* Search Results */}
          {hasSearched && (
            <div className="space-y-4">
              <div className="flex items-center justify-between border-b border-white/10 pb-2">
                <span className="text-xs font-black uppercase text-white/80">
                  RESULTADOS DE BÚSQUEDA ({matchedOrders.length}):
                </span>
                {matchedOrders.length > 0 && (
                  <span className="text-[11px] text-[#ccff00] font-bold">
                    ✓ Todos los pedidos guardados correctamente
                  </span>
                )}
              </div>

              {matchedOrders.length === 0 ? (
                <div className="bg-black/50 border border-white/10 rounded-xl p-8 text-center space-y-3">
                  <ShoppingBag className="w-12 h-12 text-white/20 mx-auto" />
                  <p className="text-sm font-bold text-white/80">
                    No encontramos pedidos asociados a "{searchQuery}"
                  </p>
                  <p className="text-xs text-white/50 max-w-md mx-auto">
                    Verifica que el número telefónico o correo coincida exactamente con el de tu compra, o realiza una consulta directa a nuestro WhatsApp.
                  </p>
                  <a
                    href={`https://wa.me/${contactPhoneClean}?text=${encodeURIComponent(`Hola OFFSIDE Sports! Quisiera consultar sobre el estado de mi compra a nombre de "${searchQuery}".`)}`}
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2 rounded-lg text-xs uppercase transition mt-2"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Consultar a Soporte WhatsApp
                  </a>
                </div>
              ) : (
                <div className="space-y-4">
                  {matchedOrders.map((order) => (
                    <div
                      key={order.id}
                      className="bg-black border border-white/15 hover:border-[#ccff00]/40 rounded-xl p-4 sm:p-5 space-y-4 transition"
                    >
                      {/* Order Header */}
                      <div className="flex flex-wrap justify-between items-start gap-2 border-b border-white/10 pb-3">
                        <div>
                          <div className="flex items-center gap-3">
                            <span className="text-sm font-black text-[#ccff00] tracking-wider">
                              {order.id}
                            </span>
                            <span className="text-xs text-white/50 font-medium">
                              {order.date}
                            </span>
                          </div>
                          <p className="text-xs font-bold text-white/80 mt-1">
                            Cliente: {order.customer.fullName} ({order.customer.phone})
                          </p>
                        </div>
                        <div>
                          {getStatusBadge(order.status)}
                        </div>
                      </div>

                      {/* Items */}
                      <div className="space-y-2">
                        <span className="text-[10px] font-black uppercase text-white/40 tracking-widest">
                          PRENDAS PEDIDAS ({order.items.reduce((s, i) => s + i.quantity, 0)}):
                        </span>
                        <div className="divide-y divide-white/5">
                          {order.items.map((item, idx) => (
                            <div key={idx} className="py-2 flex items-center justify-between gap-3 text-xs">
                              <div className="flex items-center gap-3">
                                <img
                                  src={item.jersey.image}
                                  alt={item.jersey.name}
                                  referrerPolicy="no-referrer"
                                  onError={handleImageError}
                                  className="w-12 h-12 object-cover rounded-lg border border-white/10 bg-white/5"
                                />
                                <div>
                                  <p className="font-bold text-white leading-tight">
                                    {item.jersey.name}
                                  </p>
                                  <div className="flex flex-wrap gap-2 text-[11px] text-white/60 mt-0.5">
                                    <span>Talla: <strong className="text-[#ccff00]">{item.size}</strong></span>
                                    <span>• Cant: {item.quantity}</span>
                                    {item.customStamping?.enabled && (
                                      <span className="text-amber-300 font-bold">
                                        ✨ Estampado: {item.customStamping.name} #{item.customStamping.number}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="font-black text-white text-right">
                                {formatPrice(item.jersey.price * item.quantity, currency)}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Summary Footer */}
                      <div className="bg-white/5 rounded-lg p-3 flex flex-wrap justify-between items-center gap-3 border border-white/10">
                        <div className="text-xs space-y-0.5">
                          <p className="text-white/60">
                            Método de Pago: <strong className="text-white uppercase">{order.paymentMethod.replace('_', ' ')}</strong>
                          </p>
                          <p className="text-white/60">
                            Dirección de Envío: <strong className="text-white">{order.customer.address}, {order.customer.city}</strong>
                          </p>
                        </div>
                        <div className="text-right">
                          <span className="text-[10px] font-black text-white/50 uppercase block">TOTAL PAGADO</span>
                          <span className="text-base font-black text-[#ccff00]">
                            {formatPrice(order.total, currency)}
                          </span>
                        </div>
                      </div>

                      {/* Actions */}
                      <div className="pt-1 flex flex-wrap gap-2 justify-end">
                        <a
                          href={`https://wa.me/${contactPhoneClean}?text=${encodeURIComponent(
                            `Hola OFFSIDE Sports! ⚽ Quisiera consultar por el envío de mi pedido ${order.id} a nombre de ${order.customer.fullName}. Adjunto comprobante.`
                          )}`}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white font-black px-4 py-2 rounded-lg text-xs uppercase transition shadow cursor-pointer"
                        >
                          <MessageCircle className="w-4 h-4" />
                          Enviar Comprobante o Consultar Estado por WhatsApp
                        </a>
                      </div>

                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Persistent Guarantee Note */}
          <div className="bg-[#ccff00]/10 border border-[#ccff00]/30 rounded-xl p-4 text-xs space-y-1">
            <h4 className="font-black text-[#ccff00] uppercase tracking-wider flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4" />
              ¿CÓMO FUNCIONA EL GUARDADO DE DATOS?
            </h4>
            <p className="text-white/80 leading-relaxed">
              Todos los datos de tu compra (productos, personalizados, direcciones y comprobantes) quedan respaldados de forma persistente en nuestra plataforma y base de datos local.
            </p>
          </div>

        </div>

      </div>
    </div>
  );
};
