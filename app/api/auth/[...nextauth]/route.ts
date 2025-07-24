import NextAuth from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import GitHubProvider from "next-auth/providers/github";
import CredentialsProvider from "next-auth/providers/credentials";

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
    // CredentialsProvider({
    //   name: "EmailLogin",
    //   credentials: {
    //     email: { label: "Email", type: "text" },
    //     password: { label: "Password", type: "password" },
    //   },
    //   async authorize(credentials) {
    //     return new Promise((resolve, reject) => {
    //       const authDetails = new AuthenticationDetails({
    //         Username: credentials!.email,
    //         Password: credentials!.password,
    //       });

    //       const cognitoUser = new CognitoUser({
    //         Username: credentials!.email,
    //         Pool: userPool,
    //       });

    //       cognitoUser.authenticateUser(authDetails, {
    //         onSuccess: () => {
    //           resolve({ id: credentials!.email, email: credentials!.email });
    //         },
    //         onFailure: () => {
    //           reject(new Error("Invalid credentials"));
    //         },
    //       });
    //     });
    //   },
    // }),
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
          console.log("✅ Cognito login successful");
          resolve({
            id: credentials.email,
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
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
