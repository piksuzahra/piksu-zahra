import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Instagram } from 'lucide-react';
import SectionTitle from '../SectionTitle';
import { useAppImage, useAppText, uploadFile } from '../../lib/store';
import DecorativeSVG from '../DecorativeSVG';

const CircularFrame = ({ children, isReversed, image, onUpload }: { children: ReactNode, isReversed?: boolean, image?: string | null, onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className="relative w-32 h-32 md:w-44 md:h-44 my-4 md:my-6 mx-auto flex items-center justify-center p-3"
  >
    {/* External Animated Ornaments */}
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute inset-[-20px] md:inset-[-30px] pointer-events-none z-0 opacity-40 select-none"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full text-gold/40" fill="none" stroke="currentColor" strokeWidth="0.3">
        <circle cx="100" cy="100" r="98" strokeDasharray="2 4" />
        <circle cx="100" cy="100" r="92" strokeWidth="0.5" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(deg => (
          <g key={deg} transform={`rotate(${deg} 100 100)`}>
             <path d="M100 2 L103 12 L100 18 L97 12 Z" fill="currentColor" />
             <circle cx="100" cy="25" r="1.5" fill="currentColor" />
          </g>
        ))}
      </svg>
    </motion.div>

    {/* Secondary Counter-Rotating Ring */}
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
      className="absolute inset-[-8px] md:inset-[-12px] pointer-events-none z-0 opacity-60 select-none"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full text-gold/60" fill="none" stroke="currentColor" strokeWidth="0.6">
        <circle cx="100" cy="100" r="88" strokeDasharray="12 8" />
        {[22.5, 67.5, 112.5, 157.5, 202.5, 247.5, 292.5, 337.5].map(deg => (
          <circle key={deg} cx={100 + 88 * Math.cos(deg * Math.PI / 180)} cy={100 + 88 * Math.sin(deg * Math.PI / 180)} r="2" fill="currentColor" />
        ))}
      </svg>
    </motion.div>

    {/* Glowing Premium Aura */}
    <motion.div
      animate={{ 
        boxShadow: [
          "0 0 20px rgba(184, 98, 77, 0.1)", 
          "0 0 40px rgba(184, 98, 77, 0.2)", 
          "0 0 20px rgba(184, 98, 77, 0.1)"
        ]
      }}
      transition={{ duration: 4, repeat: Infinity }}
      className={`absolute inset-2 rounded-full z-10 pointer-events-none bg-gradient-to-tr ${isReversed ? 'from-terracotta/5 to-sage/5' : 'from-sage/5 to-gold/5'}`}
    />

    {/* The Portrait Frame */}
    <motion.label 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full h-full rounded-full border-[6px] border-white overflow-hidden bg-white z-20 shadow-[0_15px_40px_rgba(0,0,0,0.15)] group flex items-center justify-center cursor-pointer ring-1 ring-gold/20"
    >
      <input type="file" className="hidden" accept="image/*" onChange={onUpload} />
      <div className="w-full h-full rounded-full overflow-hidden relative">
        {image ? (
          <img 
            src={image} 
            referrerPolicy="no-referrer"
            onError={(e) => (e.currentTarget.src = isReversed ? 'https://images.unsplash.com/photo-1507679799987-c73774573b0a?auto=format&fit=crop&q=80&w=800' : 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=800')}
            className="w-full h-full object-cover pointer-events-none group-hover:scale-110 transition-transform duration-[4s] ease-out" 
          />
        ) : (
          <div className={`w-full h-full bg-gradient-to-tr ${isReversed ? 'from-zinc-100 to-sage/10' : 'from-zinc-100 to-gold/10'} flex justify-center items-center pointer-events-none`}>
             <motion.div 
               animate={{ y: [0, -4, 0] }}
               transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
               className="text-zinc-400 opacity-40 font-serif text-[44px] md:text-[66px] drop-shadow-sm"
             >
               {children}
             </motion.div>
          </div>
        )}
        
        {/* Subtle Inner Glow Overlay */}
        <div className="absolute inset-0 rounded-full shadow-[inset_0_0_20px_rgba(0,0,0,0.05)] pointer-events-none" />
      </div>
      
      {/* Interaction Overlay */}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-zinc-900/10 transition-colors duration-500 flex items-center justify-center z-30">
         <div className="w-10 h-10 bg-white/40 backdrop-blur-md rounded-full flex items-center justify-center text-zinc-900 opacity-0 group-hover:opacity-100 transition-all translate-y-2 group-hover:translate-y-0 duration-500 shadow-lg border border-white/50">
           <svg viewBox="0 0 24 24" className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 5v14M5 12h14"/></svg>
         </div>
      </div>
    </motion.label>
  </motion.div>
);

export default function Couple() {
  const [priaPhoto, setPriaPhoto] = useAppImage('priaPhoto', 'https://images.unsplash.com/photo-1507679799987-c73774573b0a?auto=format&fit=crop&q=80&w=1000');
  const [wanitaPhoto, setWanitaPhoto] = useAppImage('wanitaPhoto', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=80&w=1000');

  const [groomName] = useAppText('groomName', 'Piksu');
  const [brideName] = useAppText('brideName', 'Zahra');
  const [groomFull] = useAppText('groomFull', 'Riehaizou');
  const [brideFull] = useAppText('brideFull', 'Fatimatuzzahroh');
  const [groomDesc] = useAppText('groomDesc', 'Putra pertama bapak Haita\\ndan ibu Tri Artati');
  const [brideDesc] = useAppText('brideDesc', 'Putri pertama bapak Algajali\\ndan ibu Harlina');
  const [brideIg] = useAppText('brideIg', '@ zahra_fatima');
  const [groomIg] = useAppText('groomIg', '@ piksu_h');
  
  const groomInitial = groomName ? groomName[0] : 'P';
  const brideInitial = brideName ? brideName[0] : 'Z';

  const handlePhotoUpload = async (e: React.ChangeEvent<HTMLInputElement>, setter: (url: string) => void, key: string) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const url = await uploadFile(file, `app/${key}_${Date.now()}`);
        await setter(url);
      } catch (err) {
        console.error(err);
        alert('Gagal mengupload: ' + (err instanceof Error ? err.message : 'Cek koneksi internet Anda'));
      }
    }
  };

  return (
    <section className="py-24 px-6 flex flex-col items-center overflow-hidden relative">
      <DecorativeSVG />
      
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-sage/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-terracotta/5 blur-[100px] rounded-full pointer-events-none"></div>

      <SectionTitle title="Sang Mempelai" subtitle="Pasangan Berbahagia" />

      <div className="flex flex-col gap-12 md:gap-24 w-full max-w-3xl mt-8 relative z-10">
        
        {/* Wanita -> Teks Kanan, Foto Kiri on desktop */}
        <div className="flex flex-col md:flex-row items-center gap-8 md:gap-20 w-full mb-20 md:mb-40">
          <div className="shrink-0 scale-110 md:scale-150">
            <CircularFrame image={wanitaPhoto} onUpload={(e) => handlePhotoUpload(e, setWanitaPhoto, 'wanitaPhoto')}>
              {brideInitial}
            </CircularFrame>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center md:text-left flex-1 px-4"
          >
            <h4 className="text-gold font-serif italic text-sm md:text-lg mb-4 tracking-[0.3em] font-black uppercase drop-shadow-sm">Mempelai Wanita</h4>
            <h3 className="font-serif text-3xl md:text-5xl text-zinc-900 mb-8 font-black drop-shadow-md leading-none tracking-tighter italic">{brideFull}</h3>
            <div className="w-20 h-1 bg-gradient-to-r from-gold/40 to-transparent mb-8 hidden md:block rounded-full"></div>
            <p className="text-base md:text-lg min-h-[3em] text-zinc-600 font-bold leading-relaxed italic tracking-tight mb-8" dangerouslySetInnerHTML={{ __html: brideDesc ? brideDesc.replace(/\\n/g, '<br/>') : '' }} />
            
            <motion.a
              whileHover={{ scale: 1.05, x: 8 }}
              whileTap={{ scale: 0.95 }}
              href={`https://instagram.com/${brideIg?.replace('@', '').trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-gold hover:text-gold-dark transition-all font-black tracking-[0.2em] text-[10px] md:text-xs uppercase group bg-gold/10 px-6 py-3 rounded-[var(--radius-minimal)] border border-gold/20 hover:border-gold/50"
            >
              <Instagram size={14} className="group-hover:rotate-12 transition-transform" />
              <span>{brideIg}</span>
            </motion.a>
          </motion.div>
        </div>

        {/* Separator */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.5 }}
          whileInView={{ opacity: 1, scale: 1.2 }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, type: "spring" }}
          className="flex justify-center text-gold/30 relative z-10 my-10"
        >
          <div className="relative">
            <motion.div
              animate={{ scale: [1, 1.3, 1], opacity: [0.4, 0.7, 0.4] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="absolute inset-[-20px] bg-gold/30 blur-2xl rounded-full"
            />
            <motion.div
               animate={{ rotate: [0, 5, -5, 0] }}
               transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
            >
              <svg 
                className="w-12 h-12 md:w-16 md:h-16 text-gold drop-shadow-[0_10px_20px_rgba(212,175,55,0.4)]" 
                viewBox="0 0 24 24" 
                fill="currentColor"
              >
                <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
              </svg>
            </motion.div>
          </div>
        </motion.div>

        {/* Pria -> Teks Kiri, Foto Kanan on desktop */}
        <div className="flex flex-col md:flex-row-reverse items-center gap-8 md:gap-20 w-full">
          <div className="shrink-0 scale-110 md:scale-150">
            <CircularFrame isReversed image={priaPhoto} onUpload={(e) => handlePhotoUpload(e, setPriaPhoto, 'priaPhoto')}>
              {groomInitial}
            </CircularFrame>
          </div>
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 1.2, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="text-center md:text-right flex-1 px-4"
          >
            <h4 className="text-gold font-serif italic text-sm md:text-lg mb-4 tracking-[0.3em] font-black uppercase drop-shadow-sm">Mempelai Pria</h4>
            <h3 className="font-serif text-3xl md:text-5xl text-zinc-900 mb-8 font-black drop-shadow-md leading-none tracking-tighter italic">{groomFull}</h3>
            <div className="w-20 h-1 bg-gradient-to-l from-gold/40 to-transparent mb-8 hidden md:block ms-auto rounded-full"></div>
            <p className="text-base md:text-lg min-h-[3em] text-zinc-600 font-bold leading-relaxed italic tracking-tight mb-8" dangerouslySetInnerHTML={{ __html: groomDesc ? groomDesc.replace(/\\n/g, '<br/>') : '' }} />
            
            <motion.a
              whileHover={{ scale: 1.05, x: -8 }}
              whileTap={{ scale: 0.95 }}
              href={`https://instagram.com/${groomIg?.replace('@', '').trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-gold hover:text-gold-dark transition-all font-black tracking-[0.2em] text-[10px] md:text-xs uppercase group bg-gold/10 px-6 py-3 rounded-[var(--radius-minimal)] border border-gold/20 hover:border-gold/50"
            >
              <Instagram size={14} className="group-hover:rotate-12 transition-transform" />
              <span>{groomIg}</span>
            </motion.a>
          </motion.div>
        </div>

      </div>
    </section>
  );
}
