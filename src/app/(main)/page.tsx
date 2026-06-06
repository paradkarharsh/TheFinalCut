import type { Metadata } from 'next';
import { tmdb } from '@/lib/tmdb';
import HeroBanner from '@/components/home/HeroBanner';
import MediaRow from '@/components/home/MediaRow';
import MoodPicker from '@/components/home/MoodPicker';
import GenreSection from '@/components/home/GenreSection';
import SpecialSections from '@/components/home/SpecialSections';
import ContinueWatching from '@/components/home/ContinueWatching';

export const metadata: Metadata = {
  title: 'TheFinalCut — Cinema Redefined',
  description: 'Discover movies and TV series with AI-powered recommendations, deep analytics, and cinematic ratings.',
};

export const revalidate = 3600; // 1 hour

async function getHomeData() {
  async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try { return await fn(); } catch { return fallback; }
  }

  const empty = { page: 1, results: [], total_pages: 0, total_results: 0 };

  const [
    trendingMovies,
    trendingTV,
    topRatedMovies,
    topRatedTV,
    upcomingMovies,
    nowPlayingMovies,
    popularTV,
  ] = await Promise.all([
    safe(() => tmdb.getTrendingMovies('week'), empty),
    safe(() => tmdb.getTrendingTV('week'), empty),
    safe(() => tmdb.getTopRatedMovies(), empty),
    safe(() => tmdb.getTopRatedTV(), empty),
    safe(() => tmdb.getUpcomingMovies(), empty),
    safe(() => tmdb.getNowPlayingMovies(), empty),
    safe(() => tmdb.getPopularTV(), empty),
  ]);

  return {
    trendingMovies: trendingMovies.results,
    trendingTV: trendingTV.results,
    topRatedMovies: topRatedMovies.results,
    topRatedTV: topRatedTV.results,
    upcomingMovies: upcomingMovies.results,
    nowPlaying: nowPlayingMovies.results,
    popularTV: popularTV.results,
    heroItems: [
      ...trendingMovies.results.slice(0, 3),
      ...trendingTV.results.slice(0, 2),
    ],
  };
}


export default async function HomePage() {
  const data = await getHomeData();

  return (
    <div className="bg-cinema-black min-h-screen">
      {/* Hero Banner */}
      <HeroBanner items={data.heroItems} />

      {/* Main content */}
      <div className="space-y-16 py-12">
        {/* Continue Watching (client, reads from store) */}
        <ContinueWatching />

        {/* Trending Movies */}
        <MediaRow
          title="🔥 Trending Movies"
          items={data.trendingMovies}
          mediaType="movie"
          viewAllHref="/movies?sort=trending"
        />

        {/* Trending Series */}
        <MediaRow
          title="📺 Trending Series"
          items={data.trendingTV}
          mediaType="tv"
          viewAllHref="/series?sort=trending"
        />

        {/* Mood Picker */}
        <MoodPicker />

        {/* Now Playing */}
        <MediaRow
          title="🎬 Now In Theaters"
          items={data.nowPlaying}
          mediaType="movie"
          viewAllHref="/movies?sort=now_playing"
          variant="backdrop"
        />

        {/* Top Rated Movies */}
        <MediaRow
          title="⭐ Top Rated Movies"
          items={data.topRatedMovies}
          mediaType="movie"
          viewAllHref="/movies?sort=top_rated"
        />

        {/* Top Rated Series */}
        <MediaRow
          title="🏆 Top Rated Series"
          items={data.topRatedTV}
          mediaType="tv"
          viewAllHref="/series?sort=top_rated"
        />

        {/* Upcoming */}
        <MediaRow
          title="🗓️ Upcoming Releases"
          items={data.upcomingMovies}
          mediaType="movie"
          viewAllHref="/movies?sort=upcoming"
          variant="backdrop"
        />

        {/* Genre Section */}
        <GenreSection />

        {/* Special Sections */}
        <SpecialSections />

        {/* Popular Series */}
        <MediaRow
          title="🌟 Popular Series"
          items={data.popularTV}
          mediaType="tv"
          viewAllHref="/series?sort=popular"
        />
      </div>
    </div>
  );
}
