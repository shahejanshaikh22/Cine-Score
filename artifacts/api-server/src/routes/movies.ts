import { Router, type IRouter } from "express";
import {
  SearchMoviesQueryParams,
  GetMovieDetailsParams,
  GetMovieRecommendationsParams,
} from "@workspace/api-zod";
import { searchMovies, getTrending, getMovieDetails, getRecommendations } from "../lib/tmdb";
import { getOmdbRatings } from "../lib/omdb";
import { calculateCineScore } from "../lib/moviemetric";
import { openai } from "@workspace/integrations-openai-ai-server";

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

    // Add TMDB community score as Letterboxd proxy (both are community rating systems)
    if (movie.voteAverage != null && movie.voteAverage > 0) {
      const letterboxdProxy = {
        source: "Letterboxd",
        value: `${movie.voteAverage.toFixed(1)}/10`,
        normalizedScore: Math.round((movie.voteAverage / 10) * 100),
      };
      ratings = [...ratings, letterboxdProxy];
    }

    const movieMetricScore = calculateCineScore(ratings, movie.voteAverage);

    res.json({ ...movie, ratings, movieMetricScore });
  } catch (err) {
    req.log.error({ err, tmdbId }, "Failed to fetch movie details");
    res.status(404).json({ error: "Movie not found" });
  }
});

router.get("/movies/:tmdbId/review", async (req, res): Promise<void> => {
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
      } catch {
        // ratings optional for review
      }
    }

    const ratingSummary = ratings.length > 0
      ? ratings.map(r => `${r.source}: ${r.value}`).join(", ")
      : "ratings unavailable";

    const prompt = `You are a concise, sharp film critic writing for a premium cinema publication. Write a critical analysis of "${movie.title}" (${movie.year ?? "unknown year"}).

Film details:
- Director: ${movie.director ?? "unknown"}
- Genres: ${movie.genres?.join(", ") ?? "unknown"}
- Cast: ${movie.cast?.slice(0, 4).join(", ") ?? "unknown"}
- Runtime: ${movie.runtime ? `${movie.runtime} minutes` : "unknown"}
- Ratings: ${ratingSummary}
- Plot: ${movie.overview ?? "no overview available"}

Write a 3–4 sentence critical analysis. Be specific about what the film does well or poorly. Reference the ratings context. Use precise, evocative language. Do not use generic phrases like "a must-watch" or "this film is a masterpiece". Do not start with the film title. Write in third person.`;

    const completion = await openai.chat.completions.create({
      model: "gpt-5.1",
      max_completion_tokens: 300,
      messages: [{ role: "user", content: prompt }],
    });

    const review = completion.choices[0]?.message?.content ?? "Unable to generate analysis.";

    res.json({ review, generatedAt: new Date().toISOString() });
  } catch (err) {
    req.log.error({ err, tmdbId }, "Failed to generate movie review");
    res.status(500).json({ error: "Failed to generate review" });
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
