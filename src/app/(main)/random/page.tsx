'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Shuffle, Film, Tv, Clock, Heart, Zap, Loader2, RefreshCw, Play } from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { tmdb, tmdbImage } from '@/lib/tmdb';
import { Movie, TVSeries, Mood } from '@/types';
import { formatRuntime, formatYear, getRatingColor } from '@/lib/utils';
import { MOOD_MAP } from '@/lib/ai';

const ROULETTE_ITEMS = ['🎬', '📺', '🎞️', '🍿', '⭐', '🏆', '🎭', '🎨'];
const MODES = [
  { id: 'movie', label: 'Random Movie', emoji: '🎬', desc: 'Discover a random film' },
  { id: 'tv', label: 'Random Series', emoji: '📺', desc: 'Find a random show' },
  { id: 'hidden', label: 'Hidden Gem', emoji: '💎', desc: 'Underrated masterpiece' },
  { id: 'mood', label: 'By Mood', emoji: '🎭', desc: 'Match your current vibe' },
  { id: 'short', label: 'Quick Watch', emoji: '⏱️', desc: 'Under 90 minutes' },
  { id: 'surprise', label: 'Surprise Me!', emoji: '🎲', desc: 'Total random chaos' },
];

const MOODS: { id: Mood; emoji: string; label: string }[] = [
  { id: 'happy', emoji: '😄', label: 'Happy' },
  { id: 'scared', emoji: '👻', label: 'Scary' },
  { id: 'thoughtful', emoji: '🧠', label: 'Deep' },
  { id: 'thrilled', emoji: '😱', label: 'Thrilling' },
  { id: 'romantic', emoji: '❤️', label: 'Romantic' },
  { id: 'laugh', emoji: '🤣', label: 'Comedy' },
  { id: 'adventurous', emoji: '🚀', label: 'Adventure' },
  { id: 'sad', emoji: '😢', label: 'Emotional' },
];

