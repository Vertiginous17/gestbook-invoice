import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const apiUrl = process.env.NEXT_PUBLIC_API_URL || "";
const getDocumentoVenda = process.env.TOC_GET_DOCUMENTO_VENDA || "";

export async function GET() {
  try {
    const cookieStore = cookies();
    const token = (await cookieStore).get("toc_access_token");

    const response = await fetch(`${apiUrl}${getDocumentoVenda}`, {
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

    const documentosVenda = await response.json();

    return NextResponse.json(documentosVenda);
  } catch (error) {
    console.error("Erro ao obter clientes:", error);
    return NextResponse.json(
      { error: "Erro interno do servidor" },
      { status: 500 }
    );
  }
}
