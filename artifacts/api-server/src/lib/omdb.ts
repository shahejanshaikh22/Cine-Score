const OMDB_BASE = "https://www.omdbapi.com";
const OMDB_API_KEY = process.env.OMDB_API_KEY;

if (!OMDB_API_KEY) {
  throw new Error("OMDB_API_KEY environment variable is required");
}

interface OmdbRating {
  Source: string;
  Value: string;
}

interface OmdbResponse {
  Response: string;
  imdbRating?: string;
  Ratings?: OmdbRating[];
  Error?: string;
}

export type RatingSource = {
  source: string;
  value: string | null;
  normalizedScore: number | null;
};

function normalizeImdb(value: string): number | null {
  const n = parseFloat(value);
  if (isNaN(n)) return null;
  return Math.round((n / 10) * 100);
}

function normalizeRt(value: string): number | null {
  const n = parseInt(value.replace("%", ""), 10);
  if (isNaN(n)) return null;
  return n;
}

function normalizeMetacritic(value: string): number | null {
  const n = parseInt(value.split("/")[0], 10);
  if (isNaN(n)) return null;
  return n;
}

export async function getOmdbRatings(imdbId: string): Promise<RatingSource[]> {
  const url = new URL(OMDB_BASE);
  url.searchParams.set("apikey", OMDB_API_KEY!);
  url.searchParams.set("i", imdbId);
  url.searchParams.set("tomatoes", "true");

  let data: OmdbResponse;
  try {
    const res = await fetch(url.toString());
    data = await res.json() as OmdbResponse;
  } catch {
    return [];
  }

  if (data.Response !== "True" || !data.Ratings) return [];

  const ratings: RatingSource[] = [];

  for (const r of data.Ratings) {
    if (r.Source === "Internet Movie Database") {
      ratings.push({
        source: "IMDb",
        value: r.Value,
        normalizedScore: normalizeImdb(r.Value),
      });
    } else if (r.Source === "Rotten Tomatoes") {
      ratings.push({
        source: "Rotten Tomatoes",
        value: r.Value,
        normalizedScore: normalizeRt(r.Value),
      });
    } else if (r.Source === "Metacritic") {
      ratings.push({
        source: "Metacritic",
        value: r.Value,
        normalizedScore: normalizeMetacritic(r.Value),
      });
    }
  }

  return ratings;
}
