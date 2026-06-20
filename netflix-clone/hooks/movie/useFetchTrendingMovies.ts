import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Movie } from "@/app/generated/prisma/client";

export const useFetchTrendingMovies = () =>
  useQuery({
    queryKey: ["movies", "trending"],
    queryFn: async () =>
      (await axios.get<Movie[]>("/api/movies?trending=true")).data,
  });
