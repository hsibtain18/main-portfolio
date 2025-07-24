import { NextRequest, NextResponse } from "next/server";
import { CognitoUserPool, CognitoUserAttribute } from "amazon-cognito-identity-js";

// Ensure these environment variables are correctly set
const userPool = new CognitoUserPool({
  UserPoolId: process.env.COGNITO_USER_POOL_ID!,
  ClientId: process.env.COGNITO_CLIENT_ID!,
});

export async function POST(req: NextRequest) {
  const { email, password, name } = await req.json();

  if (!email || !password || !name) {
    return NextResponse.json({ error: "Email, password, and name are required." }, { status: 400 });
  }

  // Define the user attributes you want to send
  const attributeList: CognitoUserAttribute[] = [];

  // Add the email attribute (it's required for Cognito User Pools)
  attributeList.push(
    new CognitoUserAttribute({
      Name: "email",
      Value: email,
    })
  );

  // Add the 'name' attribute
  // 'name' is a standard attribute in Cognito.
  attributeList.push(
    new CognitoUserAttribute({
      Name: "name", // Standard attribute for full name
      Value: name,
    })
  );

  // If you had other standard attributes like 'given_name', 'family_name', 'phone_number', etc.:
  // attributeList.push(new CognitoUserAttribute({ Name: "given_name", Value: "John" }));
  // attributeList.push(new CognitoUserAttribute({ Name: "family_name", Value: "Doe" }));

  // If you had custom attributes (e.g., 'custom:user_role'), remember the 'custom:' prefix:
  // attributeList.push(new CognitoUserAttribute({ Name: "custom:user_role", Value: "customer" }));


  return new Promise((resolve) => {
    // The signUp method signature is:
    // signUp(username, password, userAttributes, validationData, callback)
    // In your case, 'email' is used as the username, and 'attributeList' contains the email and name.
    userPool.signUp(email, password, attributeList, [], (err, result) => {
      if (err || !result) {
        console.error("Cognito signup error:", err);
        let errorMessage = err?.message || "An unknown error occurred during signup.";
        // You can refine error messages based on Cognito error codes (err.code or err.name)
       
        resolve(NextResponse.json({ error: errorMessage }, { status: 400 }));
      } else {
        console.log("Cognito signup success:", result.user.getUsername());
        resolve(NextResponse.json({ success: true, userConfirmed: result.userConfirmed }));
      }
    });
  });
}