import { useEffect } from "react";
import { useLocation } from "wouter";
import { useSearchMovies } from "@workspace/api-client-react";
import { Layout } from "@/components/layout";
import { MovieCard, MovieCardSkeleton } from "@/components/movie-card";

export default function SearchPage() {
  const [location] = useLocation();
  const urlParams = new URLSearchParams(window.location.search);
  const q = urlParams.get("q") || "";

  const { data, isLoading, error } = useSearchMovies(
    { q },
    { query: { enabled: !!q } }
  );

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8 md:py-12">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search Results</h1>
          {q ? (
            <p className="text-muted-foreground">
              Showing results for <span className="text-foreground font-medium">"{q}"</span>
            </p>
          ) : (
            <p className="text-muted-foreground">Enter a search term to find movies.</p>
          )}
        </div>

        {q && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))
            ) : error ? (
              <div className="col-span-full py-12 text-center text-destructive">
                An error occurred while searching.
              </div>
            ) : data?.results && data.results.length > 0 ? (
              data.results.map((movie) => (
                <MovieCard key={movie.tmdbId} movie={movie} />
              ))
            ) : (
              <div className="col-span-full py-12 text-center text-muted-foreground bg-muted/20 rounded-xl border border-border/50">
                No movies found matching your query.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
