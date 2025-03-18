import { getAccessToken } from "@/utils/getAccessToken";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getClients = process.env.NEXT_PUBLIC_GET_CLIENTS || "";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("toc_access_token");

    const response = await fetch(`${apiUrl}${getClients}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token?.value}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      return NextResponse.json(
        {
          error: `Erro na requisição: ${response.status} ${response.statusText}`,
        },
        { status: response.status }
      );
    }

    const clientes = await response.json();

    return NextResponse.json(clientes);
  } catch (error) {
    console.error("Erro ao obter clientes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
