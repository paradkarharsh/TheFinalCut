'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X, Film, Tv, Users, Loader2 } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useQuery } from '@tanstack/react-query';
import { tmdb, tmdbImage } from '@/lib/tmdb';
import { SearchResult, Movie, TVSeries } from '@/types';
import { formatYear, getRatingColor } from '@/lib/utils';

function ResultCard({ item }: { item: SearchResult }) {
  const isMovie = item.media_type === 'movie';
  const isTV = item.media_type === 'tv';
  const isPerson = item.media_type === 'person';
  const title = item.title || item.name || '';
  const date = item.release_date || item.first_air_date || '';
  const href = isMovie ? `/movie/${item.id}` : isTV ? `/tv/${item.id}` : `/search?q=${encodeURIComponent(title)}`;

  return (
    <Link href={href}>
      <motion.div
        whileHover={{ y: -4, scale: 1.02 }}
        className="cinema-card flex gap-4 p-3 cursor-pointer"
      >
        <div className="relative w-16 h-24 flex-shrink-0 rounded-lg overflow-hidden bg-cinema-elevated">
          {(item.poster_path || item.profile_path) ? (
            <Image
              src={isPerson
                ? tmdbImage.profile(item.profile_path || null)
                : tmdbImage.poster(item.poster_path || null, 'w185')}
              alt={title}
              fill
              className="object-cover"
              sizes="64px"
            />
          ) : (
            <div className="w-full h-full flex items-center justify-center">
              {isMovie ? <Film className="w-6 h-6 text-cinema-silver/40" /> : <Tv className="w-6 h-6 text-cinema-silver/40" />}
            </div>
          )}
        </div>
        <div className="flex-1 min-w-0 py-1">
          <div className="flex items-start justify-between gap-2">
            <h3 className="text-white font-bold text-sm leading-tight">{title}</h3>
            <span className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
              isMovie ? 'bg-cinema-red/20 text-cinema-red' :
              isTV ? 'bg-blue-500/20 text-blue-400' :
              'bg-purple-500/20 text-purple-400'
            }`}>
              {isMovie ? '🎬 Movie' : isTV ? '📺 Series' : '👤 Person'}
            </span>
          </div>
          {date && <p className="text-cinema-silver text-xs mt-1">{formatYear(date)}</p>}
          {item.vote_average && item.vote_average > 0 && (
            <p className="text-yellow-400 text-xs font-bold mt-1">★ {item.vote_average.toFixed(1)}</p>
          )}
          {item.overview && (
            <p className="text-cinema-silver text-xs mt-1.5 line-clamp-2 leading-relaxed">{item.overview}</p>
          )}
          {item.known_for_department && (
            <p className="text-cinema-silver text-xs mt-1">{item.known_for_department}</p>
          )}
        </div>
      </motion.div>
    </Link>
  );
}

export default function SearchPageClient() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get('q') || '';
  const [query, setQuery] = useState(initialQ);
  const [debouncedQuery, setDebouncedQuery] = useState(initialQ);
  const [filterType, setFilterType] = useState<'all' | 'movie' | 'tv' | 'person'>('all');

  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query), 400);
    return () => clearTimeout(t);
  }, [query]);

  useEffect(() => {
    if (debouncedQuery) {
      router.replace(`/search?q=${encodeURIComponent(debouncedQuery)}`, { scroll: false });
    }
  }, [debouncedQuery, router]);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['search', debouncedQuery],
    queryFn: () => tmdb.searchMulti(debouncedQuery),
    enabled: debouncedQuery.length > 1,
    staleTime: 60 * 1000,
  });

  const results = data?.results || [];
  const filtered = filterType === 'all' ? results : results.filter(r => r.media_type === filterType);

  return (
    <div className="min-h-screen bg-cinema-black pt-28 pb-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-8">
        {/* Search header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-black mb-6" style={{ fontFamily: 'Outfit, sans-serif' }}>
            <span className="text-cinema-red">🔍</span> Discover Anything
          </h1>

          {/* Search bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-cinema-silver" />
            <input
              type="text"
              value={query}
              onChange={e => setQuery(e.target.value)}
              placeholder="Search movies, series, actors..."
              className="w-full glass rounded-2xl pl-12 pr-12 py-4 text-white text-lg placeholder-cinema-silver/50 outline-none focus:border-cinema-red/40 border border-white/10 transition-all"
            />
            {query && (
              <button onClick={() => { setQuery(''); setDebouncedQuery(''); }} className="absolute right-4 top-1/2 -translate-y-1/2 text-cinema-silver hover:text-white transition-colors">
                <X className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Filters */}
          <div className="flex gap-2 mt-4">
            {(['all', 'movie', 'tv', 'person'] as const).map(type => (
              <button
                key={type}
                onClick={() => setFilterType(type)}
                className={`px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
                  filterType === type ? 'bg-cinema-red text-white' : 'glass text-cinema-silver hover:text-white'
                }`}
              >
                {type === 'all' ? '🌐 All' : type === 'movie' ? '🎬 Movies' : type === 'tv' ? '📺 Series' : '👤 People'}
              </button>
            ))}
          </div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {isLoading && debouncedQuery && (
            <motion.div key="loading" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center justify-center py-16 gap-3">
              <Loader2 className="w-6 h-6 text-cinema-red animate-spin" />
              <span className="text-cinema-silver">Searching the cinematheque...</span>
            </motion.div>
          )}

          {!isLoading && filtered.length > 0 && (
            <motion.div key="results" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
              <p className="text-cinema-silver text-sm mb-4">{filtered.length} results for "<span className="text-white font-semibold">{debouncedQuery}</span>"</p>
              <div className="grid gap-3">
                {filtered.map(item => <ResultCard key={`${item.media_type}-${item.id}`} item={item} />)}
              </div>
            </motion.div>
          )}

          {!isLoading && debouncedQuery && filtered.length === 0 && (
            <motion.div key="empty" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <span className="text-6xl mb-4 block">🎬</span>
              <p className="text-white font-bold text-xl mb-2">No results found</p>
              <p className="text-cinema-silver">Try a different search term</p>
            </motion.div>
          )}

          {!debouncedQuery && (
            <motion.div key="empty-state" initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-16">
              <span className="text-6xl mb-4 block">🔍</span>
              <p className="text-white font-bold text-xl mb-2">Search TheFinalCut</p>
              <p className="text-cinema-silver">Find movies, TV series, and people</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
