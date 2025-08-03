import { NextRequest, NextResponse } from "next/server";
import {
  CognitoUserPool,
  CognitoUserAttribute,
} from "amazon-cognito-identity-js";

const userPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USER_POOL_ID!,
  ClientId: process.env.COGNITO_CLIENT_ID!,
});

export async function POST(req: NextRequest): Promise<Response> {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json(
      { error: "Email, password, and name are required." },
      { status: 400 }
    );
  }

  const attributeList: CognitoUserAttribute[] = [
    new CognitoUserAttribute({ Name: "email", Value: email }),
    new CognitoUserAttribute({ Name: "name", Value: name }),
  ];

  // Wrap the Cognito callback-based API in a Promise<Response> properly
  return new Promise((resolve) => {
    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err || !result) {
        const errorMessage =
          err?.message || "An unknown error occurred during signup.";
        return resolve(
          new Response(JSON.stringify({ error: errorMessage }), {
            status: 400,
            headers: { "Content-Type": "application/json" },
          })
        );
      }

      return resolve(
        new Response(
          JSON.stringify({
            success: true,
            userConfirmed: result.userConfirmed,
          }),
          {
            status: 200,
            headers: { "Content-Type": "application/json" },
          }
        )
      );
    });
  });
}