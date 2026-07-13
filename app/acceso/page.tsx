"use client";

import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

/* =====================================================
   CONFIGURACIÓN
===================================================== */

const URL_GOOGLE_SCRIPT =
  "https://script.google.com/macros/s/AKfycbyOVBJe4VD3a3q8X8SFfhDfrgiaTJWiOFOkjOQ6LUlq-9-5mlaYIdzYWBUUCxp6HPX7gA/exec";

const RUTA_BIBLIOTECA = "/biblioteca";
const NUMERO_WHATSAPP = "584144895281";
const DURACION_PRUEBA = 60 * 60 * 1000;

/* =====================================================
   TIPOS DE DATOS
===================================================== */

type TipoMensaje =
  | "neutral"
  | "cargando"
  | "exito"
  | "advertencia"
  | "error";

type RespuestaGoogle = {
  encontrado?: boolean;
  estado?: string;
  inicioPrueba?: unknown;
  nombre?: string;
};

/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

function limpiarTelefono(valor: string): string {
  return valor.replace(/\D/g, "").slice(0, 15);
}

function convertirFechaAMilisegundos(
  valor: unknown,
): number | null {
  if (
    valor === null ||
    valor === undefined ||
    valor === ""
  ) {
    return null;
  }

  if (typeof valor === "number") {
    return valor < 100000000000
      ? valor * 1000
      : valor;
  }

  const texto = String(valor).trim();
  const numero = Number(texto);

  if (!Number.isNaN(numero)) {
    return numero < 100000000000
      ? numero * 1000
      : numero;
  }

  const fechaConvertida = new Date(texto).getTime();

  return Number.isNaN(fechaConvertida)
    ? null
    : fechaConvertida;
}

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */

