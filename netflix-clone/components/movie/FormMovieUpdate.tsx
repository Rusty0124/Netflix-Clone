"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import type { Movie } from "@/app/generated/prisma/client";
import { useUpdateMovie } from "@/hooks/movie/useUpdateMovie";

async function uploadImage(file: File) {
  const formData = new FormData();
  formData.append("image", file);
  const { data } = await axios.post<{ url: string; publicId: string }>("/api/upload/image", formData);
  return data;
}

export default function FormMovieUpdate({ movie }: { movie: Movie }) {
  const { mutate } = useUpdateMovie();
  const [currentThumbnailUrl, setCurrentThumbnailUrl] = useState(
    movie.cloudinaryId ?? "",
  );

  const handleSubmit = useCallback(
    (fields: Partial<Movie>) => {
      mutate({ id: movie.id, ...fields });
    },
    [mutate, movie.id],
  );

  const handleThumbnailDrop = useCallback(
    async (file: File | null) => {
      if (!file) return;
      const { url } = await uploadImage(file);
      setCurrentThumbnailUrl(url);
      handleSubmit({ cloudinaryId: url });
    },
    [handleSubmit],
  );

  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      handleThumbnailDrop(acceptedFiles[0] ?? null);
    },
    [handleThumbnailDrop],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { "image/*": [] },
    maxFiles: 1,
  });

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`flex h-40 cursor-pointer items-center justify-center rounded border-2 border-dashed ${isDragActive ? "border-white bg-white/10" : "border-zinc-600"}`}
      >
        <input {...getInputProps()} />
        {currentThumbnailUrl ? (
          <img
            src={currentThumbnailUrl}
            alt={movie.title}
            className="h-full w-full rounded object-cover"
          />
        ) : (
          <p className="text-sm text-gray-400">
            {isDragActive ? "Drop image here" : "Drag & drop a thumbnail"}
          </p>
        )}
      </div>
    </div>
  );
}
