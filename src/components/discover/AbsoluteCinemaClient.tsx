'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import { Star, Trophy, Film, Tv } from 'lucide-react';
import { Movie, TVSeries } from '@/types';
import { tmdb, tmdbImage } from '@/lib/tmdb';
import { CINEMA_GENRES } from '@/lib/ai';
import { formatYear, getRatingColor } from '@/lib/utils';

interface Props {
  initialMovies: Movie[];
  initialSeries: TVSeries[];
}

function RankedCard({ item, rank, mediaType }: { item: Movie | TVSeries; rank: number; mediaType: 'movie' | 'tv' }) {
  const title = 'title' in item ? (item as Movie).title : (item as TVSeries).name;
  const date = 'release_date' in item ? (item as Movie).release_date : (item as TVSeries).first_air_date;
  const ratingColor = getRatingColor(item.vote_average);

  return (
    <Link href={`/${mediaType}/${item.id}`}>
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: (rank - 1) * 0.04 }}
        whileHover={{ x: 4 }}
        className="flex gap-4 p-3 glass rounded-xl hover:border-cinema-red/30 transition-all group cursor-pointer"
      >
        {/* Rank */}
        <div className="flex-shrink-0 w-10 flex items-center justify-center">
          {rank <= 3 ? (
            <span className="text-2xl">
              {rank === 1 ? '🥇' : rank === 2 ? '🥈' : '🥉'}
            </span>
          ) : (
            <span
              className="text-2xl font-black"
              style={{
                fontFamily: 'Outfit, sans-serif',
                color: rank <= 10 ? '#D4AF37' : '#A0A0A8',
              }}
            >
              {rank}
            </span>
          )}
        </div>

        {/* Poster */}
        <div className="relative w-12 h-18 flex-shrink-0 rounded-lg overflow-hidden" style={{ height: 72 }}>
          <Image src={tmdbImage.poster(item.poster_path, 'w185')} alt={title} fill className="object-cover" sizes="48px" />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-bold text-sm group-hover:text-cinema-red transition-colors truncate">{title}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
            <span className="text-yellow-400 font-bold text-xs" style={{ color: ratingColor }}>
              {item.vote_average.toFixed(1)}
            </span>
            {date && <span className="text-cinema-silver text-xs">{formatYear(date)}</span>}
          </div>
          <p className="text-cinema-silver text-xs mt-1 line-clamp-1">{item.overview}</p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function AbsoluteCinemaClient({ initialMovies, initialSeries }: Props) {
  const [activeGenre, setActiveGenre] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<'movie' | 'tv'>('movie');

  const { data: genreMovies } = useQuery({
    queryKey: ['absolute-cinema-movies', activeGenre],
    queryFn: () => activeGenre
      ? tmdb.getTopByGenre(activeGenre, 'movie')
      : tmdb.getTopRatedMovies(),
    staleTime: 10 * 60 * 1000,
  });

  const { data: genreSeries } = useQuery({
    queryKey: ['absolute-cinema-series', activeGenre],
    queryFn: () => activeGenre
      ? tmdb.getTopByGenre(activeGenre, 'tv')
      : tmdb.getTopRatedTV(),
    staleTime: 10 * 60 * 1000,
  });

  const movies = genreMovies?.results || initialMovies;
  const series = genreSeries?.results || initialSeries;
  const displayItems = activeTab === 'movie' ? movies : series;

  return (
    <div className="min-h-screen bg-cinema-black pt-28 pb-20">
      {/* Hero header */}
      <div className="relative overflow-hidden mb-12">
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-red/10 to-transparent" />
        <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16 py-10 relative">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-14 h-14 rounded-2xl bg-cinema-red/20 border border-cinema-red/40 flex items-center justify-center">
              <Trophy className="w-7 h-7 text-cinema-red" />
            </div>
            <div>
              <h1 className="text-4xl sm:text-5xl font-black" style={{ fontFamily: 'Outfit, sans-serif' }}>
                Absolute Cinema
              </h1>
              <p className="text-cinema-silver">The greatest films and series ever made</p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Genre filter */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          <button
            onClick={() => setActiveGenre(null)}
            className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!activeGenre ? 'bg-cinema-red text-white' : 'glass text-cinema-silver hover:text-white'}`}
          >
            🎬 All Genres
          </button>
          {CINEMA_GENRES.map(g => (
            <button
              key={g.id}
              onClick={() => setActiveGenre(g.id)}
              className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${activeGenre === g.id ? 'bg-cinema-red text-white' : 'glass text-cinema-silver hover:text-white'}`}
            >
              {g.emoji} {g.name}
            </button>
          ))}
        </div>

        {/* Movie / TV tabs */}
        <div className="flex glass w-fit rounded-xl overflow-hidden mb-8">
          <button onClick={() => setActiveTab('movie')} className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all ${activeTab === 'movie' ? 'bg-cinema-red text-white' : 'text-cinema-silver hover:text-white'}`}>
            <Film className="w-4 h-4" /> Top 50 Movies
          </button>
          <button onClick={() => setActiveTab('tv')} className={`flex items-center gap-2 px-6 py-3 text-sm font-bold transition-all ${activeTab === 'tv' ? 'bg-cinema-red text-white' : 'text-cinema-silver hover:text-white'}`}>
            <Tv className="w-4 h-4" /> Top 50 Series
          </button>
        </div>

        {/* Rankings */}
        <div className="grid md:grid-cols-2 gap-4">
          {displayItems.slice(0, 50).map((item, idx) => (
            <RankedCard
              key={item.id}
              item={item}
              rank={idx + 1}
              mediaType={activeTab}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
