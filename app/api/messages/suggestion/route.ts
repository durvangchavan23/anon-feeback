import { GoogleGenAI } from "@google/genai";
import * as z from "zod";

import { authOptions } from "../../auth/[...nextauth]/options";
import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const suggestionsSchema = z.object({
  suggestions: z.array(z.string()).length(6),
});

export async function GET() {
  try {
    const session = await getServerSession(authOptions);

    if (!session || !session.user) {
      return NextResponse.json(
        {
          success: false,
          error: "Unauthorized request!",
        },
        {
          status: 401,
        },
      );
    }

    const interaction = await ai.interactions.create({
      model: "gemini-3.7-flash",

      input: `
Generate exactly 6 short and interesting anonymous messages
that someone could send to another person.

Make them natural conversation starters.

Include a variety of:
- fun questions
- hobbies
- goals
- opinions
- personality
- everyday life

Rules:
- Generate exactly 6 messages.
- Each message should be short.
- Each message should be friendly and casual.
- Each message should be appropriate for a general audience.
- Do not number the messages.
- Do not add explanations.
`,
      response_format: {
        type: "text",
        mime_type: "application/json",
        schema: {
          type: "object",
          properties: {
            suggestions: {
              type: "array",
              items: {
                type: "string",
              },
              minItems: 6,
              maxItems: 6,
            },
          },
          required: ["suggestions"],
        },
      },
    });

    if (!interaction.output_text) {
      throw new Error("No response received from Gemini");
    }

    const parsedResponse = JSON.parse(interaction.output_text);

    const result = suggestionsSchema.safeParse(parsedResponse);

    if (!result.success) {
      console.error("Invalid Gemini response:", result.error);

      return NextResponse.json(
        {
          success: false,
          error: "Invalid AI response",
        },
        {
          status: 500,
        },
      );
    }

    return NextResponse.json(
      {
        success: true,
        suggestions: result.data.suggestions,
      },
      {
        status: 200,
      },
    );
  } catch (error) {
    console.error("Error generating AI suggestions:", error);

    return NextResponse.json(
      {
        success: false,
        error: "Failed to generate AI suggestions",
      },
      {
        status: 500,
      },
    );
  }
}
