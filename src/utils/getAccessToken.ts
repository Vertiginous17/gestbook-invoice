// /lib/getAccessToken.ts

let accessToken: string | null = null;
let accessTokenExpiresAt: number | null = null;

export async function getAccessToken() {
  const currentTime = Math.floor(Date.now() / 1000);

  // Se já tens um token e não expirou, devolves esse
  if (
    accessToken &&
    accessTokenExpiresAt &&
    currentTime < accessTokenExpiresAt
  ) {
    return accessToken;
  }

  // Fazes refresh token call
  const refreshToken = process.env.NEXT_PUBLIC_TOC_REFRESH_TOKEN;

  const res = await fetch(process.env.NEXT_PUBLIC_OAUTH_URL!, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: new URLSearchParams({
      grant_type: "refresh_token",
      client_id: process.env.NEXT_PUBLIC_TOC_CLIENT_ID!,
      client_secret: process.env.NEXT_PUBLIC_TOC_CLIENT_SECRET!,
      refresh_token: refreshToken!,
    }),
  });

  const data = await res.json();

  if (!res.ok) {
    console.error("Erro ao renovar o token", data);
    throw new Error("Erro ao renovar o token");
  }

  // Atualizas o token e a expiração
  accessToken = data.access_token;
  accessTokenExpiresAt = currentTime + data.expires_in - 60; // margem de 1 minuto

  return accessToken;
}
