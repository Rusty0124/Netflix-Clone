import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Movie } from "@/app/generated/prisma/client";

export const useUpdateMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: { id: string } & Partial<Movie>) =>
      (await axios.patch(`/api/movies/${id}`, fields)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["movies"] }),
  });
};
