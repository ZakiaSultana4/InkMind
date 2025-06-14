import bcrypt from "bcryptjs";
import CredentialsProvider from "next-auth/providers/credentials";
import GitHubProvider from "next-auth/providers/github";
import GoogleProvider from "next-auth/providers/google";
import type { NextAuthOptions } from "next-auth";

import { connectToDatabase } from "@/lib/db/mongoose";
import User from "@/models/user.model";

// Extend NextAuth types to include 'id' on User and Session
declare module "next-auth" {
  interface Session {
    user: {
      id: string;
      name?: string | null;
      email?: string | null;
      image?: string | null;
    };
  }
  interface User {
    id: string;
    name?: string | null;
    email?: string | null;
    image?: string | null;
  }
}

const authOptions: NextAuthOptions = {
  debug: true,
  providers: [
    CredentialsProvider({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials) return null;

        const { email, password } = credentials;

        await connectToDatabase();
        const user = await User.findOne({ email });
        if (!user) throw new Error("Invalid credentials");

        const isMatched = await bcrypt.compare(password, user.password);
        if (!isMatched) throw new Error("Invalid credentials");

        return {
          id: user._id.toString(),
          name: user.name,
          email: user.email,
          image: user.image,
        };
      },
    }),
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),
  ],

  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" || account?.provider === "github") {
        await connectToDatabase();

        const existingUser = await User.findOne({ email: user.email });
        if (!existingUser) {
          await User.create({
            name: user.name ?? user.email?.split("@")[0] ?? "Unnamed User",
            email: user.email,
            image: user.image,
            provider: account.provider,
            role: "user",
          });
        }
      }
      return true;
    },

    async jwt({ token, user }) {
      // When user logs in
      if (user) {
        await connectToDatabase();
        const dbUser = await User.findOne({ email: user.email });

        if (dbUser) {
          token.id = dbUser._id.toString();
          token.email = dbUser.email;
          token.name = dbUser.name;
        }
      }

      return token;
    },

    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id ? String(token.id) : "";
        session.user.email = token.email ?? "";
        session.user.name = token.name ?? "";
      }
      return session;
    },
  },

  secret: process.env.NEXTAUTH_SECRET,
};

export default authOptions;
