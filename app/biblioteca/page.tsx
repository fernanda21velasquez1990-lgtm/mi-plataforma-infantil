"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";

/* =====================================================
   TIPOS
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

type ModoAcceso = "vip" | "prueba" | "sin-acceso";

type AvisoAccion =
  | {
      tipo: "exito" | "advertencia" | "error";
      texto: string;
    }
  | null;

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
   GOOGLE SHEETS
===================================================== */

const URL_MATERIALES =
  "https://script.google.com/macros/s/AKfycbxGShnNgOoBGB7hxUOUYWv3stdet9rSsDxLaSc04DcM3fIkNMSfLGdJbADzJ4TaaxiUsQ/exec";

/* =====================================================
   IMAGEN DE RESPALDO
===================================================== */

const IMAGEN_RESPALDO =
  "data:image/svg+xml;charset=UTF-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='800' height='500'%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0' x2='1'%3E%3Cstop stop-color='%230f172a'/%3E%3Cstop offset='1' stop-color='%23312e81'/%3E%3C/linearGradient%3E%3C/defs%3E%3Crect width='100%25' height='100%25' fill='url(%23g)'/%3E%3Ctext x='50%25' y='43%25' dominant-baseline='middle' text-anchor='middle' font-size='75'%3E📚%3C/text%3E%3Ctext x='50%25' y='65%25' dominant-baseline='middle' text-anchor='middle' font-family='Arial' font-size='28' fill='%2367e8f9'%3EVista previa no disponible%3C/text%3E%3C/svg%3E";

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

