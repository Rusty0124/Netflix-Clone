"use client";

import { AnimatePresence } from "framer-motion";
import { useGlobalContext } from "@/context/globalContext";
import ModalMovies from "@/components/modals/ModalMovies";
import MovieInfoModal from "@/components/modals/MovieInfoModal";

export default function ModalProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isModalOpen, modalKey } = useGlobalContext();
  return (
    <>
      <AnimatePresence>
        {isModalOpen && modalKey === "add-movie" && (
          <ModalMovies key="add-movie" />
        )}
        {isModalOpen && modalKey === "movie-info" && (
          <MovieInfoModal key="movie-info" />
        )}
      </AnimatePresence>
      {children}
    </>
  );
}
