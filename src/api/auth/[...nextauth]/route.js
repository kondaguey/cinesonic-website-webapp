import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

// 🔴 PASTE YOUR NEW GOOGLE SCRIPT URL HERE
const SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbxjKTIkZgMvjuCv49KK00885LI5r2Ir6qMY7UGb29iqojgnhTck0stR__yejTODfLVO/exec";

const handler = NextAuth({
  providers: [
    CredentialsProvider({
      name: "Access Key",
      credentials: {
        accessKey: { label: "Access Key", type: "password" },
      },
      async authorize(credentials) {
        try {
          // Call your Google Script to verify the key
          const res = await fetch(
            `${SCRIPT_URL}?op=auth_check&key=${credentials.accessKey}`
          );
          const data = await res.json();

          // If script says success, authorize the user
          if (data.success && data.user) {
            return {
              id: data.user.id,
              name: data.user.name,
              email: data.user.email,
            };
          }
          return null;
        } catch (e) {
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async session({ session }) {
      return session;
    },
  },
  // Custom Login Page (we'll redirect here if needed)
  pages: {
    signIn: "/talent",
  },
});

export { handler as GET, handler as POST };
