import { motion } from 'motion/react';
import { Leaf } from 'lucide-react';
import SectionTitle from '../SectionTitle';
import DecorativeSVG from '../DecorativeSVG';
import { useAppText } from '../../lib/store';

export default function Greeting() {
  const [greetingTitle] = useAppText('greetingTitle', 'Mukadimah');
  const [greetingSubtitle] = useAppText('greetingSubtitle', 'Maha Suci Allah');
  const [greetingVerse] = useAppText('greetingVerse', 'QS. Ar-Rum: 21');
  const [greetingText] = useAppText('greetingText', '"Dan di antara tanda-tanda kekuasaan-Nya ialah Dia menciptakan untukmu isteri-isteri dari jenismu sendiri, supaya kamu cenderung dan merasa tenteram kepadanya, dan dijadikan-Nya diantaramu rasa kasih dan sayang."');
  const [greetingFooter] = useAppText('greetingFooter', 'Maha Benar Allah dengan segala firman-Nya');

  const floatVar = {
    animate: {
      y: [0, -20, 0],
      rotate: [0, 8, -8, 0],
      transition: { duration: 7, repeat: Infinity, ease: "easeInOut" }
    }
  };

   return (
    <section className="relative flex flex-col items-center justify-center py-24 md:py-32 px-6 overflow-hidden min-h-[60vh]">
      <DecorativeSVG />
      {/* Floating Elements */}
      <motion.div variants={floatVar} animate="animate" className="absolute top-20 left-10 text-sage opacity-20 drop-shadow-sm z-10">
        <Leaf size={100} strokeWidth={0.5} />
      </motion.div>
      <motion.div variants={floatVar} animate="animate" className="absolute bottom-20 right-10 text-rose opacity-20 scale-x-[-1] drop-shadow-sm z-10">
        <Leaf size={120} strokeWidth={0.5} />
      </motion.div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[60vh] bg-gold/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-20 w-full max-w-2xl">
        <SectionTitle title={greetingTitle || "Mukadimah"} subtitle={greetingSubtitle || "Maha Suci Allah"} />
        
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center relative z-10 glass-card p-12 md:p-24 shadow-[0_60px_120px_rgba(0,0,0,0.08)] bg-white/70 border-white/60"
        >
          <div className="absolute top-0 right-0 p-8 opacity-5 rotate-12">
             <Leaf size={100} strokeWidth={0.5} />
          </div>
          <div className="absolute bottom-0 left-0 p-8 opacity-5 -rotate-12 scale-x-[-1]">
             <Leaf size={100} strokeWidth={0.5} />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="mb-12"
          >
            <div className="flex justify-center gap-4 mb-8">
               {[...Array(3)].map((_, i) => (
                 <motion.div 
                   key={i} 
                   animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                   transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                   className="w-1.5 h-1.5 rounded-full bg-gold"
                 ></motion.div>
               ))}
            </div>
            <h2 className="font-serif italic text-4xl md:text-6xl text-zinc-900 drop-shadow-sm font-black tracking-tight leading-tight mb-4">{greetingVerse}</h2>
            <div className="w-16 h-1 bg-gold/20 mx-auto rounded-full"></div>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.6 }}
          >
            <p className="text-zinc-800 leading-[1.8] font-medium text-center text-xl md:text-3xl mb-16 italic tracking-tight opacity-95 max-w-[90%] mx-auto">
              {greetingText}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <div className="flex items-center gap-6 justify-center mb-6">
               <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold/30 to-transparent"></div>
               <div className="w-2.5 h-2.5 rotate-45 border border-gold/40 shadow-[0_0_10px_rgba(212,175,55,0.2)]"></div>
               <div className="w-12 h-[1px] bg-gradient-to-l from-transparent via-gold/30 to-transparent"></div>
            </div>
            <p className="text-zinc-500 leading-relaxed font-black tracking-[0.4em] uppercase text-[9px] md:text-xs">
              {greetingFooter}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
