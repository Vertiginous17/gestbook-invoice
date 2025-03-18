import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getAddress = process.env.NEXT_PUBLIC_GET_ADDRESS || "";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("toc_access_token");

    const response = await fetch(`${apiUrl}${getAddress}`, {
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

    const address = await response.json();

    return NextResponse.json(address);
  } catch (error) {
    console.error("Erro ao obter clientes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
