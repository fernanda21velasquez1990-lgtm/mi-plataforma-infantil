"use client";

import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

/* =====================================================
   TIPOS
===================================================== */

type Publicacion = {
  id: string;
  nombre: string;
  texto: string;
  fecha: string;
  likes: number;
  temporal?: boolean;
};

type EstadoFormulario =
  | "neutral"
  | "exito"
  | "error";

/* =====================================================
   CONFIGURACIÓN
===================================================== */

const URL_COMUNIDAD =
  "https://script.google.com/macros/s/AKfycbzMp3gaWWHyFkcsSeBQxpNCqTzXomL6Yj3EIxAy2nxZs2aNfB0pViQx_VuUVcFpJ5dZ9g/exec";

const LIMITE_NOMBRE = 50;
const LIMITE_MENSAJE = 500;

/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

function convertirNumero(
  valor: unknown,
): number {
  const numero = Number(valor);

  return Number.isFinite(numero)
    ? Math.max(0, numero)
    : 0;
}

function normalizarPublicacion(
  valor: unknown,
  indice: number,
): Publicacion {
  const registro =
    valor as Record<string, unknown>;

  const id =
    registro.id ??
    registro.ID ??
    registro.Id ??
    `publicacion-${indice}`;

  return {
    id: String(id),
    nombre: String(
      registro.nombre ??
        registro.Nombre ??
        "Explorador digital",
    ).trim(),
    texto: String(
      registro.texto ??
        registro.Texto ??
        registro.mensaje ??
        "",
    ).trim(),
    fecha: String(
      registro.fecha ??
        registro.Fecha ??
        "",
    ).trim(),
    likes: convertirNumero(
      registro.likes ??
        registro.Likes ??
        0,
    ),
  };
}

function formatearFecha(
  valor: string,
): string {
  if (!valor) {
    return "Fecha no disponible";
  }

  const fecha = new Date(valor);

  if (Number.isNaN(fecha.getTime())) {
    return valor;
  }

  return new Intl.DateTimeFormat(
    "es-ES",
    {
      day: "2-digit",
      month: "short",
      year: "numeric",
    },
  ).format(fecha);
}

function obtenerInicial(
  nombre: string,
): string {
  const nombreLimpio =
    nombre.trim();

  return nombreLimpio
    ? nombreLimpio
        .charAt(0)
        .toUpperCase()
    : "🚀";
}

function leerLikesGuardados(): string[] {
  try {
    const guardados =
      localStorage.getItem(
        "misLikesComunidad",
      );

    if (!guardados) {
      return [];
    }

    const datos: unknown =
      JSON.parse(guardados);

    if (!Array.isArray(datos)) {
      return [];
    }

    return datos.map(String);
  } catch {
    return [];
  }
}

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */

