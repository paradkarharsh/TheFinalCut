import { Movie, TVSeries, CinematicRating, GoodnessMeter, InterestMeter } from '@/types';
import type { Mood } from '@/types';

// Genre ID → name mapping (TMDB genre IDs)
export const MOVIE_GENRES: Record<number, string> = {
  28: 'Action', 12: 'Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 14: 'Fantasy', 36: 'History',
  27: 'Horror', 10402: 'Music', 9648: 'Mystery', 10749: 'Romance', 878: 'Science Fiction',
  10770: 'TV Movie', 53: 'Thriller', 10752: 'War', 37: 'Western',
};

export const TV_GENRES: Record<number, string> = {
  10759: 'Action & Adventure', 16: 'Animation', 35: 'Comedy', 80: 'Crime',
  99: 'Documentary', 18: 'Drama', 10751: 'Family', 10762: 'Kids', 9648: 'Mystery',
  10763: 'News', 10764: 'Reality', 10765: 'Sci-Fi & Fantasy', 10766: 'Soap',
  10767: 'Talk', 10768: 'War & Politics', 37: 'Western',
};

// Mood → genre/param mapping
export const MOOD_MAP: Record<Mood, { title: string; emoji: string; genres: number[]; sort: string }> = {
  happy: {
    title: 'Happy & Uplifting',
    emoji: '😄',
    genres: [35, 12, 16],
    sort: 'popularity.desc',
  },
  sad: {
    title: 'Emotional & Tear-jerking',
    emoji: '😢',
    genres: [18, 10749],
    sort: 'vote_average.desc',
  },
  thrilled: {
    title: 'Edge of Seat Thrillers',
    emoji: '😱',
    genres: [53, 28, 80],
    sort: 'popularity.desc',
  },
  scared: {
    title: 'Horror Night',
    emoji: '👻',
    genres: [27, 9648],
    sort: 'vote_average.desc',
  },
  romantic: {
    title: 'Romance & Love',
    emoji: '❤️',
    genres: [10749, 18],
    sort: 'vote_average.desc',
  },
  thoughtful: {
    title: 'Mind-bending & Deep',
    emoji: '🧠',
    genres: [878, 9648, 18],
    sort: 'vote_average.desc',
  },
  adventurous: {
    title: 'Epic Adventures',
    emoji: '🚀',
    genres: [12, 14, 28],
    sort: 'popularity.desc',
  },
  laugh: {
    title: 'Laugh Out Loud',
    emoji: '🤣',
    genres: [35],
    sort: 'popularity.desc',
  },
};

// Smart mock AI: Generate cinematic ratings based on TMDB data
export function generateCinematicRating(
  item: Movie | TVSeries,
  genres: number[]
): CinematicRating {
  const base = item.vote_average / 10;
  const popularity = Math.min(item.popularity / 1000, 1);

  const has = (ids: number[]) => genres.some(g => ids.includes(g));
  const rand = (min: number, max: number, seed: number) =>
    Math.round((Math.sin(seed * 9301 + 49297) * 0.5 + 0.5) * (max - min) + min);

  const id = item.id;

  return {
    overall: Math.round(base * 100),
    story: rand(55, 95, id * 1),
    acting: rand(60, 98, id * 2),
    cinematography: rand(50, 97, id * 3),
    soundtrack: rand(55, 95, id * 4),
    emotionalImpact: rand(40, 99, id * 5),
    rewatchValue: rand(30, 95, id * 6),
    endingQuality: rand(35, 98, id * 7),
    characterDepth: rand(45, 97, id * 8),
    suspenseMeter: has([53, 27, 9648, 80]) ? rand(65, 99, id * 9) : rand(20, 65, id * 9),
    comedyMeter: has([35]) ? rand(65, 95, id * 10) : rand(5, 40, id * 10),
    horrorMeter: has([27]) ? rand(65, 99, id * 11) : rand(5, 30, id * 11),
    romanceMeter: has([10749]) ? rand(65, 95, id * 12) : rand(10, 50, id * 12),
    actionMeter: has([28, 12]) ? rand(65, 99, id * 13) : rand(15, 60, id * 13),
    mindfuckMeter: has([878, 9648]) ? rand(55, 99, id * 14) : rand(10, 55, id * 14),
    darkToneMeter: has([27, 53, 80]) ? rand(60, 99, id * 15) : rand(10, 60, id * 15),
    violenceMeter: has([28, 27, 80, 10752]) ? rand(50, 95, id * 16) : rand(5, 50, id * 16),
  };
}

