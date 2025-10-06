import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { ReactNode } from "react";

export default async function AdminAuthWrapper({
  children,
}: {
  children: ReactNode;
}) {
  const session = await getServerSession(authOptions);

  // If no session or not admin role, redirect to login
  if (!session || session.user.role !== "admin") {
    redirect("/login");
  }

  return <>{children}</>;
}
