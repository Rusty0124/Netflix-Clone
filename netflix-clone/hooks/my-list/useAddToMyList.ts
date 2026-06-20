import { useProfileContext } from "@/context/profileContext";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useAddToMyList = () => {
  const queryClient = useQueryClient();
  const { activeProfileId } = useProfileContext();

  return useMutation({
    mutationFn: async (movieId: string) =>
      (await axios.post("/api/my-list", { movieId, profileId: activeProfileId }))
        .data,
    onSuccess: () =>
      queryClient.invalidateQueries({
        queryKey: ["myList", activeProfileId],
      }),
  });
};
