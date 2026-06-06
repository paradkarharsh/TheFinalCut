import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { tmdb } from '@/lib/tmdb';
import TVDetailClient from '@/components/media/TVDetailClient';

interface Props {
  params: { id: string };
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  try {
    const series = await tmdb.getTVDetails(Number(params.id));
    return {
      title: `${series.name} — TV Series`,
      description: series.overview?.slice(0, 160),
      openGraph: {
        images: series.backdrop_path
          ? [`https://image.tmdb.org/t/p/w780${series.backdrop_path}`]
          : [],
      },
    };
  } catch {
    return { title: 'Series | TheFinalCut' };
  }
}

export default async function TVPage({ params }: Props) {
  const id = Number(params.id);
  if (isNaN(id)) notFound();

  try {
    const series = await tmdb.getTVDetails(id);
    return <TVDetailClient series={series} />;
  } catch {
    notFound();
  }
}
