import { useGetTrendingMovies } from "@workspace/api-client-react";
import { MovieCard, MovieCardSkeleton } from "@/components/movie-card";
import { Layout } from "@/components/layout";
import { useLocation, Link } from "wouter";
import { Search, Star, Award } from "lucide-react";
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
  popularity: 189.4,
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
      <section className="relative w-full py-20 md:py-32 flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/60 to-background z-10" />
        <div
          className="absolute inset-0 bg-[url('https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20"
        />

        <div className="relative z-20 container px-4 mx-auto flex flex-col items-center text-center gap-6 max-w-3xl">
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight text-foreground drop-shadow-md">
            Discover the <span className="text-primary" style={{ textShadow: "0 0 24px #39FF14, 0 0 48px #39FF1440" }}>Cinematic</span> Universe
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl">
            Your command center for movie ratings, reviews, and recommendations.
            Find out what's worth watching.
          </p>

          <form onSubmit={handleHeroSearch} className="w-full max-w-2xl relative flex items-center" data-testid="form-hero-search">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <input
              name="q"
              type="search"
              placeholder="Search for movies, directors, or actors..."
              className="w-full h-14 bg-card/80 backdrop-blur-md border border-border rounded-full pl-12 pr-32 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-xl"
              data-testid="input-hero-search"
            />
            <Button type="submit" className="absolute right-1.5 rounded-full h-11 px-6 font-semibold" data-testid="button-hero-search">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* CineScore Pick of the Week */}
      <section className="container mx-auto px-4 py-10">
        <div className="flex items-center gap-2 mb-6">
          <Award className="w-6 h-6 text-primary" style={{ filter: "drop-shadow(0 0 6px #39FF14)" }} />
          <h2 className="text-2xl md:text-3xl font-bold">CineScore Pick of the Week</h2>
        </div>

        <Link href={`/movie/${PICK_OF_THE_WEEK.tmdbId}`} className="group block">
          <div className="relative rounded-2xl overflow-hidden border border-primary/30 bg-card shadow-lg transition-all duration-300 group-hover:border-primary/60"
            style={{ boxShadow: "0 0 0 1px rgba(57,255,20,0.1), 0 4px 24px rgba(57,255,20,0.08)" }}
          >
            {/* Backdrop */}
            <div className="absolute inset-0">
              <img
                src={`https://image.tmdb.org/t/p/original${PICK_OF_THE_WEEK.backdropPath}`}
                alt={PICK_OF_THE_WEEK.title}
                className="w-full h-full object-cover opacity-20 group-hover:opacity-30 transition-opacity duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-card via-card/90 to-card/30" />
            </div>

            {/* Content */}
            <div className="relative z-10 flex flex-col sm:flex-row gap-6 p-6 md:p-8 items-start">
              <img
                src={`https://image.tmdb.org/t/p/w500${PICK_OF_THE_WEEK.posterPath}`}
                alt={PICK_OF_THE_WEEK.title}
                className="w-28 sm:w-36 aspect-[2/3] rounded-lg object-cover shadow-2xl shrink-0 border-2 border-primary/20"
              />
              <div className="flex flex-col gap-3">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold uppercase tracking-widest text-primary px-2 py-0.5 border border-primary/40 rounded-full"
                    style={{ boxShadow: "0 0 8px rgba(57,255,20,0.3)" }}>
                    Editor's Pick
                  </span>
                </div>
                <h3 className="text-2xl md:text-3xl font-black text-foreground group-hover:text-primary transition-colors">
                  {PICK_OF_THE_WEEK.title}
                </h3>
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span>{PICK_OF_THE_WEEK.year}</span>
                  <span>•</span>
                  {PICK_OF_THE_WEEK.genres.map(g => (
                    <span key={g} className="px-2 py-0.5 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold">
                      {g}
                    </span>
                  ))}
                  <span className="flex items-center gap-1 ml-1 font-bold text-primary">
                    <Star className="w-4 h-4 fill-primary" />
                    {PICK_OF_THE_WEEK.voteAverage}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm md:text-base line-clamp-3 max-w-2xl">
                  {PICK_OF_THE_WEEK.overview}
                </p>
                <span className="text-primary text-sm font-semibold group-hover:underline underline-offset-4 mt-1">
                  View full details &rarr;
                </span>
              </div>
            </div>
          </div>
        </Link>
      </section>

      {/* Trending Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-sm inline-block" style={{ boxShadow: "0 0 8px #39FF14" }}></span>
            Trending Now
          </h2>
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
