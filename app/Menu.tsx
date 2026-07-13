"use client";

import {
  useEffect,
  useState,
} from "react";

import Link from "next/link";
import { usePathname } from "next/navigation";

/* =====================================================
   TIPOS
===================================================== */

type OpcionMenu = {
  href: string;
  icono: string;
  titulo: string;
  descripcion: string;
  colores: string;
};

type DatosSaludo = {
  saludo: string;
  emoji: string;
  mensaje: string;
};

type TipoAcceso =
  | "vip"
  | "prueba"
  | "visitante";

/* =====================================================
   OPCIONES DEL MENÚ
===================================================== */

const opcionesMenu: OpcionMenu[] = [
  {
    href: "/",
    icono: "🚀",
    titulo: "Inicio Galáctico",
    descripcion: "Regresa al portal principal",
    colores:
      "from-yellow-300 to-orange-400",
  },
  {
    href: "/biblioteca",
    icono: "📚",
    titulo: "Biblioteca Estelar",
    descripcion:
      "Materiales, cuentos y actividades",
    colores:
      "from-cyan-300 to-blue-400",
  },
  {
    href: "/comunidad",
    icono: "💛",
    titulo: "Comunidad Creativa",
    descripcion:
      "Comparte ideas y aprendizajes",
    colores:
      "from-yellow-300 to-pink-400",
  },
  {
    href: "/calendario",
    icono: "🏆",
    titulo: "Misión de Racha",
    descripcion:
      "Completa tu aprendizaje diario",
    colores:
      "from-emerald-300 to-cyan-400",
  },
  {
    href: "/perfil",
    icono: "🪪",
    titulo: "Mi Pasaporte Digital",
    descripcion:
      "Identidad, logros y preferencias",
    colores:
      "from-violet-300 to-fuchsia-400",
  },
  {
    href: "/tecnologia",
    icono: "💻",
    titulo: "Laboratorio Tech",
    descripcion:
      "Herramientas y recursos digitales",
    colores:
      "from-cyan-300 to-emerald-300",
  },
  {
    href: "/promociones",
    icono: "🎁",
    titulo: "Ofertas Estelares",
    descripcion:
      "Cursos y promociones especiales",
    colores:
      "from-pink-400 to-orange-400",
  },
];

/* =====================================================
   FUNCIONES DEL SALUDO
===================================================== */

function obtenerDatosSaludo(): DatosSaludo {
  const horaActual =
    new Date().getHours();

  if (
    horaActual >= 5 &&
    horaActual < 12
  ) {
    return {
      saludo: "Buenos días",
      emoji: "☀️",
      mensaje:
        "Comencemos una nueva aventura de aprendizaje.",
    };
  }

  if (
    horaActual >= 12 &&
    horaActual < 19
  ) {
    return {
      saludo: "Buenas tardes",
      emoji: "🌤️",
      mensaje:
        "Todavía hay mucho por aprender y descubrir.",
    };
  }

  return {
    saludo: "Buenas noches",
    emoji: "🌙",
    mensaje:
      "Terminemos el día con una misión educativa.",
  };
}

function obtenerPrimerNombre(
  nombreCompleto: string,
): string {
  const nombreLimpio =
    nombreCompleto.trim();

  if (!nombreLimpio) {
    return "Explorador";
  }

  const primerNombre =
    nombreLimpio.split(/\s+/)[0];

  return (
    primerNombre
      .charAt(0)
      .toUpperCase() +
    primerNombre
      .slice(1)
      .toLowerCase()
  );
}

/* =====================================================
   COMPONENTE
===================================================== */

