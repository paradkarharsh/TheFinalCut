'use client';

import { useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { User, BookMarked, Heart, Eye, Star, Film, Tv, Clock, BarChart2, Award, LogOut } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useAppStore } from '@/store/useAppStore';
import { tmdbImage } from '@/lib/tmdb';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis } from 'recharts';

const TABS = ['Overview', 'Watchlist', 'Favorites', 'Seen', 'Stats'];
const COLORS = ['#E50914', '#D4AF37', '#00C853', '#00D4FF', '#9B59B6', '#FF6D00'];

export default function ProfileClient() {
  const { user, logout } = useAuth();
  const { watchlist, favorites, seenList, userReviews } = useAppStore();
  const searchParams = useSearchParams();
  const router = useRouter();
  const tabParam = searchParams.get('tab');
  const [activeTab, setActiveTab] = useState(TABS.find(t => t.toLowerCase() === tabParam) || 'Overview');

  if (!user) {
    return (
      <div className="min-h-screen bg-cinema-black pt-28 flex items-center justify-center px-4">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="text-center glass rounded-3xl p-12 max-w-md">
          <span className="text-6xl mb-6 block">🎬</span>
          <h2 className="text-2xl font-black text-white mb-3">Sign In to Access Your Profile</h2>
          <p className="text-cinema-silver mb-8">Track watchlists, favorites, ratings & more</p>
          <Link href="/auth/login" className="btn-cinema text-lg py-3 px-8">Sign In</Link>
          <p className="mt-4 text-cinema-silver text-sm">
            No account? <Link href="/auth/register" className="text-cinema-red hover:text-red-400">Register free</Link>
          </p>
        </motion.div>
      </div>
    );
  }

  // Stats
  const totalWatched = seenList.length;
  const totalWatchlist = watchlist.length;
  const totalFavorites = favorites.length;
  const movieCount = watchlist.filter(i => i.mediaType === 'movie').length;
  const tvCount = watchlist.filter(i => i.mediaType === 'tv').length;

  const genreData = [
    { name: 'Movies', value: movieCount || 1 },
    { name: 'TV Series', value: tvCount || 1 },
    { name: 'Favorites', value: totalFavorites || 1 },
  ];

  const statsData = [
    { name: 'Watchlist', value: totalWatchlist },
    { name: 'Favorites', value: totalFavorites },
    { name: 'Seen', value: totalWatched },
    { name: 'Reviews', value: userReviews.length },
  ];

  const renderWatchlistGrid = (items: typeof watchlist) => {
    if (!items.length) return (
      <div className="text-center py-16 glass rounded-2xl">
        <span className="text-5xl mb-4 block">🎬</span>
        <p className="text-white font-bold text-lg mb-2">Nothing here yet</p>
        <p className="text-cinema-silver text-sm">Start browsing and add titles</p>
        <Link href="/discover" className="btn-cinema mt-4 inline-block">Discover Now</Link>
      </div>
    );
    return (
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 lg:grid-cols-8 gap-3">
        {items.map(item => (
          <Link key={`${item.mediaType}-${item.mediaId}`} href={`/${item.mediaType}/${item.mediaId}`} className="group">
            <div className="relative aspect-[2/3] rounded-xl overflow-hidden">
              <Image
                src={tmdbImage.poster(item.posterPath, 'w185')}
                alt={item.title}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
                sizes="(max-width: 640px) 33vw, (max-width: 1024px) 25vw, 12.5vw"
              />
            </div>
            <p className="text-white text-xs font-semibold mt-1 truncate">{item.title}</p>
          </Link>
        ))}
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-cinema-black pt-28 pb-20">
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16">
        {/* Profile header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-10 glass rounded-2xl p-6">
          {user.photoURL ? (
            <Image src={user.photoURL} alt={user.displayName || 'User'} width={80} height={80} className="rounded-full ring-4 ring-cinema-red/30" />
          ) : (
            <div className="w-20 h-20 rounded-full bg-cinema-red/20 ring-4 ring-cinema-red/30 flex items-center justify-center">
              <User className="w-10 h-10 text-cinema-red" />
            </div>
          )}
          <div className="flex-1 text-center sm:text-left">
            <h1 className="text-3xl font-black text-white mb-1" style={{ fontFamily: 'Outfit, sans-serif' }}>
              {user.displayName || 'Cinema Lover'}
            </h1>
            <p className="text-cinema-silver text-sm mb-4">{user.email}</p>
            <div className="flex flex-wrap justify-center sm:justify-start gap-4 text-sm">
              {[
                { label: 'Watchlist', value: totalWatchlist, icon: BookMarked },
                { label: 'Favorites', value: totalFavorites, icon: Heart },
                { label: 'Seen', value: totalWatched, icon: Eye },
                { label: 'Reviews', value: userReviews.length, icon: Star },
              ].map(stat => (
                <div key={stat.label} className="flex items-center gap-1.5 text-cinema-silver">
                  <stat.icon className="w-4 h-4 text-cinema-red" />
                  <span className="font-bold text-white">{stat.value}</span>
                  <span>{stat.label}</span>
                </div>
              ))}
            </div>
          </div>
          <button onClick={() => { logout(); router.push('/'); }} className="btn-cinema-outline flex items-center gap-2 text-sm flex-shrink-0">
            <LogOut className="w-4 h-4" /> Sign Out
          </button>
        </motion.div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 border-b border-white/10 pb-2">
          {TABS.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-cinema-red text-white' : 'text-cinema-silver hover:text-white hover:bg-white/5'}`}>{tab}</button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          <motion.div key={activeTab} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.25 }}>
            {activeTab === 'Overview' && (
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h2 className="section-title text-lg mb-6">Achievements</h2>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { emoji: '🎬', label: 'First Watch', earned: true },
                      { emoji: '📚', label: 'Bibliophile', earned: totalWatchlist >= 10 },
                      { emoji: '❤️', label: 'Fan', earned: totalFavorites >= 5 },
                      { emoji: '⭐', label: 'Critic', earned: userReviews.length >= 3 },
                      { emoji: '👁️', label: 'Watcher', earned: totalWatched >= 10 },
                      { emoji: '🏆', label: 'Cinephile', earned: totalWatched >= 50 },
                    ].map(badge => (
                      <div key={badge.label} className={`flex flex-col items-center gap-2 p-4 rounded-xl text-center transition-all ${badge.earned ? 'glass-red border border-cinema-red/30' : 'glass opacity-40'}`}>
                        <span className="text-3xl">{badge.emoji}</span>
                        <span className="text-white text-xs font-bold">{badge.label}</span>
                        {!badge.earned && <span className="text-cinema-silver text-xs">Locked</span>}
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h2 className="section-title text-lg mb-6">Activity Stats</h2>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={statsData}>
                        <XAxis dataKey="name" tick={{ fill: '#A0A0A8', fontSize: 12 }} />
                        <YAxis tick={{ fill: '#A0A0A8', fontSize: 12 }} />
                        <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(229,9,20,0.3)', borderRadius: '8px' }} />
                        <Bar dataKey="value" fill="#E50914" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  {/* Distribution chart */}
                  <h3 className="text-white font-bold mt-6 mb-4">My Library Distribution</h3>
                  <div className="h-40">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={genreData} cx="50%" cy="50%" innerRadius={40} outerRadius={60} paddingAngle={3} dataKey="value" nameKey="name">
                          {genreData.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
                        </Pie>
                        <Tooltip contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(229,9,20,0.3)', borderRadius: '8px' }} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'Watchlist' && (
              <div>
                <h2 className="section-title text-lg mb-6">My Watchlist ({watchlist.length})</h2>
                {renderWatchlistGrid(watchlist)}
              </div>
            )}

            {activeTab === 'Favorites' && (
              <div>
                <h2 className="section-title text-lg mb-6">My Favorites ({favorites.length})</h2>
                {renderWatchlistGrid(favorites)}
              </div>
            )}

            {activeTab === 'Seen' && (
              <div>
                <h2 className="section-title text-lg mb-6">I&apos;ve Seen ({seenList.length})</h2>
                {renderWatchlistGrid(seenList)}
              </div>
            )}

            {activeTab === 'Stats' && (
              <div className="text-center py-16 glass rounded-2xl">
                <span className="text-5xl mb-4 block">📊</span>
                <p className="text-white font-bold text-xl mb-2">Detailed Stats Coming Soon</p>
                <p className="text-cinema-silver">Advanced analytics, yearly recaps, and taste profiles</p>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
