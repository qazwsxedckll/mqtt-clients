import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {},
        password: {},
      },
      authorize: async (credentials) => {
        let user = null
 
        if (credentials.email === "admin") {
          return user
        }
 
        throw new Error("Invalid email or password")
      },
    }),
  ],
});
