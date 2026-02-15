import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: "ANTHROPIC_API_KEY not configured" },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { imageData, mediaType } = body;

    if (!imageData || !mediaType) {
      return NextResponse.json(
        { error: "Missing imageData or mediaType" },
        { status: 400 }
      );
    }

    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "x-api-key": apiKey,
        "anthropic-version": "2023-06-01",
      },
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
                  data: imageData,
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

    if (!response.ok) {
      console.error("Anthropic API error:", data);
      return NextResponse.json(
        { error: "AI scan failed", details: data },
        { status: 500 }
      );
    }

    const text =
      data.content
        ?.map((b: any) => (b.type === "text" ? b.text : ""))
        .join("") || "";
    const clean = text.replace(/```json|```/g, "").trim();
    const parsed = JSON.parse(clean);

    return NextResponse.json({ success: true, result: parsed });
  } catch (err) {
    console.error("Scan error:", err);
    return NextResponse.json(
      { error: "Failed to process bet slip" },
      { status: 500 }
    );
  }
}
