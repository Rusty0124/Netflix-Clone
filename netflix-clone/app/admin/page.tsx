"use client";

import { useState } from "react";
import { useFetchMovies } from "@/hooks/movie/useFetchMovies";
import { useDeleteMovie } from "@/hooks/movie/useDeleteMovie";
import { useGlobalContext } from "@/context/globalContext";
import useIsAdmin from "@/hooks/useIsAdmin";
import Link from "next/link";

export default function AdminPage() {
  const isAdmin = useIsAdmin();
  const { data: movies, isLoading } = useFetchMovies();
  const { mutate: deleteMovie } = useDeleteMovie();
  const { openModal } = useGlobalContext();
  const [deletingId, setDeletingId] = useState<string | null>(null);

  if (!isAdmin) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        <p>Access denied.</p>
      </div>
    );
  }

  const handleDelete = (id: string) => {
    setDeletingId(id);
    deleteMovie(id, { onSettled: () => setDeletingId(null) });
  };

  return (
    <div className="px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl font-bold text-white">Manage Movies</h1>
        <button
          onClick={() => openModal("add-movie")}
          className="rounded bg-brand-primary px-6 py-2 font-semibold text-white transition hover:bg-brand-primary-dark"
        >
          Add Movie
        </button>
      </div>

      {isLoading && <p className="text-gray-400">Loading movies…</p>}

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6">
        {movies?.map((movie) => (
          <div
            key={movie.id}
            className="group relative overflow-hidden rounded bg-zinc-800"
          >
            <div className="aspect-video w-full bg-zinc-700">
              {movie.thumbnailUrl ? (
                <img
                  src={movie.thumbnailUrl}
                  alt={movie.title}
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center p-2 text-center text-sm text-gray-400">
                  {movie.title}
                </div>
              )}
            </div>
            <div className="p-2">
              <p className="truncate text-sm text-white">{movie.title}</p>
            </div>
            <div className="absolute inset-0 flex items-center justify-center gap-2 bg-black/60 opacity-0 transition group-hover:opacity-100">
              <Link
                href={`/admin/movies/${movie.id}`}
                className="rounded bg-white px-3 py-1 text-sm font-medium text-black"
              >
                Edit
              </Link>
              <button
                onClick={() => handleDelete(movie.id)}
                disabled={deletingId === movie.id}
                className="rounded bg-red-600 px-3 py-1 text-sm font-medium text-white disabled:opacity-50"
              >
                {deletingId === movie.id ? "…" : "Delete"}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
