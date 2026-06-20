import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";

export const useDeleteProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) =>
      (await axios.delete(`/api/profiles/${id}`)).data,
    onSuccess: () =>
      queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });
};
