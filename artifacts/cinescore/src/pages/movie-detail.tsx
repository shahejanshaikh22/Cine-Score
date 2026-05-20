import { useRoute } from "wouter";
import { Layout } from "@/components/layout";
import { useGetMovieDetails, useGetMovieRecommendations } from "@workspace/api-client-react";
import { useWatchlist } from "@/hooks/use-watchlist";
import { MovieCard } from "@/components/movie-card";
import { SiImdb, SiRottentomatoes, SiLetterboxd } from "react-icons/si";
import { Clock, Calendar, Clapperboard, BookmarkPlus, BookmarkCheck, Star, ChevronDown, BarChart2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

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
        <div className="container mx-auto px-6 py-16 flex gap-8">
          <div className="w-48 aspect-[2/3] bg-muted/60 rounded animate-pulse shrink-0" />
          <div className="flex-1 flex flex-col gap-4 pt-4">
            <div className="h-10 bg-muted/60 rounded w-1/2 animate-pulse" />
            <div className="h-5 bg-muted/40 rounded w-1/4 animate-pulse" />
            <div className="h-24 bg-muted/40 rounded w-full animate-pulse mt-4" />
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
    : null;

  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;

  const imdbRating = movie.ratings?.find(r => r.source === "IMDb");
  const rtRating = movie.ratings?.find(r => r.source === "Rotten Tomatoes");
  const metaRating = movie.ratings?.find(r => r.source === "Metacritic");
  const letterboxdRating = movie.ratings?.find(r => r.source === "Letterboxd");

  const ratingBreakdown = [
    { label: "IMDb", icon: <SiImdb className="w-4 h-4 text-[#F5C518]" />, rating: imdbRating, weight: "20%" },
    { label: "Rotten Tomatoes", icon: <SiRottentomatoes className="w-4 h-4 text-[#FA320A]" />, rating: rtRating, weight: "20%" },
    { label: "Metacritic", icon: <BarChart2 className="w-4 h-4 text-[#FFCC34]" />, rating: metaRating, weight: "30%" },
    { label: "Letterboxd", icon: <SiLetterboxd className="w-4 h-4 text-[#00E054]" />, rating: letterboxdRating, weight: "30%" },
  ];

  return (
    <Layout>
      {/* Backdrop — subtle, darkened */}
      {backdropUrl && (
        <div className="relative w-full h-[35vh] overflow-hidden">
          <img
            src={backdropUrl}
            alt={`${movie.title} backdrop`}
            className="w-full h-full object-cover opacity-15"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-background to-transparent" />
        </div>
      )}

      <div className={`container mx-auto px-6 relative z-10 ${backdropUrl ? "-mt-24 md:-mt-40" : "pt-12"} mb-16`}>
        <div className="flex flex-col md:flex-row gap-8 items-start">

          {/* Poster */}
          <div className="w-40 md:w-56 shrink-0 flex flex-col gap-4 mx-auto md:mx-0">
            <div className="aspect-[2/3] rounded overflow-hidden border border-border/30 bg-muted">
              {posterUrl ? (
                <img src={posterUrl} alt={movie.title} className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-card text-muted-foreground text-xs">
                  No Poster
                </div>
              )}
            </div>

            <Button
              onClick={handleWatchlistToggle}
              variant={isSaved ? "secondary" : "default"}
              size="sm"
              className="w-full gap-2 rounded font-medium"
              data-testid="button-watchlist-toggle"
            >
              {isSaved ? (
                <><BookmarkCheck className="w-4 h-4" /> Saved</>
              ) : (
                <><BookmarkPlus className="w-4 h-4" /> Add to Watchlist</>
              )}
            </Button>
          </div>

          {/* Details */}
          <div className="flex-1 flex flex-col gap-6 pt-2 md:pt-20">
            <div>
              <h1 className="font-serif text-4xl md:text-5xl lg:text-6xl font-normal leading-tight tracking-tight text-foreground">
                {movie.title}
              </h1>
              {movie.tagline && (
                <p className="text-base text-muted-foreground italic mt-2">
                  "{movie.tagline}"
                </p>
              )}
            </div>

            {/* Meta row */}
            <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground uppercase tracking-wider">
              {movie.year && (
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" /> {movie.year}
                </div>
              )}
              {movie.runtime && (
                <>
                  <span>&middot;</span>
                  <div className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> {movie.runtime} min
                  </div>
                </>
              )}
              {movie.genres && movie.genres.length > 0 && (
                <>
                  <span>&middot;</span>
                  <span>{movie.genres.join(" / ")}</span>
                </>
              )}
            </div>

            {/* Ratings Dashboard */}
            <div className="border border-border/30 rounded p-4 md:p-6 flex flex-wrap items-center gap-6 md:gap-10">

              {/* CineScore Master Badge */}
              <div className="flex flex-col gap-1 items-start border-r border-border/30 pr-6 md:pr-10">
                <span className="text-xs text-muted-foreground uppercase tracking-[0.15em]">CineScore</span>
                <div className="flex items-center gap-2">
                  <Star className="w-6 h-6 fill-primary text-primary" strokeWidth={0} />
                  <span className="text-3xl font-bold text-primary tabular-nums">
                    {movie.movieMetricScore ? movie.movieMetricScore.toFixed(0) : "—"}
                  </span>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <button className="flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors mt-0.5 cursor-pointer" data-testid="button-score-breakdown">
                      Score breakdown <ChevronDown className="w-3 h-3" />
                    </button>
                  </PopoverTrigger>
                  <PopoverContent className="w-72 p-0 bg-card border border-border/50 shadow-lg" align="start">
                    <div className="px-4 py-3 border-b border-border/30">
                      <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">How CineScore is calculated</p>
                    </div>
                    <div className="p-2 flex flex-col">
                      {ratingBreakdown.map(({ label, icon, rating, weight }) => (
                        <div key={label} className="flex items-center justify-between px-2 py-2 rounded hover:bg-muted/30 transition-colors">
                          <div className="flex items-center gap-2">
                            {icon}
                            <span className="text-sm">{label}</span>
                            <span className="text-xs text-muted-foreground/60">({weight})</span>
                          </div>
                          <span className="text-sm font-semibold text-foreground">
                            {rating?.value ?? <span className="text-muted-foreground/50 text-xs font-normal">N/A</span>}
                          </span>
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-3 bg-muted/20 border-t border-border/30">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-muted-foreground uppercase tracking-wider">Master Score</span>
                        <span className="text-lg font-bold text-primary">
                          {movie.movieMetricScore ? `${movie.movieMetricScore.toFixed(0)}/100` : "—"}
                        </span>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>

              {imdbRating && (
                <div className="flex flex-col gap-1 items-center" data-testid="rating-imdb">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">IMDb</span>
                  <div className="flex items-center gap-1.5">
                    <SiImdb className="w-6 h-6 text-[#F5C518]" />
                    <span className="text-xl font-semibold">{imdbRating.value}</span>
                  </div>
                </div>
              )}

              {rtRating && (
                <div className="flex flex-col gap-1 items-center" data-testid="rating-rt">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Tomatometer</span>
                  <div className="flex items-center gap-1.5">
                    <SiRottentomatoes className="w-6 h-6 text-[#FA320A]" />
                    <span className="text-xl font-semibold">{rtRating.value}</span>
                  </div>
                </div>
              )}

              {metaRating && (
                <div className="flex flex-col gap-1 items-center" data-testid="rating-meta">
                  <span className="text-xs text-muted-foreground uppercase tracking-wider">Metacritic</span>
                  <div className="flex items-center gap-1.5">
                    <BarChart2 className="w-6 h-6 text-[#FFCC34]" />
                    <span className="text-xl font-semibold">{metaRating.value}</span>
                  </div>
                </div>
              )}
            </div>

            {/* Overview */}
            <div className="border-t border-border/20 pt-6">
              <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-3">Overview</h3>
              <p className="text-foreground/80 leading-relaxed text-base font-serif">
                {movie.overview || "No overview available."}
              </p>
            </div>

            {/* Cast & Crew */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 border-t border-border/20 pt-6">
              {movie.director && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-2 flex items-center gap-1.5">
                    <Clapperboard className="w-3.5 h-3.5" strokeWidth={1.5} /> Director
                  </h3>
                  <p className="text-base font-medium">{movie.director}</p>
                </div>
              )}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h3 className="text-xs font-medium uppercase tracking-[0.15em] text-muted-foreground mb-2">
                    Cast
                  </h3>
                  <p className="text-base text-foreground/80 leading-relaxed">
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
        <div className="container mx-auto px-6 py-12 border-t border-border/20">
          <div className="mb-8">
            <p className="text-xs font-medium uppercase tracking-[0.2em] text-muted-foreground mb-1">You might also like</p>
            <h2 className="text-xl font-semibold text-foreground">Similar Films</h2>
          </div>
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
