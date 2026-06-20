import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import type { Movie } from "@/app/generated/prisma/client";

export const useFetchFeaturedMovies = () =>
  useQuery({
    queryKey: ["movies", "featured"],
    queryFn: async () =>
      (await axios.get<Movie[]>("/api/movies?featured=true")).data,
  });
