import React, { useState } from "react";
import { motion } from "motion/react";
import { Lock, X, LogIn } from "lucide-react";
import { useAppImage, useAppText, uploadFile } from "../../lib/store";
import { auth } from "../../lib/firebase";
import { signInWithPopup, GoogleAuthProvider } from "firebase/auth";

export default function Cover({ onOpen }: { onOpen: () => void }) {
  const [showLogin, setShowLogin] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [recipientName, setRecipientName] = useState("Tamu Undangan");
  const [tokenValid, setTokenValid] = useState(false);
  const [isCheckingToken, setIsCheckingToken] = useState(true);

  React.useEffect(() => {
    const checkToken = async () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get('token');
      const legacyTo = urlParams.get('to');
      
      if (!token) {
        if (legacyTo) {
          setRecipientName(legacyTo);
        }
        setIsCheckingToken(false);
        return;
      }
      
      try {
        const { doc, getDoc } = await import('firebase/firestore');
        const { db } = await import('../../lib/firebase');
        const docSnap = await getDoc(doc(db, 'guests', token));
        
        if (docSnap.exists()) {
          setRecipientName(docSnap.data().name);
          setTokenValid(true);
        } else {
          setRecipientName("Token Tidak Valid");
        }
      } catch (err) {
        console.error("Error fetching guest:", err);
      } finally {
        setIsCheckingToken(false);
      }
    };
    
    checkToken();
  }, []);

  const [coverPhoto, setCoverPhoto] = useAppImage(
    "coverPhoto",
    "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&q=80&w=2000",
  );
  const [groomName] = useAppText("groomName", "Piksu");
  const [brideName] = useAppText("brideName", "Zahra");
  const [weddingDate] = useAppText("weddingDate", "2026-07-05");

  // Format weddingDate or provide fallback
  const d = new Date(weddingDate as string);
  const dayName = isNaN(d.getTime())
    ? "MINGGU"
    : new Intl.DateTimeFormat("id-ID", { weekday: "long" })
        .format(d)
        .toUpperCase();
  const monthName = isNaN(d.getTime())
    ? "JULI"
    : new Intl.DateTimeFormat("id-ID", { month: "long" })
        .format(d)
        .toUpperCase();
  const displayDate = `${dayName}, ${isNaN(d.getTime()) ? "5" : d.getDate()} ${monthName} ${isNaN(d.getTime()) ? "2026" : d.getFullYear()}`;

  return (
    <motion.div
      exit={{ opacity: 0, y: -10, filter: "blur(5px)" }}
      transition={{ duration: 1, ease: [0.4, 0, 0.2, 1] }}
      className="fixed inset-0 flex flex-col items-center justify-center bg-[#FAF8F5] z-[100] overflow-hidden"
    >
      {/* Hidden Login Icon */}
      <div
        className="absolute top-4 right-4 w-10 h-10 flex items-center justify-center opacity-0 hover:opacity-20 transition-opacity z-50 cursor-pointer"
        onClick={() => setShowLogin(true)}
      >
        <Lock size={16} className="text-zinc-600" />
      </div>

      {showLogin && (
        <div className="absolute inset-0 z-[200] bg-zinc-900/40 backdrop-blur-sm flex items-center justify-center p-4">
          <div
            className="bg-white rounded-[var(--radius-premium)] p-8 shadow-2xl max-w-sm w-full relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-4 right-4 text-zinc-400 font-bold hover:text-zinc-800 transition-colors"
            >
              <X size={20} />
            </button>
            <h3 className="font-serif text-3xl font-black text-center mb-8 tracking-tight italic">
              Admin Login
            </h3>
            <form
              onSubmit={(e) => {
                // ... existing passcode logic kept for role setting
                e.preventDefault();
                const form = e.target as HTMLFormElement;
                const user = (
                  form.elements.namedItem("username") as HTMLInputElement
                ).value;
                const pass = (
                  form.elements.namedItem("password") as HTMLInputElement
                ).value;

                if (pass === "123456") {
                  if (
                    [
                      "operator",
                      "couple-pria",
                      "couple-wanita",
                      "ortu-pria",
                      "ortu-wanita",
                    ].includes(user)
                  ) {
                    localStorage.setItem("adminRole", user);
                    window.dispatchEvent(new Event("roleUpdated"));
                  } else {
                    alert("Invalid username");
                  }
                } else {
                  alert("Invalid password");
                }
              }}
              className="space-y-4"
            >
              <input
                name="username"
                type="text"
                placeholder="Username"
                className="w-full premium-input bg-zinc-50 border-zinc-100"
              />
              <input
                name="password"
                type="password"
                placeholder="Passcode"
                className="w-full premium-input bg-zinc-50 border-zinc-100"
              />
              <button
                type="submit"
                className="w-full premium-button bg-gold text-zinc-900 shadow-[0_10px_30px_rgba(212,175,55,0.4)] border border-transparent hover:border-white/50 hover:bg-gold/90 font-black py-5 text-[10px] tracking-[0.3em] uppercase"
              >
                Login
              </button>
            </form>

            <div className="mt-6 pt-6 border-t border-zinc-100">
              <p className="text-[9px] text-zinc-400 font-bold uppercase tracking-widest text-center mb-4">
                Cloud Admin Access
              </p>
              <button
                onClick={async () => {
                  setIsLoggingIn(true);
                  try {
                    const provider = new GoogleAuthProvider();
                    await signInWithPopup(auth, provider);
                    alert("Authenticated with Google. Cloud writes enabled.");
                  } catch (err) {
                    console.error(err);
                    alert("Google login failed");
                  } finally {
                    setIsLoggingIn(false);
                  }
                }}
                disabled={isLoggingIn}
                className="w-full flex items-center justify-center gap-3 py-4 bg-gold text-zinc-900 border border-transparent hover:border-white/50 hover:bg-gold/90 rounded-[var(--radius-premium)] transition-colors shadow-[0_10px_30px_rgba(212,175,55,0.4)] disabled:opacity-50"
              >
                <LogIn size={18} />
                <span className="text-[10px] font-black uppercase tracking-widest">
                  Sign in as Global Admin
                </span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Floating Particles Decor */}
      <div className="absolute inset-0 z-[1] pointer-events-none opacity-40">
        {[...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              opacity: Math.random() * 0.5 + 0.2,
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              y: [null, Math.random() * -100 - 50],
              opacity: [null, 0],
              rotate: [0, 360],
            }}
            transition={{
              duration: Math.random() * 10 + 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 10,
            }}
            className="absolute w-1 h-1 bg-gold rounded-full"
          />
        ))}
      </div>

      {/* Background Theme layer */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-[1px] z-[5] pointer-events-none"></div>
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-black/70 z-[5] pointer-events-none"></div>

      {/* Moving Full Screen Photo */}
      <div className="absolute inset-0 overflow-hidden z-0 pointer-events-none">
        <motion.div
          animate={{ scale: [1, 1.1, 1], rotate: [0, 1, 0] }}
          transition={{ duration: 40, repeat: Infinity, ease: "easeInOut" }}
          className="w-full h-full bg-cover bg-center pointer-events-none"
          style={{ backgroundImage: `url('${coverPhoto}')` }}
        />
      </div>

      <div className="relative z-10 flex flex-col items-center justify-between text-center px-6 w-full h-[100dvh] py-12 md:py-20 pointer-events-none">
        <div className="flex flex-col items-center mt-2 md:mt-6">
          <motion.div
            initial={{ y: -30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-center mb-6 md:mb-12"
          >
            <div className="flex items-center gap-3 md:gap-4 mb-4">
              <div className="w-6 md:w-12 h-px bg-gold/40"></div>
              <p className="text-gold tracking-[0.4em] md:tracking-[0.7em] uppercase text-[10px] md:text-base font-black drop-shadow-lg">
                The Wedding of
              </p>
              <div className="w-6 md:w-12 h-px bg-gold/40"></div>
            </div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 2, ease: [0.22, 1, 0.36, 1] }}
            className="font-script text-[60px] md:text-[120px] mb-6 md:mb-10 text-white drop-shadow-[0_15px_40px_rgba(0,0,0,0.8)] leading-[0.8] flex flex-col items-center select-none"
          >
            <motion.span
              animate={{ y: [-2, 2, -2] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
              className="block"
            >
              {groomName}
            </motion.span>

            <motion.div
              animate={{ scale: [1, 1.1, 1], opacity: [0.8, 1, 0.8] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
              className="flex items-center justify-center my-4 md:my-8"
            >
              <div className="w-8 md:w-16 h-[0.5px] bg-gradient-to-r from-transparent via-gold/80 to-transparent mx-4"></div>
              <span className="font-serif italic text-gold text-xl md:text-4xl drop-shadow-[0_4px_15px_rgba(212,175,55,0.6)]">
                &
              </span>
              <div className="w-8 md:w-16 h-[0.5px] bg-gradient-to-l from-transparent via-gold/80 to-transparent mx-4"></div>
            </motion.div>

            <motion.span
              animate={{ y: [2, -2, 2] }}
              transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
              className="block pt-2"
            >
              {brideName}
            </motion.span>
          </motion.h1>

          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1.8, duration: 1.2 }}
            className="flex flex-col items-center"
          >
            <div className="inline-block px-5 py-1.5 border border-gold/40 backdrop-blur-xl rounded-full bg-black/40 shadow-2xl ring-1 ring-white/10">
              <p className="font-serif tracking-[0.2em] text-[10px] md:text-xs font-black uppercase text-gold drop-shadow-md">
                {displayDate}
              </p>
            </div>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 2.5, duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
          className="w-full flex flex-col items-center pointer-events-auto mt-auto mb-2 md:mb-4 pb-2 md:pb-6"
        >
          {/* Authentic Label Card */}
          <div className="glass-card shadow-[0_40px_100px_rgba(0,0,0,0.6)] p-6 md:p-10 min-w-[300px] max-w-[380px] md:max-w-[420px] mb-12 md:mb-20 relative flex flex-col items-center text-center group transition-all duration-1000 border-white/20 hover:border-gold/50 hover:shadow-gold/20 bg-black/30">
            {/* Elegant Corner Decorative Elements */}
            <div className="absolute top-2 left-2 w-8 h-8 border-t-2 border-l-2 border-gold/30 rounded-tl-xl transition-all duration-1000 group-hover:w-12 group-hover:h-12 group-hover:border-gold/60"></div>
            <div className="absolute top-2 right-2 w-8 h-8 border-t-2 border-r-2 border-gold/30 rounded-tr-xl transition-all duration-1000 group-hover:w-12 group-hover:h-12 group-hover:border-gold/60"></div>
            <div className="absolute bottom-2 left-2 w-8 h-8 border-b-2 border-l-2 border-gold/30 rounded-bl-xl transition-all duration-1000 group-hover:w-12 group-hover:h-12 group-hover:border-gold/60"></div>
            <div className="absolute bottom-2 right-2 w-8 h-8 border-b-2 border-r-2 border-gold/30 rounded-br-xl transition-all duration-1000 group-hover:w-12 group-hover:h-12 group-hover:border-gold/60"></div>

            <motion.p
              initial={{ opacity: 0.6 }}
              animate={{ opacity: [0.6, 1, 0.6] }}
              transition={{ duration: 4, repeat: Infinity }}
              className="text-gold text-[8px] md:text-[10px] tracking-[0.3em] font-black mb-4 md:mb-6 uppercase relative z-10 w-full"
            >
              Kepada Yth. Bapak/Ibu/Saudara/i
            </motion.p>

            <h3 className="text-white font-serif text-2xl md:text-4xl font-black truncate relative z-10 max-w-full px-2 tracking-wide drop-shadow-2xl italic leading-tight capitalize">
              {recipientName}
            </h3>

            <div className="mt-4 md:mt-6 flex items-center gap-4">
              <div className="w-8 md:w-12 h-px bg-gradient-to-r from-transparent to-gold/40"></div>
              <div className="w-2 md:w-3 h-2 md:h-3 rotate-45 bg-gold shadow-[0_0_15px_rgba(212,175,55,0.7)]"></div>
              <div className="w-8 md:w-12 h-px bg-gradient-to-l from-transparent to-gold/40"></div>
            </div>
          </div>

          <motion.button
            animate={{
              y: [0, -6, 0],
              boxShadow: [
                "0 20px 40px rgba(0,0,0,0.4)",
                "0 25px 60px rgba(212, 175, 55, 0.4)",
                "0 20px 40px rgba(0,0,0,0.4)",
              ],
            }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            whileHover={!isCheckingToken && (new URLSearchParams(window.location.search).get("token") ? tokenValid : true) ? { scale: 1.05, y: -10 } : {}}
            whileTap={!isCheckingToken && (new URLSearchParams(window.location.search).get("token") ? tokenValid : true) ? { scale: 0.95 } : {}}
            onClick={onOpen}
            disabled={isCheckingToken || (!!new URLSearchParams(window.location.search).get("token") && !tokenValid) || (!new URLSearchParams(window.location.search).get("token") && !new URLSearchParams(window.location.search).get("to") && window.location.pathname !== '/admin')}
            className={`group px-14 md:px-24 py-4 md:py-6 bg-gold text-zinc-900 font-black tracking-[0.15em] md:tracking-[0.25em] rounded-full transition-all text-sm md:text-base uppercase flex items-center gap-4 overflow-hidden relative shadow-[0_10px_40px_rgba(212,175,55,0.4)] border border-transparent hover:border-white/50 ${isCheckingToken || (!!new URLSearchParams(window.location.search).get("token") && !tokenValid) || (!new URLSearchParams(window.location.search).get("token") && !new URLSearchParams(window.location.search).get("to")) ? 'opacity-50 cursor-not-allowed grayscale' : 'cursor-pointer'}`}
          >
            <span className="relative z-10 flex items-center gap-3">
              {isCheckingToken ? 'Memvalidasi...' : (!new URLSearchParams(window.location.search).get("token") && !new URLSearchParams(window.location.search).get("to") ? 'Link Tidak Valid' : (!!new URLSearchParams(window.location.search).get("token") && !tokenValid ? 'Akses Ditolak' : 'Buka Undangan'))}
              <motion.span
                animate={{ x: [0, 4, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
              >
                →
              </motion.span>
            </span>
            {/* Hover shine effect */}
            <div className="absolute inset-0 bg-white translate-y-full group-hover:translate-y-0 transition-transform duration-700 ease-[0.22,1,0.36,1]"></div>
            <div className="absolute -inset-2 opacity-0 group-hover:opacity-100 bg-white/30 blur-2xl transition-opacity duration-700"></div>
          </motion.button>
        </motion.div>
      </div>
    </motion.div>
  );
}
