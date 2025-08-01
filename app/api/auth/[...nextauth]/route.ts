import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import type {  Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

const userPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USER_POOL_ID!,
  ClientId: process.env.COGNITO_CLIENT_ID!,
});

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_ID!,
      clientSecret: process.env.GITHUB_SECRET!,
    }),

    CredentialsProvider({
      name: "EmailLogin",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials.password) {
          console.error("Missing credentials");
          return null;
        }

        return new Promise((resolve, reject) => {
          console.log("⏳ Authenticating with Cognito:", credentials.email);

          const authDetails = new AuthenticationDetails({
            Username: credentials.email,
            Password: credentials.password,
          });

          const cognitoUser = new CognitoUser({
            Username: credentials.email,
            Pool: userPool,
          });

          cognitoUser.authenticateUser(authDetails, {
            onSuccess: (result) => {

            const idToken = result.getIdToken().getJwtToken();
              const payload = JSON.parse(
                Buffer.from(idToken.split(".")[1], "base64").toString()
              );
              console.log(idToken,payload);
              
              resolve({
                id: payload.sub,
                email: credentials.email,
              });
            },
            onFailure: (err) => {
              console.error("❌ Cognito login failed:", err.message);
              reject(new Error("Invalid credentials"));
            },
          });
        });
      },
    }),
  ],
  callbacks: {
  async jwt({ token, user }: { token: JWT; user?: User }) {
    if (user) {
      token.userId = (user as any).id ?? (user as any).sub ?? null;
    }
    return token;
  },
  async session({ session, token }: { session: Session; token: JWT }) {
    if (token?.userId) {
      session.user.userId = token.userId as string;
    }
    return session;
  },
},
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
