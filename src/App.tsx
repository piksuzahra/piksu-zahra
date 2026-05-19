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
  
  const [bgMusic] = useAppAudio('bgMusic', 'https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3');
  const [theme] = useAppText('theme', 'rustic');

  useEffect(() => {
    const root = document.documentElement;
    const body = document.body;
    
    if (theme === 'ocean') {
      root.style.setProperty('--theme-sage', '#5c8984'); 
      root.style.setProperty('--theme-rose', '#545b77');
      root.style.setProperty('--theme-gold', '#f2d388');
      root.style.setProperty('--theme-terracotta', '#374259');
      body.style.backgroundColor = '#f0f4f4';
    } else if (theme === 'monochrome') {
      root.style.setProperty('--theme-sage', '#52525b');
      root.style.setProperty('--theme-rose', '#71717a');
      root.style.setProperty('--theme-gold', '#a1a1aa');
      root.style.setProperty('--theme-terracotta', '#3f3f46');
      body.style.backgroundColor = '#fafafa';
    } else if (theme === 'sunset') {
      root.style.setProperty('--theme-sage', '#c46950'); 
      root.style.setProperty('--theme-rose', '#eeb274');
      root.style.setProperty('--theme-gold', '#f1d18a');
      root.style.setProperty('--theme-terracotta', '#a2423d');
      body.style.backgroundColor = '#fffaf0';
    } else {
      // Default rustic
      root.style.setProperty('--theme-sage', '#778f64');
      root.style.setProperty('--theme-rose', '#b87573');
      root.style.setProperty('--theme-gold', '#b38510');
      root.style.setProperty('--theme-terracotta', '#b5513a');
      body.style.backgroundColor = '#FAF8F5';
    }
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

    const sections = document.querySelectorAll('div[id]');
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
      <div className="font-sans text-zinc-800 bg-[#FAF8F5] min-h-screen selection:bg-rose/30 overflow-x-hidden relative">
      <AnimatePresence>
        {/* Global seamless blobs to unify the pages */}
        {opened && (
          <motion.div
             initial={{ opacity: 0 }}
             animate={{ opacity: 1 }}
             transition={{ duration: 2 }}
          >
            <div className="fixed top-[10%] left-[-10%] w-[600px] h-[600px] bg-sage/5 rounded-full blur-[120px] pointer-events-none z-0"></div>
            <div className="fixed top-[50%] right-[-10%] w-[500px] h-[500px] bg-rose/5 rounded-full blur-[100px] pointer-events-none z-0"></div>
            <div className="fixed bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-gold/5 rounded-full blur-[150px] pointer-events-none z-0"></div>
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
            className="fixed top-4 left-4 z-50 flex items-center justify-center bg-white/80 backdrop-blur-md w-12 h-12 rounded-full shadow-xl border border-rose/10 text-zinc-600 hover:text-black transition-all"
          >
            <div className={`relative ${isPlaying ? 'animate-pulse' : ''}`}>
              {isPlaying ? <Volume2 size={20} className="text-gold" /> : <VolumeX size={20} />}
              {isPlaying && (
                <motion.div 
                  animate={{ scale: [1, 1.5, 1], opacity: [0.3, 0, 0.3] }}
                  transition={{ duration: 2, repeat: Infinity }}
                  className="absolute inset-0 bg-gold/20 rounded-full"
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
