import React, { ReactNode } from 'react';
import { motion } from 'motion/react';
import { Instagram, Heart } from 'lucide-react';
import SectionTitle from '../SectionTitle';
import { useAppImage, useAppText, uploadFile } from '../../lib/store';
import DecorativeSVG from '../DecorativeSVG';

const CircularFrame = ({ children, isReversed, image, onUpload }: { children: ReactNode, isReversed?: boolean, image?: string | null, onUpload?: (e: React.ChangeEvent<HTMLInputElement>) => void }) => (
  <motion.div 
    initial={{ opacity: 0, scale: 0.8 }}
    whileInView={{ opacity: 1, scale: 1 }}
    viewport={{ once: true, margin: "-50px" }}
    transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
    className="relative w-40 h-40 md:w-56 md:h-56 my-4 md:my-6 mx-auto flex items-center justify-center p-3"
  >
    {/* External Animated Ornaments */}
    <motion.div 
      animate={{ rotate: 360 }}
      transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
      className="absolute inset-[-25px] md:inset-[-35px] pointer-events-none z-0 opacity-50 select-none"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full text-gold/40" fill="none" stroke="currentColor" strokeWidth="0.5">
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map(deg => (
          <g key={deg} transform={`rotate(${deg} 100 100)`}>
             <path d="M100 5 C105 15, 115 15, 110 25 S100 35, 100 35 S90 35, 90 25 S95 15, 100 5" className="fill-gold/10" />
             <circle cx="100" cy="15" r="2" fill="currentColor" />
          </g>
        ))}
        <circle cx="100" cy="100" r="85" strokeDasharray="1 6" strokeWidth="2" strokeLinecap="round" />
      </svg>
    </motion.div>

    {/* Secondary Counter-Rotating Ring */}
    <motion.div 
      animate={{ rotate: -360 }}
      transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
      className="absolute inset-[-12px] md:inset-[-18px] pointer-events-none z-0 opacity-70 select-none"
    >
      <svg viewBox="0 0 200 200" className="w-full h-full text-gold/60" fill="none" stroke="currentColor" strokeWidth="0.8">
        {[15, 45, 75, 105, 135, 165, 195, 225, 255, 285, 315, 345].map(deg => (
          <g key={deg} transform={`rotate(${deg} 100 100)`}>
            <circle cx="100" cy="18" r="3" fill="currentColor" className="drop-shadow-[0_0_5px_rgba(212,175,55,0.8)]" />
            <path d="M98 25 L100 35 L102 25 Z" fill="currentColor" />
          </g>
        ))}
      </svg>
    </motion.div>

    {/* Glowing Premium Aura */}
    <motion.div
      animate={{ 
        boxShadow: [
          "0 0 25px rgba(212, 175, 55, 0.2)", 
          "0 0 50px rgba(212, 175, 55, 0.4)", 
          "0 0 25px rgba(212, 175, 55, 0.2)"
        ]
      }}
      transition={{ duration: 6, repeat: Infinity }}
      className={`absolute inset-2 rounded-full z-10 pointer-events-none bg-gradient-to-tr ${isReversed ? 'from-gold/10 to-[#5c1011]/10' : 'from-[#5c1011]/10 to-gold/10'}`}
    />

    {/* The Portrait Frame */}
    <motion.label 
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.98 }}
      className="relative w-full h-full rounded-full border-[8px] border-[#5c1011] overflow-hidden bg-[#5c1011] z-20 shadow-[0_20px_50px_rgba(0,0,0,0.5)] group flex items-center justify-center cursor-pointer ring-2 ring-gold/40"
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
          <div className={`w-full h-full bg-gradient-to-tr ${isReversed ? 'from-zinc-100 to-gold/10' : 'from-zinc-100 to-zinc-900/10'} flex justify-center items-center pointer-events-none`}>
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
  const [priaPhoto, setPriaPhoto] = useAppImage('priaPhoto', 'https://images.unsplash.com/photo-1507679799987-c73774573b0a?auto=format&fit=crop&q=60&w=800');
  const [wanitaPhoto, setWanitaPhoto] = useAppImage('wanitaPhoto', 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&q=60&w=800');

  const [groomName] = useAppText('groomName', 'Piksu');
  const [brideName] = useAppText('brideName', 'Zahra');
  const [groomFull] = useAppText('groomFull', 'Riehaizou');
  const [brideFull] = useAppText('brideFull', 'Fatimatuzzahroh');
  const [groomDesc] = useAppText('groomDesc', 'Putra pertama bapak Haita\\ndan ibu Tri Artati');
  const [brideDesc] = useAppText('brideDesc', 'Putri pertama bapak Algajali\\ndan ibu Harlina');
  const [brideIg] = useAppText('brideIg', '@ftmtzzahra_');
  const [groomIg] = useAppText('groomIg', '@___Zouuuu');
  
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
    <section className="py-16 md:py-24 px-6 flex flex-col items-center overflow-hidden relative">
      <DecorativeSVG />
      
      <div className="absolute top-1/4 -right-20 w-80 h-80 bg-gold/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-1/4 -left-20 w-80 h-80 bg-zinc-900/5 blur-[100px] rounded-full pointer-events-none"></div>

      <SectionTitle 
        title="Sang Mempelai" 
        subtitle="Pasangan Berbahagia" 
        icon={<Heart size={44} strokeWidth={1} fill="currentColor" />} 
      />

      <div className="flex flex-col gap-8 md:gap-16 w-full max-w-3xl mt-8 relative z-10">
        
        {/* Wanita -> Teks Kanan, Foto Kiri on desktop */}
        <div className="flex flex-col md:flex-row items-center gap-6 md:gap-12 w-full mb-10 md:mb-16">
          <div className="shrink-0">
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
            <h4 className="text-gold font-serif italic text-sm md:text-2xl mb-1 md:mb-2 tracking-[0.4em] md:tracking-[0.7em] font-black uppercase drop-shadow-sm">Mempelai Wanita</h4>
            <h3 className="font-serif text-5xl md:text-7xl text-white mb-4 font-black drop-shadow-md leading-tight tracking-widest italic">{brideFull}</h3>
            <div className="w-16 h-1 bg-gradient-to-r from-gold/40 to-transparent mb-4 hidden md:block rounded-full"></div>
            <p className="text-sm md:text-base min-h-[3em] text-white/80 font-bold leading-relaxed italic tracking-tight mb-6" dangerouslySetInnerHTML={{ __html: brideDesc ? brideDesc.replace(/\\n/g, '<br/>') : '' }} />
            
            <motion.a
              whileHover={{ scale: 1.05, x: 8 }}
              whileTap={{ scale: 0.95 }}
              href={`https://instagram.com/${brideIg?.replace('@', '').trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-gold hover:text-white transition-all font-black tracking-[0.2em] text-[10px] md:text-xs uppercase group bg-gold/20 px-6 py-3 rounded-[var(--radius-minimal)] border border-gold/30 hover:border-gold/60"
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
        <div className="flex flex-col md:flex-row-reverse items-center gap-6 md:gap-12 w-full mb-10 md:mb-16">
          <div className="shrink-0">
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
            <h4 className="text-gold font-serif italic text-sm md:text-2xl mb-1 md:mb-2 tracking-[0.4em] md:tracking-[0.7em] font-black uppercase drop-shadow-sm">Mempelai Pria</h4>
            <h3 className="font-serif text-5xl md:text-7xl text-white mb-4 font-black drop-shadow-md leading-tight tracking-widest italic">{groomFull}</h3>
            <div className="w-16 h-1 bg-gradient-to-l from-gold/40 to-transparent mb-4 hidden md:block ms-auto rounded-full"></div>
            <p className="text-sm md:text-base min-h-[3em] text-white/80 font-bold leading-relaxed italic tracking-tight mb-6" dangerouslySetInnerHTML={{ __html: groomDesc ? groomDesc.replace(/\\n/g, '<br/>') : '' }} />
            
            <motion.a
              whileHover={{ scale: 1.05, x: -8 }}
              whileTap={{ scale: 0.95 }}
              href={`https://instagram.com/${groomIg?.replace('@', '').trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-3 text-gold hover:text-white transition-all font-black tracking-[0.2em] text-[10px] md:text-xs uppercase group bg-gold/20 px-6 py-3 rounded-[var(--radius-minimal)] border border-gold/30 hover:border-gold/60"
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
