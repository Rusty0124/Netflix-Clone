"use client";

import {
  createContext,
  forwardRef,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import useEmblaCarousel, {
  type UseEmblaCarouselType,
} from "embla-carousel-react";
import type { EmblaOptionsType } from "embla-carousel";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { cn } from "@/lib/utils";

type CarouselApi = UseEmblaCarouselType[1];

interface CarouselContextValue {
  emblaRef: UseEmblaCarouselType[0];
  api: CarouselApi;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  scrollPrev: () => void;
  scrollNext: () => void;
}

const CarouselContext = createContext<CarouselContextValue | null>(null);

function useCarousel() {
  const ctx = useContext(CarouselContext);
  if (!ctx) throw new Error("useCarousel must be used within <Carousel>");
  return ctx;
}

interface CarouselProps extends React.HTMLAttributes<HTMLDivElement> {
  opts?: EmblaOptionsType;
}

const Carousel = forwardRef<HTMLDivElement, CarouselProps>(
  ({ opts, className, children, ...props }, ref) => {
    const [emblaRef, api] = useEmblaCarousel(opts);
    const [canScrollPrev, setCanScrollPrev] = useState(false);
    const [canScrollNext, setCanScrollNext] = useState(false);

    const onSelect = useCallback(() => {
      if (!api) return;
      setCanScrollPrev(api.canScrollPrev());
      setCanScrollNext(api.canScrollNext());
    }, [api]);

    useEffect(() => {
      if (!api) return;
      onSelect();
      api.on("reInit", onSelect);
      api.on("select", onSelect);
      return () => {
        api.off("reInit", onSelect);
        api.off("select", onSelect);
      };
    }, [api, onSelect]);

    const scrollPrev = useCallback(() => api?.scrollPrev(), [api]);
    const scrollNext = useCallback(() => api?.scrollNext(), [api]);

    return (
      <CarouselContext value={{
        emblaRef,
        api,
        canScrollPrev,
        canScrollNext,
        scrollPrev,
        scrollNext,
      }}>
        <div ref={ref} className={cn("relative", className)} {...props}>
          {children}
        </div>
      </CarouselContext>
    );
  },
);
Carousel.displayName = "Carousel";

const CarouselContent = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => {
  const { emblaRef } = useCarousel();
  return (
    <div ref={emblaRef} className="overflow-hidden">
      <div ref={ref} className={cn("flex", className)} {...props} />
    </div>
  );
});
CarouselContent.displayName = "CarouselContent";

const CarouselItem = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn("min-w-0 shrink-0 grow-0 basis-full", className)}
    {...props}
  />
));
CarouselItem.displayName = "CarouselItem";

const CarouselPrevious = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { canScrollPrev, scrollPrev } = useCarousel();

  if (!canScrollPrev) return null;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute left-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100",
        className,
      )}
      onClick={scrollPrev}
      aria-label="Previous"
      {...props}
    >
      <ChevronLeft className="h-8 w-8" />
    </button>
  );
});
CarouselPrevious.displayName = "CarouselPrevious";

const CarouselNext = forwardRef<
  HTMLButtonElement,
  React.ButtonHTMLAttributes<HTMLButtonElement>
>(({ className, ...props }, ref) => {
  const { canScrollNext, scrollNext } = useCarousel();

  if (!canScrollNext) return null;

  return (
    <button
      ref={ref}
      type="button"
      className={cn(
        "absolute right-0 top-0 z-10 flex h-full w-12 items-center justify-center bg-black/40 text-white opacity-0 transition-opacity hover:bg-black/60 group-hover:opacity-100",
        className,
      )}
      onClick={scrollNext}
      aria-label="Next"
      {...props}
    >
      <ChevronRight className="h-8 w-8" />
    </button>
  );
});
CarouselNext.displayName = "CarouselNext";

export {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselPrevious,
  CarouselNext,
};
