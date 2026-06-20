"use client";

import { useEffect, useState, useRef } from "react";
import { useFetchFeaturedMovies } from "@/hooks/movie/useFetchFeaturedMovies";
import { useFetchTrendingMovies } from "@/hooks/movie/useFetchTrendingMovies";
import { useFetchMovies } from "@/hooks/movie/useFetchMovies";
import { useFetchMyList } from "@/hooks/my-list/useFetchMyList";
import MoviesRow from "@/components/movie/MoviesRow";
import { Volume2, VolumeX } from "lucide-react";

export default function HomePage() {
  const { data: featuredMovies } = useFetchFeaturedMovies();
  const { data: trendingMovies } = useFetchTrendingMovies();
  const { data: allMovies } = useFetchMovies();
  const { data: myListMovies } = useFetchMyList();

  const [featuredIndex, setFeaturedIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    if (featuredMovies?.length) {
      setFeaturedIndex(Math.floor(Math.random() * featuredMovies.length));
    }
  }, [featuredMovies]);

  const featured = featuredMovies?.[featuredIndex];
  const hasVideo = !!featured?.trailerUrl;
  const hasBg = hasVideo || !!featured?.thumbnailUrl;

  return (
    <main className="min-h-screen bg-brand-background">
      {featured && (
        <section className="relative flex h-[85vh] items-end px-8 pb-20">
          {hasVideo ? (
            <video
              ref={videoRef}
              src={featured.trailerUrl!}
              autoPlay
              loop
              muted={isMuted}
              playsInline
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : featured.thumbnailUrl ? (
            <img
              src={featured.thumbnailUrl}
              alt={featured.title}
              className="absolute inset-0 h-full w-full object-cover"
            />
          ) : null}

          {/* Top gradient for nav readability */}
          <div className="absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-black/80 to-transparent" />
          {/* Bottom gradient to blend into content */}
          <div className="absolute inset-x-0 bottom-0 h-[50%] bg-gradient-to-t from-brand-background via-brand-background/60 to-transparent" />

          {!hasBg && (
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
            </div>
          </div>

          {hasVideo && (
            <button
              onClick={() => setIsMuted(!isMuted)}
              className="absolute bottom-20 right-8 z-10 rounded-full border border-white/40 p-2 text-white transition hover:bg-white/10"
            >
              {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
            </button>
          )}
          {featured.maturityRating && featured.maturityRating !== "NR" && (
            <span className="absolute bottom-20 right-20 z-10 rounded border border-white/40 bg-black/40 px-2 py-0.5 text-sm text-white">
              {featured.maturityRating}
            </span>
          )}
        </section>
      )}

      {!featured && <div className="h-20" />}

      <div className="relative z-10 space-y-10 px-2 pb-16">
        {trendingMovies && trendingMovies.length > 0 && (
          <MoviesRow title="Trending Now" movies={trendingMovies} />
        )}
        {allMovies && allMovies.length > 0 && (
          <MoviesRow title="New on Netflix" movies={allMovies} />
        )}
        {myListMovies && myListMovies.length > 0 && (
          <MoviesRow title="My List" movies={myListMovies} />
        )}
      </div>
    </main>
  );
}
