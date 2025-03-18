import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
const createFatura = process.env.NEXT_PUBLIC_CREATE_INVOICE || "";
const token = process.env.NEXT_PUBLIC_TOKEN_API || "";

export async function POST(request: Request) {
  try {
    // Parse the request body from the frontend
    const props = await request.json();

    // Make the POST request to the external API
    const response = await fetch(`${apiUrl}${createFatura}`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(props),
    });

    if (!response.ok) {
      const error = await response.json();
      return NextResponse.json({ error: error }, { status: response.status });
    }

    const data = await response.json();
    return NextResponse.json(data); // Return the response to the client
  } catch (error) {
    console.error("Error while creating Fatura:", error);
    return NextResponse.json(
      { error: "Error while creating Fatura" },
      { status: 500 }
    );
  }
}
