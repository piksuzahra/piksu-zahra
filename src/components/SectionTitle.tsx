import { motion } from 'motion/react';

export default function SectionTitle({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center w-full flex flex-col items-center mb-6 z-10 relative pt-1"
    >
      {subtitle && (
        <motion.span 
          initial={{ opacity: 0, letterSpacing: "0.2em" }}
          whileInView={{ opacity: 1, letterSpacing: "0.5em" }}
          viewport={{ once: true }}
          transition={{ duration: 1.5, delay: 0.2 }}
          className="text-gold uppercase text-[9px] md:text-xs font-black mb-4 block drop-shadow-sm tracking-[0.5em]"
        >
          {subtitle}
        </motion.span>
      )}
      <motion.h2 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.3 }}
        className="font-serif text-5xl md:text-7xl text-zinc-800 mb-6 font-black drop-shadow-sm tracking-tighter italic leading-none"
      >
        <motion.span
          animate={{ rotate: [-1, 1, -1] }}
          transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block"
        >
          {title}
        </motion.span>
      </motion.h2>
      
      <motion.div 
        initial={{ opacity: 0, width: 0 }}
        whileInView={{ opacity: 1, width: "auto" }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.5 }}
        className="flex items-center gap-4 overflow-hidden origin-center mb-4"
      >
        <div className="w-12 md:w-24 h-px bg-gradient-to-r from-transparent via-gold/40 to-transparent"></div>
        <motion.div
           animate={{ scale: [1, 1.2, 1], rotate: 360 }}
           transition={{ scale: { duration: 2, repeat: Infinity }, rotate: { duration: 10, repeat: Infinity, ease: "linear" } }}
        >
           <svg className="w-6 h-6 text-gold/60" viewBox="0 0 24 24" fill="none" stroke="currentColor">
             <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" fill="currentColor" strokeWidth="1"/>
           </svg>
        </motion.div>
        <div className="w-12 md:w-24 h-px bg-gradient-to-l from-transparent via-gold/40 to-transparent"></div>
      </motion.div>
    </motion.div>
  );
}
