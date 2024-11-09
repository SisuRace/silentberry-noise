import { auth } from "@/lib/auth/auth";
import { db } from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const id = (await params).id;
    const data = await request.json();
    const session = await auth();

    const updatedProposal = await db.proposal.update({
      where: { id: id, creatorId: session?.user.id, status: "DRAFT" },
      data,
    });

    return NextResponse.json(updatedProposal);
  } catch (error) {
    console.error("Failed to update proposal:", error);
    return NextResponse.json(
      { error: "Failed to update proposal" },
      { status: 500 }
    );
  }
}
