import { motion } from 'motion/react';
import { Leaf, BookOpen } from 'lucide-react';
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
    <section id="salam" className="relative flex flex-col items-center justify-center py-16 md:py-24 px-6 overflow-hidden min-h-[60vh]">
      <DecorativeSVG />
      {/* Floating Elements */}
      <motion.div variants={floatVar} animate="animate" className="absolute top-20 left-10 text-gold opacity-30 drop-shadow-sm z-10">
        <Leaf size={100} strokeWidth={0.5} />
      </motion.div>
      <motion.div variants={floatVar} animate="animate" className="absolute bottom-20 right-10 text-gold opacity-30 scale-x-[-1] drop-shadow-sm z-10">
        <Leaf size={120} strokeWidth={0.5} />
      </motion.div>
      
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[180vw] h-[60vh] bg-gold/5 blur-[150px] rounded-full pointer-events-none z-0"></div>

      <div className="relative z-20 w-full max-w-2xl text-center">
        <SectionTitle 
          title={greetingTitle || "Mukadimah"} 
          subtitle={greetingSubtitle || "Maha Suci Allah"} 
          icon={<BookOpen size={44} strokeWidth={1} />}
        />
        
        <motion.div
          initial={{ opacity: 0, y: 50, scale: 0.98 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.8, ease: [0.22, 1, 0.36, 1] }}
          className="text-center relative z-10 p-10 md:p-14 shadow-[0_40px_100px_rgba(0,0,0,0.5)] bg-black/40 border border-gold/30 backdrop-blur-md rounded-[var(--radius-premium)]"
        >
          <div className="absolute top-0 right-0 p-8 opacity-10 rotate-12 text-gold">
             <Leaf size={100} strokeWidth={0.5} />
          </div>
          <div className="absolute bottom-0 left-0 p-8 opacity-10 -rotate-12 scale-x-[-1] text-gold">
             <Leaf size={100} strokeWidth={0.5} />
          </div>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.4 }}
            className="mb-8"
          >
            <div className="flex justify-center gap-4 mb-6">
               {[...Array(3)].map((_, i) => (
                 <motion.div 
                   key={i} 
                   animate={{ scale: [1, 1.5, 1], opacity: [0.2, 0.5, 0.2] }}
                   transition={{ duration: 3, delay: i * 0.5, repeat: Infinity }}
                   className="w-1.5 h-1.5 rounded-full bg-gold"
                 ></motion.div>
               ))}
            </div>
            <h2 className="font-serif italic text-2xl md:text-3xl text-gold drop-shadow-lg font-black tracking-widest leading-tight mb-4">{greetingVerse}</h2>
            <div className="w-16 h-1 bg-gold/30 mx-auto rounded-full"></div>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5, delay: 0.6 }}
          >
            <p className="text-white/80 leading-[2] font-medium text-center text-sm md:text-lg mb-12 italic tracking-widest max-w-[90%] mx-auto drop-shadow-md">
              {greetingText}
            </p>
          </motion.div>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            whileInView={{ y: 0, opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.2, delay: 0.8 }}
          >
            <div className="flex items-center gap-6 justify-center mb-4">
               <div className="w-12 h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
               <div className="w-2.5 h-2.5 rotate-45 border border-gold shadow-[0_0_15px_rgba(212,175,55,0.4)]"></div>
               <div className="w-12 h-[1px] bg-gradient-to-l from-transparent via-gold/50 to-transparent"></div>
            </div>
            <p className="text-gold/80 leading-relaxed font-black tracking-[0.4em] md:tracking-[0.7em] uppercase text-sm md:text-2xl drop-shadow-md">
              {greetingFooter}
            </p>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
