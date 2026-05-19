import { motion } from 'motion/react';
import { MapPin } from 'lucide-react';
import SectionTitle from '../SectionTitle';
import { useAppText } from '../../lib/store';
import DecorativeSVG from '../DecorativeSVG';

export default function Location() {
  const [mapUrl] = useAppText('mapUrl', 'https://maps.app.goo.gl/n9WuWK5ZpW7utU1L8?g_st=iw');
  const [mapIframeUrl] = useAppText('mapIframeUrl', '');

  return (
    <section className="py-24 px-6 flex flex-col items-center relative overflow-hidden min-h-screen">
      <DecorativeSVG />
      <div className="w-full relative z-20">
        <SectionTitle title="Lokasi Acara" subtitle="Denah & Peta" />
      </div>

      {/* Maps Arch Frame */}
      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
        className="relative w-full max-w-[550px] mt-12 z-10"
      >
        <div className="w-full h-[600px] glass-card p-6 overflow-hidden relative group shadow-[0_50px_100px_rgba(0,0,0,0.1)] border-white/60">
          <div className="w-full h-full rounded-[var(--radius-premium)] overflow-hidden relative border-2 border-white/80 shadow-inner">
            {mapIframeUrl ? (
              <iframe 
                src={mapIframeUrl} 
                width="100%" 
                height="100%" 
                style={{ border: 0 }} 
                allowFullScreen={false} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
                className="absolute inset-0 z-0 grayscale contrast-125 opacity-70"
              ></iframe>
            ) : (
              <div className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1524661135-423995f22d0b?q=80&w=800&auto=format&fit=crop')] bg-cover bg-center brightness-110 opacity-50 group-hover:scale-105 transition-transform duration-[4s] ease-out"></div>
            )}
            
            {/* Bouncing Map Pin */}
            <motion.div
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
              className="absolute inset-0 flex items-center justify-center text-terracotta z-10 pointer-events-none"
            >
              <div className="relative -mt-20">
                <MapPin size={80} strokeWidth={1} fill="white" className="relative z-10 drop-shadow-2xl opacity-90" />
                <motion.div 
                  animate={{ scale: [1, 2, 1], opacity: [0.4, 0, 0.4] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                  className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-10 h-3 bg-terracotta/50 rounded-[100%] blur-[4px] -z-10"
                />
              </div>
            </motion.div>

            {/* Overlay Gradient at bottom for text */}
            <div className="absolute bottom-0 inset-x-0 h-64 bg-gradient-to-t from-white via-white/90 to-transparent pointer-events-none z-10"></div>
            
            <div className="absolute bottom-10 inset-x-8 text-center z-20">
              <h4 className="font-serif text-2xl md:text-3xl font-black text-zinc-900 mb-8 drop-shadow-sm tracking-tight italic">Gedung Ratu Elok</h4>
              <motion.a 
                href={mapUrl || '#'}
                target="_blank"
                rel="noopener noreferrer"
                whileHover={{ scale: 1.05, y: -4, boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}
                whileTap={{ scale: 0.95 }}
                className="premium-button px-10 md:px-14 py-6 bg-zinc-900 text-white text-[10px] md:text-xs font-black tracking-[0.4em] transition-all cursor-pointer uppercase inline-flex items-center gap-4 border border-white/20"
              >
                <MapPin size={18} className="text-gold" />
                Penunjuk Jalan
              </motion.a>
            </div>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
