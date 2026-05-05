import type { RatingSource } from "./omdb";

export function calculateCineScore(
  ratings: RatingSource[],
  tmdbScore: number | null
): number | null {
  const findScore = (source: string) =>
    ratings.find((r) => r.source === source)?.normalizedScore ?? null;

  const imdb = findScore("IMDb");
  const rt = findScore("Rotten Tomatoes");
  const meta = findScore("Metacritic");
  const letterboxd = tmdbScore != null ? Math.round((tmdbScore / 10) * 100) : null;

  let weightedSum = 0;
  let totalWeight = 0;

  const addScore = (score: number | null, weight: number) => {
    if (score !== null) {
      weightedSum += score * weight;
      totalWeight += weight;
    }
  };

  addScore(imdb, 0.2);
  addScore(rt, 0.2);
  addScore(meta, 0.3);
  addScore(letterboxd, 0.3);

  if (totalWeight === 0) return null;

  const score = weightedSum / totalWeight;
  return Math.round(score * 10) / 10;
}
