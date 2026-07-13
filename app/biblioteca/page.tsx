"use client";

import { useEffect, useMemo, useState } from "react";

/* =====================================================
   TIPOS DE DATOS
===================================================== */

type Categoria = {
  id: string;
  nombre: string;
  emoji: string;
  color: string;
};

type Material = {
  id: string | number;
  titulo?: string;
  categoria?: string;
  imagen?: string;
  desc?: string;
  linkDrive?: string;
};

type Comentario = {
  nombre: string;
  texto: string;
  fecha: string;
};

type ComentariosPorMaterial = Record<string, Comentario[]>;
type LikesPorMaterial = Record<string, boolean>;

/* =====================================================
   CATEGORÍAS
===================================================== */

const categorias: Categoria[] = [
  {
    id: "Todos",
    nombre: "Todos",
    emoji: "🌌",
    color: "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    id: "Juegos",
    nombre: "Juegos",
    emoji: "🎮",
    color: "bg-red-100 text-red-800 border-red-300",
  },
  {
    id: "Grafismo",
    nombre: "Grafismo",
    emoji: "✏️",
    color: "bg-green-100 text-green-800 border-green-300",
  },
  {
    id: "Fonetico",
    nombre: "Fonético",
    emoji: "🗣️",
    color: "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  {
    id: "Alfabeto",
    nombre: "Alfabeto y lenguaje",
    emoji: "🔤",
    color: "bg-purple-100 text-purple-800 border-purple-300",
  },
  {
    id: "TDAH",
    nombre: "TDAH",
    emoji: "🧠",
    color: "bg-pink-100 text-pink-800 border-pink-300",
  },
  {
    id: "Caligrafias",
    nombre: "Caligrafías",
    emoji: "✍️",
    color: "bg-indigo-100 text-indigo-800 border-indigo-300",
  },
  {
    id: "Cuentos",
    nombre: "Cuentos",
    emoji: "📖",
    color: "bg-teal-100 text-teal-800 border-teal-300",
  },
  {
    id: "Guias",
    nombre: "Guías para padres",
    emoji: "👨‍👩‍👧‍👦",
    color: "bg-orange-100 text-orange-800 border-orange-300",
  },
  {
    id: "BonoMaestro",
    nombre: "Bono Maestro",
    emoji: "🍎",
    color: "bg-lime-100 text-lime-800 border-lime-300",
  },
  {
    id: "BonoRegalo",
    nombre: "Bono de regalo",
    emoji: "🎁",
    color: "bg-rose-100 text-rose-800 border-rose-300",
  },
  {
    id: "Tesoro",
    nombre: "Tesoro bíblico",
    emoji: "🕊️",
    color: "bg-cyan-100 text-cyan-800 border-cyan-300",
  },
  {
    id: "Lettering",
    nombre: "Lettering",
    emoji: "🖋️",
    color: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
  },
  {
    id: "MiniPack",
    nombre: "Mini pack adolescentes",
    emoji: "📱",
    color: "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    id: "Preescritura",
    nombre: "Cuadernos preescritura",
    emoji: "📓",
    color: "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    id: "Pictogramas",
    nombre: "Pictogramas",
    emoji: "🖼️",
    color: "bg-violet-100 text-violet-800 border-violet-300",
  },
  {
    id: "Matematicas",
    nombre: "Matemáticas",
    emoji: "🔢",
    color: "bg-sky-100 text-sky-800 border-sky-300",
  },
  {
    id: "Montessori",
    nombre: "Método Montessori",
    emoji: "🧩",
    color: "bg-orange-200 text-orange-900 border-orange-400",
  },
  {
    id: "Motricidad",
    nombre: "Motricidad fina",
    emoji: "🖐️",
    color: "bg-pink-200 text-pink-900 border-pink-400",
  },
  {
    id: "Terapia",
    nombre: "Terapia de lenguaje",
    emoji: "👅",
    color: "bg-blue-200 text-blue-900 border-blue-400",
  },
];

/* =====================================================
   COLORES DE LAS TARJETAS
===================================================== */

