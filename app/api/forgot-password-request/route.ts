import { NextRequest, NextResponse } from 'next/server';
import { CognitoUserPool, CognitoUser } from 'amazon-cognito-identity-js';

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email) {
      return NextResponse.json({ error: 'Email, User Pool ID, and Client ID are required.' }, { status: 400 });
    }
 
    const userPool = new CognitoUserPool({ UserPoolId: process.env.COGNITO_USER_POOL_ID!, ClientId: process.env.COGNITO_CLIENT_ID! });
    const cognitoUser = new CognitoUser({ Username: email, Pool: userPool });

    // Wrap the callback-based method in a Promise
    await new Promise<void>((resolve, reject) => {
      cognitoUser.forgotPassword({
        onSuccess: (data) => {
          console.log('Forgot password request successful (API):', data);
          resolve();
        },
        onFailure: (err) => {
          console.error('Forgot password error (API):', err);
          reject(err);
        },
      });
    });

    return NextResponse.json({ message: 'Verification code sent successfully.' }, { status: 200 });

  } catch (error: any) {
    console.error("Error in /api/auth/forgot-password-request:", error);
    let errorMessage = error.message || 'An unknown error occurred while requesting the code.';
    let statusCode = 500;

    if (error.code === 'UserNotFoundException') {
      errorMessage = 'User not found. Please check your email.';
      statusCode = 404;
    } else if (error.code === 'LimitExceededException') {
      errorMessage = 'Too many attempts. Please try again later.';
      statusCode = 429;
    } else if (error.code === 'InvalidParameterException' || error.code === 'CodeDeliveryFailureException') {
      errorMessage = 'Could not send verification code. Please check the email address or try again.';
      statusCode = 400;
    }

    return NextResponse.json({ error: errorMessage }, { status: statusCode });
  }
}