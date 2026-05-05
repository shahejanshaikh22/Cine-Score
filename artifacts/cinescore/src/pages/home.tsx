import { useGetTrendingMovies } from "@workspace/api-client-react";
import { MovieCard, MovieCardSkeleton } from "@/components/movie-card";
import { Layout } from "@/components/layout";
import { useLocation } from "wouter";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";

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
            Discover the <span className="text-primary">Cinematic</span> Universe
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground mb-4 max-w-xl">
            Your command center for movie ratings, reviews, and recommendations. 
            Find out what's worth watching.
          </p>
          
          <form onSubmit={handleHeroSearch} className="w-full max-w-2xl relative flex items-center">
            <Search className="absolute left-4 h-5 w-5 text-muted-foreground" />
            <input 
              name="q"
              type="search"
              placeholder="Search for movies, directors, or actors..."
              className="w-full h-14 bg-card/80 backdrop-blur-md border border-border rounded-full pl-12 pr-32 text-base focus:outline-none focus:ring-2 focus:ring-primary focus:border-primary transition-all shadow-xl"
            />
            <Button type="submit" className="absolute right-1.5 rounded-full h-11 px-6 font-semibold">
              Search
            </Button>
          </form>
        </div>
      </section>

      {/* Trending Section */}
      <section className="container mx-auto px-4 py-12 md:py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
            <span className="w-2 h-8 bg-primary rounded-sm inline-block"></span>
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
