import { Layout } from "@/components/layout";
import { useWatchlist } from "@/hooks/use-watchlist";
import { MovieCard } from "@/components/movie-card";
import { Bookmark, Popcorn } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12 flex-1 flex flex-col">
        <div className="mb-8 flex items-center gap-3">
          <Bookmark className="w-8 h-8 text-primary" />
          <div>
            <h1 className="text-3xl font-bold">Your Watchlist</h1>
            <p className="text-muted-foreground">Movies you want to watch later.</p>
          </div>
        </div>

        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {watchlist.map((movie) => (
              <MovieCard key={movie.tmdbId} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-20 px-4 bg-muted/10 rounded-2xl border border-border/50 border-dashed">
            <div className="w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-6">
              <Popcorn className="w-10 h-10 text-muted-foreground/50" />
            </div>
            <h2 className="text-2xl font-semibold mb-2">Your watchlist is empty</h2>
            <p className="text-muted-foreground max-w-md mb-8">
              Looks like you haven't added any movies to your watchlist yet. 
              Explore trending movies or search for your favorites to save them here.
            </p>
            <Link href="/">
              <Button size="lg" className="font-semibold">
                Explore Movies
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
