"use client";

import { useState } from "react";
import type { Profile } from "@/app/generated/prisma/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";

interface ProfileFormData {
  name: string;
  isKids: boolean;
}

interface ProfileFormProps {
  profile?: Profile;
  onSave: (data: ProfileFormData) => void;
  onCancel: () => void;
}

export default function ProfileForm({
  profile,
  onSave,
  onCancel,
}: ProfileFormProps) {
  const [name, setName] = useState(profile?.name ?? "");
  const [isKids, setIsKids] = useState(profile?.isKids ?? false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave({ name: name.trim(), isKids });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label htmlFor="profile-name" className="text-sm text-gray-300">
          Name
        </label>
        <Input
          id="profile-name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Profile name"
          required
        />
      </div>

      <div className="flex items-center justify-between">
        <label htmlFor="profile-kids" className="text-sm text-gray-300">
          Kids Profile
        </label>
        <Switch
          id="profile-kids"
          checked={isKids}
          onCheckedChange={setIsKids}
        />
      </div>

      <div className="flex gap-3 pt-2">
        <Button type="submit" variant="brand">
          {profile ? "Save" : "Create"}
        </Button>
        <Button type="button" variant="ghost" onClick={onCancel}>
          Cancel
        </Button>
      </div>
    </form>
  );
}
