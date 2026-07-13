
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

/* =====================================================
   TIPOS
===================================================== */

type TipoMensaje =
  | "neutral"
  | "cargando"
  | "exito"
  | "advertencia"
  | "error";

type RespuestaAcceso = {
  ok?: boolean;
  encontrado?: boolean;
  permitido?: boolean;
  estado?: string;
  tipoAcceso?: "vip" | "prueba";
  nuevaPrueba?: boolean;
  inicioPrueba?: number;
  finPrueba?: number;
  tiempoRestanteMs?: number;
  motivo?: string;
  mensaje?: string;
  error?: string;
};

/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

function limpiarTelefono(valor: string): string {
  return valor.replace(/\D/g, "").slice(0, 15);
}

function normalizarEstado(valor: unknown): string {
  return String(valor ?? "")
    .trim()
    .toLowerCase();
}

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */

export default function Acceso() {
  const router = useRouter();

  const cargaInicialRealizada = useRef(false);

  const [telefono, setTelefono] = useState("");
  const [modoPrueba, setModoPrueba] = useState(false);

  const [mensaje, setMensaje] = useState("");
  const [tipoMensaje, setTipoMensaje] =
    useState<TipoMensaje>("neutral");

  const [cargando, setCargando] = useState(false);

  /* ===================================================
     OCULTAR EL BOTÓN AZUL ☰ EN ESTA PÁGINA
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

        const esMenu =
          texto === "☰" ||
          ariaLabel.includes("abrir menú") ||
          ariaLabel.includes("abrir menu");

        if (esMenu) {
          boton.setAttribute(
            "data-menu-oculto-acceso",
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

      document
        .querySelectorAll<HTMLElement>(
          '[data-menu-oculto-acceso="true"]',
        )
        .forEach((elemento) => {
          elemento.style.removeProperty("display");

          elemento.removeAttribute(
            "data-menu-oculto-acceso",
          );
        });
    };
  }, []);

  /* ===================================================
     GUARDAR SESIÓN AUTORIZADA
  =================================================== */

  const guardarSesionYEntrar = useCallback(
    (
      tipoAcceso: "vip" | "prueba",
      numero: string,
      datos: RespuestaAcceso,
    ) => {
      localStorage.setItem(
        "telefonoAcceso",
        numero,
      );

      if (tipoAcceso === "vip") {
        localStorage.setItem(
          "accesoVIP",
          "true",
        );

        localStorage.setItem(
          "modoAcceso",
          "vip",
        );

        localStorage.removeItem(
          "limitePrueba",
        );
      }

      if (tipoAcceso === "prueba") {
        let limitePrueba =
          Number(datos.finPrueba);

        if (
          !limitePrueba &&
          datos.tiempoRestanteMs
        ) {
          limitePrueba =
            Date.now() +
            Number(
              datos.tiempoRestanteMs,
            );
        }

        if (!limitePrueba) {
          setTipoMensaje("error");

          setMensaje(
            "⚠️ La prueba fue aprobada, pero no recibimos una hora de finalización válida.",
          );

          return;
        }

        localStorage.removeItem(
          "accesoVIP",
        );

        localStorage.setItem(
          "modoAcceso",
          "prueba",
        );

        localStorage.setItem(
          "limitePrueba",
          limitePrueba.toString(),
        );
      }

      window.setTimeout(() => {
        router.replace(
          RUTA_BIBLIOTECA,
        );
      }, 1200);
    },
    [router],
  );

  /* ===================================================
     CONSULTAR GOOGLE SHEETS
  =================================================== */

  const procesarAcceso = useCallback(
    async (
      telefonoRecibido?: string,
      accionForzada?:
        | "verificar"
        | "iniciarPrueba",
    ) => {
      const numero = limpiarTelefono(
        telefonoRecibido ?? telefono,
      );

      setTelefono(numero);

      if (!numero) {
        setTipoMensaje("advertencia");

        setMensaje(
          "⚠️ Escribe tu número de WhatsApp.",
        );

        return;
      }

      if (
        numero.length < 10 ||
        numero.length > 15
      ) {
        setTipoMensaje("advertencia");

        setMensaje(
          "⚠️ Incluye el código del país y escribe entre 10 y 15 números.",
        );

        return;
      }

      const accion =
        accionForzada ??
        (modoPrueba
          ? "iniciarPrueba"
          : "verificar");

      setCargando(true);
      setTipoMensaje("cargando");

      setMensaje(
        accion === "iniciarPrueba"
          ? "🛰️ Comprobando si puedes utilizar la prueba gratuita..."
          : "🛰️ Verificando tu acceso VIP...",
      );

      const controlador =
        new AbortController();

      const tiempoMaximo =
        window.setTimeout(() => {
          controlador.abort();
        }, 15000);

      try {
        const parametros =
          new URLSearchParams({
            accion,
            whatsapp: numero,
          });

        const respuesta = await fetch(
          `${URL_GOOGLE_SCRIPT}?${parametros.toString()}`,
          {
            method: "GET",
            cache: "no-store",
            signal:
              controlador.signal,
          },
        );

        if (!respuesta.ok) {
          throw new Error(
            `Error ${respuesta.status}`,
          );
        }

        const datos =
          (await respuesta.json()) as RespuestaAcceso;

        if (datos.error) {
          setTipoMensaje("error");

          setMensaje(
            `⚠️ ${datos.error}`,
          );

          return;
        }

        const estado =
          normalizarEstado(
            datos.estado,
          );

        const esVIP =
          datos.tipoAcceso === "vip" ||
          [
            "pagado",
            "vip",
            "activo",
            "aprobado",
          ].includes(estado);

        /* ===============================================
           ACCESO VIP
        =============================================== */

        if (
          datos.permitido &&
          esVIP
        ) {
          setTipoMensaje("exito");

          setMensaje(
            "✅ ¡Acceso VIP aprobado! Entrando a la biblioteca...",
          );

          guardarSesionYEntrar(
            "vip",
            numero,
            datos,
          );

          return;
        }

        /* ===============================================
           PRUEBA ACTIVA O RECIÉN CREADA
        =============================================== */

        if (
          datos.permitido &&
          datos.tipoAcceso === "prueba"
        ) {
          const minutosRestantes =
            Math.max(
              1,
              Math.ceil(
                Number(
                  datos.tiempoRestanteMs ??
                    0,
                ) / 60000,
              ),
            );

          setTipoMensaje("exito");

          setMensaje(
            datos.nuevaPrueba
              ? "⏱️ Tu prueba gratuita comenzó. Tienes 60 minutos para explorar la plataforma."
              : `⏱️ Tu prueba sigue activa. Te quedan aproximadamente ${minutosRestantes} minutos.`,
          );

          guardarSesionYEntrar(
            "prueba",
            numero,
            datos,
          );

          return;
        }

        /* ===============================================
           PRUEBA TERMINADA
        =============================================== */

        if (
          estado ===
            "prueba_finalizada" ||
          datos.motivo ===
            "prueba_ya_utilizada" ||
          datos.motivo ===
            "tiempo_finalizado"
        ) {
          localStorage.removeItem(
            "accesoVIP",
          );

          localStorage.removeItem(
            "modoAcceso",
          );

          localStorage.removeItem(
            "limitePrueba",
          );

          setTipoMensaje(
            "advertencia",
          );

          setMensaje(
            "⏳ Este número ya utilizó su prueba gratuita de 60 minutos. Activa el acceso VIP para continuar.",
          );

          return;
        }

        /* ===============================================
           IP YA UTILIZADA
        =============================================== */

        if (
          datos.motivo ===
          "ip_ya_utilizada"
        ) {
          setTipoMensaje(
            "advertencia",
          );

          setMensaje(
            "⛔ Esta conexión ya utilizó una prueba gratuita. Activa el acceso VIP para continuar.",
          );

          return;
        }

        /* ===============================================
           PAGO PENDIENTE
        =============================================== */

        if (
          estado === "pendiente" ||
          datos.motivo ===
            "pago_pendiente"
        ) {
          setTipoMensaje(
            "advertencia",
          );

          setMensaje(
            "🕐 Tu pago todavía está pendiente de confirmación. Inténtalo nuevamente cuando recibas la aprobación.",
          );

          return;
        }

        /* ===============================================
           USUARIO NO REGISTRADO EN ACCESO VIP
        =============================================== */

        if (
          !datos.encontrado &&
          accion === "verificar"
        ) {
          setTipoMensaje("error");

          setMensaje(
            "❌ Este número no aparece como cliente aprobado. Verifica que sea el mismo número utilizado para enviar el comprobante.",
          );

          return;
        }

        setTipoMensaje(
          "advertencia",
        );

        setMensaje(
          datos.mensaje ||
            "⚠️ No tienes un acceso activo en este momento.",
        );
      } catch (error) {
        console.error(
          "Error de acceso:",
          error,
        );

        if (
          error instanceof Error &&
          error.name === "AbortError"
        ) {
          setTipoMensaje("error");

          setMensaje(
            "⚠️ La consulta tardó demasiado. Revisa tu conexión e inténtalo nuevamente.",
          );
        } else {
          setTipoMensaje("error");

          setMensaje(
            "⚠️ No pudimos conectarnos con Google Sheets. Inténtalo nuevamente.",
          );
        }
      } finally {
        window.clearTimeout(
          tiempoMaximo,
        );

        setCargando(false);
      }
    },
    [
      telefono,
      modoPrueba,
      guardarSesionYEntrar,
    ],
  );

  /* ===================================================
     LEER EL MODO DESDE LA DIRECCIÓN

     /acceso?modo=prueba
  =================================================== */

  useEffect(() => {
    if (
      cargaInicialRealizada.current
    ) {
      return;
    }

    cargaInicialRealizada.current =
      true;

    const parametros =
      new URLSearchParams(
        window.location.search,
      );

    const esModoPrueba =
      parametros.get("modo") ===
      "prueba";

    const telefonoURL =
      limpiarTelefono(
        parametros.get("telefono") ??
          "",
      );

    const accesoAutomatico =
      parametros.get("auto") === "1";

    setModoPrueba(esModoPrueba);

    if (telefonoURL) {
      setTelefono(telefonoURL);
    }

    if (
      telefonoURL &&
      accesoAutomatico
    ) {
      void procesarAcceso(
        telefonoURL,
        esModoPrueba
          ? "iniciarPrueba"
          : "verificar",
      );
    }
  }, [procesarAcceso]);

  /* ===================================================
     ENVIAR FORMULARIO
  =================================================== */

  const enviarFormulario = (
    evento: FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault();

    void procesarAcceso();
  };

  /* ===================================================
     WHATSAPP
  =================================================== */

  const mensajeWhatsApp =
    "Hola, quiero activar mi acceso VIP a Mundo Digital Infantil. Enviaré mi comprobante de pago:";

  const enlaceWhatsApp =
    `https://wa.me/${NUMERO_WHATSAPP}` +
    `?text=${encodeURIComponent(
      mensajeWhatsApp,
    )}`;

  /* ===================================================
     COLORES DE LOS MENSAJES
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
          <span
            className={`inline-flex rounded-full border px-4 py-2 text-sm font-black ${
              modoPrueba
                ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200"
                : "border-cyan-300/25 bg-cyan-300/10 text-cyan-200"
            }`}
          >
            {modoPrueba
              ? "⏱️ ACTIVAR PRUEBA GRATUITA"
              : "🔐 CENTRO DE ACCESO VIP"}
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            {modoPrueba
              ? "Comienza tu prueba de"
              : "Ingresa a tu universo"}

            <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              {modoPrueba
                ? "60 minutos"
                : "de aprendizaje digital"}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-blue-100/80">
            {modoPrueba
              ? "Escribe tu número de WhatsApp. Si nunca utilizaste la prueba, tu hora comenzará inmediatamente."
              : "Escribe el mismo número de WhatsApp que utilizaste para enviar tu comprobante."}
          </p>
        </div>

        {/* OPCIONES */}

        <div className="mb-10 grid gap-6 lg:grid-cols-2">
          <article
            className={`relative overflow-hidden rounded-[2rem] border p-7 shadow-2xl ${
              modoPrueba
                ? "border-yellow-300/60 bg-gradient-to-br from-yellow-300/25 to-orange-500/15 ring-2 ring-yellow-300/20"
                : "border-yellow-300/20 bg-gradient-to-br from-yellow-300/10 to-orange-500/5"
            }`}
          >
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
                Conoce la biblioteca y las
                herramientas disponibles.
              </p>

              <ul className="mt-6 space-y-3 text-sm font-bold">
                <li>✓ Una sola prueba por número</li>
                <li>✓ Visualización de materiales</li>
                <li>🔒 Descargas de biblioteca bloqueadas</li>
              </ul>
            </div>
          </article>

          <article
            className={`relative overflow-hidden rounded-[2rem] border p-7 shadow-2xl ${
              !modoPrueba
                ? "border-emerald-300/60 bg-gradient-to-br from-emerald-400/25 to-cyan-500/15 ring-2 ring-emerald-300/20"
                : "border-emerald-300/20 bg-gradient-to-br from-emerald-400/10 to-cyan-500/5"
            }`}
          >
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
                Descarga materiales y utiliza
                todas las herramientas.
              </p>

              <ul className="mt-6 space-y-3 text-sm font-bold">
                <li>✓ Acceso sin límite de tiempo</li>
                <li>✓ Descargas habilitadas</li>
                <li>✓ Biblioteca y Laboratorio Tech</li>
              </ul>
            </div>
          </article>
        </div>

        {/* FORMULARIO Y SOPORTE */}

        <div className="grid items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2.5rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-9">
            <div className="mb-7 flex items-start gap-4">
              <span
                className={`flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl text-3xl shadow-xl ${
                  modoPrueba
                    ? "bg-gradient-to-br from-yellow-300 to-orange-400"
                    : "bg-gradient-to-br from-blue-500 to-cyan-400"
                }`}
              >
                {modoPrueba ? "⏱️" : "🔐"}
              </span>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                  Verificación segura
                </p>

                <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                  {modoPrueba
                    ? "Activa tu hora gratuita"
                    : "Activa tu entrada VIP"}
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
                  className="w-full rounded-2xl border-2 border-white/15 bg-slate-950/50 py-4 pl-14 pr-5 text-lg font-bold text-white outline-none transition placeholder:text-blue-200/35 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 disabled:cursor-not-allowed disabled:opacity-60"
                />
              </div>

              <p className="mt-2 text-xs text-blue-200/60">
                Incluye el código del país, sin espacios,
                guiones ni el signo +.
              </p>

              <button
                type="submit"
                disabled={cargando}
                className={`mt-6 flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 ${
                  modoPrueba
                    ? "bg-gradient-to-r from-yellow-300 to-orange-400"
                    : "bg-gradient-to-r from-emerald-300 to-cyan-400"
                }`}
              >
                {cargando
                  ? "🚀 Verificando..."
                  : modoPrueba
                    ? "⏱️ Comenzar mi prueba gratuita"
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

          {/* SOPORTE */}

          <aside className="rounded-[2.5rem] border border-emerald-300/25 bg-gradient-to-br from-emerald-400/15 to-green-500/5 p-6 shadow-2xl sm:p-8">
            <span className="text-5xl">
              💎
            </span>

            <h2 className="mt-5 text-3xl font-black text-emerald-200">
              ¿Quieres acceso completo?
            </h2>

            <p className="mt-3 leading-relaxed text-blue-100/75">
              Envía el comprobante y espera la
              confirmación de tu acceso VIP.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Realiza el pago",
                "Envía el comprobante",
                "Espera la confirmación",
                "Entra con tu WhatsApp",
              ].map((elemento, indice) => (
                <div
                  key={elemento}
                  className="flex items-center gap-3 rounded-2xl border border-white/10 bg-white/5 px-4 py-3"
                >
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-emerald-300 font-black text-slate-950">
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