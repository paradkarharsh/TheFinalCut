'use client';

import { useEffect, useState } from 'react';
import { motion, AnimatePresence, useAnimation } from 'framer-motion';
import Image from 'next/image';

export default function SplashScreen() {
  const [visible, setVisible] = useState(true);
  const [mounted, setMounted] = useState(false);
  const [phase, setPhase] = useState<'idle' | 'zoom' | 'sweep' | 'hold' | 'exit'>('idle');
  const logoControls = useAnimation();
  const sweepControls = useAnimation();
  const shakeControls = useAnimation();
  const containerControls = useAnimation();

  useEffect(() => {
    setMounted(true);

    const seen = sessionStorage.getItem('tfc-splash-done');
    if (seen === 'true') {
      setVisible(false);
      return;
    }

    async function runIntro() {
      // Phase 1: Brief pause in darkness (300ms)
      await new Promise(r => setTimeout(r, 300));

      // Phase 2: Logo slams in from small to large with overshoot
      setPhase('zoom');
      await logoControls.start({
        scale: [0.05, 1.08, 0.97, 1.0],
        opacity: [0, 1, 1, 1],
        transition: {
          duration: 0.75,
          times: [0, 0.65, 0.85, 1],
          ease: 'easeOut',
        },
      });

      // Phase 3: Red light sweep across logo (Netflix signature)
      setPhase('sweep');
      await sweepControls.start({
        x: ['-120%', '120%'],
        transition: {
          duration: 0.55,
          ease: [0.22, 1, 0.36, 1],
        },
      });

      // Phase 4: Subtle screen shake (bass hit feel)
      await shakeControls.start({
        x: [0, -6, 5, -3, 2, 0],
        y: [0, 3, -2, 1, 0, 0],
        transition: {
          duration: 0.35,
          ease: 'easeInOut',
        },
      });

      // Phase 5: Hold on logo (glow pulses)
      setPhase('hold');
      await new Promise(r => setTimeout(r, 1200));

      // Phase 6: Fade entire screen to black then exit
      setPhase('exit');
      await containerControls.start({
        opacity: 0,
        transition: { duration: 0.7, ease: 'easeInOut' },
      });

      setVisible(false);
      sessionStorage.setItem('tfc-splash-done', 'true');
    }

    runIntro();
  }, [logoControls, sweepControls, shakeControls, containerControls]);

  if (!mounted) {
    return <div className="fixed inset-0 z-[9999] bg-black" />;
  }

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          animate={containerControls}
          className="fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-black"
        >
          {/* Radial vignette overlay */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background:
                'radial-gradient(ellipse 60% 60% at 50% 50%, transparent 30%, rgba(0,0,0,0.85) 100%)',
            }}
          />

          {/* Logo container — shake target */}
          <motion.div
            animate={shakeControls}
            className="relative flex items-center justify-center"
          >
            {/* Animated glow behind logo */}
            <motion.div
              className="absolute"
              style={{
                width: 360,
                height: 360,
                borderRadius: '50%',
                background:
                  'radial-gradient(circle, rgba(180,0,0,0.35) 0%, rgba(120,0,0,0.15) 50%, transparent 75%)',
                filter: 'blur(40px)',
              }}
              animate={
                phase === 'hold'
                  ? {
                      opacity: [0.6, 1, 0.6],
                      scale: [1, 1.1, 1],
                    }
                  : { opacity: 0.4, scale: 1 }
              }
              transition={
                phase === 'hold'
                  ? { duration: 1.5, repeat: Infinity, ease: 'easeInOut' }
                  : {}
              }
            />

            {/* Logo — zoom target */}
            <motion.div
              animate={logoControls}
              initial={{ scale: 0.05, opacity: 0 }}
              className="relative z-10"
              style={{ willChange: 'transform, opacity' }}
            >
              {/* Sweep light overlay clipped to logo bounds */}
              <div className="relative overflow-hidden" style={{ borderRadius: 8 }}>
                <Image
                  src="/images/logo.png"
                  alt="The Final Cut"
                  width={300}
                  height={300}
                  priority
                  className="relative z-10 select-none"
                  style={{
                    filter:
                      phase === 'hold'
                        ? 'drop-shadow(0 0 40px rgba(200,0,0,0.6)) drop-shadow(0 0 80px rgba(160,0,0,0.3))'
                        : 'drop-shadow(0 0 20px rgba(200,0,0,0.4))',
                    transition: 'filter 0.5s ease',
                  }}
                  draggable={false}
                />

                {/* Netflix-style red sweep stripe — clips inside logo */}
                <motion.div
                  animate={sweepControls}
                  initial={{ x: '-120%' }}
                  className="absolute inset-0 pointer-events-none z-20"
                  style={{
                    background:
                      'linear-gradient(105deg, transparent 30%, rgba(255,60,60,0.18) 45%, rgba(255,120,120,0.55) 50%, rgba(255,60,60,0.18) 55%, transparent 70%)',
                    mixBlendMode: 'screen',
                  }}
                />
              </div>
            </motion.div>
          </motion.div>

          {/* Full-screen sweep flash (hits the whole screen on impact) */}
          {phase === 'sweep' && (
            <motion.div
              className="absolute inset-0 pointer-events-none z-30"
              initial={{ opacity: 0 }}
              animate={{ opacity: [0, 0.12, 0] }}
              transition={{ duration: 0.55, ease: 'easeOut' }}
              style={{
                background:
                  'radial-gradient(ellipse 80% 80% at 50% 50%, rgba(220,0,0,0.15) 0%, transparent 70%)',
              }}
            />
          )}

          {/* Scan lines texture for cinematic feel */}
          <div
            className="absolute inset-0 pointer-events-none z-40 opacity-[0.03]"
            style={{
              backgroundImage:
                'repeating-linear-gradient(0deg, transparent, transparent 2px, rgba(255,255,255,1) 2px, rgba(255,255,255,1) 4px)',
            }}
          />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
