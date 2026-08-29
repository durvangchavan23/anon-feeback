import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { Message } from "@/models/message.model";
import { authOptions } from "../auth/[...nextauth]/options";
import { connectDB } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized request" },
        { status: 401 },
      );
    }

    await connectDB();

    const messages = await Message.find({
      receiver: session.user._id,
    }).sort({ createdAt: -1 });

    return NextResponse.json(
      { success: true, message: "Messages fetched successfully!", messages },
      { status: 200 },
    );
  } catch (error) {
    console.log("Error fetching messages", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch messages" },
      { status: 500 },
    );
  }
}