const gradientesCategoria: Record<string, string> = {
  Todos: "from-blue-500 to-violet-500",
  Juegos: "from-rose-400 to-orange-400",
  Grafismo: "from-emerald-400 to-lime-400",
  Fonetico: "from-amber-400 to-yellow-300",
  Alfabeto: "from-violet-500 to-fuchsia-400",
  TDAH: "from-pink-400 to-rose-400",
  Caligrafias: "from-indigo-500 to-blue-400",
  Cuentos: "from-teal-400 to-cyan-400",
  Guias: "from-orange-400 to-amber-300",
  BonoMaestro: "from-lime-400 to-green-400",
  BonoRegalo: "from-rose-400 to-pink-400",
  Tesoro: "from-cyan-400 to-sky-400",
  Lettering: "from-fuchsia-500 to-purple-400",
  MiniPack: "from-emerald-500 to-teal-400",
  Preescritura: "from-amber-500 to-orange-400",
  Pictogramas: "from-violet-500 to-indigo-400",
  Matematicas: "from-sky-500 to-blue-400",
  Montessori: "from-orange-500 to-yellow-400",
  Motricidad: "from-pink-500 to-fuchsia-400",
  Terapia: "from-blue-500 to-cyan-400",
};

/* =====================================================
   ENLACE DE GOOGLE SHEETS
===================================================== */

const URL_MATERIALES =
  "https://script.google.com/macros/s/AKfycbxGShnNgOoBGB7hxUOUYWv3stdet9rSsDxLaSc04DcM3fIkNMSfLGdJbADzJ4TaaxiUsQ/exec";

/* =====================================================
   IMAGEN DE RESPALDO
===================================================== */

const IMAGEN_RESPALDO =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%23e0f2fe'/%3E%3Ctext x='50%25' y='44%25' dominant-baseline='middle' text-anchor='middle' font-size='75'%3E📚%3C/text%3E%3Ctext x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='28' fill='%231e3a8a'%3EVista previa no disponible%3C/text%3E%3C/svg%3E";

/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

