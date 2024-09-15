import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

let SCOPES = [];
SCOPES.push("https://www.googleapis.com/auth/drive");
SCOPES.push("https://www.googleapis.com/auth/spreadsheets");
let a = SCOPES.join(" ");

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: process.env.CLIENT_ID,
      clientSecret: process.env.CLIENT_SECRET,
      authorization: {
        params: {
          scope:
            "openid email profile https://www.googleapis.com/auth/spreadsheets",
          //       // prompt: "consent",
          //       // access_type: "offline",
          //       // response_type: "code",
        },
      },
    }),
  ],
  secret: process.env.SECRET,
  // session: { jwt: true },
  callbacks: {
    async jwt({ token, account }) {
      // Persist the OAuth access_token to the token right after signin
      if (account) {
        token.accessToken = account.access_token;
      }
      return token;
    },
    async session({ session, token, user }) {
      // Send properties to the client, like an access_token from a provider.
      session.accessToken = token.accessToken;
      return session;
    },
  },
});
