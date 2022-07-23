import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

let SCOPES = [];
SCOPES.push("https://www.googleapis.com/auth/drive");
SCOPES.push("https://www.googleapis.com/auth/spreadsheets");
let a = SCOPES.join(" ");
console.log(a);
const clientId =
  "1061389835335-084ce2v3bo3mlh64o6do3ldnbe21aqc5.apps.googleusercontent.com";
const clientSecret = "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";

export default NextAuth({
  providers: [
    GoogleProvider({
      clientId: clientId,
      clientSecret: clientSecret,
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
