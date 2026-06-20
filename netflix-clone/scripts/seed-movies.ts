import "dotenv/config";
import { Pool } from "pg";
import { nanoid } from "nanoid";

const pool = new Pool({ connectionString: process.env.DATABASE_URL });

const movies = [
  { title: "The Shawshank Redemption", year: 1994, description: "A banker convicted of uxoricide forms a life-changing friendship with a fellow inmate as they find solace and eventual redemption through acts of common decency over two decades in prison." },
  { title: "The Godfather", year: 1972, description: "The aging patriarch of an organized crime dynasty transfers control of his clandestine empire to his reluctant youngest son, who transforms from a reluctant outsider to a ruthless mafia boss." },
  { title: "The Dark Knight", year: 2008, description: "When the menace known as the Joker wreaks havoc on Gotham, Batman must accept one of the greatest psychological and physical tests of his ability to fight injustice." },
  { title: "The Godfather Part II", year: 1974, description: "The early life and career of Vito Corleone in 1920s New York is portrayed while his son Michael expands and tightens his grip on the family crime syndicate." },
  { title: "12 Angry Men", year: 1957, description: "The jury in a New York City murder trial is frustrated by a single holdout juror who forces his colleagues to slowly reconsider the evidence." },
  { title: "The Lord of the Rings: The Return of the King", year: 2003, description: "Gandalf and Aragorn lead the World of Men against Sauron's army to draw his gaze from Frodo and Sam as they approach Mount Doom with the One Ring." },
  { title: "Schindler's List", year: 1993, description: "In German-occupied Poland during World War II, industrialist Oskar Schindler gradually becomes concerned for his Jewish workforce after witnessing their persecution by the Nazis." },
  { title: "Pulp Fiction", year: 1994, description: "The lives of two mob hitmen, a boxer, a gangster and his wife, and a pair of diner bandits intertwine in four tales of violence and redemption." },
  { title: "The Lord of the Rings: The Fellowship of the Ring", year: 2001, description: "A meek Hobbit from the Shire and eight companions set out on a journey to destroy the powerful One Ring and save Middle-earth from the Dark Lord Sauron." },
  { title: "The Good, the Bad and the Ugly", year: 1966, description: "A bounty hunting scam joins two men in an uneasy alliance against a third in a race to find a fortune in gold buried in a remote cemetery." },
  { title: "Forrest Gump", year: 1994, description: "The presidencies of Kennedy and Johnson, the Vietnam War, and other historical events unfold from the perspective of an Alabama man with a low IQ but good intentions." },
  { title: "The Lord of the Rings: The Two Towers", year: 2002, description: "While Frodo and Sam edge closer to Mordor with the help of the shifty Gollum, the divided fellowship makes a stand against Sauron's new ally, Saruman." },
  { title: "Fight Club", year: 1999, description: "An insomniac office worker and a devil-may-care soap maker form an underground fight club that evolves into much more than either of them ever imagined." },
  { title: "Inception", year: 2010, description: "A thief who steals corporate secrets through dream-sharing technology is given the inverse task of planting an idea into the mind of a CEO." },
  { title: "The Empire Strikes Back", year: 1980, description: "After the Rebels are overpowered by the Empire, Luke Skywalker begins his Jedi training with Yoda, while his friends are pursued across the galaxy by Darth Vader." },
  { title: "The Matrix", year: 1999, description: "When a beautiful stranger leads computer hacker Neo to a forbidding underworld, he discovers the shocking truth — the life he knows is the elaborate deception of an evil cyber-intelligence." },
  { title: "GoodFellas", year: 1990, description: "The story of Henry Hill and his life in the mob, covering his relationship with his wife Karen and his mob partners Jimmy Conway and Tommy DeVito." },
  { title: "One Flew Over the Cuckoo's Nest", year: 1975, description: "In a mental institution, a rebellious rogue conman rallies the patients together to take on the oppressive head nurse and the system she represents." },
  { title: "Interstellar", year: 2014, description: "When Earth becomes uninhabitable in the future, a farmer and ex-NASA pilot is tasked with piloting a spacecraft to find a new home for humanity among the stars." },
  { title: "Se7en", year: 1995, description: "Two detectives, a rookie and a veteran, hunt a serial killer who uses the seven deadly sins as his motives, leading to a devastating and unforgettable conclusion." },
  { title: "It's a Wonderful Life", year: 1946, description: "An angel is sent from Heaven to help a desperately frustrated businessman by showing him what life would have been like if he had never existed." },
  { title: "Seven Samurai", year: 1954, description: "A poor village under attack by bandits recruits seven unemployed samurai to help them defend themselves in this epic tale of courage and sacrifice." },
  { title: "The Silence of the Lambs", year: 1991, description: "A young FBI cadet must receive the help of an incarcerated and manipulative cannibal killer to help catch another serial killer who skins his victims." },
  { title: "Saving Private Ryan", year: 1998, description: "Following the Normandy landings, a group of U.S. soldiers go behind enemy lines to retrieve a paratrooper whose brothers have been killed in action." },
  { title: "City of God", year: 2002, description: "In the slums of Rio, two kids' paths diverge as one struggles to become a photographer and the other a drug dealer, painting a vivid portrait of urban violence." },
  { title: "Life Is Beautiful", year: 1997, description: "When an open-minded Jewish waiter and his son become victims of the Holocaust, he uses humor and imagination to shield his son from the horrors of a Nazi concentration camp." },
  { title: "The Green Mile", year: 1999, description: "The lives of guards on Death Row are affected by one of their charges: a gentle giant with a mysterious gift that changes everyone around him." },
  { title: "Terminator 2: Judgment Day", year: 1991, description: "A cyborg, identical to the one who failed to kill Sarah Connor, is sent back in time to protect her ten-year-old son from a more advanced and deadly Terminator." },
  { title: "Star Wars", year: 1977, description: "Luke Skywalker joins forces with a Jedi Knight, a cocky pilot, a Wookiee, and two droids to save the galaxy from the Empire's world-destroying battle station." },
  { title: "Back to the Future", year: 1985, description: "Marty McFly, a 17-year-old high school student, is accidentally sent 30 years into the past in a time-traveling DeLorean invented by his close friend, Doc Brown." },
  { title: "Spirited Away", year: 2001, description: "During her family's move to the suburbs, a sullen 10-year-old girl wanders into a world ruled by gods, witches, and spirits, where humans are changed into beasts." },
  { title: "The Pianist", year: 2002, description: "A Polish Jewish musician struggles to survive the destruction of the Warsaw ghetto of World War II, hiding and evading capture while the city crumbles around him." },
  { title: "Parasite", year: 2019, description: "Greed and class discrimination threaten the newly formed symbiotic relationship between the wealthy Park family and the destitute Kim clan in this darkly comic thriller." },
  { title: "Psycho", year: 1960, description: "A secretary on the run checks into a secluded motel run by a young man under the domination of his mother, leading to one of cinema's most shocking twists." },
  { title: "Gladiator", year: 2000, description: "A former Roman General sets out to exact vengeance against the corrupt emperor who murdered his family and sent him into slavery as a gladiator." },
  { title: "The Lion King", year: 1994, description: "A young lion prince flees his kingdom only to learn the true meaning of responsibility and bravery, returning to reclaim his rightful throne." },
  { title: "The Departed", year: 2006, description: "An undercover cop and a mole in the police attempt to identify each other while infiltrating an Irish gang in South Boston in this tense crime thriller." },
  { title: "Whiplash", year: 2014, description: "A promising young drummer enrolls at a cutthroat music conservatory where his dreams of greatness are mentored by an instructor who will stop at nothing to realize a student's potential." },
  { title: "Léon: The Professional", year: 1994, description: "A professional assassin rescues a 12-year-old girl whose parents are killed in a DEA raid, and reluctantly becomes her mentor and protector." },
  { title: "The Prestige", year: 2006, description: "After a tragic accident, two stage magicians in 1890s London engage in a bitter battle to create the ultimate illusion while sacrificing everything they have." },
  { title: "Casablanca", year: 1942, description: "A cynical expatriate American nightclub owner struggles with whether to help his former lover and her fugitive husband escape the Nazis in French Morocco." },
  { title: "The Usual Suspects", year: 1995, description: "A sole survivor tells of the twisty events leading up to a horrific gun battle on a boat, revealing the identity of the mastermind behind a legendary crime lord." },
  { title: "The Intouchables", year: 2011, description: "After he becomes a quadriplegic from a paragliding accident, an aristocrat hires a young man from the projects to be his caregiver, forming an unlikely friendship." },
  { title: "Cinema Paradiso", year: 1988, description: "A filmmaker recalls his childhood when he fell in love with the movies at his village's cinema and formed a deep friendship with the theater's projectionist." },
  { title: "Modern Times", year: 1936, description: "The Tramp struggles to live in modern industrial society with the help of a young homeless woman in Charlie Chaplin's satirical masterpiece." },
  { title: "Alien", year: 1979, description: "The crew of a commercial spacecraft encounters a deadly lifeform after investigating an unknown transmission, leading to a terrifying fight for survival." },
  { title: "Rear Window", year: 1954, description: "A photographer confined to a wheelchair in his apartment spies on his neighbors and becomes convinced one of them has committed murder." },
  { title: "Once Upon a Time in the West", year: 1968, description: "A mysterious stranger with a harmonica joins forces with a notorious desperado to protect a beautiful widow from a ruthless assassin working for the railroad." },
  { title: "Django Unchained", year: 2012, description: "With the help of a German bounty-hunter, a freed slave sets out to rescue his wife from a brutal plantation owner in the Antebellum South." },
  { title: "City Lights", year: 1931, description: "With the aid of a wealthy erratic tippler, a tramp who has fallen in love with a blind flower girl accumulates money to pay for an operation to restore her sight." },
  { title: "Apocalypse Now", year: 1979, description: "A U.S. Army officer serving in Vietnam is tasked with assassinating a renegade Special Forces colonel who has set himself up as a god among a local tribe." },
  { title: "Memento", year: 2000, description: "A man with short-term memory loss attempts to track down his wife's murderer, using notes and tattoos to piece together fragmented clues." },
  { title: "WALL·E", year: 2008, description: "In the distant future, a small waste-collecting robot inadvertently embarks on a space journey that will ultimately decide the fate of mankind." },
  { title: "Raiders of the Lost Ark", year: 1981, description: "Archaeologist and adventurer Indiana Jones races against Nazis to find the legendary Ark of the Covenant before it can be used as a weapon of unimaginable power." },
  { title: "The Lives of Others", year: 2006, description: "In 1984 East Berlin, a Stasi agent is assigned to surveil a playwright and his lover, but gradually becomes drawn into their lives and begins to question his loyalties." },
  { title: "Sunset Boulevard", year: 1950, description: "A screenwriter develops a dangerous relationship with a faded film star who refuses to accept that her glory days are behind her in this noir classic." },
  { title: "Paths of Glory", year: 1957, description: "After a failed attack on a German position, a commanding officer orders three soldiers to be tried for cowardice, and their defense attorney fights the injustice." },
  { title: "Witness for the Prosecution", year: 1957, description: "A veteran British barrister takes on the defense of a man accused of murder, but the case takes unexpected turns when the defendant's wife testifies against him." },
  { title: "The Shining", year: 1980, description: "A family heads to an isolated hotel for the winter where a sinister presence influences the father into violence, while his psychic son sees horrific forebodings." },
  { title: "The Great Dictator", year: 1940, description: "Dictator Adenoid Hynkel tries to expand his empire while a poor Jewish barber tries to avoid persecution from Hynkel's regime in Chaplin's first full sound film." },
  { title: "Aliens", year: 1986, description: "Ellen Ripley is rescued after drifting through space for 57 years and returns to the exomoon with a unit of Colonial Marines to confront the deadly alien creatures." },
  { title: "Inglourious Basterds", year: 2009, description: "In Nazi-occupied France during World War II, a group of Jewish-American guerrilla soldiers plan a plot to assassinate Nazi leaders at a film premiere." },
  { title: "The Dark Knight Rises", year: 2012, description: "Eight years after the Joker's reign of chaos, Batman is forced from his exile to save Gotham City from the brutal guerrilla terrorist Bane." },
  { title: "Coco", year: 2017, description: "Aspiring musician Miguel enters the Land of the Dead to find his great-great-grandfather, a legendary singer, and learns the true meaning of family." },
  { title: "Amadeus", year: 1984, description: "The life, success, and troubles of Wolfgang Amadeus Mozart, as told by his rival Antonio Salieri, who is consumed by jealousy of Mozart's extraordinary talent." },
  { title: "Toy Story", year: 1995, description: "A cowboy doll is profoundly threatened and jealous when a new spaceman action figure supplants him as top toy in a boy's bedroom." },
  { title: "Dr. Strangelove", year: 1964, description: "An insane American general orders a bombing attack on the Soviet Union, triggering a loss-of-control chain of events and a race to prevent nuclear apocalypse." },
  { title: "Oldboy", year: 2003, description: "After being kidnapped and imprisoned for fifteen years, a man is released and sets out on an obsessive quest to discover who held him captive and why." },
  { title: "American Beauty", year: 1999, description: "A sexually frustrated suburban father has a mid-life crisis after becoming infatuated with his daughter's best friend, unraveling the facade of a perfect American family." },
  { title: "Das Boot", year: 1981, description: "A German U-boat crew endures the claustrophobic horrors of submarine warfare during World War II in this harrowing and immersive war film." },
  { title: "Braveheart", year: 1995, description: "Scottish warrior William Wallace leads his countrymen in a rebellion against the tyranny of English rule and the cruel King Edward I." },
  { title: "Good Will Hunting", year: 1997, description: "A janitor at M.I.T. with a gift for mathematics must learn to open up emotionally with the help of a therapist after being discovered by a professor." },
  { title: "Princess Mononoke", year: 1997, description: "On a journey to find the cure for a Tatari god's curse, Ashitaka finds himself caught in the middle of a war between the forest gods and a mining colony." },
  { title: "Your Name", year: 2016, description: "Two teenagers share a profound, magical connection upon discovering they are swapping bodies, and must discover and rely on each other to avert a coming disaster." },
  { title: "Joker", year: 2019, description: "A failed comedian's descent into madness leads him to transform into a criminal mastermind in Gotham City, sparking a violent movement in this dark character study." },
  { title: "3 Idiots", year: 2009, description: "Two friends search for their long-lost college companion while recounting the days they spent together at an Indian engineering school, challenging the educational system." },
  { title: "Once Upon a Time in America", year: 1984, description: "A former Prohibition-era Jewish gangster returns to the Lower East Side of Manhattan, where he must once again confront the ghosts of his past." },
  { title: "Singin' in the Rain", year: 1952, description: "A silent film star falls for a chorus girl just as he and his studio make their difficult transition to talking pictures in this beloved musical." },
  { title: "Capernaum", year: 2018, description: "While serving a five-year sentence for a violent crime, a 12-year-old boy sues his parents for the crime of giving him life in this heart-wrenching drama." },
  { title: "Come and See", year: 1985, description: "After finding an old rifle, a young Belarusian boy joins the Soviet resistance movement against the ruthless German forces and witnesses the horrors of World War II." },
  { title: "Requiem for a Dream", year: 2000, description: "The drug-induced utopias of four Coney Island residents are shattered when their addictions run deep, leading to devastating and harrowing consequences." },
  { title: "Toy Story 3", year: 2010, description: "The toys are mistakenly delivered to a day-care center instead of the attic right before Andy leaves for college, and it's up to Woody to convince the others to escape." },
  { title: "Return of the Jedi", year: 1983, description: "After a daring rescue of Han Solo from Jabba the Hutt, the Rebels attempt to destroy the second Death Star while Luke confronts Darth Vader one last time." },
  { title: "The Hunt", year: 2012, description: "A teacher's life is turned upside down when he is accused of abusing a child in his kindergarten class, and the small community turns against him." },
  { title: "Eternal Sunshine of the Spotless Mind", year: 2004, description: "When their relationship turns sour, a couple undergoes a medical procedure to have each other erased from their memories — but it is only through the process of loss that they discover what they had." },
  { title: "2001: A Space Odyssey", year: 1968, description: "Humanity finds a mysterious artifact buried beneath the lunar surface and sets off to find its origins with the help of an intelligent supercomputer named HAL 9000." },
  { title: "Reservoir Dogs", year: 1992, description: "When a simple jewelry heist goes horribly wrong, the surviving criminals begin to suspect that one of them is a police informant in this tense crime thriller." },
  { title: "Lawrence of Arabia", year: 1962, description: "The story of T.E. Lawrence, the English officer who successfully united and led the diverse, often warring, Arab tribes during World War I in their fight against the Turks." },
  { title: "The Apartment", year: 1960, description: "A lonely office worker lends his apartment to company executives for their extramarital affairs, hoping for a promotion, but everything changes when he falls for the boss's mistress." },
];

async function seed() {
  const client = await pool.connect();
  try {
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
        [
          crypto.randomUUID(),
          nanoid(),
          m.title,
          m.description,
          m.year,
          "NR",
          false,
          false,
        ],
      );
      inserted++;
    }

    console.log(`Done! Inserted ${inserted} movies, skipped ${skipped} (already exist).`);
  } finally {
    client.release();
    await pool.end();
  }
}

seed().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
