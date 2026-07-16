"use client";

import {
  useCallback,
  useEffect,
  useState,
} from "react";
import { useRouter } from "next/navigation";

/* =====================================================
   TIPOS
===================================================== */

type PlanId =
  | "mensual"
  | "trimestral"
  | "anual";

type PlanMembresia = {
  id: PlanId;
  nombre: string;
  duracion: string;
  precioNormal: number;
  precioOferta: number;
  descripcion: string;
  beneficios: string[];
  destacado?: boolean;
};

type PlanOfertaApi = {
  id: PlanId;
  nombre: string;
  duracion: string;
  precioNormal: number;
  precioOferta: number;
};

type EstadoOfertaApi = {
  ok: boolean;
  estado: string;
  ofertaActiva: boolean;
  descuento: number;
  fechaInicio: string;
  fechaFinal: string;
  cuposTotales: number;
  cuposUsados: number;
  cuposDisponibles: number;
  planes: PlanOfertaApi[];
  codigo?: string;
  mensaje?: string;
};

type ReservaOfertaApi = {
  whatsapp?: string;
  planId?: PlanId;
  planNombre?: string;
  plan?: string;
  duracion?: string;
  precioNormal?: number;
  precioOferta?: number;
  estado?: string;
};

type RespuestaReservaApi = {
  ok: boolean;
  codigo: string;
  mensaje: string;
  usarPrecioNormal?: boolean;
  cuposDisponibles?: number;
  reserva?: ReservaOfertaApi;
};

type ReservaOferta = {
  whatsapp: string;
  planId: PlanId;
  planNombre: string;
  duracion: string;
  precioNormal: number;
  precioOferta: number;
  estado: string;
};

type TiempoRestante = {
  dias: number;
  horas: number;
  minutos: number;
  segundos: number;
};

/* =====================================================
   RUTAS Y CONEXIÓN CON GOOGLE SHEETS
===================================================== */

const RUTA_ACCESO = "/acceso";

const GOOGLE_SCRIPT_URL =
  "https://script.google.com/macros/s/AKfycbzXwycKtQWGWgdIYK2b1CQ7r5DLkS8_Wnw0XgI9ILiad2qIS-e8DmlTOKxX0RqY6aEL7w/exec";

/* =====================================================
   DATOS DE PAGO
===================================================== */

const DATOS_PAGO = {
  banco: "Venezuela (0102)",
  cedula: "V-16.113.624",
  telefono: "0414-4895281",
  whatsapp: "584144895281",
};

/* =====================================================
   PLANES
===================================================== */

const PLANES_MEMBRESIA: PlanMembresia[] = [
  {
    id: "mensual",
    nombre: "Membresía mensual",
    duracion: "1 mes",
    precioNormal: 3,
    precioOferta: 1.5,
    descripcion:
      "Ideal para comenzar y disfrutar todo el contenido durante un mes.",
    beneficios: [
      "Biblioteca educativa completa",
      "Descargas habilitadas",
      "Acceso al Laboratorio Tech",
      "Uso desde cualquier dispositivo",
      "Nuevos materiales y actividades",
    ],
  },
  {
    id: "trimestral",
    nombre: "Membresía trimestral",
    duracion: "3 meses",
    precioNormal: 6,
    precioOferta: 3,
    descripcion:
      "Tres meses de acceso con un precio más conveniente.",
    beneficios: [
      "Todos los beneficios del plan mensual",
      "Acceso durante 3 meses",
      "Ahorro frente al pago mensual",
      "Nuevos materiales y actividades",
      "Soporte por WhatsApp",
    ],
    destacado: true,
  },
  {
    id: "anual",
    nombre: "Membresía anual",
    duracion: "1 año",
    precioNormal: 12,
    precioOferta: 6,
    descripcion:
      "La mejor alternativa para familias, docentes y creadores frecuentes.",
    beneficios: [
      "Acceso completo durante un año",
      "Mayor ahorro",
      "Biblioteca educativa completa",
      "Acceso al Laboratorio Tech",
      "Contenido y recursos exclusivos",
    ],
  },
];

/* =====================================================
   BENEFICIOS
===================================================== */

const beneficios = [
  {
    emoji: "📚",
    titulo: "Biblioteca organizada",
    descripcion:
      "Materiales educativos clasificados por categorías para encontrarlos fácilmente.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    emoji: "🎮",
    titulo: "Aprendizaje divertido",
    descripcion:
      "Juegos, cuentos y actividades diseñadas para aprender de manera entretenida.",
    color: "from-rose-500 to-orange-400",
  },
  {
    emoji: "📱",
    titulo: "Disponible en varios dispositivos",
    descripcion:
      "Utiliza la plataforma desde teléfonos, tabletas y computadoras.",
    color: "from-violet-500 to-fuchsia-400",
  },
  {
    emoji: "⬇️",
    titulo: "Materiales descargables",
    descripcion:
      "Con una membresía activa podrás descargar los recursos educativos disponibles.",
    color: "from-amber-500 to-yellow-400",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    titulo: "Para familias y docentes",
    descripcion:
      "Recursos útiles para acompañar el aprendizaje en casa y en el aula.",
    color: "from-emerald-500 to-green-400",
  },
  {
    emoji: "🚀",
    titulo: "Contenido en crecimiento",
    descripcion:
      "La plataforma continúa incorporando nuevos materiales y herramientas.",
    color: "from-indigo-500 to-blue-400",
  },
];

/* =====================================================
   PREGUNTAS FRECUENTES
===================================================== */

const preguntasFrecuentes = [
  {
    pregunta:
      "¿Qué planes de membresía están disponibles?",
    respuesta:
      "Puedes elegir una membresía de un mes por $3, tres meses por $6 o un año por $12.",
  },
  {
    pregunta:
      "¿Cómo funciona la oferta de lanzamiento?",
    respuesta:
      "Durante siete días y hasta agotar los cupos disponibles, los planes tienen un 50 % de descuento.",
  },
  {
    pregunta:
      "¿Cuándo se descuenta un cupo?",
    respuesta:
      "El cupo se descuenta cuando escribes tu WhatsApp y presionas el botón para reservar la oferta.",
  },
  {
    pregunta:
      "¿Qué pasa cuando se agotan los cupos?",
    respuesta:
      "La página deja de ofrecer el descuento y muestra automáticamente los precios normales.",
  },
  {
    pregunta:
      "¿La membresía se renueva automáticamente?",
    respuesta:
      "Por ahora la renovación es manual. Cuando finalice tu membresía podrás realizar un nuevo pago.",
  },
  {
    pregunta:
      "¿Puedo descargar los materiales?",
    respuesta:
      "Sí. Las descargas estarán disponibles mientras tu membresía se encuentre activa.",
  },
  {
    pregunta:
      "¿Cómo se activa mi membresía?",
    respuesta:
      "Selecciona un plan, realiza el pago, envía el comprobante por WhatsApp y espera la confirmación.",
  },
  {
    pregunta:
      "¿Qué incluye la prueba gratuita?",
    respuesta:
      "Permite explorar la plataforma durante 60 minutos. Las descargas permanecen bloqueadas durante la prueba.",
  },
];

