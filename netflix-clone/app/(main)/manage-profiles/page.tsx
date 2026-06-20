"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil } from "lucide-react";
import { useFetchProfiles } from "@/hooks/profile/useFetchProfiles";
import { useCreateProfile } from "@/hooks/profile/useCreateProfile";
import { useUpdateProfile } from "@/hooks/profile/useUpdateProfiles";
import { useDeleteProfile } from "@/hooks/profile/useDeleteProfile";
import { useProfileContext } from "@/context/profileContext";
import { MAX_PROFILES, PROFILE_COLORS } from "@/lib/constants";
import type { Profile } from "@/app/generated/prisma/client";

type Mode = "grid" | "add" | "edit";

export default function ManageProfilesPage() {
  const router = useRouter();
  const { data: profiles = [], isLoading } = useFetchProfiles();
  const { mutate: createProfile } = useCreateProfile();
  const { mutate: updateProfile } = useUpdateProfile();
  const { mutate: deleteProfile } = useDeleteProfile();
  const { setActiveProfile } = useProfileContext();

  const [mode, setMode] = useState<Mode>("grid");
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  const [name, setName] = useState("");
  const [isKids, setIsKids] = useState(false);

  const selectProfile = (profile: Profile) => {
    setActiveProfile(profile);
    router.push("/");
  };

  const startAdd = () => {
    setName("");
    setIsKids(false);
    setEditingProfile(null);
    setMode("add");
  };

  const startEdit = (profile: Profile) => {
    setName(profile.name);
    setIsKids(profile.isKids);
    setEditingProfile(profile);
    setMode("edit");
  };

  const handleSave = () => {
    if (mode === "add") {
      createProfile(
        { name, isKids },
        { onSuccess: () => setMode("grid") },
      );
    } else if (editingProfile) {
      updateProfile(
        { id: editingProfile.id, name, isKids },
        { onSuccess: () => setMode("grid") },
      );
    }
  };

  const handleDelete = () => {
    if (!editingProfile || profiles.length <= 1) return;
    deleteProfile(editingProfile.id, {
      onSuccess: () => setMode("grid"),
    });
  };

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center pt-16 text-white">
        Loading…
      </div>
    );
  }

  if (mode !== "grid") {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-brand-background pt-16">
        <h1 className="mb-8 text-3xl font-bold text-white">
          {mode === "add" ? "Add Profile" : "Edit Profile"}
        </h1>
        <div className="w-full max-w-sm space-y-4">
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Name"
            className="w-full rounded bg-zinc-800 p-4 text-white placeholder-gray-400 outline-none focus:ring-2 focus:ring-white/40"
          />
          <label className="flex items-center gap-3 text-white">
            <input
              type="checkbox"
              checked={isKids}
              onChange={(e) => setIsKids(e.target.checked)}
              className="accent-brand-primary"
            />
            Kids profile
          </label>
          <div className="flex gap-3 pt-2">
            <button
              onClick={handleSave}
              disabled={!name.trim()}
              className="rounded bg-white px-6 py-2 font-semibold text-black disabled:opacity-50"
            >
              Save
            </button>
            <button
              onClick={() => setMode("grid")}
              className="rounded border border-gray-500 px-6 py-2 text-gray-400 hover:text-white"
            >
              Cancel
            </button>
            {mode === "edit" && profiles.length > 1 && (
              <button
                onClick={handleDelete}
                className="rounded border border-red-600 px-6 py-2 text-red-500 hover:bg-red-600 hover:text-white"
              >
                Delete
              </button>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-brand-background pt-16">
      <h1 className="mb-8 text-3xl font-bold text-white">Who's watching?</h1>
      <div className="flex flex-wrap justify-center gap-6">
        {profiles.map((profile, index) => (
          <div key={profile.id} className="group flex flex-col items-center gap-2">
            <div className="relative">
              <button
                onClick={() => selectProfile(profile)}
                className={`flex h-28 w-28 items-center justify-center rounded text-5xl font-bold text-white ring-2 ring-transparent transition group-hover:ring-white ${PROFILE_COLORS[index % PROFILE_COLORS.length]}`}
              >
                {profile.name.charAt(0).toUpperCase()}
              </button>
              <button
                onClick={() => startEdit(profile)}
                className="absolute -bottom-1 -right-1 flex h-8 w-8 items-center justify-center rounded-full bg-zinc-800 text-gray-400 ring-1 ring-zinc-600 transition hover:bg-zinc-700 hover:text-white"
              >
                <Pencil size={14} />
              </button>
            </div>
            <span className="text-sm text-gray-400 group-hover:text-white">
              {profile.name}
            </span>
          </div>
        ))}

        {profiles.length < MAX_PROFILES && (
          <button
            onClick={startAdd}
            className="group flex flex-col items-center gap-2"
          >
            <div className="flex h-28 w-28 items-center justify-center rounded bg-zinc-700 text-4xl text-gray-400 transition group-hover:bg-zinc-600 group-hover:text-white">
              +
            </div>
            <span className="text-sm text-gray-400 group-hover:text-white">
              Add Profile
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
