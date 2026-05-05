import { useState, useEffect, useCallback } from "react";

export type WatchlistEntry = {
  tmdbId: number;
  title: string;
  year: string | null;
  posterPath: string | null;
  voteAverage: number | null;
};

const WATCHLIST_KEY = "cinescore_watchlist";

export function useWatchlist() {
  const [watchlist, setWatchlist] = useState<WatchlistEntry[]>(() => {
    if (typeof window === "undefined") return [];
    const stored = localStorage.getItem(WATCHLIST_KEY);
    return stored ? JSON.parse(stored) : [];
  });

  useEffect(() => {
    localStorage.setItem(WATCHLIST_KEY, JSON.stringify(watchlist));
  }, [watchlist]);

  const addToWatchlist = useCallback((movie: WatchlistEntry) => {
    setWatchlist((prev) => {
      if (prev.some((m) => m.tmdbId === movie.tmdbId)) return prev;
      return [...prev, movie];
    });
  }, []);

  const removeFromWatchlist = useCallback((tmdbId: number) => {
    setWatchlist((prev) => prev.filter((m) => m.tmdbId !== tmdbId));
  }, []);

  const isInWatchlist = useCallback(
    (tmdbId: number) => {
      return watchlist.some((m) => m.tmdbId === tmdbId);
    },
    [watchlist]
  );

  return {
    watchlist,
    addToWatchlist,
    removeFromWatchlist,
    isInWatchlist,
  };
}
