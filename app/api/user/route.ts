import { getServerSession } from "next-auth";
import { authOptions } from "../auth/[...nextauth]/options";
import { NextRequest, NextResponse } from "next/server";
import mongoose from "mongoose";
import { User } from "@/models/user.model";
import { connectDB } from "@/lib/db";
import { Message } from "@/models/message.model";

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        { success: false, message: "Unauthorized request!" },
        {
          status: 401,
        },
      );
    }

    const searchParams = req.nextUrl.searchParams;

    const page = Number(searchParams.get("page")) || 1;

    const limit = 20;

    const skip = (page - 1) * limit;

    await connectDB();

    const userId = new mongoose.Types.ObjectId(session.user._id);

    const user = await User.aggregate([
      {
        $match: {
          _id: userId,
        },
      },
      {
        $lookup: {
          from: "messages",
          localField: "_id",
          foreignField: "receiver",
          as: "messages",
          pipeline: [
            {
              $sort: {
                createdAt: -1,
              },
            },
            {
              $skip: skip,
            },
            {
              $limit: limit,
            },
            {
              $project: {
                _id: 1,
                content: 1,
                createdAt: 1,
                updatedAt: 1,
              },
            },
          ],
        },
      },
      {
        $project: {
          username: 1,
          email: 1,
          isVerified: 1,
          isAcceptingMessages: 1,
          messages: 1,
        },
      },
    ]);

    if (!user.length) {
      return NextResponse.json(
        { success: false, error: "User not found!" },
        { status: 404 },
      );
    }

    const totalMessages = await Message.countDocuments({
      receiver: userId,
    });

    const totalPages = Math.ceil(totalMessages / limit);
    const hasNextPage = page < totalPages;

    return NextResponse.json(
      {
        success: true,
        message: "User info fetched successfully!",
        user: user[0],
        pagination: {
          page,
          limit,
          totalMessages,
          totalPages,
          hasNextPage,
        },
      },
      { status: 200 },
    );
  } catch (error) {
    console.error("Error fetching user info!", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch user info" },
      { status: 500 },
    );
  }
}
