import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const featured = [
  { title: "Inception", trailer: "https://www.youtube.com/embed/YoHD9XEInc0?autoplay=1&mute=1&controls=0&loop=1&playlist=YoHD9XEInc0&showinfo=0&rel=0" },
  { title: "Interstellar", trailer: "https://www.youtube.com/embed/zSWdZVtXT7E?autoplay=1&mute=1&controls=0&loop=1&playlist=zSWdZVtXT7E&showinfo=0&rel=0" },
  { title: "The Dark Knight", trailer: "https://www.youtube.com/embed/EXeTwQWrcwY?autoplay=1&mute=1&controls=0&loop=1&playlist=EXeTwQWrcwY&showinfo=0&rel=0" },
  { title: "Parasite", trailer: "https://www.youtube.com/embed/5xH0HfJHsaY?autoplay=1&mute=1&controls=0&loop=1&playlist=5xH0HfJHsaY&showinfo=0&rel=0" },
  { title: "Dune: Part Two", trailer: "https://www.youtube.com/embed/Way9Dexny3w?autoplay=1&mute=1&controls=0&loop=1&playlist=Way9Dexny3w&showinfo=0&rel=0" },
];

const recommended = [
  "Inception", "Interstellar", "The Dark Knight", "Pulp Fiction", "Fight Club",
  "The Matrix", "Parasite", "Whiplash", "The Prestige", "Django Unchained",
  "Inglourious Basterds", "Joker", "Gladiator", "The Departed",
  "Eternal Sunshine of the Spotless Mind", "Memento", "Se7en",
  "Good Will Hunting", "The Shawshank Redemption", "Forrest Gump",
];

async function main() {
  const client = await pool.connect();

  // Set featured movies with trailers
  for (const f of featured) {
    const res = await client.query(
      'UPDATE "Movie" SET "isFeatured" = true, "trailerUrl" = $1 WHERE title = $2 RETURNING title',
      [f.trailer, f.title],
    );
    console.log(res.rowCount ? `✓ Featured: ${f.title}` : `✗ Not found: ${f.title}`);
  }

  // Set recommended (trending) movies
  for (const title of recommended) {
    const res = await client.query(
      'UPDATE "Movie" SET "isTrending" = true WHERE title = $1 RETURNING title',
      [title],
    );
    console.log(res.rowCount ? `✓ Recommended: ${title}` : `✗ Not found: ${title}`);
  }

  console.log("\nDone!");
  client.release();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
