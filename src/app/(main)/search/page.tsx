import { Metadata } from 'next';
import { Suspense } from 'react';
import SearchPageClient from '@/components/search/SearchPageClient';

export const metadata: Metadata = {
  title: 'Search',
  description: 'Search for movies, TV series, and people on TheFinalCut.',
};

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cinema-black pt-28 flex items-center justify-center"><div className="w-8 h-8 border-2 border-cinema-red border-t-transparent rounded-full animate-spin" /></div>}>
      <SearchPageClient />
    </Suspense>
  );
}
