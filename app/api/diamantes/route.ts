import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  const whatsapp =
    request.nextUrl.searchParams
      .get("whatsapp")
      ?.replace(/\D/g, "") || "";

  if (!whatsapp) {
    return NextResponse.json(
      {
        ok: false,
        mensaje:
          "Debes enviar un número de WhatsApp.",
      },
      {
        status: 400,
      },
    );
  }

  return NextResponse.json({
    ok: true,
    cliente: {
      whatsapp,
      nombre: "Cliente de prueba",
      diamantesDisponibles: 100,
      diamantesGanados: 150,
      diamantesCanjeados: 50,
      nivel: "NOVATO",
      diasRacha: 3,
    },
  });
}