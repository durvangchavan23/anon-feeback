import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/db";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ username: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized request" },
        { status: 401 },
      );
    }

    const { username } = await params;

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username is required!" },
        { status: 400 },
      );
    }

    await connectDB();

    const user = await User.findOne({
      username: username.toString().toLowerCase(),
      isVerified: true,
    });

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found!" },
        { status: 404 },
      );
    }

    const userInfo = {
      userId: user._id.toString(),
      acceptMessageStatus: user.isAcceptingMessages,
    };

    return NextResponse.json({
      success: true,
      message: "User info fetched successfully!",
      userInfo,
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: "Failed to fetch user info" },
      { status: 500 },
    );
  }
}
