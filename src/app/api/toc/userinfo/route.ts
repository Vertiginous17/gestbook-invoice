import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const access_token = req.cookies.get("toc_access_token")?.value;

  if (!access_token) {
    return NextResponse.json(
      { error: "No access token found in cookies" },
      { status: 401 }
    );
  }

  console.log("Access token from cookie:", access_token);

  // Aqui podias fazer uma chamada à API do TOC usando o token

  return NextResponse.json({ message: "Token received!", token: access_token });
}
