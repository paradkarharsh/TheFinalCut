'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { useQueries } from '@tanstack/react-query';
import Image from 'next/image';
import { Star, Clock, LayoutGrid, List } from 'lucide-react';
import { TVSeries } from '@/types';
import { tmdb, tmdbImage } from '@/lib/tmdb';
import { formatDate, getGridRatingColor, getScoreColor } from '@/lib/utils';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts';

interface Props {
  series: TVSeries;
}

export default function EpisodeAnalytics({ series }: Props) {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [inverted, setInverted] = useState(false);
  const [selectedSeason, setSelectedSeason] = useState(
    series.seasons?.find(s => s.season_number > 0)?.season_number || 1
  );

  const seasonsList = series.seasons?.filter(s => s.season_number > 0) || [];

  const seasonQueries = useQueries({
    queries: seasonsList.map(s => ({
      queryKey: ['season', series.id, s.season_number],
      queryFn: () => tmdb.getTVSeason(series.id, s.season_number),
      staleTime: 30 * 60 * 1000,
    }))
  });

  const isLoading = seasonQueries.some(q => q.isLoading);
  const seasonsData = seasonQueries.map(q => q.data).filter(Boolean);

  // Data for the grid view
  const maxEpisodes = Math.max(...seasonsData.map(s => s?.episodes?.length || 0), 0);
  const episodesArray = Array.from({ length: maxEpisodes }, (_, i) => i + 1);

  // Data for the list view (selected season)
  const selectedSeasonData = seasonsData.find(s => s?.season_number === selectedSeason);
  const listEpisodes = selectedSeasonData?.episodes || [];
  const chartData = listEpisodes.map(ep => ({
    name: `E${ep.episode_number}`,
    rating: ep.vote_average || 0,
    episode: ep,
  }));

  const bestEp = [...listEpisodes].sort((a, b) => b.vote_average - a.vote_average)[0];
  const worstEp = [...listEpisodes].filter(e => e.vote_average > 0).sort((a, b) => a.vote_average - b.vote_average)[0];

  return (
    <div className="space-y-6">
      {/* View Toggle & Legend */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2 bg-white/5 p-1 rounded-lg w-fit">
          <button
            onClick={() => setViewMode('grid')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'grid' ? 'bg-cinema-red text-white' : 'text-cinema-silver hover:text-white'}`}
          >
            <LayoutGrid className="w-4 h-4" /> Grid
          </button>
          <button
            onClick={() => setViewMode('list')}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-md text-sm font-medium transition-all ${viewMode === 'list' ? 'bg-cinema-red text-white' : 'text-cinema-silver hover:text-white'}`}
          >
            <List className="w-4 h-4" /> List
          </button>
        </div>

        {viewMode === 'grid' && (
          <div className="flex items-center gap-3 flex-wrap text-sm">
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#15803D]"></span>Awesome</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#22C55E]"></span>Great</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#EAB308]"></span>Good</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#F97316]"></span>Regular</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#EF4444]"></span>Bad</div>
            <div className="flex items-center gap-1.5"><span className="w-3 h-3 rounded-full bg-[#8B5CF6]"></span>Garbage</div>
            
            <div className="flex items-center gap-2 ml-2 border-l border-white/10 pl-4">
              <span className="text-cinema-silver">Inverted</span>
              <button 
                onClick={() => setInverted(!inverted)}
                className={`w-10 h-5 rounded-full transition-colors relative ${inverted ? 'bg-cinema-red' : 'bg-white/20'}`}
              >
                <div className={`w-4 h-4 rounded-full bg-white absolute top-0.5 transition-transform ${inverted ? 'translate-x-5.5 left-0.5' : 'left-0.5 translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-16">
          <div className="w-8 h-8 border-2 border-cinema-red border-t-transparent rounded-full animate-spin" />
        </div>
      ) : (
        <>
          {viewMode === 'grid' && (
            <div className="overflow-x-auto pb-4">
              <div className="min-w-max">
                {inverted ? (
                  /* INVERTED GRID: Columns = Episodes, Rows = Seasons */
                  <table className="border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 min-w-[60px] text-center text-cinema-silver font-medium text-sm"></th>
                        {episodesArray.map(epNum => (
                          <th key={epNum} className="p-2 min-w-[50px] text-center text-cinema-silver font-medium text-sm">E{epNum}</th>
                        ))}
                        <th className="p-2 min-w-[60px] text-center text-white font-bold text-sm">AVG.</th>
                      </tr>
                    </thead>
                    <tbody>
                      {seasonsData.map(season => {
                        if (!season) return null;
                        const ratedEps = season.episodes?.filter(e => e.vote_average > 0) || [];
                        const avg = ratedEps.length 
                          ? ratedEps.reduce((acc, ep) => acc + ep.vote_average, 0) / ratedEps.length 
                          : 0;
                        return (
                          <tr key={season.id}>
                            <td className="p-2 text-center text-cinema-silver font-medium text-sm">S{season.season_number}</td>
                            {episodesArray.map(epNum => {
                              const ep = season.episodes?.find(e => e.episode_number === epNum);
                              const rating = ep?.vote_average || 0;
                              return (
                                <td key={epNum} className="p-1">
                                  {ep ? (
                                    <div 
                                      className="w-12 h-10 rounded flex items-center justify-center font-bold text-[15px]"
                                      style={{ backgroundColor: getGridRatingColor(rating), color: '#1A1A1A' }}
                                    >
                                      {rating > 0 ? rating.toFixed(1) : '?'}
                                    </div>
                                  ) : (
                                    <div className="w-12 h-10 rounded flex items-center justify-center text-cinema-silver/30">-</div>
                                  )}
                                </td>
                              );
                            })}
                            <td className="p-2 text-center text-white font-bold text-lg">{avg > 0 ? avg.toFixed(1) : '-'}</td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                ) : (
                  /* NORMAL GRID: Columns = Seasons, Rows = Episodes */
                  <table className="border-collapse">
                    <thead>
                      <tr>
                        <th className="p-2 min-w-[50px] text-center text-cinema-silver font-medium text-sm"></th>
                        {seasonsData.map(season => (
                          <th key={season?.id} className="p-2 min-w-[60px] text-center text-cinema-silver font-medium text-sm">
                            S{season?.season_number}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {episodesArray.map(epNum => (
                        <tr key={epNum}>
                          <td className="p-2 text-center text-cinema-silver font-medium text-sm">E{epNum}</td>
                          {seasonsData.map(season => {
                            if (!season) return <td key="empty" className="p-1"></td>;
                            const ep = season.episodes?.find(e => e.episode_number === epNum);
                            const rating = ep?.vote_average || 0;
                            return (
                              <td key={season.id} className="p-1">
                                {ep ? (
                                  <div 
                                    className="w-12 h-10 rounded flex items-center justify-center font-bold text-[15px]"
                                    style={{ backgroundColor: getGridRatingColor(rating), color: '#1A1A1A' }}
                                  >
                                    {rating > 0 ? rating.toFixed(1) : '?'}
                                  </div>
                                ) : (
                                  <div className="w-12 h-10 rounded flex items-center justify-center text-cinema-silver/30">-</div>
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      ))}
                      {/* Average Row */}
                      <tr>
                        <td className="p-2 text-center text-cinema-silver font-medium text-xs pt-4">AVG.</td>
                        {seasonsData.map(season => {
                          if (!season) return <td key="empty" className="p-2 pt-4"></td>;
                          const ratedEps = season.episodes?.filter(e => e.vote_average > 0) || [];
                          const avg = ratedEps.length 
                            ? ratedEps.reduce((acc, ep) => acc + ep.vote_average, 0) / ratedEps.length 
                            : 0;
                          return (
                            <td key={season.id} className="p-2 text-center text-white font-bold text-lg pt-4">
                              {avg > 0 ? avg.toFixed(1) : '-'}
                            </td>
                          );
                        })}
                      </tr>
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          )}

          {viewMode === 'list' && (
            <div className="space-y-8 animate-in fade-in duration-300">
              {/* Season Picker */}
              <div className="flex gap-2 overflow-x-auto pb-2">
                {seasonsList.map(s => (
                  <button
                    key={s.season_number}
                    onClick={() => setSelectedSeason(s.season_number)}
                    className={`flex-shrink-0 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${selectedSeason === s.season_number ? 'bg-cinema-red text-white' : 'glass text-cinema-silver hover:text-white'}`}
                  >
                    S{s.season_number}
                    {s.vote_average > 0 && (
                      <span className="ml-2 text-xs text-yellow-400">★{s.vote_average.toFixed(1)}</span>
                    )}
                  </button>
                ))}
              </div>

              {/* Season rating chart */}
              {chartData.some(d => d.rating > 0) && (
                <div>
                  <h3 className="text-white font-bold mb-4">Episode Ratings — Season {selectedSeason}</h3>
                  <div className="h-48">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData} margin={{ top: 5, right: 10, bottom: 5, left: 0 }}>
                        <XAxis dataKey="name" tick={{ fill: '#A0A0A8', fontSize: 11 }} />
                        <YAxis domain={[0, 10]} tick={{ fill: '#A0A0A8', fontSize: 11 }} />
                        <Tooltip
                          contentStyle={{ background: '#1A1A1A', border: '1px solid rgba(229,9,20,0.3)', borderRadius: '8px', color: '#F0F0F0' }}
                          formatter={(val: any) => [Number(val).toFixed(1), 'Rating']}
                        />
                        <Bar dataKey="rating" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, i) => (
                            <Cell key={i} fill={getScoreColor(entry.rating * 10)} />
                          ))}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              )}

              {/* Best/Worst */}
              <div className="grid sm:grid-cols-2 gap-4">
                {bestEp && (
                  <div className="glass-red rounded-xl p-4">
                    <p className="text-cinema-red font-bold text-sm mb-2">🏆 Best Episode</p>
                    <p className="text-white font-bold">S{bestEp.season_number}E{bestEp.episode_number}: {bestEp.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-bold">{bestEp.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                )}
                {worstEp && (
                  <div className="glass rounded-xl p-4 border border-white/5">
                    <p className="text-cinema-silver font-bold text-sm mb-2">📉 Lowest Rated</p>
                    <p className="text-white font-bold">S{worstEp.season_number}E{worstEp.episode_number}: {worstEp.name}</p>
                    <div className="flex items-center gap-1.5 mt-1">
                      <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                      <span className="text-yellow-400 font-bold">{worstEp.vote_average.toFixed(1)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Episode list */}
              <div>
                <h3 className="text-white font-bold mb-4">Episodes ({listEpisodes.length})</h3>
                <div className="space-y-3">
                  {listEpisodes.map(ep => (
                    <motion.div
                      key={ep.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="glass rounded-xl p-3 flex gap-3 hover:border-cinema-red/20 transition-all"
                    >
                      {ep.still_path && (
                        <div className="relative w-24 h-14 flex-shrink-0 rounded-lg overflow-hidden">
                          <Image src={tmdbImage.backdrop(ep.still_path, 'w300')} alt={ep.name} fill className="object-cover" sizes="96px" />
                        </div>
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-2">
                          <p className="text-white font-bold text-sm truncate">
                            {ep.episode_number}. {ep.name}
                          </p>
                          {ep.vote_average > 0 && (
                            <span className="text-yellow-400 font-bold text-sm flex-shrink-0">★{ep.vote_average.toFixed(1)}</span>
                          )}
                        </div>
                        <p className="text-cinema-silver text-xs mt-0.5 line-clamp-2">{ep.overview}</p>
                        <div className="flex items-center gap-3 mt-1 text-xs text-cinema-silver/60">
                          {ep.air_date && <span>{formatDate(ep.air_date)}</span>}
                          {ep.runtime && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{ep.runtime}m</span>}
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
