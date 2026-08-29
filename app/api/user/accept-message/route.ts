import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/db";
import * as z from "zod";

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized request!" },
        { status: 401 },
      );
    }

    const schema = z.object({
      acceptMessages: z.boolean(),
    });

    const result = schema.safeParse(await req.json());

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
        },
        { status: 400 },
      );
    }

    const { acceptMessages } = result.data;

    const userId = session.user._id;

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, error: "User not found" },
        { status: 404 },
      );
    }

    if (!user.isVerified) {
      return NextResponse.json(
        { success: false, error: "Please verify your account first!" },
        { status: 400 },
      );
    }

    user.isAcceptingMessages = acceptMessages;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "User accept messages status updated successfully!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error updating user accept messages status", error);
    return NextResponse.json(
      { success: false, error: "Failed to update user accept messages status" },
      { status: 500 },
    );
  }
}
