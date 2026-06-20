"use client";

import { useParams, useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useState, useEffect } from "react";
import type { Movie } from "@/app/generated/prisma/client";
import { useUpdateMovie } from "@/hooks/movie/useUpdateMovie";
import FileDropzone from "@/components/movie/FileDropzone";

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await axios.post<{ url: string; publicId: string }>(
    "/api/upload/image",
    formData,
  );
  return data;
}

export default function AdminMovieEditPage() {
  const router = useRouter();
  const { movieId } = useParams<{ movieId: string }>();
  const { data: movie, isLoading } = useQuery({
    queryKey: ["movies", movieId],
    queryFn: async () =>
      (await axios.get<Movie>(`/api/movies/${movieId}`)).data,
  });
  const { mutate: updateMovie, isPending } = useUpdateMovie();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [releaseYear, setReleaseYear] = useState("");
  const [maturityRating, setMaturityRating] = useState("NR");
  const [isTrending, setIsTrending] = useState(false);
  const [isFeatured, setIsFeatured] = useState(false);
  const [thumbnailPreview, setThumbnailPreview] = useState("");

  useEffect(() => {
    if (movie) {
      setTitle(movie.title);
      setDescription(movie.description);
      setReleaseYear(movie.releaseYear?.toString() ?? "");
      setMaturityRating(movie.maturityRating ?? "NR");
      setIsTrending(movie.isTrending);
      setIsFeatured(movie.isFeatured);
      setThumbnailPreview(movie.thumbnailUrl ?? "");
    }
  }, [movie]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Loading…
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="flex min-h-screen items-center justify-center text-white">
        Movie not found.
      </div>
    );
  }

  const handleThumbnailDrop = async (file: File) => {
    const { url } = await uploadImage(file);
    setThumbnailPreview(url);
  };

  const handleSave = () => {
    updateMovie({
      id: movie.id,
      title,
      description,
      releaseYear: releaseYear ? parseInt(releaseYear) : null,
      maturityRating,
      isTrending,
      isFeatured,
      thumbnailUrl: thumbnailPreview || null,
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-8 py-10">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-2xl font-bold text-white">Edit Movie</h1>
        <button
          onClick={() => router.push("/admin")}
          className="rounded border border-gray-500 px-4 py-2 text-sm text-gray-400 transition hover:border-white hover:text-white"
        >
          Back to Admin
        </button>
      </div>

      <div className="space-y-6">
        <div>
          <label className="mb-1 block text-sm text-gray-400">Title</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full rounded bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>

        <div>
          <label className="mb-1 block text-sm text-gray-400">
            Description
          </label>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
            className="w-full rounded bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-white/40"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="mb-1 block text-sm text-gray-400">
              Release Year
            </label>
            <input
              type="number"
              value={releaseYear}
              onChange={(e) => setReleaseYear(e.target.value)}
              className="w-full rounded bg-zinc-800 p-3 text-white outline-none focus:ring-2 focus:ring-white/40"
            />
          </div>
          <div>
            <label className="mb-1 block text-sm text-gray-400">
              Maturity Rating
            </label>
            <select
              value={maturityRating}
              onChange={(e) => setMaturityRating(e.target.value)}
              className="w-full rounded bg-zinc-800 p-3 text-white outline-none"
            >
              {["G", "PG", "PG-13", "R", "NC-17", "NR"].map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-8">
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={isTrending}
              onChange={(e) => setIsTrending(e.target.checked)}
              className="accent-brand-primary"
            />
            Trending
          </label>
          <label className="flex items-center gap-2 text-sm text-white">
            <input
              type="checkbox"
              checked={isFeatured}
              onChange={(e) => setIsFeatured(e.target.checked)}
              className="accent-brand-primary"
            />
            Featured
          </label>
        </div>

        <div>
          <label className="mb-2 block text-sm text-gray-400">Thumbnail</label>
          <FileDropzone
            onFileSelected={handleThumbnailDrop}
            accept={{ "image/*": [] }}
            label="Drop a thumbnail image"
            preview={thumbnailPreview}
          />
        </div>

        <button
          onClick={handleSave}
          disabled={isPending || !title.trim() || !description.trim()}
          className="rounded bg-white px-8 py-3 font-semibold text-black transition hover:bg-gray-200 disabled:opacity-50"
        >
          {isPending ? "Saving…" : "Save Changes"}
        </button>
      </div>
    </div>
  );
}
