import { NextResponse } from "next/server";

export async function GET(req: Request) {
  try {
    const clientId = process.env.NEXT_PUBLIC_TOC_CLIENT_ID;
    const redirectUri = encodeURIComponent(
      "http://localhost:3000/api/toc/callback" // usa o teu callback local
    );

    const authUrl = `https://app12.toconline.pt/oauth/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=code&scope=commercial`;

    return NextResponse.redirect(authUrl);
  } catch (error) {
    console.error("Erro ao iniciar autenticação", error);
    return NextResponse.json({ error: "Erro interno" }, { status: 500 });
  }
}
