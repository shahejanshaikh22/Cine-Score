import { Router, type IRouter } from "express";
import {
  SearchMoviesQueryParams,
  GetMovieDetailsParams,
  GetMovieRecommendationsParams,
} from "@workspace/api-zod";
import { searchMovies, getTrending, getMovieDetails, getRecommendations } from "../lib/tmdb";
import { getOmdbRatings } from "../lib/omdb";
import { calculateMovieMetric } from "../lib/moviemetric";

const router: IRouter = Router();

router.get("/movies/search", async (req, res): Promise<void> => {
  const parsed = SearchMoviesQueryParams.safeParse(req.query);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { q, page } = parsed.data;
  if (!q || !q.trim()) {
    res.status(400).json({ error: "Query parameter 'q' is required" });
    return;
  }

  try {
    const result = await searchMovies(q, page ?? 1);
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to search movies");
    res.status(500).json({ error: "Failed to search movies" });
  }
});

router.get("/movies/trending", async (req, res): Promise<void> => {
  try {
    const result = await getTrending();
    res.json(result);
  } catch (err) {
    req.log.error({ err }, "Failed to fetch trending movies");
    res.status(500).json({ error: "Failed to fetch trending movies" });
  }
});

router.get("/movies/:tmdbId", async (req, res): Promise<void> => {
  const parsed = GetMovieDetailsParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { tmdbId } = parsed.data;

  try {
    const movie = await getMovieDetails(tmdbId);

    let ratings: Awaited<ReturnType<typeof getOmdbRatings>> = [];
    if (movie.imdbId) {
      try {
        ratings = await getOmdbRatings(movie.imdbId);
      } catch (err) {
        req.log.warn({ err, tmdbId }, "Failed to fetch OMDb ratings");
      }
    }

    const movieMetricScore = calculateMovieMetric(ratings, movie.voteAverage);

    res.json({ ...movie, ratings, movieMetricScore });
  } catch (err) {
    req.log.error({ err, tmdbId }, "Failed to fetch movie details");
    res.status(404).json({ error: "Movie not found" });
  }
});

router.get("/movies/:tmdbId/recommendations", async (req, res): Promise<void> => {
  const parsed = GetMovieRecommendationsParams.safeParse(req.params);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.message });
    return;
  }

  const { tmdbId } = parsed.data;

  try {
    const results = await getRecommendations(tmdbId);
    res.json({ results });
  } catch (err) {
    req.log.error({ err, tmdbId }, "Failed to fetch recommendations");
    res.status(404).json({ error: "Movie not found" });
  }
});

export default router;
