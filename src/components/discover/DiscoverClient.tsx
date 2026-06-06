'use client';

import { useState, useEffect } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { Star, Filter, SlidersHorizontal, Grid, List, ChevronDown } from 'lucide-react';
import { tmdb, tmdbImage } from '@/lib/tmdb';
import { CINEMA_GENRES, MOOD_MAP } from '@/lib/ai';
import { Movie, TVSeries, Mood, PaginatedResponse } from '@/types';
import { formatYear, getRatingColor } from '@/lib/utils';

const SORT_OPTIONS = [
  { value: 'popularity.desc', label: 'Most Popular' },
  { value: 'vote_average.desc', label: 'Highest Rated' },
  { value: 'release_date.desc', label: 'Newest First' },
  { value: 'revenue.desc', label: 'Highest Revenue' },
  { value: 'vote_count.desc', label: 'Most Voted' },
];

const CURATED_LISTS: Record<string, { title: string; emoji: string; params: Record<string, string | number> }> = {
  mindbending: { title: 'Mind-Bending Films', emoji: '🧠', params: { with_genres: '878,9648', 'vote_average.gte': 7.5, sort_by: 'vote_average.desc' } },
  hiddengems: { title: 'Hidden Gems', emoji: '💎', params: { 'vote_count.gte': 50, 'vote_count.lte': 10000, 'vote_average.gte': 7.0, sort_by: 'vote_average.desc' } },
  oscar: { title: 'Oscar-Worthy Films', emoji: '🏆', params: { with_awards: 'true', sort_by: 'vote_average.desc', 'vote_average.gte': 7.5 } },
  latenight: { title: 'Late Night Picks', emoji: '🌙', params: { with_genres: '53,27,9648', sort_by: 'popularity.desc' } },
  dark: { title: 'Darkest Films', emoji: '🔪', params: { with_genres: '27,53', sort_by: 'vote_average.desc', 'vote_average.gte': 6.5 } },
  cult: { title: 'Cult Classics', emoji: '📼', params: { 'primary_release_date.lte': '2000-12-31', 'vote_average.gte': 7.0, sort_by: 'vote_average.desc' } },
  cinematography: { title: 'Perfect Cinematography', emoji: '🎨', params: { sort_by: 'vote_average.desc', 'vote_average.gte': 8.0, 'vote_count.gte': 500 } },
  rewatch: { title: 'Most Rewatchable', emoji: '🔄', params: { sort_by: 'popularity.desc', 'vote_average.gte': 7.5 } },
};

function MediaGrid({ items, mediaType }: { items: (Movie | TVSeries)[]; mediaType: 'movie' | 'tv' }) {
  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
      {items.map((item, idx) => {
        const title = 'title' in item ? (item as Movie).title : (item as TVSeries).name;
        const date = 'release_date' in item ? (item as Movie).release_date : (item as TVSeries).first_air_date;
        return (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.03 }}
          >
            <Link href={`/${mediaType}/${item.id}`} className="block group">
              <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
                <Image
                  src={tmdbImage.poster(item.poster_path, 'w342')}
                  alt={title}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                  sizes="(max-width: 640px) 33vw, (max-width: 768px) 25vw, (max-width: 1024px) 20vw, 15vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div 
                  className="absolute top-2 right-2 rating-badge font-mono"
                  style={{
                    borderColor: `${getRatingColor(item.vote_average)}80`,
                    color: getRatingColor(item.vote_average)
                  }}
                >
                  {item.vote_average.toFixed(1)}
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-2 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white text-xs font-bold truncate">{title}</p>
                  <p className="text-cinema-silver text-xs">{date ? formatYear(date) : '—'}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        );
      })}
    </div>
  );
}

