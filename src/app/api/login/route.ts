import { NextResponse } from "next/server";
import admin from "../../../../firebaseAdmin";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username } = body;

    // Step 1: Validate the credentials
    const userRecord = await validateUser(username);

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
const validateUser = async (username: string) => {
  try {
    const userRecord = await admin.auth().getUserByEmail(username);

    return userRecord;
  } catch (error) {
    console.log("User validation error:", error);
    return null; // If error occurs, return null indicating user not found
  }
};
