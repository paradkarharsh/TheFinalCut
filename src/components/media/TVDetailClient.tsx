'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Calendar, Globe, Users, Heart, BookMarked, Eye, Play,
  Tv, Clock, ChevronDown, Tag, Film, Award
} from 'lucide-react';
import { TVSeries } from '@/types';
import { tmdbImage } from '@/lib/tmdb';
import {
  formatDate, formatYear, formatNumber, getYouTubeTrailer,
  getLanguageName, truncate, getRatingColor
} from '@/lib/utils';
import { generateCinematicRating, generateGoodnessMeter, generateInterestMeter, generateAISummary } from '@/lib/ai';
import { useAppStore } from '@/store/useAppStore';
import CinematicRatingChart from '@/components/ratings/CinematicRatingChart';
import GoodnessMeterComponent from '@/components/ratings/GoodnessMeter';
import InterestMeterComponent from '@/components/ratings/InterestMeter';
import MediaRow from '@/components/home/MediaRow';
import EpisodeAnalytics from '@/components/ratings/EpisodeAnalytics';
import toast from 'react-hot-toast';

interface Props {
  series: TVSeries;
}

const TABS = ['Overview', 'Ratings', 'Goodness', 'Interest', 'Episodes', 'Cast', 'Media', 'Community'];

