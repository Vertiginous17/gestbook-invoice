import { NextRequest, NextResponse } from "next/server";

const REUNIOES_CALLBACK_URL =
  process.env.REUNIOES_CALLBACK_URL ||
  "http://localhost:3100/api/integracoes/tocontline/callback";

export async function GET(req: NextRequest) {
  const state = req.nextUrl.searchParams.get("state") || "";

  if (state.startsWith("reunioes:")) {
    let destino: URL;
    try {
      destino = new URL(REUNIOES_CALLBACK_URL);
    } catch {
      return NextResponse.json({ error: "Invalid local callback URL" }, { status: 500 });
    }

    if (destino.hostname !== "localhost" && destino.hostname !== "127.0.0.1") {
      return NextResponse.json({ error: "Invalid local callback URL" }, { status: 500 });
    }

    for (const [chave, valor] of req.nextUrl.searchParams.entries()) {
      destino.searchParams.set(chave, valor);
    }

    return NextResponse.redirect(destino.toString());
  }

  const code = req.nextUrl.searchParams.get("code");

  if (!code) {
    return NextResponse.json(
      { error: "Authorization code not found" },
      { status: 400 }
    );
  }

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

  const responseWithCookie = NextResponse.redirect("http://gestbook-invoice.vercel.app");

  responseWithCookie.cookies.set("toc_access_token", access_token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    maxAge: expires_in,
    path: "/",
  });

  return responseWithCookie;
}
