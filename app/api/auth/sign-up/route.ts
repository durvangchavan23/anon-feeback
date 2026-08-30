import { connectDB } from "@/lib/db";
import { IUser, User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";
import * as z from "zod";

export async function POST(req: NextRequest) {
  try {
    const schema = z.object({
      username: z
        .string("Username must be a string")
        .min(4, {
          error: (iss) =>
            `Username must be at least ${iss.minimum} characters!`,
        })
        .max(10, {
          error: (iss) => `Username can be at most ${iss.maximum} characters!`,
        })
        .regex(/^[a-z!@#$%^&*()_+\-=\[\]{};':"\\|,.<>/?`~]+$/, {
          error:
            "Username can contain only lowercase letters and special characters!",
        }),
      email: z.string("Email must be a string").email({
        error: "Please enter a valid email address!",
      }),

      password: z
        .string("Password must be a string")
        .min(4, {
          error: (iss) =>
            `Password must be at least ${iss.minimum} characters!`,
        })
        .max(10, {
          error: (iss) => `Password can be at most ${iss.maximum} characters!`,
        }),
    });

    const result = schema.safeParse(await req.json());

    if (result.error) {
      return NextResponse.json(
        {
          success: false,
          error: result.error.issues[0].message,
        },
        { status: 400 },
      );
    }

    const { username, email, password } = result.data;

    await connectDB();

    const existingUserVerifiedByUsername = await User.findOne({
      username: username,
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
      {
        success: true,
        message: "User registered successfully! Please verify your account.",
      },
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
