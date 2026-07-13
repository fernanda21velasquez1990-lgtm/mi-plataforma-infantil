"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

/* =====================================================
   TIPOS
===================================================== */

type Promocion = {
  NombreCurso?: string;
  Descripcion?: string;
  Categoria?: string;
  ImagenUrl?: string;
  PrecioNormal?: string | number;
  PrecioOferta?: string | number;
  DescuentoExtra?: string | number;
  Etiqueta?: string;
  Disponible?: string | boolean;
  Destacada?: string | boolean;
};

/* =====================================================
   CONFIGURACIÓN
===================================================== */

const NUMERO_WHATSAPP =
  "584144895281";

const URL_PROMOCIONES =
  "https://script.google.com/macros/s/AKfycbzF9mUNcMJ_dKpnl2nLfULdMkqa3eY_zQw5hw8lSVjyUjBT6lQj2zGwMZ79gH88alTL/exec";

const IMAGEN_RESPALDO =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='900' height='550'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1'%3E%3Cstop stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%234c1d95'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Ctext x='50%25' y='42%25' dominant-baseline='middle' text-anchor='middle' font-size='100'%3E🎁%3C/text%3E%3Ctext x='50%25' y='68%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='30' fill='%23f9a8d4'%3EPromoción especial%3C/text%3E%3C/svg%3E";

/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

function normalizarTexto(
  valor: unknown,
): string {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(
      /[\u0300-\u036f]/g,
      "",
    )
    .toLowerCase()
    .trim();
}

function convertirABooleano(
  valor: unknown,
  valorPredeterminado = true,
): boolean {
  if (
    valor === undefined ||
    valor === null ||
    valor === ""
  ) {
    return valorPredeterminado;
  }

  if (typeof valor === "boolean") {
    return valor;
  }

  const texto = normalizarTexto(
    valor,
  );

  return ![
    "no",
    "false",
    "0",
    "inactivo",
    "no disponible",
    "agotado",
  ].includes(texto);
}

function mostrarPrecio(
  valor: string | number | undefined,
): string {
  if (
    valor === undefined ||
    valor === null ||
    valor === ""
  ) {
    return "Consultar";
  }

  return String(valor).trim();
}

function obtenerDescuento(
  promocion: Promocion,
): string {
  const descuento = String(
    promocion.DescuentoExtra ?? "",
  ).trim();

  if (!descuento) {
    return "20% OFF EXTRA";
  }

  if (
    descuento.includes("%") ||
    normalizarTexto(
      descuento,
    ).includes("off")
  ) {
    return descuento;
  }

  return `${descuento}% OFF EXTRA`;
}

/* =====================================================
   COMPONENTE
===================================================== */

