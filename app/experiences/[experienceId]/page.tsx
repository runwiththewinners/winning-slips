import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { COMPANY_ID } from "@/lib/constants";
import type { UserAccess } from "@/lib/types";
import WinningSlipsClient from "@/components/WinningSlipsClient";

async function getUserAccess(experienceId: string): Promise<UserAccess> {
  try {
    const headersList = headers();
    let userId: string | null = null;

    try {
      const token = await whopsdk.verifyUserToken(headersList);
      userId = token.userId;
    } catch {
      return { experienceId, hasPremiumAccess: false, isAdmin: false, userId: null, tier: "FREE" };
    }

    if (!userId) {
      return { experienceId, hasPremiumAccess: false, isAdmin: false, userId: null, tier: "FREE" };
    }

    let isAdmin = false;
    try {
      const companyAccess = await whopsdk.users.checkAccess(COMPANY_ID, { id: userId });
      isAdmin = companyAccess.access_level === "admin";
    } catch { isAdmin = false; }

    return { experienceId, hasPremiumAccess: true, isAdmin, userId, tier: "ALL" };
  } catch (error) {
    console.error("Error checking user access:", error);
    return { experienceId, hasPremiumAccess: false, isAdmin: false, userId: null, tier: "FREE" };
  }
}

export default async function ExperiencePage({
  params,
}: {
  params: Promise<{ experienceId: string }>;
}) {
  const { experienceId } = await params;
  const userAccess = await getUserAccess(experienceId);
  return <WinningSlipsClient userAccess={userAccess} />;
}
