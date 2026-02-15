"use client";

import { useState, useEffect, useCallback } from "react";
import type { WinningSlip, UserAccess } from "@/lib/types";

const SPORTS_ICONS: Record<string, string> = {
  NBA: "🏀", NFL: "🏈", NCAAB: "🏀", NCAAF: "🏈",
  MLB: "⚾", NHL: "🏒", Soccer: "⚽", UFC: "🥊", Tennis: "🎾",
};

// ─── Slip Card ───────────────────────────────────────────────────
function SlipCard({
  slip,
  isAdmin,
  onDelete,
  onExpand,
}: {
  slip: WinningSlip;
  isAdmin: boolean;
  onDelete: (id: string) => void;
  onExpand: (slip: WinningSlip) => void;
}) {
  return (
    <div
      style={{
        background: "rgba(34, 197, 94, 0.06)",
        border: "1px solid rgba(34, 197, 94, 0.25)",
        borderRadius: 16,
        overflow: "hidden",
        animation: "fadeSlideIn 0.5s ease forwards",
      }}
    >
      <div
        style={{
          height: 3,
          background: "linear-gradient(90deg, transparent, #22c55e, transparent)",
        }}
      />

      <div style={{ padding: "20px 24px" }}>
        {/* Header */}
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "flex-start",
            marginBottom: 16,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 20 }}>
              {SPORTS_ICONS[slip.sport] || "🎯"}
            </span>
            <div>
              <div
                style={{
                  fontSize: 11,
                  fontFamily: "'Courier Prime', monospace",
                  color: "#22c55e",
                  letterSpacing: 2,
                  textTransform: "uppercase",
                }}
              >
                {slip.sport}
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  fontFamily: "'Courier Prime', monospace",
                }}
              >
                {slip.postedAt}
              </div>
            </div>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span
              style={{
                fontSize: 11,
                fontFamily: "'Courier Prime', monospace",
                color: "#22c55e",
                background: "rgba(34,197,94,0.12)",
                border: "1px solid rgba(34,197,94,0.3)",
                borderRadius: 6,
                padding: "3px 8px",
                letterSpacing: 1,
                fontWeight: 700,
              }}
            >
              WIN ✓
            </span>
            {isAdmin && (
              <button
                onClick={() => onDelete(slip.id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "#4b5563",
                  fontSize: 16,
                  cursor: "pointer",
                  padding: "0 4px",
                }}
              >
                ×
              </button>
            )}
          </div>
        </div>

        {/* Screenshot */}
        <div
          onClick={() => onExpand(slip)}
          style={{
            borderRadius: 12,
            overflow: "hidden",
            marginBottom: 16,
            cursor: "pointer",
            border: "1px solid rgba(255,255,255,0.08)",
          }}
        >
          <img
            src={slip.imageData}
            alt="Winning slip"
            style={{
              width: "100%",
              display: "block",
              borderRadius: 12,
            }}
          />
        </div>

        {/* AI-read details */}
        <div style={{ marginBottom: 12 }}>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "baseline",
            }}
          >
            <div
              style={{
                fontSize: 22,
                fontWeight: 800,
                color: "#f5f5f5",
                fontFamily: "'Oswald', sans-serif",
                textTransform: "uppercase",
                letterSpacing: 0.5,
              }}
            >
              {slip.pick}
            </div>
            <div
              style={{
                fontSize: 24,
                fontWeight: 800,
                color: "#22c55e",
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              {slip.odds}
            </div>
          </div>
        </div>

        {/* Matchup + Payout */}
        <div
          style={{
            paddingTop: 12,
            borderTop: "1px solid rgba(255,255,255,0.06)",
          }}
        >
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginBottom: 10,
            }}
          >
            <span
              style={{
                fontSize: 13,
                color: "#d4a843",
                fontFamily: "'Courier Prime', monospace",
              }}
            >
              {slip.matchup}
            </span>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(34, 197, 94, 0.08)",
              border: "1px solid rgba(34, 197, 94, 0.15)",
            }}
          >
            <div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "'Oswald', sans-serif",
                  color: "#6b7280",
                  letterSpacing: 2,
                  marginBottom: 2,
                }}
              >
                WAGER
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700,
                  color: "#f5f5f5",
                }}
              >
                {slip.wager}
              </div>
            </div>
            <div
              style={{
                fontSize: 20,
                color: "#22c55e",
                fontFamily: "'Oswald', sans-serif",
              }}
            >
              →
            </div>
            <div style={{ textAlign: "right" }}>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "'Oswald', sans-serif",
                  color: "#6b7280",
                  letterSpacing: 2,
                  marginBottom: 2,
                }}
              >
                PAYOUT
              </div>
              <div
                style={{
                  fontSize: 16,
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 700,
                  color: "#22c55e",
                }}
              >
                {slip.payout}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── Lightbox ────────────────────────────────────────────────────
