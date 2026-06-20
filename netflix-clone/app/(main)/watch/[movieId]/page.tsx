"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Movie } from "@/app/generated/prisma/client";
import { ArrowLeft } from "lucide-react";

function getYouTubeEmbedUrl(trailerUrl: string): string {
  // Already an embed URL
  if (trailerUrl.includes("youtube.com/embed/")) {
    const url = new URL(trailerUrl);
    url.searchParams.set("autoplay", "1");
    url.searchParams.set("controls", "1");
    url.searchParams.delete("mute");
    url.searchParams.delete("loop");
    url.searchParams.delete("playlist");
    return url.toString();
  }

  // Regular YouTube URL — extract video ID
  let videoId = "";
  try {
    const url = new URL(trailerUrl);
    if (url.hostname.includes("youtu.be")) {
      videoId = url.pathname.slice(1);
    } else {
      videoId = url.searchParams.get("v") || "";
    }
  } catch {
    return trailerUrl;
  }

  if (videoId) {
    return `https://www.youtube.com/embed/${videoId}?autoplay=1&controls=1&rel=0`;
  }

  return trailerUrl;
}

export default function WatchPage() {
  const { movieId } = useParams<{ movieId: string }>();
  const router = useRouter();

  const { data: movie, isLoading } = useQuery({
    queryKey: ["movies", "public", movieId],
    queryFn: async () =>
      (await axios.get<Movie>(`/api/movies/public/${movieId}`)).data,
  });

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Loading…
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex h-screen items-center justify-center bg-black text-white">
        Movie not found.
      </div>
    );
  }

  const embedUrl = movie.trailerUrl
    ? getYouTubeEmbedUrl(movie.trailerUrl)
    : null;

  return (
    <div className="relative h-screen w-full bg-black">
      <button
        onClick={() => router.back()}
        className="absolute left-6 top-6 z-20 flex items-center gap-2 rounded-full bg-black/60 px-4 py-2 text-sm text-white transition hover:bg-black/80"
      >
        <ArrowLeft size={18} />
        Back
      </button>

      {embedUrl ? (
        <iframe
          src={embedUrl}
          allow="autoplay; encrypted-media; fullscreen"
          allowFullScreen
          className="h-full w-full border-0"
        />
      ) : movie.thumbnailUrl ? (
        <div className="flex h-full flex-col items-center justify-center gap-4">
          <img
            src={movie.thumbnailUrl}
            alt={movie.title}
            className="max-h-[60vh] rounded object-contain"
          />
          <p className="text-lg text-gray-400">
            No trailer available for {movie.title}
          </p>
        </div>
      ) : (
        <div className="flex h-full items-center justify-center">
          <p className="text-lg text-gray-400">
            No trailer available for {movie.title}
          </p>
        </div>
      )}
    </div>
  );
}
