import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;

    if (!id) {
      return NextResponse.json(
        { success: false, error: "User id is required!" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found!" },
        { status: 404 },
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, error: "User is not verified!" },
        { status: 400 },
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "User message acceptance status fetched successfully",
        acceptMessages: user.isAcceptingMessages,
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user accept messages status", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user accept messages status" },
      { status: 500 },
    );
  }
}
