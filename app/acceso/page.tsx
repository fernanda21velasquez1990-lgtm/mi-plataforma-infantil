"use client";

import {
  useEffect,
  useState,
  type FormEvent,
} from "react";

import { useRouter } from "next/navigation";

type TipoMensaje =
  | "neutral"
  | "cargando"
  | "exito"
  | "advertencia"
  | "error";

type ClienteDiamantes = {
  whatsapp: string;
  nombre: string;
  email: string;
  estadoMembresia: string;
  plan: string;
  fechaInicio: string;
  fechaFin: string;
  diamantesDisponibles: number;
  diamantesGanados: number;
  diamantesCanjeados: number;
  nivel: string;
  diasRacha: number;
  mejorRacha: number;
};

type RespuestaDiamantes = {
  ok: boolean;
  mensaje?: string;
  cliente?: ClienteDiamantes;
};

const NUMERO_WHATSAPP_NEGOCIO =
  "584144895281";

function limpiarTelefono(
  valor: string,
): string {
  return valor
    .replace(/\D/g, "")
    .slice(0, 15);
}

export default function Acceso() {
  const router = useRouter();

  const [telefono, setTelefono] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  const [tipoMensaje, setTipoMensaje] =
    useState<TipoMensaje>("neutral");

  const [cargando, setCargando] =
    useState(false);

  /* ================================================
     OCULTAR MENÚ FLOTANTE EN LA PÁGINA DE ACCESO
  ================================================ */

  useEffect(() => {
    const ocultarMenu = () => {
      const botones =
        document.querySelectorAll<HTMLButtonElement>(
          "button",
        );

      botones.forEach((boton) => {
        const texto =
          boton.textContent
            ?.replace(/\s+/g, "")
            .trim() || "";

        const aria =
          boton
            .getAttribute("aria-label")
            ?.toLowerCase() || "";

        const esMenu =
          texto === "☰" ||
          aria.includes("abrir menú") ||
          aria.includes("abrir menu");

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

    ocultarMenu();

    const observador =
      new MutationObserver(
        ocultarMenu,
      );

    observador.observe(
      document.body,
      {
        childList: true,
        subtree: true,
      },
    );

    return () => {
      observador.disconnect();

      document
        .querySelectorAll<HTMLElement>(
          '[data-menu-oculto-acceso="true"]',
        )
        .forEach((elemento) => {
          elemento.style.removeProperty(
            "display",
          );

          elemento.removeAttribute(
            "data-menu-oculto-acceso",
          );
        });
    };
  }, []);

  /* ================================================
     GUARDAR SESIÓN DEL CLIENTE
  ================================================ */

  const guardarSesion = (
    cliente: ClienteDiamantes,
    numero: string,
  ) => {
    const telefonoLimpio =
      limpiarTelefono(
        cliente.whatsapp ||
          numero,
      );

    localStorage.setItem(
      "telefonoAcceso",
      telefonoLimpio,
    );

    localStorage.setItem(
      "telefonoUsuario",
      telefonoLimpio,
    );

    localStorage.setItem(
      "nombreUsuario",
      cliente.nombre ||
        "Cliente",
    );

    localStorage.setItem(
      "modoAcceso",
      "vip",
    );

    localStorage.setItem(
      "accesoVIP",
      "true",
    );

    localStorage.setItem(
      "diaSesion",
      new Date().toLocaleDateString(
        "es-ES",
      ),
    );

    localStorage.setItem(
      "rachaMDI",
      String(
        cliente.diasRacha || 0,
      ),
    );

    localStorage.removeItem(
      "limitePrueba",
    );

    window.dispatchEvent(
      new Event(
        "perfilActualizadoMDI",
      ),
    );
  };

  /* ================================================
     VERIFICAR CLIENTE
  ================================================ */

  const verificarAcceso =
    async () => {
      const numero =
        limpiarTelefono(
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
          "⚠️ Incluye el código del país y escribe entre 10 y 15 números.",
        );

        return;
      }

      setCargando(true);
      setTipoMensaje("cargando");

      setMensaje(
        "🛰️ Consultando tu membresía y tus diamantes...",
      );

      try {
        const parametros =
          new URLSearchParams({
            whatsapp: numero,
          });

        const respuesta =
          await fetch(
            `/api/diamantes?${parametros.toString()}`,
            {
              method: "GET",
              cache: "no-store",
            },
          );

        const datos =
          (await respuesta.json()) as RespuestaDiamantes;

        if (
          !respuesta.ok ||
          datos.ok !== true ||
          !datos.cliente
        ) {
          throw new Error(
            datos.mensaje ||
              "El cliente no fue encontrado.",
          );
        }

        const cliente =
          datos.cliente;

        const estado =
          String(
            cliente.estadoMembresia ||
              "",
          )
            .trim()
            .toUpperCase();

        const membresiaActiva =
          [
            "ACTIVA",
            "ACTIVO",
            "VIP",
            "PAGADO",
            "APROBADO",
          ].includes(estado);

        if (!membresiaActiva) {
          localStorage.removeItem(
            "accesoVIP",
          );

          localStorage.removeItem(
            "modoAcceso",
          );

          setTipoMensaje(
            "advertencia",
          );

          setMensaje(
            `⏳ Tu membresía aparece como ${estado || "PENDIENTE"}. Comunícate por WhatsApp para verificarla.`,
          );

          return;
        }

        guardarSesion(
          cliente,
          numero,
        );

        setTipoMensaje("exito");

        setMensaje(
          `✅ ¡Bienvenido, ${cliente.nombre || "explorador"}! Tienes ${cliente.diamantesDisponibles || 0} diamantes disponibles.`,
        );

        window.setTimeout(() => {
          router.replace(
            "/biblioteca",
          );
        }, 1200);
      } catch (error) {
        console.error(
          "Error verificando acceso:",
          error,
        );

        setTipoMensaje("error");

        setMensaje(
          error instanceof Error
            ? `❌ ${error.message}`
            : "❌ No se pudo verificar el acceso.",
        );
      } finally {
        setCargando(false);
      }
    };

  const enviarFormulario = (
    evento:
      FormEvent<HTMLFormElement>,
  ) => {
    evento.preventDefault();

    void verificarAcceso();
  };

  const mensajeWhatsApp =
    "Hola, quiero activar o verificar mi membresía VIP en Mundo Digital Infantil.";

  const enlaceWhatsApp =
    `https://wa.me/${NUMERO_WHATSAPP_NEGOCIO}` +
    `?text=${encodeURIComponent(
      mensajeWhatsApp,
    )}`;

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
      <div className="pointer-events-none absolute -left-40 top-20 h-[32rem] w-[32rem] rounded-full bg-blue-600/30 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-0 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/25 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

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

      <section className="relative z-10 mx-auto max-w-6xl px-5 py-14 lg:px-8 lg:py-20">
        <div className="mx-auto mb-10 max-w-3xl text-center">
          <span className="inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-black text-cyan-200">
            🔐 ACCESO DE CLIENTES
          </span>

          <h1 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
            Ingresa a tu universo

            <span className="block bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
              de aprendizaje digital
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-blue-100/80">
            Escribe el mismo número de WhatsApp registrado en tu membresía.
          </p>
        </div>

        <div className="mx-auto grid max-w-5xl items-start gap-8 lg:grid-cols-[1.15fr_0.85fr]">
          <section className="rounded-[2.5rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-9">
            <div className="mb-7 flex items-start gap-4">
              <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500 to-cyan-400 text-3xl shadow-xl">
                🔐
              </span>

              <div>
                <p className="text-sm font-black uppercase tracking-[0.18em] text-cyan-300">
                  Verificación segura
                </p>

                <h2 className="mt-1 text-2xl font-black sm:text-3xl">
                  Activa tu entrada VIP
                </h2>

                <p className="mt-2 text-blue-100/70">
                  Consultaremos tu membresía y tu saldo de diamantes.
                </p>
              </div>
            </div>

            <form
              onSubmit={
                enviarFormulario
              }
            >
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
                Incluye el código del país, sin espacios, guiones ni el signo +.
              </p>

              <button
                type="submit"
                disabled={cargando}
                className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-300 to-cyan-400 px-6 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
              >
                {cargando
                  ? "🚀 Verificando..."
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
              Sistema de diamantes
            </h2>

            <p className="mt-3 leading-relaxed text-blue-100/75">
              Descarga materiales, completa actividades y acumula diamantes para recibir premios.
            </p>

            <div className="mt-6 space-y-3">
              {[
                "Acceso a Biblioteca",
                "Acceso a Laboratorio Tech",
                "Diamantes por descargas",
                "Premios y recompensas",
              ].map(
                (
                  elemento,
                  indice,
                ) => (
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
                ),
              )}
            </div>

            <a
              href={enlaceWhatsApp}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-1"
            >
              📲 Activar mi membresía
            </a>
          </aside>
        </div>
      </section>

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