"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

/* =====================================================
   TIPOS
===================================================== */

type Avatar = {
  url: string;
  nombre: string;
};

type EstadoGuardado =
  | "neutral"
  | "guardando"
  | "exito"
  | "error";

type ModoAcceso =
  | "vip"
  | "prueba"
  | "visitante";

/* =====================================================
   CONFIGURACIÓN
===================================================== */

const URL_SCRIPT =
  "https://script.google.com/macros/s/AKfycbx4T_Sd-8lLWFFRnXkr5JS2F6KTlVVajPd40i93AXmNei_IumkLLc8fUTpC7NLF3DX5/exec";

const AVATAR_RESPALDO =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='300' height='300'%3E%3Crect width='100%25' height='100%25' rx='150' fill='%231e1b4b'/%3E%3Ctext x='50%25' y='48%25' text-anchor='middle' dominant-baseline='middle' font-size='110'%3E🚀%3C/text%3E%3C/svg%3E";

/* =====================================================
   AVATARES
===================================================== */

const avatares: Avatar[] = [
  {
    nombre: "Capitán Digital",
    url: "https://cdn-icons-png.flaticon.com/128/3135/3135715.png",
  },
  {
    nombre: "Explorador Azul",
    url: "https://cdn-icons-png.flaticon.com/128/3135/3135768.png",
  },
  {
    nombre: "Aventurero",
    url: "https://cdn-icons-png.flaticon.com/128/2922/2922506.png",
  },
  {
    nombre: "Exploradora",
    url: "https://cdn-icons-png.flaticon.com/128/2922/2922510.png",
  },
  {
    nombre: "Creador Tech",
    url: "https://cdn-icons-png.flaticon.com/128/3048/3048122.png",
  },
  {
    nombre: "Inventora",
    url: "https://cdn-icons-png.flaticon.com/128/3048/3048127.png",
  },
  {
    nombre: "Estrella Creativa",
    url: "https://cdn-icons-png.flaticon.com/128/4140/4140037.png",
  },
  {
    nombre: "Artista Digital",
    url: "https://cdn-icons-png.flaticon.com/128/4140/4140048.png",
  },
  {
    nombre: "Líder Estelar",
    url: "https://cdn-icons-png.flaticon.com/128/4140/4140061.png",
  },
  {
    nombre: "Guía Digital",
    url: "https://cdn-icons-png.flaticon.com/128/4140/4140079.png",
  },
  {
    nombre: "Profesor Estelar",
    url: "https://cdn-icons-png.flaticon.com/128/3135/3135789.png",
  },
  {
    nombre: "Profesora Estelar",
    url: "https://cdn-icons-png.flaticon.com/128/3135/3135731.png",
  },
  {
    nombre: "Pequeño Genio",
    url: "https://cdn-icons-png.flaticon.com/128/1999/1999625.png",
  },
  {
    nombre: "Mamá Creativa",
    url: "https://cdn-icons-png.flaticon.com/128/3048/3048177.png",
  },
  {
    nombre: "Papá Digital",
    url: "https://cdn-icons-png.flaticon.com/128/1154/1154448.png",
  },
  {
    nombre: "Mentora",
    url: "https://cdn-icons-png.flaticon.com/128/3048/3048163.png",
  },
  {
    nombre: "Educadora",
    url: "https://cdn-icons-png.flaticon.com/128/3048/3048162.png",
  },
  {
    nombre: "Especialista",
    url: "https://cdn-icons-png.flaticon.com/128/3048/3048154.png",
  },
  {
    nombre: "Comunicadora",
    url: "https://cdn-icons-png.flaticon.com/128/3048/3048148.png",
  },
];

/* =====================================================
   OPCIONES DEL PERFIL
===================================================== */

const tiposExplorador = [
  "Familia exploradora",
  "Mamá creativa",
  "Papá digital",
  "Docente innovador",
  "Tutor de aprendizaje",
  "Estudiante",
];

const areasFavoritas = [
  "Biblioteca Estelar",
  "Laboratorio Tech",
  "Comunidad Creativa",
  "Misión de Racha",
  "Ofertas Estelares",
];

/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