function Lightbox({
  slip,
  onClose,
}: {
  slip: WinningSlip;
  onClose: () => void;
}) {
  return (
    <div
      onClick={onClose}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 2000,
        background: "rgba(0,0,0,0.9)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 20,
        cursor: "pointer",
      }}
    >
      <button
        onClick={onClose}
        style={{
          position: "absolute",
          top: 20,
          right: 20,
          background: "none",
          border: "none",
          color: "#f5f5f5",
          fontSize: 28,
          cursor: "pointer",
        }}
      >
        ×
      </button>
      <img
        src={slip.imageData}
        alt="Winning slip"
        style={{
          maxWidth: "100%",
          maxHeight: "90vh",
          borderRadius: 12,
          objectFit: "contain",
        }}
        onClick={(e) => e.stopPropagation()}
      />
    </div>
  );
}

// ─── Admin Upload Panel ──────────────────────────────────────────
function AdminPanel({
  onPost,
  onClose,
}: {
  onPost: (data: any) => void;
  onClose: () => void;
}) {
  const [pick, setPick] = useState("");
  const [odds, setOdds] = useState("");
  const [sport, setSport] = useState("");
  const [matchup, setMatchup] = useState("");
  const [wager, setWager] = useState("");
  const [payout, setPayout] = useState("");
  const [imageData, setImageData] = useState<string | null>(null);
  const [scanning, setScanning] = useState(false);
  const [scanError, setScanError] = useState("");

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanError("");
    setScanning(true);

    const reader = new FileReader();
    reader.onload = async (ev) => {
      const base64Full = ev.target?.result as string;
      setImageData(base64Full);
      const base64Data = base64Full.split(",")[1];
      const mediaType = file.type || "image/png";

      try {
        const response = await fetch("https://api.anthropic.com/v1/messages", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "claude-sonnet-4-20250514",
            max_tokens: 1000,
            messages: [
              {
                role: "user",
                content: [
                  {
                    type: "image",
                    source: {
                      type: "base64",
                      media_type: mediaType,
                      data: base64Data,
                    },
                  },
                  {
                    type: "text",
                    text: `You are reading a sportsbook winning bet slip screenshot. Extract the following fields and respond ONLY with a JSON object, no markdown, no backticks, no explanation:

{
  "pick": "The pick/team and line, e.g. 'Nolan Winter (WIS) 10+ Rebounds' or 'Duke -9.5'",
  "odds": "The odds e.g. '+176' or '-192'",
  "sport": "One of: NCAAB, NBA, NFL, NCAAF, NHL, MLB, Soccer, UFC, Tennis",
  "matchup": "The teams playing, e.g. 'Michigan State vs Wisconsin'",
  "wager": "Total amount wagered, e.g. '$2,000.00'",
  "payout": "Amount won, e.g. '$5,520.00'"
}

Be precise. Use the exact names shown on the slip.`,
                  },
                ],
              },
            ],
          }),
        });

        const data = await response.json();
        const text =
          data.content
            ?.map((b: any) => (b.type === "text" ? b.text : ""))
            .join("") || "";
        const clean = text.replace(/```json|```/g, "").trim();
        const parsed = JSON.parse(clean);

        if (parsed.pick) setPick(parsed.pick);
        if (parsed.odds) setOdds(parsed.odds);
        if (parsed.sport) setSport(parsed.sport);
        if (parsed.matchup) setMatchup(parsed.matchup);
        if (parsed.wager) setWager(parsed.wager);
        if (parsed.payout) setPayout(parsed.payout);
      } catch (err) {
        console.error("Scan error:", err);
        setScanError(
          "Couldn't read that slip. Try a clearer screenshot or fill in manually."
        );
      }
      setScanning(false);
    };
    reader.readAsDataURL(file);
  };

  const handlePost = () => {
    if (!imageData || !pick) return;
    onPost({ imageData, pick, odds, sport, matchup, wager, payout });
    setPick("");
    setOdds("");
    setSport("");
    setMatchup("");
    setWager("");
    setPayout("");
    setImageData(null);
  };

  const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "12px 14px",
    borderRadius: 10,
    border: "1px solid rgba(255,255,255,0.1)",
    background: "rgba(255,255,255,0.04)",
    color: "#f5f5f5",
    fontSize: 14,
    fontFamily: "'Courier Prime', monospace",
    outline: "none",
    boxSizing: "border-box",
  };

  const labelStyle: React.CSSProperties = {
    fontSize: 10,
    fontFamily: "'Oswald', sans-serif",
    color: "#22c55e",
    letterSpacing: 2,
    textTransform: "uppercase",
    marginBottom: 6,
    display: "block",
  };

  return (
    <div
      style={{
        background: "rgba(0,0,0,0.5)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(34, 197, 94, 0.2)",
        borderRadius: 20,
        padding: 28,
        marginBottom: 28,
        animation: "fadeSlideIn 0.4s ease forwards",
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 24,
        }}
      >
        <div
          style={{
            fontSize: 18,
            fontFamily: "'Oswald', sans-serif",
            fontWeight: 700,
            color: "#22c55e",
            letterSpacing: 3,
            textTransform: "uppercase",
          }}
        >
          🏆 Post Winning Slip
        </div>
        <button
          onClick={onClose}
          style={{
            background: "none",
            border: "none",
            color: "#6b7280",
            fontSize: 22,
            cursor: "pointer",
          }}
        >
          ×
        </button>
      </div>

      {/* Upload */}
      <div style={{ marginBottom: 20 }}>
        <label
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            padding: imageData ? "12px" : "28px 20px",
            borderRadius: 14,
            border: scanning
              ? "2px solid rgba(34,197,94,0.5)"
              : "2px dashed rgba(255,255,255,0.12)",
            background: scanning
              ? "rgba(34,197,94,0.06)"
              : "rgba(255,255,255,0.02)",
            cursor: "pointer",
            transition: "all 0.3s ease",
            overflow: "hidden",
          }}
        >
          <input
            type="file"
            accept="image/*"
            onChange={handleUpload}
            style={{ display: "none" }}
          />
          {scanning ? (
            <div style={{ textAlign: "center" }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🤖</div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "'Oswald', sans-serif",
                  color: "#22c55e",
                  letterSpacing: 2,
                }}
              >
                SCANNING WINNING SLIP...
              </div>
            </div>
          ) : imageData ? (
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 16,
                width: "100%",
              }}
            >
              <img
                src={imageData}
                alt="Slip preview"
                style={{
                  width: 80,
                  height: 80,
                  objectFit: "cover",
                  borderRadius: 8,
                  border: "1px solid rgba(255,255,255,0.1)",
                }}
              />
              <div>
                <div
                  style={{
                    fontSize: 12,
                    fontFamily: "'Oswald', sans-serif",
                    color: "#22c55e",
                    letterSpacing: 2,
                  }}
                >
                  ✓ SLIP SCANNED
                </div>
                <div style={{ fontSize: 11, color: "#6b7280" }}>
                  Review details below — tap to re-upload
                </div>
              </div>
            </div>
          ) : (
            <>
              <div style={{ fontSize: 28, marginBottom: 8 }}>🏆</div>
              <div
                style={{
                  fontSize: 13,
                  fontFamily: "'Oswald', sans-serif",
                  color: "#22c55e",
                  letterSpacing: 2,
                  marginBottom: 4,
                }}
              >
                UPLOAD WINNING SLIP
              </div>
              <div
                style={{
                  fontSize: 11,
                  color: "#6b7280",
                  textAlign: "center",
                  lineHeight: 1.5,
                }}
              >
                Drop a screenshot of your winning bet
                <br />
                AI will auto-read the details
              </div>
            </>
          )}
        </label>
        {scanError && (
          <div
            style={{
              marginTop: 8,
              padding: "10px 14px",
              borderRadius: 10,
              background: "rgba(239,68,68,0.08)",
              border: "1px solid rgba(239,68,68,0.2)",
              color: "#ef4444",
              fontSize: 12,
            }}
          >
            {scanError}
          </div>
        )}
      </div>

      {/* Form fields (pre-filled by AI) */}
      {imageData && (
        <>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Pick</label>
              <input
                style={inputStyle}
                placeholder="e.g. Nolan Winter 10+ Reb"
                value={pick}
                onChange={(e) => setPick(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Odds</label>
              <input
                style={inputStyle}
                placeholder="e.g. +176"
                value={odds}
                onChange={(e) => setOdds(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 16,
            }}
          >
            <div>
              <label style={labelStyle}>Sport</label>
              <input
                style={inputStyle}
                placeholder="e.g. NCAAB"
                value={sport}
                onChange={(e) => setSport(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Matchup</label>
              <input
                style={inputStyle}
                placeholder="e.g. Michigan State vs Wisconsin"
                value={matchup}
                onChange={(e) => setMatchup(e.target.value)}
              />
            </div>
          </div>

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: 16,
              marginBottom: 20,
            }}
          >
            <div>
              <label style={labelStyle}>Wager</label>
              <input
                style={inputStyle}
                placeholder="e.g. $2,000.00"
                value={wager}
                onChange={(e) => setWager(e.target.value)}
              />
            </div>
            <div>
              <label style={labelStyle}>Payout</label>
              <input
                style={inputStyle}
                placeholder="e.g. $5,520.00"
                value={payout}
                onChange={(e) => setPayout(e.target.value)}
              />
            </div>
          </div>

          <button
            onClick={handlePost}
            disabled={!imageData || !pick}
            style={{
              width: "100%",
              padding: "14px",
              borderRadius: 12,
              border: "none",
              background:
                !imageData || !pick
                  ? "rgba(255,255,255,0.05)"
                  : "linear-gradient(135deg, #16a34a, #22c55e)",
              color: !imageData || !pick ? "#4b5563" : "#0a0a0a",
              fontSize: 14,
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 700,
              letterSpacing: 3,
              textTransform: "uppercase",
              cursor: !imageData || !pick ? "not-allowed" : "pointer",
              transition: "all 0.3s ease",
            }}
          >
            Post Winner 🏆
          </button>
        </>
      )}
    </div>
  );
}

