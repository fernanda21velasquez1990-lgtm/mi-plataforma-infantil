"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import { useRouter } from "next/navigation";

/* =====================================================
   TIPOS
===================================================== */

type MaterialTecnologia = {
  Nombre?: string;
  Descripcion?: string;
  Categoria?: string;
  ImagenUrl?: string;
  Link?: string;
  Disponible?: string | boolean;
};

type ModoAcceso =
  | "vip"
  | "prueba"
  | "sin-acceso";

/* =====================================================
   CONFIGURACIÓN
===================================================== */

const URL_TECNOLOGIA =
  "https://script.google.com/macros/s/AKfycbzE9geMXM_ZHfdaHpKbkvbQHJQcEUfdutgeh4NQ6bmjXKTmO8SDigdD3kxAkodVv10v9A/exec";

const IMAGEN_RESPALDO =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='550'%3E%3Crect width='100%25' height='100%25' fill='%230f172a'/%3E%3Ccircle cx='50%25' cy='40%25' r='90' fill='%231e3a8a'/%3E%3Ctext x='50%25' y='42%25' dominant-baseline='middle' text-anchor='middle' font-size='90'%3E💻%3C/text%3E%3Ctext x='50%25' y='70%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='%2367e8f9'%3ETecnología educativa%3C/text%3E%3C/svg%3E";

/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

function calcularTiempoRestante(
  limite: number,
): string {
  const diferencia = Math.max(
    0,
    limite - Date.now(),
  );

  const segundosTotales = Math.floor(
    diferencia / 1000,
  );

  const horas = Math.floor(
    segundosTotales / 3600,
  );

  const minutos = Math.floor(
    (segundosTotales % 3600) / 60,
  );

  const segundos =
    segundosTotales % 60;

  const dosDigitos = (
    numero: number,
  ) =>
    numero.toString().padStart(2, "0");

  return `${dosDigitos(horas)}:${dosDigitos(
    minutos,
  )}:${dosDigitos(segundos)}`;
}

function materialDisponible(
  valor: MaterialTecnologia["Disponible"],
): boolean {
  if (
    valor === undefined ||
    valor === null ||
    valor === ""
  ) {
    return true;
  }

  if (typeof valor === "boolean") {
    return valor;
  }

  const texto = String(valor)
    .trim()
    .toLowerCase();

  return ![
    "no",
    "false",
    "0",
    "inactivo",
    "no disponible",
  ].includes(texto);
}

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */

