import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getAddress = process.env.NEXT_PUBLIC_GET_ADDRESS || "";

export async function GET() {
  try {
    const response = await fetch(`${apiUrl}${getAddress}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${process.env.NEXT_PUBLIC_TOKEN_API}`,
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
