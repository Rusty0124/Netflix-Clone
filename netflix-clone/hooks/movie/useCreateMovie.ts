import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateMovie = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: { title: string; description: string }) =>
      (await axios.post("/api/movies", data)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["movies"] }),
  });
};
