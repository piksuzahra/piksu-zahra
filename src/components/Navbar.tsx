import { Heart, Calendar, Camera, MapPin, MessageCircle } from 'lucide-react';
import { motion } from 'motion/react';

const menuItems = [
  { id: 'couple', name: 'Couple', icon: Heart },
  { id: 'acara', name: 'Acara', icon: Calendar },
  { id: 'galeri', name: 'Galeri', icon: Camera },
  { id: 'lokasi', name: 'Lokasi', icon: MapPin },
  { id: 'ucapan', name: 'Ucapan', icon: MessageCircle },
];

export default function Navbar({ activeSection }: { activeSection: string }) {
  const scrollToContent = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <motion.nav 
      initial={{ y: 150, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 1.2, delay: 0.8, ease: [0.16, 1, 0.3, 1] }}
      className="fixed bottom-6 md:bottom-10 left-1/2 -translate-x-1/2 gold-glass rounded-full md:rounded-[var(--radius-premium)] z-50 w-fit max-w-[95vw] border-white/20 shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="flex justify-center items-center px-6 md:px-8 py-3 md:py-4 gap-6 md:gap-14 overflow-hidden">
      {menuItems.map((item) => {
        const isActive = activeSection === item.id;
        return (
          <button 
            key={item.id} 
            onClick={() => scrollToContent(item.id)}
            className={`flex flex-col items-center transition-all duration-700 relative group cursor-pointer ${isActive ? 'text-white' : 'text-white/40 hover:text-white/70'}`}
          >
            <div className={`relative transition-all duration-700 ${isActive ? 'scale-110 -translate-y-1' : 'scale-100 group-hover:scale-110'}`}>
              <item.icon size={18} md:size={22} strokeWidth={isActive ? 2.5 : 1.5} className={isActive ? 'text-gold' : ''} />
              {isActive && (
                <motion.div 
                  layoutId="activeTabGlow"
                  className="absolute inset-[-8px] bg-gold/10 blur-xl rounded-full -z-10" 
                />
              )}
            </div>
            <span className={`text-[8px] mt-2 font-black uppercase tracking-[0.25em] transition-all duration-700 ${isActive ? 'text-white opacity-100' : 'opacity-0 scale-50 overflow-hidden h-0'}`}>
              {item.name}
            </span>
            {isActive && (
              <motion.div 
                layoutId="activeTabIndicator"
                className="absolute -bottom-1 w-6 h-0.5 rounded-[var(--radius-minimal)] bg-gold shadow-[0_0_15px_rgba(212,175,55,0.8)]" 
              />
            )}
          </button>
        )
      })}
      </div>
    </motion.nav>
  );
}
