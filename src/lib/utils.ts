import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatDate(dateString: string): string {
  if (!dateString) return 'TBA';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
}

export function formatYear(dateString: string): string {
  if (!dateString) return '—';
  return new Date(dateString).getFullYear().toString();
}

export function formatRuntime(minutes: number | undefined): string {
  if (!minutes) return '—';
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  return h > 0 ? `${h}h ${m}m` : `${m}m`;
}

export function formatCurrency(amount: number | undefined): string {
  if (!amount || amount === 0) return 'N/A';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    notation: 'compact',
    maximumFractionDigits: 1,
  }).format(amount);
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', { notation: 'compact', maximumFractionDigits: 1 }).format(n);
}

export function getRatingColor(rating: number): string {
  if (rating >= 8) return '#00C853';
  if (rating >= 6.5) return '#FFD600';
  if (rating >= 5) return '#FF6D00';
  return '#D50000';
}

export function getRatingLabel(rating: number): string {
  if (rating >= 9) return 'Masterpiece';
  if (rating >= 8) return 'Excellent';
  if (rating >= 7) return 'Great';
  if (rating >= 6) return 'Good';
  if (rating >= 5) return 'Average';
  return 'Below Average';
}

export function getScoreColor(score: number): string {
  if (score >= 80) return '#00C853';
  if (score >= 60) return '#FFD600';
  if (score >= 40) return '#FF6D00';
  return '#D50000';
}

export function getGridRatingColor(rating: number): string {
  if (rating === 0) return '#4A4A4A';
  if (rating >= 8.3) return '#15803D'; // Awesome
  if (rating >= 8.0) return '#22C55E'; // Great
  if (rating >= 7.0) return '#EAB308'; // Good
  if (rating >= 6.0) return '#F97316'; // Regular
  if (rating >= 5.0) return '#EF4444'; // Bad
  return '#8B5CF6'; // Garbage
}

export function truncate(str: string, length: number): string {
  if (!str) return '';
  if (str.length <= length) return str;
  return str.slice(0, length) + '...';
}

export function getYouTubeTrailer(videos: { results: { key: string; type: string; site: string; official: boolean }[] } | undefined): string | null {
  if (!videos?.results?.length) return null;

  const trailer = videos.results.find(
    v => v.site === 'YouTube' && v.type === 'Trailer' && v.official
  ) || videos.results.find(
    v => v.site === 'YouTube' && v.type === 'Trailer'
  ) || videos.results.find(
    v => v.site === 'YouTube'
  );

  return trailer ? trailer.key : null;
}

export function generateSkeletonArray(count: number): number[] {
  return Array.from({ length: count }, (_, i) => i);
}

export function getLanguageName(code: string): string {
  const languages: Record<string, string> = {
    en: 'English', fr: 'French', es: 'Spanish', de: 'German',
    ja: 'Japanese', ko: 'Korean', zh: 'Chinese', it: 'Italian',
    pt: 'Portuguese', ru: 'Russian', ar: 'Arabic', hi: 'Hindi',
    sv: 'Swedish', da: 'Danish', nl: 'Dutch', pl: 'Polish',
    tr: 'Turkish', th: 'Thai', id: 'Indonesian', vi: 'Vietnamese',
  };
  return languages[code] || code.toUpperCase();
}

export function getCertification(
  releaseDates: { results?: { iso_3166_1: string; release_dates: { certification: string; type: number }[] }[] } | undefined
): string {
  if (!releaseDates?.results) return 'NR';
  const us = releaseDates.results.find(r => r.iso_3166_1 === 'US');
  if (!us) return 'NR';
  const cert = us.release_dates.find(d => d.certification && d.type === 3)
    || us.release_dates.find(d => d.certification);
  return cert?.certification || 'NR';
}

export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
