import { authOptions } from "@/app/api/auth/[...nextauth]/options";
import { Message } from "@/models/message.model";
import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";


export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized request!" },
        { status: 401 },
      );
    }

    const userId = session.user._id;

    const { id } = await params;

    const deletedMessage = await Message.findOneAndDelete({
      _id: id,
      receiver: userId,
    });

    if (!deletedMessage) {
      return NextResponse.json(
        { success: false, error: "Message already deleted or not found!" },
        { status: 404 },
      );
    }

    return NextResponse.json(
      { success: true, message: "Message deleted successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error deleting message", error);
    return NextResponse.json(
      { success: false, error: "Failed to delete message" },
      { status: 500 },
    );
  }
}
