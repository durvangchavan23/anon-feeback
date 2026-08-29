import { getServerSession } from "next-auth";
import { NextRequest, NextResponse } from "next/server";
import { authOptions } from "../../auth/[...nextauth]/options";
import * as z from "zod";
import { connectDB } from "@/lib/db";
import { Message } from "@/models/message.model";

const messageSchema = z.object({
  receiver: z.string().regex(/^[0-9a-fA-F]{24}$/, {
    error: "Invalid receiver ID!",
  }),

  content: z
    .string("Message must be a string")
    .min(1, {
      error: "Message cannot be empty!",
    })
    .max(500, {
      error: "Message cannot be longer than 500 characters!",
    })
    .trim(),
});

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, error: "Unauthorized request" },
        { status: 401 },
      );
    }

    const result = messageSchema.safeParse(await req.json());

    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const { receiver, content } = result.data;

    const sender = session.user._id;

    await connectDB();

    const message = await Message.create({
      sender,
      receiver,
      content,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Message sent successfully!",
        data: message,
      },
      { status: 201 },
    );
  } catch (error) {
    console.error("Error sending message", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to send message",
      },
      { status: 500 },
    );
  }
}
