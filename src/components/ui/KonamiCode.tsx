'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];

export default function KonamiCode() {
  const [keys, setKeys] = useState<string[]>([]);
  const [activated, setActivated] = useState(false);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      setKeys(prev => {
        const next = [...prev, e.key].slice(-KONAMI.length);
        if (next.join(',') === KONAMI.join(',')) {
          setActivated(true);
          setTimeout(() => setActivated(false), 4000);
        }
        return next;
      });
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  return (
    <AnimatePresence>
      {activated && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[9998] pointer-events-none overflow-hidden"
        >
          <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" />
          <div className="absolute inset-0 flex items-center justify-center">
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              exit={{ scale: 0, rotate: 180 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15 }}
              className="text-center"
            >
              <div className="text-8xl mb-4">🎬</div>
              <h2
                className="text-4xl font-black mb-2"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  background: 'linear-gradient(135deg, #E50914, #FF6B6B, #FFD700)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent',
                }}
              >
                SECRET MODE UNLOCKED
              </h2>
              <p className="text-cinema-silver text-lg">You found the hidden Easter egg! 🥚</p>
              <p className="text-cinema-red text-sm mt-2 tracking-widest">THE FINAL CUT SALUTES YOU</p>
            </motion.div>
          </div>
          {/* Particles */}
          {Array.from({ length: 30 }).map((_, i) => (
            <motion.div
              key={i}
              className="absolute text-2xl"
              style={{ left: `${Math.random() * 100}%`, top: `${Math.random() * 100}%` }}
              animate={{ y: [-20, -200], opacity: [1, 0], rotate: [0, 360] }}
              transition={{ duration: 2, delay: Math.random() * 1 }}
            >
              {['🎬','⭐','🎭','🏆','🎞️','🍿'][Math.floor(Math.random() * 6)]}
            </motion.div>
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  );
}
