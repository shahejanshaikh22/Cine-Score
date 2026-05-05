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
      className="group block flex-col gap-3 rounded-lg overflow-hidden focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary"
    >
      <div className="relative aspect-[2/3] overflow-hidden rounded-lg bg-muted border border-border/50 transition-colors group-hover:border-primary/50">
        {posterUrl ? (
          <img 
            src={posterUrl} 
            alt={movie.title} 
            className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            loading="lazy"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-muted-foreground/50 bg-card">
            No Poster
          </div>
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/0 to-black/0 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
        
        {movie.voteAverage != null && movie.voteAverage > 0 && (
          <div className="absolute top-2 right-2 bg-black/60 backdrop-blur-md text-primary font-bold text-xs px-2 py-1 rounded-md flex items-center gap-1 border border-primary/20 shadow-xl">
            <Star className="w-3 h-3 fill-primary" />
            {movie.voteAverage.toFixed(1)}
          </div>
        )}
      </div>
      
      <div className="mt-3 flex flex-col gap-1">
        <h3 className="font-semibold text-sm line-clamp-1 group-hover:text-primary transition-colors" title={movie.title}>
          {movie.title}
        </h3>
        <p className="text-xs text-muted-foreground">
          {movie.year || "Unknown Year"}
        </p>
      </div>
    </Link>
  );
}

export function MovieCardSkeleton() {
  return (
    <div className="flex flex-col gap-3">
      <div className="aspect-[2/3] rounded-lg bg-muted animate-pulse" />
      <div className="flex flex-col gap-2">
        <div className="h-4 bg-muted rounded animate-pulse w-3/4" />
        <div className="h-3 bg-muted rounded animate-pulse w-1/4" />
      </div>
    </div>
  );
}
