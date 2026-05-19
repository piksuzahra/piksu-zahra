import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { useAppText } from '../../lib/store';

export default function Countdown() {
  const [weddingDateStr] = useAppText('weddingDate', '2026-07-05');
  
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const calculateTimeLeft = () => {
      // Create a date object that defaults to midnight local time on the target date
      const eventDate = new Date(weddingDateStr + 'T00:00:00').getTime();
      const now = new Date().getTime();
      const difference = eventDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    const timer = setInterval(calculateTimeLeft, 1000);
    calculateTimeLeft(); // initial call
    return () => clearInterval(timer);
  }, [weddingDateStr]);

  const timeUnits = [
    { label: 'Hari', value: timeLeft.days },
    { label: 'Jam', value: timeLeft.hours },
    { label: 'Menit', value: timeLeft.minutes },
    { label: 'Detik', value: timeLeft.seconds }
  ];

   return (
    <div className="w-full relative z-10 flex flex-col items-center py-20 md:py-32">
      <div className="w-full relative z-10 max-w-5xl text-center px-4">
        <div className="grid grid-cols-4 gap-4 md:gap-12 max-w-4xl mx-auto">
          {timeUnits.map((unit, i) => (
            <motion.div 
              key={unit.label}
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              whileInView={{ opacity: 1, scale: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center group"
            >
              <div className="w-full aspect-square glass-card flex flex-col items-center justify-center mb-6 overflow-hidden relative shadow-[0_30px_70px_rgba(0,0,0,0.06)] border-white/60 ring-1 ring-gold/20 hover:ring-gold/50 transition-all duration-1000 bg-white/70">
                {/* Decorative Elements */}
                <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-transparent via-gold/50 to-transparent"></div>
                <div className="absolute bottom-0 inset-x-0 h-[1.5px] bg-gradient-to-r from-transparent via-gold/20 to-transparent"></div>
                
                {/* Floating Glow */}
                <motion.div 
                  animate={{ 
                    opacity: [0, 0.6, 0],
                    scale: [0.8, 1.4, 0.8]
                  }}
                  transition={{ duration: 6, repeat: Infinity, delay: i * 0.5 }}
                  className="absolute inset[-20%] bg-gold/10 blur-3xl rounded-full"
                />

                <span className="relative z-10 font-serif text-3xl md:text-7xl text-zinc-900 font-black drop-shadow-sm tracking-tighter italic">
                  {unit.value.toString().padStart(2, '0')}
                </span>
              </div>
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 + 0.6 }}
                className="text-[9px] md:text-xs text-zinc-500 font-black uppercase tracking-[0.4em] px-5 py-2 bg-white/80 rounded-[var(--radius-minimal)] border border-zinc-100 shadow-md backdrop-blur-sm"
              >
                {unit.label}
              </motion.div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
