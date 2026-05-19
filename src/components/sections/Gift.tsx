import { motion } from 'motion/react';
import { Copy, Check, Gift as GiftIcon } from 'lucide-react';
import SectionTitle from '../SectionTitle';
import { useState } from 'react';
import { useAppText } from '../../lib/store';

export default function Gift() {
  const [copiedBank, setCopiedBank] = useState<string | null>(null);

  const [bankInfo] = useAppText('bankInfo', 'BCA - 1234567890\na.n. Piksu');
  const [bankInfo2] = useAppText('bankInfo2', 'Mandiri - 0987654321\na.n. Zahra');

  const copyToClipboard = (text: string, id: string) => {
    // Extract numbers only to copy
    const accNumber = text.match(/\d+/g)?.join('') || text;
    navigator.clipboard.writeText(accNumber);
    setCopiedBank(id);
    setTimeout(() => setCopiedBank(null), 2000);
  };

  const renderAccount = (info: string | null, id: string) => {
    if (!info) return null;
    const lines = info.split('\n');
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        whileInView={{ opacity: 1, scale: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
        className="w-full max-w-sm p-12 flex flex-col items-center mb-12 relative overflow-hidden group hover:scale-[1.05] transition-all duration-1000 shadow-[0_50px_100px_rgba(0,0,0,0.5)] border border-gold/30 bg-black/40 backdrop-blur-md rounded-[var(--radius-premium)]"
      >
        <div className="absolute top-0 w-full h-[6px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-60"></div>
        
        <motion.div 
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-gold/10 text-gold rounded-full flex items-center justify-center mb-10 border border-gold/20 shadow-[inset_0_4px_10px_rgba(0,0,0,0.5)] ring-4 ring-black/20"
        >
           <Copy size={32} strokeWidth={1} />
        </motion.div>

        <p className="font-serif font-black text-2xl text-white mb-2 drop-shadow-sm tracking-widest italic">{lines[0]}</p>
        <div className="w-12 h-px bg-gold/50 mb-8"></div>
        {lines.slice(1).map((line, i) => (
          <p key={i} className="text-white/70 text-sm md:text-xl mb-6 md:mb-10 font-black tracking-[0.4em] uppercase w-full text-center opacity-80">{line}</p>
        ))}

        <button
          onClick={() => copyToClipboard(info, id)}
          className={`premium-button flex items-center justify-center gap-5 w-full py-6 text-sm md:text-lg font-black tracking-[0.4em] uppercase transition-all duration-500 min-h-[64px] border border-transparent ${
            copiedBank === id 
            ? 'bg-white text-[#5c1011] shadow-xl' 
            : 'bg-gold text-[#5c1011] shadow-[0_10px_40px_rgba(212,175,55,0.6)] hover:border-white/50 hover:bg-gold/90 hover:-translate-y-2'
          }`}
        >
          {copiedBank === id ? <Check size={20} className="text-zinc-900" /> : <Copy size={18} />}
          <span>{copiedBank === id ? 'Copied' : 'Copy Number'}</span>
        </button>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-gold/10 transition-colors duration-1000"></div>
      </motion.div>
    );
  };

  return (
    <section id="gift" className="py-16 md:py-24 px-6 flex flex-col items-center relative overflow-hidden">
      <SectionTitle 
        title="Kado Digital" 
        subtitle="Tanda Kasih" 
        icon={<GiftIcon size={44} strokeWidth={1} />} 
      />
      
      <p className="max-w-xl text-center text-white/60 mb-10 z-10 leading-relaxed text-xs md:text-sm font-medium">
        Doa restu Anda merupakan karunia yang sangat berarti bagi kami. 
        Dan jika memberi adalah ungkapan tanda kasih Anda, Anda dapat memberi kado secara cashless.
      </p>

      <div className="w-full relative z-10 flex flex-col items-center">
        {renderAccount(bankInfo, 'bank1')}
        {renderAccount(bankInfo2, 'bank2')}
      </div>
    </section>
  );
}
