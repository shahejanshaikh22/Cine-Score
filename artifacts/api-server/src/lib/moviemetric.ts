import type { RatingSource } from "./omdb";

const WEIGHTS: Record<string, number> = {
  "IMDb": 0.45,
  "Rotten Tomatoes": 0.35,
  "Metacritic": 0.20,
};

export function calculateMovieMetric(
  ratings: RatingSource[],
  tmdbScore: number | null
): number | null {
  let weightedSum = 0;
  let totalWeight = 0;

  for (const rating of ratings) {
    const weight = WEIGHTS[rating.source];
    if (weight && rating.normalizedScore !== null) {
      weightedSum += rating.normalizedScore * weight;
      totalWeight += weight;
    }
  }

  if (tmdbScore !== null && tmdbScore > 0) {
    const tmdbNormalized = Math.round((tmdbScore / 10) * 100);
    const tmdbWeight = totalWeight > 0 ? 0.1 : 1.0;
    weightedSum += tmdbNormalized * tmdbWeight;
    totalWeight += tmdbWeight;
  }

  if (totalWeight === 0) return null;

  const score = weightedSum / totalWeight;
  return Math.round(score * 10) / 10;
}
