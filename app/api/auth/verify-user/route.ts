import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

export async function POST(req: NextRequest) {
  try {
    const schema = z.object({
      identifier: z.string("Not a String!"),
      code: z
        .string("Code must be a string")
        .regex(/^\d{6}$/, "Code must be exactly 6 digits"),
    });

    const result = schema.safeParse(await req.json());

    if (result.error) {
      return NextResponse.json({
        success: false,
        error: result.error.issues[0].message,
      });
    }

    const { identifier, code } = result.data;

    await connectDB();

    const user = await User.findOne({
      $or: [
        { username: identifier.trim().toLowerCase() },
        { email: identifier.trim() },
      ],
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: "User not found!",
        },
        { status: 404 },
      );
    }

    if (user.isVerified) {
      return NextResponse.json(
        {
          success: false,
          error: "User is already verified. Please login!",
        },
        { status: 400 },
      );
    }

    const isValid = code === user.verifyCode;
    const isNotExpired =
      user.verifyCodeExpiry !== null && user.verifyCodeExpiry > new Date();

    if (isValid && isNotExpired) {
      user.isVerified = true;
      user.verifyCode = null;
      user.verifyCodeExpiry = null;
      await user.save();

      return NextResponse.json(
        { success: true, message: "User verified successfully! Please login." },
        { status: 200 },
      );
    }

    if (!isValid) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid verification code",
        },
        { status: 400 },
      );
    }

    if (!isNotExpired) {
      return NextResponse.json(
        {
          success: false,
          error: "Code has expired. Please sign up again!",
        },
        { status: 400 },
      );
    }
  } catch (error) {
    console.error("Error verifying user", error);
    return NextResponse.json(
      {
        success: false,
        error: "Failed to verify user!",
      },
      { status: 500 },
    );
  }
}