export default function Comunidad() {
  const [nombre, setNombre] =
    useState("");

  const [mensaje, setMensaje] =
    useState("");

  const [
    publicaciones,
    setPublicaciones,
  ] = useState<Publicacion[]>([]);

  const [misLikes, setMisLikes] =
    useState<string[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [publicando, setPublicando] =
    useState(false);

  const [errorCarga, setErrorCarga] =
    useState("");

  const [
    estadoFormulario,
    setEstadoFormulario,
  ] =
    useState<EstadoFormulario>(
      "neutral",
    );

  const [
    avisoFormulario,
    setAvisoFormulario,
  ] = useState("");

  /* ===================================================
     CARGAR PUBLICACIONES
  =================================================== */

  const cargarPublicaciones =
    useCallback(async () => {
      setCargando(true);
      setErrorCarga("");

      try {
        const parametros =
          new URLSearchParams({
            t: Date.now().toString(),
          });

        const respuesta =
          await fetch(
            `${URL_COMUNIDAD}?${parametros.toString()}`,
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

        const datos: unknown =
          await respuesta.json();

        if (!Array.isArray(datos)) {
          throw new Error(
            "La respuesta no contiene una lista de publicaciones.",
          );
        }

        const publicacionesProcesadas =
          datos
            .map(normalizarPublicacion)
            .filter(
              (publicacion) =>
                publicacion.texto,
            );

        setPublicaciones(
          publicacionesProcesadas,
        );
      } catch (error) {
        console.error(
          "Error al cargar la comunidad:",
          error,
        );

        setErrorCarga(
          "No pudimos cargar las publicaciones. Revisa tu conexión e inténtalo nuevamente.",
        );
      } finally {
        setCargando(false);
      }
    }, []);

  useEffect(() => {
    setMisLikes(
      leerLikesGuardados(),
    );

    void cargarPublicaciones();
  }, [cargarPublicaciones]);

  /* ===================================================
     PUBLICAR MENSAJE
  =================================================== */

  const publicarMensaje =
    async () => {
      const nombreLimpio =
        nombre.trim();

      const mensajeLimpio =
        mensaje.trim();

      setEstadoFormulario(
        "neutral",
      );

      setAvisoFormulario("");

      if (
        !nombreLimpio ||
        !mensajeLimpio
      ) {
        setEstadoFormulario(
          "error",
        );

        setAvisoFormulario(
          "Escribe tu nombre y un mensaje antes de publicar.",
        );

        return;
      }

      const idTemporal =
        `temporal-${Date.now()}`;

      const fechaActual =
        new Date().toISOString();

      const publicacionTemporal: Publicacion =
        {
          id: idTemporal,
          nombre: nombreLimpio,
          texto: mensajeLimpio,
          fecha: fechaActual,
          likes: 0,
          temporal: true,
        };

      setPublicando(true);

      setPublicaciones(
        (actuales) => [
          publicacionTemporal,
          ...actuales,
        ],
      );

      setNombre("");
      setMensaje("");

      try {
        const parametros =
          new URLSearchParams({
            accion: "publicar",
            nombre: nombreLimpio,
            texto: mensajeLimpio,
            fecha: new Date()
              .toLocaleDateString(
                "es-ES",
              ),
          });

        const respuesta =
          await fetch(
            `${URL_COMUNIDAD}?${parametros.toString()}`,
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

        setEstadoFormulario(
          "exito",
        );

        setAvisoFormulario(
          "¡Tu mensaje fue publicado correctamente!",
        );

        await cargarPublicaciones();
      } catch (error) {
        console.error(
          "Error al guardar el mensaje:",
          error,
        );

        setPublicaciones(
          (actuales) =>
            actuales.filter(
              (publicacion) =>
                publicacion.id !==
                idTemporal,
            ),
        );

        setNombre(nombreLimpio);
        setMensaje(mensajeLimpio);

        setEstadoFormulario(
          "error",
        );

        setAvisoFormulario(
          "No pudimos guardar tu mensaje. Inténtalo nuevamente.",
        );
      } finally {
        setPublicando(false);
      }
    };

  /* ===================================================
     DAR O QUITAR LIKE
  =================================================== */

  const darLike = async (
    id: string,
  ) => {
    const publicacion =
      publicaciones.find(
        (item) => item.id === id,
      );

    if (
      !publicacion ||
      publicacion.temporal
    ) {
      return;
    }

    const yaDioLike =
      misLikes.includes(id);

    const operacion =
      yaDioLike
        ? "restar"
        : "sumar";

    const nuevosLikes =
      yaDioLike
        ? misLikes.filter(
            (likeId) =>
              likeId !== id,
          )
        : [...misLikes, id];

    setMisLikes(nuevosLikes);

    localStorage.setItem(
      "misLikesComunidad",
      JSON.stringify(nuevosLikes),
    );

    setPublicaciones(
      (actuales) =>
        actuales.map(
          (publicacionActual) => {
            if (
              publicacionActual.id !==
              id
            ) {
              return publicacionActual;
            }

            return {
              ...publicacionActual,
              likes: Math.max(
                0,
                publicacionActual.likes +
                  (yaDioLike
                    ? -1
                    : 1),
              ),
            };
          },
        ),
    );

    try {
      const parametros =
        new URLSearchParams({
          accion: "like",
          id,
          operacion,
        });

      const respuesta =
        await fetch(
          `${URL_COMUNIDAD}?${parametros.toString()}`,
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
    } catch (error) {
      console.error(
        "Error al registrar el like:",
        error,
      );

      setMisLikes(misLikes);

      localStorage.setItem(
        "misLikesComunidad",
        JSON.stringify(misLikes),
      );

      setPublicaciones(
        (actuales) =>
          actuales.map(
            (publicacionActual) => {
              if (
                publicacionActual.id !==
                id
              ) {
                return publicacionActual;
              }

              return {
                ...publicacionActual,
                likes: Math.max(
                  0,
                  publicacionActual.likes +
                    (yaDioLike
                      ? 1
                      : -1),
                ),
              };
            },
          ),
      );
    }
  };

  /* ===================================================
     ESTADÍSTICAS
  =================================================== */

  const totalLikes = useMemo(
    () =>
      publicaciones.reduce(
        (total, publicacion) =>
          total +
          publicacion.likes,
        0,
      ),
    [publicaciones],
  );

  const cantidadParticipantes =
    useMemo(() => {
      const nombres =
        publicaciones
          .map((publicacion) =>
            publicacion.nombre
              .toLowerCase()
              .trim(),
          )
          .filter(Boolean);

      return new Set(nombres).size;
    }, [publicaciones]);

  const formularioCompleto =
    nombre.trim().length > 0 &&
    mensaje.trim().length > 0;

  /* ===================================================
     PÁGINA
  =================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 pb-24 pt-24 text-white sm:px-6">
      {/* FONDO ESPACIAL */}

      <div className="pointer-events-none absolute -left-44 top-10 h-[36rem] w-[36rem] rounded-full bg-blue-600/25 blur-3xl" />

      <div className="pointer-events-none absolute -right-44 top-20 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-pink-500/15 blur-3xl" />

      <span className="pointer-events-none absolute left-[7%] top-48 hidden text-6xl opacity-50 lg:block">
        💛
      </span>

      <span className="pointer-events-none absolute right-[7%] top-60 hidden text-7xl opacity-50 lg:block">
        💬
      </span>

      <span className="pointer-events-none absolute left-[12%] top-[58%] hidden text-4xl opacity-35 lg:block">
        ⭐
      </span>

      <span className="pointer-events-none absolute right-[12%] top-[65%] hidden text-4xl opacity-35 lg:block">
        🚀
      </span>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ENCABEZADO */}

        <header className="mx-auto mb-10 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-300/30 bg-pink-300/10 px-4 py-2 text-sm font-black tracking-wide text-pink-200 backdrop-blur">
            💛 FAMILIAS QUE INSPIRAN
          </span>

          <h1 className="mt-5 bg-gradient-to-r from-yellow-300 via-pink-300 to-violet-300 bg-clip-text text-4xl font-black leading-tight text-transparent drop-shadow-lg md:text-6xl">
            Comunidad Creativa
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-blue-100/75 md:text-lg">
            Comparte experiencias,
            recomendaciones e ideas con otras
            familias que forman parte de Mundo
            Digital Infantil.
          </p>

          {/* ESTADÍSTICAS */}

          <div className="mx-auto mt-7 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <span className="text-3xl">
                💬
              </span>

              <p className="mt-2 text-2xl font-black text-cyan-300">
                {publicaciones.length}
              </p>

              <p className="text-xs font-bold uppercase tracking-wide text-blue-100/50">
                Publicaciones
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <span className="text-3xl">
                👨‍👩‍👧‍👦
              </span>

              <p className="mt-2 text-2xl font-black text-yellow-300">
                {cantidadParticipantes}
              </p>

              <p className="text-xs font-bold uppercase tracking-wide text-blue-100/50">
                Participantes
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <span className="text-3xl">
                ❤️
              </span>

              <p className="mt-2 text-2xl font-black text-pink-300">
                {totalLikes}
              </p>

              <p className="text-xs font-bold uppercase tracking-wide text-blue-100/50">
                Reacciones
              </p>
            </div>
          </div>
        </header>

        {/* CONTENIDO */}

        <div className="grid items-start gap-8 lg:grid-cols-[0.85fr_1.15fr]">
          {/* FORMULARIO */}

          <section className="rounded-[2rem] border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl sm:p-7 lg:sticky lg:top-28">
            <div className="mb-6 flex items-start gap-4">
              <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-400 text-2xl shadow-xl">
                ✍️
              </span>

              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-pink-300">
                  Tu voz importa
                </p>

                <h2 className="mt-1 text-2xl font-black text-white">
                  Comparte con la comunidad
                </h2>

                <p className="mt-2 text-sm leading-relaxed text-blue-100/60">
                  Escribe una experiencia, idea,
                  recomendación o mensaje positivo.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div>
                <label
                  htmlFor="nombre-comunidad"
                  className="mb-2 block text-sm font-black text-blue-100"
                >
                  Tu nombre
                </label>

                <input
                  id="nombre-comunidad"
                  type="text"
                  placeholder="Ejemplo: María"
                  value={nombre}
                  maxLength={LIMITE_NOMBRE}
                  disabled={publicando}
                  onChange={(evento) => {
                    setNombre(
                      evento.target.value,
                    );

                    setEstadoFormulario(
                      "neutral",
                    );

                    setAvisoFormulario("");
                  }}
                  className="w-full rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-white outline-none transition placeholder:text-blue-100/35 focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10 disabled:opacity-60"
                />

                <p className="mt-2 text-right text-xs text-blue-100/35">
                  {nombre.length}/
                  {LIMITE_NOMBRE}
                </p>
              </div>

              <div>
                <label
                  htmlFor="mensaje-comunidad"
                  className="mb-2 block text-sm font-black text-blue-100"
                >
                  Tu mensaje
                </label>

                <textarea
                  id="mensaje-comunidad"
                  placeholder="¿Cómo ha sido tu experiencia? Comparte una idea o sugerencia..."
                  value={mensaje}
                  maxLength={LIMITE_MENSAJE}
                  disabled={publicando}
                  onChange={(evento) => {
                    setMensaje(
                      evento.target.value,
                    );

                    setEstadoFormulario(
                      "neutral",
                    );

                    setAvisoFormulario("");
                  }}
                  rows={6}
                  className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/50 p-4 text-white outline-none transition placeholder:text-blue-100/35 focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10 disabled:opacity-60"
                />

                <p className="mt-2 text-right text-xs text-blue-100/35">
                  {mensaje.length}/
                  {LIMITE_MENSAJE}
                </p>
              </div>

              <button
                type="button"
                onClick={() =>
                  void publicarMensaje()
                }
                disabled={
                  !formularioCompleto ||
                  publicando
                }
                className="flex w-full items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 px-6 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:brightness-110 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-40"
              >
                {publicando
                  ? "🚀 Publicando..."
                  : "Publicar mi mensaje 🚀"}
              </button>

              {avisoFormulario && (
                <div
                  role="status"
                  className={`rounded-2xl border p-4 text-sm font-bold ${
                    estadoFormulario ===
                    "exito"
                      ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                      : "border-rose-300/30 bg-rose-300/10 text-rose-200"
                  }`}
                >
                  {estadoFormulario ===
                  "exito"
                    ? "✅ "
                    : "⚠️ "}

                  {avisoFormulario}
                </div>
              )}
            </div>
          </section>

          {/* MURO */}

          <section>
            <div className="mb-5 flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <p className="text-xs font-black uppercase tracking-[0.18em] text-cyan-300">
                  Historias compartidas
                </p>

                <h2 className="mt-1 text-2xl font-black text-white">
                  Muro de la comunidad
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  void cargarPublicaciones()
                }
                disabled={cargando}
                className="rounded-full border border-white/10 bg-white/5 px-5 py-3 text-sm font-black text-blue-100 transition hover:bg-white/10 disabled:opacity-50"
              >
                🔄 Actualizar mensajes
              </button>
            </div>

            {/* CARGANDO */}

            {cargando && (
              <div className="space-y-5">
                {[1, 2, 3].map(
                  (elemento) => (
                    <div
                      key={elemento}
                      className="animate-pulse rounded-[2rem] border border-white/10 bg-white/5 p-6"
                    >
                      <div className="flex items-center gap-4">
                        <div className="h-12 w-12 rounded-2xl bg-white/10" />

                        <div className="flex-1">
                          <div className="h-4 w-36 rounded bg-white/10" />

                          <div className="mt-2 h-3 w-24 rounded bg-white/5" />
                        </div>
                      </div>

                      <div className="mt-6 h-4 w-full rounded bg-white/10" />

                      <div className="mt-3 h-4 w-3/4 rounded bg-white/5" />
                    </div>
                  ),
                )}
              </div>
            )}

            {/* ERROR */}

            {!cargando && errorCarga && (
              <div className="rounded-[2rem] border border-rose-300/30 bg-rose-400/10 p-10 text-center shadow-2xl backdrop-blur-xl">
                <div className="text-6xl">
                  🛰️
                </div>

                <h3 className="mt-5 text-2xl font-black text-rose-200">
                  No pudimos cargar la comunidad
                </h3>

                <p className="mx-auto mt-3 max-w-lg text-rose-100/65">
                  {errorCarga}
                </p>

                <button
                  type="button"
                  onClick={() =>
                    void cargarPublicaciones()
                  }
                  className="mt-6 rounded-full bg-rose-300 px-6 py-3 font-black text-slate-950 transition hover:bg-rose-200"
                >
                  Intentar nuevamente
                </button>
              </div>
            )}

            {/* SIN PUBLICACIONES */}

            {!cargando &&
              !errorCarga &&
              publicaciones.length ===
                0 && (
                <div className="rounded-[2rem] border border-white/10 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl">
                  <div className="text-7xl">
                    🌟
                  </div>

                  <h3 className="mt-5 text-2xl font-black text-yellow-200">
                    La comunidad está esperando
                    tu historia
                  </h3>

                  <p className="mx-auto mt-3 max-w-lg text-blue-100/60">
                    Sé la primera persona en
                    compartir una experiencia,
                    recomendación o idea.
                  </p>
                </div>
              )}

            {/* PUBLICACIONES */}

            {!cargando &&
              !errorCarga && (
                <div className="space-y-5">
                  {publicaciones.map(
                    (publicacion) => {
                      const leDiLike =
                        misLikes.includes(
                          publicacion.id,
                        );

                      return (
                        <article
                          key={
                            publicacion.id
                          }
                          className={`group relative overflow-hidden rounded-[2rem] border bg-slate-900/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-1 sm:p-6 ${
                            publicacion.temporal
                              ? "border-yellow-300/30 opacity-75"
                              : "border-white/10 hover:border-pink-300/25"
                          }`}
                        >
                          <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-b from-yellow-300 via-pink-400 to-violet-500" />

                          <div className="flex items-start gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-300 via-violet-300 to-cyan-300 text-lg font-black text-slate-950 shadow-lg">
                              {obtenerInicial(
                                publicacion.nombre,
                              )}
                            </div>

                            <div className="min-w-0 flex-1">
                              <div className="flex flex-wrap items-start justify-between gap-2">
                                <div>
                                  <h3 className="font-black text-white">
                                    {
                                      publicacion.nombre
                                    }
                                  </h3>

                                  <p className="mt-1 text-xs font-medium text-blue-100/40">
                                    📅{" "}
                                    {formatearFecha(
                                      publicacion.fecha,
                                    )}
                                  </p>
                                </div>

                                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[10px] font-black uppercase tracking-wide text-cyan-200">
                                  Miembro de la
                                  comunidad
                                </span>
                              </div>

                              <p className="mt-5 whitespace-pre-line break-words leading-relaxed text-blue-100/75">
                                {
                                  publicacion.texto
                                }
                              </p>

                              <div className="mt-5 border-t border-white/10 pt-4">
                                <button
                                  type="button"
                                  onClick={() =>
                                    void darLike(
                                      publicacion.id,
                                    )
                                  }
                                  disabled={
                                    publicacion.temporal
                                  }
                                  className={`inline-flex items-center gap-2 rounded-full border px-4 py-2.5 text-sm font-black transition ${
                                    leDiLike
                                      ? "border-pink-300/40 bg-pink-300/15 text-pink-200"
                                      : "border-white/10 bg-white/5 text-blue-100/60 hover:border-pink-300/30 hover:bg-pink-300/10 hover:text-pink-200"
                                  } disabled:cursor-not-allowed disabled:opacity-40`}
                                >
                                  <span className="text-lg">
                                    {leDiLike
                                      ? "❤️"
                                      : "🤍"}
                                  </span>

                                  <span>
                                    {
                                      publicacion.likes
                                    }{" "}
                                    Me gusta
                                  </span>
                                </button>

                                {publicacion.temporal && (
                                  <span className="ml-3 text-xs font-bold text-yellow-200/70">
                                    Publicando...
                                  </span>
                                )}
                              </div>
                            </div>
                          </div>
                        </article>
                      );
                    },
                  )}
                </div>
              )}
          </section>
        </div>
      </div>
    </main>
  );
}