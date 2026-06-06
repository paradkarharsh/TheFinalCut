import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tmdb } from '@/lib/tmdb';
import MovieDetailClient from '@/components/media/MovieDetailClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const movie = await tmdb.getMovieDetails(Number(params.id));
    return {
      title: `${movie.title} (${new Date(movie.release_date).getFullYear()})`,
      description: movie.overview?.slice(0, 160),
      openGraph: {
        images: movie.backdrop_path
          ? [`https://image.tmdb.org/t/p/w780${movie.backdrop_path}`]
          : [],
      },
    };
  } catch {
    return { title: 'Movie | TheFinalCut' };
  }
}

export default async function MoviePage({ params }: Props) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  try {
    const movie = await tmdb.getMovieDetails(id);
    return <MovieDetailClient movie={movie} />;
  } catch {
    notFound();
  }
}
