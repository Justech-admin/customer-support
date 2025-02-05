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
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        try {
          // Input validation
          if (!credentials?.username || !credentials?.password) {
            throw new Error("Please provide both username and password");
          }

          const { username, password } = credentials;

          // Query the database to find the user by username
          const query = "SELECT * FROM users WHERE username = ?";
          const results = await executeQuery({
            query,
            values: [username],
          }).catch(error => {
            console.error("Database Error:", error);
            throw new Error("Database connection failed");
          });

          // Check if user exists
          if (!results || results.length === 0) {
            console.log("User not found:", username);
            throw new Error("Invalid credentials");
          }

          const user = results[0];

          // Validate password hash format
          if (!user.password || typeof user.password !== 'string') {
            console.error("Invalid password hash format in database");
            throw new Error("Internal server error");
          }

          // Compare passwords with timing-safe comparison
          const isMatch = await bcrypt.compare(password, user.password);
          console.log(password,user.password)
          if (!isMatch) {
            console.log("Password mismatch for user:", username);
            throw new Error("Invalid credentials");
          }

          // Return minimal user info needed for session
          return {
            id: user.id,
            name: user.username,
            email: user.email // If you store email
          };
        } catch (error) {
          console.error("Auth Error:", error);
          throw error; // Re-throw to be handled by NextAuth
        }
      },
    }),
  ],
  pages: {
    signIn: "/login",
    error: "/login", // Add custom error page
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        // Add user info to token
        token.id = user.id;
        token.name = user.name;
        token.email = user.email;
      }
      return token;
    },
    async session({ session, token }) {
      // Add user info to session
      session.user.id = token.id;
      session.user.name = token.name;
      session.user.email = token.email;
      return session;
    },
  },
  debug: process.env.NODE_ENV === 'development',
  secret: process.env.NEXTAUTH_SECRET,
});
