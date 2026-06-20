import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Profile } from "@/app/generated/prisma/client";

export const useFetchProfiles = () =>
  useQuery({
    queryKey: ["profiles"],
    queryFn: async () => (await axios.get<Profile[]>("/api/profiles")).data,
  });
