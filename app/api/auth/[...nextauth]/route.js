import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/app/db/connectDb";
import mongoose from "mongoose";
import User from "@/app/models/User";

export const authOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account.provider === "github") {
        try {
          // Connect to MongoDB for Mongoose operations
          await mongoose.connect(process.env.MONGODB_URI);

          // Check if user exists in Mongoose User model by email
          let dbUser = await User.findOne({ email: user.email });

          if (!dbUser) {
            // Create user in Mongoose User model if not found
            dbUser = await User.create({
              email: user.email,
              username: profile.login || user.email.split("@")[0], // Use GitHub username if available
              name: profile.name || user.name,
            });
          } else {
            // Update username if missing
            if (!dbUser.username) {
              await User.updateOne(
                { email: user.email },
                { username: profile.login || user.email.split("@")[0] }
              );
            }
          }

          // Update the user object for the session callback
          user.username = dbUser.username || user.email.split("@")[0];
          return true;
        } catch (error) {
          console.error("Sign-in error:", error);
          return false;
        }
      }
      return true;
    },
    async session({ session, user }) {
      session.user.name = user.username || user.email.split("@")[0];
      session.user.id = user.id;
      return session;
    },
  },
  pages: {
    signIn: "/login",
    error: "/auth/error",
  },
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };