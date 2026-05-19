import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Send, CheckCircle2, ChevronDown } from 'lucide-react';
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
    <section className="py-20 px-6 flex flex-col items-center relative overflow-hidden min-h-screen">
      <DecorativeSVG />
      <SectionTitle title="RSVP & Ucapan" subtitle="Harapan & Doa" />

      <div className="w-full max-w-5xl grid lg:grid-cols-2 gap-10 lg:gap-16 mt-12 relative z-10">
        
        {/* Reservation Form */}
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="glass-card p-10 md:p-16 relative overflow-hidden h-fit shadow-[0_50px_100px_rgba(0,0,0,0.08)] bg-white/70"
        >
          <div className="absolute top-0 inset-x-0 h-2 bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
          <h3 className="font-serif text-2xl md:text-4xl text-zinc-900 mb-10 drop-shadow-sm font-black tracking-tighter italic">Respon Kehadiran</h3>
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-10">
            <div className="flex flex-col gap-4">
              <label className="text-[10px] font-black tracking-[0.5em] text-gold uppercase ml-1 opacity-80">Full Name</label>
              <input 
                type="text" 
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Ex: John Doe & Partner" 
                className="w-full bg-white/10 border-b-2 border-zinc-200/50 px-0 py-4 focus:outline-none focus:border-gold transition-all text-lg font-bold placeholder-zinc-300 italic"
                required 
              />
            </div>
            
            <div className="flex flex-col gap-4">
              <label className="text-[10px] font-black tracking-[0.5em] text-gold uppercase ml-1 opacity-80">R.S.V.P</label>
              <div className="relative">
                <select 
                  value={attendance}
                  onChange={(e) => setAttendance(e.target.value)}
                  className="w-full bg-white/10 border-b-2 border-zinc-200/50 px-0 py-4 focus:outline-none focus:border-gold transition-all text-lg font-bold appearance-none cursor-pointer pr-12 italic"
                >
                  <option value="Hadir">Yes, I'll be there</option>
                  <option value="Tidak Hadir">Sorry, I can't make it</option>
                  <option value="Ragu-ragu">Still deciding</option>
                </select>
                <div className="absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none text-gold">
                   <ChevronDown size={24} />
                </div>
              </div>
            </div>
            
            <div className="flex flex-col gap-4">
              <div className="flex justify-between items-end">
                <label className="text-[10px] font-black tracking-[0.5em] text-gold uppercase ml-1 opacity-80">Wedding Wishes</label>
                <span className={`text-[9px] font-bold uppercase tracking-widest ${message.length > 450 ? 'text-rose' : 'text-zinc-400'}`}>
                  {message.length} / 500
                </span>
              </div>
              <textarea 
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 500))}
                placeholder="Send your warmest wishes..." 
                className="w-full h-44 bg-zinc-50/50 border border-zinc-200/50 p-6 rounded-[var(--radius-premium)] focus:outline-none focus:ring-4 focus:ring-gold/5 focus:border-gold/30 transition-all text-lg font-medium leading-relaxed italic placeholder-zinc-300"
                required 
              ></textarea>
            </div>
            
            <motion.button 
              whileHover={{ scale: 1.05, y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.15)" }}
              whileTap={{ scale: 0.95 }}
              type="submit"
              disabled={isSubmitting || submitted}
              className="premium-button w-full bg-zinc-900 text-white font-black py-6 mt-6 flex items-center justify-center gap-4 uppercase tracking-[0.4em] text-xs disabled:opacity-70 disabled:cursor-not-allowed group transition-all"
            >
              {submitted ? (
                <><CheckCircle2 size={24} className="text-gold" /> Success</>
              ) : (
                <><Send size={20} className="group-hover:translate-x-2 group-hover:-translate-y-2 transition-transform" /> Submit Wishes</>
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
                <p className="text-gold text-[9px] font-black tracking-[0.4em] uppercase mb-2">Guest Book</p>
                <h3 className="font-serif text-2xl md:text-4xl text-zinc-800 drop-shadow-sm font-bold tracking-tight italic">Pesan Doa</h3>
              </div>
              <div className="bg-white/40 backdrop-blur-xl text-gold border border-gold/10 px-6 py-2 rounded-[var(--radius-minimal)] text-[10px] font-black tracking-[0.3em] uppercase shadow-sm">
                {wishes.length} Posts
              </div>
            </div>
            
            {/* Quick RSVP Summary */}
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-sage/5 border border-sage/10 p-3 rounded-lg text-center flex flex-col items-center">
                <span className="text-sage text-lg font-black leading-none">{stats.hadir}</span>
                <span className="text-[7px] text-sage font-bold uppercase tracking-wider mt-1">Hadir</span>
              </div>
              <div className="bg-gold/5 border border-gold/10 p-3 rounded-lg text-center flex flex-col items-center">
                <span className="text-gold text-lg font-black leading-none">{stats.ragu}</span>
                <span className="text-[7px] text-gold font-bold uppercase tracking-wider mt-1">Ragu</span>
              </div>
              <div className="bg-zinc-50 border border-zinc-200 p-3 rounded-lg text-center flex flex-col items-center">
                <span className="text-zinc-500 text-lg font-black leading-none">{stats.tidak}</span>
                <span className="text-[7px] text-zinc-400 font-bold uppercase tracking-wider mt-1">Tidak</span>
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
                className="glass-card p-8 rounded-[var(--radius-premium)] flex flex-col md:flex-row gap-6 relative overflow-hidden group hover:shadow-[0_40px_80px_rgba(0,0,0,0.08)] transition-all duration-700 shine-effect"
              >
                <div className="shrink-0">
                  <div className="w-16 h-16 bg-gradient-to-tr from-zinc-50 to-gold/20 text-zinc-800 rounded-full flex items-center justify-center font-serif text-3xl border-2 border-white shadow-xl font-bold group-hover:scale-110 transition-transform duration-700 overflow-hidden relative">
                    <span className="relative z-10">{wish.name.charAt(0).toUpperCase()}</span>
                    <div className="absolute inset-0 bg-gold/5 blur-md"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
                    <div className="flex items-center gap-3">
                       <span className="font-serif font-black text-zinc-900 tracking-tight text-xl italic">{wish.name}</span>
                       <span className={`text-[8px] uppercase tracking-[0.3em] font-black px-4 py-1.5 rounded-[var(--radius-minimal)] border shadow-sm ${
                         wish.attendance === 'Hadir' ? 'bg-sage/10 text-sage border-sage/10' : 'bg-zinc-100 text-zinc-400 border-zinc-200/50'
                       }`}>
                         {wish.attendance}
                       </span>
                    </div>
                  </div>
                  <p className="text-zinc-600 leading-relaxed font-bold text-base md:text-lg italic opacity-85">"{wish.message}"</p>
                  
                  <div className="mt-6 pt-4 border-t border-zinc-100 flex justify-end">
                     <p className="text-[9px] font-black text-zinc-300 tracking-[0.3em] uppercase">
                       {wish.created_at?.toDate ? wish.created_at.toDate().toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }) : 'Baru saja'}
                     </p>
                  </div>
                </div>
                
                {/* Decorative Accent */}
                <div className="absolute top-0 right-0 p-4 opacity-[0.03] group-hover:opacity-[0.08] transition-opacity">
                   <Send size={80} strokeWidth={1} />
                </div>
              </motion.div>
            )) : (
              <div className="flex flex-col justify-center items-center h-64 text-center p-12 bg-white/20 backdrop-blur-md border-[2px] border-gold/10 border-dashed rounded-[var(--radius-premium)]">
                <motion.div 
                   animate={{ scale: [1, 1.2, 1], opacity: [0.3, 0.6, 0.3] }}
                   transition={{ duration: 4, repeat: Infinity }}
                   className="w-20 h-20 bg-white/40 rounded-full flex items-center justify-center mb-6 text-4xl shadow-inner"
                >
                   💌
                </motion.div>
                <p className="text-[10px] font-black text-zinc-400 tracking-[0.4em] uppercase">Belum ada pesan bahagia</p>
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
