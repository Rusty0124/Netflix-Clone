import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const TMDB_KEY = "293b074fe7cab70826e08951d4885d68";
const TMDB_SEARCH = "https://api.themoviedb.org/3/search/movie";
const TMDB_IMG = "https://image.tmdb.org/t/p/w500";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function searchPoster(title: string, year?: number): Promise<string | null> {
  const params = new URLSearchParams({
    api_key: TMDB_KEY,
    query: title,
  });
  if (year) params.set("year", String(year));

  const res = await fetch(`${TMDB_SEARCH}?${params}`);
  if (!res.ok) return null;

  const data = await res.json();
  const movie = data.results?.[0];
  if (!movie?.poster_path) return null;

  return `${TMDB_IMG}${movie.poster_path}`;
}

async function main() {
  const client = await pool.connect();
  const { rows: movies } = await client.query(
    'SELECT id, title, "releaseYear" FROM "Movie" WHERE "thumbnailUrl" IS NULL',
  );

  console.log(`${movies.length} movies without thumbnails\n`);
  let updated = 0;
  let failed: string[] = [];

  for (const movie of movies) {
    const url = await searchPoster(movie.title, movie.releaseYear);
    if (url) {
      await client.query('UPDATE "Movie" SET "thumbnailUrl" = $1 WHERE id = $2', [url, movie.id]);
      updated++;
      console.log(`  ✓ ${movie.title}`);
    } else {
      failed.push(movie.title);
      console.log(`  ✗ ${movie.title}`);
    }
    await sleep(250);
  }

  console.log(`\nUpdated ${updated}/${movies.length}`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.join(", ")}`);
  }

  client.release();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
