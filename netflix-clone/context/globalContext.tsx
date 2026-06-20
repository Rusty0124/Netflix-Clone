"use client";

import { createContext, useContext, useState, useCallback } from "react";
import type { Movie } from "@/app/generated/prisma/client";

interface GlobalContextType {
  modalKey: string | null;
  isModalOpen: boolean;
  openModal: (key: string, movie?: Movie) => void;
  closeModal: () => void;
  activeMovie: Movie | null;
}

const GlobalContext = createContext<GlobalContextType | null>(null);

export function GlobalProvider({ children }: { children: React.ReactNode }) {
  const [modalKey, setModalKey] = useState<string | null>(null);
  const [activeMovie, setActiveMovie] = useState<Movie | null>(null);

  const openModal = useCallback((key: string, movie?: Movie) => {
    setModalKey(key);
    setActiveMovie(movie ?? null);
  }, []);

  const closeModal = useCallback(() => {
    setModalKey(null);
    setActiveMovie(null);
  }, []);

  return (
    <GlobalContext value={{
      modalKey,
      isModalOpen: modalKey !== null,
      openModal,
      closeModal,
      activeMovie,
    }}>
      {children}
    </GlobalContext>
  );
}

export function useGlobalContext() {
  const ctx = useContext(GlobalContext);
  if (!ctx) throw new Error("useGlobalContext must be used within GlobalProvider");
  return ctx;
}
