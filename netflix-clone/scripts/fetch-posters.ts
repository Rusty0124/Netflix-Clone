import "dotenv/config";
import { Pool } from "pg";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const WIKI_API = "https://en.wikipedia.org/api/rest_v1/page/summary";

const titleToWiki: Record<string, string> = {
  "The Shawshank Redemption": "The_Shawshank_Redemption",
  "The Godfather": "The_Godfather",
  "The Dark Knight": "The_Dark_Knight",
  "The Godfather Part II": "The_Godfather_Part_II",
  "12 Angry Men": "12_Angry_Men_(1957_film)",
  "The Lord of the Rings: The Return of the King": "The_Lord_of_the_Rings:_The_Return_of_the_King",
  "Schindler's List": "Schindler%27s_List",
  "Pulp Fiction": "Pulp_Fiction",
  "The Lord of the Rings: The Fellowship of the Ring": "The_Lord_of_the_Rings:_The_Fellowship_of_the_Ring",
  "The Good, the Bad and the Ugly": "The_Good,_the_Bad_and_the_Ugly",
  "Forrest Gump": "Forrest_Gump",
  "The Lord of the Rings: The Two Towers": "The_Lord_of_the_Rings:_The_Two_Towers",
  "Fight Club": "Fight_Club",
  "Inception": "Inception",
  "The Empire Strikes Back": "The_Empire_Strikes_Back",
  "The Matrix": "The_Matrix",
  "GoodFellas": "Goodfellas",
  "One Flew Over the Cuckoo's Nest": "One_Flew_Over_the_Cuckoo%27s_Nest_(film)",
  "Interstellar": "Interstellar_(film)",
  "Se7en": "Seven_(1995_film)",
  "It's a Wonderful Life": "It%27s_a_Wonderful_Life",
  "Seven Samurai": "Seven_Samurai",
  "The Silence of the Lambs": "The_Silence_of_the_Lambs_(film)",
  "Saving Private Ryan": "Saving_Private_Ryan",
  "City of God": "City_of_God_(2002_film)",
  "Life Is Beautiful": "Life_Is_Beautiful",
  "The Green Mile": "The_Green_Mile_(film)",
  "Terminator 2: Judgment Day": "Terminator_2:_Judgment_Day",
  "Star Wars": "Star_Wars_(film)",
  "Back to the Future": "Back_to_the_Future",
  "Spirited Away": "Spirited_Away",
  "The Pianist": "The_Pianist_(2002_film)",
  "Parasite": "Parasite_(2019_film)",
  "Psycho": "Psycho_(1960_film)",
  "Gladiator": "Gladiator_(2000_film)",
  "The Lion King": "The_Lion_King",
  "The Departed": "The_Departed",
  "Whiplash": "Whiplash_(2014_film)",
  "Léon: The Professional": "L%C3%A9on:_The_Professional",
  "The Prestige": "The_Prestige_(film)",
  "Casablanca": "Casablanca_(film)",
  "The Usual Suspects": "The_Usual_Suspects",
  "The Intouchables": "The_Intouchables",
  "Cinema Paradiso": "Cinema_Paradiso",
  "Modern Times": "Modern_Times_(film)",
  "Alien": "Alien_(film)",
  "Rear Window": "Rear_Window",
  "Once Upon a Time in the West": "Once_Upon_a_Time_in_the_West",
  "Django Unchained": "Django_Unchained",
  "City Lights": "City_Lights",
  "Apocalypse Now": "Apocalypse_Now",
  "Memento": "Memento_(film)",
  "WALL·E": "WALL-E",
  "Raiders of the Lost Ark": "Raiders_of_the_Lost_Ark",
  "The Lives of Others": "The_Lives_of_Others",
  "Sunset Boulevard": "Sunset_Boulevard_(film)",
  "Paths of Glory": "Paths_of_Glory",
  "Witness for the Prosecution": "Witness_for_the_Prosecution_(1957_film)",
  "The Shining": "The_Shining_(film)",
  "The Great Dictator": "The_Great_Dictator",
  "Aliens": "Aliens_(film)",
  "Inglourious Basterds": "Inglourious_Basterds",
  "The Dark Knight Rises": "The_Dark_Knight_Rises",
  "Coco": "Coco_(2017_film)",
  "Amadeus": "Amadeus_(film)",
  "Toy Story": "Toy_Story",
  "Dr. Strangelove": "Dr._Strangelove",
  "Oldboy": "Oldboy_(2003_film)",
  "American Beauty": "American_Beauty_(film)",
  "Das Boot": "Das_Boot",
  "Braveheart": "Braveheart",
  "Good Will Hunting": "Good_Will_Hunting",
  "Princess Mononoke": "Princess_Mononoke",
  "Your Name": "Your_Name",
  "Joker": "Joker_(2019_film)",
  "3 Idiots": "3_Idiots",
  "Once Upon a Time in America": "Once_Upon_a_Time_in_America",
  "Singin' in the Rain": "Singin%27_in_the_Rain",
  "Capernaum": "Capernaum_(film)",
  "Come and See": "Come_and_See",
  "Requiem for a Dream": "Requiem_for_a_Dream",
  "Toy Story 3": "Toy_Story_3",
  "Return of the Jedi": "Return_of_the_Jedi",
  "The Hunt": "The_Hunt_(2012_film)",
  "Eternal Sunshine of the Spotless Mind": "Eternal_Sunshine_of_the_Spotless_Mind",
  "2001: A Space Odyssey": "2001:_A_Space_Odyssey_(film)",
  "Reservoir Dogs": "Reservoir_Dogs",
  "Lawrence of Arabia": "Lawrence_of_Arabia_(film)",
  "The Apartment": "The_Apartment",
  "Spider-Man: Across the Spider-Verse": "Spider-Man:_Across_the_Spider-Verse",
  "Grave of the Fireflies": "Grave_of_the_Fireflies",
  "American History X": "American_History_X",
  "Hara-Kiri": "Harakiri_(1962_film)",
  "Dune: Part Two": "Dune:_Part_Two",
  "12th Fail": "12th_Fail",
  "Avengers: Infinity War": "Avengers:_Infinity_War",
  "Spider-Man: Into the Spider-Verse": "Spider-Man:_Into_the_Spider-Verse",
  "Avengers: Endgame": "Avengers:_Endgame",
  "High and Low": "High_and_Low_(1963_film)",
  "Ikiru": "Ikiru",
};

