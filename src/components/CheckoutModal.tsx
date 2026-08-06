import React, { useState } from 'react';
import { 
  X, 
  CreditCard, 
  Smartphone, 
  Banknote, 
  ShieldCheck, 
  CheckCircle2, 
  ArrowRight, 
  Lock, 
  MessageCircle, 
  ChevronLeft
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { CartItem, CustomerInfo, PaymentMethod, Order, StoreSettings } from '../types';
import { formatPrice } from '../utils/storage';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  discountUSD: number;
  currency: 'CRC' | 'USD';
  settings?: StoreSettings;
  onOrderCompleted: (newOrder: Order) => void;
}

export const CheckoutModal: React.FC<CheckoutModalProps> = ({
  isOpen,
  onClose,
  cart,
  discountUSD,
  currency,
  settings,
  onOrderCompleted
}) => {
  if (!isOpen) return null;

  const phoneDisplay = settings?.contactPhone || '+506 8559 5192';
  const stampFeeUSD = settings?.customizationPriceUSD ?? 10;
  const shippingFeeUSD = settings?.shippingFeeUSD ?? 5;

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

  // Payment Form
  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>('card');
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [sinpePhone, setSinpePhone] = useState('');

  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);

  // Totals
  const calculateItemPriceUSD = (item: CartItem) => {
    const stampExtra = item.customStamping?.enabled ? stampFeeUSD : 0;
    return (item.jersey.price + stampExtra) * item.quantity;
  };

  const subtotalUSD = cart.reduce((sum, item) => sum + calculateItemPriceUSD(item), 0);
  const shippingUSD = subtotalUSD > 0 ? shippingFeeUSD : 0;
  const totalUSD = subtotalUSD - discountUSD + shippingUSD;

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

    // Simulate Payment Gateway API Call
    setTimeout(() => {
      const orderId = `OFF-${Math.floor(1000 + Math.random() * 9000)}`;
      const newOrder: Order = {
        id: orderId,
        date: new Date().toLocaleString('es-CO', { dateStyle: 'short', timeStyle: 'short' }),
        customer,
        items: [...cart],
        subtotal: subtotalUSD,
        discount: discountUSD,
        shipping: shippingUSD,
        total: totalUSD,
        paymentMethod,
        paymentDetails: paymentMethod === 'card' ? {
          cardLast4: cardNumber.slice(-4) || '4242'
        } : {
          referenceCode: `REF-${Math.floor(100000 + Math.random() * 900000)}`
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
        className="relative w-full max-w-3xl bg-[#0a0a0a] border border-white/10 rounded-3xl shadow-2xl overflow-hidden text-white my-auto animate-in zoom-in-95"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Top Header */}
        <div className="p-5 border-b border-white/10 bg-black flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Lock className="w-4 h-4 text-[#ccff00] stroke-[2.5]" />
            <h2 className="text-sm font-black italic uppercase tracking-wider text-white">
              PASARELA DE PAGOS SEGURA | OFFSIDE SPORTS
            </h2>
          </div>

          {step !== 'processing' && (
            <button
              onClick={onClose}
              className="p-1.5 bg-white/10 hover:bg-[#ccff00] text-white hover:text-black transition cursor-pointer"
            >
              <X className="w-5 h-5 stroke-[2.5]" />
            </button>
          )}
        </div>

        {/* Wizard Progress Indicator */}
        {step !== 'success' && step !== 'processing' && (
          <div className="px-6 py-3 bg-[#121212] border-b border-white/10 flex justify-around text-xs font-black uppercase tracking-wider text-white/50">
            <div className={`flex items-center gap-1.5 ${step === 'shipping' ? 'text-[#ccff00]' : 'text-white/40'}`}>
              <span className="w-5 h-5 bg-black border border-white/20 flex items-center justify-center text-[10px]">1</span>
              <span>1. ENVÍO & CLIENTE</span>
            </div>
            <div className={`flex items-center gap-1.5 ${step === 'payment' ? 'text-[#ccff00]' : 'text-white/40'}`}>
              <span className="w-5 h-5 bg-black border border-white/20 flex items-center justify-center text-[10px]">2</span>
              <span>2. MÉTODO DE PAGO</span>
            </div>
          </div>
        )}

        {/* Step 1: Shipping Information */}
        {step === 'shipping' && (
          <form onSubmit={handleShippingSubmit} className="p-6 space-y-4">
            <h3 className="text-sm font-black italic uppercase text-white">DATOS PARA LA ENTREGA DE TU PEDIDO:</h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[10px] font-black text-[#ccff00] uppercase tracking-widest mb-1">NOMBRE COMPLETO *</label>
                <input
                  type="text"
                  required
                  placeholder="ej: Carlos Rodríguez"
                  value={customer.fullName}
                  onChange={(e) => setCustomer({ ...customer, fullName: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#ccff00] uppercase tracking-widest mb-1">CORREO ELECTRÓNICO *</label>
                <input
                  type="email"
                  required
                  placeholder="tuemail@ejemplo.com"
                  value={customer.email}
                  onChange={(e) => setCustomer({ ...customer, email: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#ccff00] uppercase tracking-widest mb-1">TELÉFONO WHATSAPP *</label>
                <input
                  type="tel"
                  required
                  placeholder="+506 8559 5192"
                  value={customer.phone}
                  onChange={(e) => setCustomer({ ...customer, phone: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="block text-[10px] font-black text-[#ccff00] uppercase tracking-widest mb-1">CANTÓN / CIUDAD *</label>
                <input
                  type="text"
                  required
                  placeholder="San José, Escazú, Heredia, Alajuela..."
                  value={customer.city}
                  onChange={(e) => setCustomer({ ...customer, city: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#ccff00]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black text-[#ccff00] uppercase tracking-widest mb-1">DIRECCIÓN EXACTA DE RESIDENCIA / TRABAJO *</label>
                <input
                  type="text"
                  required
                  placeholder="Carrera 15 # 85-30 Apto 401, Barrio El Retiro"
                  value={customer.address}
                  onChange={(e) => setCustomer({ ...customer, address: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#ccff00]"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-[10px] font-black text-[#ccff00] uppercase tracking-widest mb-1">NOTAS DE ENTREGA (OPCIONAL)</label>
                <input
                  type="text"
                  placeholder="Dejar en portería, timbrar dos veces..."
                  value={customer.notes}
                  onChange={(e) => setCustomer({ ...customer, notes: e.target.value })}
                  className="w-full bg-black border border-white/20 rounded-xl px-3 py-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#ccff00]"
                />
              </div>
            </div>

            {/* Order total preview */}
            <div className="p-3 bg-[#121212] border border-white/10 flex justify-between items-center text-xs">
              <span className="text-white/70 font-black uppercase tracking-wider">TOTAL A PAGAR ({cart.length} ÍTEMS):</span>
              <span className="text-[#ccff00] font-black text-base italic">{formatPrice(totalUSD, currency)}</span>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="bg-[#ccff00] hover:bg-white text-black font-black px-8 py-3.5 text-xs uppercase tracking-widest flex items-center gap-2 cursor-pointer shadow-2xl skew-x-[-10deg]"
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
                className="text-xs text-white/70 hover:text-[#ccff00] flex items-center gap-1 font-black uppercase cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4 stroke-[2.5]" />
                <span>VOLVER A ENVÍO</span>
              </button>
              <span className="text-xs text-[#ccff00] font-black uppercase italic">TOTAL: {formatPrice(totalUSD, currency)}</span>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-black uppercase italic text-white">ELIGE TU PASARELA DE PAGO:</label>
              
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentMethod('card')}
                  className={`p-3 border text-center transition flex flex-col items-center gap-1 cursor-pointer skew-x-[-10deg] ${
                    paymentMethod === 'card'
                      ? 'bg-[#ccff00] text-black border-[#ccff00] font-black'
                      : 'bg-black border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="skew-x-[10deg] flex flex-col items-center">
                    <CreditCard className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-[10px] uppercase font-black tracking-wider mt-1">TARJETA CRÉ/DÉB</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('sinpe_movil')}
                  className={`p-3 border text-center transition flex flex-col items-center gap-1 cursor-pointer skew-x-[-10deg] ${
                    paymentMethod === 'sinpe_movil'
                      ? 'bg-[#ccff00] text-black border-[#ccff00] font-black'
                      : 'bg-black border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="skew-x-[10deg] flex flex-col items-center">
                    <Smartphone className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-[10px] uppercase font-black tracking-wider mt-1">SINPE MÓVIL</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('paypal')}
                  className={`p-3 border text-center transition flex flex-col items-center gap-1 cursor-pointer skew-x-[-10deg] ${
                    paymentMethod === 'paypal'
                      ? 'bg-[#ccff00] text-black border-[#ccff00] font-black'
                      : 'bg-black border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="skew-x-[10deg] flex flex-col items-center">
                    <span className="font-black italic text-xs">PAYPAL</span>
                    <span className="text-[10px] uppercase font-black tracking-wider mt-1">GLOBAL</span>
                  </div>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentMethod('cash')}
                  className={`p-3 border text-center transition flex flex-col items-center gap-1 cursor-pointer skew-x-[-10deg] ${
                    paymentMethod === 'cash'
                      ? 'bg-[#ccff00] text-black border-[#ccff00] font-black'
                      : 'bg-black border-white/10 text-white/60 hover:text-white'
                  }`}
                >
                  <div className="skew-x-[10deg] flex flex-col items-center">
                    <Banknote className="w-5 h-5 stroke-[2.5]" />
                    <span className="text-[10px] uppercase font-black tracking-wider mt-1">CONTRA ENTREGA</span>
                  </div>
                </button>
              </div>
            </div>

            {/* Credit Card Details */}
            {paymentMethod === 'card' && (
              <div className="p-4 bg-[#121212] border border-white/10 space-y-3">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-black uppercase text-white">TARJETA VISA / MASTERCARD / AMEX</span>
                  <div className="flex gap-1 text-[10px] font-mono text-[#ccff00]">🔒 ENCRIPTACIÓN SSL 256-BIT</div>
                </div>

                <div>
                  <label className="block text-[10px] text-[#ccff00] font-black uppercase tracking-widest mb-1">NÚMERO DE TARJETA</label>
                  <input
                    type="text"
                    required
                    placeholder="4532 •••• •••• 8892"
                    maxLength={19}
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value)}
                    className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold placeholder-white/40 focus:border-[#ccff00]"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block text-[10px] text-[#ccff00] font-black uppercase tracking-widest mb-1">VENCIMIENTO (MM/AA)</label>
                    <input
                      type="text"
                      required
                      placeholder="08/28"
                      maxLength={5}
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold placeholder-white/40 focus:border-[#ccff00] text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-[10px] text-[#ccff00] font-black uppercase tracking-widest mb-1">CVC / CVV</label>
                    <input
                      type="password"
                      required
                      placeholder="123"
                      maxLength={4}
                      value={cardCvc}
                      onChange={(e) => setCardCvc(e.target.value)}
                      className="w-full bg-black border border-white/20 rounded-xl px-3 py-2 text-xs text-white font-mono font-bold placeholder-white/40 focus:border-[#ccff00] text-center"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* SINPE Móvil Details */}
            {paymentMethod === 'sinpe_movil' && (
              <div className="p-4 bg-[#121212] border border-white/10 text-center space-y-3">
                <p className="text-xs font-black uppercase text-[#ccff00]">TRANSFERENCIA SINPE MÓVIL AL {phoneDisplay}</p>
                <p className="text-[11px] text-white/80 font-semibold">
                  Realiza la transferencia por SINPE Móvil al número <strong className="text-white font-extrabold">{phoneDisplay}</strong> (OFFSIDE Sports). Ingresa tu teléfono para la verificación:
                </p>
                <input
                  type="tel"
                  required
                  placeholder={phoneDisplay}
                  value={sinpePhone}
                  onChange={(e) => setSinpePhone(e.target.value)}
                  className="w-full max-w-xs mx-auto bg-black border border-white/20 rounded-xl px-3 py-2 text-xs text-center font-mono font-black text-[#ccff00] focus:border-[#ccff00]"
                />
              </div>
            )}

            {/* PayPal info */}
            {paymentMethod === 'paypal' && (
              <div className="p-4 bg-[#121212] border border-white/10 text-center text-xs text-white/80 font-semibold">
                <p>Serás redirigido de forma segura al portal oficial de PayPal para autorizar los {formatPrice(totalUSD, currency)}.</p>
              </div>
            )}

            {/* Cash on Delivery info */}
            {paymentMethod === 'cash' && (
              <div className="p-4 bg-[#121212] border border-white/10 text-center text-xs text-white/80 space-y-1">
                <p className="font-black text-[#ccff00] uppercase">PAGAS EN EFECTIVO AL RECIBIR EN TU PUERTA</p>
                <p className="text-[11px] text-white/60 font-semibold">Ten listo el dinero exacto para el repartidor al momento de la entrega.</p>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-4 bg-[#ccff00] hover:bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-2xl skew-x-[-10deg]"
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 stroke-[2.5]" />
                <span>PAGAR AHORA ({formatPrice(totalUSD, currency)})</span>
              </div>
            </button>
          </form>
        )}

        {/* Step 3: Processing Loader */}
        {step === 'processing' && (
          <div className="p-12 text-center space-y-5">
            <div className="w-16 h-16 mx-auto border-4 border-[#ccff00] border-t-transparent animate-spin" />
            <div>
              <h3 className="text-xl font-black italic uppercase text-white">PROCESANDO PAGO SEGURO</h3>
              <p className="text-xs text-white/70 font-semibold mt-1">Conectando con la pasarela bancaria y generando tu número de guía...</p>
            </div>
          </div>
        )}

        {/* Step 4: Order Confirmation & Invoice Receipt */}
        {step === 'success' && completedOrder && (
          <div className="p-6 sm:p-8 text-center space-y-6">
            <div className="w-16 h-16 mx-auto bg-[#ccff00]/20 border-2 border-[#ccff00] flex items-center justify-center text-[#ccff00] skew-x-[-10deg]">
              <CheckCircle2 className="w-10 h-10 stroke-[2.5] skew-x-[10deg]" />
            </div>

            <div>
              <span className="bg-[#ccff00] text-black font-black uppercase text-xs px-3 py-1 tracking-widest">
                ¡PAGO CONFIRMADO EXITOSAMENTE!
              </span>
              <h3 className="text-3xl font-black italic uppercase text-white mt-3">
                GRACIAS POR TU COMPRA, {completedOrder.customer.fullName.split(' ')[0]}
              </h3>
              <p className="text-xs text-white/70 font-semibold mt-1">
                Tu pedido <strong className="text-[#ccff00] font-mono">{completedOrder.id}</strong> ha sido registrado. Enviaremos las actualizaciones del envío a <strong className="text-white">{completedOrder.customer.email}</strong>.
              </p>
            </div>

            {/* Receipt Card */}
            <div className="p-4 bg-[#121212] border border-white/10 text-left text-xs space-y-3 font-mono">
              <div className="flex justify-between pb-2 border-b border-white/10">
                <span className="text-white/60 font-bold uppercase">NÚMERO DE ORDEN:</span>
                <span className="text-[#ccff00] font-black">{completedOrder.id}</span>
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
              <div className="flex justify-between pt-2 border-t border-white/10">
                <span className="text-white/60 font-black uppercase">TOTAL PAGADO:</span>
                <span className="text-[#ccff00] font-black text-sm">{formatPrice(completedOrder.total, currency)}</span>
              </div>
            </div>

            {/* Actions */}
            <div className="flex flex-col sm:flex-row gap-3">
              <a
                href={`https://wa.me/573100000000?text=${encodeURIComponent(
                  `Hola OFFSIDE Sports! Acabo de hacer el pedido ${completedOrder.id} a nombre de ${completedOrder.customer.fullName} por un total de ${formatPrice(completedOrder.total, currency)}. ¿Me pueden dar información del despacho?`
                )}`}
                target="_blank"
                rel="noreferrer"
                className="flex-1 py-4 bg-[#ccff00] hover:bg-white text-black font-black text-xs uppercase tracking-widest flex items-center justify-center gap-2 cursor-pointer shadow-2xl skew-x-[-10deg]"
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
  );
};

