import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json(
    {
      error:
        "Stripe webhook is disabled. Payments are now handled by internal order flow.",
    },
    { status: 410 }
  );
}
