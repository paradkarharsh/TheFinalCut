'use client';

import { useState, useEffect, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { Play, Info, Volume2, VolumeX, Star, Clock, ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie, TVSeries } from '@/types';
import { tmdbImage, tmdb } from '@/lib/tmdb';
import { getYouTubeTrailer, formatYear, formatRuntime, getRatingColor } from '@/lib/utils';
import { useQuery } from '@tanstack/react-query';

interface HeroBannerProps {
  items: (Movie | TVSeries)[];
}

export default function HeroBanner({ items }: HeroBannerProps) {
  const [current, setCurrent] = useState(0);
  const [muted, setMuted] = useState(true);
  const [showVideo, setShowVideo] = useState(false);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const featured = items.slice(0, 5);

  // Guard: No API data yet
  if (!featured.length) {
    return (
      <div className="relative w-full h-[100vh] max-h-[900px] min-h-[600px] flex items-center justify-center bg-cinema-black overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-cinema-red/5 to-transparent" />
        <div className="text-center relative z-10">
          <div className="text-8xl mb-6">🎬</div>
          <h1 className="text-5xl font-black text-white mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>
            The<span className="text-cinema-red">Final</span>Cut
          </h1>
          <p className="text-cinema-silver text-xl mb-2">Cinema Redefined</p>
          <p className="text-cinema-silver/60 text-sm">Add your TMDB API key to .env.local to load content</p>
        </div>
      </div>
    );
  }

  const item = featured[current];
  const isMovie = 'title' in item;
  const title = isMovie ? (item as Movie).title : (item as TVSeries).name;
  const date = isMovie ? (item as Movie).release_date : (item as TVSeries).first_air_date;
  const mediaType = isMovie ? 'movie' : 'tv';
  const genres = item.genre_ids?.slice(0, 3) || [];

  const { data: details } = useQuery<Movie | TVSeries>({
    queryKey: ['hero-detail', mediaType, item.id],
    queryFn: async () => {
      if (mediaType === 'movie') {
        return tmdb.getMovieDetails(item.id);
      } else {
        return tmdb.getTVDetails(item.id);
      }
    },
    staleTime: 10 * 60 * 1000,
  });

  const trailerKey = getYouTubeTrailer(details?.videos);

  useEffect(() => {
    setShowVideo(false);
    const t = setTimeout(() => setShowVideo(true), 3000);
    return () => clearTimeout(t);
  }, [current]);

  useEffect(() => {
    intervalRef.current = setInterval(() => {
      setCurrent((c) => (c + 1) % featured.length);
    }, 12000);
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [featured.length]);

  const goTo = (idx: number) => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setCurrent(idx);
  };

  const prev = () => goTo((current - 1 + featured.length) % featured.length);
  const next = () => goTo((current + 1) % featured.length);

  return (
    <div className="relative w-full h-[100vh] max-h-[900px] min-h-[600px] overflow-hidden">
      {/* Backdrop Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={`backdrop-${current}`}
          initial={{ scale: 1.1, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className="absolute inset-0"
        >
          <Image
            src={tmdbImage.backdrop(item.backdrop_path, 'original')}
            alt={title}
            fill
            priority
            className="object-cover object-top"
            sizes="100vw"
          />
          {/* Overlays */}
          <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-cinema-black/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/20 to-transparent" />
          <div className="absolute inset-0 bg-cinema-black/20" />
        </motion.div>
      </AnimatePresence>

      {/* YouTube Trailer Embed */}
      {showVideo && trailerKey && (
        <motion.iframe
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5 }}
          src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&mute=${muted ? 1 : 0}&controls=0&loop=1&playlist=${trailerKey}&showinfo=0&rel=0&iv_load_policy=3&modestbranding=1`}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          className="absolute inset-0 w-full h-full pointer-events-none object-cover"
          style={{ transform: 'scale(1.5)', width: '100%', height: '100%' }}
        />
      )}

      {/* Content */}
      <div className="relative h-full flex items-end pb-24 px-4 sm:px-8 lg:px-16">
        <div className="max-w-2xl">
          <AnimatePresence mode="wait">
            <motion.div
              key={`content-${current}`}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
            >
              {/* Badge */}
              <div className="flex items-center gap-3 mb-4">
                <span className="text-xs font-bold uppercase tracking-widest px-3 py-1 rounded-full bg-cinema-red text-white">
                  {mediaType === 'movie' ? '🎬 Movie' : '📺 Series'}
                </span>
                <div className="flex items-center gap-1.5">
                  <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                  <span className="text-yellow-400 font-bold text-sm">
                    {item.vote_average.toFixed(1)}
                  </span>
                </div>
                {date && (
                  <span className="text-cinema-silver text-sm">{formatYear(date)}</span>
                )}
              </div>

              {/* Title */}
              <h1
                className="text-5xl sm:text-6xl lg:text-7xl font-black mb-4 leading-none"
                style={{
                  fontFamily: 'Outfit, sans-serif',
                  textShadow: '0 4px 30px rgba(0,0,0,0.8)',
                }}
              >
                {title}
              </h1>

              {/* Overview */}
              <p className="text-cinema-silver-light text-base sm:text-lg leading-relaxed mb-6 line-clamp-3 max-w-xl">
                {item.overview}
              </p>

              {/* Metadata row */}
              {details && (
                <div className="flex flex-wrap items-center gap-3 mb-8 text-sm text-cinema-silver">
                  {isMovie && (details as Movie).runtime && (
                    <span className="flex items-center gap-1">
                      <Clock className="w-3.5 h-3.5" />
                      {formatRuntime((details as Movie).runtime)}
                    </span>
                  )}
                  {details.genres?.slice(0, 3).map(g => (
                    <span key={g.id} className="genre-tag">{g.name}</span>
                  ))}
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex items-center gap-4">
                <Link
                  href={`/${mediaType}/${item.id}`}
                  className="flex items-center gap-2 btn-cinema text-base py-3 px-8"
                >
                  <Play className="w-5 h-5 fill-white" />
                  View Details
                </Link>
                <Link
                  href={`/${mediaType}/${item.id}`}
                  className="flex items-center gap-2 btn-cinema-outline text-base py-3 px-6"
                >
                  <Info className="w-5 h-5" />
                  More Info
                </Link>

                {/* Mute toggle */}
                {trailerKey && showVideo && (
                  <button
                    onClick={() => setMuted(!muted)}
                    className="w-11 h-11 glass-dark rounded-full flex items-center justify-center text-white hover:border-cinema-red/50 hover:shadow-[0_0_15px_rgba(229,9,20,0.3)] transition-all"
                  >
                    {muted ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                  </button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation arrows */}
      <button
        onClick={prev}
        className="absolute left-4 sm:left-8 top-1/2 -translate-y-1/2 w-12 h-12 glass-dark rounded-full flex items-center justify-center text-white hover:border-cinema-red/50 hover:shadow-[0_0_15px_rgba(229,9,20,0.3)] transition-all hover:scale-110"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button
        onClick={next}
        className="absolute right-4 sm:right-8 top-1/2 -translate-y-1/2 w-12 h-12 glass-dark rounded-full flex items-center justify-center text-white hover:border-cinema-red/50 hover:shadow-[0_0_15px_rgba(229,9,20,0.3)] transition-all hover:scale-110"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex items-center gap-2">
        {featured.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            className={`h-1 rounded-full transition-all duration-300 ${
              i === current ? 'w-8 bg-cinema-red' : 'w-2 bg-cinema-silver/50 hover:bg-cinema-silver'
            }`}
          />
        ))}
      </div>

      {/* Poster thumbnails */}
      <div className="absolute bottom-8 right-8 hidden xl:flex items-center gap-3">
        {featured.map((f, i) => {
          const fTitle = 'title' in f ? (f as Movie).title : (f as TVSeries).name;
          return (
            <button
              key={i}
              onClick={() => goTo(i)}
              className={`relative w-16 h-24 rounded-lg overflow-hidden transition-all duration-300 ${
                i === current ? 'ring-2 ring-cinema-red scale-110' : 'opacity-50 hover:opacity-100'
              }`}
            >
              <Image
                src={tmdbImage.poster(f.poster_path, 'w185')}
                alt={fTitle}
                fill
                className="object-cover"
                sizes="64px"
              />
            </button>
          );
        })}
      </div>
    </div>
  );
}