function leerArreglo(
  clave: string,
): string[] {
  try {
    const guardado =
      localStorage.getItem(clave);

    if (!guardado) {
      return [];
    }

    const datos: unknown =
      JSON.parse(guardado);

    return Array.isArray(datos)
      ? datos.map(String)
      : [];
  } catch {
    return [];
  }
}

function mascararTelefono(
  telefono: string,
): string {
  if (!telefono) {
    return "No registrado";
  }

  if (telefono.length <= 6) {
    return telefono;
  }

  return `${telefono.slice(
    0,
    3,
  )}••••${telefono.slice(-3)}`;
}

function obtenerNivel(
  racha: number,
) {
  if (racha >= 30) {
    return {
      nombre: "Leyenda del Universo",
      icono: "👑",
      siguiente: 50,
    };
  }

  if (racha >= 15) {
    return {
      nombre: "Capitán Digital",
      icono: "🚀",
      siguiente: 30,
    };
  }

  if (racha >= 7) {
    return {
      nombre: "Navegante Estelar",
      icono: "🪐",
      siguiente: 15,
    };
  }

  if (racha >= 3) {
    return {
      nombre: "Explorador Creativo",
      icono: "🌟",
      siguiente: 7,
    };
  }

  return {
    nombre: "Aprendiz Digital",
    icono: "✨",
    siguiente: 3,
  };
}

function diasHastaCumpleanos(
  fecha: string,
): number | null {
  if (!fecha) {
    return null;
  }

  const partes =
    fecha.split("-");

  if (partes.length !== 3) {
    return null;
  }

  const mes =
    Number(partes[1]) - 1;

  const dia =
    Number(partes[2]);

  if (
    Number.isNaN(mes) ||
    Number.isNaN(dia)
  ) {
    return null;
  }

  const hoy = new Date();

  let proximo = new Date(
    hoy.getFullYear(),
    mes,
    dia,
  );

  proximo.setHours(0, 0, 0, 0);

  const inicioHoy =
    new Date(
      hoy.getFullYear(),
      hoy.getMonth(),
      hoy.getDate(),
    );

  if (
    proximo.getTime() <
    inicioHoy.getTime()
  ) {
    proximo = new Date(
      hoy.getFullYear() + 1,
      mes,
      dia,
    );
  }

  return Math.ceil(
    (proximo.getTime() -
      inicioHoy.getTime()) /
      86400000,
  );
}

/* =====================================================
   COMPONENTE
===================================================== */

