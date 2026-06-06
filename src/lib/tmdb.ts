import {
  Movie, TVSeries, PaginatedResponse, SearchResult,
  SeasonDetail, Episode, Person, Genre, Video
} from '@/types';

const BASE_URL = process.env.NEXT_PUBLIC_TMDB_BASE_URL || 'https://api.themoviedb.org/3';
const API_KEY = process.env.NEXT_PUBLIC_TMDB_API_KEY || '';
const IMAGE_BASE = process.env.NEXT_PUBLIC_TMDB_IMAGE_BASE || 'https://image.tmdb.org/t/p';

// Image URL helpers
export const tmdbImage = {
  poster: (path: string | null, size: 'w92' | 'w154' | 'w185' | 'w342' | 'w500' | 'w780' | 'original' = 'w500') =>
    path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder-poster.jpg',
  backdrop: (path: string | null, size: 'w300' | 'w780' | 'w1280' | 'original' = 'w1280') =>
    path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder-backdrop.jpg',
  profile: (path: string | null, size: 'w45' | 'w185' | 'h632' | 'original' = 'w185') =>
    path ? `${IMAGE_BASE}/${size}${path}` : '/placeholder-profile.jpg',
  logo: (path: string | null, size: 'w45' | 'w92' | 'w154' | 'w185' | 'w300' | 'w500' | 'original' = 'w185') =>
    path ? `${IMAGE_BASE}/${size}${path}` : null,
};

