'use client';

import { useAppStore } from '@/store/useAppStore';
import Link from 'next/link';
import Image from 'next/image';
import { tmdbImage } from '@/lib/tmdb';
import { Play, BookMarked } from 'lucide-react';

export default function ContinueWatching() {
  const { continueWatching, watchlist } = useAppStore();

  const items = continueWatching.length > 0 ? continueWatching : watchlist.slice(0, 6);
  if (!items.length) return null;

  const label = continueWatching.length > 0 ? '▶️ Continue Watching' : '📌 Your Watchlist';

  return (
    <section className="px-4 sm:px-8 lg:px-16">
      <div className="flex items-center justify-between mb-5">
        <h2 className="section-title text-xl sm:text-2xl">{label}</h2>
        <Link href="/profile?tab=watchlist" className="text-cinema-red text-sm font-semibold hover:text-red-400 transition-colors flex items-center gap-1">
          View All <BookMarked className="w-4 h-4" />
        </Link>
      </div>
      <div className="flex gap-4 overflow-x-auto pb-3" style={{ scrollbarWidth: 'none' }}>
        {items.map((item) => (
          <Link
            key={`${item.mediaType}-${item.mediaId}`}
            href={`/${item.mediaType}/${item.mediaId}`}
            className="flex-shrink-0 group"
          >
            <div className="relative w-40 h-24 rounded-xl overflow-hidden">
              <Image
                src={tmdbImage.poster(item.posterPath, 'w342')}
                alt={item.title}
                fill
                className="object-cover"
                sizes="160px"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors" />
              {/* Progress bar */}
              {item.progress && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-white/20">
                  <div className="h-full bg-cinema-red" style={{ width: `${item.progress}%` }} />
                </div>
              )}
              <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <div className="w-10 h-10 rounded-full bg-cinema-red/80 flex items-center justify-center">
                  <Play className="w-5 h-5 text-white fill-white" />
                </div>
              </div>
            </div>
            <p className="text-white text-xs font-semibold mt-2 truncate w-40">{item.title}</p>
          </Link>
        ))}
      </div>
    </section>
  );
}
