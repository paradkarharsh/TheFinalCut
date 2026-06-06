'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Star, Clock, Calendar, Globe, DollarSign, Users, Heart,
  BookMarked, Eye, Share2, Play, ExternalLink, ChevronDown,
  Film, Award, Tag, Tv
} from 'lucide-react';
import { Movie } from '@/types';
import { tmdbImage } from '@/lib/tmdb';
import {
  formatDate, formatYear, formatRuntime, formatCurrency, formatNumber,
  getYouTubeTrailer, getRatingColor, getCertification, getLanguageName
} from '@/lib/utils';
import { generateCinematicRating, generateGoodnessMeter, generateInterestMeter, generateAISummary } from '@/lib/ai';
import { useAppStore } from '@/store/useAppStore';
import CinematicRatingChart from '@/components/ratings/CinematicRatingChart';
import GoodnessMeterComponent from '@/components/ratings/GoodnessMeter';
import InterestMeterComponent from '@/components/ratings/InterestMeter';
import MediaRow from '@/components/home/MediaRow';
import toast from 'react-hot-toast';

interface Props {
  movie: Movie;
}

const TABS = ['Overview', 'Ratings', 'Goodness', 'Interest', 'Cast', 'Media', 'Community'];

export default function MovieDetailClient({ movie }: Props) {
  const [activeTab, setActiveTab] = useState('Overview');
  const [showFullOverview, setShowFullOverview] = useState(false);
  const [showTrailer, setShowTrailer] = useState(false);

  const { addToWatchlist, removeFromWatchlist, isInWatchlist, addToFavorites, isInFavorites, markAsSeen, hasSeen } = useAppStore();

  const genres = movie.genres?.map(g => g.id) || movie.genre_ids || [];
  const cinematicRating = generateCinematicRating(movie, genres);
  const goodnessMeter = generateGoodnessMeter(movie, genres);
  const interestMeter = generateInterestMeter(genres);
  const aiSummary = generateAISummary(movie);
  const trailerKey = getYouTubeTrailer(movie.videos);
  const certification = getCertification(movie.release_dates);
  const director = movie.credits?.crew?.find(c => c.job === 'Director');

  const inWatchlist = isInWatchlist(movie.id, 'movie');
  const isFavorite = isInFavorites(movie.id, 'movie');
  const seen = hasSeen(movie.id, 'movie');

  const watchlistItem = {
    mediaId: movie.id,
    mediaType: 'movie' as const,
    title: movie.title,
    posterPath: movie.poster_path,
    addedAt: new Date(),
  };

  const watchProviders = movie.watch_providers?.results?.US || movie.watch_providers?.results?.IN || null;
  const similarMovies = movie.similar?.results?.slice(0, 12) || [];

  return (
    <div className="min-h-screen bg-cinema-black">
      {/* Hero Backdrop */}
      <div className="relative h-[70vh] min-h-[500px] overflow-hidden">
        <Image
          src={tmdbImage.backdrop(movie.backdrop_path, 'original')}
          alt={movie.title}
          fill
          priority
          className="object-cover object-top"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-cinema-black via-cinema-black/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-t from-cinema-black via-cinema-black/30 to-transparent" />

        {/* Play trailer button overlay */}
        {trailerKey && (
          <button
            onClick={() => setShowTrailer(true)}
            className="absolute inset-0 flex items-center justify-center group"
          >
            <motion.div
              whileHover={{ scale: 1.1 }}
              className="w-20 h-20 rounded-full bg-cinema-red/80 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm"
            >
              <Play className="w-8 h-8 text-white fill-white ml-1" />
            </motion.div>
          </button>
        )}
      </div>

      {/* Main Info */}
      <div className="max-w-screen-2xl mx-auto px-4 sm:px-8 lg:px-16 -mt-64 relative z-10">
        <div className="flex flex-col lg:flex-row gap-10">
          {/* Poster */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex-shrink-0"
          >
            <div className="relative w-52 md:w-64 rounded-2xl overflow-hidden shadow-cinema mx-auto lg:mx-0">
              <Image
                src={tmdbImage.poster(movie.poster_path, 'w500')}
                alt={movie.title}
                width={256}
                height={384}
                className="w-full h-auto"
                priority
              />
              {/* Rating overlay */}
              <div 
                className="absolute top-3 right-3 rating-badge text-base px-3 py-1.5 font-mono"
                style={{
                  borderColor: `${getRatingColor(movie.vote_average)}80`,
                  color: getRatingColor(movie.vote_average)
                }}
              >
                ⭐ {movie.vote_average.toFixed(1)}
              </div>
              {certification && certification !== 'NR' && (
                <div className="absolute top-3 left-3 text-xs font-bold px-2 py-1 rounded bg-black/80 border border-white/20 text-white">
                  {certification}
                </div>
              )}
            </div>

            {/* Actions */}
            <div className="flex flex-col gap-2 mt-4 w-52 md:w-64 mx-auto lg:mx-0">
              {trailerKey && (
                <button
                  onClick={() => setShowTrailer(true)}
                  className="btn-cinema flex items-center justify-center gap-2 w-full"
                >
                  <Play className="w-4 h-4 fill-white" /> Watch Trailer
                </button>
              )}
              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => { inWatchlist ? removeFromWatchlist(movie.id, 'movie') : addToWatchlist(watchlistItem); toast.success(inWatchlist ? 'Removed' : 'Added to watchlist!'); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-xs font-semibold ${inWatchlist ? 'bg-cinema-red text-white' : 'glass text-cinema-silver hover:text-white'}`}
                >
                  <BookMarked className="w-4 h-4" />
                  {inWatchlist ? 'Listed' : 'Watchlist'}
                </button>
                <button
                  onClick={() => { addToFavorites(watchlistItem); toast.success('Added to favorites!'); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-xs font-semibold ${isFavorite ? 'bg-pink-600 text-white' : 'glass text-cinema-silver hover:text-white'}`}
                >
                  <Heart className="w-4 h-4" />
                  {isFavorite ? 'Favorited' : 'Favorite'}
                </button>
                <button
                  onClick={() => { markAsSeen(watchlistItem); toast.success('Marked as seen!'); }}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all text-xs font-semibold ${seen ? 'bg-green-600 text-white' : 'glass text-cinema-silver hover:text-white'}`}
                >
                  <Eye className="w-4 h-4" />
                  {seen ? 'Seen' : 'Mark Seen'}
                </button>
              </div>
            </div>
          </motion.div>

          {/* Details */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="flex-1 pt-8 lg:pt-32"
          >
            {/* Title */}
            <h1
              className="text-4xl md:text-5xl lg:text-6xl font-black mb-3 leading-tight"
              style={{ fontFamily: 'Outfit, sans-serif' }}
            >
              {movie.title}
            </h1>
            {movie.tagline && (
              <p className="text-cinema-silver italic text-lg mb-4">"{movie.tagline}"</p>
            )}

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 mb-6 text-sm">
              <div className="flex items-center gap-1.5 text-yellow-400 font-bold text-base">
                <Star className="w-5 h-5 fill-yellow-400" />
                {movie.vote_average.toFixed(1)}/10
                <span className="text-cinema-silver text-xs font-normal">({formatNumber(movie.vote_count)} votes)</span>
              </div>
              {movie.release_date && (
                <span className="flex items-center gap-1 text-cinema-silver"><Calendar className="w-4 h-4" />{formatDate(movie.release_date)}</span>
              )}
              {movie.runtime && (
                <span className="flex items-center gap-1 text-cinema-silver"><Clock className="w-4 h-4" />{formatRuntime(movie.runtime)}</span>
              )}
              {movie.original_language && (
                <span className="flex items-center gap-1 text-cinema-silver"><Globe className="w-4 h-4" />{getLanguageName(movie.original_language)}</span>
              )}
              {certification && certification !== 'NR' && (
                <span className="px-2 py-0.5 border border-white/20 rounded text-white text-xs font-bold">{certification}</span>
              )}
            </div>

            {/* Genres */}
            <div className="flex flex-wrap gap-2 mb-6">
              {movie.genres?.map(g => (
                <Link key={g.id} href={`/discover?genre=${g.id}`} className="genre-tag hover:bg-cinema-red/30 transition-colors">
                  {g.name}
                </Link>
              ))}
            </div>

            {/* AI Summary */}
            <div className="glass-red rounded-xl p-4 mb-6">
              <div className="flex items-center gap-2 mb-3">
                <span className="text-cinema-red">🤖</span>
                <span className="text-cinema-red font-bold text-sm">AI Overview</span>
                <span className="text-xs text-cinema-silver/50 ml-auto">Powered by TFC AI</span>
              </div>
              <p className="text-cinema-silver-light text-sm leading-relaxed">
                {showFullOverview ? aiSummary : aiSummary.slice(0, 300) + (aiSummary.length > 300 ? '...' : '')}
              </p>
              {aiSummary.length > 300 && (
                <button
                  onClick={() => setShowFullOverview(!showFullOverview)}
                  className="text-cinema-red text-sm mt-2 flex items-center gap-1"
                >
                  {showFullOverview ? 'Show less' : 'Read more'}
                  <ChevronDown className={`w-3 h-3 transition-transform ${showFullOverview ? 'rotate-180' : ''}`} />
                </button>
              )}
            </div>

            {/* Key Info Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
              {director && (
                <div className="glass rounded-xl p-3 text-center">
                  <Users className="w-5 h-5 text-cinema-red mx-auto mb-1" />
                  <p className="text-cinema-silver text-xs">Director</p>
                  <p className="text-white text-sm font-bold truncate">{director.name}</p>
                </div>
              )}
              {movie.budget ? (
                <div className="glass rounded-xl p-3 text-center">
                  <DollarSign className="w-5 h-5 text-cinema-red mx-auto mb-1" />
                  <p className="text-cinema-silver text-xs">Budget</p>
                  <p className="text-white text-sm font-bold">{formatCurrency(movie.budget)}</p>
                </div>
              ) : null}
              {movie.revenue ? (
                <div className="glass rounded-xl p-3 text-center">
                  <DollarSign className="w-5 h-5 text-green-500 mx-auto mb-1" />
                  <p className="text-cinema-silver text-xs">Revenue</p>
                  <p className="text-white text-sm font-bold">{formatCurrency(movie.revenue)}</p>
                </div>
              ) : null}
              {movie.status && (
                <div className="glass rounded-xl p-3 text-center">
                  <Film className="w-5 h-5 text-cinema-red mx-auto mb-1" />
                  <p className="text-cinema-silver text-xs">Status</p>
                  <p className="text-white text-sm font-bold">{movie.status}</p>
                </div>
              )}
            </div>

            {/* Watch Providers */}
            {watchProviders && (
              <div className="mb-6">
                <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                  <Tv className="w-4 h-4 text-cinema-red" /> Where to Watch
                </h3>
                <div className="flex flex-wrap gap-2">
                  {watchProviders.flatrate?.slice(0, 6).map(p => (
                    <div key={p.provider_id} className="flex items-center gap-2 glass rounded-lg px-3 py-2 text-xs text-cinema-silver">
                      {p.logo_path && (
                        <Image src={tmdbImage.logo(p.logo_path, 'w45') || ''} alt={p.provider_name} width={20} height={20} className="rounded-sm" />
                      )}
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
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-shrink-0 px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                  activeTab === tab
                    ? 'bg-cinema-red text-white'
                    : 'text-cinema-silver hover:text-white hover:bg-white/5'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Tab content */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {activeTab === 'Overview' && (
                <div className="grid lg:grid-cols-2 gap-10">
                  <div>
                    <h2 className="section-title text-lg mb-4">Synopsis</h2>
                    <p className="text-cinema-silver-light leading-relaxed">{movie.overview}</p>
                    {movie.keywords?.keywords && movie.keywords.keywords.length > 0 && (
                      <div className="mt-6">
                        <h3 className="text-white font-bold text-sm mb-3 flex items-center gap-2">
                          <Tag className="w-4 h-4 text-cinema-red" /> Keywords
                        </h3>
                        <div className="flex flex-wrap gap-2">
                          {movie.keywords.keywords.slice(0, 15).map(k => (
                            <Link key={k.id} href={`/search?q=${encodeURIComponent(k.name)}`} className="text-xs px-3 py-1.5 glass rounded-full text-cinema-silver hover:text-cinema-red transition-colors">
                              {k.name}
                            </Link>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                  <div>
                    {/* Production info */}
                    <h2 className="section-title text-lg mb-4">Production</h2>
                    <div className="space-y-2 text-sm">
                      {movie.production_companies?.slice(0, 4).map(c => (
                        <div key={c.id} className="flex items-center gap-3 glass rounded-lg px-3 py-2">
                          {c.logo_path ? (
                            <Image src={tmdbImage.logo(c.logo_path, 'w92') || ''} alt={c.name} width={40} height={24} className="object-contain h-6 w-auto brightness-200" />
                          ) : (
                            <Film className="w-5 h-5 text-cinema-red" />
                          )}
                          <span className="text-cinema-silver">{c.name}</span>
                          {c.origin_country && <span className="text-cinema-silver/50 ml-auto text-xs">{c.origin_country}</span>}
                        </div>
                      ))}
                    </div>

                    {movie.belongs_to_collection && (
                      <div className="mt-6">
                        <h2 className="section-title text-lg mb-3">Part of Collection</h2>
                        <Link href={`/search?q=${encodeURIComponent(movie.belongs_to_collection.name)}`} className="glass rounded-xl p-4 flex items-center gap-4 hover:border-cinema-red/30 transition-all">
                          {movie.belongs_to_collection.poster_path && (
                            <Image src={tmdbImage.poster(movie.belongs_to_collection.poster_path, 'w185')} alt={movie.belongs_to_collection.name} width={60} height={90} className="rounded-lg" />
                          )}
                          <div>
                            <p className="text-white font-bold">{movie.belongs_to_collection.name}</p>
                            <p className="text-cinema-red text-sm">View Collection →</p>
                          </div>
                        </Link>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {activeTab === 'Ratings' && (
                <div className="max-w-2xl mx-auto">
                  <CinematicRatingChart rating={cinematicRating} title={movie.title} />
                </div>
              )}

              {activeTab === 'Goodness' && (
                <div className="max-w-xl mx-auto">
                  <GoodnessMeterComponent data={goodnessMeter} />
                </div>
              )}

              {activeTab === 'Interest' && (
                <div className="max-w-xl mx-auto">
                  <h2 className="section-title text-lg mb-6">Genre Interest Breakdown</h2>
                  <InterestMeterComponent data={interestMeter} />
                </div>
              )}

              {activeTab === 'Cast' && (
                <div>
                  <h2 className="section-title text-lg mb-6">Cast & Crew</h2>
                  <div className="grid grid-cols-3 sm:grid-cols-5 lg:grid-cols-8 gap-4">
                    {movie.credits?.cast?.slice(0, 16).map(person => (
                      <Link key={person.id} href={`/search?q=${encodeURIComponent(person.name)}`} className="text-center group">
                        <div className="relative w-full aspect-square rounded-full overflow-hidden mb-2 mx-auto max-w-[80px]">
                          <Image
                            src={tmdbImage.profile(person.profile_path)}
                            alt={person.name}
                            fill
                            className="object-cover group-hover:scale-110 transition-transform duration-300"
                            sizes="80px"
                          />
                        </div>
                        <p className="text-white text-xs font-semibold leading-tight">{person.name}</p>
                        <p className="text-cinema-silver text-xs mt-0.5 truncate">{person.character}</p>
                      </Link>
                    ))}
                  </div>

                  {/* Key Crew */}
                  <div className="mt-8">
                    <h3 className="text-white font-bold mb-4">Key Crew</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                      {movie.credits?.crew
                        ?.filter(c => ['Director', 'Producer', 'Screenplay', 'Original Music Composer', 'Director of Photography'].includes(c.job))
                        .slice(0, 6)
                        .map(person => (
                          <div key={`${person.id}-${person.job}`} className="glass rounded-xl p-3">
                            <p className="text-cinema-red text-xs mb-1">{person.job}</p>
                            <p className="text-white text-sm font-bold">{person.name}</p>
                          </div>
                        ))
                      }
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'Media' && (
                <div className="space-y-8">
                  {trailerKey && (
                    <div>
                      <h2 className="section-title text-lg mb-4">Official Trailer</h2>
                      <div className="relative aspect-video rounded-2xl overflow-hidden max-w-3xl">
                        <iframe
                          src={`https://www.youtube.com/embed/${trailerKey}?rel=0&modestbranding=1`}
                          title="Movie Trailer"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          className="w-full h-full"
                        />
                      </div>
                    </div>
                  )}

                  {/* All Videos */}
                  {movie.videos?.results && movie.videos.results.length > 1 && (
                    <div>
                      <h3 className="text-white font-bold mb-4">More Videos</h3>
                      <div className="flex gap-4 overflow-x-auto pb-2">
                        {movie.videos.results.filter(v => v.site === 'YouTube').slice(0, 6).map(v => (
                          <a
                            key={v.id}
                            href={`https://www.youtube.com/watch?v=${v.key}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex-shrink-0 glass rounded-xl p-3 w-48 hover:border-cinema-red/30 transition-all group"
                          >
                            <div className="relative aspect-video rounded-lg overflow-hidden mb-2">
                              <Image
                                src={`https://img.youtube.com/vi/${v.key}/mqdefault.jpg`}
                                alt={v.name}
                                fill
                                className="object-cover"
                                sizes="192px"
                              />
                              <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                                <Play className="w-8 h-8 text-white fill-white" />
                              </div>
                            </div>
                            <p className="text-white text-xs font-semibold truncate">{v.name}</p>
                            <p className="text-cinema-silver text-xs">{v.type}</p>
                          </a>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Backdrops */}
                  {movie.images?.backdrops && movie.images.backdrops.length > 0 && (
                    <div>
                      <h3 className="text-white font-bold mb-4">Images</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                        {movie.images.backdrops.slice(0, 6).map((img, i) => (
                          <div key={i} className="relative aspect-video rounded-xl overflow-hidden">
                            <Image
                              src={tmdbImage.backdrop(img.file_path, 'w780')}
                              alt={`${movie.title} backdrop ${i + 1}`}
                              fill
                              className="object-cover hover:scale-105 transition-transform duration-500"
                              sizes="(max-width: 640px) 50vw, 33vw"
                            />
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {activeTab === 'Community' && (
                <div>
                  <h2 className="section-title text-lg mb-6">Community Reviews</h2>
                  <div className="flex items-center justify-center py-16 glass rounded-2xl">
                    <div className="text-center">
                      <span className="text-5xl mb-4 block">💬</span>
                      <p className="text-white font-bold text-lg mb-2">Community Reviews Coming Soon</p>
                      <p className="text-cinema-silver text-sm">Sign in to be the first to share your thoughts</p>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Similar Movies */}
        {similarMovies.length > 0 && (
          <div className="mt-16 mb-16">
            <MediaRow
              title="🎬 Similar Movies"
              items={similarMovies}
              mediaType="movie"
            />
          </div>
        )}
      </div>

      {/* Trailer Modal */}
      <AnimatePresence>
        {showTrailer && trailerKey && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center p-4"
            onClick={() => setShowTrailer(false)}
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.8 }}
              className="w-full max-w-4xl aspect-video rounded-2xl overflow-hidden"
              onClick={e => e.stopPropagation()}
            >
              <iframe
                src={`https://www.youtube.com/embed/${trailerKey}?autoplay=1&rel=0`}
                title="Trailer"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="w-full h-full"
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
