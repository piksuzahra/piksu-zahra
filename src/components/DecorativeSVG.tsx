import { motion } from 'motion/react';

export default function DecorativeSVG() {
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden z-0">
      {/* Organic Leaf 1 */}
      <motion.svg
        animate={{ 
          y: [0, -20, 0], 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.05, 1] 
        }}
        transition={{ duration: 10, repeat: Infinity, ease: 'easeInOut' }}
        className="absolute top-[5%] -left-10 w-64 h-64 text-gold/10 drop-shadow-sm opacity-60"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <path d="M100 20C120 50 180 80 180 120C180 160 140 180 100 180C60 180 20 160 20 120C20 80 80 50 100 20Z" />
        <path d="M100 20L100 180" stroke="white" strokeWidth="0.5" opacity="0.3" />
      </motion.svg>
      
      {/* Organic Leaf 2 */}
      <motion.svg
        animate={{ 
          y: [0, 25, 0], 
          rotate: [0, -8, 8, 0],
          scale: [1, 1.1, 1] 
        }}
        transition={{ duration: 12, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
        className="absolute bottom-[10%] -right-16 w-80 h-80 text-zinc-900/5 drop-shadow-sm opacity-50"
        viewBox="0 0 200 200"
        fill="currentColor"
      >
        <path d="M100 20C120 50 180 80 180 120C180 160 140 180 100 180C60 180 20 160 20 120C20 80 80 50 100 20Z" rotate="45" />
      </motion.svg>
      
      {/* Floating Petals */}
      {[...Array(6)].map((_, i) => (
        <motion.svg
          key={i}
          initial={{ 
            x: Math.random() * 100 + '%', 
            y: -100, 
            rotate: Math.random() * 360,
            opacity: 0.1 + Math.random() * 0.3
          }}
          animate={{ 
            y: ['100vh', '-10vh'],
            x: [
              (Math.random() * 100) + '%', 
              (Math.random() * 100) + '%'
            ],
            rotate: 360 * (i % 2 === 0 ? 1 : -1)
          }}
          transition={{ 
            duration: 15 + Math.random() * 10, 
            repeat: Infinity, 
            ease: 'linear',
            delay: Math.random() * 10
          }}
          className="absolute w-6 h-6 text-gold/20 pointer-events-none"
          viewBox="0 0 24 24"
          fill="currentColor"
        >
          <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
        </motion.svg>
      ))}

      {/* Background Soft Glows */}
      <div className="absolute top-[20%] left-[20%] w-96 h-96 bg-gold/5 blur-[100px] rounded-full pointer-events-none"></div>
      <div className="absolute bottom-[30%] right-[10%] w-[500px] h-[500px] bg-gold/5 blur-[120px] rounded-full pointer-events-none"></div>
    </div>
  );
}