export default function DiscoverClient() {
  const searchParams = useSearchParams();
  const genreParam = searchParams.get('genre');
  const moodParam = searchParams.get('mood') as Mood | null;
  const listParam = searchParams.get('list');

  const [selectedGenre, setSelectedGenre] = useState<number | null>(genreParam ? Number(genreParam) : null);
  const [mediaType, setMediaType] = useState<'movie' | 'tv'>('movie');
  const [sortBy, setSortBy] = useState('popularity.desc');
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (genreParam) setSelectedGenre(Number(genreParam));
  }, [genreParam]);

  // Determine query params
  const getQueryParams = () => {
    if (moodParam && MOOD_MAP[moodParam]) {
      const mood = MOOD_MAP[moodParam];
      return {
        with_genres: mood.genres.join(','),
        sort_by: mood.sort,
        page,
      };
    }
    if (listParam && CURATED_LISTS[listParam]) {
      return { ...CURATED_LISTS[listParam].params, page };
    }
    if (selectedGenre) {
      return { with_genres: selectedGenre, sort_by: sortBy, page };
    }
    return { sort_by: sortBy, page };
  };

  const { data, isLoading } = useQuery<PaginatedResponse<Movie> | PaginatedResponse<TVSeries>>({
    queryKey: ['discover', mediaType, selectedGenre, moodParam, listParam, sortBy, page],
    queryFn: async () => {
      const params = getQueryParams();
      if (mediaType === 'movie') {
        return tmdb.discoverMovies(params as Record<string, string | number>);
      } else {
        return tmdb.discoverTV(params as Record<string, string | number>);
      }
    },
    staleTime: 5 * 60 * 1000,
  });

  const items = data?.results || [];

  const getPageTitle = () => {
    if (moodParam && MOOD_MAP[moodParam]) return `${MOOD_MAP[moodParam].title}`;
    if (listParam && CURATED_LISTS[listParam]) return `${CURATED_LISTS[listParam].emoji} ${CURATED_LISTS[listParam].title}`;
    if (selectedGenre) {
      const genre = CINEMA_GENRES.find(g => g.id === selectedGenre);
      return genre ? `${genre.emoji} ${genre.name}` : 'Discover';
    }
    return '🌐 Discover All';
  };

  return (
    <div className="min-h-screen bg-cinema-black pt-28 pb-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-black mb-4" style={{ fontFamily: 'Outfit, sans-serif' }}>{getPageTitle()}</h1>

          {/* Controls */}
          <div className="flex flex-wrap items-center gap-3">
            {/* Media type */}
            <div className="flex glass rounded-xl overflow-hidden">
              <button onClick={() => { setMediaType('movie'); setPage(1); }} className={`px-4 py-2 text-sm font-semibold transition-all ${mediaType === 'movie' ? 'bg-cinema-red text-white' : 'text-cinema-silver hover:text-white'}`}>🎬 Movies</button>
              <button onClick={() => { setMediaType('tv'); setPage(1); }} className={`px-4 py-2 text-sm font-semibold transition-all ${mediaType === 'tv' ? 'bg-cinema-red text-white' : 'text-cinema-silver hover:text-white'}`}>📺 Series</button>
            </div>

            {/* Sort */}
            <div className="relative">
              <select
                value={sortBy}
                onChange={e => { setSortBy(e.target.value); setPage(1); }}
                className="glass rounded-xl px-4 py-2 text-sm text-white bg-transparent outline-none cursor-pointer pr-8 appearance-none"
              >
                {SORT_OPTIONS.map(o => <option key={o.value} value={o.value} className="bg-cinema-card">{o.label}</option>)}
              </select>
              <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4 text-cinema-silver pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Genre chips */}
        <div className="flex gap-2 overflow-x-auto pb-4 mb-8">
          <button onClick={() => { setSelectedGenre(null); setPage(1); }} className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${!selectedGenre ? 'bg-cinema-red text-white' : 'glass text-cinema-silver hover:text-white'}`}>All</button>
          {CINEMA_GENRES.map(g => (
            <button key={g.id} onClick={() => { setSelectedGenre(g.id); setPage(1); }} className={`flex-shrink-0 flex items-center gap-1.5 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedGenre === g.id ? 'bg-cinema-red text-white' : 'glass text-cinema-silver hover:text-white'}`}>
              <span>{g.emoji}</span>{g.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 xl:grid-cols-7 gap-4">
            {Array.from({ length: 21 }).map((_, i) => (
              <div key={i} className="aspect-[2/3] skeleton rounded-xl" />
            ))}
          </div>
        ) : (
          <MediaGrid items={items} mediaType={mediaType} />
        )}

        {/* Pagination */}
        {data && data.total_pages > 1 && (
          <div className="flex items-center justify-center gap-4 mt-12">
            <button onClick={() => setPage(p => Math.max(1, p - 1))} disabled={page === 1} className="btn-cinema-outline disabled:opacity-30">← Previous</button>
            <span className="text-cinema-silver text-sm">Page {page} of {Math.min(data.total_pages, 500)}</span>
            <button onClick={() => setPage(p => p + 1)} disabled={page >= Math.min(data.total_pages, 500)} className="btn-cinema-outline disabled:opacity-30">Next →</button>
          </div>
        )}
      </div>
    </div>
  );
}
