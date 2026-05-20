import { useGetTrendingMovies } from "@workspace/api-client-react";
import { MovieCard, MovieCardSkeleton } from "@/components/movie-card";
import { Layout } from "@/components/layout";
import { useLocation, Link } from "wouter";
import { Search, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

const PICK_OF_THE_WEEK = {
  tmdbId: 278,
  title: "The Shawshank Redemption",
  year: "1994",
  overview:
    "Framed in the 1940s for the double murder of his wife and her lover, upstanding banker Andy Dufresne begins a new life at the Shawshank State Penitentiary, where he puts his accounting skills to work for an amoral warden. During his long stretch in prison, Dufresne comes to be admired by the other inmates — including an older prisoner named Red — for his integrity and unquenchable sense of hope.",
  posterPath: "/lyQBXzOQSuE59IsHyhrp0qIiPAz.jpg",
  backdropPath: "/kXfqcdQKsToO0OUXHcrrNCHDBzO.jpg",
  genres: ["Drama", "Crime"],
  voteAverage: 8.7,
};

export default function Home() {
  const { data: trending, isLoading } = useGetTrendingMovies();
  const [, setLocation] = useLocation();

  const handleHeroSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const q = formData.get("q") as string;
    if (q.trim()) {
      setLocation(`/search?q=${encodeURIComponent(q.trim())}`);
    }
  };

  return (
    <Layout>
      {/* Hero Section */}
      <section className="w-full py-24 md:py-36 px-6">
        <div className="container mx-auto max-w-3xl flex flex-col gap-8">
          <div className="flex flex-col gap-4">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-primary">
              The Cinema Record
            </p>
            <h1 className="font-serif text-5xl md:text-7xl font-normal leading-[1.08] tracking-tight text-foreground">
              Discover the<br />
              <em className="text-primary not-italic">Cinematic</em> Universe
            </h1>
            <p className="text-base text-muted-foreground max-w-lg leading-relaxed mt-1">
              Ratings, reviews, and recommendations from every major source — unified into one score.
            </p>
          </div>

          <form onSubmit={handleHeroSearch} className="flex items-center gap-2 max-w-xl" data-testid="form-hero-search">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground/60" />
              <input
                name="q"
                type="search"
                placeholder="Search for movies, directors, or actors..."
                className="w-full h-12 bg-card border border-border/60 rounded pl-10 pr-4 text-sm focus:outline-none focus:ring-1 focus:ring-primary/60 focus:border-primary/60 transition-all"
                data-testid="input-hero-search"
              />
            </div>
            <Button type="submit" className="h-12 px-6 rounded font-medium text-sm" data-testid="button-hero-search">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Thin divider */}
      <div className="container mx-auto px-6">
        <div className="border-t border-border/20" />
      </div>

      {/* CineScore Pick of the Week */}
      <section className="container mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">Editor's Selection</p>
          <h2 className="text-xl font-semibold text-foreground">Pick of the Week</h2>
        </div>

        <Link href={`/movie/${PICK_OF_THE_WEEK.tmdbId}`} className="group block">
          <div className="flex flex-col sm:flex-row gap-6 p-6 border border-border/30 rounded hover:border-border/60 transition-colors duration-300">
            <img
              src={`https://image.tmdb.org/t/p/w500${PICK_OF_THE_WEEK.posterPath}`}
              alt={PICK_OF_THE_WEEK.title}
              className="w-24 sm:w-32 aspect-[2/3] rounded object-cover shrink-0 opacity-90 group-hover:opacity-100 transition-opacity"
            />
            <div className="flex flex-col gap-3 justify-center">
              <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider">
                <span>{PICK_OF_THE_WEEK.year}</span>
                <span>&middot;</span>
                {PICK_OF_THE_WEEK.genres.map(g => (
                  <span key={g}>{g}</span>
                ))}
                <span>&middot;</span>
                <span className="flex items-center gap-1 text-primary font-medium">
                  <Star className="w-3 h-3 fill-primary" />
                  {PICK_OF_THE_WEEK.voteAverage}
                </span>
              </div>
              <h3 className="font-serif text-2xl md:text-3xl font-normal text-foreground group-hover:text-primary transition-colors">
                {PICK_OF_THE_WEEK.title}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed line-clamp-2 max-w-2xl">
                {PICK_OF_THE_WEEK.overview}
              </p>
              <span className="text-xs text-primary font-medium mt-1 group-hover:underline underline-offset-4">
                View full details &rarr;
              </span>
            </div>
          </div>
        </Link>
      </section>

      {/* Thin divider */}
      <div className="container mx-auto px-6">
        <div className="border-t border-border/20" />
      </div>

      {/* Trending Section */}
      <section className="container mx-auto px-6 py-16">
        <div className="mb-8">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">What's popular</p>
          <h2 className="text-xl font-semibold text-foreground">Trending Now</h2>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
          {isLoading ? (
            Array.from({ length: 12 }).map((_, i) => (
              <MovieCardSkeleton key={i} />
            ))
          ) : trending?.results ? (
            trending.results.map((movie) => (
              <MovieCard key={movie.tmdbId} movie={movie} />
            ))
          ) : (
            <div className="col-span-full py-12 text-center text-muted-foreground">
              Failed to load trending movies.
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
}