/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

const mostrarPrecio = (precio: number) => {
  if (Number.isInteger(precio)) {
    return `$${precio}`;
  }

  return `$${precio.toFixed(2)}`;
};

const normalizarTelefono = (
  telefono: string,
) => telefono.replace(/\D/g, "");

const buscarPlanLocal = (id: PlanId) =>
  PLANES_MEMBRESIA.find(
    (plan) => plan.id === id,
  ) ?? PLANES_MEMBRESIA[0];

/* =====================================================
   CONEXIÓN JSONP CON GOOGLE APPS SCRIPT

   Esto evita instalar programas o paquetes adicionales.
===================================================== */

function consultarGoogleScript<T>(
  parametros: Record<string, string>,
): Promise<T> {
  return new Promise((resolve, reject) => {
    if (typeof window === "undefined") {
      reject(
        new Error(
          "Esta consulta solo puede ejecutarse en el navegador.",
        ),
      );

      return;
    }

    const nombreCallback = `__mdi_callback_${Date.now()}_${Math.random()
      .toString(36)
      .slice(2)}`;

    const url = new URL(
      GOOGLE_SCRIPT_URL,
    );

    Object.entries(parametros).forEach(
      ([clave, valor]) => {
        url.searchParams.set(clave, valor);
      },
    );

    url.searchParams.set(
      "callback",
      nombreCallback,
    );

    const script =
      document.createElement("script");

    const ventana = window as typeof window & {
      [clave: string]: unknown;
    };

    let finalizado = false;

    const limpiar = () => {
      if (finalizado) {
        return;
      }

      finalizado = true;

      script.remove();

      try {
        delete ventana[nombreCallback];
      } catch {
        ventana[nombreCallback] =
          undefined;
      }
    };

    const temporizador = window.setTimeout(
      () => {
        limpiar();

        reject(
          new Error(
            "La consulta tardó demasiado tiempo.",
          ),
        );
      },
      15000,
    );

    ventana[nombreCallback] = (
      datos: T,
    ) => {
      window.clearTimeout(temporizador);
      limpiar();
      resolve(datos);
    };

    script.src = url.toString();
    script.async = true;

    script.onerror = () => {
      window.clearTimeout(temporizador);
      limpiar();

      reject(
        new Error(
          "No se pudo conectar con Google Sheets.",
        ),
      );
    };

    document.body.appendChild(script);
  });
}

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */

