import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
  try {
    const whatsapp =
      request.nextUrl.searchParams
        .get("whatsapp")
        ?.replace(/\D/g, "") || "";

    if (!whatsapp) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "Debes proporcionar un número de WhatsApp.",
        },
        {
          status: 400,
        },
      );
    }

    const urlScript =
      process.env.GOOGLE_DIAMANTES_URL;

    const clavePrivada =
      process.env.GOOGLE_DIAMANTES_CLAVE;

    if (!urlScript || !clavePrivada) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "Faltan las variables de Google Sheets.",
        },
        {
          status: 500,
        },
      );
    }

    const parametros =
      new URLSearchParams({
        accion: "cliente",
        whatsapp,
        clave: clavePrivada,
      });

    const respuesta =
      await fetch(
        `${urlScript}?${parametros.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

    if (!respuesta.ok) {
      throw new Error(
        `Google respondió con error ${respuesta.status}.`,
      );
    }

    const datos =
      await respuesta.json();

    return NextResponse.json(datos);
  } catch (error) {
    console.error(
      "Error consultando diamantes:",
      error,
    );

    return NextResponse.json(
      {
        ok: false,
        mensaje:
          error instanceof Error
            ? error.message
            : "No se pudo consultar Google Sheets.",
      },
      {
        status: 500,
      },
    );
  }
}