import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { prisma } from "@/lib/supabase/prisma";
import Header from "@/components/Header";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const {
    data: { user: authUser },
  } = await supabase.auth.getUser();

  if (!authUser) redirect("/login");

  const user = await prisma.user.findUnique({
    where: { supabaseUserId: authUser.id },
  });

  if (user?.role !== "ADMIN") redirect("/");

  return (
    <div className="min-h-screen bg-[#141414]">
      <Header />
      <div className="pt-16">{children}</div>
    </div>
  );
}