// ─── Main Component ──────────────────────────────────────────────
export default function WinningSlipsClient({
  userAccess,
}: {
  userAccess: UserAccess;
}) {
  const [slips, setSlips] = useState<WinningSlip[]>([]);
  const [showAdmin, setShowAdmin] = useState(false);
  const [expandedSlip, setExpandedSlip] = useState<WinningSlip | null>(null);
  const [loading, setLoading] = useState(true);

  const { isAdmin } = userAccess;

  const fetchSlips = useCallback(async () => {
    try {
      const res = await fetch("/api/plays");
      if (res.ok) {
        const data = await res.json();
        setSlips(data.slips);
      }
    } catch (err) {
      console.error("Error fetching slips:", err);
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchSlips();
    const interval = setInterval(fetchSlips, 30000);
    return () => clearInterval(interval);
  }, [fetchSlips]);

  const handlePost = async (slipData: any) => {
    try {
      const res = await fetch("/api/plays", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(slipData),
      });

      if (res.ok) {
        const data = await res.json();
        setSlips((prev) => [data.slip, ...prev]);
        setShowAdmin(false);
      }
    } catch (err) {
      console.error("Error posting slip:", err);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const res = await fetch("/api/plays", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id }),
      });

      if (res.ok) {
        setSlips((prev) => prev.filter((s) => s.id !== id));
      }
    } catch (err) {
      console.error("Error deleting slip:", err);
    }
  };

  // Calculate total winnings
  const totalPayout = slips.reduce((sum, slip) => {
    const num = parseFloat(slip.payout.replace(/[$,]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const totalWager = slips.reduce((sum, slip) => {
    const num = parseFloat(slip.wager.replace(/[$,]/g, ""));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const totalProfit = totalPayout - totalWager;

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "#0a0a0a",
        color: "#f5f5f5",
        fontFamily: "'Courier Prime', monospace",
      }}
    >
      <style>{`
        @keyframes fadeSlideIn {
          from { opacity: 0; transform: translateY(12px); }
          to { opacity: 1; transform: translateY(0); }
        }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: rgba(34,197,94,0.3); border-radius: 3px; }
      `}</style>

      {/* Lightbox */}
      {expandedSlip && (
        <Lightbox slip={expandedSlip} onClose={() => setExpandedSlip(null)} />
      )}

      {/* Background */}
      <div
        style={{
          position: "fixed",
          inset: 0,
          backgroundImage:
            "radial-gradient(ellipse at 50% 0%, rgba(34,197,94,0.04) 0%, transparent 60%)",
          pointerEvents: "none",
        }}
      />

      <div
        style={{
          maxWidth: 640,
          margin: "0 auto",
          padding: "40px 20px 80px",
          position: "relative",
        }}
      >
        {/* Header */}
        <div
          style={{
            textAlign: "center",
            marginBottom: 36,
            animation: "fadeSlideIn 0.5s ease forwards",
          }}
        >
          <div
            style={{
              display: "inline-block",
              fontSize: 10,
              fontFamily: "'Oswald', sans-serif",
              color: "#22c55e",
              letterSpacing: 4,
              textTransform: "uppercase",
              border: "1px solid rgba(34,197,94,0.3)",
              borderRadius: 100,
              padding: "6px 20px",
              marginBottom: 20,
              background: "rgba(34,197,94,0.06)",
            }}
          >
            Live Feed
          </div>

          <h1
            style={{
              fontSize: 52,
              fontFamily: "'Oswald', sans-serif",
              fontWeight: 800,
              lineHeight: 1,
              textTransform: "uppercase",
              marginBottom: 4,
            }}
          >
            <span
              style={{
                background:
                  "linear-gradient(135deg, #16a34a, #22c55e, #4ade80)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Winning Slips
            </span>
          </h1>

          <p
            style={{
              fontSize: 14,
              color: "#6b7280",
              maxWidth: 380,
              margin: "12px auto 0",
              lineHeight: 1.6,
            }}
          >
            FlareGotLocks winning plays.
          </p>
        </div>

        {/* Stats */}
        {slips.length > 0 && (
          <div
            style={{
              display: "flex",
              gap: 12,
              marginBottom: 24,
            }}
          >
            <div
              style={{
                flex: 1,
                textAlign: "center",
                padding: "14px 12px",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  fontFamily: "'Oswald', sans-serif",
                  color: "#22c55e",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                {slips.length}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "'Oswald', sans-serif",
                  color: "#22c55e",
                  letterSpacing: 2,
                  opacity: 0.7,
                }}
              >
                WINS
              </div>
            </div>
            <div
              style={{
                flex: 1,
                textAlign: "center",
                padding: "14px 12px",
                background: "rgba(34,197,94,0.08)",
                border: "1px solid rgba(34,197,94,0.25)",
                borderRadius: 12,
              }}
            >
              <div
                style={{
                  fontSize: 28,
                  fontWeight: 800,
                  fontFamily: "'Oswald', sans-serif",
                  color: "#22c55e",
                  lineHeight: 1,
                  marginBottom: 4,
                }}
              >
                ${totalProfit.toLocaleString("en-US", { minimumFractionDigits: 0, maximumFractionDigits: 0 })}
              </div>
              <div
                style={{
                  fontSize: 10,
                  fontFamily: "'Oswald', sans-serif",
                  color: "#22c55e",
                  letterSpacing: 2,
                  opacity: 0.7,
                }}
              >
                PROFIT
              </div>
            </div>
          </div>
        )}

        {/* Admin controls */}
        {isAdmin && (
          <div style={{ marginBottom: 24 }}>
            {showAdmin ? (
              <AdminPanel
                onPost={handlePost}
                onClose={() => setShowAdmin(false)}
              />
            ) : (
              <button
                onClick={() => setShowAdmin(true)}
                style={{
                  width: "100%",
                  padding: "14px",
                  borderRadius: 14,
                  border: "1px solid rgba(34,197,94,0.2)",
                  background: "rgba(34,197,94,0.06)",
                  color: "#22c55e",
                  fontSize: 13,
                  fontFamily: "'Oswald', sans-serif",
                  fontWeight: 600,
                  letterSpacing: 3,
                  textTransform: "uppercase",
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                }}
              >
                🏆 Post Winning Slip
              </button>
            )}
          </div>
        )}

        {/* Loading */}
        {loading ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#6b7280",
              fontSize: 14,
            }}
          >
            Loading slips...
          </div>
        ) : slips.length === 0 ? (
          <div
            style={{
              textAlign: "center",
              padding: "60px 20px",
              color: "#4b5563",
              fontSize: 14,
            }}
          >
            No winning slips posted yet.
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {slips.map((slip) => (
              <SlipCard
                key={slip.id}
                slip={slip}
                isAdmin={isAdmin}
                onDelete={handleDelete}
                onExpand={setExpandedSlip}
              />
            ))}
          </div>
        )}

        {/* Footer */}
        <div
          style={{
            textAlign: "center",
            marginTop: 48,
            paddingTop: 24,
            borderTop: "1px solid rgba(255,255,255,0.05)",
          }}
        >
          <div
            style={{
              fontSize: 11,
              color: "#374151",
              fontFamily: "'Oswald', sans-serif",
              letterSpacing: 3,
              textTransform: "uppercase",
            }}
          >
            FlareGotLocks
          </div>
        </div>
      </div>
    </div>
  );
}
