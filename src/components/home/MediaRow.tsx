'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight, Star, Play, Plus, Heart, Eye } from 'lucide-react';
import { Movie, TVSeries, MediaType } from '@/types';
import { tmdbImage } from '@/lib/tmdb';
import { formatYear, formatRuntime, getRatingColor, truncate } from '@/lib/utils';
import { useAppStore } from '@/store/useAppStore';
import { cn } from '@/lib/utils';
import toast from 'react-hot-toast';

interface MediaRowProps {
  title: string;
  items: (Movie | TVSeries)[];
  mediaType?: MediaType;
  viewAllHref?: string;
  variant?: 'poster' | 'backdrop';
}

function MediaCard({
  item,
  mediaType,
  variant = 'poster',
}: {
  item: Movie | TVSeries;
  mediaType: MediaType;
  variant?: 'poster' | 'backdrop';
}) {
  const [hovered, setHovered] = useState(false);
  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToFavorites, isInFavorites, markAsSeen, hasSeen } = useAppStore();

  const isMovie = mediaType === 'movie';
  const title = isMovie ? (item as Movie).title : (item as TVSeries).name;
  const date = isMovie ? (item as Movie).release_date : (item as TVSeries).first_air_date;
  const inWatchlist = isInWatchlist(item.id, mediaType);
  const isFavorite = isInFavorites(item.id, mediaType);
  const seen = hasSeen(item.id, mediaType);

  const watchlistItem = {
    mediaId: item.id,
    mediaType,
    title,
    posterPath: item.poster_path,
    addedAt: new Date(),
  };

  const toggleWatchlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (inWatchlist) {
      removeFromWatchlist(item.id, mediaType);
      toast('Removed from watchlist');
    } else {
      addToWatchlist(watchlistItem);
      toast.success('Added to watchlist!');
    }
  };

  const toggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToFavorites(watchlistItem);
    toast.success('Added to favorites!');
  };

  const toggleSeen = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    markAsSeen(watchlistItem);
    toast.success('Marked as seen!');
  };

  if (variant === 'backdrop') {
    return (
      <Link href={`/${mediaType}/${item.id}`}>
        <motion.div
          onHoverStart={() => setHovered(true)}
          onHoverEnd={() => setHovered(false)}
          className="relative w-72 h-44 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer"
          whileHover={{ scale: 1.03, zIndex: 2 }}
          transition={{ duration: 0.25 }}
        >
          <Image
            src={tmdbImage.backdrop(item.backdrop_path, 'w780')}
            alt={title}
            fill
            className="object-cover"
            sizes="288px"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
          <div className="absolute bottom-3 left-3 right-3">
            <p className="text-white font-bold text-sm truncate">{title}</p>
            <div className="flex items-center gap-2 mt-1">
              <Star className="w-3 h-3 text-yellow-400 fill-yellow-400" />
              <span className="text-yellow-400 text-xs font-bold">{item.vote_average.toFixed(1)}</span>
              {date && <span className="text-cinema-silver text-xs">{formatYear(date)}</span>}
            </div>
          </div>
        </motion.div>
      </Link>
    );
  }

  return (
    <Link href={`/${mediaType}/${item.id}`}>
      <motion.div
        onHoverStart={() => setHovered(true)}
        onHoverEnd={() => setHovered(false)}
        className="relative w-36 sm:w-40 flex-shrink-0 rounded-xl overflow-hidden cursor-pointer group"
        whileHover={{ scale: 1.05, zIndex: 10, y: -4 }}
        transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
      >
        {/* Poster */}
        <div className="relative aspect-[2/3]">
          <Image
            src={tmdbImage.poster(item.poster_path, 'w342')}
            alt={title}
            fill
            className="object-cover"
            sizes="160px"
          />

          {/* Gradient overlay */}
          <div className={cn(
            'absolute inset-0 bg-gradient-to-t from-black via-black/30 to-transparent transition-opacity duration-300',
            hovered ? 'opacity-100' : 'opacity-0'
          )} />

          {/* Rating badge */}
          <div 
            className="absolute top-2 right-2 rating-badge font-mono"
            style={{
              borderColor: `${getRatingColor(item.vote_average)}80`, // 50% opacity
              color: getRatingColor(item.vote_average)
            }}
          >
            {item.vote_average.toFixed(1)}
          </div>

          {/* Hover actions */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: hovered ? 1 : 0, y: hovered ? 0 : 10 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="absolute bottom-0 left-0 right-0 p-3 flex flex-col gap-2 pb-4"
          >
            {/* Quick actions */}
            <div className="flex items-center gap-2">
              <div
                className="flex-1 flex items-center justify-center gap-1.5 py-1.5 rounded-lg bg-cinema-red text-white text-xs font-bold transition-all hover:bg-red-500"
              >
                <Play className="w-3 h-3 fill-white" />
                Details
              </div>
            </div>
            <div className="flex items-center justify-between gap-1">
              <button
                onClick={toggleWatchlist}
                className={cn(
                  'p-1.5 rounded-lg transition-all flex-1 flex items-center justify-center',
                  inWatchlist
                    ? 'bg-cinema-red text-white'
                    : 'bg-black/60 text-white hover:bg-cinema-red/20'
                )}
                title="Watchlist"
              >
                <Plus className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleFavorite}
                className={cn(
                  'p-1.5 rounded-lg transition-all flex-1 flex items-center justify-center',
                  isFavorite ? 'bg-pink-600 text-white' : 'bg-black/60 text-white hover:bg-pink-600/20'
                )}
                title="Favorite"
              >
                <Heart className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={toggleSeen}
                className={cn(
                  'p-1.5 rounded-lg transition-all flex-1 flex items-center justify-center',
                  seen ? 'bg-green-600 text-white' : 'bg-black/60 text-white hover:bg-green-600/20'
                )}
                title="Mark as seen"
              >
                <Eye className="w-3.5 h-3.5" />
              </button>
            </div>
          </motion.div>
        </div>

        {/* Title below */}
        <div className="pt-2 pb-1 px-1">
          <p className="text-white text-xs font-semibold truncate transition-colors group-hover:text-cinema-red">{title}</p>
          <p className="text-cinema-silver text-xs mt-0.5">{date ? formatYear(date) : '—'}</p>
        </div>
      </motion.div>
    </Link>
  );
}

