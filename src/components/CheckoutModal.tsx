import React, { useState } from 'react';
import { 
  X, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  MessageCircle, 
  ChevronLeft,
  Building2
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, CustomerInfo, PaymentMethod, Order, StoreSettings, Jersey } from '../types';
import { formatPrice } from '../utils/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  discount?: number;
  discountUSD?: number;
  currency: 'CRC' | 'USD';
  settings?: StoreSettings;
  onOrderCompleted: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  discount: discountProp,
  discountUSD,
  currency,
  settings,
  onOrderCompleted
}) => {
  if (!isOpen) return null;

  const phoneDisplay = settings?.contactPhone || '+506 8559 5192';
  const sinpeNumber = settings?.sinpePhone || settings?.contactPhone || '+506 8559 5192';
  const bankAccountHolder = settings?.bankAccountHolder || 'OFFSIDE Sports Costa Rica S.A.';
  const bankAccountIBAN = settings?.bankAccountIBAN || 'CR05015202001026384920';
  const bankName = settings?.bankName || 'BAC Credomatic Costa Rica';

  const stampFee = settings?.customizationPriceCRC ?? 0;
  const shippingFee = settings?.shippingFeeCRC ?? 2500;
  const discount = typeof discountProp === 'number' ? discountProp : (discountUSD || 0); // Discount amount in CRC

  const [step, setStep] = useState<'shipping' | 'payment' | 'processing' | 'success'>('shipping');

  // Customer Form
  const [customer, setCustomer] = useState<CustomerInfo>({
    fullName: '',
    email: '',
    phone: '',
    address: '',
    city: 'San José',
    notes: ''
  });

  // Payment Form - Only official Costa Rica methods: SINPE Móvil, IBAN Transfer & Cash on Delivery
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('sinpe_movil');
  const [sinpePhone, setSinpePhone] = useState('');

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Totals in CRC
  const calculateItemPrice = (item: CartItem) => {
    const itemPrice = item.jersey.priceCRC ?? item.jersey.price;
    const stampExtra = item.customStamping?.enabled ? stampFee : 0;
    return (itemPrice + stampExtra) * item.quantity;
  };

  const subtotal = cart.reduce((sum, item) => sum + calculateItemPrice(item), 0);
  const shipping = subtotal > 0 ? shippingFee : 0;
  const total = subtotal - discount + shipping;

  const handleShippingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customer.fullName || !customer.email || !customer.phone || !customer.address || !customer.city) {
      alert('Por favor completa todos los campos requeridos de envío.');
      return;
    }
    setStep('payment');
  };

  const handlePaymentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setStep('processing');

    setTimeout(() => {
      const orderId = `OFF-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleString('es-CR', { dateStyle: 'short', timeStyle: 'short' }),
        customer,
        items: cart.map(it => ({
          cartItemId: it.cartItemId,
          size: it.size,
          quantity: it.quantity,
          customStamping: it.customStamping,
          jersey: {
            id: it.jersey.id,
            name: it.jersey.name,
            team: it.jersey.team,
            league: it.jersey.league,
            price: it.jersey.price,
            priceCRC: it.jersey.priceCRC ?? it.jersey.price,
            image: it.jersey.image || '',
            type: it.jersey.type || 'Local',
            yearSeason: it.jersey.yearSeason || '2024/25',
            version: it.jersey.version || 'Versión Jugador (Player Issue)',
            genderCategory: it.jersey.genderCategory,
            stock: it.jersey.stock ?? 1,
            rating: it.jersey.rating ?? 5,
            reviewsCount: it.jersey.reviewsCount ?? 1,
            sizesAvailable: it.jersey.sizesAvailable || []
          } as Jersey
        })),
        subtotal: subtotal,
        discount: discount,
        shipping: shipping,
        total: total,
        paymentMethod,
        paymentDetails: paymentMethod === 'sinpe_movil' ? {
          phone: sinpePhone || customer.phone,
          referenceCode: `SINPE-${Math.floor(100000 + Math.random() * 900000)}`
        } : paymentMethod === 'bank_transfer' ? {
          iban: bankAccountIBAN,
          bank: bankName,
          referenceCode: `IBAN-${Math.floor(100000 + Math.random() * 900000)}`
        } : {
          type: 'Contra Entrega en Efectivo'
        },
        status: 'Pendiente',
        currency
      };

      setCompletedOrder(newOrder);
      onOrderCompleted(newOrder);
      setStep('success');

      // Trigger Celebration Confetti
      try {
        confetti({
          particleCount: 100,
          spread: 70,
          origin: { y: 0.6 }
        });
      } catch (err) {
        console.log(err);
      }
    }, 2200);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4">
      <div 
        className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white my-auto animate-in zoom-in-95 max-h-[90vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 bg-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#00e652] stroke-[2.5]" />
            <h2 className="text-sm font-black italic uppercase tracking-wider text-white">
              FINALIZAR PEDIDO | OFFSIDE SPORTS CR
            </h2>
          </div>

          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-[#00e652] text-white hover:text-black transition cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Wizard Progress Indicator */}
        {step !== 'success' && step !== 'processing' && (
          <div className="px-6 py-3 bg-[#121212] border-b border-white/10 flex justify-around text-xs font-black uppercase tracking-wider text-white/50">
            <div className={`flex items-center gap-1.5 ${step === 'shipping' ? 'text-[#00e652]' : 'text-white/40'}`}>
              <span className="w-5 h-5 bg-black border border-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>1. ENVÍO & CLIENTE</span>
            </div>
            <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-[#00e652]' : 'text-white/40'}`}>
              <span className="w-5 h-5 bg-black border border-white/20 flex items-center justify-center text-[10px]">2</span>
              <span>2. MÉTODO DE PAGO</span>
            </div>
          </div>
        )}

        {/* Scrollable Body */}
        <div className="overflow-y-auto flex-1">
          {/* Step 1: Shipping Information */}
        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit} className="p-6 space-y-4">
            <h3 className="text-sm font-black italic uppercase text-white">DATOS PARA LA ENTREGA DE TU PEDIDO:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-[#00e652] uppercase tracking-widest mb-1">NOMBRE COMPLETO *</label>
                <input
                  type="text"
                  required
                  placeholder="ej: Carlos Rodríguez"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#00e652]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#00e652] uppercase tracking-widest mb-1">CORREO ELECTRÓNICO *</label>
                <input
                  type="email"
                  required
                  placeholder="tuemail@ejemplo.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#00e652]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#00e652] uppercase tracking-widest mb-1">TELÉFONO WHATSAPP *</label>
                <input
                  type="tel"
                  required
                  placeholder="+506 8559 5192"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#00e652]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#00e652] uppercase tracking-widest mb-1">CANTÓN / CIUDAD *</label>
                <input
                  type="text"
                  required
                  placeholder="San José, Escazú, Heredia, Alajuela..."
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#00e652]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black text-[#00e652] uppercase tracking-widest mb-1">DIRECCIÓN EXACTA DE RESIDENCIA / TRABAJO *</label>
                <input
                  type="text"
                  required
                  placeholder="Carrera 15 # 85-30 Apto 401, Barrio El Retiro"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#00e652]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black text-[#00e652] uppercase tracking-widest mb-1">NOTAS DE ENTREGA (OPCIONAL)</label>
                <input
                  type="text"
                  placeholder="Dejar en portería, timbrar dos veces..."
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#00e652]"
                />
              </div>
            </div>

            {/* Order total preview */}
            <div className="p-3 bg-[#121212] border border-white/10 rounded-xl space-y-2 text-xs">
              <div className="flex justify-between items-center">
                <span className="text-white/70 font-black uppercase tracking-wider">RESUMEN ({cart.length} ÍTEMS):</span>
                <span className="text-[#00e652] font-black text-base italic">{formatPrice(total, currency)}</span>
              </div>
              <div className="space-y-1 pt-1 border-t border-white/5 max-h-24 overflow-y-auto">
                {cart.map((item) => (
                  <div key={item.cartItemId} className="flex justify-between items-center text-[11px]">
                    <span className="text-white/80 truncate max-w-[200px] sm:max-w-xs">{item.quantity}x {item.jersey.name}</span>
                    <span className="text-[#00e652] font-mono text-[10px] shrink-0">
                      Talla {item.size} {item.jersey.version ? `• ${item.jersey.version.replace(/\s*\(.*\)/, '')}` : ''}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#00e652] hover:bg-white text-black font-black px-8 py-3.5 text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-2xl skew-x-[-10deg]"
              >
                <div className="skew-x-[10deg] flex items-center gap-2">
                  <span>CONTINUAR A PAGO</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </div>
              </button>
            </div>
          </form>
        )}

        {/* Step 2: Payment Method */}
        {step === 'payment' && (
          <form onSubmit={handlePaymentSubmit} className="p-6 space-y-5">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setStep('shipping')}
                className="text-xs text-white/70 hover:text-[#00e652] flex items-center gap-1 font-black uppercase cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                <span>VOLVER A ENVÍO</span>
              </button>
              <span className="text-xs text-[#00e652] font-black uppercase italic">TOTAL: {formatPrice(total, currency)}</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase italic text-white">ELIGE TU MÉTODO DE PAGO:</label>
              
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('sinpe_movil')}
                  className={`p-3 border text-center transition flex flex-col items-center gap-1.5 cursor-pointer skew-x-[-10deg] ${
                    paymentMethod === 'sinpe_movil'
                      ? 'bg-[#00e652] text-black border-[#00e652] font-black'
                      : 'bg-black border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <div className="skew-x-[10deg] flex flex-col items-center">
                    <Smartphone className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-[10px] uppercase font-black tracking-wider mt-1">SINPE MÓVIL</span>
                    <span className="text-[9px] opacity-80 font-bold">Transferencia Inmediata</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('bank_transfer')}
                  className={`p-3 border text-center transition flex flex-col items-center gap-1.5 cursor-pointer skew-x-[-10deg] ${
                    paymentMethod === 'bank_transfer'
                      ? 'bg-[#00e652] text-black border-[#00e652] font-black'
                      : 'bg-black border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <div className="skew-x-[10deg] flex flex-col items-center">
                    <Building2 className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-[10px] uppercase font-black tracking-wider mt-1">TRANSFERENCIA IBAN</span>
                    <span className="text-[9px] opacity-80 font-bold">Depósito Bancario</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 border text-center transition flex flex-col items-center gap-1.5 cursor-pointer skew-x-[-10deg] ${
                    paymentMethod === 'cash'
                      ? 'bg-[#00e652] text-black border-[#00e652] font-black'
                      : 'bg-black border-white/10 text-white/70 hover:text-white'
                  }`}
                >
                  <div className="skew-x-[10deg] flex flex-col items-center">
                    <Banknote className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-[10px] uppercase font-black tracking-wider mt-1">CONTRA ENTREGA</span>
                    <span className="text-[9px] opacity-80 font-bold">Efectivo al Recibir</span>
                  </div>
                </button>
              </div>
            </div>

            {/* SINPE Móvil Details */}
            {paymentMethod === 'sinpe_movil' && (
              <div className="p-4 bg-[#121212] border border-[#00e652]/40 rounded-xl space-y-3 text-center">
                <div className="inline-flex items-center gap-1.5 bg-[#00e652]/10 border border-[#00e652]/30 px-3 py-1 text-[11px] font-black uppercase text-[#00e652]">
                  <Smartphone className="w-3.5 h-3.5" />
                  <span>INSTRUCCIONES PARA SINPE MÓVIL</span>
                </div>
                <p className="text-xs text-white/90 font-semibold">
                  Realiza la transferencia SINPE Móvil al número <strong className="text-[#00e652] font-mono text-sm">{sinpeNumber}</strong>
                </p>

                <div className="bg-black p-3 border border-white/10 rounded-xl text-left text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-bold">TITULAR REGISTRADO:</span>
                    <strong className="text-white font-bold">{bankAccountHolder}</strong>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-white/60 font-bold">MONTO TOTAL A TRANSFERIR:</span>
                    <strong className="text-[#00e652] font-mono font-black text-sm">{formatPrice(total, currency)}</strong>
                  </div>
                </div>

                <div>
                  <label className="block text-[10px] text-white/70 font-black uppercase tracking-wider mb-1">
                    TELÉFONO DESDE EL CUAL REALIZAS EL SINPE O NÚMERO DE COMPROBANTE:
                  </label>
                  <input
                    type="text"
                    placeholder="Ej: 8888 8888 o comprobante #10293"
                    value={sinpePhone}
                    onChange={(e) => setSinpePhone(e.target.value)}
                    className="w-full max-w-xs mx-auto bg-black border border-white/20 rounded-xl px-3 py-2 text-xs text-center font-mono font-black text-[#00e652] focus:border-[#00e652]"
                  />
                </div>
              </div>
            )}

            {/* Bank Transfer Details */}
            {paymentMethod === 'bank_transfer' && (
              <div className="p-4 bg-[#121212] border border-[#00e652]/40 rounded-xl space-y-3">
                <div className="flex items-center justify-between">
                  <div className="inline-flex items-center gap-1.5 bg-[#00e652]/10 border border-[#00e652]/30 px-3 py-1 text-[11px] font-black uppercase text-[#00e652]">
                    <Building2 className="w-3.5 h-3.5" />
                    <span>DATOS PARA TRANSFERENCIA BANCARIA / DEPÓSITO IBAN</span>
                  </div>
                  <span className="text-[10px] text-white/60 font-mono font-bold">COSTA RICA</span>
                </div>

                <div className="bg-black p-3.5 border border-white/15 rounded-xl space-y-2 text-xs">
                  <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                    <span className="text-white/60 uppercase font-black text-[10px]">BANCO DESTINO:</span>
                    <strong className="text-white font-bold">{bankName}</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                    <span className="text-white/60 uppercase font-black text-[10px]">TITULAR DE CUENTA:</span>
                    <strong className="text-white font-bold">{bankAccountHolder}</strong>
                  </div>
                  <div className="flex justify-between items-center border-b border-white/10 pb-1.5">
                    <span className="text-white/60 uppercase font-black text-[10px]">CUENTA IBAN:</span>
                    <strong className="text-[#00e652] font-mono font-black text-xs select-all">{bankAccountIBAN}</strong>
                  </div>
                  <div className="flex justify-between items-center pt-0.5">
                    <span className="text-white/60 uppercase font-black text-[10px]">MONTO TOTAL PRODUCTO + ENVÍO:</span>
                    <strong className="text-[#00e652] font-mono font-black text-sm">{formatPrice(total, currency)}</strong>
                  </div>
                </div>

                <p className="text-[11px] text-white/70 italic text-center">
                  Al confirmar tu pedido, podrás enviar el comprobante directamente a nuestro WhatsApp para preparar el despacho.
                </p>
              </div>
            )}

            {/* Cash on Delivery info */}
            {paymentMethod === 'cash' && (
              <div className="p-4 bg-[#121212] border border-white/10 rounded-xl text-center text-xs text-white/80 space-y-1.5">
                <div className="inline-flex items-center gap-1.5 bg-amber-400/10 border border-amber-400/30 px-3 py-1 text-[11px] font-black uppercase text-amber-400">
                  <Banknote className="w-3.5 h-3.5" />
                  <span>PAGAS EN EFECTIVO AL RECIBIR</span>
                </div>
                <p className="text-xs text-white/90 font-semibold mt-1">
                  Pagarás el total exacto de <strong className="text-[#00e652] font-black">{formatPrice(total, currency)}</strong> en efectivo al repartidor al momento de la entrega en tu dirección.
                </p>
                <p className="text-[11px] text-white/50">
                  Te contactaremos por WhatsApp para coordinar la hora aproximada de entrega.
                </p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#00e652] hover:bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-2xl skew-x-[-10deg]"
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>CONFIRMAR PEDIDO ({formatPrice(total, currency)})</span>
              </div>
            </button>
          </form>
        )}

        {/* Step 3: Processing Loader */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-5">
            <div className="w-16 h-16 mx-auto border-4 border-[#00e652] border-t-transparent animate-spin" />
            <div>
              <h3 className="text-xl font-black italic uppercase text-white">REGISTRANDO PEDIDO</h3>
              <p className="text-xs text-white/70 font-semibold mt-1">Guardando la orden y preparando tu comprobante...</p>
            </div>
          </div>
        )}

        {/* Step 4: Order Confirmation & Invoice Receipt */}
        {step === 'success' && completedOrder && (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-[#00e652]/20 border-2 border-[#00e652] flex items-center justify-center text-[#00e652] skew-x-[-10deg]">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5] skew-x-[10deg]" />
            </div>

            <div>
              <span className="bg-[#00e652] text-black font-black uppercase text-xs px-3 py-1 tracking-widest">
                ¡PEDIDO REGISTRADO EXITOSAMENTE!
              </span>
              <h3 className="text-3xl font-black italic uppercase text-white mt-3">
                GRACIAS POR TU COMPRA, {completedOrder.customer.fullName.split(' ')[0]}
              </h3>
              <p className="text-xs text-white/70 font-semibold mt-1">
                Tu orden <strong className="text-[#00e652] font-mono">{completedOrder.id}</strong> ha sido registrada con estado <strong className="text-amber-400 font-bold">Pendiente</strong>.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="p-4 bg-[#121212] border border-white/10 text-left text-xs space-y-3 font-mono">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-white/60 font-bold uppercase">NÚMERO DE ORDEN:</span>
                <span className="text-[#00e652] font-black">{completedOrder.id}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 uppercase">Fecha:</span>
                <span className="text-white font-bold">{completedOrder.date}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 uppercase">Cliente:</span>
                <span className="text-white font-bold">{completedOrder.customer.fullName} ({completedOrder.customer.city})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 uppercase">Dirección:</span>
                <span className="text-white font-bold">{completedOrder.customer.address}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-white/60 uppercase">Método Seleccionado:</span>
                <span className="text-white font-bold uppercase">
                  {completedOrder.paymentMethod === 'sinpe_movil' 
                    ? 'SINPE Móvil' 
                    : completedOrder.paymentMethod === 'bank_transfer' 
                    ? 'Transferencia IBAN' 
                    : 'Pago Contra Entrega'}
                </span>
              </div>
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-white/60 font-black uppercase">TOTAL A PAGAR:</span>
                <span className="text-[#00e652] font-black text-sm">{formatPrice(completedOrder.total, currency)}</span>
              </div>
            </div>

            {/* Instructions box based on method */}
            {completedOrder.paymentMethod === 'sinpe_movil' && (
              <div className="bg-[#00e652]/10 border border-[#00e652]/30 p-3.5 rounded-xl text-xs text-white/90 text-left space-y-1">
                <p className="font-black text-[#00e652] uppercase">PASO SIGUIENTE:</p>
                <p>
                  Transfiere los <strong>{formatPrice(completedOrder.total, currency)}</strong> vía SINPE Móvil al número <strong className="text-[#00e652]">{sinpeNumber}</strong> ({bankAccountHolder}) y presiona el botón inferior para adjuntar el comprobante por WhatsApp.
                </p>
              </div>
            )}

            {completedOrder.paymentMethod === 'bank_transfer' && (
              <div className="bg-[#00e652]/10 border border-[#00e652]/30 p-3.5 rounded-xl text-xs text-white/90 text-left space-y-1">
                <p className="font-black text-[#00e652] uppercase">PASO SIGUIENTE:</p>
                <p>
                  Realiza la transferencia al IBAN <strong className="text-[#00e652] select-all">{bankAccountIBAN}</strong> ({bankName}) y envía el comprobante por WhatsApp.
                </p>
              </div>
            )}

            {completedOrder.paymentMethod === 'cash' && (
              <div className="bg-amber-400/10 border border-amber-400/30 p-3.5 rounded-xl text-xs text-white/90 text-left space-y-1">
                <p className="font-black text-amber-400 uppercase">PAGO CONTRA ENTREGA CONFIRMADO:</p>
                <p>
                  Alistaremos tu pedido para despacho. Por favor ten a mano los <strong>{formatPrice(completedOrder.total, currency)}</strong> en efectivo al momento de la entrega.
                </p>
              </div>
            )}

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/${(settings?.contactPhone || '+506 8559 5192').replace(/[^0-9]/g, '') || '50685595192'}?text=${encodeURIComponent(
                  `Hola OFFSIDE Sports! ⚽ Acabo de registrar el pedido ${completedOrder.id} a nombre de ${completedOrder.customer.fullName}.\n\n` +
                  `📦 ÍTEMS SOLICITADOS:\n` +
                  completedOrder.items.map(it => `• ${it.quantity}x ${it.jersey.name} (Talla: ${it.size}${it.jersey.version ? ` - ${it.jersey.version}` : ''})`).join('\n') +
                  `\n\n💰 TOTAL: ${formatPrice(completedOrder.total, currency)}\n` +
                  `💳 MÉTODO: ${completedOrder.paymentMethod === 'sinpe_movil' ? 'SINPE Móvil' : completedOrder.paymentMethod === 'bank_transfer' ? 'Transferencia IBAN' : 'Pago Contra Entrega'}\n` +
                  `📍 ENTREGA: ${completedOrder.customer.address}, ${completedOrder.customer.city}\n\n` +
                  `Adjunto datos/comprobante para coordinar mi envío en Costa Rica.`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 bg-[#00e652] hover:bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-2xl skew-x-[-10deg]"
              >
                <div className="skew-x-[10deg] flex items-center gap-2">
                  <MessageCircle className="w-4 h-4 stroke-[2.5]" />
                  <span>CONFIRMAR POR WHATSAPP</span>
                </div>
              </a>

              <button
                onClick={onClose}
                className="flex-1 py-4 bg-white/10 hover:bg-white/20 text-white font-black text-xs uppercase tracking-widest cursor-pointer skew-x-[-10deg]"
              >
                <span className="skew-x-[10deg] inline-block">VOLVER AL CATÁLOGO</span>
              </button>
            </div>
          </div>
        )}
        </div>

      </div>
    </div>
  );
};

