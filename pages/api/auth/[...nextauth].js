import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";

const SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];
export default NextAuth({
  providers: [
    GoogleProvider({
      clientId:
        "1061389835335-084ce2v3bo3mlh64o6do3ldnbe21aqc5.apps.googleusercontent.com",
      clientSecret: "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",
      scope:
        "https://www.googleapis.com/auth/spreadsheets https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/business.manage",
      //   "https://www.googleapis.com/auth/userinfo.profile https://www.googleapis.com/auth/userinfo.email https://www.googleapis.com/auth/business.manage",
      // authorizationUrl: "https://accounts.google.com/o/oauth2/auth",
    }),
  ],
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
