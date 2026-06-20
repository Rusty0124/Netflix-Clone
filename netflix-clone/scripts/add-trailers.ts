import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const TMDB_KEY = "293b074fe7cab70826e08951d4885d68";

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function findTrailer(title: string, year?: number): Promise<string | null> {
  const params = new URLSearchParams({
    api_key: TMDB_KEY,
    query: title,
  });
  if (year) params.set("year", String(year));

  const searchRes = await fetch(`https://api.themoviedb.org/3/search/movie?${params}`);
  if (!searchRes.ok) return null;

  const searchData = await searchRes.json();
  const tmdbId = searchData.results?.[0]?.id;
  if (!tmdbId) return null;

  const videosRes = await fetch(
    `https://api.themoviedb.org/3/movie/${tmdbId}/videos?api_key=${TMDB_KEY}`,
  );
  if (!videosRes.ok) return null;

  const videosData = await videosRes.json();
  const trailer = videosData.results?.find(
    (v: { type: string; site: string }) =>
      v.type === "Trailer" && v.site === "YouTube",
  );

  if (!trailer) {
    const teaser = videosData.results?.find(
      (v: { site: string }) => v.site === "YouTube",
    );
    if (!teaser) return null;
    return `https://www.youtube.com/embed/${teaser.key}`;
  }

  return `https://www.youtube.com/embed/${trailer.key}`;
}

async function main() {
  const client = await pool.connect();
  const { rows: movies } = await client.query(
    'SELECT id, title, "releaseYear" FROM "Movie" WHERE "trailerUrl" IS NULL',
  );

  console.log(`${movies.length} movies without trailers\n`);
  let updated = 0;
  let failed: string[] = [];

  for (const movie of movies) {
    const url = await findTrailer(movie.title, movie.releaseYear);
    if (url) {
      await client.query('UPDATE "Movie" SET "trailerUrl" = $1 WHERE id = $2', [url, movie.id]);
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
    console.log(`No trailer: ${failed.join(", ")}`);
  }

  client.release();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