export default function Perfil() {
  const [avatar, setAvatar] =
    useState(avatares[0].url);

  const [nombre, setNombre] =
    useState("");

  const [
    fechaCumple,
    setFechaCumple,
  ] = useState("");

  const [
    tipoExplorador,
    setTipoExplorador,
  ] = useState(
    tiposExplorador[0],
  );

  const [
    areaFavorita,
    setAreaFavorita,
  ] = useState(
    areasFavoritas[0],
  );

  const [
    metaSemanal,
    setMetaSemanal,
  ] = useState(5);

  const [
    objetivoPersonal,
    setObjetivoPersonal,
  ] = useState("");

  const [
    fechaAcceso,
    setFechaAcceso,
  ] = useState("");

  const [telefono, setTelefono] =
    useState("");

  const [modoAcceso, setModoAcceso] =
    useState<ModoAcceso>(
      "visitante",
    );

  const [racha, setRacha] =
    useState(0);

  const [
    diasCompletados,
    setDiasCompletados,
  ] = useState(0);

  const [
    likesComunidad,
    setLikesComunidad,
  ] = useState(0);

  const [
    estadoGuardado,
    setEstadoGuardado,
  ] =
    useState<EstadoGuardado>(
      "neutral",
    );

  const [aviso, setAviso] =
    useState("");

  /* ===================================================
     CARGAR PERFIL
  =================================================== */

  useEffect(() => {
    const fechaActual =
      new Date().toLocaleDateString(
        "es-ES",
      );

    const accesoRegistrado =
      localStorage.getItem(
        "diaSesion",
      ) || fechaActual;

    const telefonoGuardado =
      localStorage.getItem(
        "telefonoAcceso",
      ) ||
      localStorage.getItem(
        "telefonoUsuario",
      ) ||
      "";

    const modoGuardado =
      localStorage.getItem(
        "modoAcceso",
      );

    const esVIP =
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

    let acceso: ModoAcceso =
      "visitante";

    if (esVIP) {
      acceso = "vip";
    } else if (
      modoGuardado === "prueba" &&
      limitePrueba > Date.now()
    ) {
      acceso = "prueba";
    }

    const rachaGuardada =
      Number(
        localStorage.getItem(
          "rachaMDI",
        ) || "0",
      );

    const dias =
      leerArreglo(
        "diasPracticaMDI",
      );

    const likes =
      leerArreglo(
        "misLikesComunidad",
      );

    setFechaAcceso(
      accesoRegistrado,
    );

    setTelefono(
      telefonoGuardado,
    );

    setModoAcceso(acceso);

    setNombre(
      localStorage.getItem(
        "nombreUsuario",
      ) || "",
    );

    setFechaCumple(
      localStorage.getItem(
        "cumpleUsuario",
      ) || "",
    );

    setAvatar(
      localStorage.getItem(
        "avatarUsuario",
      ) || avatares[0].url,
    );

    setTipoExplorador(
      localStorage.getItem(
        "tipoExploradorMDI",
      ) ||
        tiposExplorador[0],
    );

    setAreaFavorita(
      localStorage.getItem(
        "areaFavoritaMDI",
      ) ||
        areasFavoritas[0],
    );

    setMetaSemanal(
      Number(
        localStorage.getItem(
          "metaSemanalMDI",
        ) || "5",
      ),
    );

    setObjetivoPersonal(
      localStorage.getItem(
        "objetivoPersonalMDI",
      ) || "",
    );

    setRacha(
      Number.isFinite(
        rachaGuardada,
      )
        ? rachaGuardada
        : 0,
    );

    setDiasCompletados(
      dias.length,
    );

    setLikesComunidad(
      likes.length,
    );
  }, []);

  /* ===================================================
     DATOS CALCULADOS
  =================================================== */

  const nivel = useMemo(
    () => obtenerNivel(racha),
    [racha],
  );

  const progresoNivel =
    Math.min(
      100,
      Math.round(
        (racha /
          nivel.siguiente) *
          100,
      ),
    );

  const diasCumple =
    diasHastaCumpleanos(
      fechaCumple,
    );

  const perfilCompletado =
    useMemo(() => {
      const campos = [
        nombre.trim(),
        fechaCumple,
        avatar,
        tipoExplorador,
        areaFavorita,
        objetivoPersonal.trim(),
      ];

      const completos =
        campos.filter(Boolean).length;

      return Math.round(
        (completos /
          campos.length) *
          100,
      );
    }, [
      nombre,
      fechaCumple,
      avatar,
      tipoExplorador,
      areaFavorita,
      objetivoPersonal,
    ]);

  const avatarSeleccionado =
    avatares.find(
      (item) =>
        item.url === avatar,
    );

  /* ===================================================
     GUARDAR PERFIL
  =================================================== */

  const guardarPerfil =
    async () => {
      const nombreLimpio =
        nombre.trim();

      if (!nombreLimpio) {
        setEstadoGuardado(
          "error",
        );

        setAviso(
          "Escribe tu nombre antes de guardar el perfil.",
        );

        return;
      }

      setEstadoGuardado(
        "guardando",
      );

      setAviso(
        "Guardando tu pasaporte digital...",
      );

      const idUsuario =
        telefono ||
        localStorage.getItem(
          "telefonoAcceso",
        ) ||
        "anonimo";

      const parametros =
        new URLSearchParams({
          accion: "guardar",
          id: idUsuario,
          nombre: nombreLimpio,
          fecha: fechaCumple,
          avatar,
          acceso: fechaAcceso,
          tipo: tipoExplorador,
          area: areaFavorita,
          meta: metaSemanal.toString(),
          objetivo:
            objetivoPersonal.trim(),
        });

      try {
        const respuesta =
          await fetch(
            `${URL_SCRIPT}?${parametros.toString()}`,
            {
              method: "GET",
              cache: "no-store",
            },
          );

        if (!respuesta.ok) {
          throw new Error(
            `Error ${respuesta.status}`,
          );
        }

        const datos =
          (await respuesta.json()) as {
            status?: string;
            ok?: boolean;
            exito?: boolean;
            error?: string;
          };

        const guardadoCorrecto =
          datos.status === "ok" ||
          datos.ok === true ||
          datos.exito === true;

        if (!guardadoCorrecto) {
          throw new Error(
            datos.error ||
              "Google no confirmó el guardado.",
          );
        }

        localStorage.setItem(
          "nombreUsuario",
          nombreLimpio,
        );

        localStorage.setItem(
          "cumpleUsuario",
          fechaCumple,
        );

        localStorage.setItem(
          "avatarUsuario",
          avatar,
        );

        localStorage.setItem(
          "tipoExploradorMDI",
          tipoExplorador,
        );

        localStorage.setItem(
          "areaFavoritaMDI",
          areaFavorita,
        );

        localStorage.setItem(
          "metaSemanalMDI",
          metaSemanal.toString(),
        );

        localStorage.setItem(
          "objetivoPersonalMDI",
          objetivoPersonal.trim(),
        );

        setEstadoGuardado(
          "exito",
        );

        setAviso(
          "¡Tu pasaporte digital fue actualizado correctamente!",
        );
      } catch (error) {
        console.error(
          "Error al guardar el perfil:",
          error,
        );

        setEstadoGuardado(
          "error",
        );

        setAviso(
          error instanceof Error
            ? error.message
            : "No pudimos guardar el perfil.",
        );
      }
    };

  /* ===================================================
     PÁGINA
  =================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 pb-24 pt-24 text-white sm:px-6">
      {/* FONDO ESPACIAL */}

      <div className="pointer-events-none absolute -left-44 top-10 h-[36rem] w-[36rem] rounded-full bg-blue-600/25 blur-3xl" />

      <div className="pointer-events-none absolute -right-44 top-32 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />

      <span className="pointer-events-none absolute left-[7%] top-48 hidden text-6xl opacity-50 lg:block">
        👤
      </span>

      <span className="pointer-events-none absolute right-[8%] top-64 hidden text-7xl opacity-50 lg:block">
        🚀
      </span>

      <span className="pointer-events-none absolute left-[11%] top-[65%] hidden text-4xl opacity-35 lg:block">
        ⭐
      </span>

      <span className="pointer-events-none absolute right-[12%] top-[72%] hidden text-4xl opacity-35 lg:block">
        🪐
      </span>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ENCABEZADO */}

        <header className="mx-auto mb-10 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-violet-300/30 bg-violet-300/10 px-4 py-2 text-sm font-black tracking-wide text-violet-200 backdrop-blur">
            🪪 IDENTIDAD DE EXPLORADOR
          </span>

          <h1 className="mt-5 bg-gradient-to-r from-yellow-300 via-cyan-300 to-pink-300 bg-clip-text text-4xl font-black leading-tight text-transparent md:text-6xl">
            Mi Pasaporte Digital
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-blue-100/70 md:text-lg">
            Personaliza tu identidad, descubre tu
            nivel y conserva los logros alcanzados
            dentro de Mundo Digital Infantil.
          </p>
        </header>

        {/* TARJETA PRINCIPAL */}

        <section className="mb-8 grid gap-7 lg:grid-cols-[0.9fr_1.1fr]">
          <article className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 text-[13rem] opacity-[0.05]">
              🚀
            </div>

            <div className="relative text-center">
              <div className="relative mx-auto h-44 w-44">
                <div className="absolute inset-0 animate-pulse rounded-full bg-gradient-to-r from-yellow-300 via-pink-400 to-cyan-300 blur-xl opacity-40" />

                <img
                  src={avatar}
                  alt={
                    avatarSeleccionado?.nombre ||
                    "Avatar del explorador"
                  }
                  className="relative h-44 w-44 rounded-full border-4 border-white/20 bg-slate-950 object-cover p-2 shadow-2xl"
                  onError={(evento) => {
                    evento.currentTarget.onerror =
                      null;

                    evento.currentTarget.src =
                      AVATAR_RESPALDO;
                  }}
                />

                <span className="absolute -bottom-2 -right-2 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-400 text-3xl shadow-xl">
                  {nivel.icono}
                </span>
              </div>

              <p className="mt-6 text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                {avatarSeleccionado?.nombre ||
                  "Explorador Digital"}
              </p>

              <h2 className="mt-2 text-3xl font-black text-white">
                {nombre ||
                  "Nuevo explorador"}
              </h2>

              <p className="mt-2 font-bold text-violet-200">
                {nivel.nombre}
              </p>

              <div className="mt-6 flex flex-wrap justify-center gap-2">
                <span
                  className={`rounded-full border px-4 py-2 text-xs font-black ${
                    modoAcceso === "vip"
                      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                      : modoAcceso === "prueba"
                        ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200"
                        : "border-white/10 bg-white/5 text-blue-100/50"
                  }`}
                >
                  {modoAcceso === "vip"
                    ? "💎 Explorador VIP"
                    : modoAcceso === "prueba"
                      ? "⏱️ Prueba activa"
                      : "🌌 Explorador visitante"}
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-xs font-black text-blue-100/65">
                  📱{" "}
                  {mascararTelefono(
                    telefono,
                  )}
                </span>
              </div>

              {/* NIVEL */}

              <div className="mt-7 rounded-3xl border border-white/10 bg-white/5 p-5 text-left">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-black text-white">
                    Progreso de nivel
                  </span>

                  <span className="text-sm font-black text-cyan-300">
                    {racha}/
                    {nivel.siguiente}
                  </span>
                </div>

                <div className="mt-3 h-4 overflow-hidden rounded-full bg-white/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-cyan-300 via-violet-400 to-pink-400 transition-all duration-700"
                    style={{
                      width: `${progresoNivel}%`,
                    }}
                  />
                </div>

                <p className="mt-3 text-xs leading-relaxed text-blue-100/50">
                  Continúa completando misiones de
                  aprendizaje para alcanzar el
                  siguiente nivel.
                </p>
              </div>
            </div>
          </article>

          {/* ESTADÍSTICAS */}

          <article className="rounded-[2.5rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-300">
              Resumen de la aventura
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              Tu universo personal
            </h2>

            <div className="mt-7 grid grid-cols-2 gap-4">
              <div className="rounded-3xl border border-orange-300/20 bg-orange-300/10 p-5 text-center">
                <span className="text-4xl">
                  🔥
                </span>

                <p className="mt-3 text-3xl font-black text-orange-300">
                  {racha}
                </p>

                <p className="text-xs font-bold uppercase tracking-wide text-blue-100/45">
                  Días de racha
                </p>
              </div>

              <div className="rounded-3xl border border-yellow-300/20 bg-yellow-300/10 p-5 text-center">
                <span className="text-4xl">
                  ⭐
                </span>

                <p className="mt-3 text-3xl font-black text-yellow-300">
                  {diasCompletados}
                </p>

                <p className="text-xs font-bold uppercase tracking-wide text-blue-100/45">
                  Misiones logradas
                </p>
              </div>

              <div className="rounded-3xl border border-pink-300/20 bg-pink-300/10 p-5 text-center">
                <span className="text-4xl">
                  ❤️
                </span>

                <p className="mt-3 text-3xl font-black text-pink-300">
                  {likesComunidad}
                </p>

                <p className="text-xs font-bold uppercase tracking-wide text-blue-100/45">
                  Reacciones dadas
                </p>
              </div>

              <div className="rounded-3xl border border-cyan-300/20 bg-cyan-300/10 p-5 text-center">
                <span className="text-4xl">
                  🪪
                </span>

                <p className="mt-3 text-3xl font-black text-cyan-300">
                  {perfilCompletado}%
                </p>

                <p className="text-xs font-bold uppercase tracking-wide text-blue-100/45">
                  Perfil completo
                </p>
              </div>
            </div>

            {/* CUMPLEAÑOS */}

            <div className="mt-5 rounded-3xl border border-violet-300/20 bg-violet-300/10 p-5">
              <div className="flex items-center gap-4">
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-violet-300 text-3xl">
                  🎂
                </span>

                <div>
                  <p className="text-sm font-black text-violet-200">
                    Próxima celebración
                  </p>

                  <p className="mt-1 text-sm text-blue-100/60">
                    {diasCumple === null
                      ? "Agrega tu fecha de cumpleaños."
                      : diasCumple === 0
                        ? "¡Hoy es tu cumpleaños! 🎉"
                        : `Faltan ${diasCumple} días para tu cumpleaños.`}
                  </p>
                </div>
              </div>
            </div>

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <p className="text-sm font-black text-white">
                Última entrada a la plataforma
              </p>

              <p className="mt-2 text-blue-100/60">
                📅 {fechaAcceso}
              </p>
            </div>
          </article>
        </section>

        {/* EDITAR PERFIL */}

        <section className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* AVATARES */}

          <article className="rounded-[2.5rem] border border-white/10 bg-slate-900/70 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
              Elige tu identidad
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              Tripulación de avatares
            </h2>

            <p className="mt-3 text-sm leading-relaxed text-blue-100/60">
              Selecciona el personaje que mejor
              represente tu aventura digital.
            </p>

            <div className="mt-7 grid grid-cols-4 gap-3 sm:grid-cols-5">
              {avatares.map(
                (item) => {
                  const seleccionado =
                    item.url === avatar;

                  return (
                    <button
                      key={`${item.nombre}-${item.url}`}
                      type="button"
                      onClick={() =>
                        setAvatar(
                          item.url,
                        )
                      }
                      title={item.nombre}
                      className={`relative aspect-square rounded-2xl border p-1.5 transition hover:-translate-y-1 ${
                        seleccionado
                          ? "border-yellow-300 bg-yellow-300/15 ring-2 ring-yellow-300/20"
                          : "border-white/10 bg-white/5 hover:border-cyan-300/30 hover:bg-white/10"
                      }`}
                    >
                      <img
                        src={item.url}
                        alt={item.nombre}
                        className="h-full w-full rounded-xl object-cover"
                        onError={(
                          evento,
                        ) => {
                          evento.currentTarget.onerror =
                            null;

                          evento.currentTarget.src =
                            AVATAR_RESPALDO;
                        }}
                      />

                      {seleccionado && (
                        <span className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-yellow-300 text-xs text-slate-950">
                          ✓
                        </span>
                      )}
                    </button>
                  );
                },
              )}
            </div>
          </article>

          {/* FORMULARIO */}

          <article className="rounded-[2.5rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-300 to-violet-400 text-3xl shadow-xl">
                ✍️
              </span>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                  Personalización
                </p>

                <h2 className="mt-1 text-3xl font-black text-white">
                  Completa tu pasaporte
                </h2>
              </div>
            </div>

            <div className="mt-7 grid gap-5 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="nombre"
                  className="mb-2 block text-sm font-black text-blue-100"
                >
                  Nombre y apellido
                </label>

                <input
                  id="nombre"
                  type="text"
                  value={nombre}
                  maxLength={70}
                  onChange={(evento) =>
                    setNombre(
                      evento.target.value,
                    )
                  }
                  placeholder="Ejemplo: María Pérez"
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-white outline-none placeholder:text-blue-100/30 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
                />
              </div>

              <div>
                <label
                  htmlFor="cumple"
                  className="mb-2 block text-sm font-black text-blue-100"
                >
                  Fecha de cumpleaños
                </label>

                <input
                  id="cumple"
                  type="date"
                  value={fechaCumple}
                  onChange={(evento) =>
                    setFechaCumple(
                      evento.target.value,
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-white outline-none focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10"
                />
              </div>

              <div>
                <label
                  htmlFor="tipo"
                  className="mb-2 block text-sm font-black text-blue-100"
                >
                  Tipo de explorador
                </label>

                <select
                  id="tipo"
                  value={tipoExplorador}
                  onChange={(evento) =>
                    setTipoExplorador(
                      evento.target.value,
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 p-4 text-white outline-none focus:border-violet-300"
                >
                  {tiposExplorador.map(
                    (tipo) => (
                      <option
                        key={tipo}
                        value={tipo}
                      >
                        {tipo}
                      </option>
                    ),
                  )}
                </select>
              </div>

              <div>
                <label
                  htmlFor="area"
                  className="mb-2 block text-sm font-black text-blue-100"
                >
                  Área favorita
                </label>

                <select
                  id="area"
                  value={areaFavorita}
                  onChange={(evento) =>
                    setAreaFavorita(
                      evento.target.value,
                    )
                  }
                  className="w-full rounded-2xl border border-white/10 bg-slate-950 p-4 text-white outline-none focus:border-yellow-300"
                >
                  {areasFavoritas.map(
                    (area) => (
                      <option
                        key={area}
                        value={area}
                      >
                        {area}
                      </option>
                    ),
                  )}
                </select>
              </div>
            </div>

            {/* META SEMANAL */}

            <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-5">
              <div className="flex items-center justify-between gap-4">
                <div>
                  <label
                    htmlFor="meta"
                    className="font-black text-white"
                  >
                    Meta semanal
                  </label>

                  <p className="mt-1 text-sm text-blue-100/50">
                    ¿Cuántos días deseas practicar?
                  </p>
                </div>

                <span className="rounded-2xl bg-yellow-300 px-4 py-2 text-xl font-black text-slate-950">
                  {metaSemanal}/7
                </span>
              </div>

              <input
                id="meta"
                type="range"
                min="1"
                max="7"
                value={metaSemanal}
                onChange={(evento) =>
                  setMetaSemanal(
                    Number(
                      evento.target.value,
                    ),
                  )
                }
                className="mt-5 w-full accent-yellow-300"
              />
            </div>

            <div className="mt-5">
              <label
                htmlFor="objetivo"
                className="mb-2 block text-sm font-black text-blue-100"
              >
                Mi misión personal
              </label>

              <textarea
                id="objetivo"
                value={objetivoPersonal}
                maxLength={250}
                rows={4}
                onChange={(evento) =>
                  setObjetivoPersonal(
                    evento.target.value,
                  )
                }
                placeholder="Ejemplo: Quiero aprender nuevas actividades para compartir con mi familia..."
                className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-white outline-none placeholder:text-blue-100/30 focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10"
              />

              <p className="mt-2 text-right text-xs text-blue-100/35">
                {objetivoPersonal.length}/250
              </p>
            </div>

            <button
              type="button"
              onClick={() =>
                void guardarPerfil()
              }
              disabled={
                estadoGuardado ===
                "guardando"
              }
              className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-400 via-violet-400 to-cyan-300 px-6 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-1 hover:brightness-110 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-50"
            >
              {estadoGuardado ===
              "guardando"
                ? "🚀 Guardando pasaporte..."
                : "💾 Guardar mi pasaporte"}
            </button>

            {aviso && (
              <div
                role="status"
                className={`mt-5 rounded-2xl border p-4 text-sm font-bold ${
                  estadoGuardado ===
                  "exito"
                    ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                    : estadoGuardado ===
                        "error"
                      ? "border-rose-300/30 bg-rose-300/10 text-rose-200"
                      : "border-cyan-300/30 bg-cyan-300/10 text-cyan-200"
                }`}
              >
                {aviso}
              </div>
            )}
          </article>
        </section>

        {/* ACCESOS RÁPIDOS */}

        <section className="mt-8">
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-300">
              Continúa la aventura
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              Próximas misiones
            </h2>
          </div>

          <div className="mt-6 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {[
              {
                href: "/biblioteca",
                icono: "📚",
                titulo: "Explorar materiales",
                texto: "Visita la Biblioteca Estelar.",
              },
              {
                href: "/tecnologia",
                icono: "💻",
                titulo: "Descubrir tecnología",
                texto: "Entra al Laboratorio Tech.",
              },
              {
                href: "/comunidad",
                icono: "💛",
                titulo: "Compartir una idea",
                texto: "Participa en la comunidad.",
              },
              {
                href: "/calendario",
                icono: "🏆",
                titulo: "Completar la racha",
                texto: "Reclama tu estrella diaria.",
              },
            ].map((mision) => (
              <Link
                key={mision.href}
                href={mision.href}
                className="group rounded-3xl border border-white/10 bg-white/5 p-6 text-center shadow-xl backdrop-blur transition hover:-translate-y-2 hover:border-cyan-300/30 hover:bg-white/10"
              >
                <span className="text-5xl">
                  {mision.icono}
                </span>

                <h3 className="mt-4 font-black text-white">
                  {mision.titulo}
                </h3>

                <p className="mt-2 text-sm text-blue-100/50">
                  {mision.texto}
                </p>

                <span className="mt-4 inline-block font-black text-cyan-300 transition group-hover:translate-x-1">
                  Iniciar →
                </span>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}