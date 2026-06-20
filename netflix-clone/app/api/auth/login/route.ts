import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/supabase/prisma";

export async function POST() {
  try {
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (!user) {
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    await prisma.user.upsert({
      where: { supabaseUserId: user.id },
      update: { email: user.email! },
      create: {
        supabaseUserId: user.id,
        email: user.email!,
        profiles: {
          create: {
            name: "Profile 1",
            avatar: "/images/netflix--avatar.png",
          },
        },
      },
    });

    return NextResponse.json({ message: "Login successful" });
  } catch (error) {
    console.error("Login route error:", error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    );
  }
}