export default function Acceso() {
  const router = useRouter();

  const autoVerificacionRealizada =
    useRef(false);

  const [telefono, setTelefono] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  const [tipoMensaje, setTipoMensaje] =
    useState<TipoMensaje>("neutral");

  const [cargando, setCargando] =
    useState(false);

  /* ===================================================
     OCULTAR EL BOTÓN AZUL ☰

     Este efecto solamente funciona mientras
     el usuario está dentro de /acceso.
  =================================================== */

  useEffect(() => {
    const ocultarMenuAzul = () => {
      const botones =
        document.querySelectorAll<HTMLButtonElement>(
          "button",
        );

      botones.forEach((boton) => {
        const texto =
          boton.textContent
            ?.replace(/\s+/g, "")
            .trim() || "";

        const ariaLabel =
          boton
            .getAttribute("aria-label")
            ?.toLowerCase() || "";

        const titulo =
          boton
            .getAttribute("title")
            ?.toLowerCase() || "";

        const esBotonMenu =
          texto === "☰" ||
          ariaLabel.includes("abrir menú") ||
          ariaLabel.includes("abrir menu") ||
          titulo.includes("abrir menú") ||
          titulo.includes("abrir menu");

        if (esBotonMenu) {
          boton.setAttribute(
            "data-menu-oculto-en-acceso",
            "true",
          );

          boton.style.setProperty(
            "display",
            "none",
            "important",
          );
        }
      });
    };

    ocultarMenuAzul();

    const observador = new MutationObserver(
      ocultarMenuAzul,
    );

    observador.observe(document.body, {
      childList: true,
      subtree: true,
    });

    return () => {
      observador.disconnect();

      const botonesOcultos =
        document.querySelectorAll<HTMLElement>(
          '[data-menu-oculto-en-acceso="true"]',
        );

      botonesOcultos.forEach((elemento) => {
        elemento.style.removeProperty(
          "display",
        );

        elemento.removeAttribute(
          "data-menu-oculto-en-acceso",
        );
      });
    };
  }, []);

  /* ===================================================
     ABRIR LA BIBLIOTECA
  =================================================== */

  const abrirBiblioteca = useCallback(
    (
      tipoAcceso: "vip" | "prueba",
      limitePrueba?: number,
    ) => {
      if (tipoAcceso === "vip") {
        localStorage.setItem(
          "accesoVIP",
          "true",
        );

        localStorage.removeItem(
          "limitePrueba",
        );
      }

      if (
        tipoAcceso === "prueba" &&
        limitePrueba
      ) {
        localStorage.removeItem(
          "accesoVIP",
        );

        localStorage.setItem(
          "limitePrueba",
          limitePrueba.toString(),
        );
      }

      setTimeout(() => {
        router.replace(
          RUTA_BIBLIOTECA,
        );
      }, 1000);
    },
    [router],
  );

  /* ===================================================
     VERIFICAR ACCESO EN GOOGLE SHEETS
  =================================================== */

  const verificarAcceso = useCallback(
    async (
      telefonoRecibido?: string,
    ) => {
      const numero =
        limpiarTelefono(
          telefonoRecibido ??
            telefono,
        );

      setTelefono(numero);

      if (!numero) {
        setTipoMensaje(
          "advertencia",
        );

        setMensaje(
          "⚠️ Escribe tu número de WhatsApp.",
        );

        return;
      }

      if (
        numero.length < 10 ||
        numero.length > 15
      ) {
        setTipoMensaje(
          "advertencia",
        );

        setMensaje(
          "⚠️ Revisa el número. Incluye el código del país y escribe entre 10 y 15 dígitos.",
        );

        return;
      }

      setCargando(true);
      setTipoMensaje("cargando");

      setMensaje(
        "🛰️ Buscando tu acceso en la base de datos...",
      );

      const controlador =
        new AbortController();

      const limiteConexion =
        window.setTimeout(() => {
          controlador.abort();
        }, 15000);

      try {
        const urlConsulta =
          `${URL_GOOGLE_SCRIPT}` +
          `?whatsapp=${encodeURIComponent(
            numero,
          )}`;

        const respuesta =
          await fetch(urlConsulta, {
            method: "GET",
            cache: "no-store",
            signal:
              controlador.signal,
          });

        if (!respuesta.ok) {
          throw new Error(
            `Error ${respuesta.status}`,
          );
        }

        const datos =
          (await respuesta.json()) as RespuestaGoogle;

        if (!datos.encontrado) {
          setTipoMensaje("error");

          setMensaje(
            "❌ Este número no aparece en nuestra base de datos. Verifica que sea el mismo número utilizado para enviar el comprobante.",
          );

          return;
        }

        const estado = String(
          datos.estado ?? "",
        )
          .trim()
          .toLowerCase();

        const esVIP = [
          "pagado",
          "vip",
          "activo",
          "aprobado",
        ].includes(estado);

        /* ACCESO VIP */

        if (esVIP) {
          const saludo =
            datos.nombre
              ? `, ${datos.nombre}`
              : "";

          setTipoMensaje("exito");

          setMensaje(
            `✅ ¡Acceso VIP aprobado${saludo}! Entrando a la biblioteca...`,
          );

          abrirBiblioteca("vip");

          return;
        }

        /* ACCESO DE PRUEBA */

        if (estado === "prueba") {
          const inicioPrueba =
            convertirFechaAMilisegundos(
              datos.inicioPrueba,
            );

          if (!inicioPrueba) {
            setTipoMensaje("error");

            setMensaje(
              "⚠️ Encontramos tu prueba, pero la fecha de inicio no es válida. Comunícate con soporte.",
            );

            return;
          }

          const limite =
            inicioPrueba +
            DURACION_PRUEBA;

          const ahora = Date.now();

          if (ahora >= limite) {
            localStorage.removeItem(
              "limitePrueba",
            );

            localStorage.removeItem(
              "accesoVIP",
            );

            setTipoMensaje(
              "advertencia",
            );

            setMensaje(
              "⏳ Tu prueba gratuita de 60 minutos ya terminó. Activa el acceso VIP para continuar.",
            );

            return;
          }

          const minutosRestantes =
            Math.max(
              1,
              Math.ceil(
                (limite - ahora) /
                  60000,
              ),
            );

          setTipoMensaje("exito");

          setMensaje(
            `⏱️ Prueba validada. Te quedan aproximadamente ${minutosRestantes} minutos. Entrando...`,
          );

          abrirBiblioteca(
            "prueba",
            limite,
          );

          return;
        }

        /* PAGO PENDIENTE */

        if (
          estado === "pendiente" ||
          estado === "revision" ||
          estado === "en revision"
        ) {
          setTipoMensaje(
            "advertencia",
          );

          setMensaje(
            "🕐 Tu pago todavía está en revisión. Intenta nuevamente después de recibir la confirmación.",
          );

          return;
        }

        setTipoMensaje(
          "advertencia",
        );

        setMensaje(
          "⚠️ El número fue encontrado, pero todavía no tiene un acceso activo.",
        );
      } catch (error) {
        console.error(
          "Error al verificar acceso:",
          error,
        );

        if (
          error instanceof Error &&
          error.name ===
            "AbortError"
        ) {
          setTipoMensaje("error");

          setMensaje(
            "⚠️ La consulta tardó demasiado. Revisa tu conexión e intenta nuevamente.",
          );
        } else {
          setTipoMensaje("error");

          setMensaje(
            "⚠️ No pudimos conectarnos con Google Sheets. Intenta nuevamente.",
          );
        }
      } finally {
        window.clearTimeout(
          limiteConexion,
        );

        setCargando(false);
      }
    },
    [telefono, abrirBiblioteca],
  );

  /* ===================================================
     ENLACE AUTOMÁTICO PARA CLIENTES VIP

     Ejemplo:
     /acceso?telefono=584141234567&auto=1
  =================================================== */

  useEffect(() => {
    if (
      autoVerificacionRealizada.current
    ) {
      return;
    }

    autoVerificacionRealizada.current =
      true;

    const parametros =
      new URLSearchParams(
        window.location.search,
      );

    const telefonoURL =
      limpiarTelefono(
        parametros.get(
          "telefono",
        ) ?? "",
      );

    const accesoAutomatico =
      parametros.get("auto") ===
      "1";

    if (telefonoURL) {
      setTelefono(telefonoURL);
    }

    if (
      telefonoURL &&
      accesoAutomatico
    ) {
      void verificarAcceso(
        telefonoURL,
      );
    }
  }, [verificarAcceso]);

  /* ===================================================
     FORMULARIO
  =================================================== */

  const enviarFormulario = (
    evento: FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault();

    void verificarAcceso();
  };

  /* ===================================================
     WHATSAPP
  =================================================== */

  const mensajeWhatsApp =
    "Hola, ya realicé mi pago para Mundo Digital Infantil. Enviaré mi comprobante para solicitar la activación del acceso VIP.";

  const enlaceWhatsApp =
    `https://wa.me/${NUMERO_WHATSAPP}` +
    `?text=${encodeURIComponent(
      mensajeWhatsApp,
    )}`;

  /* ===================================================
     COLOR DEL MENSAJE
  =================================================== */

  const claseMensaje = {
    neutral:
      "border-white/10 bg-white/5 text-blue-100",

    cargando:
      "border-cyan-300/30 bg-cyan-300/10 text-cyan-100",

    exito:
      "border-emerald-300/40 bg-emerald-300/10 text-emerald-100",

    advertencia:
      "border-amber-300/40 bg-amber-300/10 text-amber-100",

    error:
      "border-rose-300/40 bg-rose-300/10 text-rose-100",
  }[tipoMensaje];

  return (
    <main className="relative min-h-screen overflow-hidden bg-slate-950 font-sans text-white">
      {/* FONDO */}

      <div className="pointer-events-none absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-blue-600/30 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/25 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

      {/* ENCABEZADO */}

      <header className="relative z-20 border-b border-white/10 bg-slate-950/70 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">
          <button
            type="button"
            onClick={() =>
              router.push("/")
            }
            className="flex items-center gap-3 text-left"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 text-2xl shadow-lg">
              🚀
            </span>

            <div>
              <p className="text-sm font-black leading-tight text-yellow-300 sm:text-base">
                MUNDO DIGITAL
              </p>

              <p className="text-xs font-bold tracking-[0.2em] text-cyan-300">
                INFANTIL
              </p>
            </div>
          </button>

          <button
            type="button"
            onClick={() =>
              router.push("/")
            }
            className="rounded-full border border-white/15 bg-white/5 px-4 py-2 text-sm font-bold text-blue-100 transition hover:bg-white/10"
          >
            ← Volver al inicio
          </button>
        </div>
      </header>

      {/* CONTENIDO */}

      <section className="relative z-10 mx-auto max-w-7xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto mb-12 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200">
            🔐 CENTRO DE ACCESO
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Ingresa a tu universo

            <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              de aprendizaje digital
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-blue-100/80">
            Escribe el mismo número de WhatsApp
            utilizado para registrarte o enviar tu
            comprobante.
          </p>
        </div>

        {/* OPCIONES */}

        <div className="mb-10 grid gap-6 lg:grid-cols-2">
          <article className="relative overflow-hidden rounded-[2rem] border border-yellow-300/25 bg-gradient-to-br from-yellow-300/15 to-orange-500/10 p-7 shadow-2xl">
            <div className="absolute -right-10 -top-10 text-[9rem] opacity-10">
              ⏱️
            </div>

            <div className="relative">
              <span className="inline-flex rounded-full bg-yellow-300 px-4 py-2 text-sm font-black text-slate-950">
                PRUEBA GRATUITA
              </span>

              <h2 className="mt-5 text-3xl font-black text-yellow-200">
                Explora durante 60 minutos
              </h2>

              <p className="mt-3 leading-relaxed text-blue-100/80">
                Conoce la plataforma, visualiza
                los materiales y descubre sus
                herramientas.
              </p>

              <ul className="mt-6 space-y-3 text-sm font-bold">
                <li>✓ Acceso temporal de una hora</li>
                <li>✓ Visualización de contenidos</li>
                <li>🔒 Descargas bloqueadas</li>
              </ul>
            </div>
          </article>

          <article className="relative overflow-hidden rounded-[2rem] border border-emerald-300/25 bg-gradient-to-br from-emerald-400/15 to-cyan-500/10 p-7 shadow-2xl">
            <div className="absolute -right-10 -top-10 text-[9rem] opacity-10">
              💎
            </div>

            <div className="relative">
              <span className="inline-flex rounded-full bg-emerald-300 px-4 py-2 text-sm font-black text-slate-950">
                ACCESO VIP
              </span>

              <h2 className="mt-5 text-3xl font-black text-emerald-200">
                Acceso completo e ilimitado
              </h2>

              <p className="mt-3 leading-relaxed text-blue-100/80">
                Disfruta de la biblioteca, descarga
                materiales y utiliza todas las
                herramientas disponibles.
              </p>

              <ul className="mt-6 space-y-3 text-sm font-bold">
                <li>✓ Acceso sin límite de tiempo</li>
                <li>✓ Descargas habilitadas</li>
                <li>✓ Biblioteca y Laboratorio Tech</li>
              </ul>
            </div>
          </article>
        </div>

        {/* VERIFICACIÓN Y PAGO */}

        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2.5rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-9">
            <div className="mb-7 flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-3xl">
                🔐
              </span>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                  Verificación segura
                </p>

                <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                  Activa tu entrada
                </h2>

                <p className="mt-2 text-blue-100/70">
                  El sistema consultará tu número
                  directamente en Google Sheets.
                </p>
              </div>
            </div>

            <form onSubmit={enviarFormulario}>
              <label
                htmlFor="telefono"
                className="mb-2 block text-sm font-black"
              >
                Número de WhatsApp
              </label>

              <div className="relative">
                <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-2xl">
                  📱
                </span>

                <input
                  id="telefono"
                  type="tel"
                  inputMode="numeric"
                  autoComplete="tel"
                  placeholder="Ejemplo: 584141234567"
                  value={telefono}
                  disabled={cargando}
                  onChange={(evento) => {
                    setTelefono(
                      limpiarTelefono(
                        evento.target.value,
                      ),
                    );

                    if (mensaje) {
                      setMensaje("");
                      setTipoMensaje(
                        "neutral",
                      );
                    }
                  }}
                  className="w-full rounded-2xl border-2 border-white/15 bg-slate-950/50 py-4 pl-14 pr-5 text-lg font-bold text-white outline-none transition placeholder:text-blue-200/35 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
                />
              </div>

              <p className="mt-2 text-xs text-blue-200/60">
                Incluye el código del país, sin
                espacios, guiones ni el signo +.
              </p>

              <button
                type="submit"
                disabled={cargando}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 px-6 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {cargando
                  ? "🚀 Verificando acceso..."
                  : "✅ Verificar y entrar"}
              </button>
            </form>

            {mensaje && (
              <div
                role="status"
                aria-live="polite"
                className={`mt-6 rounded-2xl border p-4 text-sm font-bold leading-relaxed ${claseMensaje}`}
              >
                {mensaje}
              </div>
            )}
          </section>

          <aside className="rounded-[2.5rem] border border-emerald-300/25 bg-gradient-to-br from-emerald-400/15 to-green-500/5 p-6 shadow-2xl sm:p-8">
            <span className="text-5xl">
              💎
            </span>

            <h2 className="mt-5 text-3xl font-black text-emerald-200">
              ¿Todavía no tienes acceso VIP?
            </h2>

            <p className="mt-3 leading-relaxed text-blue-100/75">
              Realiza el pago desde la página
              principal y envía el comprobante
              mediante WhatsApp.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Envía el comprobante",
                "Espera la confirmación",
                "Recibe tu enlace directo",
                "Entra con tu WhatsApp",
              ].map((elemento, indice) => (
                <div
                  key={elemento}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-300 font-black text-slate-950">
                    {indice + 1}
                  </span>

                  <span className="font-bold">
                    {elemento}
                  </span>
                </div>
              ))}
            </div>

            <a
              href={enlaceWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-1"
            >
              📲 Enviar mi comprobante
            </a>
          </aside>
        </div>
      </section>

      {/* PIE DE PÁGINA */}

      <footer className="relative z-10 border-t border-white/10 bg-slate-950/80 px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-black text-yellow-300">
            🚀 MUNDO DIGITAL INFANTIL
          </p>

          <p className="text-sm font-bold text-blue-300/50">
            CENTRO DE ACCESO © 2026
          </p>
        </div>
      </footer>
    </main>
  );
}