import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";
import type { Session, User } from "next-auth";
import type { JWT } from "next-auth/jwt";
import {
  CognitoUserPool,
  CognitoUser,
  AuthenticationDetails,
} from "amazon-cognito-identity-js";

export const authOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
      authorization: {
        params: {
          scope: "openid email profile",
        },
      },
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

        // ✅ Lazy-read environment vars (for Amplify runtime)
        const poolId = process.env.COGNITO_USER_POOL_ID;
        const clientId = process.env.COGNITO_CLIENT_ID;

        if (!poolId || !clientId) {
          console.error("Missing Cognito ENV vars:", {
            COGNITO_USER_POOL_ID: poolId,
            COGNITO_CLIENT_ID: clientId,
          });
          return null;
        }

        const userPool = new CognitoUserPool({
          UserPoolId: poolId,
          ClientId: clientId,
        });

        return new Promise((resolve, reject) => {
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
              try {
                const idToken = result.getIdToken().getJwtToken();
                const payload = JSON.parse(
                  Buffer.from(idToken.split(".")[1], "base64url").toString("utf-8")
                );

                resolve({
                  id: payload.sub,
                  email: payload.email ?? credentials.email,
                });
              } catch (err) {
                console.error("Failed to decode Cognito token", err);
                reject(new Error("Failed to decode token"));
              }
            },
            onFailure: (err) => {
              console.error("Cognito login failed", err);
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

  // ✅ Custom login page
  pages: {
    signIn: "/login",
  },

  // ✅ JWT signing secret
  secret: process.env.NEXTAUTH_SECRET,
};
