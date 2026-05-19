import { motion } from 'motion/react';

export default function SectionTitle({ title, subtitle }: { title: string, subtitle?: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      className="text-center w-full flex flex-col items-center mb-10 z-10 relative pt-1"
    >
      {subtitle && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="flex items-center gap-3 mb-6"
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gold/40"></div>
          <span className="text-gold uppercase text-[9px] md:text-xs font-black tracking-[0.6em] drop-shadow-sm whitespace-nowrap">
            {subtitle}
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-gold/40"></div>
        </motion.div>
      )}
      <motion.h2 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="font-serif text-4xl md:text-6xl text-zinc-900 mb-8 font-black drop-shadow-sm tracking-tighter italic leading-none relative group cursor-default"
      >
        <div className="absolute -inset-x-12 -inset-y-4 bg-gold/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-center blur-2xl rounded-[100%]"></div>
        <motion.span
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block relative z-10"
        >
          {title}
        </motion.span>
      </motion.h2>
      
      <motion.div 
        initial={{ opacity: 0, width: 0 }}
        whileInView={{ opacity: 1, width: "auto" }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="flex items-center gap-6 overflow-hidden origin-center mb-4"
      >
        <div className="w-16 md:w-32 h-[0.5px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
        <motion.div
           animate={{ rotate: 360 }}
           transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
           className="relative"
        >
           <motion.div
             animate={{ scale: [1, 1.4, 1], opacity: [0.3, 0.6, 0.3] }}
             transition={{ duration: 4, repeat: Infinity }}
             className="absolute inset-0 bg-gold blur-sm rounded-full"
           />
           <svg className="w-6 h-6 text-gold drop-shadow-md" viewBox="0 0 24 24" fill="currentColor">
             <path d="M12 2L14.5 9.5L22 12L14.5 14.5L12 22L9.5 14.5L2 12L9.5 9.5L12 2Z" />
           </svg>
        </motion.div>
        <div className="w-16 md:w-32 h-[0.5px] bg-gradient-to-l from-transparent via-gold/30 to-transparent"></div>
      </motion.div>
    </motion.div>
  );
}