function normalizarTexto(valor: unknown): string {
  return String(valor ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function leerLocalStorage<T>(clave: string, valorInicial: T): T {
  try {
    const valorGuardado = localStorage.getItem(clave);

    return valorGuardado
      ? (JSON.parse(valorGuardado) as T)
      : valorInicial;
  } catch {
    return valorInicial;
  }
}

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */

export default function Biblioteca() {
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");

  const [materiales, setMateriales] = useState<Material[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [materialActivo, setMaterialActivo] =
    useState<Material | null>(null);

  const [nombre, setNombre] = useState("");
  const [nuevoComentario, setNuevoComentario] = useState("");

  const [comentarios, setComentarios] =
    useState<ComentariosPorMaterial>({});

  const [likes, setLikes] =
    useState<LikesPorMaterial>({});

  /* ===================================================
     CARGAR MATERIALES
  =================================================== */

  useEffect(() => {
    const obtenerMateriales = async () => {
      setCargando(true);
      setErrorCarga("");

      try {
        const respuesta = await fetch(URL_MATERIALES, {
          cache: "no-store",
        });

        if (!respuesta.ok) {
          throw new Error(
            `Error de conexión: ${respuesta.status}`,
          );
        }

        const datos: unknown = await respuesta.json();

        if (!Array.isArray(datos)) {
          throw new Error(
            "Google Sheets no devolvió una lista de materiales.",
          );
        }

        setMateriales(datos as Material[]);
      } catch (error) {
        console.error(
          "Error al cargar los materiales:",
          error,
        );

        setErrorCarga(
          "No pudimos cargar la biblioteca. Revisa la conexión con Google Sheets e inténtalo nuevamente.",
        );
      } finally {
        setCargando(false);
      }
    };

    void obtenerMateriales();

    setComentarios(
      leerLocalStorage<ComentariosPorMaterial>(
        "comentariosMDI",
        {},
      ),
    );

    setLikes(
      leerLocalStorage<LikesPorMaterial>(
        "likesMDI",
        {},
      ),
    );
  }, []);

  /* ===================================================
     CERRAR MODAL CON ESCAPE
  =================================================== */

  useEffect(() => {
    if (!materialActivo) {
      return;
    }

    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setMaterialActivo(null);
      }
    };

    const overflowAnterior =
      document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener(
      "keydown",
      cerrarConEscape,
    );

    return () => {
      document.body.style.overflow =
        overflowAnterior;

      window.removeEventListener(
        "keydown",
        cerrarConEscape,
      );
    };
  }, [materialActivo]);

  /* ===================================================
     PUBLICAR COMENTARIO
  =================================================== */

  const publicarComentario = () => {
    if (
      !materialActivo ||
      !nombre.trim() ||
      !nuevoComentario.trim()
    ) {
      return;
    }

    const idMaterial = String(materialActivo.id);

    const comentarioArmado: Comentario = {
      nombre: nombre.trim(),
      texto: nuevoComentario.trim(),
      fecha: new Date().toLocaleDateString("es-ES"),
    };

    const nuevosComentarios: ComentariosPorMaterial = {
      ...comentarios,
      [idMaterial]: [
        ...(comentarios[idMaterial] || []),
        comentarioArmado,
      ],
    };

    setComentarios(nuevosComentarios);

    localStorage.setItem(
      "comentariosMDI",
      JSON.stringify(nuevosComentarios),
    );

    setNombre("");
    setNuevoComentario("");
  };

  /* ===================================================
     ME GUSTA
  =================================================== */

  const alternarLike = () => {
    if (!materialActivo) {
      return;
    }

    const idMaterial = String(materialActivo.id);

    const nuevosLikes: LikesPorMaterial = {
      ...likes,
      [idMaterial]: !likes[idMaterial],
    };

    setLikes(nuevosLikes);

    localStorage.setItem(
      "likesMDI",
      JSON.stringify(nuevosLikes),
    );
  };

  /* ===================================================
     FILTRAR MATERIALES
  =================================================== */

  const materialesFiltrados = useMemo(() => {
    const textoBuscado = normalizarTexto(busqueda);

    return materiales.filter((item) => {
      const titulo = normalizarTexto(item.titulo);
      const descripcion = normalizarTexto(item.desc);

      const coincideBusqueda =
        titulo.includes(textoBuscado) ||
        descripcion.includes(textoBuscado);

      const coincideCategoria =
        categoriaActiva === "Todos" ||
        item.categoria === categoriaActiva;

      return coincideBusqueda && coincideCategoria;
    });
  }, [busqueda, categoriaActiva, materiales]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaActiva("Todos");
  };

  const comentariosActivos = materialActivo
    ? comentarios[String(materialActivo.id)] || []
    : [];

  const materialTieneLike = materialActivo
    ? Boolean(likes[String(materialActivo.id)])
    : false;

  /* ===================================================
     PÁGINA
  =================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-sky-50 via-white to-violet-100 px-4 pb-20 pt-24 sm:px-6">
      {/* Decoración del fondo */}

      <div className="pointer-events-none absolute -left-24 top-32 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl" />

      <div className="pointer-events-none absolute -right-24 top-10 h-80 w-80 rounded-full bg-pink-200/40 blur-3xl" />

      <div className="pointer-events-none absolute bottom-10 left-1/3 h-80 w-80 rounded-full bg-cyan-200/30 blur-3xl" />

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* Encabezado */}

        <header className="mx-auto mb-9 max-w-3xl text-center">
          <span className="mb-4 inline-flex items-center gap-2 rounded-full border border-violet-200 bg-white/80 px-4 py-2 text-sm font-extrabold tracking-wide text-violet-700 shadow-sm backdrop-blur">
            ✨ APRENDER · JUGAR · CREAR
          </span>

          <h1 className="bg-gradient-to-r from-blue-700 via-violet-600 to-pink-500 bg-clip-text text-4xl font-black leading-tight text-transparent drop-shadow-sm md:text-6xl">
            Biblioteca Estelar
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-slate-600 md:text-lg">
            Encuentra materiales educativos, juegos,
            cuentos y actividades para acompañar cada
            etapa del aprendizaje.
          </p>
        </header>

        {/* Buscador y categorías */}

        <section
          aria-label="Buscador y filtros"
          className="mb-8"
        >
          <div className="relative mx-auto mb-6 max-w-2xl">
            <span
              className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-2xl"
              aria-hidden="true"
            >
              🔍
            </span>

            <input
              type="search"
              placeholder="¿Qué material estás buscando?"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(evento.target.value)
              }
              className="w-full rounded-full border-2 border-white bg-white/90 py-4 pl-14 pr-5 text-base text-slate-800 shadow-xl shadow-blue-900/5 outline-none backdrop-blur transition focus:border-blue-400 focus:ring-4 focus:ring-blue-100 md:text-lg"
              aria-label="Buscar materiales"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 md:flex-wrap md:justify-center md:overflow-visible">
            {categorias.map((categoria) => {
              const estaActiva =
                categoriaActiva === categoria.id;

              return (
                <button
                  key={categoria.id}
                  type="button"
                  onClick={() =>
                    setCategoriaActiva(categoria.id)
                  }
                  aria-pressed={estaActiva}
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-2 px-5 py-3 font-bold shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md ${
                    estaActiva
                      ? `${categoria.color} ring-2 ring-blue-400 ring-offset-2`
                      : "border-white bg-white/75 text-slate-600 hover:bg-white"
                  }`}
                >
                  <span
                    className="text-xl"
                    aria-hidden="true"
                  >
                    {categoria.emoji}
                  </span>

                  {categoria.nombre}
                </button>
              );
            })}
          </div>

          {/* Contador */}

          <div className="mt-2 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/80 bg-white/60 px-5 py-3 text-sm text-slate-600 shadow-sm backdrop-blur sm:flex-row">
            <p>
              Mostrando{" "}
              <strong className="text-blue-800">
                {materialesFiltrados.length}
              </strong>{" "}
              de {materiales.length} materiales
            </p>

            {(busqueda ||
              categoriaActiva !== "Todos") && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="font-bold text-violet-700 underline decoration-violet-300 underline-offset-4 hover:text-violet-900"
              >
                Limpiar búsqueda y filtros
              </button>
            )}
          </div>
        </section>

        {/* Estado de carga */}

        {cargando && (
          <div
            className="mt-10 rounded-3xl border border-white bg-white/70 p-12 text-center shadow-lg backdrop-blur"
            role="status"
          >
            <div
              className="mb-4 inline-block animate-bounce text-6xl"
              aria-hidden="true"
            >
              🚀
            </div>

            <h2 className="text-2xl font-black text-blue-900">
              Buscando materiales en el espacio...
            </h2>

            <p className="mt-2 text-slate-600">
              La biblioteca estará lista en un momento.
            </p>
          </div>
        )}

        {/* Error de conexión */}

        {!cargando && errorCarga && (
          <div
            className="mt-10 rounded-3xl border border-red-200 bg-red-50/90 p-8 text-center shadow-lg"
            role="alert"
          >
            <p
              className="mb-3 text-5xl"
              aria-hidden="true"
            >
              🛰️
            </p>

            <h2 className="text-2xl font-black text-red-800">
              La conexión se perdió
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-red-700">
              {errorCarga}
            </p>

            <button
              type="button"
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-red-600 px-6 py-3 font-bold text-white shadow-md transition hover:bg-red-700"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* Tarjetas */}

        {!cargando && !errorCarga && (
          <section
            aria-label="Materiales educativos"
            className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
          >
            {materialesFiltrados.map((item) => {
              const categoriaInfo =
                categorias.find(
                  (categoria) =>
                    categoria.id === item.categoria,
                ) || categorias[0];

              const gradiente =
                gradientesCategoria[
                  item.categoria || "Todos"
                ] ||
                "from-blue-500 to-violet-500";

              return (
                <article
                  key={String(item.id)}
                  className="group relative flex min-h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/90 bg-white/85 p-5 shadow-xl shadow-blue-900/5 backdrop-blur transition duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-violet-900/10"
                >
                  {/* Franja superior */}

                  <div
                    className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${gradiente}`}
                  />

                  {/* Imagen */}

                  <button
                    type="button"
                    onClick={() =>
                      setMaterialActivo(item)
                    }
                    className="relative mb-5 mt-1 block h-52 w-full overflow-hidden rounded-2xl bg-slate-100 text-left shadow-inner focus:outline-none focus:ring-4 focus:ring-blue-200"
                    aria-label={`Abrir ${
                      item.titulo || "material"
                    }`}
                  >
                    <img
                      src={
                        item.imagen || IMAGEN_RESPALDO
                      }
                      alt={
                        item.titulo ||
                        "Vista previa del material"
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(evento) => {
                        evento.currentTarget.onerror =
                          null;

                        evento.currentTarget.src =
                          IMAGEN_RESPALDO;
                      }}
                    />

                    <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/65 px-3 py-1.5 text-xs font-bold text-white opacity-0 backdrop-blur transition group-hover:opacity-100">
                      Ver material
                    </span>
                  </button>

                  {/* Información */}

                  <div className="flex flex-1 flex-col">
                    <div
                      className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold ${categoriaInfo.color}`}
                    >
                      <span aria-hidden="true">
                        {categoriaInfo.emoji}
                      </span>

                      {categoriaInfo.nombre}
                    </div>

                    <h2 className="mb-2 text-xl font-black leading-tight text-slate-800">
                      {item.titulo ||
                        "Material sin título"}
                    </h2>

                    <p className="mb-6 flex-1 text-sm leading-relaxed text-slate-600">
                      {item.desc ||
                        "Descubre este recurso educativo y revisa su contenido completo."}
                    </p>

                    <button
                      type="button"
                      onClick={() =>
                        setMaterialActivo(item)
                      }
                      className={`w-full rounded-full bg-gradient-to-r ${gradiente} px-5 py-3 font-extrabold text-white shadow-md transition hover:brightness-105 focus:outline-none focus:ring-4 focus:ring-blue-200`}
                    >
                      Explorar material{" "}
                      <span aria-hidden="true">
                        →
                      </span>
                    </button>
                  </div>
                </article>
              );
            })}

            {/* Sin resultados */}

            {materialesFiltrados.length === 0 && (
              <div className="col-span-full mt-4 rounded-3xl border border-white/80 bg-white/65 p-12 text-center shadow-lg backdrop-blur">
                <p
                  className="mb-4 text-6xl"
                  aria-hidden="true"
                >
                  🛸
                </p>

                <h2 className="text-2xl font-black text-blue-900">
                  No encontramos coincidencias
                </h2>

                <p className="mx-auto mt-2 max-w-lg text-blue-800">
                  Prueba con otra palabra o selecciona
                  una categoría diferente.
                </p>

                <button
                  type="button"
                  onClick={limpiarFiltros}
                  className="mt-5 rounded-full bg-blue-600 px-6 py-3 font-bold text-white shadow-md transition hover:bg-blue-700"
                >
                  Ver todos los materiales
                </button>
              </div>
            )}
          </section>
        )}
      </div>

      {/* =================================================
          MODAL DEL MATERIAL
      ================================================= */}

      {materialActivo && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/70 p-4 backdrop-blur-sm sm:p-6"
          onMouseDown={(evento) => {
            if (
              evento.target === evento.currentTarget
            ) {
              setMaterialActivo(null);
            }
          }}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-material-activo"
            className="relative my-8 w-full max-w-2xl overflow-hidden rounded-[2rem] bg-white shadow-2xl"
          >
            {/* Encabezado del modal */}

            <header className="flex items-center justify-between gap-4 border-b border-slate-100 p-4 sm:p-5">
              <h2
                id="titulo-material-activo"
                className="text-lg font-black text-slate-800 sm:text-xl"
              >
                {materialActivo.titulo ||
                  "Material educativo"}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setMaterialActivo(null)
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-3xl font-light text-slate-500 transition hover:bg-slate-200 hover:text-slate-900 focus:outline-none focus:ring-4 focus:ring-slate-200"
                aria-label="Cerrar ventana"
              >
                ×
              </button>
            </header>

            {/* Imagen grande */}

            <div className="h-64 w-full bg-gradient-to-br from-slate-900 to-blue-950 sm:h-80">
              <img
                src={
                  materialActivo.imagen ||
                  IMAGEN_RESPALDO
                }
                alt={
                  materialActivo.titulo ||
                  "Material"
                }
                className="h-full w-full object-contain"
                onError={(evento) => {
                  evento.currentTarget.onerror =
                    null;

                  evento.currentTarget.src =
                    IMAGEN_RESPALDO;
                }}
              />
            </div>

            <div className="p-5 sm:p-7">
              {materialActivo.desc && (
                <p className="mb-6 leading-relaxed text-slate-600">
                  {materialActivo.desc}
                </p>
              )}

              {/* Botones */}

              <div className="mb-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
                <button
                  type="button"
                  onClick={() =>
                    window.open(
                      materialActivo.imagen ||
                        IMAGEN_RESPALDO,
                      "_blank",
                      "noopener,noreferrer",
                    )
                  }
                  className="flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-3 py-3 font-bold text-white shadow-sm transition hover:bg-blue-700"
                >
                  🔍 Ver en grande
                </button>

                <button
                  type="button"
                  onClick={() => window.print()}
                  className="flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-3 font-bold text-slate-700 shadow-sm transition hover:bg-slate-100"
                >
                  🖨️ Imprimir
                </button>

                {materialActivo.linkDrive ? (
                  <a
                    href={materialActivo.linkDrive}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-3 py-3 font-bold text-slate-900 shadow-sm transition hover:bg-amber-500"
                  >
                    ⬇️ Descargar
                  </a>
                ) : (
                  <span className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-slate-200 px-3 py-3 font-bold text-slate-500">
                    ⬇️ Sin descarga
                  </span>
                )}

                <button
                  type="button"
                  onClick={alternarLike}
                  className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 font-bold shadow-sm transition ${
                    materialTieneLike
                      ? "bg-pink-200 text-pink-800 hover:bg-pink-300"
                      : "bg-pink-50 text-pink-700 hover:bg-pink-100"
                  }`}
                >
                  {materialTieneLike
                    ? "❤️ Te encantó"
                    : "💛 Me encanta"}
                </button>
              </div>

              {/* Comentarios */}

              <section
                className="border-t border-slate-100 pt-6"
                aria-labelledby="titulo-comentarios"
              >
                <h3
                  id="titulo-comentarios"
                  className="mb-1 flex items-center gap-2 text-lg font-black text-slate-800"
                >
                  💬 Comentarios
                </h3>

                <p className="mb-4 text-sm text-slate-500">
                  Por ahora, los comentarios se
                  guardan únicamente en este navegador.
                </p>

                {/* Formulario */}

                <div className="mb-6 flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    maxLength={50}
                    onChange={(evento) =>
                      setNombre(evento.target.value)
                    }
                    className="w-full rounded-xl border border-slate-200 p-4 outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />

                  <textarea
                    placeholder="Escribe tu comentario..."
                    value={nuevoComentario}
                    maxLength={500}
                    onChange={(evento) =>
                      setNuevoComentario(
                        evento.target.value,
                      )
                    }
                    rows={3}
                    className="w-full resize-none rounded-xl border border-slate-200 p-4 outline-none transition focus:border-pink-300 focus:ring-4 focus:ring-pink-100"
                  />

                  <button
                    type="button"
                    onClick={publicarComentario}
                    disabled={
                      !nombre.trim() ||
                      !nuevoComentario.trim()
                    }
                    className="self-start rounded-full bg-pink-500 px-6 py-3 font-bold text-white shadow-md transition hover:bg-pink-600 disabled:cursor-not-allowed disabled:bg-slate-300"
                  >
                    Publicar comentario 💛
                  </button>
                </div>

                {/* Comentarios guardados */}

                <div className="space-y-4">
                  {comentariosActivos.map(
                    (comentario, indice) => (
                      <article
                        key={`${comentario.fecha}-${indice}`}
                        className="rounded-xl border border-orange-100 bg-orange-50/70 p-4"
                      >
                        <div className="mb-1 flex flex-wrap items-baseline gap-2">
                          <strong className="text-slate-800">
                            {comentario.nombre}
                          </strong>

                          <span className="text-xs text-slate-400">
                            {comentario.fecha}
                          </span>
                        </div>

                        <p className="break-words text-slate-700">
                          {comentario.texto}
                        </p>
                      </article>
                    ),
                  )}

                  {comentariosActivos.length === 0 && (
                    <p className="text-sm italic text-slate-400">
                      Todavía no hay comentarios guardados
                      para este material.
                    </p>
                  )}
                </div>
              </section>
            </div>
          </section>
        </div>
      )}
    </main>
  );
}