import { connectDB } from "@/lib/db";
import { IUser, User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export async function POST(req: NextRequest) {
  try {
    const { username, email, password } = await req.json();

    if ([username, email, password].some((field) => field.trim() === "")) {
      return NextResponse.json(
        { success: false, error: "Missing required fields!" },
        { status: 400 },
      );
    }

    await connectDB();

    const existingUserVerifiedByUsername = await User.findOne({
      username: username.trim().toLowerCase(),
      isVerified: true,
    });

    if (existingUserVerifiedByUsername) {
      return NextResponse.json(
        { success: false, error: "Username is already taken" },
        { status: 400 },
      );
    }

    const hashedPassword = await bcrypt.hash(password, 12);
    const verifyCode = crypto.randomInt(100000, 1000000).toString();

    const verifyCodeExpiry = new Date(Date.now() + 60 * 60 * 1000);
    const existingUserWithEmail = await User.findOne({ email: email.trim() });

    if (existingUserWithEmail) {
      if (existingUserWithEmail.isVerified) {
        return NextResponse.json(
          { success: false, error: "Email is already taken" },
          { status: 400 },
        );
      } else {
        existingUserWithEmail.username = username.trim().toLowerCase();
        existingUserWithEmail.password = hashedPassword;
        existingUserWithEmail.verifyCode = verifyCode;
        existingUserWithEmail.verifyCodeExpiry = verifyCodeExpiry;
        existingUserWithEmail.isAcceptingMessages = true;
        existingUserWithEmail.isVerified = false;

        await existingUserWithEmail.save();
      }
    } else {
      const newUser = new User<IUser>({
        username: username.trim().toLowerCase(),
        email: email.trim(),
        password: hashedPassword,
        verifyCode,
        verifyCodeExpiry,
        isAcceptingMessages: true,
        isVerified: false,
      });

      await newUser.save();
    }

    return NextResponse.json(
      { success: true, message: "User registered successfully!" },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error registering user", error);
    return NextResponse.json(
      { success: false, error: "Failed to register user" },
      { status: 500 },
    );
  }
}