function escaparHTML(texto: string): string {
  return texto
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/*
Convierte enlaces comunes de Google Drive
en enlaces de descarga directa.

Si no reconoce el formato, mantiene
el enlace original.
*/

function convertirEnlaceDriveDescarga(enlaceOriginal: string): string {
  const enlace = enlaceOriginal.trim();

  if (!enlace) {
    return "";
  }

  try {
    const url = new URL(enlace);

    if (!url.hostname.includes("drive.google.com")) {
      return enlace;
    }

    const coincidenciaArchivo = url.pathname.match(
      /\/file\/d\/([^/]+)/,
    );

    if (coincidenciaArchivo?.[1]) {
      return `https://drive.google.com/uc?export=download&id=${coincidenciaArchivo[1]}`;
    }

    const idParametro = url.searchParams.get("id");

    if (idParametro) {
      return `https://drive.google.com/uc?export=download&id=${idParametro}`;
    }

    return enlace;
  } catch {
    return enlace;
  }
}

function abrirEnlace(enlace: string) {
  const elemento = document.createElement("a");

  elemento.href = enlace;
  elemento.target = "_blank";
  elemento.rel = "noopener noreferrer";

  document.body.appendChild(elemento);
  elemento.click();
  elemento.remove();
}

/* =====================================================
   COMPONENTE
===================================================== */

export default function Biblioteca() {
  const router = useRouter();

  const [modoAcceso, setModoAcceso] =
    useState<ModoAcceso>("sin-acceso");

  const [sesionLista, setSesionLista] = useState(false);

  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] =
    useState("Todos");

  const [materiales, setMateriales] = useState<Material[]>([]);
  const [cargando, setCargando] = useState(true);
  const [errorCarga, setErrorCarga] = useState("");

  const [materialActivo, setMaterialActivo] =
    useState<Material | null>(null);

  const [nombre, setNombre] = useState("");
  const [nuevoComentario, setNuevoComentario] = useState("");

  const [comentarios, setComentarios] =
    useState<ComentariosPorMaterial>({});

  const [likes, setLikes] = useState<LikesPorMaterial>({});

  const [avisoAccion, setAvisoAccion] =
    useState<AvisoAccion>(null);

  /* ===================================================
     VALIDAR ACCESO
  =================================================== */

  useEffect(() => {
    const accesoVIP =
      localStorage.getItem("accesoVIP") === "true" ||
      localStorage.getItem("modoAcceso") === "vip";

    const modoGuardado = localStorage.getItem("modoAcceso");

    const limitePrueba = Number(
      localStorage.getItem("limitePrueba") || "0",
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

    router.replace("/acceso?motivo=acceso-requerido");
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
        const parametros = new URLSearchParams({
          t: Date.now().toString(),
        });

        const respuesta = await fetch(
          `${URL_MATERIALES}?${parametros.toString()}`,
          {
            cache: "no-store",
          },
        );

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

        const listaMateriales = datos as Material[];

        /*
        En prueba se elimina el enlace Drive
        antes de guardar la información en React.
        */

        const materialesProcesados = listaMateriales.map(
          (material) => {
            if (modoAcceso === "prueba") {
              return {
                ...material,
                linkDrive: undefined,
              };
            }

            return material;
          },
        );

        setMateriales(materialesProcesados);
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
      leerLocalStorage<LikesPorMaterial>("likesMDI", {}),
    );

    setNombre(
      localStorage.getItem("nombreUsuario") || "",
    );
  }, [sesionLista, modoAcceso]);

  /* ===================================================
     CONTROL DEL MODAL
  =================================================== */

  useEffect(() => {
    if (!materialActivo) {
      return;
    }

    setAvisoAccion(null);

    const cerrarConEscape = (evento: KeyboardEvent) => {
      if (evento.key === "Escape") {
        setMaterialActivo(null);
      }
    };

    const overflowAnterior = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    window.addEventListener("keydown", cerrarConEscape);

    return () => {
      document.body.style.overflow = overflowAnterior;

      window.removeEventListener(
        "keydown",
        cerrarConEscape,
      );
    };
  }, [materialActivo]);

  /* ===================================================
     COMENTARIOS
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

    localStorage.setItem(
      "nombreUsuario",
      nombre.trim(),
    );

    setNuevoComentario("");

    setAvisoAccion({
      tipo: "exito",
      texto: "Tu opinión fue guardada correctamente.",
    });
  };

  /* ===================================================
     FAVORITOS
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

    setAvisoAccion({
      tipo: "exito",
      texto: nuevosLikes[idMaterial]
        ? "Material añadido a tus favoritos."
        : "Material eliminado de tus favoritos.",
    });
  };

  /* ===================================================
     VER PORTADA COMPLETA
  =================================================== */

  const abrirVistaGrande = () => {
    if (!materialActivo) {
      return;
    }

    abrirEnlace(
      materialActivo.imagen || IMAGEN_RESPALDO,
    );

    setAvisoAccion({
      tipo: "exito",
      texto: "La portada se abrió en una nueva pestaña.",
    });
  };

  /* ===================================================
     SOLICITAR ACCESO VIP
  =================================================== */

  const solicitarAccesoVIP = () => {
    setMaterialActivo(null);

    router.push("/acceso?motivo=activar-vip");
  };

  /* ===================================================
     IMPRIMIR MATERIAL
  =================================================== */

  const imprimirMaterial = () => {
    if (!materialActivo) {
      return;
    }

    if (modoAcceso === "prueba") {
      solicitarAccesoVIP();
      return;
    }

    const titulo =
      materialActivo.titulo || "Material educativo";

    const descripcion = materialActivo.desc || "";

    const imagen =
      materialActivo.imagen || IMAGEN_RESPALDO;

    const ventanaImpresion = window.open(
      "",
      "_blank",
      "width=1000,height=850",
    );

    if (!ventanaImpresion) {
      setAvisoAccion({
        tipo: "error",
        texto:
          "El navegador bloqueó la ventana de impresión. Permite las ventanas emergentes.",
      });

      return;
    }

    ventanaImpresion.opener = null;

    ventanaImpresion.document.write(`
      <!DOCTYPE html>
      <html lang="es">
        <head>
          <meta charset="UTF-8" />
          <meta
            name="viewport"
            content="width=device-width, initial-scale=1"
          />

          <title>
            ${escaparHTML(titulo)}
          </title>

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 35px;
              background: #ffffff;
              color: #0f172a;
              font-family: Arial, Helvetica, sans-serif;
            }

            .contenedor {
              max-width: 850px;
              margin: 0 auto;
              text-align: center;
            }

            .marca {
              display: inline-block;
              margin-bottom: 20px;
              padding: 10px 18px;
              border-radius: 999px;
              background: #e0f2fe;
              color: #075985;
              font-size: 12px;
              font-weight: 900;
              letter-spacing: 1.5px;
              text-transform: uppercase;
            }

            h1 {
              margin: 0 0 24px;
              font-size: 32px;
              line-height: 1.2;
            }

            img {
              display: block;
              width: 100%;
              max-height: 650px;
              margin: 0 auto;
              object-fit: contain;
              border: 1px solid #e2e8f0;
              border-radius: 20px;
            }

            p {
              margin: 25px auto 0;
              max-width: 720px;
              color: #475569;
              font-size: 16px;
              line-height: 1.7;
            }

            footer {
              margin-top: 30px;
              padding-top: 18px;
              border-top: 1px solid #e2e8f0;
              color: #64748b;
              font-size: 12px;
            }

            @media print {
              body {
                padding: 10px;
              }
            }
          </style>
        </head>

        <body>
          <main class="contenedor">
            <div class="marca">
              Mundo Digital Infantil
            </div>

            <h1>
              ${escaparHTML(titulo)}
            </h1>

            <img
              id="imagen-material"
              src="${escaparHTML(imagen)}"
              alt="${escaparHTML(titulo)}"
            />

            ${
              descripcion
                ? `<p>${escaparHTML(descripcion)}</p>`
                : ""
            }

            <footer>
              Biblioteca Estelar · Mundo Digital Infantil
            </footer>
          </main>

          <script>
            const imagen = document.getElementById(
              "imagen-material"
            );

            function imprimir() {
              setTimeout(function () {
                window.print();
              }, 300);
            }

            if (imagen.complete) {
              imprimir();
            } else {
              imagen.addEventListener(
                "load",
                imprimir
              );
            }
          </script>
        </body>
      </html>
    `);

    ventanaImpresion.document.close();

    setAvisoAccion({
      tipo: "exito",
      texto: "Se preparó la ficha para imprimir.",
    });
  };

  /* ===================================================
     DESCARGAR DESDE GOOGLE DRIVE
  =================================================== */

  const descargarDesdeDrive = () => {
    if (!materialActivo) {
      return;
    }

    if (modoAcceso === "prueba") {
      solicitarAccesoVIP();
      return;
    }

    const enlaceOriginal = String(
      materialActivo.linkDrive || "",
    ).trim();

    if (!enlaceOriginal) {
      setAvisoAccion({
        tipo: "advertencia",
        texto:
          "Este material todavía no tiene un enlace de Google Drive disponible.",
      });

      return;
    }

    const enlaceDescarga =
      convertirEnlaceDriveDescarga(enlaceOriginal);

    abrirEnlace(enlaceDescarga);

    setAvisoAccion({
      tipo: "exito",
      texto:
        "La descarga se abrió desde Google Drive.",
    });
  };

  /* ===================================================
     COPIAR ENLACE DRIVE
  =================================================== */

  const copiarEnlaceDrive = async () => {
    if (!materialActivo) {
      return;
    }

    if (modoAcceso === "prueba") {
      solicitarAccesoVIP();
      return;
    }

    const enlaceDrive = String(
      materialActivo.linkDrive || "",
    ).trim();

    if (!enlaceDrive) {
      setAvisoAccion({
        tipo: "advertencia",
        texto:
          "Este material no tiene un enlace disponible para copiar.",
      });

      return;
    }

    try {
      if (
        navigator.clipboard &&
        window.isSecureContext
      ) {
        await navigator.clipboard.writeText(
          enlaceDrive,
        );
      } else {
        const textarea =
          document.createElement("textarea");

        textarea.value = enlaceDrive;
        textarea.style.position = "fixed";
        textarea.style.opacity = "0";

        document.body.appendChild(textarea);

        textarea.focus();
        textarea.select();

        document.execCommand("copy");

        textarea.remove();
      }

      setAvisoAccion({
        tipo: "exito",
        texto:
          "Enlace de Google Drive copiado.",
      });
    } catch {
      setAvisoAccion({
        tipo: "error",
        texto:
          "No pudimos copiar el enlace.",
      });
    }
  };

  /* ===================================================
     FILTRAR
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

  const categoriaMaterialActivo = materialActivo
    ? categorias.find(
        (categoria) =>
          categoria.id === materialActivo.categoria,
      ) || categorias[0]
    : categorias[0];

  const esPrueba = modoAcceso === "prueba";

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

          <h1 className="mt-5 text-2xl font-black">
            Verificando tu acceso...
          </h1>

          <p className="mt-2 text-blue-100/50">
            Preparando la Biblioteca Estelar.
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
      {/* FONDO */}

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
            Materiales educativos, cuentos, juegos y
            actividades para aprender, crear y descubrir.
          </p>

          {esPrueba && (
            <div className="mx-auto mt-6 flex max-w-2xl flex-col items-center justify-between gap-4 rounded-3xl border border-yellow-300/25 bg-yellow-300/10 p-5 text-left backdrop-blur sm:flex-row">
              <div className="flex items-start gap-3">
                <span className="text-3xl">
                  🔒
                </span>

                <div>
                  <p className="font-black text-yellow-200">
                    Estás explorando la biblioteca
                  </p>

                  <p className="mt-1 text-sm text-yellow-100/70">
                    Puedes revisar las portadas, pero las
                    descargas e impresiones requieren acceso
                    VIP.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={solicitarAccesoVIP}
                className="w-full shrink-0 rounded-full bg-yellow-300 px-5 py-3 text-sm font-black text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-200 sm:w-auto"
              >
                💎 Activar VIP
              </button>
            </div>
          )}
        </header>

        {/* BUSCADOR */}

        <section
          aria-label="Buscador y filtros"
          className="mb-9"
        >
          <div className="relative mx-auto mb-6 max-w-2xl">
            <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-5 text-2xl">
              🔍
            </span>

            <input
              type="search"
              placeholder="¿Qué material estás buscando?"
              value={busqueda}
              onChange={(evento) =>
                setBusqueda(evento.target.value)
              }
              className="w-full rounded-full border-2 border-white/15 bg-white/10 py-4 pl-14 pr-5 text-base font-medium text-white shadow-2xl outline-none backdrop-blur-xl transition placeholder:text-blue-200/40 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10 md:text-lg"
              aria-label="Buscar materiales"
            />
          </div>

          {/* CATEGORÍAS */}

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
                  className={`flex shrink-0 items-center gap-2 whitespace-nowrap rounded-full border-2 px-5 py-3 font-bold shadow-lg transition duration-200 hover:-translate-y-0.5 ${
                    estaActiva
                      ? `${categoria.color} ring-2 ring-cyan-300 ring-offset-2 ring-offset-slate-950`
                      : "border-white/10 bg-white/10 text-blue-100 hover:border-white/25 hover:bg-white/15"
                  }`}
                >
                  <span className="text-xl">
                    {categoria.emoji}
                  </span>

                  {categoria.nombre}
                </button>
              );
            })}
          </div>

          <div className="mt-2 flex flex-col items-center justify-between gap-3 rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-sm text-blue-100/70 shadow-xl backdrop-blur sm:flex-row">
            <p>
              Mostrando{" "}
              <strong className="text-cyan-300">
                {materialesFiltrados.length}
              </strong>{" "}
              de {materiales.length} materiales
            </p>

            {(busqueda || categoriaActiva !== "Todos") && (
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
            role="status"
            className="mt-10 rounded-3xl border border-white/10 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl"
          >
            <div className="mb-4 inline-block animate-bounce text-6xl">
              🚀
            </div>

            <h2 className="text-2xl font-black text-cyan-200">
              Buscando materiales en el espacio...
            </h2>

            <p className="mt-2 text-blue-100/65">
              La biblioteca estará lista en un momento.
            </p>
          </div>
        )}

        {/* ERROR */}

        {!cargando && errorCarga && (
          <div
            role="alert"
            className="mt-10 rounded-3xl border border-rose-300/30 bg-rose-400/10 p-8 text-center shadow-2xl backdrop-blur"
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
              onClick={() => window.location.reload()}
              className="mt-5 rounded-full bg-rose-500 px-6 py-3 font-black text-white transition hover:bg-rose-400"
            >
              Intentar nuevamente
            </button>
          </div>
        )}

        {/* MATERIALES */}

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
                ] || "from-blue-500 to-violet-500";

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
                    onClick={() => setMaterialActivo(item)}
                    className="relative mb-5 mt-1 block h-52 w-full overflow-hidden rounded-2xl bg-slate-950 text-left shadow-inner focus:outline-none focus:ring-4 focus:ring-cyan-300/20"
                    aria-label={`Abrir ${
                      item.titulo || "material"
                    }`}
                  >
                    <img
                      src={item.imagen || IMAGEN_RESPALDO}
                      alt={
                        item.titulo ||
                        "Vista previa del material"
                      }
                      className="h-full w-full object-cover transition duration-500 group-hover:scale-105"
                      loading="lazy"
                      onError={(evento) => {
                        evento.currentTarget.onerror = null;
                        evento.currentTarget.src =
                          IMAGEN_RESPALDO;
                      }}
                    />

                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-transparent" />

                    <span className="absolute bottom-3 right-3 rounded-full bg-slate-950/75 px-3 py-1.5 text-xs font-bold text-white backdrop-blur">
                      Abrir experiencia
                    </span>

                    {esPrueba && (
                      <span className="absolute left-3 top-3 rounded-full bg-yellow-300 px-3 py-1.5 text-xs font-black text-slate-950 shadow-lg">
                        🔒 Vista previa
                      </span>
                    )}
                  </button>

                  <div className="flex flex-1 flex-col">
                    <div
                      className={`mb-3 inline-flex w-fit items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-extrabold ${categoriaInfo.color}`}
                    >
                      <span>{categoriaInfo.emoji}</span>
                      {categoriaInfo.nombre}
                    </div>

                    <h2 className="mb-2 text-xl font-black leading-tight text-white">
                      {item.titulo || "Material sin título"}
                    </h2>

                    <p className="mb-6 flex-1 text-sm leading-relaxed text-blue-100/65">
                      {item.desc ||
                        "Descubre este recurso educativo y revisa su contenido completo."}
                    </p>

                    <button
                      type="button"
                      onClick={() => setMaterialActivo(item)}
                      className={`w-full rounded-full bg-gradient-to-r ${gradiente} px-5 py-3 font-extrabold text-white shadow-lg transition hover:-translate-y-0.5 hover:brightness-110`}
                    >
                      {esPrueba
                        ? "👀 Explorar vista previa"
                        : "🚀 Abrir material"}
                    </button>
                  </div>
                </article>
              );
            })}

            {materialesFiltrados.length === 0 && (
              <div className="col-span-full mt-4 rounded-3xl border border-white/10 bg-white/10 p-12 text-center shadow-2xl backdrop-blur-xl">
                <p className="mb-4 text-6xl">
                  🛸
                </p>

                <h2 className="text-2xl font-black text-cyan-200">
                  No encontramos coincidencias
                </h2>

                <p className="mx-auto mt-2 max-w-lg text-blue-100/65">
                  Prueba con otra palabra o selecciona una
                  categoría diferente.
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
          EXPERIENCIA PREMIUM DEL MATERIAL
      ================================================= */}

      {materialActivo && (
        <div
          className="fixed inset-0 z-[10000] flex items-start justify-center overflow-y-auto bg-slate-950/90 p-3 backdrop-blur-xl sm:p-6"
          onMouseDown={(evento) => {
            if (evento.target === evento.currentTarget) {
              setMaterialActivo(null);
            }
          }}
          role="presentation"
        >
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="titulo-material-activo"
            className="relative my-4 w-full max-w-6xl overflow-hidden rounded-[2rem] border border-white/15 bg-gradient-to-br from-slate-950 via-indigo-950 to-slate-950 text-white shadow-2xl sm:my-8 sm:rounded-[2.75rem]"
          >
            {/* LUCES */}

            <div className="pointer-events-none absolute -left-32 top-0 h-80 w-80 rounded-full bg-blue-600/20 blur-3xl" />

            <div className="pointer-events-none absolute -right-32 bottom-0 h-80 w-80 rounded-full bg-fuchsia-600/20 blur-3xl" />

            {/* BARRA SUPERIOR */}

            <header className="relative z-10 flex items-center justify-between gap-4 border-b border-white/10 bg-slate-950/60 px-5 py-4 backdrop-blur-xl sm:px-7">
              <div className="flex min-w-0 items-center gap-3">
                <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-400 text-2xl shadow-xl">
                  {categoriaMaterialActivo.emoji}
                </span>

                <div className="min-w-0">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-cyan-300">
                    Biblioteca Estelar
                  </p>

                  <h2
                    id="titulo-material-activo"
                    className="truncate text-lg font-black text-white sm:text-xl"
                  >
                    {materialActivo.titulo ||
                      "Material educativo"}
                  </h2>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setMaterialActivo(null)}
                aria-label="Cerrar material"
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-white/5 text-3xl font-light text-blue-100 transition hover:rotate-90 hover:border-rose-300/30 hover:bg-rose-400/15 hover:text-rose-200"
              >
                ×
              </button>
            </header>

            {/* CUERPO */}

            <div className="relative z-10 grid lg:grid-cols-[1.05fr_0.95fr]">
              {/* PORTADA */}

              <div className="relative flex min-h-[360px] items-center justify-center overflow-hidden border-b border-white/10 bg-slate-950/70 p-5 lg:min-h-[620px] lg:border-b-0 lg:border-r">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(99,102,241,0.24),transparent_68%)]" />

                <div className="relative w-full">
                  <img
                    src={
                      materialActivo.imagen ||
                      IMAGEN_RESPALDO
                    }
                    alt={
                      materialActivo.titulo ||
                      "Portada del material"
                    }
                    className="mx-auto max-h-[570px] w-full rounded-[1.75rem] object-contain shadow-2xl shadow-black/50"
                    onError={(evento) => {
                      evento.currentTarget.onerror = null;

                      evento.currentTarget.src =
                        IMAGEN_RESPALDO;
                    }}
                  />

                  <div className="absolute left-3 top-3">
                    <span
                      className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black shadow-xl backdrop-blur ${
                        esPrueba
                          ? "border-yellow-300/30 bg-yellow-300/90 text-yellow-950"
                          : "border-emerald-300/30 bg-emerald-300/90 text-emerald-950"
                      }`}
                    >
                      {esPrueba
                        ? "🔒 Modo exploración"
                        : "💎 Descarga habilitada"}
                    </span>
                  </div>
                </div>
              </div>

              {/* INFORMACIÓN */}

              <div className="flex flex-col p-5 sm:p-7 lg:p-8">
                <div>
                  <span
                    className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-xs font-black uppercase tracking-wide ${categoriaMaterialActivo.color}`}
                  >
                    {categoriaMaterialActivo.emoji}
                    {categoriaMaterialActivo.nombre}
                  </span>

                  <h3 className="mt-5 text-3xl font-black leading-tight text-white">
                    {materialActivo.titulo ||
                      "Material educativo"}
                  </h3>

                  <p className="mt-4 leading-relaxed text-blue-100/70">
                    {materialActivo.desc ||
                      "Explora este recurso educativo, descubre sus actividades y fortalece el aprendizaje de una forma creativa."}
                  </p>
                </div>

                {/* BENEFICIOS */}

                <div className="mt-6 grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-cyan-300/15 bg-cyan-300/10 p-4">
                    <span className="text-2xl">
                      🎨
                    </span>

                    <p className="mt-2 text-xs font-black uppercase tracking-wide text-cyan-200">
                      Recurso visual
                    </p>
                  </div>

                  <div className="rounded-2xl border border-pink-300/15 bg-pink-300/10 p-4">
                    <span className="text-2xl">
                      🧠
                    </span>

                    <p className="mt-2 text-xs font-black uppercase tracking-wide text-pink-200">
                      Aprendizaje creativo
                    </p>
                  </div>
                </div>

                {/* ACCIONES */}

                <div className="mt-7 grid grid-cols-1 gap-3 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={abrirVistaGrande}
                    className="group flex items-center justify-center gap-3 rounded-2xl bg-gradient-to-r from-blue-500 to-cyan-400 px-4 py-4 font-black text-white shadow-xl transition hover:-translate-y-1 hover:brightness-110"
                  >
                    <span className="text-xl transition group-hover:scale-110">
                      🔍
                    </span>

                    Ver portada completa
                  </button>

                  <button
                    type="button"
                    onClick={imprimirMaterial}
                    className={`group flex items-center justify-center gap-3 rounded-2xl border px-4 py-4 font-black shadow-xl transition hover:-translate-y-1 ${
                      esPrueba
                        ? "border-yellow-300/20 bg-yellow-300/10 text-yellow-200"
                        : "border-white/15 bg-white/10 text-blue-100 hover:bg-white/15"
                    }`}
                  >
                    <span className="text-xl">
                      {esPrueba ? "🔒" : "🖨️"}
                    </span>

                    {esPrueba
                      ? "Desbloquear impresión"
                      : "Imprimir ficha"}
                  </button>

                  <button
                    type="button"
                    onClick={descargarDesdeDrive}
                    disabled={
                      !esPrueba &&
                      !materialActivo.linkDrive
                    }
                    className={`group flex items-center justify-center gap-3 rounded-2xl px-4 py-4 font-black shadow-xl transition ${
                      esPrueba
                        ? "border border-yellow-300/25 bg-yellow-300/10 text-yellow-200 hover:-translate-y-1 hover:bg-yellow-300/15"
                        : materialActivo.linkDrive
                          ? "bg-gradient-to-r from-yellow-300 via-amber-400 to-orange-400 text-slate-950 hover:-translate-y-1 hover:brightness-110"
                          : "cursor-not-allowed border border-white/10 bg-white/5 text-blue-100/30"
                    }`}
                  >
                    <span className="text-xl transition group-hover:scale-110">
                      {esPrueba ? "🔒" : "⬇️"}
                    </span>

                    {esPrueba
                      ? "Desbloquear descarga"
                      : materialActivo.linkDrive
                        ? "Descargar desde Drive"
                        : "Sin enlace disponible"}
                  </button>

                  <button
                    type="button"
                    onClick={alternarLike}
                    className={`group flex items-center justify-center gap-3 rounded-2xl border px-4 py-4 font-black shadow-xl transition hover:-translate-y-1 ${
                      materialTieneLike
                        ? "border-pink-300/40 bg-gradient-to-r from-pink-300 to-fuchsia-300 text-pink-950"
                        : "border-pink-300/20 bg-pink-300/10 text-pink-200 hover:bg-pink-300/15"
                    }`}
                  >
                    <span className="text-xl transition group-hover:scale-125">
                      {materialTieneLike
                        ? "❤️"
                        : "🤍"}
                    </span>

                    {materialTieneLike
                      ? "Añadido a favoritos"
                      : "Me encanta"}
                  </button>

                  {!esPrueba &&
                    materialActivo.linkDrive && (
                      <button
                        type="button"
                        onClick={() =>
                          void copiarEnlaceDrive()
                        }
                        className="flex items-center justify-center gap-3 rounded-2xl border border-violet-300/20 bg-violet-300/10 px-4 py-4 font-black text-violet-200 shadow-xl transition hover:-translate-y-1 hover:bg-violet-300/15 sm:col-span-2"
                      >
                        🔗 Copiar enlace de Google Drive
                      </button>
                    )}
                </div>

                {/* MENSAJE DE ACCIÓN */}

                {avisoAccion && (
                  <div
                    role="status"
                    aria-live="polite"
                    className={`mt-5 rounded-2xl border p-4 text-sm font-bold ${
                      avisoAccion.tipo === "exito"
                        ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                        : avisoAccion.tipo ===
                            "advertencia"
                          ? "border-yellow-300/30 bg-yellow-300/10 text-yellow-200"
                          : "border-rose-300/30 bg-rose-300/10 text-rose-200"
                    }`}
                  >
                    {avisoAccion.tipo === "exito"
                      ? "✅ "
                      : avisoAccion.tipo ===
                          "advertencia"
                        ? "⚠️ "
                        : "❌ "}

                    {avisoAccion.texto}
                  </div>
                )}

                {/* AVISO PRUEBA */}

                {esPrueba && (
                  <div className="mt-5 rounded-3xl border border-yellow-300/25 bg-gradient-to-r from-yellow-300/10 to-orange-300/10 p-5">
                    <div className="flex items-start gap-4">
                      <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-2xl text-yellow-950">
                        💎
                      </span>

                      <div>
                        <h4 className="font-black text-yellow-200">
                          Descarga reservada para clientes VIP
                        </h4>

                        <p className="mt-2 text-sm leading-relaxed text-yellow-100/65">
                          Puedes explorar la portada durante
                          la prueba. Activa el acceso VIP para
                          imprimir y descargar el archivo
                          completo desde Google Drive.
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={solicitarAccesoVIP}
                      className="mt-5 w-full rounded-2xl bg-gradient-to-r from-yellow-300 to-orange-400 px-5 py-4 font-black text-slate-950 transition hover:-translate-y-1"
                    >
                      💎 Activar acceso VIP
                    </button>
                  </div>
                )}

                {!esPrueba &&
                  materialActivo.linkDrive && (
                    <div className="mt-5 flex items-center gap-3 rounded-2xl border border-emerald-300/15 bg-emerald-300/10 p-4 text-sm text-emerald-100/70">
                      <span className="text-2xl">
                        🛡️
                      </span>

                      <p>
                        El botón abre el archivo asociado
                        directamente desde Google Drive.
                      </p>
                    </div>
                  )}
              </div>
            </div>

            {/* COMENTARIOS */}

            <section
              className="relative z-10 border-t border-white/10 bg-slate-950/45 p-5 sm:p-7 lg:p-8"
              aria-labelledby="titulo-comentarios"
            >
              <div className="grid gap-7 lg:grid-cols-[0.85fr_1.15fr]">
                <div>
                  <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-pink-300 to-violet-400 text-3xl shadow-xl">
                    💬
                  </span>

                  <h3
                    id="titulo-comentarios"
                    className="mt-4 text-2xl font-black text-white"
                  >
                    Bitácora de opiniones
                  </h3>

                  <p className="mt-3 text-sm leading-relaxed text-blue-100/55">
                    Comparte tu experiencia con este
                    recurso. Los comentarios se guardan en
                    el navegador que estás utilizando.
                  </p>

                  <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-4">
                    <p className="text-2xl font-black text-cyan-200">
                      {comentariosActivos.length}
                    </p>

                    <p className="mt-1 text-xs uppercase tracking-wide text-blue-100/40">
                      Opiniones guardadas
                    </p>
                  </div>
                </div>

                <div>
                  <div className="grid gap-3">
                    <input
                      type="text"
                      placeholder="Escribe tu nombre"
                      value={nombre}
                      maxLength={50}
                      onChange={(evento) =>
                        setNombre(evento.target.value)
                      }
                      className="w-full rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-white outline-none placeholder:text-blue-100/30 focus:border-cyan-300 focus:ring-4 focus:ring-cyan-300/10"
                    />

                    <textarea
                      placeholder="¿Qué te pareció este material?"
                      value={nuevoComentario}
                      maxLength={500}
                      onChange={(evento) =>
                        setNuevoComentario(
                          evento.target.value,
                        )
                      }
                      rows={4}
                      className="w-full resize-none rounded-2xl border border-white/10 bg-slate-950/70 p-4 text-white outline-none placeholder:text-blue-100/30 focus:border-pink-300 focus:ring-4 focus:ring-pink-300/10"
                    />

                    <div className="flex flex-col items-stretch justify-between gap-3 sm:flex-row sm:items-center">
                      <p className="text-xs text-blue-100/35">
                        {nuevoComentario.length}/500
                        caracteres
                      </p>

                      <button
                        type="button"
                        onClick={publicarComentario}
                        disabled={
                          !nombre.trim() ||
                          !nuevoComentario.trim()
                        }
                        className="rounded-full bg-gradient-to-r from-pink-400 to-violet-500 px-6 py-3 font-black text-white shadow-xl transition hover:-translate-y-1 hover:brightness-110 disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-35"
                      >
                        Publicar opinión 🚀
                      </button>
                    </div>
                  </div>

                  {/* OPINIONES */}

                  <div className="mt-6 space-y-3">
                    {comentariosActivos.map(
                      (comentario, indice) => (
                        <article
                          key={`${comentario.fecha}-${indice}`}
                          className="rounded-2xl border border-white/10 bg-white/5 p-4"
                        >
                          <div className="flex items-center gap-3">
                            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-cyan-300 to-violet-300 font-black text-slate-950">
                              {comentario.nombre
                                .charAt(0)
                                .toUpperCase()}
                            </span>

                            <div>
                              <strong className="text-white">
                                {comentario.nombre}
                              </strong>

                              <p className="text-xs text-blue-100/35">
                                {comentario.fecha}
                              </p>
                            </div>
                          </div>

                          <p className="mt-3 break-words leading-relaxed text-blue-100/70">
                            {comentario.texto}
                          </p>
                        </article>
                      ),
                    )}

                    {comentariosActivos.length === 0 && (
                      <div className="rounded-2xl border border-dashed border-white/10 bg-white/[0.03] p-6 text-center">
                        <span className="text-4xl">
                          🌟
                        </span>

                        <p className="mt-3 text-sm text-blue-100/45">
                          Todavía no hay opiniones. Sé la
                          primera persona en comentar este
                          material.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </section>
          </section>
        </div>
      )}
    </main>
  );
}