export default function RandomPickerPage() {
  const [mode, setMode] = useState<string | null>(null);
  const [selectedMood, setSelectedMood] = useState<Mood>('happy');
  const [spinning, setSpinning] = useState(false);
  const [spinIdx, setSpinIdx] = useState(0);
  const [result, setResult] = useState<Movie | TVSeries | null>(null);
  const [page, setPage] = useState(Math.floor(Math.random() * 50) + 1);
  const spinRef = useRef<NodeJS.Timeout | null>(null);

  const mediaType = mode === 'tv' ? 'tv' : 'movie';

  const { data: pool, refetch } = useQuery({
    queryKey: ['random-pool', mode, selectedMood],
    queryFn: async () => {
      if (mode === 'movie' || mode === 'surprise') return tmdb.getPopularMovies(page);
      if (mode === 'tv') return tmdb.getPopularTV(page);
      if (mode === 'hidden') return tmdb.getHiddenGems('movie', Math.floor(Math.random() * 5) + 1);
      if (mode === 'short') return tmdb.getMoviesByRuntime(60, 90, page);
      if (mode === 'mood') {
        const moodCfg = MOOD_MAP[selectedMood];
        return tmdb.discoverMovies({ with_genres: moodCfg.genres.join(','), sort_by: 'popularity.desc', page: Math.floor(Math.random() * 5) + 1 });
      }
      return tmdb.getTrendingMovies();
    },
    enabled: !!mode,
  });

  const spin = async () => {
    if (!mode) return;
    setResult(null);
    setSpinning(true);

    // Animate roulette
    let count = 0;
    const maxSpins = 20 + Math.floor(Math.random() * 15);
    const tick = () => {
      setSpinIdx(i => (i + 1) % ROULETTE_ITEMS.length);
      count++;
      if (count < maxSpins) {
        spinRef.current = setTimeout(tick, 80 + (count / maxSpins) * 200);
      } else {
        // Pick result
        if (pool?.results?.length) {
          const items = pool.results;
          const picked = items[Math.floor(Math.random() * items.length)];
          setResult(picked as Movie | TVSeries);
        }
        setSpinning(false);
      }
    };
    tick();

    // Refetch for freshness
    refetch();
  };

  useEffect(() => () => { if (spinRef.current) clearTimeout(spinRef.current); }, []);

  const resultTitle = result ? ('title' in result ? (result as Movie).title : (result as TVSeries).name) : '';
  const resultDate = result ? ('release_date' in result ? (result as Movie).release_date : (result as TVSeries).first_air_date) : '';

  return (
    <div className="min-h-screen bg-cinema-black pt-28 pb-20 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center mb-12">
          <h1 className="text-5xl font-black mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            🎲 <span className="text-cinema-red">Random</span> Picker
          </h1>
          <p className="text-cinema-silver text-lg">Let fate decide your next cinematic adventure</p>
        </motion.div>

        {/* Mode selection */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-10">
          {MODES.map(m => (
            <motion.button
              key={m.id}
              whileHover={{ scale: 1.04, y: -2 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => { setMode(m.id); setResult(null); }}
              className={`p-4 rounded-2xl text-left transition-all duration-300 ${
                mode === m.id ? 'bg-cinema-red/20 border-2 border-cinema-red' : 'glass border border-white/10 hover:border-cinema-red/30'
              }`}
            >
              <span className="text-3xl block mb-2">{m.emoji}</span>
              <p className="text-white font-bold text-sm">{m.label}</p>
              <p className="text-cinema-silver text-xs mt-0.5">{m.desc}</p>
            </motion.button>
          ))}
        </div>

        {/* Mood picker (if mood mode selected) */}
        <AnimatePresence>
          {mode === 'mood' && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }} className="mb-8">
              <h3 className="text-white font-bold mb-4 text-center">What&apos;s your mood?</h3>
              <div className="grid grid-cols-4 sm:grid-cols-8 gap-3">
                {MOODS.map(m => (
                  <button key={m.id} onClick={() => setSelectedMood(m.id)} className={`flex flex-col items-center gap-1.5 p-3 rounded-xl transition-all ${selectedMood === m.id ? 'bg-cinema-red/20 border border-cinema-red' : 'glass border border-white/10 hover:border-cinema-red/30'}`}>
                    <span className="text-2xl">{m.emoji}</span>
                    <span className="text-white text-xs font-semibold">{m.label}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Roulette + Spin button */}
        <div className="flex flex-col items-center gap-8 mb-12">
          {/* Roulette spinner */}
          <div className="relative w-36 h-36">
            <div
              className="absolute inset-0 rounded-full border-4 border-cinema-red/30"
              style={{ boxShadow: spinning ? '0 0 40px rgba(229,9,20,0.5)' : 'none', transition: 'box-shadow 0.3s' }}
            />
            <div className="absolute inset-3 rounded-full glass flex items-center justify-center">
              <motion.span
                key={spinIdx}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-5xl"
              >
                {ROULETTE_ITEMS[spinIdx]}
              </motion.span>
            </div>
            {spinning && (
              <motion.div
                className="absolute inset-0 rounded-full border-4 border-cinema-red border-t-transparent"
                animate={{ rotate: 360 }}
                transition={{ duration: 0.5, repeat: Infinity, ease: 'linear' }}
              />
            )}
          </div>

          <motion.button
            onClick={spin}
            disabled={!mode || spinning}
            whileHover={!spinning && mode ? { scale: 1.05 } : {}}
            whileTap={!spinning && mode ? { scale: 0.95 } : {}}
            className="flex items-center gap-3 px-10 py-4 rounded-2xl font-black text-xl disabled:opacity-40 disabled:cursor-not-allowed transition-all"
            style={{
              background: !mode || spinning ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #E50914, #FF1A1A)',
              boxShadow: !mode || spinning ? 'none' : '0 0 30px rgba(229,9,20,0.4)',
              fontFamily: 'Outfit, sans-serif',
            }}
          >
            {spinning ? (
              <><Loader2 className="w-6 h-6 animate-spin" /> Picking...</>
            ) : (
              <><Shuffle className="w-6 h-6" /> Spin the Wheel!</>
            )}
          </motion.button>
        </div>

        {/* Result */}
        <AnimatePresence>
          {result && !spinning && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="glass rounded-3xl p-6 border border-cinema-red/30"
              style={{ boxShadow: '0 0 40px rgba(229,9,20,0.15)' }}
            >
              <p className="text-cinema-red text-sm font-bold text-center mb-4 uppercase tracking-widest">✨ Your Destiny Pick</p>
              <div className="flex gap-6 items-start">
                <div className="relative w-32 flex-shrink-0">
                  <Image
                    src={tmdbImage.poster(result.poster_path, 'w342')}
                    alt={resultTitle}
                    width={128}
                    height={192}
                    className="rounded-xl shadow-cinema"
                  />
                  <div 
                    className="absolute top-2 right-2 rating-badge font-mono"
                    style={{
                      borderColor: `${getRatingColor(result.vote_average)}80`,
                      color: getRatingColor(result.vote_average)
                    }}
                  >
                    ⭐ {result.vote_average.toFixed(1)}
                  </div>
                </div>
                <div className="flex-1">
                  <h2 className="text-white text-2xl font-black mb-2" style={{ fontFamily: 'Outfit, sans-serif' }}>{resultTitle}</h2>
                  <p className="text-cinema-silver text-sm mb-4">{resultDate ? formatYear(resultDate) : '—'}</p>
                  <p className="text-cinema-silver-light text-sm leading-relaxed mb-6 line-clamp-3">{result.overview}</p>
                  <div className="flex gap-3">
                    <Link
                      href={`/${mode === 'tv' ? 'tv' : 'movie'}/${result.id}`}
                      className="flex items-center gap-2 btn-cinema"
                    >
                      <Play className="w-4 h-4 fill-white" /> View Details
                    </Link>
                    <button onClick={spin} className="flex items-center gap-2 btn-cinema-outline">
                      <RefreshCw className="w-4 h-4" /> Spin Again
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
