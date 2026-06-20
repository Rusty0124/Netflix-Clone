import { notFound } from "next/navigation";
import cloudinary from "@/lib/cloudinary";
import { prisma } from "@/lib/supabase/prisma";
import MyPlayer from "@/components/player";

const SIGNED_URL_TTL = 4 * 60 * 60;
const THUMBNAIL_INTERVAL = 2;

export default async function WatchPage({
  params,
}: {
  params: Promise<{ movieId: string }>;
}) {
  const { movieId } = await params;
  const movie = await prisma.movie.findUnique({ where: { id: movieId } });

  if (!movie) notFound();

  const expiresAt = Math.floor(Date.now() / 1000) + SIGNED_URL_TTL;

  const src = movie.cloudinaryId
    ? cloudinary.url(movie.cloudinaryId, {
        resource_type: "video",
        type: "authenticated",
        sign_url: true,
        expires_at: expiresAt,
      })
    : movie.videoUrl;

  const thumbnails = movie.duration
    ? Array.from(
        { length: Math.ceil(movie.duration / THUMBNAIL_INTERVAL) },
        (_, i) => {
          const t = i * THUMBNAIL_INTERVAL;
          const url = cloudinary.url(movie.cloudinaryId!, {
            resource_type: "video",
            type: "authenticated",
            sign_url: true,
            expires_at: expiresAt,
            raw_transformation: `w_160,h_90,so_${t}`,
            format: "jpg",
          });
          return { url, startTime: t, endTime: t + THUMBNAIL_INTERVAL };
        },
      )
    : [];

  return (
    <MyPlayer src={src ?? ""} title={movie.title} thumbnails={thumbnails} />
  );
}
