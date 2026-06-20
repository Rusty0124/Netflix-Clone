import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await axios.delete(`/api/movies/${id}`)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["movies"] }),
  });
};
