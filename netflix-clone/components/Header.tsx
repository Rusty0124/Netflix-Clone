"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useProfileContext } from "@/context/profileContext";
import { createClient } from "@/lib/supabase/client";
import useIsAdmin from "@/hooks/useIsAdmin";
import { useFetchProfiles } from "@/hooks/profile/useFetchProfiles";
import type { Profile } from "@/app/generated/prisma/client";
import { useQueryClient } from "@tanstack/react-query";
import { PROFILE_COLORS } from "@/lib/constants";

function ProfileAvatar({
  name,
  colorIndex,
  size = "sm",
}: {
  name: string;
  colorIndex: number;
  size?: "sm" | "xs";
}) {
  const sizeClass = size === "sm" ? "h-8 w-8 text-sm" : "h-6 w-6 text-xs";
  return (
    <span
      className={`flex items-center justify-center rounded font-bold text-white ${sizeClass} ${PROFILE_COLORS[Math.abs(colorIndex) % PROFILE_COLORS.length]}`}
    >
      {name.charAt(0).toUpperCase()}
    </span>
  );
}

export default function Header() {
  const { data: profiles = [] } = useFetchProfiles();
  const router = useRouter();
  const pathname = usePathname();
  const isAdmin = useIsAdmin();
  const { activeProfile, activeProfileId, setActiveProfile, clearActiveProfile } =
    useProfileContext();
  const queryClient = useQueryClient();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    }
    if (dropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [dropdownOpen]);

  const handleProfileSwitch = (profile: Profile) => {
    setActiveProfile(profile);
    queryClient.invalidateQueries({ queryKey: ["myList", profile.id] });
    setDropdownOpen(false);
  };

  const handleSignOut = async () => {
    const supabase = createClient();
    await supabase.auth.signOut();
    clearActiveProfile();
    router.push("/login");
  };

  useEffect(() => {
    if (profiles.length === 0 || activeProfile) return;
    const stored = profiles.find((p) => p.id === activeProfileId);
    setActiveProfile(stored ?? profiles[0]);
  }, [profiles, activeProfile, activeProfileId, setActiveProfile]);

  const activeIndex = profiles.findIndex((p) => p.id === activeProfile?.id);

  const navLink = (href: string, label: string) => (
    <Link
      href={href}
      className={`transition hover:text-white ${pathname === href ? "font-semibold text-white" : ""}`}
    >
      {label}
    </Link>
  );

  return (
    <header className="fixed top-0 z-50 flex w-full items-center justify-between bg-gradient-to-b from-black/90 via-black/60 to-transparent px-6 py-4">
      <div className="flex items-center gap-8">
        <Link href="/" className="text-2xl font-bold text-brand-primary">
          NETFLIX
        </Link>
        <nav className="hidden items-center gap-4 text-sm text-gray-300 md:flex">
          {navLink("/", "Home")}
          {navLink("/manage-profiles", "Profiles")}
          {isAdmin && navLink("/admin", "Admin")}
        </nav>
      </div>

      <div className="flex items-center gap-4" ref={dropdownRef}>
        {activeProfile && (
          <div className="relative">
            <button
              onClick={() => setDropdownOpen(!dropdownOpen)}
              className="flex items-center gap-2"
            >
              <ProfileAvatar
                name={activeProfile.name}
                colorIndex={activeIndex}
              />
              <span
                className={`text-xs text-white transition-transform duration-200 ${dropdownOpen ? "rotate-180" : ""}`}
              >
                &#9662;
              </span>
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 top-full mt-2 min-w-[180px] overflow-hidden rounded bg-zinc-900/95 py-2 shadow-xl ring-1 ring-white/10 backdrop-blur-sm">
                {profiles.map((profile, index) => (
                  <button
                    key={profile.id}
                    onClick={() => handleProfileSwitch(profile)}
                    className={`flex w-full items-center gap-3 px-4 py-2 text-left text-sm transition-colors hover:bg-zinc-800 ${
                      profile.id === activeProfile.id
                        ? "text-white"
                        : "text-gray-400"
                    }`}
                  >
                    <ProfileAvatar
                      name={profile.name}
                      colorIndex={index}
                      size="xs"
                    />
                    {profile.name}
                  </button>
                ))}
                <hr className="my-1 border-zinc-700" />
                <Link
                  href="/manage-profiles"
                  onClick={() => setDropdownOpen(false)}
                  className="block px-4 py-2 text-sm text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  Manage Profiles
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full px-4 py-2 text-left text-sm text-gray-400 transition-colors hover:bg-zinc-800 hover:text-white"
                >
                  Sign Out
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </header>
  );
}
