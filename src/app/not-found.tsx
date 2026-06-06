'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { Film, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-cinema-black flex items-center justify-center px-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="text-center">
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ repeat: Infinity, duration: 3 }}
          className="text-8xl mb-8 inline-block"
        >
          🎬
        </motion.div>
        <h1
          className="text-8xl font-black mb-4"
          style={{
            fontFamily: 'Outfit, sans-serif',
            background: 'linear-gradient(135deg, #E50914, #FF6B6B)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
          }}
        >
          404
        </h1>
        <h2 className="text-2xl font-bold text-white mb-4">Scene Not Found</h2>
        <p className="text-cinema-silver text-lg mb-10 max-w-md">
          This page must be on the cutting room floor. Let&apos;s get you back to the main feature.
        </p>
        <div className="flex gap-4 justify-center">
          <Link href="/" className="btn-cinema flex items-center gap-2 text-lg py-3 px-8">
            <Home className="w-5 h-5" /> Back to Home
          </Link>
          <Link href="/random" className="btn-cinema-outline flex items-center gap-2 text-lg py-3 px-6">
            <Film className="w-5 h-5" /> Random Pick
          </Link>
        </div>
      </motion.div>
    </div>
  );
}