export function generateGoodnessMeter(
  item: Movie | TVSeries,
  genres: number[]
): GoodnessMeter {
  const rating = item.vote_average;
  const pop = Math.min(item.popularity, 5000);
  const id = item.id;

  const rand = (min: number, max: number, seed: number) =>
    Math.round((Math.sin(seed * 9301 + 49297) * 0.5 + 0.5) * (max - min) + min);

  const isSeries = !('title' in item);
  const hasMany = isSeries && (item as TVSeries).number_of_seasons && (item as TVSeries).number_of_seasons! > 2;

  return {
    entertainmentValue: Math.min(Math.round((rating / 10 * 70) + (pop / 5000 * 30)), 100),
    bingeworthiness: isSeries
      ? (hasMany ? rand(70, 99, id * 1) : rand(55, 90, id * 1))
      : rand(20, 60, id * 1),
    emotionalIntensity: rand(30, 95, id * 2),
    slowBurnFactor: rand(10, 90, id * 3),
    complexity: rand(20, 99, id * 4),
    plotTwistLevel: rand(15, 98, id * 5),
    casualFriendliness: rand(30, 90, id * 6),
    cinemaLoverScore: Math.min(Math.round((rating / 10 * 60) + rand(20, 40, id * 7)), 100),
    aiConfidence: rand(82, 97, id * 8),
  };
}

export function generateInterestMeter(genres: number[]): InterestMeter {
  const has = (ids: number[]) => genres.some(g => ids.includes(g));

  return {
    horror: has([27]) ? 75 + Math.floor(Math.random() * 25) : Math.floor(Math.random() * 30),
    thriller: has([53]) ? 70 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 40),
    romance: has([10749]) ? 70 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 35),
    mystery: has([9648]) ? 70 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 40),
    action: has([28]) ? 70 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 45),
    scifi: has([878]) ? 70 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 30),
    comedy: has([35]) ? 70 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 40),
    drama: has([18]) ? 65 + Math.floor(Math.random() * 35) : Math.floor(Math.random() * 50),
    fantasy: has([14]) ? 70 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 30),
    crime: has([80]) ? 70 + Math.floor(Math.random() * 30) : Math.floor(Math.random() * 35),
    animation: has([16]) ? 75 + Math.floor(Math.random() * 25) : Math.floor(Math.random() * 25),
    documentary: has([99]) ? 75 + Math.floor(Math.random() * 25) : Math.floor(Math.random() * 20),
  };
}

export function generateAISummary(item: Movie | TVSeries): string {
  const title = 'title' in item ? item.title : item.name;
  const rating = item.vote_average.toFixed(1);
  const year = 'release_date' in item
    ? new Date(item.release_date).getFullYear()
    : new Date((item as TVSeries).first_air_date).getFullYear();

  const templates = [
    `${title} (${year}) is a compelling cinematic experience that earns its ${rating}/10 rating through masterful storytelling and powerful performances. `,
    `A must-watch gem of ${year}, ${title} delivers an emotionally resonant journey that keeps audiences engaged from start to finish, scoring an impressive ${rating}/10. `,
    `${title} stands out in its genre as a ${year} release that balances entertainment with depth, achieving a well-deserved ${rating}/10 from audiences worldwide. `,
  ];

  const idx = item.id % templates.length;
  return templates[idx] + (item.overview?.slice(0, 200) || '') + (item.overview && item.overview.length > 200 ? '...' : '');
}

export function getMoodRecommendation(mood: Mood) {
  return MOOD_MAP[mood];
}

// Genre list for the Absolute Cinema / Discovery sections
export const CINEMA_GENRES = [
  { id: 27, name: 'Horror', emoji: '👻', color: '#8B0000', tmdbId: 27 },
  { id: 53, name: 'Thriller', emoji: '🔪', color: '#1A1A2E', tmdbId: 53 },
  { id: 28, name: 'Action', emoji: '💥', color: '#FF4500', tmdbId: 28 },
  { id: 878, name: 'Sci-Fi', emoji: '🚀', color: '#001F5B', tmdbId: 878 },
  { id: 80, name: 'Crime', emoji: '🕵️', color: '#2C2C2C', tmdbId: 80 },
  { id: 9648, name: 'Mystery', emoji: '🔍', color: '#1A1A3E', tmdbId: 9648 },
  { id: 10749, name: 'Romance', emoji: '❤️', color: '#8B0045', tmdbId: 10749 },
  { id: 14, name: 'Fantasy', emoji: '🧙', color: '#2D1B69', tmdbId: 14 },
  { id: 16, name: 'Animation', emoji: '🎨', color: '#FF6B35', tmdbId: 16 },
  { id: 35, name: 'Comedy', emoji: '😂', color: '#F7C59F', tmdbId: 35 },
  { id: 12, name: 'Adventure', emoji: '🗺️', color: '#2D5016', tmdbId: 12 },
  { id: 18, name: 'Drama', emoji: '🎭', color: '#4A1942', tmdbId: 18 },
  { id: 99, name: 'Documentary', emoji: '📽️', color: '#1B3A4B', tmdbId: 99 },
  { id: 10765, name: 'Sci-Fi & Fantasy', emoji: '✨', color: '#0D1B2A', tmdbId: 10765 },
  { id: 10759, name: 'Action & Adventure', emoji: '⚡', color: '#1C0A00', tmdbId: 10759 },
];
