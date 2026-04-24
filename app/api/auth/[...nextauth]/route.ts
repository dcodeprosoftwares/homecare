import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Admin Login",
      credentials: {
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        // Use environment variable or default password if not set
        const adminPassword = process.env.ADMIN_PASSWORD || "admin123";
        
        if (credentials?.password === adminPassword) {
          return { id: "1", name: "Admin" };
        }
        
        return null;
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
  },
  secret: process.env.NEXTAUTH_SECRET || "fallback_secret_key_for_development_only_12345",
});

export { handler as GET, handler as POST };
