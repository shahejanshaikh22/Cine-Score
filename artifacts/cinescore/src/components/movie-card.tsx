import { Link } from "wouter";
import { Star } from "lucide-react";
import { MovieSummary } from "@workspace/api-client-react/src/generated/api.schemas";

export function MovieCard({ movie }: { movie: MovieSummary | any }) {
  const posterUrl = movie.posterPath
    ? `https://image.tmdb.org/t/p/w500${movie.posterPath}`
    : null;

  return (
    <Link
      href={`/movie/${movie.tmdbId}`}
      className="group block focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-primary"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded bg-muted border border-border/30 transition-colors group-hover:border-border/70">
        {posterUrl ? (
          <img
            src={posterUrl}
            alt={movie.title}
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/40 text-xs bg-card">
            No Poster
          </div>
        )}

        {movie.voteAverage != null && movie.voteAverage > 0 && (
          <div className="absolute top-2 right-2 bg-black/70 text-primary font-semibold text-xs px-1.5 py-0.5 rounded flex items-center gap-1">
            <Star className="w-2.5 h-2.5 fill-primary" />
            {movie.voteAverage.toFixed(1)}
          </div>
        )}
      </div>

      <div className="mt-2.5 flex flex-col gap-0.5">
        <h3 className="font-medium text-sm line-clamp-1 text-foreground/90 group-hover:text-primary transition-colors" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground/60">
          {movie.year || "—"}
        </p>
      </div>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-2.5">
      <div className="aspect-[2/3] rounded bg-muted/60 animate-pulse" />
      <div className="flex flex-col gap-1.5">
        <div className="h-3.5 bg-muted/60 rounded animate-pulse w-3/4" />
        <div className="h-3 bg-muted/40 rounded animate-pulse w-1/4" />
      </div>
    </div>
  );
}
