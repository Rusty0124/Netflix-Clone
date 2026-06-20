"use client";

import type { Movie } from "@/app/generated/prisma/client";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
} from "@/components/ui/carousel";
import MovieCard from "@/components/movie/MovieCard";

export default function MoviesRow({
  title,
  movies,
}: {
  title: string;
  movies: Movie[];
}) {
  if (movies.length === 0) return null;

  return (
    <section className="space-y-2 px-6">
      <h2 className="text-xl font-semibold">{title}</h2>
      <Carousel opts={{ align: "start" }}>
        <CarouselContent>
          {movies.map((movie) => (
            <CarouselItem
              key={movie.id}
              className="basis-1/3 md:basis-1/4 lg:basis-1/5 xl:basis-1/6"
            >
              <MovieCard movie={movie} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious />
        <CarouselNext />
      </Carousel>
    </section>
  );
}
