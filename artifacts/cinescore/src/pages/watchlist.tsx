import { Layout } from "@/components/layout";
import { useWatchlist } from "@/hooks/use-watchlist";
import { MovieCard } from "@/components/movie-card";
import { Bookmark, Film } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function WatchlistPage() {
  const { watchlist } = useWatchlist();

  return (
    <Layout>
      <div className="container mx-auto px-6 py-12 flex-1 flex flex-col">
        <div className="mb-10 border-b border-border/20 pb-6 flex items-start gap-3">
          <Bookmark className="w-5 h-5 text-primary mt-1" strokeWidth={1.5} />
          <div>
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">Your collection</p>
            <h1 className="font-serif text-3xl font-normal text-foreground">Watchlist</h1>
            {watchlist.length > 0 && (
              <p className="text-sm text-muted-foreground mt-1">{watchlist.length} {watchlist.length === 1 ? "film" : "films"} saved</p>
            )}
          </div>
        </div>

        {watchlist.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {watchlist.map((movie) => (
              <MovieCard key={movie.tmdbId} movie={movie} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-24 px-4">
            <Film className="w-10 h-10 text-muted-foreground/30 mb-6" strokeWidth={1} />
            <h2 className="font-serif text-2xl font-normal text-foreground mb-2">Nothing saved yet</h2>
            <p className="text-sm text-muted-foreground max-w-xs mb-8 leading-relaxed">
              Add movies to your watchlist as you browse — they'll appear here for easy access.
            </p>
            <Link href="/">
              <Button size="sm" className="rounded font-medium px-6">
                Explore Movies
              </Button>
            </Link>
          </div>
        )}
      </div>
    </Layout>
  );
}
