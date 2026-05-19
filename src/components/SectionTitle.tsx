import { motion } from 'motion/react';
import React from 'react';

interface SectionTitleProps {
  title: string;
  subtitle?: string;
  icon?: React.ReactNode;
}

export default function SectionTitle({ title, subtitle, icon }: SectionTitleProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10% 0px -10% 0px" }}
      transition={{ duration: 1.2, ease: "easeOut" }}
      className="text-center w-full flex flex-col items-center mb-10 md:mb-16 z-10 relative pt-1"
    >
      {/* Icon Ornamen Teratas */}
      {icon && (
        <motion.div
          initial={{ opacity: 0, scale: 0.5, rotate: -10 }}
          whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="mb-4 text-gold opacity-90 drop-shadow-[0_0_15px_rgba(212,175,55,0.4)]"
        >
          {icon}
        </motion.div>
      )}

      {subtitle && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="flex items-center gap-3 mb-4"
        >
          <div className="w-2 h-2 rounded-full bg-gold/50 shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
          <span className="text-gold uppercase text-sm md:text-2xl font-black tracking-[0.4em] md:tracking-[0.7em] drop-shadow-sm whitespace-nowrap">
            {subtitle}
          </span>
          <div className="w-2 h-2 rounded-full bg-gold/50 shadow-[0_0_8px_rgba(212,175,55,0.6)]"></div>
        </motion.div>
      )}

      <motion.h2 
        initial={{ opacity: 0, scale: 0.98 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="font-serif text-4xl md:text-6xl text-white mb-4 font-black drop-shadow-2xl tracking-widest italic leading-none relative group cursor-default"
      >
        <div className="absolute -inset-x-16 -inset-y-6 bg-gold/5 scale-x-0 group-hover:scale-x-100 transition-transform duration-1000 origin-center blur-3xl rounded-[100%] pointer-events-none"></div>
        <motion.span
          animate={{ scale: [1, 1.02, 1] }}
          transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
          className="inline-block relative z-10 drop-shadow-md"
        >
          {title}
        </motion.span>
      </motion.h2>
      
      <motion.div 
        initial={{ opacity: 0, width: 0 }}
        whileInView={{ opacity: 1, width: "auto" }}
        viewport={{ once: true }}
        transition={{ duration: 1.5, delay: 0.4 }}
        className="flex items-center gap-6 overflow-hidden origin-center"
      >
        <div className="w-12 md:w-24 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
        <div className="w-2.5 h-2.5 rotate-45 border-2 border-gold shadow-[0_0_12px_rgba(212,175,55,0.5)]"></div>
        <div className="w-12 md:w-24 h-[1px] bg-gradient-to-l from-transparent via-gold/50 to-transparent"></div>
      </motion.div>
    </motion.div>
  );
}
