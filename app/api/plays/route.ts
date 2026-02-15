import { NextRequest, NextResponse } from "next/server";
import { whopsdk } from "@/lib/whop-sdk";
import { COMPANY_ID } from "@/lib/constants";
import type { WinningSlip } from "@/lib/types";

let slips: WinningSlip[] = [];

async function getUser(request: NextRequest): Promise<{
  userId: string | null;
  isAdmin: boolean;
}> {
  try {
    const { userId } = await whopsdk.verifyUserToken(request.headers);
    if (!userId) return { userId: null, isAdmin: false };

    let isAdmin = false;
    try {
      const companyAccess = await whopsdk.users.checkAccess(COMPANY_ID, { id: userId });
      isAdmin = companyAccess.access_level === "admin";
    } catch { isAdmin = false; }

    return { userId, isAdmin };
  } catch {
    return { userId: null, isAdmin: false };
  }
}

export async function GET(request: NextRequest) {
  const user = await getUser(request);
  if (!user.userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  return NextResponse.json({ slips, isAdmin: user.isAdmin });
}

export async function POST(request: NextRequest) {
  const user = await getUser(request);
  if (!user.isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const newSlip: WinningSlip = {
    id: `slip_${Date.now()}`,
    imageData: body.imageData,
    pick: body.pick,
    odds: body.odds,
    sport: body.sport,
    matchup: body.matchup,
    wager: body.wager,
    payout: body.payout,
    postedAt: new Date().toLocaleString("en-US", {
      month: "short", day: "numeric", hour: "numeric", minute: "2-digit",
      hour12: true, timeZone: "America/New_York",
    }) + " ET",
    createdAt: Date.now(),
  };

  slips.unshift(newSlip);
  return NextResponse.json({ slip: newSlip, success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getUser(request);
  if (!user.isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const { id } = body;
  slips = slips.filter((s) => s.id !== id);
  return NextResponse.json({ success: true });
}
