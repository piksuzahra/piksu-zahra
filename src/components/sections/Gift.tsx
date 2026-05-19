import { motion } from 'motion/react';
import { Copy, Check } from 'lucide-react';
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
        className="w-full max-w-sm glass-card p-12 flex flex-col items-center mb-12 relative overflow-hidden group hover:scale-[1.05] transition-all duration-1000 shadow-[0_50px_100px_rgba(0,0,0,0.08)] border-white/60 bg-white/70"
      >
        <div className="absolute top-0 w-full h-[6px] bg-gradient-to-r from-transparent via-gold to-transparent opacity-60"></div>
        
        <motion.div 
          animate={{ rotate: [0, 8, -8, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="w-24 h-24 bg-gold/5 text-gold rounded-full flex items-center justify-center mb-10 border border-gold/10 shadow-[inset_0_4px_10px_rgba(0,0,0,0.05)] ring-4 ring-white/50"
        >
           <Copy size={32} strokeWidth={1} />
        </motion.div>

        <p className="font-serif font-black text-3xl text-zinc-900 mb-2 drop-shadow-sm tracking-tighter italic">{lines[0]}</p>
        <div className="w-12 h-px bg-gold/30 mb-8"></div>
        {lines.slice(1).map((line, i) => (
          <p key={i} className="text-zinc-500 text-[10px] mb-10 font-black tracking-[0.4em] uppercase w-full text-center opacity-80">{line}</p>
        ))}

        <button
          onClick={() => copyToClipboard(info, id)}
          className={`premium-button flex items-center justify-center gap-5 w-full py-6 text-[10px] font-black tracking-[0.4em] uppercase transition-all duration-1000 ${
            copiedBank === id 
            ? 'bg-zinc-800 text-white shadow-zinc-900/30' 
            : 'bg-zinc-900 text-white hover:bg-gold hover:shadow-gold/30 hover:-translate-y-2'
          }`}
        >
          {copiedBank === id ? <Check size={20} className="text-white" /> : <Copy size={18} />}
          <span>{copiedBank === id ? 'Copied' : 'Copy Number'}</span>
        </button>

        {/* Decorative elements */}
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-gold/5 rounded-full blur-3xl pointer-events-none group-hover:bg-gold/10 transition-colors duration-1000"></div>
      </motion.div>
    );
  };

  return (
    <section className="py-16 p-6 flex flex-col items-center relative overflow-hidden">
      <SectionTitle title="Kado Digital" subtitle="Tanda Kasih" />
      
      <p className="max-w-xl text-center text-zinc-600 mb-10 z-10 leading-relaxed text-sm md:text-base font-medium">
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