export default function Menu() {
  const rutaActual =
    usePathname();

  const [abierto, setAbierto] =
    useState(false);

  const [
    nombreUsuario,
    setNombreUsuario,
  ] = useState("Explorador");

  const [
    datosSaludo,
    setDatosSaludo,
  ] = useState<DatosSaludo>(
    obtenerDatosSaludo(),
  );

  const [
    tipoAcceso,
    setTipoAcceso,
  ] =
    useState<TipoAcceso>(
      "visitante",
    );

  const [
    mostrarSaludo,
    setMostrarSaludo,
  ] = useState(true);

  /*
  El menú y el saludo no aparecen
  en Inicio ni en Acceso.
  */

  const ocultarMenu =
    rutaActual === "/" ||
    rutaActual === "/acceso";

  const esPrueba =
    tipoAcceso === "prueba";

  /* ===================================================
     CARGAR NOMBRE, SALUDO Y ACCESO
  =================================================== */

  useEffect(() => {
    let temporizadorSaludo:
      | ReturnType<
          typeof setTimeout
        >
      | undefined;

    const actualizarDatos =
      () => {
        const nombreGuardado =
          localStorage.getItem(
            "nombreUsuario",
          ) || "";

        setNombreUsuario(
          obtenerPrimerNombre(
            nombreGuardado,
          ),
        );

        setDatosSaludo(
          obtenerDatosSaludo(),
        );

        const modoGuardado =
          localStorage.getItem(
            "modoAcceso",
          );

        const accesoVIP =
          localStorage.getItem(
            "accesoVIP",
          ) === "true" ||
          modoGuardado === "vip";

        const limitePrueba =
          Number(
            localStorage.getItem(
              "limitePrueba",
            ) || "0",
          );

        const pruebaActiva =
          modoGuardado ===
            "prueba" &&
          limitePrueba >
            Date.now();

        if (accesoVIP) {
          setTipoAcceso("vip");
        } else if (
          pruebaActiva
        ) {
          setTipoAcceso(
            "prueba",
          );
        } else {
          setTipoAcceso(
            "visitante",
          );
        }
      };

    actualizarDatos();

    /*
    Mostrar el saludo al entrar
    en una nueva sección.
    */

    if (!ocultarMenu) {
      setMostrarSaludo(true);

      temporizadorSaludo =
        setTimeout(() => {
          setMostrarSaludo(
            false,
          );
        }, 8000);
    }

    /*
    Actualizar periódicamente por
    si cambia la hora del día.
    */

    const intervalo =
      window.setInterval(
        actualizarDatos,
        60000,
      );

    /*
    Actualizar al volver a la pestaña
    o cambiar datos desde otra pestaña.
    */

    window.addEventListener(
      "focus",
      actualizarDatos,
    );

    window.addEventListener(
      "storage",
      actualizarDatos,
    );

    /*
    Este evento se conectará en el
    próximo cambio del perfil.
    */

    window.addEventListener(
      "perfilActualizadoMDI",
      actualizarDatos,
    );

    return () => {
      window.clearInterval(
        intervalo,
      );

      if (
        temporizadorSaludo
      ) {
        clearTimeout(
          temporizadorSaludo,
        );
      }

      window.removeEventListener(
        "focus",
        actualizarDatos,
      );

      window.removeEventListener(
        "storage",
        actualizarDatos,
      );

      window.removeEventListener(
        "perfilActualizadoMDI",
        actualizarDatos,
      );
    };
  }, [
    rutaActual,
    ocultarMenu,
  ]);

  /* ===================================================
     REGISTRO DIARIO
  =================================================== */

  useEffect(() => {
    const hoy =
      new Date().toLocaleDateString(
        "es-ES",
      );

    const diaGuardado =
      localStorage.getItem(
        "diaSesion",
      );

    if (
      diaGuardado !== hoy
    ) {
      localStorage.setItem(
        "diaSesion",
        hoy,
      );

      localStorage.setItem(
        "inicioSesionTiempo",
        Date.now().toString(),
      );
    }
  }, []);

  /* ===================================================
     CERRAR AL CAMBIAR DE PÁGINA
  =================================================== */

  useEffect(() => {
    setAbierto(false);
  }, [rutaActual]);

  /* ===================================================
     CERRAR CON ESCAPE Y BLOQUEAR SCROLL
  =================================================== */

  useEffect(() => {
    if (!abierto) {
      document.body.style.overflow =
        "";

      return;
    }

    document.body.style.overflow =
      "hidden";

    const cerrarConEscape = (
      evento: KeyboardEvent,
    ) => {
      if (
        evento.key === "Escape"
      ) {
        setAbierto(false);
      }
    };

    window.addEventListener(
      "keydown",
      cerrarConEscape,
    );

    return () => {
      document.body.style.overflow =
        "";

      window.removeEventListener(
        "keydown",
        cerrarConEscape,
      );
    };
  }, [abierto]);

  /* ===================================================
     COMPROBAR RUTA ACTIVA
  =================================================== */

  const rutaEstaActiva = (
    href: string,
  ) => {
    if (href === "/") {
      return (
        rutaActual === "/"
      );
    }

    return (
      rutaActual === href ||
      rutaActual.startsWith(
        `${href}/`,
      )
    );
  };

  if (ocultarMenu) {
    return null;
  }

  return (
    <>
      {/* ===============================================
          BOTÓN FLOTANTE DEL MENÚ
      =============================================== */}

      <button
        type="button"
        onClick={() =>
          setAbierto(true)
        }
        aria-label="Abrir menú de navegación"
        className={`fixed left-4 z-[9997] flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/90 px-4 py-3 text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-slate-900 ${
          esPrueba
            ? "top-20"
            : "top-4"
        }`}
      >
        <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-400 text-xl shadow-lg">
          🚀
        </span>

        <span className="hidden text-left sm:block">
          <span className="block text-sm font-black leading-tight">
            Explorar
          </span>

          <span className="block text-[10px] font-bold uppercase tracking-[0.16em] text-cyan-200/65">
            Mundo Digital
          </span>
        </span>

        <span className="text-lg text-cyan-200">
          ☰
        </span>
      </button>

      {/* ===============================================
          SALUDO PERSONALIZADO FLOTANTE
      =============================================== */}

      {mostrarSaludo && (
        <section
          aria-live="polite"
          className={`fixed z-[9996] overflow-hidden rounded-3xl border border-white/15 bg-slate-950/95 p-4 text-white shadow-2xl shadow-black/30 backdrop-blur-xl ${
            esPrueba
              ? "left-4 right-4 top-36 sm:left-auto sm:right-4 sm:top-20 sm:w-[390px]"
              : "left-4 right-4 top-20 sm:left-auto sm:right-4 sm:top-4 sm:w-[390px]"
          }`}
        >
          <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-fuchsia-500/25 blur-2xl" />

          <div className="relative flex items-start gap-4">
            <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-cyan-300 to-pink-300 text-3xl shadow-xl">
              {datosSaludo.emoji}
            </span>

            <div className="min-w-0 flex-1">
              <p className="text-lg font-black text-white">
                {datosSaludo.saludo},{" "}
                <span className="text-cyan-300">
                  {nombreUsuario}
                </span>
                👋
              </p>

              <p className="mt-1 text-sm leading-relaxed text-blue-100/60">
                {datosSaludo.mensaje}
              </p>

              <p className="mt-2 text-[10px] font-black uppercase tracking-[0.18em] text-pink-300">
                Bienvenido a Mundo Digital Infantil
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                setMostrarSaludo(
                  false,
                )
              }
              aria-label="Cerrar saludo"
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-white/5 text-lg text-blue-100/50 transition hover:bg-white/10 hover:text-white"
            >
              ×
            </button>
          </div>
        </section>
      )}

      {/* ===============================================
          FONDO OSCURO
      =============================================== */}

      {abierto && (
        <button
          type="button"
          aria-label="Cerrar menú"
          onClick={() =>
            setAbierto(false)
          }
          className="fixed inset-0 z-[9998] cursor-default bg-slate-950/75 backdrop-blur-sm"
        />
      )}

      {/* ===============================================
          PANEL LATERAL
      =============================================== */}

      <aside
        aria-hidden={!abierto}
        className={`fixed left-0 z-[9999] flex w-[90%] max-w-[380px] flex-col overflow-hidden border-r border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 shadow-2xl transition-transform duration-300 ${
          esPrueba
            ? "top-[68px] h-[calc(100vh-68px)]"
            : "top-0 h-screen"
        } ${
          abierto
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* DECORACIÓN */}

        <div className="pointer-events-none absolute -left-28 top-28 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />

        {/* ENCABEZADO */}

        <header className="relative z-10 border-b border-white/10 bg-slate-950/40 p-5 backdrop-blur-xl">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-400 text-3xl shadow-xl shadow-pink-500/20">
                🚀
              </span>

              <div>
                <p className="bg-gradient-to-r from-yellow-300 via-cyan-300 to-pink-300 bg-clip-text text-base font-black text-transparent">
                  Mundo Digital Infantil
                </p>

                <p className="mt-1 text-[10px] font-bold uppercase tracking-[0.2em] text-cyan-200/60">
                  Centro de exploración
                </p>
              </div>
            </div>

            <button
              type="button"
              onClick={() =>
                setAbierto(false)
              }
              aria-label="Cerrar menú"
              className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-2xl text-blue-100 transition hover:bg-white/15 hover:text-white"
            >
              ×
            </button>
          </div>

          {/* SALUDO DENTRO DEL MENÚ */}

          <div className="mt-5 rounded-3xl border border-cyan-300/20 bg-gradient-to-r from-cyan-300/10 via-violet-300/10 to-pink-300/10 p-4">
            <div className="flex items-center gap-3">
              <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-white/10 text-2xl">
                {datosSaludo.emoji}
              </span>

              <div>
                <p className="font-black text-white">
                  {datosSaludo.saludo},{" "}
                  <span className="text-cyan-300">
                    {nombreUsuario}
                  </span>
                  👋
                </p>

                <p className="mt-1 text-xs leading-relaxed text-blue-100/55">
                  {datosSaludo.mensaje}
                </p>
              </div>
            </div>
          </div>

          {/* TIPO DE ACCESO */}

          <div
            className={`mt-4 flex items-center gap-3 rounded-2xl border p-3 ${
              tipoAcceso === "prueba"
                ? "border-yellow-300/25 bg-yellow-300/10"
                : tipoAcceso === "vip"
                  ? "border-emerald-300/25 bg-emerald-300/10"
                  : "border-violet-300/25 bg-violet-300/10"
            }`}
          >
            <span className="text-2xl">
              {tipoAcceso === "prueba"
                ? "⏱️"
                : tipoAcceso === "vip"
                  ? "💎"
                  : "🌌"}
            </span>

            <div>
              <p
                className={`text-sm font-black ${
                  tipoAcceso ===
                  "prueba"
                    ? "text-yellow-200"
                    : tipoAcceso ===
                        "vip"
                      ? "text-emerald-200"
                      : "text-violet-200"
                }`}
              >
                {tipoAcceso === "prueba"
                  ? "Explorador en prueba"
                  : tipoAcceso === "vip"
                    ? "Explorador VIP"
                    : "Explorador visitante"}
              </p>

              <p className="text-xs text-blue-100/55">
                {tipoAcceso === "prueba"
                  ? "Disfruta la plataforma mientras quede tiempo."
                  : tipoAcceso === "vip"
                    ? "Acceso completo a la plataforma."
                    : "Completa tu acceso para disfrutar todo el contenido."}
              </p>
            </div>
          </div>
        </header>

        {/* NAVEGACIÓN */}

        <nav className="relative z-10 flex-1 space-y-3 overflow-y-auto p-4">
          {opcionesMenu.map(
            (opcion) => {
              const activa =
                rutaEstaActiva(
                  opcion.href,
                );

              return (
                <Link
                  key={opcion.href}
                  href={opcion.href}
                  onClick={() =>
                    setAbierto(false)
                  }
                  className={`group flex items-center gap-4 rounded-2xl border p-3.5 transition duration-200 ${
                    activa
                      ? "border-cyan-300/35 bg-gradient-to-r from-cyan-400/15 to-violet-400/15 shadow-lg shadow-cyan-950/20"
                      : "border-white/5 bg-white/[0.04] hover:border-white/15 hover:bg-white/[0.08]"
                  }`}
                >
                  <span
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br text-xl shadow-lg ${opcion.colores} ${
                      activa
                        ? "scale-105"
                        : "group-hover:scale-105"
                    } transition`}
                  >
                    {opcion.icono}
                  </span>

                  <span className="min-w-0 flex-1">
                    <span
                      className={`block truncate text-sm font-black ${
                        activa
                          ? "text-cyan-200"
                          : "text-white"
                      }`}
                    >
                      {opcion.titulo}
                    </span>

                    <span className="mt-1 block truncate text-xs text-blue-100/45">
                      {opcion.descripcion}
                    </span>
                  </span>

                  <span
                    className={`text-lg transition ${
                      activa
                        ? "text-cyan-300"
                        : "text-blue-100/25 group-hover:translate-x-1 group-hover:text-blue-100/60"
                    }`}
                  >
                    →
                  </span>
                </Link>
              );
            },
          )}
        </nav>

        {/* BOTÓN INFERIOR */}

        <footer className="relative z-10 border-t border-white/10 bg-slate-950/45 p-4 backdrop-blur-xl">
          <Link
            href="/acceso"
            onClick={() =>
              setAbierto(false)
            }
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-emerald-300 via-cyan-300 to-blue-300 px-5 py-4 text-sm font-black text-slate-950 shadow-xl shadow-emerald-950/30 transition hover:-translate-y-1 hover:brightness-105"
          >
            <span className="text-xl">
              💎
            </span>

            Activar acceso VIP
          </Link>

          <p className="mt-3 text-center text-[10px] font-bold uppercase tracking-[0.16em] text-blue-100/35">
            Aprende · juega · crea
          </p>
        </footer>
      </aside>
    </>
  );
}