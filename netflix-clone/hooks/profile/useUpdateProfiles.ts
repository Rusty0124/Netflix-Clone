import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import type { Profile } from "@/app/generated/prisma/client";

export const useUpdateProfile = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...fields }: { id: string } & Partial<Profile>) =>
      (await axios.patch(`/api/profiles/${id}`, fields)).data,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["profiles"] }),
  });
};
