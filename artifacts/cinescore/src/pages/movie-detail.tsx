import { useRoute } from "wouter";
import { Layout } from "@/components/layout";
import { useGetMovieDetails, useGetMovieRecommendations } from "@workspace/api-client-react";
import { useWatchlist } from "@/hooks/use-watchlist";
import { MovieCard } from "@/components/movie-card";
import { SiImdb, SiRottentomatoes } from "react-icons/si";
import { Clock, Calendar, Director as DirectorIcon, Users, BookmarkPlus, BookmarkCheck, Star } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function MovieDetail() {
  const [, params] = useRoute("/movie/:tmdbId");
  const tmdbId = params?.tmdbId ? parseInt(params.tmdbId, 10) : 0;

  const { data: movie, isLoading: isMovieLoading } = useGetMovieDetails(tmdbId, {
    query: { enabled: !!tmdbId }
  });

  const { data: recs } = useGetMovieRecommendations(tmdbId, {
    query: { enabled: !!tmdbId }
  });

  const { isInWatchlist, addToWatchlist, removeFromWatchlist } = useWatchlist();
  const isSaved = isInWatchlist(tmdbId);

  const handleWatchlistToggle = () => {
    if (!movie) return;
    if (isSaved) {
      removeFromWatchlist(tmdbId);
    } else {
      addToWatchlist({
        tmdbId: movie.tmdbId,
        title: movie.title,
        year: movie.year,
        posterPath: movie.posterPath,
        voteAverage: movie.voteAverage
      });
    }
  };

  if (isMovieLoading) {
    return (
      <Layout>
        <div className="w-full h-[60vh] bg-muted animate-pulse" />
        <div className="container mx-auto px-4 -mt-32 relative z-10 flex gap-8">
          <div className="w-64 aspect-[2/3] bg-card rounded-xl animate-pulse shrink-0 border-4 border-background" />
          <div className="flex-1 mt-32 flex flex-col gap-4">
            <div className="h-10 bg-muted rounded w-1/2 animate-pulse" />
            <div className="h-6 bg-muted rounded w-1/4 animate-pulse" />
            <div className="h-32 bg-muted rounded w-full animate-pulse mt-8" />
          </div>
        </div>
      </Layout>
    );
  }

  if (!movie) {
    return (
      <Layout>
        <div className="container py-20 text-center text-muted-foreground">
          Movie not found.
        </div>
      </Layout>
    );
  }

  const backdropUrl = movie.backdropPath 
    ? `https://image.tmdb.org/t/p/original${movie.backdropPath}`
    : "https://images.unsplash.com/photo-1489599849927-2ee91cede3ba?q=80&w=2070&auto=format&fit=crop";

  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;

  const imdbRating = movie.ratings?.find(r => r.source === "IMDb");
  const rtRating = movie.ratings?.find(r => r.source === "Rotten Tomatoes");

  return (
    <Layout>
      {/* Hero Backdrop */}
      <div className="relative w-full h-[50vh] md:h-[70vh] bg-background">
        <div className="absolute inset-0 z-0">
          <img 
            src={backdropUrl} 
            alt={`${movie.title} backdrop`}
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background via-background/80 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/50 to-transparent" />
        </div>
      </div>

      <div className="container mx-auto px-4 relative z-10 -mt-32 md:-mt-64 mb-16">
        <div className="flex flex-col md:flex-row gap-8 items-start">
          
          {/* Poster Column */}
          <div className="w-48 md:w-72 shrink-0 flex flex-col gap-4 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded-xl overflow-hidden border-4 border-background shadow-2xl bg-muted relative">
              {posterUrl ? (
                <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground">
                  No Poster
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleWatchlistToggle} 
              variant={isSaved ? "secondary" : "default"}
              size="lg"
              className="w-full font-bold gap-2"
            >
              {isSaved ? (
                <><BookmarkCheck className="w-5 h-5" /> Saved to Watchlist</>
              ) : (
                <><BookmarkPlus className="w-5 h-5" /> Add to Watchlist</>
              )}
            </Button>
          </div>

          {/* Details Column */}
          <div className="flex-1 flex flex-col gap-6 pt-4 md:pt-16">
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-foreground drop-shadow-md">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-lg md:text-xl text-muted-foreground italic mt-2">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            <div className="flex flex-wrap items-center gap-4 text-sm font-medium">
              {movie.year && (
                <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-md border border-border/50">
                  <Calendar className="w-4 h-4" /> {movie.year}
                </div>
              )}
              {movie.runtime && (
                <div className="flex items-center gap-1.5 text-muted-foreground bg-muted/30 px-2.5 py-1 rounded-md border border-border/50">
                  <Clock className="w-4 h-4" /> {movie.runtime} min
                </div>
              )}
              <div className="flex flex-wrap gap-2">
                {movie.genres?.map(g => (
                  <span key={g} className="px-2.5 py-1 bg-primary/10 text-primary border border-primary/20 rounded-full text-xs font-semibold uppercase tracking-wider">
                    {g}
                  </span>
                ))}
              </div>
            </div>

            {/* Ratings Dashboard */}
            <div className="bg-card/50 backdrop-blur-sm border border-border rounded-xl p-4 md:p-6 shadow-lg flex flex-wrap items-center gap-6 md:gap-12">
              {/* MovieMetric Badge */}
              <div className="flex flex-col gap-1 items-center md:items-start border-r border-border pr-6 md:pr-12">
                <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">MovieMetric</span>
                <div className="flex items-center gap-2">
                  <Star className="w-8 h-8 fill-primary text-primary" />
                  <span className="text-3xl font-black bg-gradient-to-br from-primary to-amber-300 bg-clip-text text-transparent">
                    {movie.movieMetricScore ? movie.movieMetricScore.toFixed(0) : "N/A"}
                  </span>
                </div>
              </div>

              {imdbRating && (
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">IMDb</span>
                  <div className="flex items-center gap-2">
                    <SiImdb className="w-8 h-8 text-[#F5C518]" />
                    <span className="text-xl font-bold">{imdbRating.value}</span>
                  </div>
                </div>
              )}

              {rtRating && (
                <div className="flex flex-col gap-1 items-center">
                  <span className="text-xs text-muted-foreground font-semibold uppercase tracking-wider">Tomatometer</span>
                  <div className="flex items-center gap-2">
                    <SiRottentomatoes className="w-8 h-8 text-[#FA320A]" />
                    <span className="text-xl font-bold">{rtRating.value}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Plot Overview */}
            <div className="mt-4">
              <h3 className="text-xl font-bold mb-3 border-b border-border/50 pb-2">Overview</h3>
              <p className="text-muted-foreground leading-relaxed text-lg">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Cast & Crew */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
              {movie.director && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    Director
                  </h3>
                  <p className="font-medium text-lg">{movie.director}</p>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2 flex items-center gap-2">
                    Top Cast
                  </h3>
                  <p className="font-medium text-foreground/80 leading-relaxed">
                    {movie.cast.slice(0, 5).join(", ")}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Recommendations */}
      {recs?.results && recs.results.length > 0 && (
        <div className="container mx-auto px-4 py-12 border-t border-border/30">
          <h2 className="text-2xl font-bold mb-6 flex items-center gap-2">
            <span className="w-2 h-6 bg-primary rounded-sm inline-block"></span>
            Similar Movies
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {recs.results.slice(0, 5).map(rec => (
              <MovieCard key={rec.tmdbId} movie={rec} />
            ))}
          </div>
        </div>
      )}
    </Layout>
  );
}
