import { NextRequest, NextResponse } from "next/server";

export async function GET(req: NextRequest) {
  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code not found" },
      { status: 400 }
    );
  }

  // Aqui trocas o code por um access_token
  const response = await fetch("https://app12.toconline.pt/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: new URLSearchParams({
      grant_type: "authorization_code",
      code: code,
      redirect_uri: process.env.NEXT_PUBLIC_TOC_REDIRECT_URI!,
      client_id: process.env.NEXT_PUBLIC_TOC_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_TOC_CLIENT_SECRET!,
    }),
  });

  const data = await response.json();

  if (data.error) {
    return NextResponse.json(
      { error: data.error_description || "Token exchange failed" },
      { status: 400 }
    );
  }

  const { access_token, expires_in } = data;

  // Log do token no backend (apenas para debug - remove isto em produção!)
  console.log("Access Token:", access_token);

  // Criar cookie HttpOnly
  const responseWithCookie = NextResponse.redirect("http://gestbook-invoice.vercel.app");

  responseWithCookie.cookies.set("toc_access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: expires_in, // tempo de vida do token
    path: "/",
  });

  return responseWithCookie;
}
