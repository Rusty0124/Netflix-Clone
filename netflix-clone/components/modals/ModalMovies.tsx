"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useGlobalContext } from "@/context/globalContext";
import { useCreateMovie } from "@/hooks/movie/useCreateMovie";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export default function ModalMovies() {
  const { isModalOpen, modalKey, closeModal } = useGlobalContext();
  const { mutate, isPending } = useCreateMovie();
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const isVisible = isModalOpen && modalKey === "add-movie";

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    mutate(
      { title: title.trim(), description: description.trim() },
      {
        onSuccess: () => {
          setTitle("");
          setDescription("");
          closeModal();
        },
      },
    );
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/70"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="w-full max-w-md rounded-lg bg-zinc-900 p-6 shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <h2 className="mb-4 text-xl font-semibold text-white">
              Add Movie
            </h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="movie-title" className="text-sm text-gray-300">
                  Title
                </label>
                <Input
                  id="movie-title"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="Movie title"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="movie-desc" className="text-sm text-gray-300">
                  Description
                </label>
                <Input
                  id="movie-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Movie description"
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" variant="brand" disabled={isPending}>
                  {isPending ? "Adding..." : "Add Movie"}
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  onClick={closeModal}
                  disabled={isPending}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
