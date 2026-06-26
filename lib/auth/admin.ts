import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/auth/server";

export async function requireAdmin() {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login?next=/admin");
  }

  if (user.role !== "ADMIN") {
    redirect("/");
  }

  return user;
}
