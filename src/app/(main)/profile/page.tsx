import { Metadata } from 'next';
import { Suspense } from 'react';
import ProfileClient from '@/components/profile/ProfileClient';

export const metadata: Metadata = {
  title: 'My Profile',
  description: 'Your TheFinalCut profile — watchlist, favorites, stats.',
};

export default function ProfilePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-cinema-black pt-28 flex items-center justify-center"><div className="w-8 h-8 border-2 border-cinema-red border-t-transparent rounded-full animate-spin" /></div>}>
      <ProfileClient />
    </Suspense>
  );
}
