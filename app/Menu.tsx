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
    descripcion: "Materiales, cuentos y actividades",
    colores:
      "from-cyan-300 to-blue-400",
  },
  {
    href: "/comunidad",
    icono: "💛",
    titulo: "Comunidad Creativa",
    descripcion: "Comparte ideas y aprendizajes",
    colores:
      "from-yellow-300 to-pink-400",
  },
  {
    href: "/calendario",
    icono: "📅",
    titulo: "Racha de Aprendizaje",
    descripcion: "Consulta tu progreso diario",
    colores:
      "from-emerald-300 to-cyan-400",
  },
  {
    href: "/perfil",
    icono: "👤",
    titulo: "Mi Espacio",
    descripcion: "Tu perfil y preferencias",
    colores:
      "from-violet-300 to-fuchsia-400",
  },
  {
    href: "/tecnologia",
    icono: "💻",
    titulo: "Laboratorio Tech",
    descripcion: "Herramientas y recursos digitales",
    colores:
      "from-cyan-300 to-emerald-300",
  },
  {
    href: "/promociones",
    icono: "🎁",
    titulo: "Ofertas Estelares",
    descripcion: "Promociones y descuentos especiales",
    colores:
      "from-pink-400 to-orange-400",
  },
];

/* =====================================================
   COMPONENTE
===================================================== */

export default function Menu() {
  const rutaActual = usePathname();

  const [abierto, setAbierto] =
    useState(false);

  const [esPrueba, setEsPrueba] =
    useState(false);

  /*
  No mostrar el menú en Inicio
  ni en la página de Acceso.
  */

  const ocultarMenu =
    rutaActual === "/" ||
    rutaActual === "/acceso";

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

    if (diaGuardado !== hoy) {
      localStorage.setItem(
        "diaSesion",
        hoy,
      );

      localStorage.setItem(
        "inicioSesionTiempo",
        Date.now().toString(),
      );
    }

    const modoAcceso =
      localStorage.getItem(
        "modoAcceso",
      );

    const limitePrueba = Number(
      localStorage.getItem(
        "limitePrueba",
      ) || "0",
    );

    setEsPrueba(
      modoAcceso === "prueba" &&
        limitePrueba > Date.now(),
    );
  }, [rutaActual]);

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
      if (evento.key === "Escape") {
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
      return rutaActual === "/";
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
          BOTÓN FLOTANTE NUEVO
      =============================================== */}

      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-label="Abrir menú de navegación"
        className={`fixed left-4 z-[9997] flex items-center gap-3 rounded-2xl border border-white/15 bg-slate-950/85 px-4 py-3 text-white shadow-2xl shadow-black/30 backdrop-blur-xl transition duration-300 hover:-translate-y-0.5 hover:border-cyan-300/40 hover:bg-slate-900 ${
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
        className={`fixed left-0 z-[9999] flex w-[90%] max-w-[370px] flex-col overflow-hidden border-r border-white/10 bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 shadow-2xl transition-transform duration-300 ${
          esPrueba
            ? "top-[68px] h-[calc(100vh-68px)]"
            : "top-0 h-screen"
        } ${
          abierto
            ? "translate-x-0"
            : "-translate-x-full"
        }`}
      >
        {/* Decoración */}

        <div className="pointer-events-none absolute -left-28 top-28 h-72 w-72 rounded-full bg-blue-600/25 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-20 h-72 w-72 rounded-full bg-fuchsia-600/20 blur-3xl" />

        {/* Encabezado */}

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

          {/* Tipo de acceso */}

          <div
            className={`mt-5 flex items-center gap-3 rounded-2xl border p-3 ${
              esPrueba
                ? "border-yellow-300/25 bg-yellow-300/10"
                : "border-emerald-300/25 bg-emerald-300/10"
            }`}
          >
            <span className="text-2xl">
              {esPrueba
                ? "⏱️"
                : "💎"}
            </span>

            <div>
              <p
                className={`text-sm font-black ${
                  esPrueba
                    ? "text-yellow-200"
                    : "text-emerald-200"
                }`}
              >
                {esPrueba
                  ? "Explorador en prueba"
                  : "Explorador VIP"}
              </p>

              <p className="text-xs text-blue-100/55">
                {esPrueba
                  ? "Disfruta la plataforma mientras quede tiempo."
                  : "Acceso completo a la plataforma."}
              </p>
            </div>
          </div>
        </header>

        {/* Navegación */}

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
                      {
                        opcion.descripcion
                      }
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

        {/* Botón inferior */}

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