class TMDBClient {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = API_KEY;
    this.baseUrl = BASE_URL;
  }

  private async fetch<T>(endpoint: string, params: Record<string, string | number> = {}): Promise<T> {
    const searchParams = new URLSearchParams({
      api_key: this.apiKey,
      ...Object.fromEntries(Object.entries(params).map(([k, v]) => [k, String(v)])),
    });

    const url = `${this.baseUrl}${endpoint}?${searchParams.toString()}`;

    const res = await fetch(url, {
      next: { revalidate: 3600 }, // 1 hour cache
    });

    if (!res.ok) {
      throw new Error(`TMDB API Error: ${res.status} ${res.statusText} for ${endpoint}`);
    }

    return res.json() as Promise<T>;
  }

  // ─── Movies ───────────────────────────────────────────────────────────────

  async getTrendingMovies(timeWindow: 'day' | 'week' = 'week', page = 1) {
    return this.fetch<PaginatedResponse<Movie>>(`/trending/movie/${timeWindow}`, { page });
  }

  async getPopularMovies(page = 1) {
    return this.fetch<PaginatedResponse<Movie>>('/movie/popular', { page });
  }

  async getTopRatedMovies(page = 1) {
    return this.fetch<PaginatedResponse<Movie>>('/movie/top_rated', { page });
  }

  async getUpcomingMovies(page = 1) {
    return this.fetch<PaginatedResponse<Movie>>('/movie/upcoming', { page });
  }

  async getNowPlayingMovies(page = 1) {
    return this.fetch<PaginatedResponse<Movie>>('/movie/now_playing', { page });
  }

  async getMovieDetails(id: number): Promise<Movie> {
    return this.fetch<Movie>(`/movie/${id}`, {
      append_to_response: 'credits,videos,similar,recommendations,watch/providers,external_ids,images,keywords,release_dates',
    });
  }

  async getMoviesByGenre(genreId: number, page = 1, sortBy = 'popularity.desc') {
    return this.fetch<PaginatedResponse<Movie>>('/discover/movie', {
      with_genres: genreId,
      page,
      sort_by: sortBy,
    });
  }

  async discoverMovies(params: Record<string, string | number> = {}) {
    return this.fetch<PaginatedResponse<Movie>>('/discover/movie', {
      sort_by: 'popularity.desc',
      ...params,
    });
  }

  // ─── TV Series ────────────────────────────────────────────────────────────

  async getTrendingTV(timeWindow: 'day' | 'week' = 'week', page = 1) {
    return this.fetch<PaginatedResponse<TVSeries>>(`/trending/tv/${timeWindow}`, { page });
  }

  async getPopularTV(page = 1) {
    return this.fetch<PaginatedResponse<TVSeries>>('/tv/popular', { page });
  }

  async getTopRatedTV(page = 1) {
    return this.fetch<PaginatedResponse<TVSeries>>('/tv/top_rated', { page });
  }

  async getAiringTodayTV(page = 1) {
    return this.fetch<PaginatedResponse<TVSeries>>('/tv/airing_today', { page });
  }

  async getOnAirTV(page = 1) {
    return this.fetch<PaginatedResponse<TVSeries>>('/tv/on_the_air', { page });
  }

  async getTVDetails(id: number): Promise<TVSeries> {
    return this.fetch<TVSeries>(`/tv/${id}`, {
      append_to_response: 'credits,videos,similar,recommendations,watch/providers,external_ids,images,keywords',
    });
  }

  async getTVSeason(tvId: number, seasonNumber: number): Promise<SeasonDetail> {
    return this.fetch<SeasonDetail>(`/tv/${tvId}/season/${seasonNumber}`);
  }

  async getTVEpisode(tvId: number, seasonNumber: number, episodeNumber: number): Promise<Episode> {
    return this.fetch<Episode>(`/tv/${tvId}/season/${seasonNumber}/episode/${episodeNumber}`);
  }

  async getTVByGenre(genreId: number, page = 1, sortBy = 'popularity.desc') {
    return this.fetch<PaginatedResponse<TVSeries>>('/discover/tv', {
      with_genres: genreId,
      page,
      sort_by: sortBy,
    });
  }

  async discoverTV(params: Record<string, string | number> = {}) {
    return this.fetch<PaginatedResponse<TVSeries>>('/discover/tv', {
      sort_by: 'popularity.desc',
      ...params,
    });
  }

  // ─── Search ───────────────────────────────────────────────────────────────

  async searchMulti(query: string, page = 1) {
    return this.fetch<PaginatedResponse<SearchResult>>('/search/multi', { query, page });
  }

  async searchMovies(query: string, page = 1) {
    return this.fetch<PaginatedResponse<Movie>>('/search/movie', { query, page });
  }

  async searchTV(query: string, page = 1) {
    return this.fetch<PaginatedResponse<TVSeries>>('/search/tv', { query, page });
  }

  async searchPeople(query: string, page = 1) {
    return this.fetch<PaginatedResponse<Person>>('/search/person', { query, page });
  }

  // ─── People ───────────────────────────────────────────────────────────────

  async getPersonDetails(id: number): Promise<Person> {
    return this.fetch<Person>(`/person/${id}`, {
      append_to_response: 'movie_credits,tv_credits,external_ids,images',
    });
  }

  async getPopularPeople(page = 1) {
    return this.fetch<PaginatedResponse<Person>>('/person/popular', { page });
  }

  // ─── Trending ─────────────────────────────────────────────────────────────

  async getTrendingAll(timeWindow: 'day' | 'week' = 'week', page = 1) {
    return this.fetch<PaginatedResponse<Movie | TVSeries>>(`/trending/all/${timeWindow}`, { page });
  }

  // ─── Genres ───────────────────────────────────────────────────────────────

  async getMovieGenres(): Promise<{ genres: Genre[] }> {
    return this.fetch<{ genres: Genre[] }>('/genre/movie/list');
  }

  async getTVGenres(): Promise<{ genres: Genre[] }> {
    return this.fetch<{ genres: Genre[] }>('/genre/tv/list');
  }

  // ─── Videos ───────────────────────────────────────────────────────────────

  async getMovieVideos(id: number) {
    return this.fetch<{ results: Video[] }>(`/movie/${id}/videos`);
  }

  async getTVVideos(id: number) {
    return this.fetch<{ results: Video[] }>(`/tv/${id}/videos`);
  }

  // ─── Special / Curated ────────────────────────────────────────────────────

  async getHiddenGems(mediaType: 'movie' | 'tv' = 'movie', page = 1) {
    const params = {
      'vote_count.gte': 50,
      'vote_count.lte': 10000,
      'vote_average.gte': 7.0,
      sort_by: 'vote_average.desc',
      page,
    };
    if (mediaType === 'movie') return this.discoverMovies(params);
    return this.discoverTV(params);
  }

  async getTopByGenre(genreId: number, mediaType: 'movie' | 'tv' = 'movie', page = 1) {
    const params = {
      with_genres: genreId,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 100,
      page,
    };
    if (mediaType === 'movie') return this.discoverMovies(params);
    return this.discoverTV(params);
  }

  async getMoviesByRuntime(minRuntime: number, maxRuntime: number, page = 1) {
    return this.discoverMovies({
      'with_runtime.gte': minRuntime,
      'with_runtime.lte': maxRuntime,
      sort_by: 'popularity.desc',
      page,
    });
  }

  async getMoviesByDecade(startYear: number, endYear: number, page = 1) {
    return this.discoverMovies({
      'primary_release_date.gte': `${startYear}-01-01`,
      'primary_release_date.lte': `${endYear}-12-31`,
      sort_by: 'vote_average.desc',
      'vote_count.gte': 100,
      page,
    });
  }
}

export const tmdb = new TMDBClient();
export default tmdb;