export default function MediaRow({ title, items, mediaType, viewAllHref, variant = 'poster' }: MediaRowProps) {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (dir: 'left' | 'right') => {
    if (!rowRef.current) return;
    const amount = rowRef.current.clientWidth * 0.75;
    rowRef.current.scrollBy({ left: dir === 'right' ? amount : -amount, behavior: 'smooth' });
  };

  const inferType = (item: Movie | TVSeries): MediaType => {
    if (mediaType) return mediaType;
    return 'title' in item ? 'movie' : 'tv';
  };

  if (!items.length) return null;

  return (
    <section className="relative">
      {/* Section header */}
      <div className="flex items-center justify-between mb-5 px-4 sm:px-8 lg:px-16">
        <h2 className="section-title text-xl sm:text-2xl">{title}</h2>
        {viewAllHref && (
          <Link
            href={viewAllHref}
            className="text-cinema-red text-sm font-semibold hover:text-red-400 transition-colors flex items-center gap-1"
          >
            View All <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>

      {/* Scroll container */}
      <div className="relative group/row">
        {/* Left arrow */}
        <button
          onClick={() => scroll('left')}
          className="absolute left-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 glass-dark rounded-full flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-all hover:scale-110 shadow-cinema"
          style={{ top: variant === 'poster' ? '40%' : '50%' }}
        >
          <ChevronLeft className="w-5 h-5" />
        </button>

        {/* Row */}
        <div
          ref={rowRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 sm:px-8 lg:px-16 pb-6 pt-4 scroll-smooth"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        >
          {items.map((item) => (
            <MediaCard
              key={item.id}
              item={item}
              mediaType={inferType(item)}
              variant={variant}
            />
          ))}
        </div>

        {/* Right arrow */}
        <button
          onClick={() => scroll('right')}
          className="absolute right-2 top-1/2 -translate-y-1/2 z-10 w-10 h-10 glass-dark rounded-full flex items-center justify-center text-white opacity-0 group-hover/row:opacity-100 transition-all hover:scale-110 shadow-cinema"
          style={{ top: variant === 'poster' ? '40%' : '50%' }}
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Right fade */}
        <div className="absolute top-0 right-0 h-full w-16 bg-gradient-to-l from-cinema-black to-transparent pointer-events-none" />
      </div>
    </section>
  );
}