async function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

async function fetchPoster(wikiSlug: string): Promise<string | null> {
  try {
    const res = await fetch(`${WIKI_API}/${wikiSlug}`);
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

  console.log(`Found ${movies.length} movies without thumbnails`);

  let updated = 0;
  let failed: string[] = [];

  for (const movie of movies) {
    const wikiSlug = titleToWiki[movie.title];

    if (!wikiSlug) {
      // Try auto-generating the slug
      const autoSlug = movie.title.replace(/ /g, "_").replace(/'/g, "%27");
      const url = await fetchPoster(autoSlug);
      if (url) {
        await client.query('UPDATE "Movie" SET "thumbnailUrl" = $1 WHERE id = $2', [url, movie.id]);
        updated++;
        console.log(`  ✓ ${movie.title} (auto-slug)`);
      } else {
        failed.push(movie.title);
        console.log(`  ✗ ${movie.title} (no mapping)`);
      }
      await sleep(100);
      continue;
    }

    const url = await fetchPoster(wikiSlug);
    if (url) {
      await client.query('UPDATE "Movie" SET "thumbnailUrl" = $1 WHERE id = $2', [url, movie.id]);
      updated++;
      console.log(`  ✓ ${movie.title}`);
    } else {
      failed.push(movie.title);
      console.log(`  ✗ ${movie.title}`);
    }

    await sleep(100);
  }

  console.log(`\nDone! Updated ${updated}/${movies.length}`);
  if (failed.length > 0) {
    console.log(`Failed: ${failed.join(", ")}`);
  }

  client.release();
  await pool.end();
}

main().catch((err) => {
  console.error("Failed:", err);
  process.exit(1);
});
