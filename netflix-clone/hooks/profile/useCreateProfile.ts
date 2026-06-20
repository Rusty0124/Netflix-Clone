import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useCreateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (data: {
      name: string;
      avatar?: string;
      isKids?: boolean;
    }) => (await axios.post("/api/profiles", data)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });
};
