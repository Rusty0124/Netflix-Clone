"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import type { Profile } from "@/app/generated/prisma/client";

const STORAGE_KEY = "netflix-active-profile-id";

interface ProfileContextType {
  activeProfile: Profile | null;
  setActiveProfile: (profile: Profile) => void;
  clearActiveProfile: () => void;
  activeProfileId: string | null;
}

const ProfileContext = createContext<ProfileContextType | null>(null);

export function ProfileProvider({ children }: { children: React.ReactNode }) {
  const [activeProfile, setActiveProfileState] = useState<Profile | null>(null);
  const [activeProfileId, setActiveProfileId] = useState<string | null>(null);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) setActiveProfileId(stored);
  }, []);

  const setActiveProfile = useCallback((profile: Profile) => {
    setActiveProfileState(profile);
    setActiveProfileId(profile.id);
    localStorage.setItem(STORAGE_KEY, profile.id);
  }, []);

  const clearActiveProfile = useCallback(() => {
    setActiveProfileState(null);
    setActiveProfileId(null);
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  return (
    <ProfileContext value={{
      activeProfile,
      setActiveProfile,
      clearActiveProfile,
      activeProfileId,
    }}>
      {children}
    </ProfileContext>
  );
}

export function useProfileContext() {
  const ctx = useContext(ProfileContext);
  if (!ctx) throw new Error("useProfileContext must be used within ProfileProvider");
  return ctx;
}
