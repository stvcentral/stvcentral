import { NextResponse } from "next/server";
import { calculateFairDeal, calculateHumanContribution } from "../../../../lib/fairDeal.mjs";

export async function POST(request) {
  try {
    const body = await request.json();
    const human = calculateHumanContribution(body.human ?? {});
    const calculation = calculateFairDeal({
      ...(body.values ?? {}),
      directDelivered: body.values?.directDelivered ?? human.kwk,
    });

    return NextResponse.json({ human, calculation });
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : "Invalid Fair Deal request." },
      { status: 400 },
    );
  }
}
