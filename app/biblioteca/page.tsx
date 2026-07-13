"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

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

type ModoAcceso =
  | "vip"
  | "prueba"
  | "sin-acceso";

/* =====================================================
   CATEGORÍAS
===================================================== */

const categorias: Categoria[] = [
  {
    id: "Todos",
    nombre: "Todos",
    emoji: "🌌",
    color:
      "bg-blue-100 text-blue-800 border-blue-300",
  },
  {
    id: "Juegos",
    nombre: "Juegos",
    emoji: "🎮",
    color:
      "bg-red-100 text-red-800 border-red-300",
  },
  {
    id: "Grafismo",
    nombre: "Grafismo",
    emoji: "✏️",
    color:
      "bg-green-100 text-green-800 border-green-300",
  },
  {
    id: "Fonetico",
    nombre: "Fonético",
    emoji: "🗣️",
    color:
      "bg-yellow-100 text-yellow-800 border-yellow-300",
  },
  {
    id: "Alfabeto",
    nombre: "Alfabeto y lenguaje",
    emoji: "🔤",
    color:
      "bg-purple-100 text-purple-800 border-purple-300",
  },
  {
    id: "TDAH",
    nombre: "TDAH",
    emoji: "🧠",
    color:
      "bg-pink-100 text-pink-800 border-pink-300",
  },
  {
    id: "Caligrafias",
    nombre: "Caligrafías",
    emoji: "✍️",
    color:
      "bg-indigo-100 text-indigo-800 border-indigo-300",
  },
  {
    id: "Cuentos",
    nombre: "Cuentos",
    emoji: "📖",
    color:
      "bg-teal-100 text-teal-800 border-teal-300",
  },
  {
    id: "Guias",
    nombre: "Guías para padres",
    emoji: "👨‍👩‍👧‍👦",
    color:
      "bg-orange-100 text-orange-800 border-orange-300",
  },
  {
    id: "BonoMaestro",
    nombre: "Bono Maestro",
    emoji: "🍎",
    color:
      "bg-lime-100 text-lime-800 border-lime-300",
  },
  {
    id: "BonoRegalo",
    nombre: "Bono de regalo",
    emoji: "🎁",
    color:
      "bg-rose-100 text-rose-800 border-rose-300",
  },
  {
    id: "Tesoro",
    nombre: "Tesoro bíblico",
    emoji: "🕊️",
    color:
      "bg-cyan-100 text-cyan-800 border-cyan-300",
  },
  {
    id: "Lettering",
    nombre: "Lettering",
    emoji: "🖋️",
    color:
      "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300",
  },
  {
    id: "MiniPack",
    nombre: "Mini pack adolescentes",
    emoji: "📱",
    color:
      "bg-emerald-100 text-emerald-800 border-emerald-300",
  },
  {
    id: "Preescritura",
    nombre: "Cuadernos preescritura",
    emoji: "📓",
    color:
      "bg-amber-100 text-amber-800 border-amber-300",
  },
  {
    id: "Pictogramas",
    nombre: "Pictogramas",
    emoji: "🖼️",
    color:
      "bg-violet-100 text-violet-800 border-violet-300",
  },
  {
    id: "Matematicas",
    nombre: "Matemáticas",
    emoji: "🔢",
    color:
      "bg-sky-100 text-sky-800 border-sky-300",
  },
  {
    id: "Montessori",
    nombre: "Método Montessori",
    emoji: "🧩",
    color:
      "bg-orange-200 text-orange-900 border-orange-400",
  },
  {
    id: "Motricidad",
    nombre: "Motricidad fina",
    emoji: "🖐️",
    color:
      "bg-pink-200 text-pink-900 border-pink-400",
  },
  {
    id: "Terapia",
    nombre: "Terapia de lenguaje",
    emoji: "👅",
    color:
      "bg-blue-200 text-blue-900 border-blue-400",
  },
];