export default function Tecnologia() {
  const router = useRouter();

  const [materiales, setMateriales] =
    useState<MaterialTecnologia[]>([]);

  const [modoAcceso, setModoAcceso] =
    useState<ModoAcceso>("sin-acceso");

  const [sesionLista, setSesionLista] =
    useState(false);

  const [cargando, setCargando] =
    useState(true);

  const [errorCarga, setErrorCarga] =
    useState("");

  const [
    tiempoRestante,
    setTiempoRestante,
  ] = useState("");

  const [
    categoriaActiva,
    setCategoriaActiva,
  ] = useState("Todos");

  /* ===================================================
     LIMPIAR SESIÓN
  =================================================== */

  const limpiarSesion = () => {
    localStorage.removeItem(
      "accesoVIP",
    );

    localStorage.removeItem(
      "modoAcceso",
    );

    localStorage.removeItem(
      "limitePrueba",
    );

    localStorage.removeItem(
      "telefonoAcceso",
    );
  };

  /* ===================================================
     VALIDAR ACCESO
  =================================================== */

  useEffect(() => {
    const accesoVIP =
      localStorage.getItem(
        "accesoVIP",
      ) === "true" ||
      localStorage.getItem(
        "modoAcceso",
      ) === "vip";

    const modoGuardado =
      localStorage.getItem(
        "modoAcceso",
      );

    const limitePrueba = Number(
      localStorage.getItem(
        "limitePrueba",
      ) || "0",
    );

    if (accesoVIP) {
      setModoAcceso("vip");
      setSesionLista(true);
      return;
    }

    if (
      modoGuardado === "prueba" &&
      limitePrueba > Date.now()
    ) {
      setModoAcceso("prueba");

      setTiempoRestante(
        calcularTiempoRestante(
          limitePrueba,
        ),
      );

      setSesionLista(true);
      return;
    }

    limpiarSesion();

    router.replace(
      "/acceso?motivo=acceso-requerido",
    );
  }, [router]);

  /* ===================================================
     CONTROL DEL TIEMPO DE PRUEBA
  =================================================== */

  useEffect(() => {
    if (
      modoAcceso !== "prueba"
    ) {
      return;
    }

    const comprobarTiempo = () => {
      const limitePrueba = Number(
        localStorage.getItem(
          "limitePrueba",
        ) || "0",
      );

      const modoGuardado =
        localStorage.getItem(
          "modoAcceso",
        );

      if (
        modoGuardado !== "prueba" ||
        !limitePrueba ||
        limitePrueba <= Date.now()
      ) {
        limpiarSesion();

        router.replace(
          "/acceso?motivo=prueba-finalizada",
        );

        return;
      }

      setTiempoRestante(
        calcularTiempoRestante(
          limitePrueba,
        ),
      );
    };

    comprobarTiempo();

    const intervalo =
      window.setInterval(
        comprobarTiempo,
        1000,
      );

    return () => {
      window.clearInterval(
        intervalo,
      );
    };
  }, [modoAcceso, router]);

  /* ===================================================
     CARGAR MATERIALES
  =================================================== */

  useEffect(() => {
    if (!sesionLista) {
      return;
    }

    const cargarMateriales =
      async () => {
        setCargando(true);
        setErrorCarga("");

        try {
          const parametros =
            new URLSearchParams({
              t: Date.now().toString(),
            });

          const respuesta =
            await fetch(
              `${URL_TECNOLOGIA}?${parametros.toString()}`,
              {
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
              "La respuesta no contiene una lista de materiales.",
            );
          }

          setMateriales(
            datos as MaterialTecnologia[],
          );
        } catch (error) {
          console.error(
            "Error al cargar tecnología:",
            error,
          );

          setErrorCarga(
            "No pudimos cargar los recursos tecnológicos. Revisa la conexión e inténtalo nuevamente.",
          );
        } finally {
          setCargando(false);
        }
      };

    void cargarMateriales();
  }, [sesionLista]);

  /* ===================================================
     CATEGORÍAS
  =================================================== */

  const categorias = useMemo(() => {
    const categoriasEncontradas =
      materiales
        .map((material) =>
          String(
            material.Categoria || "",
          ).trim(),
        )
        .filter(Boolean);

    return [
      "Todos",
      ...Array.from(
        new Set(
          categoriasEncontradas,
        ),
      ),
    ];
  }, [materiales]);

  const materialesFiltrados =
    useMemo(() => {
      if (
        categoriaActiva ===
        "Todos"
      ) {
        return materiales;
      }

      return materiales.filter(
        (material) =>
          String(
            material.Categoria || "",
          ).trim() ===
          categoriaActiva,
      );
    }, [
      materiales,
      categoriaActiva,
    ]);

  const esVIP =
    modoAcceso === "vip";

  const esPrueba =
    modoAcceso === "prueba";

  /* ===================================================
     VALIDANDO SESIÓN
  =================================================== */

  if (!sesionLista) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="text-center">
          <div className="animate-bounce text-7xl">
            🚀
          </div>

          <h1 className="mt-6 text-2xl font-black">
            Verificando tu acceso...
          </h1>

          <p className="mt-2 text-blue-100/60">
            Preparando el Laboratorio
            Tech.
          </p>
        </div>
      </main>
    );
  }

  /* ===================================================
     PÁGINA
  =================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 pb-24 pt-20 text-white sm:px-6">
      {/* FONDO ESPACIAL */}

      <div className="pointer-events-none absolute -left-44 top-10 h-[36rem] w-[36rem] rounded-full bg-blue-600/25 blur-3xl" />

      <div className="pointer-events-none absolute -right-44 top-20 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />

      <span className="pointer-events-none absolute left-[6%] top-40 hidden text-6xl opacity-60 lg:block">
        🛰️
      </span>

      <span className="pointer-events-none absolute right-[7%] top-52 hidden text-7xl opacity-60 lg:block">
        🤖
      </span>

      <span className="pointer-events-none absolute left-[12%] top-[52%] hidden text-4xl opacity-40 lg:block">
        ⚡
      </span>

      <span className="pointer-events-none absolute right-[12%] top-[60%] hidden text-4xl opacity-40 lg:block">
        🪐
      </span>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ENCABEZADO */}

        <header className="mx-auto mb-10 max-w-4xl text-center">
          <span
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black tracking-wide backdrop-blur ${
              esPrueba
                ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200"
                : "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
            }`}
          >
            {esPrueba
              ? "⏱️ PRUEBA ACTIVA"
              : "💎 ACCESO VIP"}
          </span>

          <h1 className="mt-5 bg-gradient-to-r from-cyan-300 via-blue-300 to-violet-300 bg-clip-text text-4xl font-black leading-tight text-transparent drop-shadow-lg md:text-6xl">
            Laboratorio Tech
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-blue-100/75 md:text-lg">
            Explora herramientas,
            aplicaciones y recursos
            tecnológicos para aprender,
            crear y descubrir.
          </p>

          {esPrueba && (
            <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-emerald-300/25 bg-emerald-300/10 p-5 backdrop-blur-xl">
              <div className="flex flex-col items-center justify-between gap-4 sm:flex-row">
                <div className="flex items-center gap-4 text-left">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-emerald-300 text-3xl shadow-xl">
                    ⬇️
                  </span>

                  <div>
                    <h2 className="font-black text-emerald-200">
                      Descargas habilitadas
                    </h2>

                    <p className="mt-1 text-sm text-emerald-100/70">
                      Puedes descargar recursos
                      tecnológicos mientras tu
                      prueba siga activa.
                    </p>
                  </div>
                </div>

                <div className="rounded-full bg-slate-950 px-5 py-3 font-black tracking-widest text-yellow-300 shadow-xl">
                  {tiempoRestante ||
                    "00:00:00"}
                </div>
              </div>
            </div>
          )}

          {esVIP && (
            <div className="mx-auto mt-6 max-w-2xl rounded-3xl border border-emerald-300/25 bg-emerald-300/10 p-5 text-emerald-100 backdrop-blur-xl">
              <strong>
                ✅ Todas las descargas están
                habilitadas sin límite de
                tiempo.
              </strong>
            </div>
          )}
        </header>

        {/* FILTROS */}

        {categorias.length > 1 && (
          <section className="mb-9">
            <div className="flex gap-3 overflow-x-auto pb-4 md:flex-wrap md:justify-center md:overflow-visible">
              {categorias.map(
                (categoria) => {
                  const activa =
                    categoriaActiva ===
                    categoria;

                  return (
                    <button
                      key={categoria}
                      type="button"
                      onClick={() =>
                        setCategoriaActiva(
                          categoria,
                        )
                      }
                      className={`shrink-0 rounded-full border px-5 py-3 text-sm font-black transition hover:-translate-y-0.5 ${
                        activa
                          ? "border-cyan-300 bg-cyan-300 text-slate-950 shadow-lg shadow-cyan-500/20"
                          : "border-white/10 bg-white/10 text-blue-100 backdrop-blur hover:border-white/25 hover:bg-white/15"
                      }`}
                    >
                      {categoria ===
                      "Todos"
                        ? "🌌 Todos"
                        : `💻 ${categoria}`}
                    </button>
                  );
                },
              )}
            </div>

            <div className="mt-2 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm text-blue-100/65 backdrop-blur">
              Mostrando{" "}
              <strong className="text-cyan-300">
                {
                  materialesFiltrados.length
                }
              </strong>{" "}
              recursos tecnológicos
            </div>
          </section>
        )}

        {/* CARGANDO */}

        {cargando && (
          <section
            role="status"
            className="rounded-[2rem] border border-white/10 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl"
          >
            <div className="animate-bounce text-7xl">
              🤖
            </div>

            <h2 className="mt-5 text-2xl font-black text-cyan-200">
              Preparando el laboratorio...
            </h2>

            <p className="mt-2 text-blue-100/60">
              Estamos conectando con los
              recursos tecnológicos.
            </p>
          </section>
        )}

        {/* ERROR */}

        {!cargando &&
          errorCarga && (
            <section
              role="alert"
              className="rounded-[2rem] border border-rose-300/30 bg-rose-400/10 p-10 text-center shadow-2xl backdrop-blur-xl"
            >
              <div className="text-7xl">
                🛰️
              </div>

              <h2 className="mt-5 text-2xl font-black text-rose-200">
                No pudimos establecer
                conexión
              </h2>

              <p className="mx-auto mt-3 max-w-xl text-rose-100/70">
                {errorCarga}
              </p>

              <button
                type="button"
                onClick={() =>
                  window.location.reload()
                }
                className="mt-6 rounded-full bg-rose-400 px-6 py-3 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-rose-300"
              >
                Intentar nuevamente
              </button>
            </section>
          )}

        {/* MATERIALES */}

        {!cargando &&
          !errorCarga && (
            <section className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
              {materialesFiltrados.map(
                (material, indice) => {
                  const disponible =
                    materialDisponible(
                      material.Disponible,
                    );

                  const tieneEnlace =
                    Boolean(
                      String(
                        material.Link ||
                          "",
                      ).trim(),
                    );

                  const descargaPermitida =
                    disponible &&
                    tieneEnlace &&
                    (esVIP ||
                      esPrueba);

                  return (
                    <article
                      key={`${material.Nombre || "material"}-${indice}`}
                      className="group relative flex h-full flex-col overflow-hidden rounded-[2rem] border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-cyan-300/25"
                    >
                      <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-cyan-400 via-blue-500 to-violet-500" />

                      {material.Categoria && (
                        <span className="absolute right-8 top-8 z-10 rounded-full bg-yellow-300 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-950 shadow-xl">
                          {
                            material.Categoria
                          }
                        </span>
                      )}

                      <div className="relative mb-5 mt-1 h-52 overflow-hidden rounded-2xl bg-slate-950">
                        <img
                          src={
                            material.ImagenUrl ||
                            IMAGEN_RESPALDO
                          }
                          alt={
                            material.Nombre ||
                            "Recurso tecnológico"
                          }
                          loading="lazy"
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          onError={(
                            evento,
                          ) => {
                            evento.currentTarget.onerror =
                              null;

                            evento.currentTarget.src =
                              IMAGEN_RESPALDO;
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                        {esPrueba &&
                          disponible && (
                            <span className="absolute bottom-3 left-3 rounded-full bg-emerald-300 px-3 py-1.5 text-xs font-black text-emerald-950">
                              ⬇️ Descarga
                              habilitada
                            </span>
                          )}
                      </div>

                      <div className="flex flex-1 flex-col">
                        <h2 className="text-xl font-black leading-tight text-white">
                          {material.Nombre ||
                            "Recurso tecnológico"}
                        </h2>

                        <p className="mt-3 flex-1 text-sm leading-relaxed text-blue-100/65">
                          {material.Descripcion ||
                            "Explora este recurso digital y descubre nuevas formas de aprender con tecnología."}
                        </p>

                        <div className="mt-6">
                          {!disponible ? (
                            <div className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-rose-300/25 bg-rose-400/10 px-5 py-3 font-black text-rose-200">
                              🚫 No disponible por
                              ahora
                            </div>
                          ) : !tieneEnlace ? (
                            <div className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-5 py-3 font-black text-blue-100/40">
                              🔗 Enlace no
                              disponible
                            </div>
                          ) : descargaPermitida ? (
                            <a
                              href={
                                material.Link
                              }
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan-300 to-emerald-300 px-5 py-3 font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:brightness-105"
                            >
                              {esPrueba
                                ? "Descargar durante mi prueba"
                                : "Descargar material"}{" "}
                              ⬇️
                            </a>
                          ) : (
                            <div className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full bg-white/10 px-5 py-3 font-black text-blue-100/40">
                              🔒 Acceso requerido
                            </div>
                          )}
                        </div>
                      </div>
                    </article>
                  );
                },
              )}

              {materialesFiltrados.length ===
                0 && (
                <div className="col-span-full rounded-[2rem] border border-white/10 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl">
                  <div className="text-7xl">
                    🛸
                  </div>

                  <h2 className="mt-5 text-2xl font-black text-cyan-200">
                    No hay recursos en esta
                    categoría
                  </h2>

                  <button
                    type="button"
                    onClick={() =>
                      setCategoriaActiva(
                        "Todos",
                      )
                    }
                    className="mt-6 rounded-full bg-cyan-300 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-200"
                  >
                    Ver todos los recursos
                  </button>
                </div>
              )}
            </section>
          )}
      </div>
    </main>
  );
}