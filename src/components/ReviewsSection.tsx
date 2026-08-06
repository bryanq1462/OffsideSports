import React, { useState } from 'react';
import { 
  Star, 
  CheckCircle2, 
  MessageSquarePlus, 
  UserCheck, 
  ThumbsUp, 
  X
} from 'lucide-react';
import { Review, Jersey } from '../types';

interface ReviewsSectionProps {
  reviews: Review[];
  jerseys: Jersey[];
  onAddReview: (newReview: Review) => void;
}

export const ReviewsSection: React.FC<ReviewsSectionProps> = ({
  reviews,
  jerseys,
  onAddReview
}) => {
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Form State
  const [userName, setUserName] = useState('');
  const [selectedJerseyName, setSelectedJerseyName] = useState(jerseys[0]?.name || 'Camiseta Real Madrid Local 2024/25');
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [team, setTeam] = useState('Real Madrid');

  // Calculate average rating
  const avgRating = reviews.length > 0
    ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
    : '4.9';

  const filteredReviews = filterRating === 'all'
    ? reviews
    : reviews.filter(r => r.rating === filterRating);

  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!userName.trim() || !comment.trim()) return;

    const newRev: Review = {
      id: `rev-${Date.now()}`,
      jerseyName: selectedJerseyName,
      userName: userName.trim(),
      userAvatar: `https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120`,
      rating,
      date: new Date().toISOString().split('T')[0],
      comment: comment.trim(),
      verifiedBuyer: true,
      team
    };

    onAddReview(newRev);
    setIsModalOpen(false);
    setUserName('');
    setComment('');
  };

  return (
    <section id="reviews-section" className="bg-[#0a0a0a] text-white py-12 md:py-20 border-t border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto space-y-3">
          <div className="inline-flex items-center gap-2 bg-white/5 border border-white/10 px-3.5 py-1 rounded-full text-xs font-black uppercase tracking-[0.2em]">
            <UserCheck className="w-4 h-4 text-[#ccff00]" />
            <span className="text-[#ccff00]">OPINIONES REALES DE LA COMUNIDAD</span>
          </div>
          <h2 className="text-4xl sm:text-6xl font-black italic uppercase tracking-tighter text-white">
            RESEÑAS DE <span className="text-[#ccff00]">CLIENTES VERIFICADOS</span>
          </h2>
          <p className="text-white/70 text-sm font-medium">
            La satisfacción de nuestros fanáticos es nuestro mayor compromiso. Descubre lo que dicen quienes ya recibieron sus camisetas en casa.
          </p>
        </div>

        {/* Rating Statistics Card & CTA */}
        <div className="bg-[#121212] border border-white/10 rounded-3xl p-6 sm:p-8 flex flex-col md:flex-row items-center justify-between gap-6 shadow-2xl">
          <div className="flex flex-col sm:flex-row items-center gap-6 text-center sm:text-left">
            <div className="bg-black border border-white/10 p-5 rounded-2xl text-center">
              <span className="text-5xl font-black text-[#ccff00] italic">{avgRating}</span>
              <div className="flex text-amber-400 text-sm justify-center my-1">★★★★★</div>
              <p className="text-[10px] text-white/50 uppercase font-black tracking-widest">DE 5.0 ESTRELLAS</p>
            </div>

            <div className="space-y-1">
              <h3 className="text-xl font-black italic uppercase text-white">EXCELENTE REPUTACIÓN EN TODA COLOMBIA</h3>
              <p className="text-xs text-white/70 font-semibold">Basado en más de 150+ compras verificadas con entrega inmediata.</p>
              <div className="flex flex-wrap gap-2 pt-2">
                <span className="bg-[#ccff00]/10 text-[#ccff00] text-[10px] font-black uppercase px-3 py-1 rounded-sm border border-[#ccff00]/30 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3 stroke-[2.5]" />
                  COMPROMISO 100% CALIDAD AAAA
                </span>
                <span className="bg-white/5 text-white/80 text-[10px] font-black uppercase px-3 py-1 rounded-sm border border-white/10">
                  FOTOS REALES DE COMPRADORES
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="bg-[#ccff00] hover:bg-white text-black font-black px-8 py-4 uppercase text-xs tracking-widest skew-x-[-10deg] transition-all cursor-pointer shadow-xl flex items-center gap-2 flex-shrink-0"
          >
            <div className="skew-x-[10deg] flex items-center gap-2">
              <MessageSquarePlus className="w-4 h-4 stroke-[2.5]" />
              <span>DEJAR MI RESEÑA</span>
            </div>
          </button>
        </div>

        {/* Star Rating Filters */}
        <div className="flex items-center justify-between gap-4 flex-wrap pb-2 border-b border-white/10">
          <div className="flex items-center gap-2 text-xs">
            <span className="text-white/40 font-black uppercase text-[10px] tracking-widest">FILTRAR POR:</span>
            <button
              onClick={() => setFilterRating('all')}
              className={`px-4 py-2 font-black uppercase text-xs transition cursor-pointer ${
                filterRating === 'all'
                  ? 'bg-[#ccff00] text-black font-black'
                  : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
              }`}
            >
              TODAS ({reviews.length})
            </button>
            <button
              onClick={() => setFilterRating(5)}
              className={`px-4 py-2 font-black uppercase text-xs transition cursor-pointer flex items-center gap-1.5 ${
                filterRating === 5
                  ? 'bg-[#ccff00] text-black font-black'
                  : 'bg-white/5 text-white/80 hover:bg-white/10 border border-white/10'
              }`}
            >
              <span>5 ESTRELLAS</span>
              <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
            </button>
          </div>
        </div>

        {/* Reviews Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredReviews.map((rev) => (
            <div
              key={rev.id}
              className="bg-[#121212] border border-white/10 rounded-3xl p-6 space-y-4 hover:border-[#ccff00]/40 transition shadow-xl flex flex-col justify-between"
            >
              <div className="space-y-3">
                {/* User Info Header */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={rev.userAvatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&q=80&w=120'}
                      alt={rev.userName}
                      className="w-10 h-10 rounded-full object-cover border border-white/20"
                    />
                    <div>
                      <h4 className="text-sm font-black italic uppercase text-white flex items-center gap-2">
                        <span>{rev.userName}</span>
                        {rev.verifiedBuyer && (
                          <span className="bg-[#ccff00]/20 text-[#ccff00] text-[9px] font-black uppercase px-2 py-0.5 rounded-xs border border-[#ccff00]/30 flex items-center gap-0.5">
                            <CheckCircle2 className="w-2.5 h-2.5" />
                            COMPRADOR VERIFICADO
                          </span>
                        )}
                      </h4>
                      <p className="text-[10px] text-white/40 font-mono">{rev.date}</p>
                    </div>
                  </div>

                  <div className="flex text-amber-400 text-xs">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-3.5 h-3.5 ${i < rev.rating ? 'fill-amber-400 text-amber-400' : 'text-white/20'}`}
                      />
                    ))}
                  </div>
                </div>

                {/* Jersey Tag */}
                <div className="inline-block bg-black px-3 py-1 rounded border border-white/10 text-[11px] text-[#ccff00] font-black uppercase">
                  ⚽ CAMISETA: {rev.jerseyName}
                </div>

                {/* Comment */}
                <p className="text-white/80 text-xs leading-relaxed font-medium italic">
                  "{rev.comment}"
                </p>
              </div>

              <div className="pt-3 border-t border-white/10 flex justify-between items-center text-[10px] text-white/40 font-black uppercase">
                <span>¿TE FUE ÚTIL ESTA RESEÑA?</span>
                <button className="flex items-center gap-1 text-white/60 hover:text-[#ccff00] font-black cursor-pointer">
                  <ThumbsUp className="w-3 h-3 stroke-[2.5]" />
                  <span>ÚTIL</span>
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>

      {/* Add Review Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#121212] border border-white/20 rounded-3xl p-6 w-full max-w-md text-white space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b border-white/10 pb-3">
              <h3 className="text-lg font-black italic uppercase text-white">ESCRIBIR RESEÑA VERIFICADA</h3>
              <button onClick={() => setIsModalOpen(false)} className="text-white/60 hover:text-white">
                <X className="w-5 h-5 stroke-[2.5]" />
              </button>
            </div>

            <form onSubmit={handleSubmitReview} className="space-y-3 text-xs">
              <div>
                <label className="block text-[#ccff00] font-black uppercase text-[10px] tracking-widest mb-1">TU NOMBRE COMPLETO *</label>
                <input
                  type="text"
                  required
                  placeholder="ej: Andrés Felipe M."
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold focus:border-[#ccff00]"
                />
              </div>

              <div>
                <label className="block text-[#ccff00] font-black uppercase text-[10px] tracking-widest mb-1">CAMISETA COMPRADA *</label>
                <select
                  value={selectedJerseyName}
                  onChange={(e) => setSelectedJerseyName(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold focus:border-[#ccff00]"
                >
                  {jerseys.map(j => (
                    <option key={j.id} value={j.name}>{j.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-[#ccff00] font-black uppercase text-[10px] tracking-widest mb-1">CALIFICACIÓN EN ESTRELLAS:</label>
                <div className="flex gap-2 text-amber-400">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      type="button"
                      key={star}
                      onClick={() => setRating(star)}
                      className="text-2xl focus:outline-none cursor-pointer"
                    >
                      {star <= rating ? '★' : '☆'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-[#ccff00] font-black uppercase text-[10px] tracking-widest mb-1">TU COMENTARIO U OPINIÓN *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Cuéntanos sobre la calidad, el estampado o el tiempo de entrega..."
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  className="w-full bg-black border border-white/20 rounded-xl p-3 text-white font-bold focus:border-[#ccff00]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#ccff00] hover:bg-white text-black font-black uppercase tracking-widest text-xs cursor-pointer shadow-xl skew-x-[-10deg]"
              >
                <span className="skew-x-[10deg] block">PUBLICAR RESEÑA VERIFICADA</span>
              </button>
            </form>
          </div>
        </div>
      )}

    </section>
  );
};

