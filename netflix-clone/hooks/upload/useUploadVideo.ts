import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

export const useUploadVideo = () => {
  const [progress, setProgress] = useState(0);

  const mutation = useMutation({
    mutationFn: async (file: File) => {
      setProgress(0);
      const { data: sig } = await axios.get("/api/upload/signature");
      const formData = new FormData();
      formData.append("file", file);
      formData.append("timestamp", sig.timestamp.toString());
      formData.append("api_key", sig.apiKey);
      formData.append("signature", sig.signature);
      formData.append("type", "authenticated");
      formData.append("folder", "netflix-clone/movies");

      const { data } = await axios.post(
        `https://api.cloudinary.com/v1_1/${sig.cloudName}/video/upload`,
        formData,
        {
          onUploadProgress: (e) =>
            setProgress(Math.round((e.loaded / (e.total ?? 1)) * 100)),
        },
      );

      return data as { secure_url: string; public_id: string };
    },
  });

  return { ...mutation, progress };
};
