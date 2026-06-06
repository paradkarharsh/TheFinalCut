import { Metadata } from 'next';
import { tmdb } from '@/lib/tmdb';
import AbsoluteCinemaClient from '@/components/discover/AbsoluteCinemaClient';

export const metadata: Metadata = {
  title: 'Absolute Cinema',
  description: 'The greatest films and series ever made, curated by genre.',
};

export const revalidate = 3600;

async function getData() {
  async function safe<T>(fn: () => Promise<T>, fallback: T): Promise<T> {
    try { return await fn(); } catch { return fallback; }
  }
  const empty = { page: 1, results: [], total_pages: 0, total_results: 0 };
  const [movies, series] = await Promise.all([
    safe(() => tmdb.getTopRatedMovies(), empty),
    safe(() => tmdb.getTopRatedTV(), empty),
  ]);
  return { topMovies: movies.results, topSeries: series.results };
}

export default async function AbsoluteCinemaPage() {
  const data = await getData();
  return <AbsoluteCinemaClient initialMovies={data.topMovies} initialSeries={data.topSeries} />;
}
