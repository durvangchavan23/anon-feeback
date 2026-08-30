import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

const schema = z
  .string("Username must be a string")
  .min(4, {
    error: (iss) => `Username must be at least ${iss.minimum} characters!`,
  })
  .max(10, {
    error: (iss) => `Username can be at most ${iss.maximum} characters!`,
  })
  .regex(/^[a-z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/, {
    error:
      "Username can contain only lowercase letters and special characters!",
  });

export async function GET(req: NextRequest) {
  console.log("🔥 API HIT");
  try {
    const { searchParams } = req.nextUrl;
    const usernameParam = searchParams.get("username");
    if (!usernameParam) {
      return NextResponse.json(
        {
          success: false,
          error: "Username is required!",
        },
        { status: 400 },
      );
    }

    const result = schema.safeParse(usernameParam);
    if (!result.success) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const username = result.data.trim().toLowerCase();
    await connectDB();
    const user = await User.findOne({
      username,
      isVerified: true,
    });
    if (user) {
      return NextResponse.json(
        {
          success: false,
          message: "Username is taken!",
        },
        { status: 200 },
      );
    }
    return NextResponse.json(
      {
        success: true,
        message: "Username is unique!",
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error checking username:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to check username",
      },
      { status: 500 },
    );
  }
}
