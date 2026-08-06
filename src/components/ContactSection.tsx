import React, { useState } from 'react';
import { 
  MessageCircle, 
  Send, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  HelpCircle, 
  ChevronDown, 
  CheckCircle2
} from 'lucide-react';

export const ContactSection: React.FC = () => {
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', message: '' });
  const [submitted, setSubmitted] = useState(false);

  // Accordion state for FAQs
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const faqs = [
    {
      q: '¿Cuál es la calidad de las camisetas en OFFSIDE sports?',
      a: 'Nuestras camisetas son réplicas Importadas Calidad AAAA y Versión Jugador (Player Version) elaboradas con telas de alto rendimiento Aeroready, Heat.RDY y Dri-FIT ADV. Incluyen todos los bordados, parches de torneo y etiquetas oficiales.'
    },
    {
      q: '¿Cómo funciona la personalización con Nombre y Número?',
      a: 'Utilizamos tipografías e impresiones oficiales de cada liga y club. Al seleccionar cualquier camiseta puedes activar la opción de personalizado, colocar tu nombre/apodo y número deseado (+$10 USD / ₡5.200 CRC).'
    },
    {
      q: '¿Cuánto tiempo tarda en llegar mi pedido?',
      a: 'Para despachos dentro de Costa Rica el envío toma entre 24 y 48 horas hábiles mediante Correos de Costa Rica o Mensajería Express.'
    },
    {
      q: '¿Qué medios de pago aceptan en Costa Rica?',
      a: 'Aceptamos SINPE Móvil (+506 8559 5192), Tarjetas de Crédito y Débito (Visa, Mastercard, Amex), PayPal y Pago Contra Entrega en efectivo al recibir tu paquete.'
    }
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', phone: '', message: '' });
    }, 4000);
  };

  const whatsappMessage = encodeURIComponent(
    'Hola OFFSIDE Sports! Quisiera recibir información sobre disponibilidad de camisetas y opciones de estampado personalizado.'
  );

  return (
    <section id="contact-zone" className="bg-[#0a0a0a] text-white py-12 md:py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em]">
            <MessageCircle className="w-4 h-4 text-[#ccff00]" />
            <span className="text-[#ccff00]">ATENCIÓN PERSONALIZADA 24/7</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-white">
            ZONA DE CONTACTO & <span className="text-[#ccff00]">WHATSAPP</span>
          </h2>
          <p className="text-white/70 text-sm font-medium">
            ¿Tienes dudas con la talla, estampados o estado de tu envío? Habla directamente con nuestro equipo de asesores en tiempo real.
          </p>
        </div>

        {/* Big WhatsApp Banner CTA */}
        <div className="relative bg-[#121212] border border-[#ccff00]/40 rounded-3xl p-6 sm:p-10 shadow-2xl overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="space-y-2 text-center md:text-left z-10">
            <div className="inline-block bg-[#ccff00] text-black font-black text-[10px] uppercase px-3 py-1 rounded-sm mb-1 tracking-widest">
              RESPUESTA INMEDIATA EN MENOS DE 3 MINUTOS
            </div>
            <h3 className="text-2xl sm:text-4xl font-black italic uppercase text-white tracking-tight">
              ¿PREFIERES HACER TU PEDIDO POR WHATSAPP?
            </h3>
            <p className="text-white/70 text-xs sm:text-sm max-w-xl font-semibold">
              Te enviamos fotos en vivo del producto, resolvemos tus inquietudes de tallaje y gestionamos tu pago de forma personalizada.
            </p>
          </div>

          <a
            href={`https://wa.me/50685595192?text=${whatsappMessage}`}
            target="_blank"
            rel="noreferrer"
            className="z-10 bg-[#ccff00] hover:bg-white text-black font-black px-8 py-4 uppercase text-xs sm:text-sm tracking-widest skew-x-[-10deg] transition-all cursor-pointer shadow-xl flex items-center gap-3 flex-shrink-0"
          >
            <div className="skew-x-[10deg] flex items-center gap-2">
              <MessageCircle className="w-5 h-5 stroke-[2.5]" />
              <span>ESCRIBIR AL WHATSAPP OFICIAL</span>
            </div>
          </a>
        </div>

        {/* Contact Grid: Form & Info */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Direct Form */}
          <div className="lg:col-span-7 bg-[#121212] border border-white/10 rounded-3xl p-6 sm:p-8 space-y-4 shadow-xl">
            <h3 className="text-xl font-black italic uppercase text-white flex items-center gap-2">
              <Mail className="w-5 h-5 text-[#ccff00]" />
              <span>ENVÍANOS UN MENSAJE DIRECTO</span>
            </h3>

            {submitted ? (
              <div className="p-6 bg-black border border-[#ccff00]/40 rounded-2xl text-center space-y-2">
                <CheckCircle2 className="w-10 h-10 text-[#ccff00] mx-auto stroke-[2.5]" />
                <h4 className="font-black italic uppercase text-white text-lg">¡MENSAJE ENVIADO CON ÉXITO!</h4>
                <p className="text-xs text-white/70 font-semibold">Gracias por contactarnos. Un asesor comercial responderá a tu correo en breve.</p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block font-black text-[#ccff00] uppercase text-[10px] tracking-widest mb-1">NOMBRE COMPLETO *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Tu nombre"
                      className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold focus:border-[#ccff00]"
                    />
                  </div>

                  <div>
                    <label className="block font-black text-[#ccff00] uppercase text-[10px] tracking-widest mb-1">CORREO ELECTRÓNICO *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="correo@ejemplo.com"
                      className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold focus:border-[#ccff00]"
                    />
                  </div>
                </div>

                <div>
                  <label className="block font-black text-[#ccff00] uppercase text-[10px] tracking-widest mb-1">WHATSAPP / TELÉFONO *</label>
                  <input
                    type="tel"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+506 8559 5192"
                    className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold focus:border-[#ccff00]"
                  />
                </div>

                <div>
                  <label className="block font-black text-[#ccff00] uppercase text-[10px] tracking-widest mb-1">MENSAJE O CONSULTA *</label>
                  <textarea
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Consulta sobre disponibilidad de camisetas, envíos o patrocinios..."
                    className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold focus:border-[#ccff00]"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-[#ccff00] hover:bg-white text-black font-black uppercase tracking-widest text-xs cursor-pointer shadow-xl skew-x-[-10deg]"
                >
                  <div className="skew-x-[10deg] flex items-center justify-center gap-2">
                    <Send className="w-4 h-4 stroke-[2.5]" />
                    <span>ENVIAR CONSULTA</span>
                  </div>
                </button>
              </form>
            )}
          </div>

          {/* Right Column: Store info & FAQs */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Store details */}
            <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-lg font-black italic uppercase text-white">INFORMACIÓN DE LA TIENDA</h3>
              
              <div className="space-y-3 text-xs text-white/80 font-medium">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-[#ccff00] flex-shrink-0 mt-0.5 stroke-[2.5]" />
                  <div>
                    <strong className="text-white font-black uppercase text-[11px]">COSTA RICA & ENVÍOS NACIONALES:</strong>
                    <p>San José, Costa Rica (Envíos a todo el país por Correos de CR)</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Phone className="w-4 h-4 text-[#ccff00] flex-shrink-0 stroke-[2.5]" />
                  <div>
                    <strong className="text-white font-black uppercase text-[11px]">WHATSAPP & ATENCIÓN:</strong>
                    <p>+506 8559 5192</p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="w-4 h-4 text-[#ccff00] flex-shrink-0 stroke-[2.5]" />
                  <div>
                    <strong className="text-white font-black uppercase text-[11px]">HORARIO DE ATENCIÓN:</strong>
                    <p>Lunes a Sábado: 8:00 AM - 8:00 PM</p>
                  </div>
                </div>
              </div>
            </div>

            {/* FAQs Accordion */}
            <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 space-y-4 shadow-xl">
              <h3 className="text-lg font-black italic uppercase text-white flex items-center gap-2">
                <HelpCircle className="w-4 h-4 text-[#ccff00] stroke-[2.5]" />
                <span>PREGUNTAS FRECUENTES FAQ</span>
              </h3>

              <div className="space-y-2">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <div key={idx} className="border border-white/10 rounded-2xl overflow-hidden bg-black">
                      <button
                        onClick={() => setOpenFaq(isOpen ? null : idx)}
                        className="w-full p-3.5 text-left text-xs font-black uppercase text-white flex justify-between items-center cursor-pointer hover:text-[#ccff00]"
                      >
                        <span>{faq.q}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform stroke-[2.5] ${isOpen ? 'rotate-180 text-[#ccff00]' : ''}`} />
                      </button>
                      {isOpen && (
                        <div className="px-3.5 pb-3.5 text-[11px] text-white/70 leading-relaxed font-semibold border-t border-white/10 pt-2">
                          {faq.a}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

          </div>

        </div>

      </div>
    </section>
  );
};

