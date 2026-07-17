import {
  NextRequest,
  NextResponse,
} from "next/server";

type SolicitudDescarga = {
  whatsapp?: string;
  materialId?: string | number;
  titulo?: string;
  categoria?: string;
  origen?: string;
};

type RespuestaGoogle = {
  ok?: boolean;
  codigo?: string;
  mensaje?: string;
  duplicado?: boolean;
  premioNuevo?: boolean;
  diamantesOtorgados?: number;
  diamantesDisponibles?: number;
  diamantesGanados?: number;
  diamantesCanjeados?: number;
  nivel?: string;
};

function limpiarTelefono(
  valor: unknown,
): string {
  return String(valor ?? "")
    .replace(/\D/g, "")
    .slice(0, 15);
}

function limpiarTexto(
  valor: unknown,
  limite: number,
): string {
  return String(valor ?? "")
    .trim()
    .slice(0, limite);
}

function normalizarOrigen(
  valor: unknown,
): "BIBLIOTECA" | "LABORATORIO_TECH" {
  const origen = String(
    valor ?? "",
  )
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .trim()
    .toLowerCase();

  if (
    origen === "laboratorio" ||
    origen === "laboratorio tech" ||
    origen === "tecnologia"
  ) {
    return "LABORATORIO_TECH";
  }

  return "BIBLIOTECA";
}

export async function POST(
  request: NextRequest,
) {
  try {
    const urlGoogle =
      process.env
        .GOOGLE_DIAMANTES_URL;

    if (!urlGoogle) {
      return NextResponse.json(
        {
          ok: false,
          codigo:
            "CONFIGURACION_FALTANTE",
          mensaje:
            "No está configurada la conexión con el sistema de diamantes.",
          diamantesOtorgados: 0,
        },
        {
          status: 500,
        },
      );
    }

    let cuerpo:
      | SolicitudDescarga
      | null = null;

    try {
      cuerpo =
        (await request.json()) as SolicitudDescarga;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          codigo:
            "CUERPO_INVALIDO",
          mensaje:
            "La información enviada no es válida.",
          diamantesOtorgados: 0,
        },
        {
          status: 400,
        },
      );
    }

    const whatsapp =
      limpiarTelefono(
        cuerpo?.whatsapp,
      );

    const materialId =
      limpiarTexto(
        cuerpo?.materialId,
        150,
      );

    const titulo =
      limpiarTexto(
        cuerpo?.titulo ||
          "Material educativo",
        300,
      );

    const categoria =
      limpiarTexto(
        cuerpo?.categoria ||
          "Sin categoría",
        150,
      );

    const origen =
      normalizarOrigen(
        cuerpo?.origen,
      );

    if (!whatsapp) {
      return NextResponse.json(
        {
          ok: false,
          codigo:
            "WHATSAPP_REQUERIDO",
          mensaje:
            "No encontramos el WhatsApp de la sesión.",
          diamantesOtorgados: 0,
        },
        {
          status: 400,
        },
      );
    }

    if (
      whatsapp.length < 10 ||
      whatsapp.length > 15
    ) {
      return NextResponse.json(
        {
          ok: false,
          codigo:
            "WHATSAPP_INVALIDO",
          mensaje:
            "El número de WhatsApp no es válido.",
          diamantesOtorgados: 0,
        },
        {
          status: 400,
        },
      );
    }

    if (!materialId) {
      return NextResponse.json(
        {
          ok: false,
          codigo:
            "MATERIAL_REQUERIDO",
          mensaje:
            "No se recibió el identificador del material.",
          diamantesOtorgados: 0,
        },
        {
          status: 400,
        },
      );
    }

    const parametros =
      new URLSearchParams({
        accion:
          "registrarDescarga",
        whatsapp,
        materialId,
        titulo,
        categoria,
        origen,
      });

    const separador =
      urlGoogle.includes("?")
        ? "&"
        : "?";

    const respuestaGoogle =
      await fetch(
        `${urlGoogle}${separador}${parametros.toString()}`,
        {
          method: "GET",
          cache: "no-store",
          signal:
            AbortSignal.timeout(
              90000,
            ),
        },
      );

    if (!respuestaGoogle.ok) {
      return NextResponse.json(
        {
          ok: false,
          codigo:
            "ERROR_GOOGLE",
          mensaje:
            "Google Sheets no respondió correctamente.",
          diamantesOtorgados: 0,
        },
        {
          status: 502,
        },
      );
    }

    let datos:
      | RespuestaGoogle
      | null = null;

    try {
      datos =
        (await respuestaGoogle.json()) as RespuestaGoogle;
    } catch {
      return NextResponse.json(
        {
          ok: false,
          codigo:
            "RESPUESTA_INVALIDA",
          mensaje:
            "El sistema de diamantes devolvió una respuesta inválida.",
          diamantesOtorgados: 0,
        },
        {
          status: 502,
        },
      );
    }

    if (!datos) {
      return NextResponse.json(
        {
          ok: false,
          codigo:
            "RESPUESTA_VACIA",
          mensaje:
            "El sistema de diamantes no devolvió información.",
          diamantesOtorgados: 0,
        },
        {
          status: 502,
        },
      );
    }

    const estadoHTTP =
      datos.ok === true
        ? 200
        : datos.codigo ===
              "SOLO_CLIENTES_VIP" ||
            datos.codigo ===
              "CLIENTE_NO_ENCONTRADO"
          ? 403
          : 400;

    return NextResponse.json(
      {
        ok:
          datos.ok === true,

        codigo:
          datos.codigo ||
          "RESPUESTA_RECIBIDA",

        mensaje:
          datos.mensaje ||
          "Solicitud procesada.",

        duplicado:
          datos.duplicado === true,

        premioNuevo:
          datos.premioNuevo ===
          true,

        diamantesOtorgados:
          Number(
            datos.diamantesOtorgados ||
              0,
          ),

        diamantesDisponibles:
          Number(
            datos.diamantesDisponibles ||
              0,
          ),

        diamantesGanados:
          Number(
            datos.diamantesGanados ||
              0,
          ),

        diamantesCanjeados:
          Number(
            datos.diamantesCanjeados ||
              0,
          ),

        nivel:
          datos.nivel ||
          "",
      },
      {
        status: estadoHTTP,
      },
    );
  } catch (error) {
    console.error(
      "Error registrando descarga:",
      error,
    );

    const esTiempoAgotado =
      error instanceof Error &&
      (
        error.name ===
          "TimeoutError" ||
        error.name ===
          "AbortError"
      );

    return NextResponse.json(
      {
        ok: false,
        codigo:
          esTiempoAgotado
            ? "TIEMPO_AGOTADO"
            : "ERROR_INTERNO",

        mensaje:
          esTiempoAgotado
            ? "El registro tardó demasiado. La descarga no recibió diamantes."
            : "No se pudo registrar la descarga.",

        diamantesOtorgados: 0,
      },
      {
        status:
          esTiempoAgotado
            ? 504
            : 500,
      },
    );
  }
}