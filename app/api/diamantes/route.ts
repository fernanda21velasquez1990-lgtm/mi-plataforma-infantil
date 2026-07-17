import { NextRequest, NextResponse } from "next/server";

type RespuestaGoogle = {
  ok?: boolean;
  mensaje?: string;
  cliente?: {
    idCliente?: string;
    whatsapp?: string;
    nombre?: string;
    email?: string;
    estadoMembresia?: string;
    plan?: string;
    fechaInicio?: string;
    fechaFin?: string;
    diamantesDisponibles?: number;
    diamantesGanados?: number;
    diamantesCanjeados?: number;
    nivel?: string;
    diasRacha?: number;
    mejorRacha?: number;
  };
};

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
          mensaje: "Debes enviar un número de WhatsApp.",
        },
        {
          status: 400,
        },
      );
    }

    const urlGoogle =
      process.env.GOOGLE_DIAMANTES_URL;

    if (!urlGoogle) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            "Falta configurar GOOGLE_DIAMANTES_URL.",
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
      });

    const respuestaGoogle =
      await fetch(
        `${urlGoogle}?${parametros.toString()}`,
        {
          method: "GET",
          cache: "no-store",
        },
      );

    if (!respuestaGoogle.ok) {
      throw new Error(
        `Google Apps Script respondió con error ${respuestaGoogle.status}.`,
      );
    }

    const datosGoogle =
      (await respuestaGoogle.json()) as RespuestaGoogle;

    if (
      datosGoogle.ok !== true ||
      !datosGoogle.cliente
    ) {
      return NextResponse.json(
        {
          ok: false,
          mensaje:
            datosGoogle.mensaje ||
            "El cliente no fue encontrado.",
        },
        {
          status: 404,
        },
      );
    }

    const cliente =
      datosGoogle.cliente;

    return NextResponse.json({
      ok: true,
      cliente: {
        whatsapp:
          cliente.whatsapp ||
          cliente.idCliente ||
          whatsapp,

        nombre:
          cliente.nombre ||
          "Cliente",

        email:
          cliente.email || "",

        estadoMembresia:
          cliente.estadoMembresia ||
          "PENDIENTE",

        plan:
          cliente.plan || "",

        fechaInicio:
          cliente.fechaInicio || "",

        fechaFin:
          cliente.fechaFin || "",

        diamantesDisponibles:
          Number(
            cliente.diamantesDisponibles,
          ) || 0,

        diamantesGanados:
          Number(
            cliente.diamantesGanados,
          ) || 0,

        diamantesCanjeados:
          Number(
            cliente.diamantesCanjeados,
          ) || 0,

        nivel:
          cliente.nivel ||
          "NOVATO",

        diasRacha:
          Number(
            cliente.diasRacha,
          ) || 0,

        mejorRacha:
          Number(
            cliente.mejorRacha,
          ) || 0,
      },
    });
  } catch (error) {
    console.error(
      "Error del sistema de diamantes:",
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