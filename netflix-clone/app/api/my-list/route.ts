import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/supabase/prisma";

async function getAuthUser() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();
  if (!authUser) return null;
  return prisma.user.findUnique({ where: { supabaseUserId: authUser.id } });
}

async function verifyProfileOwnership(profileId: string, userId: string) {
  return prisma.profile.findFirst({ where: { id: profileId, userId } });
}

export async function GET(req: NextRequest) {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const profileId = req.nextUrl.searchParams.get("profileId");
  if (!profileId)
    return NextResponse.json(
      { error: "profileId required" },
      { status: 400 },
    );

  const profile = await verifyProfileOwnership(profileId, user.id);
  if (!profile)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const list = await prisma.myList.findMany({
    where: { profileId },
    include: { movie: true },
    orderBy: { addedAt: "desc" },
  });

  return NextResponse.json(list.map((item) => item.movie));
}

export async function POST(req: NextRequest) {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { profileId, movieId } = await req.json();

  const profile = await verifyProfileOwnership(profileId, user.id);
  if (!profile)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  const entry = await prisma.myList.upsert({
    where: { profileId_movieId: { profileId, movieId } },
    update: {},
    create: { profileId, movieId },
  });

  return NextResponse.json(entry);
}

export async function DELETE(req: NextRequest) {
  const user = await getAuthUser();
  if (!user)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { profileId, movieId } = await req.json();

  const profile = await verifyProfileOwnership(profileId, user.id);
  if (!profile)
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });

  await prisma.myList.deleteMany({
    where: { profileId, movieId },
  });

  return NextResponse.json({ success: true });
}
