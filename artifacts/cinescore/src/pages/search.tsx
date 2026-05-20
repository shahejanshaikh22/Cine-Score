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
      <div className="container mx-auto px-6 py-12">
        <div className="mb-10 border-b border-border/20 pb-6">
          <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">Results</p>
          <h1 className="font-serif text-3xl font-normal text-foreground">
            {q ? (
              <><em className="not-italic text-muted-foreground/60">for</em> "{q}"</>
            ) : (
              "Search"
            )}
          </h1>
          {!q && (
            <p className="text-sm text-muted-foreground mt-2">Enter a search term to find movies.</p>
          )}
        </div>

        {q && (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4 md:gap-6">
            {isLoading ? (
              Array.from({ length: 12 }).map((_, i) => (
                <MovieCardSkeleton key={i} />
              ))
            ) : error ? (
              <div className="col-span-full py-12 text-center text-destructive text-sm">
                An error occurred while searching.
              </div>
            ) : data?.results && data.results.length > 0 ? (
              data.results.map((movie) => (
                <MovieCard key={movie.tmdbId} movie={movie} />
              ))
            ) : (
              <div className="col-span-full py-16 text-center text-muted-foreground/60 text-sm border border-border/20 rounded">
                No movies found matching your query.
              </div>
            )}
          </div>
        )}
      </div>
    </Layout>
  );
}
