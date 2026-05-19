import { motion, AnimatePresence } from 'motion/react';
import React, { useState, useRef } from 'react';
import { X, Upload, Camera, Loader2 } from 'lucide-react';
import SectionTitle from '../SectionTitle';
import { useGalleryImages, uploadFile } from '../../lib/store';
import DecorativeSVG from '../DecorativeSVG';

export default function Gallery() {
  const [selectedImg, setSelectedImg] = useState<number | null>(null);
  const [images, setImages] = useGalleryImages();
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleGalleryUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []) as File[];
    if (files.length === 0) return;

    setIsUploading(true);
    try {
      const uploadPromises = files.map(file => uploadFile(file, `gallery/${Date.now()}_${file.name}`));
      const urls = await Promise.all(uploadPromises);
      setImages([...images, ...urls]);
    } catch (err) {
      console.error(err);
      alert('Gagal mengunggah foto');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <section className="py-24 px-6 relative flex flex-col items-center overflow-hidden">
      <DecorativeSVG />
      
      {/* Dynamic Sparkles */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        {[...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
              opacity: [0, 0.5, 0],
              scale: [0, 1.2, 0],
              y: [0, -100]
            }}
            transition={{
              duration: 3 + Math.random() * 5,
              repeat: Infinity,
              delay: Math.random() * 10,
              ease: "easeInOut"
            }}
            className="absolute w-1 h-1 bg-gold rounded-full"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${50 + Math.random() * 50}%`
            }}
          />
        ))}
      </div>

      <SectionTitle title="Galeri Momen" subtitle="Our Memories" />

      {isUploading && (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-12 flex items-center gap-4 bg-white/80 backdrop-blur-xl px-8 py-4 rounded-full border border-gold/20 shadow-xl relative z-10"
        >
          <Loader2 size={20} className="animate-spin text-gold" />
          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-900">Menyimpan Momen Bahagia...</span>
        </motion.div>
      )}

      {/* Masonry Grid Simulation */}
      <div className="columns-2 md:columns-3 gap-4 md:gap-6 space-y-4 md:space-y-6 w-full max-w-5xl mx-auto px-2 mt-12 relative z-10">
        {images.map((src, i) => (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            whileInView={{ opacity: 1, scale: 1, y: 0 }}
            viewport={{ once: true, margin: "0px 0px -50px 0px" }}
            transition={{ 
              delay: (i % 6) * 0.1, 
              duration: 1, 
              ease: [0.22, 1, 0.36, 1] 
            }}
            key={i} 
            className="relative break-inside-avoid shadow-[0_20px_50px_rgba(0,0,0,0.1)] rounded-[var(--radius-premium)] overflow-hidden cursor-pointer group bg-zinc-200 border-2 border-white ring-1 ring-gold/10"
            onClick={() => setSelectedImg(i)}
          >
            <div className="absolute inset-0 bg-black/0 group-hover:bg-gold/5 transition-colors duration-700 z-10"></div>
            <img src={src} alt="Gallery" className="w-full h-auto object-cover group-hover:scale-110 transition-transform duration-[2s] ease-out" loading="lazy" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 z-20"></div>
            <div className="absolute bottom-2 right-2 opacity-0 group-hover:opacity-100 transition-all translate-y-4 group-hover:translate-y-0 duration-700 z-30">
               <div className="w-8 h-8 rounded-full bg-white/20 backdrop-blur-md border border-white/30 flex items-center justify-center text-white">
                  <Camera size={14} />
               </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImg !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/90 p-4 backdrop-blur-sm"
            onClick={() => setSelectedImg(null)}
          >
            {/* Lightbox Controls */}
            <div className="absolute top-0 inset-x-0 p-6 flex justify-between items-center z-50">
               <div className="text-white/60 text-[10px] font-black uppercase tracking-[0.3em] bg-black/20 backdrop-blur-md px-4 py-2 rounded-full border border-white/10">
                 Momen {selectedImg + 1} / {images.length}
               </div>
               <button 
                 onClick={() => setSelectedImg(null)}
                 className="text-white p-3 bg-white/10 rounded-full hover:bg-rose/80 transition-all duration-300 cursor-pointer shadow-xl border border-white/20"
               >
                 <X size={24} />
               </button>
            </div>
            
            <motion.img
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ ease: "easeOut", duration: 0.3 }}
              src={images[selectedImg]}
              className="max-w-full max-h-[85vh] rounded-lg object-contain shadow-[0_0_50px_rgba(0,0,0,0.5)] border border-white/10"
              onClick={(e) => e.stopPropagation()} /* prevent closing when clicking img */
            />
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
