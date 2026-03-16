import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

import { SIGN_IN_ROUTE } from "@/constants/routes.constants";

type RequireAuthResult = {
  userId: string;
};

export async function requireAuth(): Promise<RequireAuthResult> {
  const { userId }: { userId: string | null } = await auth();
  if (userId === null) {
    redirect(SIGN_IN_ROUTE);
  }
  return { userId };
}
