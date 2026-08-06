import React, { useState } from 'react';
import { MessageCircle, X, Send } from 'lucide-react';

export const WhatsAppFloatingButton: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userMsg, setUserMsg] = useState('');

  const defaultMsg = '¡Hola OFFSIDE Sports! ⚽ Quisiera consultar la disponibilidad de una camiseta...';

  const handleSendWA = () => {
    const textToSend = userMsg.trim() || defaultMsg;
    const url = `https://wa.me/50685595192?text=${encodeURIComponent(textToSend)}`;
    window.open(url, '_blank');
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      
      {/* Quick Chat Popover */}
      {isOpen && (
        <div className="mb-3 w-80 bg-[#121212] border border-white/20 rounded-3xl shadow-2xl p-4 text-white space-y-3">
          
          {/* Header */}
          <div className="flex items-center justify-between pb-2 border-b border-white/10">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-[#ccff00] text-black font-black flex items-center justify-center skew-x-[-10deg]">
                <MessageCircle className="w-5 h-5 fill-black stroke-none skew-x-[10deg]" />
              </div>
              <div>
                <p className="text-xs font-black italic uppercase text-white">ASESORÍA OFFSIDE</p>
                <p className="text-[10px] text-[#ccff00] font-black uppercase flex items-center gap-1 tracking-wider">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#ccff00] animate-ping" />
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
            <p className="font-black text-[#ccff00] uppercase">👋 ¡Hola fanático del fútbol!</p>
            <p className="font-medium">¿En qué camiseta o estampado personalizado te podemos ayudar hoy?</p>
          </div>

          {/* Message Input */}
          <div className="space-y-2">
            <textarea
              rows={2}
              value={userMsg}
              onChange={(e) => setUserMsg(e.target.value)}
              placeholder="Escribe tu consulta aquí..."
              className="w-full bg-black border border-white/20 rounded-xl p-2.5 text-xs text-white font-bold placeholder-white/40 focus:border-[#ccff00]"
            />
            <button
              onClick={handleSendWA}
              className="w-full py-3 bg-[#ccff00] hover:bg-white text-black font-black uppercase tracking-widest text-xs flex items-center justify-center gap-2 shadow-xl cursor-pointer skew-x-[-10deg]"
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
        className="group relative bg-[#ccff00] hover:bg-white text-black p-4 shadow-2xl hover:shadow-[#ccff00]/40 transition-all cursor-pointer skew-x-[-10deg]"
        title="Contactar por WhatsApp"
      >
        <div className="skew-x-[10deg]">
          <MessageCircle className="w-7 h-7 stroke-[2.5] fill-black" />
        </div>
        
        {/* Unread badge */}
        <span className="absolute -top-1 -right-1 bg-black text-[#ccff00] text-[10px] font-black w-5 h-5 flex items-center justify-center border-2 border-[#ccff00] animate-bounce">
          1
        </span>

        {/* Hover Tooltip label */}
        <span className="absolute right-16 bg-black text-white text-xs font-black uppercase px-3 py-1.5 border border-white/20 shadow-2xl whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none tracking-wider">
          💬 ¿NECESITAS AYUDA? CHATEA CON NOSOTROS
        </span>
      </button>

    </div>
  );
};

