import { NextRequest, NextResponse } from "next/server";
import { whopsdk } from "@/lib/whop-sdk";
import { COMPANY_ID } from "@/lib/constants";
import { redisGet, redisSet } from "@/lib/redis";
import type { WinningSlip } from "@/lib/types";

const SLIPS_KEY = "winning-slips:slips";

async function getSlips(): Promise<WinningSlip[]> {
  const slips = await redisGet(SLIPS_KEY);
  return slips || [];
}

async function saveSlips(slips: WinningSlip[]): Promise<void> {
  await redisSet(SLIPS_KEY, slips);
}

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
  const slips = await getSlips();
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

  const slips = await getSlips();
  slips.unshift(newSlip);
  await saveSlips(slips);
  return NextResponse.json({ slip: newSlip, success: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getUser(request);
  if (!user.isAdmin) {
    return NextResponse.json({ error: "Admin access required" }, { status: 403 });
  }

  const body = await request.json();
  const { id } = body;
  let slips = await getSlips();
  slips = slips.filter((s) => s.id !== id);
  await saveSlips(slips);
  return NextResponse.json({ success: true });
}
