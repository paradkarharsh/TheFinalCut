'use client';

import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { WatchlistItem, ReviewItem, MediaType, UserProfile } from '@/types';

interface AppState {
  // User
  user: UserProfile | null;
  setUser: (user: UserProfile | null) => void;

  // Watchlist
  watchlist: WatchlistItem[];
  addToWatchlist: (item: WatchlistItem) => void;
  removeFromWatchlist: (mediaId: number, mediaType: MediaType) => void;
  isInWatchlist: (mediaId: number, mediaType: MediaType) => boolean;

  // Favorites
  favorites: WatchlistItem[];
  addToFavorites: (item: WatchlistItem) => void;
  removeFromFavorites: (mediaId: number, mediaType: MediaType) => void;
  isInFavorites: (mediaId: number, mediaType: MediaType) => boolean;

  // Seen
  seenList: WatchlistItem[];
  markAsSeen: (item: WatchlistItem) => void;
  markAsUnseen: (mediaId: number, mediaType: MediaType) => void;
  hasSeen: (mediaId: number, mediaType: MediaType) => boolean;

  // Reviews
  userReviews: ReviewItem[];
  addReview: (review: ReviewItem) => void;

  // UI State
  isSidebarOpen: boolean;
  toggleSidebar: () => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;

  // Continue Watching
  continueWatching: (WatchlistItem & { progress: number })[];
  updateProgress: (mediaId: number, mediaType: MediaType, progress: number) => void;

  // Splash screen
  splashDone: boolean;
  setSplashDone: (done: boolean) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: null,
      setUser: (user) => set({ user }),

      watchlist: [],
      addToWatchlist: (item) =>
        set((s) => ({
          watchlist: s.isInWatchlist(item.mediaId, item.mediaType)
            ? s.watchlist
            : [item, ...s.watchlist],
        })),
      removeFromWatchlist: (mediaId, mediaType) =>
        set((s) => ({
          watchlist: s.watchlist.filter(
            (i) => !(i.mediaId === mediaId && i.mediaType === mediaType)
          ),
        })),
      isInWatchlist: (mediaId, mediaType) =>
        get().watchlist.some((i) => i.mediaId === mediaId && i.mediaType === mediaType),

      favorites: [],
      addToFavorites: (item) =>
        set((s) => ({
          favorites: s.isInFavorites(item.mediaId, item.mediaType)
            ? s.favorites
            : [item, ...s.favorites],
        })),
      removeFromFavorites: (mediaId, mediaType) =>
        set((s) => ({
          favorites: s.favorites.filter(
            (i) => !(i.mediaId === mediaId && i.mediaType === mediaType)
          ),
        })),
      isInFavorites: (mediaId, mediaType) =>
        get().favorites.some((i) => i.mediaId === mediaId && i.mediaType === mediaType),

      seenList: [],
      markAsSeen: (item) =>
        set((s) => ({
          seenList: s.hasSeen(item.mediaId, item.mediaType)
            ? s.seenList
            : [item, ...s.seenList],
        })),
      markAsUnseen: (mediaId, mediaType) =>
        set((s) => ({
          seenList: s.seenList.filter(
            (i) => !(i.mediaId === mediaId && i.mediaType === mediaType)
          ),
        })),
      hasSeen: (mediaId, mediaType) =>
        get().seenList.some((i) => i.mediaId === mediaId && i.mediaType === mediaType),

      userReviews: [],
      addReview: (review) =>
        set((s) => ({ userReviews: [review, ...s.userReviews] })),

      isSidebarOpen: false,
      toggleSidebar: () => set((s) => ({ isSidebarOpen: !s.isSidebarOpen })),

      searchQuery: '',
      setSearchQuery: (q) => set({ searchQuery: q }),

      continueWatching: [],
      updateProgress: (mediaId, mediaType, progress) =>
        set((s) => {
          const existing = s.continueWatching.find(
            (i) => i.mediaId === mediaId && i.mediaType === mediaType
          );
          if (existing) {
            return {
              continueWatching: s.continueWatching.map((i) =>
                i.mediaId === mediaId && i.mediaType === mediaType
                  ? { ...i, progress }
                  : i
              ),
            };
          }
          return s;
        }),

      splashDone: false,
      setSplashDone: (done) => set({ splashDone: done }),
    }),
    {
      name: 'thefinalcut-store',
      partialize: (state) => ({
        watchlist: state.watchlist,
        favorites: state.favorites,
        seenList: state.seenList,
        continueWatching: state.continueWatching,
        userReviews: state.userReviews,
      }),
    }
  )
);
