"use client";

import { useRef, useState, useCallback } from "react";
import Link from "next/link";
import type { Movie } from "@/app/generated/prisma/client";
import { useGlobalContext } from "@/context/globalContext";
import { useAddToMyList } from "@/hooks/my-list/useAddToMyList";
import { useRemoveFromMyList } from "@/hooks/my-list/useRemoveFromMyList";
import { useFetchMyList } from "@/hooks/my-list/useFetchMyList";
import { Play, Plus, Check, ChevronDown } from "lucide-react";

export default function MovieCard({ movie }: { movie: Movie }) {
  const { openModal } = useGlobalContext();
  const { mutate: addToList } = useAddToMyList();
  const { mutate: removeFromList } = useRemoveFromMyList();
  const { data: myList = [] } = useFetchMyList();
  const videoRef = useRef<HTMLVideoElement>(null);
  const videoTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const [isElevated, setIsElevated] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const isInList = myList.some((m) => m.id === movie.id);

  const handleHoverStart = useCallback(() => {
    setIsElevated(true);
    videoTimer.current = setTimeout(() => {
      videoRef.current?.play().then(() => setIsPlaying(true));
    }, 650);
  }, []);

  const handleHoverEnd = useCallback(() => {
    clearTimeout(videoTimer.current ?? undefined);
    videoRef.current?.pause();
    setIsPlaying(false);
    setIsElevated(false);
  }, []);

  const toggleMyList = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isInList) {
      removeFromList(movie.id);
    } else {
      addToList(movie.id);
    }
  };

  return (
    <div
      className={`group relative cursor-pointer overflow-hidden rounded transition-transform duration-300 ${isElevated ? "z-10 scale-110" : ""}`}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {movie.trailerUrl && (
        <video
          ref={videoRef}
          src={movie.trailerUrl}
          muted
          loop
          playsInline
          className={`absolute inset-0 h-full w-full object-cover transition-opacity ${isPlaying ? "opacity-100" : "opacity-0"}`}
        />
      )}
      <div className="aspect-video w-full bg-zinc-800">
        {movie.thumbnailUrl ? (
          <img
            src={movie.thumbnailUrl}
            alt={movie.title}
            className="h-full w-full object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center p-2 text-center text-sm text-gray-300">
            {movie.title}
          </div>
        )}
      </div>

      <div className="absolute inset-x-0 bottom-0 translate-y-full bg-zinc-900 p-3 transition-transform group-hover:translate-y-0">
        <div className="flex items-center gap-2">
          <Link
            href={`/watch/${movie.publicId}`}
            onClick={(e) => e.stopPropagation()}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-black"
          >
            <Play size={14} fill="currentColor" />
          </Link>
          <button
            onClick={toggleMyList}
            className="flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-white transition hover:border-white"
          >
            {isInList ? <Check size={14} /> : <Plus size={14} />}
          </button>
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal("movie-info", movie);
            }}
            className="ml-auto flex h-8 w-8 items-center justify-center rounded-full border border-gray-400 text-white transition hover:border-white"
          >
            <ChevronDown size={14} />
          </button>
        </div>
        <p className="mt-1 truncate text-xs text-gray-400">{movie.title}</p>
      </div>
    </div>
  );
}
