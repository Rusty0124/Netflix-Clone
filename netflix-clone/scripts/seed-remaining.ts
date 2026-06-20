import "dotenv/config";
import { Pool } from "pg";
import { nanoid } from "nanoid";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const movies = [
  { title: "Spider-Man: Across the Spider-Verse", year: 2023, description: "Miles Morales catapults across the Multiverse where he encounters a team of Spider-People charged with protecting its very existence." },
  { title: "Grave of the Fireflies", year: 1988, description: "A young boy and his little sister struggle to survive in Japan during World War II after losing their parents to the firebombing of Kobe." },
  { title: "American History X", year: 1998, description: "A former neo-Nazi skinhead tries to prevent his younger brother from going down the same wrong path that he once took." },
  { title: "Hara-Kiri", year: 1962, description: "An elder ronin samurai arrives at a feudal lord's home requesting an honorable place to commit ritual suicide, but his tale reveals a much darker story of injustice." },
  { title: "Dune: Part Two", year: 2024, description: "Paul Atreides unites with the Fremen to seek revenge against those who destroyed his family and must prevent a terrible future only he can foresee." },
  { title: "12th Fail", year: 2023, description: "The inspiring true story of IPS officer Manoj Kumar Sharma who, despite failing his 12th-grade exams, overcomes every obstacle to achieve his dream." },
  { title: "Avengers: Infinity War", year: 2018, description: "The Avengers and their allies must sacrifice all in an attempt to defeat the powerful Thanos before his blitz of devastation ends the universe." },
  { title: "Spider-Man: Into the Spider-Verse", year: 2018, description: "Teen Miles Morales becomes the Spider-Man of his reality and crosses paths with counterparts from other dimensions to stop a threat to all realities." },
  { title: "Avengers: Endgame", year: 2019, description: "After the devastating events of Infinity War, the remaining Avengers assemble once more to undo Thanos's actions and restore balance to the universe." },
  { title: "High and Low", year: 1963, description: "An industrialist's chauffeur's son is kidnapped by mistake and he faces a moral dilemma of whether to pay the ransom and risk financial ruin." },
  { title: "Ikiru", year: 1952, description: "A bureaucrat learns he has terminal cancer and searches for the meaning of his life, ultimately finding purpose in building a playground for children." },
];

async function seed() {
  const client = await pool.connect();
  let inserted = 0;
  let skipped = 0;

  for (const m of movies) {
    const exists = await client.query(
      'SELECT 1 FROM "Movie" WHERE title = $1',
      [m.title],
    );
    if (exists.rowCount && exists.rowCount > 0) {
      skipped++;
      continue;
    }

    await client.query(
      `INSERT INTO "Movie" ("id", "publicId", "title", "description", "releaseYear", "maturityRating", "isTrending", "isFeatured", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
      [crypto.randomUUID(), nanoid(), m.title, m.description, m.year, "NR", false, false],
    );
    inserted++;
  }

  console.log(`Inserted ${inserted}, skipped ${skipped}`);
  client.release();
  await pool.end();
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
