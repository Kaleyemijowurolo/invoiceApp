import { apiService } from "@/apiServices";
import { NextAuthOptions, User } from "next-auth";

import CredentialsProvider from "next-auth/providers/credentials";
/**
 * Configuration options for NextAuth.js authentication.
 */
export const options: NextAuthOptions = {
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
    updateAge: 24 * 60 * 60, // Update token every 24 hours
  },

  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Check if the credentials are provided
        const { email, password } = credentials as {
          email: string;
          password: string;
        };
        try {
          // Call the login function to authenticate the user
          const userRes = await apiService.login({ email, password });

          // console.log(userRes, "userRes");
          if (userRes && userRes.token) {
            // Construct the user object to be returned
            const user = {
              ...userRes.user,
              id: userRes.user._id,
              access_token: userRes.token, //use this if you want token to be Available on the client
            };
            return user;
          } else {
            return null;
          }
        } catch (error) {
          console.error("Error during authorization:", error);
          return null;
        }
      },
    }),
  ],

  callbacks: {
    async signIn({ user }: { user: User }) {
      // Return the user object on sign-in
      if (user) return true;
      return false;
    },
    async redirect({ baseUrl }: { url: string; baseUrl: string }) {
      // Redirect to the base URL after sign-in
      return baseUrl;
    },
    async jwt({ token, user, account }) {
      if (user && account?.type === "credentials") {
        token.id = user.id;
        token.user = { ...user };
        if ("access_token" in user) {
          token.access_token = user.access_token;
        } else {
          token.access_token = account.access_token;
        }
      }
      return token;
    },
    async session({ session, token }) {
      session.access_token = token.access_token as string;
      session.user =
        token.user && typeof token.user === "object" ? { ...token.user } : {};
      return session;
    },
  },
  pages: {
    signIn: "/auth/signin", // Custom sign-in page
    signOut: "/auth/signin", // Custom sign-out page
    error: "/error", // Custom error page
  },

  secret: process.env.NEXTAUTH_SECRET, // Secret for NextAuth.js
};
