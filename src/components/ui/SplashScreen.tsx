'use client';

import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [phase, setPhase] = useState(0);
  const [mounted, setMounted] = useState(false);

  // Generate stable random positions once on mount (client-only)
  const particles = useMemo(() => {
    if (typeof window === 'undefined') return [];
    return Array.from({ length: 20 }).map(() => ({
      left: Math.random() * 100,
      top: Math.random() * 100,
      duration: 2 + Math.random() * 2,
      delay: Math.random() * 1.5,
    }));
  }, []);

  useEffect(() => {
    setMounted(true);

    // Check if user has already seen splash
    const seen = sessionStorage.getItem('tfc-splash-done');
    if (seen === 'true') {
      setVisible(false);
      return;
    }

    const t1 = setTimeout(() => setPhase(1), 500);
    const t2 = setTimeout(() => setPhase(2), 1500);
    const t3 = setTimeout(() => setPhase(3), 2500);
    const t4 = setTimeout(() => {
      setVisible(false);
      sessionStorage.setItem('tfc-splash-done', 'true');
    }, 3500);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, []);

  // Don't render anything on server to avoid hydration mismatch
  if (!mounted) {
    return (
      <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-cinema-black" />
    );
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { duration: 0.6 } }}
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-cinema-black overflow-hidden"
        >
          {/* Background particles (client-only, no hydration issue) */}
          <div className="absolute inset-0 overflow-hidden">
            {particles.map((p, i) => (
              <motion.div
                key={i}
                className="absolute w-1 h-1 bg-cinema-red rounded-full"
                style={{ left: `${p.left}%`, top: `${p.top}%` }}
                animate={{ y: [0, -200], opacity: [0, 0.8, 0] }}
                transition={{
                  duration: p.duration,
                  delay: p.delay,
                  repeat: Infinity,
                  ease: 'easeOut',
                }}
              />
            ))}
          </div>

          {/* Film strip lines */}
          <div className="absolute inset-0 opacity-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div
                key={i}
                className="absolute top-0 bottom-0 w-px bg-white"
                style={{ left: `${(i + 1) * 10}%` }}
              />
            ))}
          </div>

          {/* Logo */}
          <div className="relative flex flex-col items-center gap-6">
            {/* TFC Logo */}
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.6, ease: [0.34, 1.56, 0.64, 1] }}
              className="relative"
            >
              {/* Outer ring */}
              <motion.div
                animate={{ rotate: 360 }}
                transition={{ duration: 8, repeat: Infinity, ease: 'linear' }}
                style={{
                  width: 140,
                  height: 140,
                  borderRadius: '50%',
                  border: '2px solid rgba(229,9,20,0.4)',
                  position: 'absolute',
                  top: '50%',
                  left: '50%',
                  marginLeft: -70,
                  marginTop: -70,
                }}
              />

              {/* Main logo box */}
              <div
                className="relative w-24 h-24 flex items-center justify-center"
                style={{
                  background: 'linear-gradient(135deg, #1A0000 0%, #0A0A0A 100%)',
                  border: '2px solid rgba(229,9,20,0.6)',
                  borderRadius: '16px',
                  boxShadow: '0 0 40px rgba(229,9,20,0.4), inset 0 0 20px rgba(229,9,20,0.1)',
                }}
              >
                <span
                  className="text-3xl font-black tracking-tighter"
                  style={{
                    fontFamily: 'Outfit, sans-serif',
                    background: 'linear-gradient(135deg, #FF1A1A, #E50914, #B20710)',
                    WebkitBackgroundClip: 'text',
                    WebkitTextFillColor: 'transparent',
                    filter: 'drop-shadow(0 0 8px rgba(229,9,20,0.8))',
                  }}
                >
                  TFC
                </span>
                {/* Film holes */}
                <div className="absolute top-1 left-0 right-0 flex justify-around">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-cinema-black rounded-sm opacity-70" />
                  ))}
                </div>
                <div className="absolute bottom-1 left-0 right-0 flex justify-around">
                  {[0, 1, 2, 3].map((i) => (
                    <div key={i} className="w-1.5 h-1.5 bg-cinema-black rounded-sm opacity-70" />
                  ))}
                </div>
              </div>
            </motion.div>

            {/* Brand name */}
            <AnimatePresence>
              {phase >= 1 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="text-center"
                >
                  <h1
                    className="text-4xl font-black tracking-wide"
                    style={{
                      fontFamily: 'Outfit, sans-serif',
                      background: 'linear-gradient(135deg, #FFFFFF 0%, #C8C8D0 100%)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                      letterSpacing: '0.15em',
                    }}
                  >
                    THE<span style={{ WebkitTextFillColor: '#E50914' }}>FINAL</span>CUT
                  </h1>
                  <p className="text-cinema-silver text-sm tracking-[0.3em] mt-1 uppercase">
                    Cinema Redefined
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Loading bar */}
            <AnimatePresence>
              {phase >= 2 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="w-48 h-0.5 bg-cinema-card overflow-hidden rounded-full"
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{ background: 'linear-gradient(90deg, #E50914, #FF6B6B)' }}
                    initial={{ width: '0%' }}
                    animate={{ width: '100%' }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
