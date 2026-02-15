import { headers } from "next/headers";
import { whopsdk } from "@/lib/whop-sdk";
import { COMPANY_ID } from "@/lib/constants";
import type { UserAccess } from "@/lib/types";
import WinningSlipsClient from "@/components/WinningSlipsClient";

async function getUserAccess(): Promise<UserAccess> {
  try {
    const headersList = headers();
    const { userId } = await whopsdk.verifyUserToken(headersList);

    if (!userId) {
      return {
        hasPremiumAccess: false,
        isAdmin: false,
        userId: null,
        tier: "FREE",
      };
    }

    let isAdmin = false;
    try {
      const companyAccess = await whopsdk.users.checkAccess(COMPANY_ID, {
        id: userId,
      });
      isAdmin = companyAccess.access_level === "admin";
    } catch {
      isAdmin = false;
    }

    return { hasPremiumAccess: true, isAdmin, userId, tier: "ALL" };
  } catch (error) {
    console.error("Error checking user access:", error);
    return {
      hasPremiumAccess: false,
      isAdmin: false,
      userId: null,
      tier: "FREE",
    };
  }
}

export default async function Page() {
  const userAccess = await getUserAccess();
  return <WinningSlipsClient userAccess={userAccess} />;
}
