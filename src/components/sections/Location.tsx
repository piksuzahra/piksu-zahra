import { motion } from 'motion/react';
import { MapPin, Map as MapIcon } from 'lucide-react';
import SectionTitle from '../SectionTitle';
import { useAppText } from '../../lib/store';
import DecorativeSVG from '../DecorativeSVG';

export default function Location() {
  const [mapUrl] = useAppText('mapUrl', 'https://maps.app.goo.gl/n9WuWK5ZpW7utU1L8?g_st=iw');
  const [mapIframeUrl] = useAppText('mapIframeUrl', '');
  const [event2Location] = useAppText('event2Location', 'Gedung Ratu Elok');

  return (
    <section id="lokasi" className="py-16 md:py-24 px-6 flex flex-col items-center relative overflow-hidden">
      <DecorativeSVG />
      <div className="w-full relative z-20 text-center">
        <SectionTitle 
          title="Lokasi Acara" 
          subtitle="Denah & Peta" 
          icon={<MapIcon size={44} strokeWidth={1} />} 
        />
      </div>

      {/* Maps Arch Frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[550px] mt-12 z-10"
      >
        <div className="w-full h-[600px] bg-black/40 backdrop-blur-md p-6 overflow-hidden relative group shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-gold/30 rounded-[var(--radius-premium)]">
          <div className="w-full h-full rounded-[var(--radius-minimal)] overflow-hidden relative border border-gold/20 shadow-inner">
            {mapIframeUrl ? (
              <iframe 
                src={mapIframeUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 z-0 grayscale contrast-125 opacity-40 mix-blend-screen"
              ></iframe>
            ) : (
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center opacity-30 mix-blend-screen group-hover:scale-105 transition-transform duration-[4s] ease-out"></div>
            )}
            
            {/* Bouncing Map Pin */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center text-gold z-10 pointer-events-none"
            >
              <div className="relative -mt-20">
                <MapPin size={80} strokeWidth={1} fill="#5c1011" className="relative z-10 drop-shadow-2xl opacity-90 text-gold" />
                <motion.div 
                  animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-gold/80 rounded-[100%] blur-[4px] -z-10"
                />
              </div>
            </motion.div>

            {/* Overlay Gradient at bottom for text */}
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-[#5c1011] via-[#5c1011]/90 to-transparent pointer-events-none z-10"></div>
            
            <div className="absolute bottom-10 inset-x-8 text-center z-20 flex flex-col items-center">
              <h4 className="font-serif text-2xl md:text-3xl font-black text-white mb-2 drop-shadow-lg tracking-widest italic">{event2Location}</h4>
              <div className="text-white/90 text-xs md:text-sm font-bold tracking-tight mb-8 bg-black/40 px-4 py-2 rounded-full backdrop-blur-sm border border-gold/30 shadow-md">
                {event2Location === 'Gedung Ratu Elok' ? (
                  <p>Jl. Raya Utama No. 88, Desa Ratu Elok</p>
                ) : (
                  <p>Lapangan Sarbini, Jalan Menuju arah Dusun Keladi</p>
                )}
              </div>
              <motion.a 
                href={mapUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -4, boxShadow: "0 25px 50px rgba(212,175,55,0.4)" }}
                whileTap={{ scale: 0.95 }}
                className="premium-button px-10 md:px-14 py-6 bg-gold text-[#5c1011] text-[10px] md:text-xs font-black tracking-[0.4em] transition-all cursor-pointer uppercase inline-flex items-center gap-4 shadow-[0_10px_40px_rgba(212,175,55,0.6)] border border-transparent hover:border-white/50"
              >
                <MapPin size={18} className="text-[#5c1011]" />
                Penunjuk Jalan
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
