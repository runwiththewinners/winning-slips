export interface WinningSlip {
  id: string;
  imageData: string;
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
  experienceId?: string;
  hasPremiumAccess: boolean;
  isAdmin: boolean;
  userId: string | null;
  tier: string;
}
