export interface WinningSlip {
  id: string;
  imageData: string; // base64 image
  pick: string;
  odds: string;
  sport: string;
  matchup: string;
  wager: string;
  payout: string;
  postedAt: string;
  createdAt: number;
}

export interface UserAccess {
  hasPremiumAccess: boolean;
  isAdmin: boolean;
  userId: string | null;
  tier: string;
}
