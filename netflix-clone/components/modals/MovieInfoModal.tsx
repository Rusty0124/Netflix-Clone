"use client";

import { useRef, useMemo } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Plus, Check } from "lucide-react";
import { useGlobalContext } from "@/context/globalContext";
import useDetectOutsideClick from "@/hooks/useDetectOutsideClick";
import { useAddToMyList } from "@/hooks/my-list/useAddToMyList";
import { useRemoveFromMyList } from "@/hooks/my-list/useRemoveFromMyList";
import { useFetchMyList } from "@/hooks/my-list/useFetchMyList";
import { Button } from "@/components/ui/button";

export default function MovieInfoModal() {
  const { isModalOpen, modalKey, activeMovie, closeModal } = useGlobalContext();
  const cardRef = useRef<HTMLDivElement>(null);
  const addToMyList = useAddToMyList();
  const removeFromMyList = useRemoveFromMyList();
  const { data: myList } = useFetchMyList();

  useDetectOutsideClick(cardRef, closeModal);

  const isVisible = isModalOpen && modalKey === "movie-info" && activeMovie;

  const isInMyList = useMemo(() => {
    if (!myList || !activeMovie) return false;
    return myList.some((m) => m.id === activeMovie.id);
  }, [myList, activeMovie]);

  const handleToggleMyList = () => {
    if (!activeMovie) return;
    if (isInMyList) {
      removeFromMyList.mutate(activeMovie.id);
    } else {
      addToMyList.mutate(activeMovie.id);
    }
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
            ref={cardRef}
            className="w-full max-w-2xl overflow-hidden rounded-lg bg-zinc-900 shadow-xl"
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.95, opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {/* Video / Header */}
            <div className="relative aspect-video w-full bg-black">
              {activeMovie.trailerUrl ? (
                <video
                  src={activeMovie.trailerUrl}
                  autoPlay
                  muted
                  loop
                  playsInline
                  className="h-full w-full object-cover"
                />
              ) : (
                <div className="flex h-full items-center justify-center text-gray-500">
                  No trailer available
                </div>
              )}
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-zinc-900 to-transparent p-6">
                <h2 className="text-2xl font-bold text-white">
                  {activeMovie.title}
                </h2>
              </div>
            </div>

            {/* Details */}
            <div className="space-y-4 p-6">
              <div className="flex items-center gap-3">
                <Button variant="brand" asChild>
                  <Link href={`/watch/${activeMovie.publicId}`}>
                    <Play className="h-4 w-4" />
                    Play
                  </Link>
                </Button>

                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleToggleMyList}
                  aria-label={isInMyList ? "Remove from My List" : "Add to My List"}
                >
                  {isInMyList ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    <Plus className="h-4 w-4" />
                  )}
                </Button>
              </div>

              <p className="text-sm leading-relaxed text-gray-300">
                {activeMovie.description}
              </p>

              <div className="flex flex-wrap gap-4 text-sm text-gray-400">
                {activeMovie.duration && (
                  <span>{activeMovie.duration} min</span>
                )}
                {activeMovie.releaseYear && (
                  <span>{activeMovie.releaseYear}</span>
                )}
                {activeMovie.maturityRating && (
                  <span className="rounded border border-gray-500 px-1.5 py-0.5 text-xs">
                    {activeMovie.maturityRating}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
