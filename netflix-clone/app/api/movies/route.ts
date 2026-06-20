import { NextRequest, NextResponse } from "next/server";
import { nanoid } from "nanoid";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/supabase/prisma";

export async function GET(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const featured = req.nextUrl.searchParams.get("featured");
  const trending = req.nextUrl.searchParams.get("trending");

  const where: Record<string, boolean> = {};
  if (featured === "true") where.isFeatured = true;
  if (trending === "true") where.isTrending = true;

  const movies = await prisma.movie.findMany({ where });

  return NextResponse.json(movies);
}

export async function POST(req: NextRequest) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { supabaseUserId: authUser.id },
  });

  if (user?.role !== "ADMIN") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { title, description, ...rest } = await req.json();

  const movie = await prisma.movie.create({
    data: {
      title,
      description,
      publicId: nanoid(),
      ...rest,
    },
  });

  return NextResponse.json(movie);
}
