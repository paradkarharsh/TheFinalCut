'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import { MOOD_MAP } from '@/lib/ai';
import { Mood } from '@/types';

import Image from 'next/image';

const MOODS: { id: Mood; image: string; label: string; desc: string; gradient: string }[] = [
  { id: 'happy', image: '/images/moods/happy.png', label: 'Happy', desc: 'Uplifting & fun', gradient: 'from-yellow-500/20 to-orange-500/20' },
  { id: 'sad', image: '/images/moods/sad.png', label: 'Emotional', desc: 'Tear-jerkers', gradient: 'from-blue-500/20 to-indigo-500/20' },
  { id: 'thrilled', image: '/images/moods/thrilled.png', label: 'Thrilled', desc: 'Edge-of-seat', gradient: 'from-red-500/20 to-orange-600/20' },
  { id: 'scared', image: '/images/moods/scared.png', label: 'Scared', desc: 'Horror night', gradient: 'from-purple-900/30 to-black/40' },
  { id: 'romantic', image: '/images/moods/romantic.png', label: 'Romantic', desc: 'Love stories', gradient: 'from-pink-500/20 to-red-500/20' },
  { id: 'thoughtful', image: '/images/moods/thoughtful.png', label: 'Thoughtful', desc: 'Mind-bending', gradient: 'from-cyan-500/20 to-blue-600/20' },
  { id: 'adventurous', image: '/images/moods/adventurous.png', label: 'Adventure', desc: 'Epic journeys', gradient: 'from-green-500/20 to-teal-500/20' },
  { id: 'laugh', image: '/images/moods/laugh.png', label: 'Laugh', desc: 'Pure comedy', gradient: 'from-yellow-400/20 to-amber-500/20' },
];

export default function MoodPicker() {
  const [selected, setSelected] = useState<Mood | null>(null);
  const router = useRouter();

  const handleMood = (mood: Mood) => {
    setSelected(mood);
    setTimeout(() => {
      router.push(`/discover?mood=${mood}`);
    }, 600);
  };

  return (
    <section className="px-4 sm:px-8 lg:px-16">
      <h2 className="section-title text-xl sm:text-2xl mb-2">What&apos;s Your Mood?</h2>
      <p className="text-cinema-silver text-sm mb-6 ml-4">Tell us how you feel and we&apos;ll find the perfect watch</p>

      <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
        {MOODS.map((mood) => (
          <motion.button
            key={mood.id}
            onClick={() => handleMood(mood.id)}
            whileHover={{ scale: 1.08, y: -4 }}
            whileTap={{ scale: 0.95 }}
            animate={selected === mood.id ? { scale: [1, 1.2, 1], rotate: [0, 5, -5, 0] } : {}}
            className={`relative flex flex-col items-center gap-2 p-3 sm:p-4 rounded-xl cursor-pointer transition-all duration-300 ${
              selected === mood.id
                ? 'ring-2 ring-cinema-red glass-red'
                : 'glass hover:glass-red'
            }`}
          >
            {/* Background gradient */}
            <div className={`absolute inset-0 rounded-xl bg-gradient-to-br ${mood.gradient} opacity-60`} />
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 mb-1 rounded-full overflow-hidden border-2 border-white/10 shadow-cinema">
              <Image src={mood.image} alt={mood.label} fill className="object-cover" sizes="64px" />
            </div>
            <span className="relative text-white font-bold text-xs sm:text-sm">{mood.label}</span>
            <span className="relative text-cinema-silver text-xs hidden sm:block text-center">{mood.desc}</span>
          </motion.button>
        ))}
      </div>
    </section>
  );
}
