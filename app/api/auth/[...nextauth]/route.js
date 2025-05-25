import NextAuth from "next-auth";
import GitHubProvider from "next-auth/providers/github";
import { MongoDBAdapter } from "@next-auth/mongodb-adapter";
import clientPromise from "@/app/db/connectDb";

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
          // MongoDBAdapter handles user creation/update
          return true; // Allow sign-in
        } catch (error) {
          console.error("Sign-in error:", error);
          return false; // Reject sign-in on error
        }
      }
      return true; // Allow other providers (if added later)
    },
    async session({ session, user }) {
      // Add username from MongoDB user document to session
      session.user.name = user.username || user.email.split("@")[0];
      session.user.id = user.id; // Add user ID for app usage
      return session;
    },
  },
  pages: {
    signIn: "/login", // Redirect to custom login page
  },
};

// Export handler for GET and POST
const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };