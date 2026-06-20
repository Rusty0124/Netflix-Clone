import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Movie } from "@/app/generated/prisma/client";
import { useProfileContext } from "@/context/profileContext";

export const useFetchMyList = () => {
  const { activeProfileId } = useProfileContext();

  return useQuery({
    queryKey: ["myList", activeProfileId],
    queryFn: async () =>
      (
        await axios.get<Movie[]>(
          `/api/my-list?profileId=${activeProfileId}`,
        )
      ).data,
    enabled: !!activeProfileId,
  });
};