export default function InicioLanding() {
  const router = useRouter();

  const [
    planSeleccionado,
    setPlanSeleccionado,
  ] = useState<PlanMembresia | null>(
    null,
  );

  const [
    preguntaAbierta,
    setPreguntaAbierta,
  ] = useState<number | null>(null);

  const [
    estadoOferta,
    setEstadoOferta,
  ] = useState<EstadoOfertaApi | null>(
    null,
  );

  const [
    cargandoOferta,
    setCargandoOferta,
  ] = useState(true);

  const [
    errorOferta,
    setErrorOferta,
  ] = useState("");

  const [
    telefonoOferta,
    setTelefonoOferta,
  ] = useState("");

  const [
    reservandoOferta,
    setReservandoOferta,
  ] = useState(false);

  const [
    planOfertaEnProceso,
    setPlanOfertaEnProceso,
  ] = useState<PlanId | null>(null);

  const [
    mensajeReserva,
    setMensajeReserva,
  ] = useState("");

  const [
    reservaOferta,
    setReservaOferta,
  ] = useState<ReservaOferta | null>(
    null,
  );

  const [
    tiempoRestante,
    setTiempoRestante,
  ] = useState<TiempoRestante>({
    dias: 0,
    horas: 0,
    minutos: 0,
    segundos: 0,
  });

  /* ===================================================
     PRUEBA GRATUITA
  =================================================== */

  const solicitarPruebaGratis = () => {
    router.push("/acceso?modo=prueba");
  };

  /* ===================================================
     ACCESO PARA CLIENTES
  =================================================== */

  const entrarComoCliente = () => {
    router.push(RUTA_ACCESO);
  };

  /* ===================================================
     DESPLAZAMIENTO
  =================================================== */

  const irASeccion = (id: string) => {
    document
      .getElementById(id)
      ?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
  };

  const abrirOferta = () => {
    irASeccion("oferta-lanzamiento");
  };

  const abrirMembresias = () => {
    irASeccion("membresias");
  };

  /* ===================================================
     PLAN NORMAL
  =================================================== */

  const seleccionarPlan = (
    plan: PlanMembresia,
  ) => {
    setPlanSeleccionado(plan);

    setTimeout(() => {
      document
        .getElementById(
          "datos-pago-normal",
        )
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  /* ===================================================
     CONSULTAR ESTADO DE LA OFERTA
  =================================================== */

  const cargarEstadoOferta =
    useCallback(
      async (
        mostrarIndicador = false,
      ) => {
        if (mostrarIndicador) {
          setCargandoOferta(true);
        }

        try {
          const respuesta =
            await consultarGoogleScript<EstadoOfertaApi>(
              {
                accion: "estado",
              },
            );

          if (!respuesta.ok) {
            throw new Error(
              respuesta.mensaje ||
                "No se pudo consultar la oferta.",
            );
          }

          setEstadoOferta(respuesta);
          setErrorOferta("");
        } catch (error) {
          setErrorOferta(
            error instanceof Error
              ? error.message
              : "No se pudo consultar la oferta.",
          );
        } finally {
          setCargandoOferta(false);
        }
      },
      [],
    );

  useEffect(() => {
    void cargarEstadoOferta(true);

    const intervalo = window.setInterval(
      () => {
        void cargarEstadoOferta(false);
      },
      30000,
    );

    return () => {
      window.clearInterval(intervalo);
    };
  }, [cargarEstadoOferta]);

  /* ===================================================
     CUENTA REGRESIVA
  =================================================== */

  useEffect(() => {
    if (!estadoOferta?.fechaFinal) {
      return;
    }

    const actualizarTiempo = () => {
      const fechaFinal = new Date(
        estadoOferta.fechaFinal,
      ).getTime();

      const diferencia = Math.max(
        fechaFinal - Date.now(),
        0,
      );

      const dias = Math.floor(
        diferencia /
          (1000 * 60 * 60 * 24),
      );

      const horas = Math.floor(
        (diferencia /
          (1000 * 60 * 60)) %
          24,
      );

      const minutos = Math.floor(
        (diferencia / (1000 * 60)) %
          60,
      );

      const segundos = Math.floor(
        (diferencia / 1000) % 60,
      );

      setTiempoRestante({
        dias,
        horas,
        minutos,
        segundos,
      });
    };

    actualizarTiempo();

    const intervalo = window.setInterval(
      actualizarTiempo,
      1000,
    );

    return () => {
      window.clearInterval(intervalo);
    };
  }, [estadoOferta?.fechaFinal]);

  /* ===================================================
     RESERVAR OFERTA
  =================================================== */

  const reservarOferta = async (
    plan: PlanMembresia,
  ) => {
    const telefono =
      normalizarTelefono(
        telefonoOferta,
      );

    if (
      telefono.length < 8 ||
      telefono.length > 15
    ) {
      setReservaOferta(null);
      setMensajeReserva(
        "Escribe un número de WhatsApp válido, incluyendo el código del país.",
      );

      document
        .getElementById(
          "telefono-oferta",
        )
        ?.focus();

      return;
    }

    setReservandoOferta(true);
    setPlanOfertaEnProceso(plan.id);
    setMensajeReserva("");
    setReservaOferta(null);

    try {
      const respuesta =
        await consultarGoogleScript<RespuestaReservaApi>(
          {
            accion: "reservar",
            plan: plan.id,
            whatsapp: telefono,
          },
        );

      if (
        respuesta.ok &&
        respuesta.reserva
      ) {
        const datos =
          respuesta.reserva;

        const reservaNormalizada: ReservaOferta =
          {
            whatsapp:
              datos.whatsapp ||
              telefono,
            planId:
              datos.planId ||
              plan.id,
            planNombre:
              datos.planNombre ||
              datos.plan ||
              plan.nombre,
            duracion:
              datos.duracion ||
              plan.duracion,
            precioNormal: Number(
              datos.precioNormal ??
                plan.precioNormal,
            ),
            precioOferta: Number(
              datos.precioOferta ??
                plan.precioOferta,
            ),
            estado:
              datos.estado ||
              "RESERVADO",
          };

        setReservaOferta(
          reservaNormalizada,
        );

        setMensajeReserva(
          respuesta.mensaje,
        );

        await cargarEstadoOferta(false);

        setTimeout(() => {
          document
            .getElementById(
              "reserva-confirmada",
            )
            ?.scrollIntoView({
              behavior: "smooth",
              block: "center",
            });
        }, 100);

        return;
      }

      setMensajeReserva(
        respuesta.mensaje ||
          "No fue posible reservar el cupo.",
      );

      if (
        respuesta.usarPrecioNormal
      ) {
        await cargarEstadoOferta(false);
      }
    } catch (error) {
      setMensajeReserva(
        error instanceof Error
          ? error.message
          : "No fue posible reservar el cupo.",
      );
    } finally {
      setReservandoOferta(false);
      setPlanOfertaEnProceso(null);
    }
  };

  /* ===================================================
     ESTADO VISUAL DE LA OFERTA
  =================================================== */

  const ofertaDisponible =
    Boolean(
      estadoOferta?.ofertaActiva,
    ) &&
    Number(
      estadoOferta?.cuposDisponibles ??
        0,
    ) > 0;

  const cuposTotales =
    estadoOferta?.cuposTotales ?? 50;

  const cuposDisponibles =
    estadoOferta?.cuposDisponibles ?? 0;

  const porcentajeDisponible =
    cuposTotales > 0
      ? Math.max(
          0,
          Math.min(
            100,
            (cuposDisponibles /
              cuposTotales) *
              100,
          ),
        )
      : 0;

  /* ===================================================
     WHATSAPP PARA PLAN NORMAL
  =================================================== */

  const mensajeWhatsAppNormal =
    planSeleccionado
      ? `Hola, quiero activar la ${planSeleccionado.nombre} de Mundo Digital Infantil por ${mostrarPrecio(
          planSeleccionado.precioNormal,
        )}. La membresía tendrá una duración de ${planSeleccionado.duracion}. Enviaré mi comprobante de pago:`
      : "Hola, quiero recibir información sobre las membresías de Mundo Digital Infantil.";

  const enlaceWhatsAppNormal = `https://wa.me/${
    DATOS_PAGO.whatsapp
  }?text=${encodeURIComponent(
    mensajeWhatsAppNormal,
  )}`;

  /* ===================================================
     WHATSAPP PARA OFERTA
  =================================================== */

  const mensajeWhatsAppOferta =
    reservaOferta
      ? `Hola, reservé un cupo de la oferta especial de lanzamiento de Mundo Digital Infantil.

Plan: ${reservaOferta.planNombre}
Duración: ${reservaOferta.duracion}
Precio promocional: ${mostrarPrecio(
          reservaOferta.precioOferta,
        )}
Mi WhatsApp: ${reservaOferta.whatsapp}

Enviaré mi comprobante de pago:`
      : "";

  const enlaceWhatsAppOferta = `https://wa.me/${
    DATOS_PAGO.whatsapp
  }?text=${encodeURIComponent(
    mensajeWhatsAppOferta,
  )}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-white">
      {/* =================================================
          MENÚ
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex min-w-0 items-center gap-3 text-left"
            aria-label="Volver al inicio"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 text-2xl shadow-lg">
              🚀
            </span>

            <div className="min-w-0">
              <p className="truncate text-xs font-black leading-tight text-yellow-300 sm:text-base">
                MUNDO DIGITAL
              </p>

              <p className="text-[10px] font-bold tracking-[0.16em] text-cyan-300 sm:text-xs">
                INFANTIL
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-5 text-sm font-bold text-blue-100 lg:flex">
            <button
              type="button"
              onClick={abrirOferta}
              className="rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-4 py-2 font-black text-slate-950 transition hover:-translate-y-0.5"
            >
              🔥 Oferta
            </button>

            <button
              type="button"
              onClick={() =>
                irASeccion("contenido")
              }
              className="transition hover:text-yellow-300"
            >
              Contenido
            </button>

            <button
              type="button"
              onClick={() =>
                irASeccion("beneficios")
              }
              className="transition hover:text-yellow-300"
            >
              Beneficios
            </button>

            <button
              type="button"
              onClick={() =>
                irASeccion("como-funciona")
              }
              className="transition hover:text-yellow-300"
            >
              Cómo funciona
            </button>

            <button
              type="button"
              onClick={abrirMembresias}
              className="transition hover:text-yellow-300"
            >
              Membresías
            </button>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={entrarComoCliente}
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-200 transition hover:bg-cyan-300 hover:text-slate-950 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              🔐 Ya tengo membresía
            </button>
          </div>
        </div>
      </header>

      {/* =================================================
          ENCABEZADO
      ================================================= */}

      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 top-5 h-96 w-96 rounded-full bg-fuchsia-600/25 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
          <div className="text-center lg:text-left">
            <span className="mb-6 inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-extrabold text-cyan-200">
              ✨ APRENDER · JUGAR · CREAR
            </span>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-white">
                Descubre un universo
              </span>

              <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                de aprendizaje digital
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-blue-100/90 lg:mx-0 lg:text-xl">
              Materiales educativos,
              actividades infantiles y
              herramientas digitales para
              familias, docentes y creadores.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={abrirOferta}
                className="rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-8 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:brightness-110"
              >
                🔥 Ver oferta especial
              </button>

              <button
                type="button"
                onClick={
                  solicitarPruebaGratis
                }
                className="rounded-full border-2 border-cyan-300/40 bg-white/10 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-1 hover:border-cyan-300"
              >
                🛸 Prueba de 60 minutos
              </button>
            </div>

            <p className="mx-auto mt-4 max-w-xl text-sm text-blue-200/70 lg:mx-0">
              La oferta tiene cupos reales
              controlados mediante Google
              Sheets.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["📚", "Materiales"],
                ["🎮", "Actividades"],
                ["🤖", "Tecnología"],
                ["💎", "Membresía VIP"],
              ].map(([emoji, texto]) => (
                <div
                  key={texto}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"
                >
                  <span className="block text-2xl">
                    {emoji}
                  </span>

                  <span className="mt-1 block text-xs font-bold">
                    {texto}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-pink-500/20 blur-2xl" />

            <div className="relative rounded-[2.5rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                    Plataforma educativa
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Tu estación de
                    aprendizaje
                  </h2>
                </div>

                <span className="text-5xl">
                  🛰️
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 p-5 shadow-xl">
                  <span className="text-4xl">
                    📚
                  </span>

                  <h3 className="mt-5 text-xl font-black">
                    Biblioteca Estelar
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-blue-50">
                    Guías, cuentos, juegos,
                    matemáticas y caligrafía.
                  </p>

                  <span className="mt-5 inline-flex rounded-full bg-white/20 px-3 py-2 text-xs font-black">
                    🔒 Acceso protegido
                  </span>
                </article>

                <article className="rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 shadow-xl">
                  <span className="text-4xl">
                    🤖
                  </span>

                  <h3 className="mt-5 text-xl font-black">
                    Laboratorio Tech
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-violet-50">
                    Inteligencia artificial,
                    automatización y recursos
                    digitales.
                  </p>

                  <span className="mt-5 inline-flex rounded-full bg-white/20 px-3 py-2 text-xs font-black">
                    🔒 Acceso protegido
                  </span>
                </article>
              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/30 p-5">
                <p className="font-black text-yellow-200">
                  🔥 Oferta de lanzamiento
                </p>

                <p className="mt-2 text-sm leading-relaxed text-blue-100">
                  Aprovecha un 50 % de
                  descuento durante siete días
                  o hasta agotar los cupos.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          OFERTA ESPECIAL
      ================================================= */}

      <section
        id="oferta-lanzamiento"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-rose-950 via-orange-950 to-slate-950 px-5 py-24 lg:px-8"
      >
        <div className="pointer-events-none absolute -left-28 top-10 h-96 w-96 rounded-full bg-orange-500/25 blur-3xl" />

        <div className="pointer-events-none absolute -right-28 bottom-0 h-96 w-96 rounded-full bg-pink-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto max-w-4xl text-center">
            <span className="inline-flex animate-pulse items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-5 py-2 text-sm font-black uppercase tracking-[0.16em] text-yellow-200">
              🔥 Oferta especial de
              lanzamiento
            </span>

            <h2 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Obtén un{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                50 % de descuento
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-orange-100/75">
              Promoción válida durante siete
              días o hasta agotar los cupos
              disponibles.
            </p>
          </div>

          {/* ESTADO DE CONEXIÓN */}

          {cargandoOferta && (
            <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-white/10 bg-white/10 p-6 text-center backdrop-blur-xl">
              <span className="text-3xl">
                ⏳
              </span>

              <p className="mt-3 font-black">
                Consultando cupos
                disponibles...
              </p>
            </div>
          )}

          {!cargandoOferta &&
            errorOferta && (
              <div className="mx-auto mt-10 max-w-2xl rounded-3xl border border-yellow-300/30 bg-yellow-300/10 p-6 text-center">
                <p className="font-black text-yellow-200">
                  ⚠️ No pudimos verificar los
                  cupos en este momento
                </p>

                <p className="mt-2 text-sm text-orange-100/75">
                  Por seguridad se mostrarán
                  los precios normales.
                </p>

                <button
                  type="button"
                  onClick={() =>
                    void cargarEstadoOferta(
                      true,
                    )
                  }
                  className="mt-5 rounded-full bg-yellow-300 px-6 py-3 font-black text-slate-950"
                >
                  Intentar nuevamente
                </button>
              </div>
            )}

          {!cargandoOferta &&
            estadoOferta && (
              <>
                {/* CONTADOR */}

                <div className="mx-auto mt-12 grid max-w-3xl grid-cols-4 gap-3">
                  {[
                    [
                      tiempoRestante.dias,
                      "Días",
                    ],
                    [
                      tiempoRestante.horas,
                      "Horas",
                    ],
                    [
                      tiempoRestante.minutos,
                      "Minutos",
                    ],
                    [
                      tiempoRestante.segundos,
                      "Segundos",
                    ],
                  ].map(
                    ([cantidad, texto]) => (
                      <div
                        key={texto}
                        className="rounded-2xl border border-white/10 bg-white/10 p-3 text-center shadow-xl backdrop-blur-xl sm:p-5"
                      >
                        <span className="block text-2xl font-black text-yellow-300 sm:text-4xl">
                          {String(
                            cantidad,
                          ).padStart(2, "0")}
                        </span>

                        <span className="mt-1 block text-[10px] font-black uppercase tracking-wide text-orange-100/65 sm:text-xs">
                          {texto}
                        </span>
                      </div>
                    ),
                  )}
                </div>

                {/* CUPOS */}

                <div className="mx-auto mt-8 max-w-3xl rounded-[2rem] border border-white/10 bg-white/10 p-6 shadow-2xl backdrop-blur-xl">
                  <div className="flex flex-col items-center justify-between gap-3 text-center sm:flex-row sm:text-left">
                    <div>
                      <p className="text-sm font-black uppercase tracking-[0.16em] text-orange-200">
                        Cupos promocionales
                      </p>

                      <p className="mt-2 text-2xl font-black">
                        {cuposDisponibles} de{" "}
                        {cuposTotales} cupos
                        disponibles
                      </p>
                    </div>

                    <span
                      className={`rounded-full px-5 py-3 text-sm font-black ${
                        ofertaDisponible
                          ? "bg-emerald-300 text-emerald-950"
                          : "bg-rose-300 text-rose-950"
                      }`}
                    >
                      {ofertaDisponible
                        ? "OFERTA ACTIVA"
                        : estadoOferta.estado ===
                            "AGOTADA"
                          ? "CUPOS AGOTADOS"
                          : "OFERTA FINALIZADA"}
                    </span>
                  </div>

                  <div className="mt-5 h-4 overflow-hidden rounded-full bg-slate-950/50">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-400 via-yellow-300 to-orange-400 transition-all duration-500"
                      style={{
                        width: `${porcentajeDisponible}%`,
                      }}
                    />
                  </div>
                </div>

                {/* WHATSAPP */}

                {ofertaDisponible && (
                  <div className="mx-auto mt-8 max-w-2xl rounded-[2rem] border border-cyan-300/20 bg-slate-950/40 p-6 text-center shadow-xl">
                    <label
                      htmlFor="telefono-oferta"
                      className="text-lg font-black"
                    >
                      📱 Escribe tu WhatsApp
                      para reservar
                    </label>

                    <p className="mt-2 text-sm text-orange-100/65">
                      Incluye el código del
                      país. Ejemplo:
                      584141234567
                    </p>

                    <input
                      id="telefono-oferta"
                      type="tel"
                      inputMode="tel"
                      value={telefonoOferta}
                      onChange={(evento) => {
                        setTelefonoOferta(
                          evento.target.value,
                        );

                        setMensajeReserva(
                          "",
                        );
                      }}
                      placeholder="584141234567"
                      className="mt-5 w-full rounded-2xl border-2 border-white/15 bg-white px-5 py-4 text-center text-lg font-black text-slate-900 outline-none transition focus:border-cyan-400"
                    />
                  </div>
                )}

                {/* PLANES */}

                <div className="mt-12 grid gap-7 lg:grid-cols-3">
                  {PLANES_MEMBRESIA.map(
                    (plan) => {
                      const planApi =
                        estadoOferta.planes?.find(
                          (elemento) =>
                            elemento.id ===
                            plan.id,
                        );

                      const precioNormal =
                        Number(
                          planApi?.precioNormal ??
                            plan.precioNormal,
                        );

                      const precioOferta =
                        Number(
                          planApi?.precioOferta ??
                            plan.precioOferta,
                        );

                      return (
                        <article
                          key={plan.id}
                          className={`relative flex flex-col overflow-hidden rounded-[2.5rem] border bg-white p-7 text-slate-900 shadow-2xl transition hover:-translate-y-2 sm:p-8 ${
                            plan.destacado
                              ? "border-yellow-300 ring-4 ring-yellow-300/20"
                              : "border-orange-200"
                          }`}
                        >
                          {plan.destacado && (
                            <span className="absolute right-4 top-4 rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-4 py-2 text-xs font-black uppercase text-slate-950">
                              Más elegido
                            </span>
                          )}

                          <span className="text-5xl">
                            {plan.id ===
                            "mensual"
                              ? "🚀"
                              : plan.id ===
                                  "trimestral"
                                ? "💎"
                                : "🌟"}
                          </span>

                          <h3 className="mt-5 text-2xl font-black">
                            {plan.nombre}
                          </h3>

                          <p className="mt-2 font-bold text-slate-500">
                            Acceso durante{" "}
                            {plan.duracion}
                          </p>

                          {ofertaDisponible ? (
                            <>
                              <p className="mt-7 text-lg font-black text-slate-400 line-through">
                                Antes:{" "}
                                {mostrarPrecio(
                                  precioNormal,
                                )}
                              </p>

                              <div className="mt-1 flex items-end gap-2">
                                <span className="text-5xl font-black text-rose-600">
                                  {mostrarPrecio(
                                    precioOferta,
                                  )}
                                </span>

                                <span className="pb-2 text-sm font-black text-emerald-600">
                                  50 % DTO.
                                </span>
                              </div>

                              <p className="mt-3 rounded-xl bg-rose-50 px-3 py-2 text-sm font-black text-rose-700">
                                Ahorras{" "}
                                {mostrarPrecio(
                                  precioNormal -
                                    precioOferta,
                                )}
                              </p>
                            </>
                          ) : (
                            <>
                              <p className="mt-7 text-sm font-black uppercase tracking-wider text-slate-400">
                                Precio normal
                              </p>

                              <span className="mt-2 text-5xl font-black text-emerald-600">
                                {mostrarPrecio(
                                  precioNormal,
                                )}
                              </span>
                            </>
                          )}

                          <ul className="mt-7 flex-1 space-y-3">
                            {plan.beneficios
                              .slice(0, 4)
                              .map(
                                (
                                  beneficio,
                                ) => (
                                  <li
                                    key={
                                      beneficio
                                    }
                                    className="flex items-start gap-3 text-sm font-bold text-slate-600"
                                  >
                                    <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                                      ✓
                                    </span>

                                    <span>
                                      {
                                        beneficio
                                      }
                                    </span>
                                  </li>
                                ),
                              )}
                          </ul>

                          {ofertaDisponible ? (
                            <button
                              type="button"
                              disabled={
                                reservandoOferta
                              }
                              onClick={() =>
                                void reservarOferta(
                                  plan,
                                )
                              }
                              className="mt-8 w-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-6 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
                            >
                              {planOfertaEnProceso ===
                                plan.id &&
                              reservandoOferta
                                ? "⏳ Reservando..."
                                : `🔥 Reservar por ${mostrarPrecio(
                                    precioOferta,
                                  )}`}
                            </button>
                          ) : (
                            <button
                              type="button"
                              onClick={() =>
                                seleccionarPlan(
                                  plan,
                                )
                              }
                              className="mt-8 w-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-6 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1"
                            >
                              Elegir a precio
                              normal
                            </button>
                          )}
                        </article>
                      );
                    },
                  )}
                </div>

                {/* MENSAJE DE RESERVA */}

                {mensajeReserva && (
                  <div
                    className={`mx-auto mt-10 max-w-3xl rounded-3xl border p-6 text-center ${
                      reservaOferta
                        ? "border-emerald-300/30 bg-emerald-300/10"
                        : "border-rose-300/30 bg-rose-300/10"
                    }`}
                  >
                    <p
                      className={`font-black ${
                        reservaOferta
                          ? "text-emerald-200"
                          : "text-rose-200"
                      }`}
                    >
                      {reservaOferta
                        ? "✅ "
                        : "⚠️ "}
                      {mensajeReserva}
                    </p>
                  </div>
                )}

                {/* RESERVA CONFIRMADA */}

                {reservaOferta && (
                  <div
                    id="reserva-confirmada"
                    className="mx-auto mt-12 grid max-w-5xl scroll-mt-28 overflow-hidden rounded-[2.5rem] border-2 border-emerald-300 bg-white text-slate-900 shadow-2xl lg:grid-cols-2"
                  >
                    <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-7 text-white sm:p-10">
                      <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">
                        Cupo reservado
                      </span>

                      <h3 className="mt-5 text-3xl font-black">
                        {
                          reservaOferta.planNombre
                        }
                      </h3>

                      <p className="mt-3 text-lg font-bold text-emerald-50">
                        Duración:{" "}
                        {
                          reservaOferta.duracion
                        }
                      </p>

                      <div className="mt-6">
                        <span className="text-5xl font-black">
                          {mostrarPrecio(
                            reservaOferta.precioOferta,
                          )}
                        </span>
                      </div>

                      <p className="mt-3 text-sm font-bold text-emerald-50">
                        Precio normal:{" "}
                        <span className="line-through">
                          {mostrarPrecio(
                            reservaOferta.precioNormal,
                          )}
                        </span>
                      </p>

                      <div className="mt-7 rounded-2xl border border-white/20 bg-white/10 p-5">
                        <p className="font-black">
                          WhatsApp registrado
                        </p>

                        <p className="mt-2 text-xl font-black">
                          {
                            reservaOferta.whatsapp
                          }
                        </p>
                      </div>
                    </div>

                    <div className="p-7 sm:p-10">
                      <div className="text-center">
                        <span className="text-5xl">
                          📲
                        </span>

                        <h3 className="mt-4 text-3xl font-black text-emerald-600">
                          Realiza el pago
                        </h3>
                      </div>

                      <div className="mt-7 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        <p>
                          🏦 Banco:{" "}
                          <strong className="text-blue-700">
                            {
                              DATOS_PAGO.banco
                            }
                          </strong>
                        </p>

                        <p>
                          📝 Cédula:{" "}
                          <strong className="text-blue-700">
                            {
                              DATOS_PAGO.cedula
                            }
                          </strong>
                        </p>

                        <p>
                          📱 Teléfono:{" "}
                          <strong className="text-blue-700">
                            {
                              DATOS_PAGO.telefono
                            }
                          </strong>
                        </p>

                        <p>
                          💵 Monto:{" "}
                          <strong className="text-emerald-600">
                            {mostrarPrecio(
                              reservaOferta.precioOferta,
                            )}
                          </strong>
                        </p>
                      </div>

                      <a
                        href={
                          enlaceWhatsAppOferta
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-4 text-center text-lg font-black text-white shadow-lg transition hover:-translate-y-1"
                      >
                        📲 Enviar comprobante
                        por WhatsApp
                      </a>
                    </div>
                  </div>
                )}
              </>
            )}
        </div>
      </section>

      {/* =================================================
          CLIENTES CON MEMBRESÍA
      ================================================= */}

      <section className="relative border-y border-white/10 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-blue-500/20 px-5 py-10 lg:px-8">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-7 rounded-[2rem] border border-emerald-300/25 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8 lg:flex-row lg:text-left">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-300 to-cyan-400 text-4xl shadow-xl">
              🔐
            </span>

            <div>
              <span className="inline-flex rounded-full bg-emerald-300/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                Acceso para miembros
              </span>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                ¿Ya tienes una membresía
                activa?
              </h2>

              <p className="mt-2 max-w-2xl leading-relaxed text-blue-100/75">
                Ingresa con el mismo número
                de WhatsApp utilizado para
                enviar tu comprobante.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={entrarComoCliente}
            className="w-full shrink-0 rounded-full bg-gradient-to-r from-emerald-300 to-cyan-400 px-7 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1 lg:w-auto"
          >
            ✅ Ingresar a mi cuenta
          </button>
        </div>
      </section>

      {/* =================================================
          CONTENIDO
      ================================================= */}

      <section
        id="contenido"
        className="scroll-mt-24 bg-gradient-to-b from-slate-950 to-indigo-950 px-5 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-cyan-200">
              CONOCE TODO LO QUE INCLUYE
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Dos espacios llenos de
              posibilidades
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-blue-600/30 to-cyan-500/10 p-7 shadow-2xl sm:p-9">
              <span className="inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-blue-950">
                PARA NIÑOS, FAMILIAS Y
                DOCENTES
              </span>

              <h3 className="mt-6 text-3xl font-black text-cyan-200 sm:text-4xl">
                Biblioteca Estelar
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                Recursos para fortalecer
                diferentes áreas del
                aprendizaje.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "📖 Cuentos y lecturas",
                  "🔢 Matemáticas",
                  "✍️ Caligrafía",
                  "🧠 Recursos para TDAH",
                  "🧩 Método Montessori",
                  "🗣️ Terapia de lenguaje",
                  "🎮 Juegos educativos",
                  "🖼️ Pictogramas",
                ].map((elemento) => (
                  <div
                    key={elemento}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold"
                  >
                    {elemento}
                  </div>
                ))}
              </div>

              <div className="mt-8 inline-flex rounded-full border border-cyan-200/30 bg-cyan-300/15 px-6 py-3 font-black text-cyan-100">
                🔒 Disponible con prueba o
                membresía activa
              </div>
            </article>

            <article className="rounded-[2.5rem] border border-fuchsia-300/20 bg-gradient-to-br from-violet-600/30 to-fuchsia-500/10 p-7 shadow-2xl sm:p-9">
              <span className="inline-flex rounded-full bg-fuchsia-300 px-4 py-2 text-sm font-black text-violet-950">
                PARA ADULTOS Y CREADORES
              </span>

              <h3 className="mt-6 text-3xl font-black text-fuchsia-200 sm:text-4xl">
                Laboratorio Tech
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-violet-100">
                Herramientas digitales para
                aprender, crear y mejorar
                proyectos.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "🤖 Inteligencia artificial",
                  "⚙️ Automatización",
                  "📊 Google Sheets",
                  "📣 Marketing digital",
                  "🎨 Diseño para redes",
                  "🗓️ Calendarios de contenido",
                  "🧠 Productividad",
                  "📱 Herramientas digitales",
                ].map((elemento) => (
                  <div
                    key={elemento}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold"
                  >
                    {elemento}
                  </div>
                ))}
              </div>

              <div className="mt-8 inline-flex rounded-full border border-fuchsia-200/30 bg-fuchsia-300/15 px-6 py-3 font-black text-fuchsia-100">
                🔒 Disponible con prueba o
                membresía activa
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =================================================
          BENEFICIOS
      ================================================= */}

      <section
        id="beneficios"
        className="scroll-mt-24 bg-slate-50 px-5 py-20 text-slate-900 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-black text-violet-700">
              TODO EN UN MISMO LUGAR
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Una plataforma para facilitar
              el aprendizaje
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {beneficios.map(
              (beneficio) => (
                <article
                  key={
                    beneficio.titulo
                  }
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${beneficio.color}`}
                  />

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                    {
                      beneficio.emoji
                    }
                  </div>

                  <h3 className="mt-5 text-xl font-black">
                    {
                      beneficio.titulo
                    }
                  </h3>

                  <p className="mt-3 leading-relaxed text-slate-600">
                    {
                      beneficio.descripcion
                    }
                  </p>
                </article>
              ),
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          CÓMO FUNCIONA
      ================================================= */}

      <section
        id="como-funciona"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-5 py-24 lg:px-8"
      >
        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-5 py-2 text-sm font-black uppercase tracking-[0.14em] text-yellow-200">
              ✨ Comenzar es muy fácil
            </span>

            <h2 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Elige cómo quieres{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                comenzar
              </span>
            </h2>
          </div>

          <div className="grid gap-7 lg:grid-cols-3">
            {[
              {
                numero: "01",
                emoji: "🔍",
                etiqueta: "DESCUBRE",
                titulo:
                  "Conoce la propuesta",
                descripcion:
                  "Revisa los contenidos, beneficios y herramientas disponibles.",
                color:
                  "from-yellow-300 to-orange-400",
              },
              {
                numero: "02",
                emoji: "🛸",
                etiqueta: "EXPLORA",
                titulo:
                  "Solicita la prueba",
                descripcion:
                  "Registra tu teléfono y explora gratuitamente durante 60 minutos.",
                color:
                  "from-orange-400 to-pink-500",
              },
              {
                numero: "03",
                emoji: "💎",
                etiqueta: "DESBLOQUEA",
                titulo:
                  "Elige tu membresía",
                descripcion:
                  "Aprovecha la oferta o selecciona uno de los planes regulares.",
                color:
                  "from-cyan-300 to-emerald-400",
              },
            ].map((paso) => (
              <article
                key={paso.numero}
                className="group relative flex h-full flex-col overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.08] p-7 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-3 hover:bg-white/[0.12] sm:p-8"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${paso.color}`}
                />

                <span className="absolute right-6 top-6 text-6xl font-black text-white/[0.04]">
                  {paso.numero}
                </span>

                <div
                  className={`flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${paso.color} text-4xl shadow-xl transition group-hover:scale-110`}
                >
                  {paso.emoji}
                </div>

                <span className="mt-7 text-xs font-black uppercase tracking-[0.2em] text-yellow-200">
                  {paso.etiqueta}
                </span>

                <h3 className="mt-2 text-2xl font-black">
                  {paso.titulo}
                </h3>

                <p className="mt-4 leading-relaxed text-blue-100/70">
                  {paso.descripcion}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-12 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={abrirOferta}
              className="rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-8 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1"
            >
              🔥 Ver oferta especial
            </button>

            <button
              type="button"
              onClick={solicitarPruebaGratis}
              className="rounded-full border-2 border-cyan-300 bg-cyan-300/10 px-8 py-4 text-lg font-black text-cyan-200 transition hover:-translate-y-1"
            >
              🛸 Solicitar prueba
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          PLANES NORMALES
      ================================================= */}

      <section
        id="membresias"
        className="scroll-mt-24 bg-slate-50 px-5 py-20 text-slate-900 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
              PRECIOS REGULARES
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Planes de membresía
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Estos precios se aplican cuando
              termina la oferta o se agotan los
              cupos promocionales.
            </p>
          </div>

          <div className="grid gap-7 lg:grid-cols-3">
            {PLANES_MEMBRESIA.map(
              (plan) => (
                <article
                  key={plan.id}
                  className={`relative flex flex-col rounded-[2.5rem] border-4 bg-white p-7 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl sm:p-8 ${
                    plan.destacado
                      ? "border-yellow-300 lg:scale-105"
                      : "border-emerald-200"
                  }`}
                >
                  {plan.destacado && (
                    <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-5 py-2 text-xs font-black uppercase text-slate-950 shadow-lg">
                      Más recomendado
                    </span>
                  )}

                  <div className="text-center">
                    <span className="text-5xl">
                      {plan.id ===
                      "mensual"
                        ? "🚀"
                        : plan.id ===
                            "trimestral"
                          ? "💎"
                          : "🌟"}
                    </span>

                    <h3 className="mt-5 text-2xl font-black">
                      {plan.nombre}
                    </h3>

                    <div className="mt-5">
                      <span className="text-5xl font-black text-emerald-600">
                        {mostrarPrecio(
                          plan.precioNormal,
                        )}
                      </span>
                    </div>

                    <p className="mt-2 font-black text-slate-500">
                      Acceso por{" "}
                      {plan.duracion}
                    </p>

                    <p className="mt-5 min-h-[72px] leading-relaxed text-slate-600">
                      {plan.descripcion}
                    </p>
                  </div>

                  <ul className="mt-7 flex-1 space-y-4">
                    {plan.beneficios.map(
                      (beneficio) => (
                        <li
                          key={beneficio}
                          className="flex items-start gap-3 font-bold text-slate-700"
                        >
                          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                            ✓
                          </span>

                          <span>
                            {beneficio}
                          </span>
                        </li>
                      ),
                    )}
                  </ul>

                  <button
                    type="button"
                    onClick={() =>
                      seleccionarPlan(plan)
                    }
                    className={`mt-8 w-full rounded-full px-6 py-4 text-lg font-black shadow-xl transition hover:-translate-y-1 ${
                      plan.destacado
                        ? "bg-gradient-to-r from-yellow-300 to-orange-400 text-slate-950"
                        : "bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950"
                    }`}
                  >
                    Elegir membresía
                  </button>
                </article>
              ),
            )}
          </div>

          {planSeleccionado && (
            <div
              id="datos-pago-normal"
              className="mt-14 grid scroll-mt-28 overflow-hidden rounded-[2.5rem] border border-emerald-300 bg-white shadow-2xl lg:grid-cols-2"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-7 text-white sm:p-10">
                <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">
                  Plan seleccionado
                </span>

                <h3 className="mt-5 text-3xl font-black">
                  {
                    planSeleccionado.nombre
                  }
                </h3>

                <span className="mt-6 block text-5xl font-black">
                  {mostrarPrecio(
                    planSeleccionado.precioNormal,
                  )}
                </span>

                <p className="mt-3 text-lg font-bold text-emerald-50">
                  Vigencia:{" "}
                  {
                    planSeleccionado.duracion
                  }
                </p>
              </div>

              <div className="p-7 sm:p-10">
                <div className="text-center">
                  <span className="text-5xl">
                    📲
                  </span>

                  <h3 className="mt-4 text-3xl font-black text-emerald-600">
                    Datos de pago
                  </h3>
                </div>

                <div className="mt-7 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p>
                    🏦 Banco:{" "}
                    <strong className="text-blue-700">
                      {
                        DATOS_PAGO.banco
                      }
                    </strong>
                  </p>

                  <p>
                    📝 Cédula:{" "}
                    <strong className="text-blue-700">
                      {
                        DATOS_PAGO.cedula
                      }
                    </strong>
                  </p>

                  <p>
                    📱 Teléfono:{" "}
                    <strong className="text-blue-700">
                      {
                        DATOS_PAGO.telefono
                      }
                    </strong>
                  </p>

                  <p>
                    💵 Monto:{" "}
                    <strong className="text-emerald-600">
                      {mostrarPrecio(
                        planSeleccionado.precioNormal,
                      )}
                    </strong>
                  </p>
                </div>

                <a
                  href={
                    enlaceWhatsAppNormal
                  }
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center rounded-2xl bg-[#25D366] px-5 py-4 text-center text-lg font-black text-white shadow-lg transition hover:-translate-y-1"
                >
                  📲 Enviar comprobante por
                  WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() =>
                    setPlanSeleccionado(
                      null,
                    )
                  }
                  className="mt-4 w-full font-bold text-slate-400 underline"
                >
                  Cambiar membresía
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          PRUEBA GRATUITA
      ================================================= */}

      <section className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 px-5 py-16 text-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">
              ¿Quieres explorar antes de
              elegir?
            </h2>

            <p className="mt-3 max-w-2xl text-lg font-semibold">
              Registra tu número y disfruta de
              60 minutos para conocer la
              plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={
              solicitarPruebaGratis
            }
            className="w-full rounded-full bg-slate-950 px-8 py-5 text-lg font-black text-yellow-300 shadow-2xl lg:w-auto"
          >
            🛸 Solicitar prueba de 60
            minutos
          </button>
        </div>
      </section>

      {/* =================================================
          PREGUNTAS
      ================================================= */}

      <section
        id="preguntas"
        className="scroll-mt-24 bg-slate-950 px-5 py-20"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black sm:text-5xl">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            {preguntasFrecuentes.map(
              (elemento, indice) => {
                const abierta =
                  preguntaAbierta ===
                  indice;

                return (
                  <article
                    key={
                      elemento.pregunta
                    }
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  >
                    <button
                      type="button"
                      onClick={() =>
                        setPreguntaAbierta(
                          abierta
                            ? null
                            : indice,
                        )
                      }
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left font-black"
                    >
                      <span>
                        {
                          elemento.pregunta
                        }
                      </span>

                      <span>
                        {abierta
                          ? "−"
                          : "+"}
                      </span>
                    </button>

                    {abierta && (
                      <div className="border-t border-white/10 px-5 py-5 text-blue-100/75">
                        {
                          elemento.respuesta
                        }
                      </div>
                    )}
                  </article>
                );
              },
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          LLAMADO FINAL
      ================================================= */}

      <section className="border-t border-white/10 bg-indigo-950 px-5 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="text-6xl">
            🌟
          </span>

          <h2 className="mt-5 text-3xl font-black sm:text-4xl">
            El conocimiento está listo para
            despegar
          </h2>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={abrirOferta}
              className="rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-7 py-4 font-black text-slate-950"
            >
              🔥 Ver oferta especial
            </button>

            <button
              type="button"
              onClick={entrarComoCliente}
              className="rounded-full border-2 border-cyan-300 bg-cyan-300/10 px-7 py-4 font-black text-cyan-200"
            >
              🔐 Ya tengo membresía
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          PIE DE PÁGINA
      ================================================= */}

      <footer className="border-t border-white/10 bg-slate-950 px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-black text-yellow-300">
            🚀 MUNDO DIGITAL INFANTIL
          </p>

          <p className="text-sm font-bold text-blue-300/50">
            MUNDO DIGITAL INFANTIL © 2026
          </p>
        </div>
      </footer>
    </main>
  );
}