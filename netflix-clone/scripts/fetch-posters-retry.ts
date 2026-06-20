import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary";

const retryMap: Record<string, string[]> = {
  "Pulp Fiction": ["Pulp_Fiction", "Pulp_Fiction_(film)"],
  "The Good, the Bad and the Ugly": ["The_Good,_the_Bad_and_the_Ugly", "The_Good_the_Bad_and_the_Ugly"],
  "The Pianist": ["The_Pianist_(2002_film)", "The_Pianist"],
  "Psycho": ["Psycho_(1960_film)", "Psycho_(film)"],
  "Gladiator": ["Gladiator_(2000_film)", "Gladiator_(film)"],
  "The Lion King": ["The_Lion_King", "The_Lion_King_(1994_film)"],
  "The Departed": ["The_Departed", "The_Departed_(film)"],
  "Léon: The Professional": ["L%C3%A9on:_The_Professional", "Leon:_The_Professional", "The_Professional_(1994_film)"],
  "The Prestige": ["The_Prestige_(film)", "The_Prestige"],
  "The Usual Suspects": ["The_Usual_Suspects", "The_Usual_Suspects_(film)"],
  "The Intouchables": ["The_Intouchables", "Intouchables"],
  "Modern Times": ["Modern_Times_(film)", "Modern_Times_(1936_film)"],
  "Once Upon a Time in the West": ["Once_Upon_a_Time_in_the_West", "Once_Upon_a_Time_in_the_West_(film)"],
  "City Lights": ["City_Lights", "City_Lights_(film)"],
  "Memento": ["Memento_(film)", "Memento_(2000_film)"],
  "Raiders of the Lost Ark": ["Raiders_of_the_Lost_Ark", "Indiana_Jones_and_the_Raiders_of_the_Lost_Ark"],
  "The Lives of Others": ["The_Lives_of_Others", "Das_Leben_der_Anderen"],
  "Sunset Boulevard": ["Sunset_Boulevard_(film)", "Sunset_Blvd._(film)"],
  "Paths of Glory": ["Paths_of_Glory", "Paths_of_Glory_(film)"],
  "Witness for the Prosecution": ["Witness_for_the_Prosecution_(1957_film)", "Witness_for_the_Prosecution"],
  "The Shining": ["The_Shining_(film)", "The_Shining_(1980_film)"],
  "The Great Dictator": ["The_Great_Dictator", "The_Great_Dictator_(film)"],
  "Oldboy": ["Oldboy_(2003_film)", "Oldboy"],
  "American Beauty": ["American_Beauty_(film)", "American_Beauty_(1999_film)"],
  "Braveheart": ["Braveheart", "Braveheart_(film)"],
  "Princess Mononoke": ["Princess_Mononoke", "Mononoke-hime"],
  "Once Upon a Time in America": ["Once_Upon_a_Time_in_America", "Once_Upon_a_Time_in_America_(film)"],
  "Singin' in the Rain": ["Singin%27_in_the_Rain", "Singin%27_in_the_Rain_(film)"],
  "Come and See": ["Come_and_See", "Come_and_See_(film)"],
  "Requiem for a Dream": ["Requiem_for_a_Dream", "Requiem_for_a_Dream_(film)"],
  "Toy Story 3": ["Toy_Story_3", "Toy_Story_3_(film)"],
  "Return of the Jedi": ["Return_of_the_Jedi", "Star_Wars:_Return_of_the_Jedi"],
  "The Hunt": ["The_Hunt_(2012_film)", "Jagten"],
  "2001: A Space Odyssey": ["2001:_A_Space_Odyssey_(film)", "2001_A_Space_Odyssey"],
  "Reservoir Dogs": ["Reservoir_Dogs", "Reservoir_Dogs_(film)"],
  "Lawrence of Arabia": ["Lawrence_of_Arabia_(film)", "Lawrence_of_Arabia"],
  "The Apartment": ["The_Apartment", "The_Apartment_(film)"],
  "Spider-Man: Across the Spider-Verse": ["Spider-Man:_Across_the_Spider-Verse", "Spider-Man_Across_the_Spider-Verse"],
  "Grave of the Fireflies": ["Grave_of_the_Fireflies", "Grave_of_the_Fireflies_(film)"],
  "Hara-Kiri": ["Harakiri_(1962_film)", "Seppuku_(film)"],
  "Dune: Part Two": ["Dune:_Part_Two", "Dune_Part_Two"],
  "Spider-Man: Into the Spider-Verse": ["Spider-Man:_Into_the_Spider-Verse", "Spider-Man_Into_the_Spider-Verse"],
  "High and Low": ["High_and_Low_(1963_film)", "High_and_Low_(film)"],
  "Ikiru": ["Ikiru", "Ikiru_(film)"],
  "Fight Club": ["Fight_Club", "Fight_Club_(film)"],
  "Casablanca": ["Casablanca_(film)"],
};

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPoster(slug: string): Promise<string | null> {
  try {
    const res = await fetch(`${WIKI_API}/${slug}`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.originalimage?.source || data.thumbnail?.source || null;
  } catch {
    return null;
  }
}

async function main() {
  const client = await pool.connect();
  const { rows: movies } = await client.query(
    'SELECT id, title FROM "Movie" WHERE "thumbnailUrl" IS NULL',
  );

  console.log(`${movies.length} movies still without thumbnails`);
  let updated = 0;
  let stillFailed: string[] = [];

  for (const movie of movies) {
    const slugs = retryMap[movie.title] || [movie.title.replace(/ /g, "_")];
    let found = false;

    for (const slug of slugs) {
      const url = await fetchPoster(slug);
      if (url) {
        await client.query('UPDATE "Movie" SET "thumbnailUrl" = $1 WHERE id = $2', [url, movie.id]);
        updated++;
        console.log(`  ✓ ${movie.title}`);
        found = true;
        break;
      }
      await sleep(100);
    }

    if (!found) {
      stillFailed.push(movie.title);
      console.log(`  ✗ ${movie.title}`);
    }
  }

  console.log(`\nUpdated ${updated}/${movies.length}`);
  if (stillFailed.length > 0) {
    console.log(`Still missing: ${stillFailed.join(", ")}`);
  }

  client.release();
  await pool.end();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
