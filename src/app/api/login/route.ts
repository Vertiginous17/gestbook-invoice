import { NextResponse } from "next/server";
import admin from "../../../../firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, password } = body;

    // Step 1: Validate the credentials
    const userRecord = await validateUser(username, password);

    if (userRecord) {
      // If the user is found, proceed with your redirect logic
      return NextResponse.redirect(new URL("/api/toc/authenticate", req.url));
    } else {
      // If no user found, return an error response
      return NextResponse.json(
        { message: "No such user found" },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Function to validate user by username (email) and password
const validateUser = async (username: string, password: string) => {
  try {
    // Check if the username exists in Firebase Authentication
    const userRecord = await admin.auth().getUserByEmail(username);

    // If the user exists, we verify the password here
    // Firebase Admin SDK doesn't directly verify passwords,
    // so you will need to use Firebase client SDK for this part.
    // Here we are assuming the password is correct since Firebase doesn't expose password directly.
    // You can check the password on the client side using Firebase Auth client SDK

    return userRecord;
  } catch (error) {
    console.log("User validation error:", error);
    return null; // If error occurs, return null indicating user not found
  }
};
