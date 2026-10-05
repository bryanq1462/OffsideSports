import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';
import { StoreSettings } from '../types';

interface WhatsAppFloatingButtonProps {
  settings?: StoreSettings;
}

export const WhatsAppFloatingButton: React.FC<WhatsAppFloatingButtonProps> = ({ settings }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');
  const isHalloween = settings?.themeMode === 'halloween';

  const defaultMsg = isHalloween 
    ? '¡Hola OFFSIDE Sports! 🎃👻 Quisiera consultar sobre camisetas o promociones de Halloween...'
    : '¡Hola OFFSIDE Sports! ⚽ Quisiera consultar la disponibilidad de una camiseta...';

  const handleSendWA = () => {
    const textToSend = userMsg.trim() || defaultMsg;
    const cleanPhone = (settings?.contactPhone || '+506 8559 5192').replace(/[^0-9]/g, '');
    const url = `https://wa.me/${cleanPhone}?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Quick Chat Popover */}
      {isOpen && (
        <div className={`mb-3 w-80 bg-[#121212] border rounded-3xl shadow-2xl p-4 text-white space-y-3 transition-all ${
          isHalloween ? 'border-orange-500/40 shadow-[0_0_30px_rgba(255,107,0,0.25)]' : 'border-white/20'
        }`}>
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className={`w-8 h-8 ${isHalloween ? 'bg-orange-500' : 'bg-[#00e652]'} text-black font-black flex items-center justify-center skew-x-[-10deg]`}>
                <MessageCircle className="w-5 h-5 fill-black stroke-none skew-x-[10deg]" />
              </div>
              <div>
                <p className="text-xs font-black italic uppercase text-white flex items-center gap-1">
                  {isHalloween && <span>🎃</span>}
                  <span>ASESORÍA OFFSIDE</span>
                </p>
                <p className={`text-[10px] ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'} font-black uppercase flex items-center gap-1 tracking-wider`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${isHalloween ? 'bg-orange-400' : 'bg-[#00e652]'} animate-ping`} />
                  EN LÍNEA AHORA
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="text-white/60 hover:text-white p-1 cursor-pointer"
            >
              <X className="w-4 h-4 stroke-[2.5]" />
            </button>
          </div>

          {/* Simulated Chat Message */}
          <div className="bg-black p-3 rounded-2xl border border-white/10 text-xs text-white/80 space-y-1">
            <p className={`font-black uppercase ${isHalloween ? 'text-orange-400' : 'text-[#00e652]'}`}>
              {isHalloween ? '🎃 ¡Hola fanático del terror y del buen fútbol!' : '👋 ¡Hola fanático del fútbol!'}
            </p>
            <p className="font-medium">
              {isHalloween 
                ? '¿En qué camiseta, estampado de terror o balón te podemos asesorar?'
                : '¿En qué camiseta o estampado personalizado te podemos ayudar hoy?'}
            </p>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <textarea
              rows={2}
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              placeholder="Escribe tu consulta aquí..."
              className={`w-full bg-black border border-white/20 rounded-xl p-2.5 text-xs text-white font-bold placeholder-white/40 ${
                isHalloween ? 'focus:border-orange-500' : 'focus:border-[#00e652]'
              }`}
            />
            <button
              onClick={handleSendWA}
              className={`w-full py-3 ${
                isHalloween ? 'bg-orange-500 hover:bg-orange-400' : 'bg-[#00e652] hover:bg-white'
              } text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl cursor-pointer skew-x-[-10deg]`}
            >
              <div className="skew-x-[10deg] flex items-center gap-2">
                <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                <span>ABRIR WHATSAPP</span>
              </div>
            </button>
          </div>

        </div>
      )}

      {/* Main Floating Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`group relative ${
          isHalloween 
            ? 'bg-orange-500 hover:bg-orange-400 shadow-orange-500/40' 
            : 'bg-[#00e652] hover:bg-white shadow-[#00e652]/40'
        } text-black p-4 shadow-2xl transition-all cursor-pointer skew-x-[-10deg]`}
        title="Contactar por WhatsApp"
      >
        <div className="skew-x-[10deg]">
          <MessageCircle className="w-7 h-7 stroke-[2.5] fill-black" />
        </div>
        
        {/* Unread badge */}
        <span className={`absolute -top-1 -right-1 bg-black ${
          isHalloween ? 'text-orange-400 border-orange-500' : 'text-[#00e652] border-[#00e652]'
        } text-[10px] font-black w-5 h-5 flex items-center justify-center border-2 animate-bounce`}>
          {isHalloween ? '🎃' : '1'}
        </span>

        {/* Hover Tooltip label */}
        <span className="absolute right-16 bg-black text-white text-xs font-black uppercase px-3 py-1.5 border border-white/20 shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-wider">
          💬 ¿NECESITAS AYUDA? CHATEA CON NOSOTROS
        </span>
      </button>

    </div>
  );
};