/* =====================================================
   DEGRADADOS
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
   GOOGLE SHEETS DE MATERIALES
===================================================== */

const URL_MATERIALES =
  "https://script.google.com/macros/s/AKfycbxGShnNgOoBGB7hxUOUYWv3stdet9rSsDxLaSc04DcM3fIkNMSfLGdJbADzJ4TaaxiUsQ/exec";

/* =====================================================
   IMAGEN DE RESPALDO
===================================================== */

const IMAGEN_RESPALDO =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Crect width='100%25' height='100%25' fill='%230f172a'/%3E%3Ctext x='50%25' y='43%25' dominant-baseline='middle' text-anchor='middle' font-size='75'%3E📚%3C/text%3E%3Ctext x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='28' fill='%2367e8f9'%3EVista previa no disponible%3C/text%3E%3C/svg%3E";

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

function leerLocalStorage<T>(
  clave: string,
  valorInicial: T,
): T {
  try {
    const valorGuardado =
      localStorage.getItem(clave);

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
  const router = useRouter();

  const [modoAcceso, setModoAcceso] =
    useState<ModoAcceso>("sin-acceso");

  const [sesionLista, setSesionLista] =
    useState(false);

  const [busqueda, setBusqueda] =
    useState("");

  const [
    categoriaActiva,
    setCategoriaActiva,
  ] = useState("Todos");

  const [materiales, setMateriales] =
    useState<Material[]>([]);

  const [cargando, setCargando] =
    useState(true);

  const [errorCarga, setErrorCarga] =
    useState("");

  const [
    materialActivo,
    setMaterialActivo,
  ] = useState<Material | null>(null);

  const [nombre, setNombre] =
    useState("");

  const [
    nuevoComentario,
    setNuevoComentario,
  ] = useState("");

  const [comentarios, setComentarios] =
    useState<ComentariosPorMaterial>({});

  const [likes, setLikes] =
    useState<LikesPorMaterial>({});

  /* ===================================================
     COMPROBAR ACCESO VIP O PRUEBA
  =================================================== */

  useEffect(() => {
    const accesoVIP =
      localStorage.getItem("accesoVIP") ===
        "true" ||
      localStorage.getItem("modoAcceso") ===
        "vip";

    const modoGuardado =
      localStorage.getItem("modoAcceso");

    const limitePrueba = Number(
      localStorage.getItem("limitePrueba") ||
        "0",
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
      setSesionLista(true);
      return;
    }

    localStorage.removeItem("accesoVIP");
    localStorage.removeItem("modoAcceso");
    localStorage.removeItem("limitePrueba");

    router.replace(
      "/acceso?motivo=acceso-requerido",
    );
  }, [router]);

  /* ===================================================
     CARGAR MATERIALES
  =================================================== */

  useEffect(() => {
    if (!sesionLista) {
      return;
    }

    const obtenerMateriales = async () => {
      setCargando(true);
      setErrorCarga("");

      try {
        const respuesta = await fetch(
          URL_MATERIALES,
          {
            cache: "no-store",
          },
        );

        if (!respuesta.ok) {
          throw new Error(
            `Error de conexión: ${respuesta.status}`,
          );
        }

        const datos: unknown =
          await respuesta.json();

        if (!Array.isArray(datos)) {
          throw new Error(
            "Google Sheets no devolvió una lista de materiales.",
          );
        }

        const listaMateriales =
          datos as Material[];

        /*
        Durante la prueba eliminamos linkDrive
        antes de guardar los materiales en el estado.

        En el siguiente paso también lo ocultaremos
        desde el Apps Script de materiales.
        */

        const materialesProcesados =
          listaMateriales.map((material) => {
            if (modoAcceso === "prueba") {
              return {
                ...material,
                linkDrive: undefined,
              };
            }

            return material;
          });

        setMateriales(
          materialesProcesados,
        );
      } catch (error) {
        console.error(
          "Error al cargar materiales:",
          error,
        );

        setErrorCarga(
          "No pudimos cargar la biblioteca. Revisa la conexión e inténtalo nuevamente.",
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
  }, [sesionLista, modoAcceso]);

  /* ===================================================
     CERRAR MODAL CON ESCAPE
  =================================================== */

  useEffect(() => {
    if (!materialActivo) {
      return;
    }

    const cerrarConEscape = (
      evento: KeyboardEvent,
    ) => {
      if (evento.key === "Escape") {
        setMaterialActivo(null);
      }
    };

    const overflowAnterior =
      document.body.style.overflow;

    document.body.style.overflow =
      "hidden";

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

    const idMaterial = String(
      materialActivo.id,
    );

    const comentarioArmado: Comentario = {
      nombre: nombre.trim(),
      texto: nuevoComentario.trim(),
      fecha: new Date().toLocaleDateString(
        "es-ES",
      ),
    };

    const nuevosComentarios: ComentariosPorMaterial =
      {
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

    const idMaterial = String(
      materialActivo.id,
    );

    const nuevosLikes: LikesPorMaterial = {
      ...likes,
      [idMaterial]:
        !likes[idMaterial],
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

  const materialesFiltrados =
    useMemo(() => {
      const textoBuscado =
        normalizarTexto(busqueda);

      return materiales.filter(
        (item) => {
          const titulo =
            normalizarTexto(
              item.titulo,
            );

          const descripcion =
            normalizarTexto(
              item.desc,
            );

          const coincideBusqueda =
            titulo.includes(
              textoBuscado,
            ) ||
            descripcion.includes(
              textoBuscado,
            );

          const coincideCategoria =
            categoriaActiva ===
              "Todos" ||
            item.categoria ===
              categoriaActiva;

          return (
            coincideBusqueda &&
            coincideCategoria
          );
        },
      );
    }, [
      busqueda,
      categoriaActiva,
      materiales,
    ]);

  const limpiarFiltros = () => {
    setBusqueda("");
    setCategoriaActiva("Todos");
  };

  const comentariosActivos =
    materialActivo
      ? comentarios[
          String(materialActivo.id)
        ] || []
      : [];

  const materialTieneLike =
    materialActivo
      ? Boolean(
          likes[
            String(materialActivo.id)
          ],
        )
      : false;

  const esPrueba =
    modoAcceso === "prueba";

  /* ===================================================
     ESPERAR VALIDACIÓN DE SESIÓN
  =================================================== */

  if (!sesionLista) {
    return (
      <main className="flex min-h-screen items-center justify-center bg-slate-950 px-5 text-white">
        <div className="text-center">
          <div className="text-6xl">
            🚀
          </div>

          <h1 className="mt-5 text-2xl font-black">
            Verificando tu acceso...
          </h1>
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

      <div className="pointer-events-none absolute -left-40 top-20 h-[34rem] w-[34rem] rounded-full bg-blue-600/25 blur-3xl" />

      <div className="pointer-events-none absolute -right-40 top-10 h-[32rem] w-[32rem] rounded-full bg-fuchsia-600/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />

      <span className="pointer-events-none absolute left-[7%] top-36 hidden text-5xl opacity-70 lg:block">
        🚀
      </span>

      <span className="pointer-events-none absolute right-[8%] top-48 hidden text-6xl opacity-70 lg:block">
        🪐
      </span>

      <span className="pointer-events-none absolute left-[12%] top-[45%] hidden text-3xl opacity-50 lg:block">
        ⭐
      </span>

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ENCABEZADO */}

        <header className="mx-auto mb-10 max-w-4xl text-center">
          <span
            className={`mb-4 inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-black tracking-wide backdrop-blur ${
              esPrueba
                ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200"
                : "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
            }`}
          >
            {esPrueba
              ? "⏱️ MODO PRUEBA ACTIVO"
              : "💎 ACCESO VIP"}
          </span>

          <h1 className="bg-gradient-to-r from-cyan-300 via-violet-300 to-pink-300 bg-clip-text text-4xl font-black leading-tight text-transparent drop-shadow-lg md:text-6xl">
            Biblioteca Estelar
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-blue-100/75 md:text-lg">
            Encuentra materiales educativos,
            cuentos, juegos y actividades para
            acompañar cada etapa del aprendizaje.
          </p>

          {esPrueba && (
            <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center justify-between gap-4 rounded-2xl border border-yellow-300/25 bg-yellow-300/10 p-4 text-left sm:flex-row">
              <div className="flex items-start gap-3">
                <span className="text-2xl">
                  🔒
                </span>

                <div>
                  <p className="font-black text-yellow-200">
                    Estás explorando la biblioteca
                  </p>

                  <p className="mt-1 text-sm text-yellow-100/75">
                    Puedes ver los materiales, pero
                    descargar, imprimir y abrir archivos
                    externos requiere acceso VIP.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() =>
                  router.push(
                    "/acceso?motivo=activar-vip",
                  )
                }
                className="w-full shrink-0 rounded-full bg-yellow-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-200 sm:w-auto"
              >
                💎 Activar VIP
              </button>
            </div>
          )}
        </header>

        {/* BUSCADOR Y FILTROS */}

        <section
          aria-label="Buscador y filtros"
          className="mb-9"
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
                setBusqueda(
                  evento.target.value,
                )
              }
              className="w-full rounded-full border-2 border-white/15 bg-white/10 py-4 pl-14 pr-5 text-base font-medium text-white shadow-2xl outline-none backdrop-blur-xl transition placeholder:text-blue-200/40 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 md:text-lg"
              aria-label="Buscar materiales"
            />
          </div>

          <div className="flex gap-3 overflow-x-auto pb-4 md:flex-wrap md:justify-center md:overflow-visible">
            {categorias.map(
              (categoria) => {
                const estaActiva =
                  categoriaActiva ===
                  categoria.id;

                return (
                  <button
                    key={categoria.id}
                    type="button"
                    onClick={() =>
                      setCategoriaActiva(
                        categoria.id,
                      )
                    }
                    aria-pressed={
                      estaActiva
                    }
                    className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-2 px-5 py-3 font-bold shadow-lg transition duration-200 hover:-translate-y-0.5 ${
                      estaActiva
                        ? `${categoria.color} ring-2 ring-cyan-300 ring-offset-2 ring-offset-slate-950`
                        : "border-white/10 bg-white/10 text-blue-100 hover:border-white/25 hover:bg-white/15"
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
              },
            )}
          </div>

          <div className="mt-2 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-blue-100/70 shadow-xl backdrop-blur sm:flex-row">
            <p>
              Mostrando{" "}
              <strong className="text-cyan-300">
                {materialesFiltrados.length}
              </strong>{" "}
              de {materiales.length} materiales
            </p>

            {(busqueda ||
              categoriaActiva !==
                "Todos") && (
              <button
                type="button"
                onClick={limpiarFiltros}
                className="font-bold text-violet-300 underline decoration-violet-400 underline-offset-4 hover:text-violet-200"
              >
                Limpiar búsqueda y filtros
              </button>
            )}
          </div>
        </section>

        {/* CARGANDO */}

        {cargando && (
          <div
            className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl"
            role="status"
          >
            <div
              className="mb-4 inline-block animate-bounce text-6xl"
              aria-hidden="true"
            >
              🚀
            </div>

            <h2 className="text-2xl font-black text-cyan-200">
              Buscando materiales en el
              espacio...
            </h2>

            <p className="mt-2 text-blue-100/65">
              La biblioteca estará lista en un
              momento.
            </p>
          </div>
        )}

        {/* ERROR */}

        {!cargando && errorCarga && (
          <div
            className="mt-10 rounded-3xl border border-rose-300/30 bg-rose-400/10 p-8 text-center shadow-2xl backdrop-blur"
            role="alert"
          >
            <p className="mb-3 text-5xl">
              🛰️
            </p>

            <h2 className="text-2xl font-black text-rose-200">
              La conexión se perdió
            </h2>

            <p className="mx-auto mt-2 max-w-xl text-rose-100/75">
              {errorCarga}
            </p>

            <button
              type="button"
              onClick={() =>
                window.location.reload()
              }
              className="mt-5 rounded-full bg-rose-500 px-6 py-3 font-black text-white transition hover:bg-rose-400"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* TARJETAS */}

        {!cargando &&
          !errorCarga && (
            <section
              aria-label="Materiales educativos"
              className="grid grid-cols-1 gap-7 md:grid-cols-2 lg:grid-cols-3"
            >
              {materialesFiltrados.map(
                (item) => {
                  const categoriaInfo =
                    categorias.find(
                      (categoria) =>
                        categoria.id ===
                        item.categoria,
                    ) || categorias[0];

                  const gradiente =
                    gradientesCategoria[
                      item.categoria ||
                        "Todos"
                    ] ||
                    "from-blue-500 to-violet-500";

                  return (
                    <article
                      key={String(item.id)}
                      className="group relative flex min-h-full flex-col overflow-hidden rounded-[1.75rem] border border-white/10 bg-slate-900/75 p-5 shadow-2xl shadow-black/20 backdrop-blur-xl transition duration-300 hover:-translate-y-2 hover:border-white/20"
                    >
                      <div
                        className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${gradiente}`}
                      />

                      <button
                        type="button"
                        onClick={() =>
                          setMaterialActivo(
                            item,
                          )
                        }
                        className="relative mb-5 mt-1 block h-52 w-full overflow-hidden rounded-2xl bg-slate-950 text-left shadow-inner focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
                        aria-label={`Abrir ${
                          item.titulo ||
                          "material"
                        }`}
                      >
                        <img
                          src={
                            item.imagen ||
                            IMAGEN_RESPALDO
                          }
                          alt={
                            item.titulo ||
                            "Vista previa del material"
                          }
                          className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                          loading="lazy"
                          onError={(
                            evento,
                          ) => {
                            evento.currentTarget.onerror =
                              null;

                            evento.currentTarget.src =
                              IMAGEN_RESPALDO;
                          }}
                        />

                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950/60 via-transparent to-transparent" />

                        <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                          Ver material
                        </span>

                        {esPrueba && (
                          <span className="absolute left-3 top-3 rounded-full bg-yellow-300 px-3 py-1.5 text-xs font-black text-slate-950 shadow-lg">
                            🔒 Solo vista previa
                          </span>
                        )}
                      </button>

                      <div className="flex flex-1 flex-col">
                        <div
                          className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold ${categoriaInfo.color}`}
                        >
                          <span aria-hidden="true">
                            {
                              categoriaInfo.emoji
                            }
                          </span>

                          {
                            categoriaInfo.nombre
                          }
                        </div>

                        <h2 className="mb-2 text-xl font-black leading-tight text-white">
                          {item.titulo ||
                            "Material sin título"}
                        </h2>

                        <p className="mb-6 flex-1 text-sm leading-relaxed text-blue-100/65">
                          {item.desc ||
                            "Descubre este recurso educativo y revisa su contenido completo."}
                        </p>

                        <button
                          type="button"
                          onClick={() =>
                            setMaterialActivo(
                              item,
                            )
                          }
                          className={`w-full rounded-full bg-gradient-to-r ${gradiente} px-5 py-3 font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110`}
                        >
                          {esPrueba
                            ? "👀 Ver vista previa"
                            : "Explorar material →"}
                        </button>
                      </div>
                    </article>
                  );
                },
              )}

              {materialesFiltrados.length ===
                0 && (
                <div className="col-span-full mt-4 rounded-3xl border border-white/10 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl">
                  <p className="mb-4 text-6xl">
                    🛸
                  </p>

                  <h2 className="text-2xl font-black text-cyan-200">
                    No encontramos coincidencias
                  </h2>

                  <p className="mx-auto mt-2 max-w-lg text-blue-100/65">
                    Prueba con otra palabra o
                    selecciona una categoría
                    diferente.
                  </p>

                  <button
                    type="button"
                    onClick={limpiarFiltros}
                    className="mt-5 rounded-full bg-cyan-300 px-6 py-3 font-black text-slate-950 transition hover:bg-cyan-200"
                  >
                    Ver todos los materiales
                  </button>
                </div>
              )}
            </section>
          )}
      </div>

      {/* =================================================
          MODAL
      ================================================= */}

      {materialActivo && (
        <div
          className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto bg-slate-950/85 p-4 backdrop-blur-md sm:p-6"
          onMouseDown={(evento) => {
            if (
              evento.target ===
              evento.currentTarget
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
            className="relative my-8 w-full max-w-2xl overflow-hidden rounded-[2rem] border border-white/15 bg-slate-900 text-white shadow-2xl"
          >
            <header className="flex items-center justify-between gap-4 border-b border-white/10 bg-slate-950/50 p-4 sm:p-5">
              <h2
                id="titulo-material-activo"
                className="text-lg font-black text-white sm:text-xl"
              >
                {materialActivo.titulo ||
                  "Material educativo"}
              </h2>

              <button
                type="button"
                onClick={() =>
                  setMaterialActivo(null)
                }
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-white/10 text-3xl font-light text-blue-100 transition hover:bg-white/20 hover:text-white"
                aria-label="Cerrar ventana"
              >
                ×
              </button>
            </header>

            <div className="relative h-64 w-full bg-gradient-to-br from-slate-950 to-indigo-950 sm:h-80">
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

              {esPrueba && (
                <div className="pointer-events-none absolute inset-x-0 bottom-0 bg-gradient-to-t from-slate-950 via-slate-950/80 to-transparent px-5 pb-5 pt-16 text-center">
                  <span className="inline-flex rounded-full bg-yellow-300 px-4 py-2 text-xs font-black text-slate-950">
                    🔒 Vista previa — descarga
                    bloqueada
                  </span>
                </div>
              )}
            </div>

            <div className="p-5 sm:p-7">
              {materialActivo.desc && (
                <p className="mb-6 leading-relaxed text-blue-100/70">
                  {materialActivo.desc}
                </p>
              )}

              {/* ACCIONES VIP */}

              {!esPrueba && (
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
                    className="flex items-center justify-center gap-2 rounded-2xl bg-blue-500 px-3 py-3 font-bold text-white transition hover:bg-blue-400"
                  >
                    🔍 Ver en grande
                  </button>

                  <button
                    type="button"
                    onClick={() =>
                      window.print()
                    }
                    className="flex items-center justify-center gap-2 rounded-2xl border border-white/15 bg-white/10 px-3 py-3 font-bold text-blue-100 transition hover:bg-white/15"
                  >
                    🖨️ Imprimir
                  </button>

                  {materialActivo.linkDrive ? (
                    <a
                      href={
                        materialActivo.linkDrive
                      }
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 rounded-2xl bg-amber-400 px-3 py-3 font-black text-slate-950 transition hover:bg-amber-300"
                    >
                      ⬇️ Descargar
                    </a>
                  ) : (
                    <span className="flex cursor-not-allowed items-center justify-center gap-2 rounded-2xl bg-white/10 px-3 py-3 font-bold text-blue-100/40">
                      ⬇️ Sin descarga
                    </span>
                  )}

                  <button
                    type="button"
                    onClick={alternarLike}
                    className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 font-bold transition ${
                      materialTieneLike
                        ? "bg-pink-300 text-pink-950"
                        : "bg-pink-400/15 text-pink-200 hover:bg-pink-400/25"
                    }`}
                  >
                    {materialTieneLike
                      ? "❤️ Te encantó"
                      : "💛 Me encanta"}
                  </button>
                </div>
              )}

              {/* ACCIONES BLOQUEADAS EN PRUEBA */}

              {esPrueba && (
                <div className="mb-8 rounded-3xl border border-yellow-300/30 bg-yellow-300/10 p-5">
                  <div className="flex flex-col items-center gap-4 text-center sm:flex-row sm:text-left">
                    <span className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-3xl">
                      🔒
                    </span>

                    <div className="flex-1">
                      <h3 className="text-xl font-black text-yellow-200">
                        Funciones bloqueadas durante
                        la prueba
                      </h3>

                      <p className="mt-2 text-sm leading-relaxed text-yellow-100/70">
                        Descargar, imprimir y abrir
                        el archivo en una ventana
                        externa están disponibles
                        únicamente con acceso VIP.
                      </p>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() =>
                      router.push(
                        "/acceso?motivo=activar-vip",
                      )
                    }
                    className="mt-5 w-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-6 py-4 font-black text-slate-950 transition hover:-translate-y-1"
                  >
                    💎 Activar acceso VIP
                  </button>

                  <button
                    type="button"
                    onClick={alternarLike}
                    className={`mt-3 w-full rounded-full px-6 py-3 font-bold transition ${
                      materialTieneLike
                        ? "bg-pink-300 text-pink-950"
                        : "bg-white/10 text-pink-200 hover:bg-white/15"
                    }`}
                  >
                    {materialTieneLike
                      ? "❤️ Te encantó"
                      : "💛 Me encanta"}
                  </button>
                </div>
              )}

              {/* COMENTARIOS */}

              <section
                className="border-t border-white/10 pt-6"
                aria-labelledby="titulo-comentarios"
              >
                <h3
                  id="titulo-comentarios"
                  className="mb-1 flex items-center gap-2 text-lg font-black text-white"
                >
                  💬 Comentarios
                </h3>

                <p className="mb-4 text-sm text-blue-100/50">
                  Los comentarios se guardan
                  únicamente en este navegador.
                </p>

                <div className="mb-6 flex flex-col gap-3">
                  <input
                    type="text"
                    placeholder="Tu nombre"
                    value={nombre}
                    maxLength={50}
                    onChange={(evento) =>
                      setNombre(
                        evento.target.value,
                      )
                    }
                    className="w-full rounded-xl border border-white/10 bg-slate-950/50 p-4 text-white outline-none placeholder:text-blue-100/35 focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10"
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
                    className="w-full resize-none rounded-xl border border-white/10 bg-slate-950/50 p-4 text-white outline-none placeholder:text-blue-100/35 focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10"
                  />

                  <button
                    type="button"
                    onClick={
                      publicarComentario
                    }
                    disabled={
                      !nombre.trim() ||
                      !nuevoComentario.trim()
                    }
                    className="self-start rounded-full bg-pink-400 px-6 py-3 font-black text-slate-950 transition hover:bg-pink-300 disabled:cursor-not-allowed disabled:bg-white/10 disabled:text-white/30"
                  >
                    Publicar comentario 💛
                  </button>
                </div>

                <div className="space-y-4">
                  {comentariosActivos.map(
                    (
                      comentario,
                      indice,
                    ) => (
                      <article
                        key={`${comentario.fecha}-${indice}`}
                        className="rounded-xl border border-white/10 bg-white/5 p-4"
                      >
                        <div className="mb-1 flex flex-wrap items-baseline gap-2">
                          <strong className="text-cyan-200">
                            {
                              comentario.nombre
                            }
                          </strong>

                          <span className="text-xs text-blue-100/40">
                            {
                              comentario.fecha
                            }
                          </span>
                        </div>

                        <p className="break-words text-blue-100/70">
                          {
                            comentario.texto
                          }
                        </p>
                      </article>
                    ),
                  )}

                  {comentariosActivos.length ===
                    0 && (
                    <p className="text-sm italic text-blue-100/40">
                      Todavía no hay comentarios
                      guardados para este
                      material.
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