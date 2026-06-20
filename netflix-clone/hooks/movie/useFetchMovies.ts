import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Movie } from "@/app/generated/prisma/client";

export const useFetchMovies = () =>
  useQuery({
    queryKey: ["movies"],
    queryFn: async () => (await axios.get<Movie[]>("/api/movies")).data,
  });