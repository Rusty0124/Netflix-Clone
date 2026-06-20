"use client";

import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { cn } from "@/lib/utils";

interface FileDropzoneProps {
  onFileSelected: (file: File) => void;
  accept?: Record<string, string[]>;
  label?: string;
  preview?: string;
}

export default function FileDropzone({
  onFileSelected,
  accept,
  label = "Drag & drop a file here, or click to select",
  preview,
}: FileDropzoneProps) {
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      const file = acceptedFiles[0];
      if (file) onFileSelected(file);
    },
    [onFileSelected],
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles: 1,
  });

  const isVideo = preview && /\.(mp4|webm|ogg|mov)/i.test(preview);

  return (
    <div
      {...getRootProps()}
      className={cn(
        "flex min-h-[160px] cursor-pointer items-center justify-center rounded-lg border-2 border-dashed transition-colors",
        isDragActive
          ? "border-white bg-white/10"
          : "border-zinc-600 hover:border-zinc-400",
      )}
    >
      <input {...getInputProps()} />

      {preview ? (
        isVideo ? (
          <video
            src={preview}
            muted
            loop
            autoPlay
            playsInline
            className="h-full max-h-60 w-full rounded-lg object-cover"
          />
        ) : (
          <img
            src={preview}
            alt="Preview"
            className="h-full max-h-60 w-full rounded-lg object-cover"
          />
        )
      ) : (
        <p className="px-4 text-center text-sm text-gray-400">
          {isDragActive ? "Drop the file here..." : label}
        </p>
      )}
    </div>
  );
}
