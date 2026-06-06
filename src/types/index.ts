// TMDB Core Types

export interface Movie {
  id: number;
  title: string;
  original_title: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  release_date: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  genres?: Genre[];
  adult: boolean;
  original_language: string;
  video: boolean;
  runtime?: number;
  budget?: number;
  revenue?: number;
  status?: string;
  tagline?: string;
  production_companies?: ProductionCompany[];
  production_countries?: ProductionCountry[];
  spoken_languages?: SpokenLanguage[];
  belongs_to_collection?: Collection;
  imdb_id?: string;
  credits?: Credits;
  videos?: VideoResults;
  similar?: PaginatedResponse<Movie>;
  recommendations?: PaginatedResponse<Movie>;
  watch_providers?: WatchProviderResults;
  external_ids?: ExternalIds;
  images?: MediaImages;
  keywords?: { keywords: Keyword[] };
  release_dates?: ReleaseDates;
  media_type?: 'movie';
}

export interface TVSeries {
  id: number;
  name: string;
  original_name: string;
  overview: string;
  poster_path: string | null;
  backdrop_path: string | null;
  first_air_date: string;
  last_air_date?: string;
  vote_average: number;
  vote_count: number;
  popularity: number;
  genre_ids: number[];
  genres?: Genre[];
  adult: boolean;
  original_language: string;
  origin_country: string[];
  number_of_seasons?: number;
  number_of_episodes?: number;
  episode_run_time?: number[];
  status?: string;
  type?: string;
  tagline?: string;
  networks?: Network[];
  production_companies?: ProductionCompany[];
  seasons?: Season[];
  credits?: Credits;
  videos?: VideoResults;
  similar?: PaginatedResponse<TVSeries>;
  recommendations?: PaginatedResponse<TVSeries>;
  watch_providers?: WatchProviderResults;
  external_ids?: ExternalIds;
  images?: MediaImages;
  keywords?: { results: Keyword[] };
  created_by?: Creator[];
  media_type?: 'tv';
  in_production?: boolean;
  languages?: string[];
}

export interface Genre {
  id: number;
  name: string;
}

