import { Metadata } from 'next';
import { Suspense } from 'react';
import DiscoverClient from '@/components/discover/DiscoverClient';

export const metadata: Metadata = {
  title: 'Discover',
  description: 'Discover movies and TV series by genre, mood, and more on TheFinalCut.',
};

export default function DiscoverPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cinema-black pt-28 flex items-center justify-center"><div className="w-8 h-8 border-2 border-cinema-red border-t-transparent rounded-full animate-spin" /></div>}>
      <DiscoverClient />
    </Suspense>
  );
}
