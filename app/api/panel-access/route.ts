import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { pin } = await req.json();
  const correctPin = process.env.PANEL_PIN;
  const secret = process.env.PANEL_SECRET;

  if (!correctPin || !secret || typeof pin !== "string" || pin !== correctPin) {
    return NextResponse.json({ error: "PIN incorrecto" }, { status: 401 });
  }

  return NextResponse.json({ url: `/panel?key=${secret}` });
}