export default function TVDetailClient({ series }: Props) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showTrailer, setShowTrailer] = useState(false);

  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToFavorites, isInFavorites, markAsSeen, hasSeen } = useAppStore();

  const genres = series.genres?.map(g => g.id) || series.genre_ids || [];
  const cinematicRating = generateCinematicRating(series, genres);
  const goodnessMeter = generateGoodnessMeter(series, genres);
  const interestMeter = generateInterestMeter(genres);
  const aiSummary = generateAISummary(series);
  const trailerKey = getYouTubeTrailer(series.videos);

  const inWatchlist = isInWatchlist(series.id, 'tv');
  const isFavorite = isInFavorites(series.id, 'tv');
  const seen = hasSeen(series.id, 'tv');

  const watchlistItem = {
    mediaId: series.id,
    mediaType: 'tv' as const,
    title: series.name,
    posterPath: series.poster_path,
    addedAt: new Date(),
  };

  const watchProviders = series.watch_providers?.results?.US || series.watch_providers?.results?.IN || null;
  const similar = series.similar?.results?.slice(0, 12) || [];

  return (
    <div className="min-h-screen bg-cinema-black">
      {/* Hero */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src={tmdbImage.backdrop(series.backdrop_path, 'original')}
          alt={series.name}
          fill priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-cinema-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/30 to-transparent" />

        {trailerKey && (
          <button onClick={() => setShowTrailer(true)} className="absolute inset-0 flex items-center justify-center group">
            <motion.div whileHover={{ scale: 1.1 }} className="w-20 h-20 rounded-full bg-cinema-red/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </motion.div>
          </button>
        )}
      </div>

      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16 -mt-64 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Poster */}
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} className="flex-shrink-0">
            <div className="relative w-52 md:w-64 rounded-2xl overflow-hidden shadow-cinema mx-auto lg:mx-0">
              <Image src={tmdbImage.poster(series.poster_path, 'w500')} alt={series.name} width={256} height={384} className="w-full h-auto" priority />
              <div 
                className="absolute top-3 right-3 rating-badge text-base px-3 py-1.5 font-mono"
                style={{
                  borderColor: `${getRatingColor(series.vote_average)}80`,
                  color: getRatingColor(series.vote_average)
                }}
              >
                ⭐ {series.vote_average.toFixed(1)}
              </div>
            </div>

            <div className="flex flex-col gap-2 mt-4 w-52 md:w-64 mx-auto lg:mx-0">
              {trailerKey && (
                <button onClick={() => setShowTrailer(true)} className="btn-cinema flex items-center justify-center gap-2 w-full">
                  <Play className="w-4 h-4 fill-white" /> Watch Trailer
                </button>
              )}
              <div className="grid grid-cols-3 gap-2">
                <button onClick={() => { inWatchlist ? removeFromWatchlist(series.id, 'tv') : addToWatchlist(watchlistItem); toast.success(inWatchlist ? 'Removed' : 'Added!'); }} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-xs font-semibold ${inWatchlist ? 'bg-cinema-red text-white' : 'glass text-cinema-silver hover:text-white'}`}>
                  <BookMarked className="w-4 h-4" />{inWatchlist ? 'Listed' : 'Watchlist'}
                </button>
                <button onClick={() => { addToFavorites(watchlistItem); toast.success('Favorited!'); }} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-xs font-semibold ${isFavorite ? 'bg-pink-600 text-white' : 'glass text-cinema-silver hover:text-white'}`}>
                  <Heart className="w-4 h-4" />{isFavorite ? '♥' : 'Favorite'}
                </button>
                <button onClick={() => { markAsSeen(watchlistItem); toast.success('Marked!'); }} className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-xs font-semibold ${seen ? 'bg-green-600 text-white' : 'glass text-cinema-silver hover:text-white'}`}>
                  <Eye className="w-4 h-4" />{seen ? 'Seen' : 'Seen?'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div initial={{ opacity: 0, x: 30 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.1 }} className="flex-1 pt-8 lg:pt-32">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 leading-tight" style={{ fontFamily: 'Outfit, sans-serif' }}>{series.name}</h1>
            {series.tagline && <p className="text-cinema-silver italic text-lg mb-4">"{series.tagline}"</p>}

            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-base">
                <Star className="w-5 h-5 fill-yellow-400" />
                {series.vote_average.toFixed(1)}/10
                <span className="text-cinema-silver text-xs font-normal">({formatNumber(series.vote_count)} votes)</span>
              </div>
              {series.first_air_date && <span className="flex items-center gap-1 text-cinema-silver"><Calendar className="w-4 h-4" />{formatDate(series.first_air_date)}</span>}
              {series.number_of_seasons && <span className="flex items-center gap-1 text-cinema-silver"><Tv className="w-4 h-4" />{series.number_of_seasons} Seasons</span>}
              {series.number_of_episodes && <span className="flex items-center gap-1 text-cinema-silver"><Film className="w-4 h-4" />{series.number_of_episodes} Episodes</span>}
              {series.original_language && <span className="flex items-center gap-1 text-cinema-silver"><Globe className="w-4 h-4" />{getLanguageName(series.original_language)}</span>}
              {series.status && <span className="text-xs px-2 py-0.5 rounded glass text-cinema-silver">{series.status}</span>}
            </div>

            <div className="flex flex-wrap gap-2 mb-6">
              {series.genres?.map(g => (
                <Link key={g.id} href={`/discover?genre=${g.id}`} className="genre-tag hover:bg-cinema-red/30 transition-colors">{g.name}</Link>
              ))}
            </div>

            {/* AI Summary */}
            <div className="glass-red rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-cinema-red">🤖</span>
                <span className="text-cinema-red font-bold text-sm">AI Overview</span>
                <span className="text-xs text-cinema-silver/50 ml-auto">TFC AI</span>
              </div>
              <p className="text-cinema-silver-light text-sm leading-relaxed">{aiSummary.slice(0, 300)}{aiSummary.length > 300 ? '...' : ''}</p>
            </div>

            {/* Networks */}
            {series.networks && series.networks.length > 0 && (
              <div className="mb-4">
                <h3 className="text-white font-bold text-sm mb-2">Networks</h3>
                <div className="flex flex-wrap gap-2">
                  {series.networks.map(n => (
                    <div key={n.id} className="flex items-center gap-2 glass rounded-lg px-3 py-2 text-xs text-cinema-silver">
                      {n.logo_path ? <Image src={tmdbImage.logo(n.logo_path, 'w92') || ''} alt={n.name} width={40} height={20} className="object-contain h-5 w-auto brightness-200" /> : <Tv className="w-4 h-4" />}
                      {n.name}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {watchProviders && (
              <div className="mb-6">
                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2"><Tv className="w-4 h-4 text-cinema-red" /> Where to Watch</h3>
                <div className="flex flex-wrap gap-2">
                  {watchProviders.flatrate?.slice(0, 6).map(p => (
                    <div key={p.provider_id} className="flex items-center gap-2 glass rounded-lg px-3 py-2 text-xs text-cinema-silver">
                      {p.logo_path && <Image src={tmdbImage.logo(p.logo_path, 'w45') || ''} alt={p.provider_name} width={20} height={20} className="rounded-sm" />}
                      {p.provider_name}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* Tabs */}
        <div className="mt-12">
          <div className="flex gap-2 overflow-x-auto pb-2 mb-8 border-b border-white/10">
            {TABS.map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${activeTab === tab ? 'bg-cinema-red text-white' : 'text-cinema-silver hover:text-white hover:bg-white/5'}`}>{tab}</button>
            ))}
          </div>

          <AnimatePresence mode="wait">
            <motion.div key={activeTab} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {activeTab === 'Overview' && (
                <div className="grid lg:grid-cols-2 gap-10">
                  <div>
                    <h2 className="section-title text-lg mb-4">Synopsis</h2>
                    <p className="text-cinema-silver-light leading-relaxed">{series.overview}</p>
                    {series.created_by && series.created_by.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-white font-bold text-sm mb-3">Created By</h3>
                        <div className="flex gap-4">
                          {series.created_by.map(c => (
                            <div key={c.id} className="flex items-center gap-3 glass rounded-xl p-3">
                              {c.profile_path && <Image src={tmdbImage.profile(c.profile_path)} alt={c.name} width={40} height={40} className="rounded-full object-cover" />}
                              <p className="text-white text-sm font-bold">{c.name}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {series.seasons && series.seasons.length > 0 && (
                      <div>
                        <h2 className="section-title text-lg mb-4">Seasons</h2>
                        <div className="space-y-3">
                          {series.seasons.filter(s => s.season_number > 0).slice(0, 6).map(season => (
                            <div key={season.id} className="glass rounded-xl p-3 flex gap-3">
                              <Image src={tmdbImage.poster(season.poster_path, 'w185')} alt={season.name} width={48} height={72} className="rounded-lg object-cover" />
                              <div>
                                <p className="text-white font-bold text-sm">{season.name}</p>
                                <p className="text-cinema-silver text-xs">{season.episode_count} episodes</p>
                                {season.air_date && <p className="text-cinema-silver text-xs">{formatYear(season.air_date)}</p>}
                                {season.vote_average > 0 && <div className="flex items-center gap-1 mt-1"><Star className="w-3 h-3 text-yellow-400 fill-yellow-400" /><span className="text-yellow-400 text-xs font-bold">{season.vote_average.toFixed(1)}</span></div>}
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Ratings' && <div className="max-w-2xl mx-auto"><CinematicRatingChart rating={cinematicRating} title={series.name} /></div>}
              {activeTab === 'Goodness' && <div className="max-w-xl mx-auto"><GoodnessMeterComponent data={goodnessMeter} /></div>}
              {activeTab === 'Interest' && <div className="max-w-xl mx-auto"><h2 className="section-title text-lg mb-6">Genre Interest</h2><InterestMeterComponent data={interestMeter} /></div>}
              {activeTab === 'Episodes' && <EpisodeAnalytics series={series} />}

              {activeTab === 'Cast' && (
                <div>
                  <h2 className="section-title text-lg mb-6">Cast & Crew</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-4">
                    {series.credits?.cast?.slice(0, 16).map(person => (
                      <Link key={person.id} href={`/search?q=${encodeURIComponent(person.name)}`} className="text-center group">
                        <div className="relative w-full aspect-square rounded-full overflow-hidden mb-2 mx-auto max-w-[80px]">
                          <Image src={tmdbImage.profile(person.profile_path)} alt={person.name} fill className="object-cover group-hover:scale-110 transition-transform duration-300" sizes="80px" />
                        </div>
                        <p className="text-white text-xs font-semibold leading-tight">{person.name}</p>
                        <p className="text-cinema-silver text-xs mt-0.5 truncate">{person.character}</p>
                      </Link>
                    ))}
                  </div>
                </div>
              )}

              {activeTab === 'Media' && (
                <div className="space-y-8">
                  {trailerKey && (
                    <div>
                      <h2 className="section-title text-lg mb-4">Official Trailer</h2>
                      <div className="relative aspect-video rounded-2xl overflow-hidden max-w-3xl">
                        <iframe src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1`} title="Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
                      </div>
                    </div>
                  )}
                  {series.images?.backdrops && series.images.backdrops.length > 0 && (
                    <div>
                      <h3 className="text-white font-bold mb-4">Images</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {series.images.backdrops.slice(0, 6).map((img, i) => (
                          <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                            <Image src={tmdbImage.backdrop(img.file_path, 'w780')} alt={`${series.name} backdrop ${i + 1}`} fill className="object-cover hover:scale-105 transition-transform duration-500" sizes="(max-width: 640px) 50vw, 33vw" />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Community' && (
                <div className="flex items-center justify-center py-16 glass rounded-2xl">
                  <div className="text-center">
                    <span className="text-5xl mb-4 block">💬</span>
                    <p className="text-white font-bold text-lg mb-2">Community Reviews Coming Soon</p>
                    <p className="text-cinema-silver text-sm">Sign in to be the first to share your thoughts</p>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {similar.length > 0 && (
          <div className="mt-16 mb-16">
            <MediaRow title="📺 Similar Series" items={similar} mediaType="tv" />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4" onClick={() => setShowTrailer(false)}>
            <motion.div initial={{ scale: 0.8 }} animate={{ scale: 1 }} exit={{ scale: 0.8 }} className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden" onClick={e => e.stopPropagation()}>
              <iframe src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`} title="Trailer" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen className="w-full h-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
