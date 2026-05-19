/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, VolumeX } from 'lucide-react';
import Cover from './components/sections/Cover';
import Greeting from './components/sections/Greeting';
import Couple from './components/sections/Couple';
import Events from './components/sections/Events';
import Gallery from './components/sections/Gallery';
import Location from './components/sections/Location';
import Gift from './components/sections/Gift';
import Wishes from './components/sections/Wishes';
import Navbar from './components/Navbar';
import AdminDashboard from './components/admin/AdminDashboard';
import SenderDashboard from './components/admin/SenderDashboard';
import DynamicFontLoader from './components/DynamicFontLoader';
import { useAppAudio, useAppText } from './lib/store';

export default function App() {
  const [opened, setOpened] = useState(false);
  const [activeSection, setActiveSection] = useState('salam');
  const [role, setRole] = useState(localStorage.getItem('adminRole') || null);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  const [bgMusic, , musicLoading] = useAppAudio('bgMusic', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  const [theme, , themeLoading] = useAppText('theme', 'rustic');
  const [titleFontUrl, , fontLoading] = useAppText('titleFontUrl', '');

  useEffect(() => {
    // Artificial delay for smooth transition OR wait for results
    const timer = setTimeout(() => {
      if (!musicLoading && !themeLoading && !fontLoading) {
        setIsLoading(false);
      }
    }, 1500);
    
    return () => clearTimeout(timer);
  }, [musicLoading, themeLoading, fontLoading]);

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    // Default to Maroon
    root.style.setProperty('--theme-sage', '#D4AF37'); // Gold as secondary/sage
    root.style.setProperty('--theme-rose', '#800000'); // Maroon
    root.style.setProperty('--theme-gold', '#D4AF37'); // Signature Gold
    root.style.setProperty('--theme-terracotta', '#5C0002'); // Deep Maroon
    body.style.backgroundColor = '#5c1011';
    body.style.color = '#FDFBF7';
  }, [theme]);

  useEffect(() => {
    if (opened && audioRef.current && !isPlaying) {
      audioRef.current.play()
        .then(() => setIsPlaying(true))
        .catch(err => console.log('Autoplay prevented', err));
    }
  }, [opened]);

  const toggleMusic = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  useEffect(() => {
    const handleStorageChange = () => {
      setRole(localStorage.getItem('adminRole'));
    };
    window.addEventListener('storage', handleStorageChange);
    // Custom event for same-tab updates
    window.addEventListener('roleUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('roleUpdated', handleStorageChange);
    };
  }, []);

  useEffect(() => {
    if (!opened || role) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, { threshold: 0.3 });

    const sections = document.querySelectorAll('section[id]');
    sections.forEach(s => observer.observe(s));
    
    return () => observer.disconnect();
  }, [opened, role]);

  const handleLogout = () => {
    localStorage.removeItem('adminRole');
    setRole(null);
  };

  if (role === 'operator') {
    return <AdminDashboard role={role} onLogout={handleLogout} />;
  }

  if (role === 'couple-pria' || role === 'couple-wanita' || role === 'ortu-pria' || role === 'ortu-wanita') {
    return <SenderDashboard role={role} onLogout={handleLogout} />;
  }

  return (
    <>
      <DynamicFontLoader />
      
      <AnimatePresence>
        {isLoading && (
          <motion.div
            key="splash"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1, ease: "easeInOut" }}
            className="fixed inset-0 z-[9999] bg-[#5c1011] flex flex-col items-center justify-center overflow-hidden"
          >
            <motion.div 
               animate={{ 
                 scale: [1, 1.1, 1],
                 opacity: [0.3, 0.6, 0.3]
               }}
               transition={{ duration: 3, repeat: Infinity }}
               className="absolute inset-0 bg-gold/5 blur-[100px] rounded-full pointer-events-none"
            />
            
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="flex flex-col items-center gap-8 relative z-10"
            >
              <div className="relative">
                <div className="w-24 h-24 border-2 border-gold/20 rounded-full animate-[spin_10s_linear_infinite]" />
                <div className="absolute inset-0 flex items-center justify-center">
                   <div className="w-16 h-16 border-t-2 border-gold rounded-full animate-spin" />
                </div>
              </div>
              <div className="text-center">
                <h1 className="font-serif text-white text-3xl font-black italic tracking-widest mb-2 drop-shadow-lg">
                  Loading Invitation
                </h1>
                <p className="text-gold text-xs uppercase tracking-[0.5em] opacity-60">Preparing your experience</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="font-sans text-[#FDFBF7] bg-[#5c1011] min-h-screen selection:bg-gold/20 overflow-x-hidden relative">
      <AnimatePresence>
        {/* Global seamless blobs to unify the pages */}
        {opened && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 2 }}
          >
            <div className="fixed top-[10%] left-[-10%] w-[600px] h-[600px] bg-gold/10 rounded-full blur-[120px] pointer-events-none z-0 mix-blend-screen"></div>
            <div className="fixed top-[50%] right-[-10%] w-[500px] h-[500px] bg-[#350b0b] rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-gold/5 rounded-full blur-[150px] pointer-events-none z-0 mix-blend-screen"></div>
          </motion.div>
        )}
        {!opened && (
          <Cover onOpen={() => {
            window.scrollTo({ top: 0, behavior: 'smooth' });
            setTimeout(() => setOpened(true), 100);
          }} />
        )}
      </AnimatePresence>

      <motion.div
        initial={{ opacity: 0, y: 100 }}
        animate={{ opacity: opened ? 1 : 0, y: opened ? 0 : 100 }}
        transition={{ duration: 1.5, ease: [0.76, 0, 0.24, 1] }}
        className={`pb-28 relative ${!opened ? 'h-screen overflow-hidden' : ''}`}
      >
        <div id="salam"><Greeting /></div>
        <div id="couple"><Couple /></div>
        <div id="acara"><Events /></div>
        <div id="lokasi"><Location /></div>
        <div id="galeri"><Gallery /></div>
        <div id="gift"><Gift /></div>
        <div id="ucapan"><Wishes /></div>
        {opened && <Navbar activeSection={activeSection} />}
        
        {opened && (
          <motion.button
            initial={{ x: -100, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={toggleMusic}
            className="fixed top-4 left-4 z-50 flex items-center justify-center bg-black/40 backdrop-blur-md w-12 h-12 rounded-full shadow-[0_10px_30px_rgba(0,0,0,0.5)] border border-gold/30 text-white/50 hover:text-white hover:border-white transition-all focus:outline-none"
          >
            <div className={`relative ${isPlaying ? 'animate-pulse' : ''}`}>
              {isPlaying ? <Volume2 size={20} className="text-gold" /> : <VolumeX size={20} />}
              {isPlaying && (
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gold/40 rounded-full blur-[4px]"
                />
              )}
            </div>
          </motion.button>
        )}
        <audio ref={audioRef} src={bgMusic || ''} loop />
      </motion.div>
    </div>
    </>
  );
}
