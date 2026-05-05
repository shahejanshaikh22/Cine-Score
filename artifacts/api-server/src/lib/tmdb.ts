const TMDB_BASE = "https://api.themoviedb.org/3";
const TMDB_API_KEY = process.env.TMDB_API_KEY;

if (!TMDB_API_KEY) {
  throw new Error("TMDB_API_KEY environment variable is required");
}

async function tmdbFetch<T>(path: string, params: Record<string, string> = {}): Promise<T> {
  const url = new URL(`${TMDB_BASE}${path}`);
  url.searchParams.set("api_key", TMDB_API_KEY!);
  for (const [k, v] of Object.entries(params)) {
    url.searchParams.set(k, v);
  }
  const res = await fetch(url.toString());
  if (!res.ok) {
    throw new Error(`TMDB error ${res.status}: ${res.statusText}`);
  }
  return res.json() as Promise<T>;
}

interface TmdbMovie {
  id: number;
  title: string;
  release_date?: string;
  overview?: string;
  poster_path?: string | null;
  backdrop_path?: string | null;
  genre_ids?: number[];
  genres?: { id: number; name: string }[];
  vote_average?: number;
  popularity?: number;
  imdb_id?: string | null;
  runtime?: number | null;
  tagline?: string | null;
  status?: string | null;
  budget?: number | null;
  revenue?: number | null;
}

interface TmdbSearchResponse {
  results: TmdbMovie[];
  total_results: number;
  page: number;
  total_pages: number;
}

interface TmdbCredits {
  cast: { name: string; order: number }[];
  crew: { name: string; job: string }[];
}

interface TmdbGenre {
  id: number;
  name: string;
}

const GENRE_MAP: Record<number, string> = {
  28: "Action", 12: "Adventure", 16: "Animation", 35: "Comedy",
  80: "Crime", 99: "Documentary", 18: "Drama", 10751: "Family",
  14: "Fantasy", 36: "History", 27: "Horror", 10402: "Music",
  9648: "Mystery", 10749: "Romance", 878: "Science Fiction",
  10770: "TV Movie", 53: "Thriller", 10752: "War", 37: "Western",
};

export type MovieSummary = {
  tmdbId: number;
  title: string;
  year: string | null;
  overview: string | null;
  posterPath: string | null;
  backdropPath: string | null;
  genres: string[];
  voteAverage: number | null;
  popularity: number | null;
};

export type MovieDetail = MovieSummary & {
  imdbId: string | null;
  runtime: number | null;
  director: string | null;
  cast: string[];
  tagline: string | null;
  status: string | null;
  budget: number | null;
  revenue: number | null;
};

function mapSummary(m: TmdbMovie): MovieSummary {
  const genres = m.genres
    ? m.genres.map((g: TmdbGenre) => g.name)
    : (m.genre_ids ?? []).map((id: number) => GENRE_MAP[id] ?? "Unknown");

  return {
    tmdbId: m.id,
    title: m.title,
    year: m.release_date ? m.release_date.slice(0, 4) : null,
    overview: m.overview ?? null,
    posterPath: m.poster_path ?? null,
    backdropPath: m.backdrop_path ?? null,
    genres,
    voteAverage: m.vote_average ?? null,
    popularity: m.popularity ?? null,
  };
}

export async function searchMovies(query: string, page: number = 1) {
  const data = await tmdbFetch<TmdbSearchResponse>("/search/movie", {
    query,
    page: String(page),
    include_adult: "false",
  });
  return {
    results: data.results.map(mapSummary),
    totalResults: data.total_results,
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function getTrending() {
  const data = await tmdbFetch<TmdbSearchResponse>("/trending/movie/week");
  return {
    results: data.results.map(mapSummary),
    totalResults: data.total_results,
    page: data.page,
    totalPages: data.total_pages,
  };
}

export async function getMovieDetails(tmdbId: number): Promise<MovieDetail> {
  const [movie, credits] = await Promise.all([
    tmdbFetch<TmdbMovie>(`/movie/${tmdbId}`),
    tmdbFetch<TmdbCredits>(`/movie/${tmdbId}/credits`),
  ]);

  const director = credits.crew.find((c) => c.job === "Director")?.name ?? null;
  const cast = credits.cast
    .sort((a, b) => a.order - b.order)
    .slice(0, 8)
    .map((c) => c.name);

  return {
    ...mapSummary(movie),
    imdbId: movie.imdb_id ?? null,
    runtime: movie.runtime ?? null,
    director,
    cast,
    tagline: movie.tagline ?? null,
    status: movie.status ?? null,
    budget: movie.budget ?? null,
    revenue: movie.revenue ?? null,
  };
}

export async function getRecommendations(tmdbId: number): Promise<MovieSummary[]> {
  const data = await tmdbFetch<TmdbSearchResponse>(`/movie/${tmdbId}/recommendations`);
  const similar = await tmdbFetch<TmdbSearchResponse>(`/movie/${tmdbId}/similar`);

  const combined = [...data.results, ...similar.results];
  const seen = new Set<number>();
  const unique: TmdbMovie[] = [];
  for (const m of combined) {
    if (!seen.has(m.id)) {
      seen.add(m.id);
      unique.push(m);
    }
  }

  return unique
    .sort((a, b) => (b.popularity ?? 0) - (a.popularity ?? 0))
    .slice(0, 5)
    .map(mapSummary);
}
