import { NextRequest, NextResponse } from "next/server";
import { CognitoUserPool, CognitoUser } from "amazon-cognito-identity-js";

export async function POST(request: NextRequest) {
  try {
    const { email, verificationCode, newPassword } = await request.json();

    if (!email || !verificationCode || !newPassword) {
      return NextResponse.json(
        {
          error:
            "Email, verification code, new password, User Pool ID, and Client ID are required.",
        },
        { status: 400 }
      );
    }

    const userPool = new CognitoUserPool({
      UserPoolId: process.env.COGNITO_USER_POOL_ID!,
      ClientId: process.env.COGNITO_CLIENT_ID!,
    });
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

    // Wrap the callback-based method in a Promise
    await new Promise<void>((resolve, reject) => {
      cognitoUser.confirmPassword(verificationCode, newPassword, {
        onSuccess: () => {
          console.log("Password successfully reset (API)!");
          resolve();
        },
        onFailure: (err) => {
          console.error("Confirm password error (API):", err);
          reject(err);
        },
      });
    });

    return NextResponse.json(
      { message: "Your password has been reset successfully." },
      { status: 200 }
    );
  } catch (error: any) {
    console.error("Error in /api/auth/forgot-password-confirm:", error);
    let errorMessage =
      error.message ||
      "An unknown error occurred while confirming the password.";
    let statusCode = 500;

    if (error.code === "CodeMismatchException") {
      errorMessage = "Invalid verification code. Please try again.";
      statusCode = 400;
    } else if (error.code === "ExpiredCodeException") {
      errorMessage =
        "Verification code has expired. Please request a new code.";
      statusCode = 400;
    } else if (error.code === "InvalidPasswordException") {
      errorMessage = "Password does not meet requirements.";
      statusCode = 400;
    } else if (error.code === "UserNotFoundException") {
      errorMessage =
        "User not found. Please check your email and request a new code.";
      statusCode = 404;
    } else if (error.code === "LimitExceededException") {
      errorMessage = "Too many attempts. Please try again later.";
      statusCode = 429;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}
