import type { Movie } from "@/app/generated/prisma/client";
import { useProfileContext } from "@/context/profileContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useRemoveFromMyList = () => {
  const queryClient = useQueryClient();
  const { activeProfileId } = useProfileContext();
  const key = ["myList", activeProfileId ?? ""];

  return useMutation({
    mutationFn: (movieId: string) =>
      axios.delete("/api/my-list", {
        data: { movieId, profileId: activeProfileId },
      }),
    onMutate: async (movieId) => {
      await queryClient.cancelQueries({ queryKey: key });
      const previous = queryClient.getQueryData<Movie[]>(key);
      queryClient.setQueryData<Movie[]>(key, (old = []) =>
        old.filter((m) => m.id !== movieId),
      );
      return { previous };
    },
    onError: (_err, _id, context) => {
      if (context?.previous) queryClient.setQueryData(key, context.previous);
    },
    onSettled: () => queryClient.invalidateQueries({ queryKey: key }),
  });
};
