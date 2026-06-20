import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/supabase/prisma";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ profileId: string }> },
) {
  const { profileId } = await params;

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

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.profile.findFirst({
    where: { id: profileId, userId: user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const fields = await req.json();
  const profile = await prisma.profile.update({
    where: { id: profileId },
    data: fields,
  });

  return NextResponse.json(profile);
}

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ profileId: string }> },
) {
  const { profileId } = await params;

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

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  const existing = await prisma.profile.findFirst({
    where: { id: profileId, userId: user.id },
  });

  if (!existing) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const profileCount = await prisma.profile.count({
    where: { userId: user.id },
  });

  if (profileCount <= 1) {
    return NextResponse.json(
      { error: "Cannot delete last profile" },
      { status: 400 },
    );
  }

  await prisma.profile.delete({ where: { id: profileId } });

  return NextResponse.json({ success: true });
}
