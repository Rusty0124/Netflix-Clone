"use client";

import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Movie } from "@/app/generated/prisma/client";
import { useFetchFeaturedMovies } from "@/hooks/movie/useFetchFeaturedMovies";
import { useFetchMyList } from "@/hooks/my-list/useFetchMyList";
import MoviesRow from "@/components/movie/MoviesRow";
import { Info } from "lucide-react";

const useMoviesByCategory = (category: string) =>
  useQuery({
    queryKey: ["movies", category],
    queryFn: async () =>
      (await axios.get<Movie[]>(`/api/movies?category=${category}`)).data,
  });

export default function HomePage() {
  const { data: featuredMovies } = useFetchFeaturedMovies();
  const { data: newMovies } = useMoviesByCategory("new");
  const { data: recommended } = useMoviesByCategory("recommended");
  const { data: classics } = useMoviesByCategory("classics");
  const { data: myListMovies } = useFetchMyList();

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isMuted] = useState(true);

  useEffect(() => {
    if (featuredMovies?.length) {
      setFeaturedIndex(Math.floor(Math.random() * featuredMovies.length));
    }
  }, [featuredMovies]);

  const featured = featuredMovies?.[featuredIndex];
  const hasTrailer = !!featured?.trailerUrl;

  const trailerSrc = hasTrailer
    ? featured.trailerUrl + (isMuted ? "" : "").replace("mute=1", isMuted ? "mute=1" : "mute=0")
    : null;

  return (
    <main className="min-h-screen bg-brand-background">
      {featured && (
        <section className="relative flex h-[85vh] items-end px-8 pb-20">
          {hasTrailer ? (
            <iframe
              src={trailerSrc!}
              allow="autoplay; encrypted-media"
              allowFullScreen
              className="pointer-events-none absolute inset-0 h-full w-full scale-125 border-0 object-cover"
            />
          ) : featured.thumbnailUrl ? (
            <img
              src={featured.thumbnailUrl}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}

          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
          <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-brand-background via-brand-background/60 to-transparent" />

          {!hasTrailer && !featured.thumbnailUrl && (
            <div className="absolute inset-0 bg-gradient-to-br from-zinc-800 to-brand-background" />
          )}

          <div className="relative z-10 max-w-lg">
            <h1 className="text-5xl font-bold drop-shadow-lg">
              {featured.title}
            </h1>
            <p className="mt-4 text-lg text-gray-300 drop-shadow-md">
              {featured.description}
            </p>
            <div className="mt-6 flex gap-3">
              <a
                href={`/watch/${featured.publicId}`}
                className="flex items-center gap-2 rounded bg-white px-8 py-2 font-semibold text-black transition hover:bg-white/80"
              >
                &#9654; Play
              </a>
              <button className="flex items-center gap-2 rounded bg-zinc-600/80 px-6 py-2 font-semibold text-white transition hover:bg-zinc-600">
                <Info size={18} /> More Info
              </button>
            </div>
          </div>

          {featured.maturityRating && featured.maturityRating !== "NR" && (
            <span className="absolute bottom-20 right-8 z-10 rounded border border-white/40 bg-black/40 px-2 py-0.5 text-sm text-white">
              {featured.maturityRating}
            </span>
          )}
        </section>
      )}

      {!featured && <div className="h-20" />}

      <div className="relative z-10 space-y-10 px-2 pb-16">
        {newMovies && newMovies.length > 0 && (
          <MoviesRow title="New to Netflix" movies={newMovies} />
        )}
        {recommended && recommended.length > 0 && (
          <MoviesRow title="Recommended" movies={recommended} />
        )}
        {classics && classics.length > 0 && (
          <MoviesRow title="Classics" movies={classics} />
        )}
        {myListMovies && myListMovies.length > 0 && (
          <MoviesRow title="My List" movies={myListMovies} />
        )}
      </div>
    </main>
  );
}
