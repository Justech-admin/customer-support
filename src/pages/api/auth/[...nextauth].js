import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { executeQuery } from "../../../lib/db";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        try {
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Please provide both username and password");
          }

          const { username, password } = credentials;

          // Fetch user from database
          const query = "SELECT * FROM users WHERE username = ?";
          const results = await executeQuery({
            query,
            values: [username],
          });

          if (!results || results.length === 0) {
            throw new Error("Invalid credentials");
          }

          const user = results[0];

          // Compare passwords
          const isMatch = await bcrypt.compare(password, user.password);
          if (!isMatch) {
            throw new Error("Invalid credentials");
          }

          // console.log("Login successful:", username, "Role:", user.role);
          console.log("Login successful:", user.id, "Role:", user.role);
          // Return user object including role
          return {
            id: user.id,
            name: user.username,
            role: user.role, // Include role
          };
          console.log("Login successful:", user.id, "Role:", user.role);
        } catch (error) {
          console.error("Auth Error:", error);
          throw error;
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 60 * 15, // 1 hour
  },
  callbacks: {
    jwt: ({ token, user }) => {
      if (user) {
        token = {
          ...user
        }
      }
      return token
    },
    session: ({ token, session }) => {
      session.user = {
        ...token
      }
      return session
    },
    async redirect({ url, baseUrl, token }) {
      // Redirect based on role
      if (token?.role === "user") {
        return `${baseUrl}/${token.name}/Inventory`;
      }
      return baseUrl; // Default redirect
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
});
