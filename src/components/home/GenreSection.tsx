'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import { CINEMA_GENRES } from '@/lib/ai';
import { ArrowRight } from 'lucide-react';

export default function GenreSection() {
  return (
    <section className="px-4 sm:px-8 lg:px-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="section-title text-xl sm:text-2xl">🎭 Browse by Genre</h2>
        <Link href="/discover" className="text-cinema-red text-sm font-semibold hover:text-red-400 transition-colors flex items-center gap-1">
          All Genres <ArrowRight className="w-4 h-4" />
        </Link>
      </div>

      <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-3">
        {CINEMA_GENRES.slice(0, 15).map((genre, idx) => (
          <motion.div
            key={genre.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: idx * 0.05 }}
          >
            <Link
              href={`/discover?genre=${genre.id}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl glass hover:glass-red transition-all duration-300 group text-center"
            >
              <span className="text-3xl group-hover:scale-125 transition-transform duration-300">{genre.emoji}</span>
              <span className="text-white text-xs font-semibold group-hover:text-cinema-red transition-colors">{genre.name}</span>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
