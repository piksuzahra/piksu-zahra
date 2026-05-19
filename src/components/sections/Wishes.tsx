import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, ChevronDown, MessageCircle } from 'lucide-react';
import SectionTitle from '../SectionTitle';
import DecorativeSVG from '../DecorativeSVG';
import { db, handleFirestoreError, OperationType } from '../../lib/firebase';
import { collection, addDoc, query, orderBy, onSnapshot, serverTimestamp } from 'firebase/firestore';

interface Wish {
  id: string;
  name: string;
  message: string;
  attendance: string;
  created_at: any;
}

export default function Wishes() {
  const [wishes, setWishes] = useState<Wish[]>([]);
  const [name, setName] = useState('');
  const [message, setMessage] = useState('');
  const [attendance, setAttendance] = useState('Hadir');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  const stats = {
    hadir: wishes.filter(w => w.attendance === 'Hadir').length,
    ragu: wishes.filter(w => w.attendance === 'Ragu-ragu').length,
    tidak: wishes.filter(w => w.attendance === 'Tidak Hadir').length
  };

  useEffect(() => {
    const q = query(collection(db, 'wishes'), orderBy('created_at', 'desc'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const data = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as Wish[];
      setWishes(data);
    }, (error) => {
      handleFirestoreError(error, OperationType.GET, 'wishes');
    });

    return () => unsubscribe();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !message.trim()) return;

    setIsSubmitting(true);
    const path = 'wishes';
    try {
      await addDoc(collection(db, path), {
        name,
        message,
        attendance,
        created_at: serverTimestamp()
      });
      setSubmitted(true);
      setName('');
      setMessage('');
      setTimeout(() => setSubmitted(false), 3000);
    } catch (error) {
      handleFirestoreError(error, OperationType.CREATE, path);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section id="ucapan" className="py-16 md:py-24 px-6 flex flex-col items-center relative overflow-hidden">
      <DecorativeSVG />
      <SectionTitle 
        title="RSVP & Ucapan" 
        subtitle="Harapan & Doa" 
        icon={<MessageCircle size={44} strokeWidth={1} />} 
      />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 lg:gap-16 mt-12 relative z-10">
        
        {/* Reservation Form */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="p-10 md:p-16 relative overflow-hidden h-fit shadow-[0_50px_100px_rgba(0,0,0,0.5)] bg-black/40 backdrop-blur-md rounded-[var(--radius-premium)] border border-gold/30"
        >
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
          <h3 className="font-serif text-2xl md:text-4xl text-white mb-10 drop-shadow-md font-black tracking-widest italic">Respon Kehadiran</h3>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <label className="text-xs md:text-lg font-black tracking-[0.5em] text-gold uppercase ml-1 opacity-80">Nama Lengkap</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Cth: Fulan & Pasangan" 
                className="w-full bg-white/5 text-white border-b-2 border-white/20 px-0 py-4 focus:outline-none focus:border-gold transition-all text-lg font-bold placeholder-white/30 italic"
                required 
              />
            </div>
            
            <div className="flex flex-col gap-4">
              <label className="text-xs md:text-lg font-black tracking-[0.5em] text-gold uppercase ml-1 opacity-80">Konfirmasi Kehadiran</label>
              <div className="relative">
                <select 
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  className="w-full bg-black/40 text-white border-b-2 border-white/20 px-0 py-4 focus:outline-none focus:border-gold transition-all text-lg font-bold appearance-none cursor-pointer pr-12 italic"
                >
                  <option value="Hadir">Ya, saya akan hadir</option>
                  <option value="Tidak Hadir">Maaf, saya tidak bisa hadir</option>
                  <option value="Ragu-ragu">Masih ragu-ragu</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gold">
                   <ChevronDown size={24} />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <label className="text-xs md:text-lg font-black tracking-[0.5em] text-gold uppercase ml-1 opacity-80">Pesan & Doa</label>
                <span className={`text-xs font-bold uppercase tracking-widest ${message.length > 450 ? 'text-rose' : 'text-white/50'}`}>
                  {message.length} / 500
                </span>
              </div>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="Tuliskan pesan & doa terbaik Anda..." 
                className="w-full h-44 bg-white/5 text-white border border-white/20 p-6 rounded-[var(--radius-premium)] focus:outline-none focus:ring-4 focus:ring-gold/5 focus:border-gold/30 transition-all text-lg font-medium leading-relaxed italic placeholder-white/30"
                required 
              ></textarea>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05, y: -4, boxShadow: "0 25px 50px rgba(212,175,55,0.4)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting || submitted}
              className="premium-button w-full bg-gold text-zinc-900 font-black py-6 mt-6 flex items-center justify-center gap-4 uppercase tracking-[0.4em] text-xs disabled:opacity-70 disabled:cursor-not-allowed group transition-all shadow-[0_10px_40px_rgba(212,175,55,0.4)] border border-transparent hover:border-white/50"
            >
              {submitted ? (
                <><CheckCircle2 size={24} className="text-zinc-900" /> Berhasil</>
              ) : (
                <><Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" /> Kirim Pesan</>
              )}
            </motion.button>
          </form>
        </motion.div>

        {/* Wishes List */}
        <motion.div 
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.1 }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="flex flex-col h-full max-h-[850px]"
        >
          <div className="flex flex-col mb-10 px-4 space-y-6">
            <div className="flex justify-between items-end">
              <div>
                <p className="text-gold text-sm md:text-2xl font-black tracking-[0.4em] md:tracking-[0.7em] uppercase mb-1 md:mb-2 drop-shadow-sm">Buku Tamu</p>
                <h3 className="font-serif text-2xl md:text-4xl text-white drop-shadow-md font-bold tracking-widest italic">Pesan Doa</h3>
              </div>
              <div className="bg-black/30 backdrop-blur-xl text-gold border border-gold/30 px-6 py-2 rounded-[var(--radius-minimal)] text-xs md:text-lg font-black tracking-[0.3em] uppercase shadow-sm">
                {wishes.length} Pesan
              </div>
            </div>
            
            {/* Quick RSVP Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gold/10 border border-gold/20 p-3 rounded-lg text-center flex flex-col items-center group hover:bg-gold/20 transition-colors">
                <span className="text-gold text-lg font-black leading-none">{stats.hadir}</span>
                <span className="text-[7px] text-gold font-bold uppercase tracking-wider mt-1">Hadir</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center flex flex-col items-center transition-colors">
                <span className="text-white/60 text-lg font-black leading-none">{stats.ragu}</span>
                <span className="text-[7px] text-white/50 font-bold uppercase tracking-wider mt-1">Ragu</span>
              </div>
              <div className="bg-white/5 border border-white/10 p-3 rounded-lg text-center flex flex-col items-center transition-colors">
                <span className="text-white/60 text-lg font-black leading-none">{stats.tidak}</span>
                <span className="text-[7px] text-white/50 font-bold uppercase tracking-wider mt-1">Tidak</span>
              </div>
            </div>
          </div>
          
          <div className="flex-1 overflow-y-auto pr-6 space-y-8 pb-12 custom-scrollbar">
            {wishes.length > 0 ? wishes.map((wish, index) => (
              <motion.div 
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ delay: Math.min(index * 0.1, 1), duration: 0.8 }}
                key={wish.id} 
                className="bg-black/40 backdrop-blur-md border border-gold/30 p-8 rounded-[var(--radius-premium)] flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:shadow-[0_40px_100px_rgba(0,0,0,0.5)] transition-all duration-700 shine-effect"
              >
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-tr from-white/10 to-gold/20 text-gold rounded-full flex items-center justify-center font-serif text-3xl border border-gold/30 shadow-xl font-bold group-hover:scale-110 transition-transform duration-700 overflow-hidden relative">
                    <span className="relative z-10">{wish.name.charAt(0).toUpperCase()}</span>
                    <div className="absolute inset-0 bg-gold/10 blur-md"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                       <span className="font-serif font-black text-white tracking-widest text-xl italic">{wish.name}</span>
                       <span className={`text-[8px] uppercase tracking-[0.3em] font-black px-4 py-1.5 rounded-[var(--radius-minimal)] border shadow-sm transition-colors ${
                         wish.attendance === 'Hadir' ? 'bg-gold/10 text-gold border-gold/20' : 'bg-white/5 text-white/50 border-white/10'
                       }`}>
                         {wish.attendance}
                       </span>
                    </div>
                  </div>
                  <p className="text-white/80 leading-relaxed font-bold text-base md:text-lg italic opacity-85">"{wish.message}"</p>
                  
                  <div className="mt-6 pt-4 border-t border-white/10 flex justify-end">
                     <p className="text-[9px] font-black text-white/50 tracking-[0.3em] uppercase">
                       {wish.created_at?.toDate ? wish.created_at.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru saja'}
                     </p>
                  </div>
                </div>
                
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.05] group-hover:opacity-[0.1] transition-opacity text-gold">
                   <Send size={80} strokeWidth={1} />
                </div>
              </motion.div>
            )) : (
              <div className="flex flex-col justify-center items-center h-64 text-center p-12 bg-black/30 backdrop-blur-md border-[2px] border-gold/20 border-dashed rounded-[var(--radius-premium)]">
                <motion.div 
                   animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="w-20 h-20 bg-white/10 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner border border-white/20"
                >
                   💌
                </motion.div>
                <p className="text-[10px] font-black text-gold/70 tracking-[0.4em] uppercase">Belum ada pesan bahagia</p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      <style>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent; 
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background-color: rgb(212, 212, 216); /* zinc-300 */
          border-radius: 20px;
        }
      `}</style>
    </section>
  );
}
