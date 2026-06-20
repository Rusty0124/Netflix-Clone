import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/supabase/prisma";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  await prisma.user.upsert({
    where: { supabaseUserId: authUser.id },
    update: { email: authUser.email! },
    create: {
      supabaseUserId: authUser.id,
      email: authUser.email!,
      profiles: {
        create: {
          name: "Profile 1",
          avatar: "/images/netflix--avatar.png",
        },
      },
    },
  });

  return NextResponse.json({ success: true });
}
