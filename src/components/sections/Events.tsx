import { motion, AnimatePresence } from 'motion/react';
import { useState } from 'react';
import { X, Clock, MapPin, Music } from 'lucide-react';
import SectionTitle from '../SectionTitle';
import Countdown from './Countdown';
import DecorativeSVG from '../DecorativeSVG';
import { useAppText } from '../../lib/store';

export default function Events() {
  const [showGuests, setShowGuests] = useState<string | null>(null);

  const [eventsTitle] = useAppText('eventsTitle', 'Rangkaian Acara');
  const [eventsSubtitle] = useAppText('eventsSubtitle', 'Waktu & Tempat');

  const [event1Title] = useAppText('event1Title', 'Akad Nikah');
  const [event1Time] = useAppText('event1Time', '08.00 WIB - Selesai');
  const [event1Location] = useAppText('event1Location', 'Kediaman Mempelai Wanita');

  const [event2Title] = useAppText('event2Title', 'Resepsi');
  const [event2Time] = useAppText('event2Time', '14.00 - 21.00 WIB');
  const [event2Location] = useAppText('event2Location', 'Gedung Ratu Elok');
  const [event2Address] = useAppText('event2Address', 'Jl. Raya Utama No. 88, Desa Ratu Elok\nKec. Maju Jaya, Kota Indah, 12345');
  const [event2Entertainment] = useAppText('event2Entertainment', 'NEW YULISA');

  const floatVar = {
    animate: {
      y: [0, -10, 0],
      transition: { duration: 5, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const pulseVar = {
    animate: {
      scale: [1, 1.03, 1],
      opacity: [1, 0.8, 1],
      transition: { duration: 4, repeat: Infinity, ease: "easeInOut" }
    }
  };

  const guestListPria = [
    'ASIUPING + Istri', 'AHMADIN + Istri', 'LIPUR + Istri', 
    'ARMAN, S.IP. + Istri', 'ATONG, S.E., M.M.E. + Istri', 'EFFENDI, S.IP. + Istri',
    'BUDIYANTO SEKUELE, S.Pd. + Istri', 'SUKARTA + Istri', 'RISWANTO + Istri',
    'AGUS ALBERTO + Istri', 'HARIYONO + Istri', 'LISINIUS SITO + Istri',
    'PINDI + Istri', 'CUMBIN', 'TUYUT + Istri',
    'HALOMOAN ARITONANG + Istri', 'DAVIT ALBINUS + Istri'
  ];
  const guestListWanita = [
    'PIPENSIUS, S.Pd., M.A.P. + Istri', 'MEINARDUS YUDIANASYAH, S.H., M.H.',
    'HERI NUGROHO', 'Ibu MERI CHRISLIANTI + Suami',
    'H. UTI JUSNI + Istri', 'H. GUSTI BAITAHIR + Istri', 'H. FIRMANSYAH + Istri',
    'JULIANSYAH/CULI + Istri', 'GUSTI SUBAHANSANI + Istri', 'SARBINI + Istri',
    'MASDIANTO + Istri', 'H. ERWANDI + Istri', 'AZIS MUSLIM + Istri',
    'H. ERWANDANI + Istri', 'ATA IHWANTO + Istri', 'H. BURHAN + Istri',
    'GUSTI BANDI + Istri', 'PIRGO, S.Pd. + Istri', 'ALI MURTOPO + Istri',
    'MARALI/UMAR + Istri'
  ];

  return (
    <section className="py-16 px-6 relative overflow-hidden flex flex-col items-center">
      <DecorativeSVG />
      <div className="w-full relative z-10">
         <SectionTitle title={eventsTitle || "Rangkaian Acara"} subtitle={eventsSubtitle || "Waktu & Tempat"} />
      </div>

      <Countdown />

      <div className="w-full max-w-3xl mx-auto relative z-10 mt-12 md:mt-16">
        {/* Timeline Line */}
        <div className="absolute left-[31px] md:left-1/2 top-10 bottom-10 w-[2px] bg-gradient-to-b from-transparent via-gold/40 to-transparent md:-translate-x-1/2 hidden md:block"></div>

        <div className="space-y-16 md:space-y-32">
          {/* Akad */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col md:flex-row gap-8 md:gap-16 md:justify-end"
          >
            <div className="absolute left-0 top-0 md:static flex items-start md:w-1/2 md:justify-end shrink-0 z-20">
              <motion.div 
                animate={{ 
                  y: [0, -12, 0],
                  boxShadow: ["0 15px 30px rgba(0,0,0,0.05)", "0 25px 50px rgba(212, 175, 55, 0.2)", "0 15px 30px rgba(0,0,0,0.05)"]
                }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }} 
                className="w-14 h-14 md:w-24 md:h-24 bg-white/60 backdrop-blur-2xl rounded-3xl border-[2px] border-white flex flex-col justify-center items-center overflow-hidden relative shadow-2xl hover:border-gold/30 transition-colors"
              >
                <div className="w-full h-1 bg-gold absolute top-0"></div>
                <span className="text-[8px] md:text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-0.5">JULI</span>
                <span className="text-2xl md:text-4xl font-serif font-black text-zinc-900 tracking-tighter leading-none">05</span>
              </motion.div>
            </div>
            
            <div className="pl-24 md:pl-0 md:w-1/2 pt-2 text-left relative">
               <div className="absolute left-7 md:left-auto md:-left-[10px] top-10 w-5 h-5 rounded-[var(--radius-minimal)] bg-white border-4 border-gold shadow-xl z-30 hidden md:block"></div>
               <motion.div 
                 initial={{ opacity: 0, x: 20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.3, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                 className="glass-card p-10 md:p-16 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border-white/80 shine-effect group"
               >
                <h4 className="text-gold font-black tracking-[0.5em] uppercase text-[9px] md:text-xs mb-4 opacity-90 drop-shadow-sm">The Holy Matrimony</h4>
                <h3 className="font-serif text-3xl md:text-5xl text-zinc-900 font-bold drop-shadow-sm mb-8 leading-tight italic tracking-tighter">{event1Title || 'Akad Nikah'}</h3>
                <div className="space-y-6">
                  <div className="flex items-center gap-5 text-zinc-600">
                    <div className="w-12 h-12 rounded-[var(--radius-minimal)] bg-gold/5 flex items-center justify-center text-gold shrink-0 border border-gold/20 group-hover:bg-gold group-hover:text-zinc-900 transition-all duration-700 shadow-sm">
                      <Clock size={20} />
                    </div>
                    <div>
                        <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-1">Waktu</p>
                        <p className="font-black text-lg md:text-xl tracking-tight text-zinc-800 italic">{event1Time}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-5 text-zinc-600">
                    <div className="w-12 h-12 rounded-[var(--radius-minimal)] bg-gold/5 flex items-center justify-center text-gold shrink-0 border border-gold/20 group-hover:bg-gold group-hover:text-zinc-900 transition-all duration-700 shadow-sm">
                      <MapPin size={20} />
                    </div>
                    <div>
                        <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-1">Lokasi</p>
                        <p className="font-bold text-base md:text-lg leading-relaxed italic text-zinc-700 tracking-tight">{event1Location}</p>
                    </div>
                  </div>
                </div>
               </motion.div>
            </div>
          </motion.div>

          {/* Resepsi */}
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col md:flex-row-reverse gap-8 md:gap-16 md:justify-end"
          >
            <div className="absolute left-0 top-0 md:static flex items-start md:w-1/2 md:justify-start shrink-0 z-20">
              <motion.div 
                animate={{ 
                  y: [0, 12, 0],
                  boxShadow: ["0 15px 30px rgba(0,0,0,0.05)", "0 25px 50px rgba(212, 175, 55, 0.2)", "0 15px 30px rgba(0,0,0,0.05)"]
                }} 
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }} 
                className="w-14 h-14 md:w-24 md:h-24 bg-white/60 backdrop-blur-2xl rounded-3xl border-[2px] border-white flex flex-col justify-center items-center overflow-hidden relative shadow-2xl hover:border-gold/30 transition-colors"
              >
                <div className="w-full h-1 bg-gold absolute top-0"></div>
                <span className="text-[8px] md:text-[10px] text-zinc-500 font-black uppercase tracking-[0.3em] mt-0.5">JULI</span>
                <span className="text-2xl md:text-4xl font-serif font-black text-zinc-900 tracking-tighter leading-none">05</span>
              </motion.div>
            </div>
            
            <div className="pl-24 md:pl-0 md:w-1/2 pt-2 text-left md:text-right relative">
               <div className="absolute left-7 md:auto md:-right-[10px] top-10 w-5 h-5 rounded-[var(--radius-minimal)] bg-white border-4 border-gold shadow-xl z-30 hidden md:block"></div>
               <motion.div 
                 initial={{ opacity: 0, x: -20 }}
                 whileInView={{ opacity: 1, x: 0 }}
                 transition={{ delay: 0.5, duration: 1, ease: [0.22, 1, 0.36, 1] }}
                 className="glass-card p-10 md:p-16 shadow-[0_40px_80px_rgba(0,0,0,0.06)] border-white/80 shine-effect group"
               >
                <h4 className="text-gold font-black tracking-[0.5em] uppercase text-[9px] md:text-xs mb-4 opacity-90 drop-shadow-sm">Wedding Celebration</h4>
                <h3 className="font-serif text-3xl md:text-5xl text-zinc-900 font-bold drop-shadow-sm mb-8 leading-tight italic tracking-tighter">{event2Title || 'Resepsi'}</h3>
                <div className="space-y-6 md:items-end flex flex-col">
                   <div className="flex items-center md:flex-row-reverse gap-5 text-zinc-600 w-full md:w-auto">
                     <div className="w-12 h-12 rounded-[var(--radius-minimal)] bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/20 group-hover:bg-gold group-hover:text-zinc-900 transition-all duration-700 shadow-sm">
                       <Clock size={20} />
                     </div>
                     <div>
                         <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-1 md:text-right">Waktu</p>
                         <p className="font-black text-lg md:text-xl tracking-tight text-zinc-800 italic">{event2Time}</p>
                     </div>
                   </div>
                   <div className="flex items-center md:flex-row-reverse gap-5 text-zinc-600 w-full md:w-auto">
                     <div className="w-12 h-12 rounded-[var(--radius-minimal)] bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/20 group-hover:bg-gold group-hover:text-zinc-900 transition-all duration-700 shadow-sm">
                       <MapPin size={20} />
                     </div>
                     <div>
                         <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-1 md:text-right">Lokasi</p>
                         <p className="font-bold text-base md:text-lg leading-relaxed italic text-zinc-700 tracking-tight">{event2Location}</p>
                     </div>
                   </div>
                   {event2Entertainment && (
                     <div className="flex items-center md:flex-row-reverse gap-5 text-zinc-600 w-full md:w-auto">
                       <div className="w-12 h-12 rounded-[var(--radius-minimal)] bg-gold/10 flex items-center justify-center text-gold shrink-0 border border-gold/20 group-hover:bg-gold group-hover:text-zinc-900 transition-all duration-700 shadow-sm">
                         <Music size={20} />
                       </div>
                       <div>
                         <p className="text-[9px] text-zinc-400 font-black uppercase tracking-[0.2em] mb-1 md:text-right">Hiburan</p>
                         <p className="font-black text-gold tracking-[0.3em] text-lg uppercase italic drop-shadow-sm">{event2Entertainment}</p>
                       </div>
                     </div>
                   )}
                </div>
               </motion.div>
            </div>
          </motion.div>
        </div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 1.2 }}
        className="text-center mt-20 md:mt-32 max-w-2xl mx-auto px-6 glass-card p-10 md:p-14 rounded-[var(--radius-premium)] shadow-2xl relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 p-6 opacity-5">
           <Music size={120} />
        </div>
        <p className="text-zinc-700 font-medium leading-relaxed mb-8 text-base md:text-lg italic relative z-10">
          "Merupakan suatu kehormatan dan kebahagiaan bagi kami apabila Bapak/Ibu/Saudara/i berkenan hadir untuk memberikan doa restu kepada kedua mempelai."
        </p>
        <motion.div 
          variants={pulseVar}
          animate="animate"
          className="relative z-10"
        >
          <div className="w-16 h-px bg-gradient-to-r from-transparent via-gold/50 to-transparent mx-auto mb-4"></div>
          <p className="text-gold font-serif text-3xl md:text-4xl drop-shadow-sm font-black tracking-tight italic">
            Terima Kasih
          </p>
        </motion.div>
      </motion.div>

      {/* Turut Mengundang */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ duration: 0.8 }}
        className="mt-16 max-w-2xl mx-auto text-center w-full px-6"
      >
        <p className="text-[9px] font-black tracking-[0.6em] text-gold uppercase mb-8 drop-shadow-sm flex items-center justify-center gap-4">
           <span className="w-8 h-px bg-gold/30"></span>
           Turut Mengundang
           <span className="w-8 h-px bg-gold/30"></span>
        </p>
        <div className="flex flex-row gap-2 md:gap-4 justify-center">
          <motion.button 
            whileHover={{ scale: 1.02, y: -4, backgroundColor: '#c5a028' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGuests('pria')}
            className="flex-1 py-3 md:py-5 bg-gold text-zinc-900 font-black text-[9px] md:text-sm tracking-wider uppercase rounded-full flex items-center justify-center cursor-pointer border border-transparent shadow-[0_10px_30px_rgba(212,175,55,0.4)] transition-all hover:border-white/50"
          >
            Keluarga Mempelai Pria
          </motion.button>
          <motion.button 
            whileHover={{ scale: 1.02, y: -4, backgroundColor: '#c5a028' }}
            whileTap={{ scale: 0.98 }}
            onClick={() => setShowGuests('wanita')}
            className="flex-1 py-3 md:py-5 bg-gold text-zinc-900 font-black text-[9px] md:text-sm tracking-wider uppercase rounded-full flex items-center justify-center cursor-pointer border border-transparent shadow-[0_10px_30px_rgba(212,175,55,0.4)] transition-all hover:border-white/50"
          >
            Keluarga Mempelai Wanita
          </motion.button>
        </div>
      </motion.div>

      {/* Modal Daftar Tamu */}
      <AnimatePresence>
        {showGuests && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/40 backdrop-blur-xl p-6"
          >
            <motion.div
              initial={{ y: 50, opacity: 0, scale: 0.9 }}
              animate={{ y: 0, opacity: 1, scale: 1 }}
              exit={{ y: 30, opacity: 0, scale: 0.9 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="w-full max-w-2xl glass-card bg-white/90 rounded-[var(--radius-premium)] p-10 pb-12 relative overflow-hidden max-h-[85vh] flex flex-col shadow-[0_50px_100px_rgba(0,0,0,0.3)]"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-gold/10 rounded-full blur-[100px] pointer-events-none"></div>
              
              <button 
                onClick={() => setShowGuests(null)}
                className="absolute top-6 right-6 text-zinc-400 hover:text-zinc-900 bg-zinc-100 p-3 rounded-[var(--radius-minimal)] transition-all z-10 cursor-pointer shadow-sm active:scale-90"
              >
                <X size={24} />
              </button>
              
              <h4 className="font-serif text-3xl md:text-4xl text-zinc-800 mb-8 text-center border-b border-gold/10 pb-8 mt-4 font-black tracking-tight italic shrink-0 uppercase">
                {showGuests === 'pria' ? 'Keluarga Pria' : 'Keluarga Wanita'}
              </h4>
              <div className="overflow-y-auto custom-scrollbar pr-4 -mr-4 scroll-smooth">
                <ul className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 text-left mt-4 relative z-10 px-2">
                  {(showGuests === 'pria' ? guestListPria : guestListWanita).map((guest, i) => (
                    <motion.li 
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (i % 10) * 0.05 + 0.3 }}
                      key={i} 
                      className="text-zinc-600 font-bold tracking-tight text-base flex items-start gap-4 p-4 rounded-[var(--radius-premium)] hover:bg-gold/5 transition-colors group"
                    >
                      <div className="w-8 h-8 rounded-[var(--radius-minimal)] bg-gold/10 text-gold flex items-center justify-center shrink-0 text-xs font-black group-hover:bg-gold group-hover:text-white transition-all">
                        {i + 1}
                      </div>
                      <span className="leading-tight pt-1">{guest}</span>
                    </motion.li>
                  ))}
                </ul>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