export default function Promociones() {
  const [promociones, setPromociones] =
    useState<Promocion[]>([]);

  const [categoriaActiva, setCategoriaActiva] =
    useState("Todas");

  const [busqueda, setBusqueda] =
    useState("");

  const [cargando, setCargando] =
    useState(true);

  const [errorCarga, setErrorCarga] =
    useState("");

  /* ===================================================
     CARGAR PROMOCIONES
  =================================================== */

  useEffect(() => {
    const cargarPromociones =
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
              `${URL_PROMOCIONES}?${parametros.toString()}`,
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
              "La respuesta no contiene una lista de promociones.",
            );
          }

          setPromociones(
            datos as Promocion[],
          );
        } catch (error) {
          console.error(
            "Error al cargar promociones:",
            error,
          );

          setErrorCarga(
            "No pudimos cargar las promociones. Revisa la conexión e inténtalo nuevamente.",
          );
        } finally {
          setCargando(false);
        }
      };

    void cargarPromociones();
  }, []);

  /* ===================================================
     CATEGORÍAS DINÁMICAS
  =================================================== */

  const categorias = useMemo(() => {
    const encontradas =
      promociones
        .map((promocion) =>
          String(
            promocion.Categoria || "",
          ).trim(),
        )
        .filter(Boolean);

    return [
      "Todas",
      ...Array.from(
        new Set(encontradas),
      ),
    ];
  }, [promociones]);

  /* ===================================================
     FILTRAR PROMOCIONES
  =================================================== */

  const promocionesFiltradas =
    useMemo(() => {
      const textoBuscado =
        normalizarTexto(busqueda);

      return promociones.filter(
        (promocion) => {
          const nombre =
            normalizarTexto(
              promocion.NombreCurso,
            );

          const descripcion =
            normalizarTexto(
              promocion.Descripcion,
            );

          const categoria =
            normalizarTexto(
              promocion.Categoria,
            );

          const coincideBusqueda =
            !textoBuscado ||
            nombre.includes(
              textoBuscado,
            ) ||
            descripcion.includes(
              textoBuscado,
            ) ||
            categoria.includes(
              textoBuscado,
            );

          const coincideCategoria =
            categoriaActiva ===
              "Todas" ||
            String(
              promocion.Categoria ||
                "",
            ).trim() ===
              categoriaActiva;

          return (
            coincideBusqueda &&
            coincideCategoria
          );
        },
      );
    }, [
      promociones,
      busqueda,
      categoriaActiva,
    ]);

  const cantidadDisponibles =
    useMemo(() => {
      return promociones.filter(
        (promocion) =>
          convertirABooleano(
            promocion.Disponible,
          ),
      ).length;
    }, [promociones]);

  /* ===================================================
     COMPRAR POR WHATSAPP
  =================================================== */

  const comprarCurso = (
    promocion: Promocion,
  ) => {
    const nombre =
      promocion.NombreCurso ||
      "promoción educativa";

    const precio =
      mostrarPrecio(
        promocion.PrecioOferta,
      );

    const mensaje =
      `Hola, quiero comprar la promoción: ${nombre}. ` +
      `El precio de oferta mostrado es ${precio}. ` +
      `Vi esta promoción en Mundo Digital Infantil.`;

    const enlace =
      `https://wa.me/${NUMERO_WHATSAPP}` +
      `?text=${encodeURIComponent(
        mensaje,
      )}`;

    window.location.href = enlace;
  };

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaActiva("Todas");
  };

  /* ===================================================
     PÁGINA
  =================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 pb-24 pt-20 text-white sm:px-6">
      {/* FONDO ESPACIAL */}

      <div className="pointer-events-none absolute -left-44 top-10 h-[36rem] w-[36rem] rounded-full bg-blue-600/25 blur-3xl" />

      <div className="pointer-events-none absolute -right-44 top-20 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/25 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-pink-500/15 blur-3xl" />

      <span className="pointer-events-none absolute left-[6%] top-40 hidden text-6xl opacity-60 lg:block">
        🎁
      </span>

      <span className="pointer-events-none absolute right-[7%] top-48 hidden text-7xl opacity-60 lg:block">
        🛍️
      </span>

      <span className="pointer-events-none absolute left-[12%] top-[55%] hidden text-4xl opacity-40 lg:block">
        ⭐
      </span>

      <span className="pointer-events-none absolute right-[10%] top-[62%] hidden text-4xl opacity-40 lg:block">
        🚀
      </span>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ENCABEZADO */}

        <header className="mx-auto mb-10 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-pink-300/30 bg-pink-300/10 px-4 py-2 text-sm font-black tracking-wide text-pink-200 backdrop-blur">
            🎁 OFERTAS ESPECIALES
          </span>

          <h1 className="mt-5 bg-gradient-to-r from-yellow-300 via-pink-300 to-violet-300 bg-clip-text text-4xl font-black leading-tight text-transparent drop-shadow-lg md:text-6xl">
            Promociones Estelares
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-blue-100/75 md:text-lg">
            Descubre cursos, materiales y
            recursos educativos con precios
            especiales para seguir aprendiendo.
          </p>

          {/* RESUMEN */}

          <div className="mx-auto mt-7 grid max-w-3xl grid-cols-1 gap-4 sm:grid-cols-3">
            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <span className="text-3xl">
                🎁
              </span>

              <p className="mt-2 text-2xl font-black text-yellow-300">
                {promociones.length}
              </p>

              <p className="text-xs font-bold uppercase tracking-wide text-blue-100/55">
                Promociones
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <span className="text-3xl">
                ✅
              </span>

              <p className="mt-2 text-2xl font-black text-emerald-300">
                {cantidadDisponibles}
              </p>

              <p className="text-xs font-bold uppercase tracking-wide text-blue-100/55">
                Disponibles
              </p>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/10 p-5 backdrop-blur-xl">
              <span className="text-3xl">
                ⚡
              </span>

              <p className="mt-2 text-2xl font-black text-pink-300">
                20%
              </p>

              <p className="text-xs font-bold uppercase tracking-wide text-blue-100/55">
                Descuento extra
              </p>
            </div>
          </div>
        </header>

        {/* BUSCADOR */}

        <section className="mb-9">
          <div className="relative mx-auto mb-6 max-w-2xl">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-2xl">
              🔍
            </span>

            <input
              type="search"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(
                  evento.target.value,
                )
              }
              placeholder="Buscar curso o promoción..."
              className="w-full rounded-full border-2 border-white/15 bg-white/10 py-4 pl-14 pr-5 text-base font-medium text-white shadow-2xl outline-none backdrop-blur-xl transition placeholder:text-blue-100/40 focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10 md:text-lg"
              aria-label="Buscar promociones"
            />
          </div>

          {/* CATEGORÍAS */}

          {categorias.length > 1 && (
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
                          ? "border-pink-300 bg-gradient-to-r from-pink-300 to-yellow-300 text-slate-950 shadow-lg shadow-pink-500/20"
                          : "border-white/10 bg-white/10 text-blue-100 backdrop-blur hover:border-white/25 hover:bg-white/15"
                      }`}
                    >
                      {categoria ===
                      "Todas"
                        ? "🌌 Todas"
                        : `🎁 ${categoria}`}
                    </button>
                  );
                },
              )}
            </div>
          )}

          <div className="mt-2 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-blue-100/65 backdrop-blur sm:flex-row">
            <p>
              Mostrando{" "}
              <strong className="text-pink-300">
                {
                  promocionesFiltradas.length
                }
              </strong>{" "}
              de {promociones.length} promociones
            </p>

            {(busqueda ||
              categoriaActiva !==
                "Todas") && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="font-bold text-yellow-300 underline decoration-yellow-400 underline-offset-4 hover:text-yellow-200"
              >
                Limpiar búsqueda y filtros
              </button>
            )}
          </div>
        </section>

        {/* CARGANDO */}

        {cargando && (
          <section
            role="status"
            className="rounded-[2rem] border border-white/10 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl"
          >
            <div className="animate-bounce text-7xl">
              🎁
            </div>

            <h2 className="mt-5 text-2xl font-black text-pink-200">
              Buscando ofertas estelares...
            </h2>

            <p className="mt-2 text-blue-100/60">
              Las promociones estarán listas
              en un momento.
            </p>
          </section>
        )}

        {/* ERROR */}

        {!cargando && errorCarga && (
          <section
            role="alert"
            className="rounded-[2rem] border border-rose-300/30 bg-rose-400/10 p-10 text-center shadow-2xl backdrop-blur-xl"
          >
            <div className="text-7xl">
              🛰️
            </div>

            <h2 className="mt-5 text-2xl font-black text-rose-200">
              No pudimos cargar las promociones
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

        {/* TARJETAS */}

        {!cargando && !errorCarga && (
          <section className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3">
            {promocionesFiltradas.map(
              (promocion, indice) => {
                const disponible =
                  convertirABooleano(
                    promocion.Disponible,
                  );

                const destacada =
                  convertirABooleano(
                    promocion.Destacada,
                    false,
                  );

                const nombre =
                  promocion.NombreCurso ||
                  "Promoción educativa";

                const precioNormal =
                  mostrarPrecio(
                    promocion.PrecioNormal,
                  );

                const precioOferta =
                  mostrarPrecio(
                    promocion.PrecioOferta,
                  );

                const descuento =
                  obtenerDescuento(
                    promocion,
                  );

                return (
                  <article
                    key={`${nombre}-${indice}`}
                    className={`group relative flex h-full flex-col overflow-hidden rounded-[2rem] border bg-slate-900/80 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 ${
                      destacada
                        ? "border-yellow-300/50 ring-2 ring-yellow-300/10"
                        : "border-white/10 hover:border-pink-300/30"
                    }`}
                  >
                    <div className="absolute inset-x-0 top-0 h-2 bg-gradient-to-r from-yellow-300 via-pink-400 to-violet-500" />

                    {destacada && (
                      <span className="absolute left-8 top-8 z-20 rounded-full bg-yellow-300 px-3 py-1.5 text-xs font-black uppercase tracking-wide text-slate-950 shadow-xl">
                        ⭐ Destacada
                      </span>
                    )}

                    <div className="relative mb-5 mt-1 h-56 overflow-hidden rounded-2xl bg-slate-950">
                      <img
                        src={
                          promocion.ImagenUrl ||
                          IMAGEN_RESPALDO
                        }
                        alt={nombre}
                        loading="lazy"
                        className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                        onError={(evento) => {
                          evento.currentTarget.onerror =
                            null;

                          evento.currentTarget.src =
                            IMAGEN_RESPALDO;
                        }}
                      />

                      <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/10 to-transparent" />

                      <span className="absolute bottom-3 left-3 rounded-full bg-pink-300 px-3 py-1.5 text-xs font-black text-pink-950 shadow-xl">
                        ⚡ {descuento}
                      </span>

                      {promocion.Etiqueta && (
                        <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/80 px-3 py-1.5 text-xs font-black text-white backdrop-blur">
                          {promocion.Etiqueta}
                        </span>
                      )}
                    </div>

                    <div className="flex flex-1 flex-col">
                      {promocion.Categoria && (
                        <span className="mb-3 inline-flex w-fit rounded-full border border-violet-300/20 bg-violet-300/10 px-3 py-1 text-xs font-black uppercase tracking-wide text-violet-200">
                          🎁 {
                            promocion.Categoria
                          }
                        </span>
                      )}

                      <h2 className="text-xl font-black leading-tight text-white">
                        {nombre}
                      </h2>

                      <p className="mt-3 flex-1 text-sm leading-relaxed text-blue-100/65">
                        {promocion.Descripcion ||
                          "Aprovecha esta promoción especial y accede a nuevos recursos educativos."}
                      </p>

                      <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                        {precioNormal !==
                          "Consultar" && (
                          <p className="text-sm font-bold text-blue-100/45 line-through">
                            Antes:{" "}
                            {precioNormal}
                          </p>
                        )}

                        <div className="mt-1 flex flex-wrap items-end justify-between gap-2">
                          <div>
                            <p className="text-xs font-black uppercase tracking-wide text-pink-300">
                              Precio de oferta
                            </p>

                            <p className="text-2xl font-black text-yellow-300">
                              {precioOferta}
                            </p>
                          </div>

                          <span className="rounded-full bg-emerald-300/15 px-3 py-1 text-xs font-black text-emerald-200">
                            Ahorro especial
                          </span>
                        </div>
                      </div>

                      <div className="mt-5">
                        {!disponible ? (
                          <div className="flex w-full cursor-not-allowed items-center justify-center gap-2 rounded-full border border-rose-300/25 bg-rose-400/10 px-5 py-4 font-black text-rose-200">
                            🚫 Promoción no disponible
                          </div>
                        ) : (
                          <button
                            type="button"
                            onClick={() =>
                              comprarCurso(
                                promocion,
                              )
                            }
                            className="flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-r from-pink-400 via-rose-400 to-orange-400 px-5 py-4 font-black text-white shadow-xl shadow-pink-950/20 transition hover:-translate-y-1 hover:brightness-110"
                          >
                            Comprar con descuento
                            🛍️
                          </button>
                        )}
                      </div>
                    </div>
                  </article>
                );
              },
            )}

            {promocionesFiltradas.length ===
              0 && (
              <div className="col-span-full rounded-[2rem] border border-white/10 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl">
                <div className="text-7xl">
                  🛸
                </div>

                <h2 className="mt-5 text-2xl font-black text-pink-200">
                  No encontramos promociones
                </h2>

                <p className="mx-auto mt-3 max-w-lg text-blue-100/60">
                  Prueba con otra palabra o
                  selecciona una categoría
                  diferente.
                </p>

                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="mt-6 rounded-full bg-pink-300 px-6 py-3 font-black text-slate-950 transition hover:bg-pink-200"
                >
                  Ver todas las promociones
                </button>
              </div>
            )}
          </section>
        )}
      </div>
    </main>
  );
}