export interface ProductionCompany {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface ProductionCountry {
  iso_3166_1: string;
  name: string;
}

export interface SpokenLanguage {
  iso_639_1: string;
  name: string;
  english_name: string;
}

export interface Collection {
  id: number;
  name: string;
  poster_path: string | null;
  backdrop_path: string | null;
}

export interface Credits {
  cast: CastMember[];
  crew: CrewMember[];
}

export interface CastMember {
  id: number;
  name: string;
  character: string;
  profile_path: string | null;
  order: number;
  known_for_department: string;
  credit_id: string;
  cast_id?: number;
}

export interface CrewMember {
  id: number;
  name: string;
  job: string;
  department: string;
  profile_path: string | null;
  credit_id: string;
  known_for_department: string;
}

export interface Creator {
  id: number;
  name: string;
  profile_path: string | null;
  credit_id: string;
  gender: number;
}

export interface Video {
  id: string;
  key: string;
  name: string;
  site: string;
  type: string;
  official: boolean;
  published_at: string;
  iso_639_1: string;
  iso_3166_1: string;
  size: number;
}

export interface VideoResults {
  results: Video[];
}

export interface WatchProvider {
  logo_path: string;
  provider_id: number;
  provider_name: string;
  display_priority: number;
}

export interface WatchProviderCountry {
  link?: string;
  flatrate?: WatchProvider[];
  rent?: WatchProvider[];
  buy?: WatchProvider[];
  free?: WatchProvider[];
  ads?: WatchProvider[];
}

export interface WatchProviderResults {
  results: Record<string, WatchProviderCountry>;
}

export interface ExternalIds {
  imdb_id?: string;
  tvdb_id?: number;
  facebook_id?: string;
  instagram_id?: string;
  twitter_id?: string;
}

export interface MediaImages {
  backdrops: ImageFile[];
  posters: ImageFile[];
  logos?: ImageFile[];
}

export interface ImageFile {
  aspect_ratio: number;
  file_path: string;
  height: number;
  width: number;
  vote_average: number;
  vote_count: number;
  iso_639_1: string | null;
}

export interface Keyword {
  id: number;
  name: string;
}

export interface ReleaseDates {
  results: ReleaseDateCountry[];
}

export interface ReleaseDateCountry {
  iso_3166_1: string;
  release_dates: ReleaseDate[];
}

export interface ReleaseDate {
  certification: string;
  release_date: string;
  type: number;
}

export interface Season {
  id: number;
  name: string;
  overview: string;
  poster_path: string | null;
  season_number: number;
  episode_count: number;
  air_date: string;
  vote_average: number;
}

export interface Episode {
  id: number;
  name: string;
  overview: string;
  still_path: string | null;
  air_date: string;
  episode_number: number;
  season_number: number;
  vote_average: number;
  vote_count: number;
  runtime: number;
  crew: CrewMember[];
  guest_stars: CastMember[];
}

export interface SeasonDetail extends Season {
  episodes: Episode[];
  _id: string;
}

export interface Network {
  id: number;
  name: string;
  logo_path: string | null;
  origin_country: string;
}

export interface Person {
  id: number;
  name: string;
  biography: string;
  birthday: string | null;
  deathday: string | null;
  place_of_birth: string | null;
  profile_path: string | null;
  known_for_department: string;
  popularity: number;
  gender: number;
  also_known_as: string[];
  imdb_id?: string;
  external_ids?: ExternalIds;
  movie_credits?: PersonCredits;
  tv_credits?: PersonCredits;
  images?: { profiles: ImageFile[] };
}

export interface PersonCredits {
  cast: (Movie | TVSeries)[];
  crew: (Movie | TVSeries)[];
}

export interface PaginatedResponse<T> {
  page: number;
  results: T[];
  total_pages: number;
  total_results: number;
}

export interface SearchResult {
  id: number;
  media_type: 'movie' | 'tv' | 'person';
  title?: string;
  name?: string;
  poster_path?: string | null;
  profile_path?: string | null;
  vote_average?: number;
  release_date?: string;
  first_air_date?: string;
  overview?: string;
  known_for_department?: string;
  popularity: number;
}

// App-specific types

export interface CinematicRating {
  overall: number;
  story: number;
  acting: number;
  cinematography: number;
  soundtrack: number;
  emotionalImpact: number;
  rewatchValue: number;
  endingQuality: number;
  characterDepth: number;
  suspenseMeter: number;
  comedyMeter: number;
  horrorMeter: number;
  romanceMeter: number;
  actionMeter: number;
  mindfuckMeter: number;
  darkToneMeter: number;
  violenceMeter: number;
}

export interface GoodnessMeter {
  entertainmentValue: number;
  bingeworthiness: number;
  emotionalIntensity: number;
  slowBurnFactor: number;
  complexity: number;
  plotTwistLevel: number;
  casualFriendliness: number;
  cinemaLoverScore: number;
  aiConfidence: number;
}

export interface InterestMeter {
  horror: number;
  thriller: number;
  romance: number;
  mystery: number;
  action: number;
  scifi: number;
  comedy: number;
  drama: number;
  fantasy: number;
  crime: number;
  animation: number;
  documentary: number;
}

export type MediaType = 'movie' | 'tv';
export type Mood = 'happy' | 'sad' | 'thrilled' | 'scared' | 'romantic' | 'thoughtful' | 'adventurous' | 'laugh';

export interface UserProfile {
  uid: string;
  displayName: string | null;
  email: string | null;
  photoURL: string | null;
  createdAt: Date;
}

export interface WatchlistItem {
  mediaId: number;
  mediaType: MediaType;
  title: string;
  posterPath: string | null;
  addedAt: Date;
  progress?: number;
}

export interface ReviewItem {
  id: string;
  userId: string;
  mediaId: number;
  mediaType: MediaType;
  rating: number;
  content: string;
  containsSpoilers: boolean;
  createdAt: Date;
  likes: number;
  userName: string;
  userAvatar?: string;
}
