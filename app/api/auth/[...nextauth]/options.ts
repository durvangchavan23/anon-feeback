import { connectDB } from "@/lib/db";
import { User } from "@/models/user.model";
import bcrypt from "bcryptjs";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import * as z from "zod";

const loginSchema = z.object({
  identifier: z
    .string("Identifier must be a string")
    .min(1, { error: "Username or email is required!" }),
  password: z
    .string("Password must be a string")
    .min(1, { error: "Password is required!" }),
});

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "Credentials",
      credentials: {
        identifier: { label: "Identifier", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req): Promise<any> {
        const result = loginSchema.safeParse(credentials);

        if (!result.success) {
          throw new Error(result.error.issues[0].message);
        }

        const { identifier, password } = result.data;

        try {
          await connectDB();
          const user = await User.findOne({
            $or: [
              { username: identifier.toLowerCase().trim() },
              { email: identifier.trim() },
            ],
          });

          if (!user) {
            throw new Error("User not found!");
          }

          if (!user.isVerified) {
            throw new Error("Please verify your account first!");
          }

          const isValid = await bcrypt.compare(password, user.password);

          if (!isValid) {
            throw new Error("Invalid credentials");
          }

          return {
            _id: user._id.toString(),
            username: user.username,
            email: user.email,
            isVerified: user.isVerified,
            isAcceptingMessages: user.isAcceptingMessages,
          };
        } catch (error) {
          console.error("Error logging in user", error);
          throw error;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token._id = user._id;
        token.username = user.username;
        token.email = user.email;
        token.isVerified = user.isVerified;
        token.isAcceptingMessages = user.isAcceptingMessages;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user._id = token._id;
        session.user.username = token.username;
        session.user.email = token.email;
        session.user.isAcceptingMessages = token.isAcceptingMessages;
        session.user.isVerified = token.isVerified;
      }
      return session;
    },
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: "/sign-in",
    error: "/sign-in",
  },
  secret: process.env.NEXTAUTH_SECRET,
};
