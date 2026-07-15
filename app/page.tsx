"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* =====================================================
   TIPOS
===================================================== */

type PlanMembresia = {
  id: "mensual" | "trimestral" | "anual";
  nombre: string;
  precio: string;
  duracion: string;
  descripcion: string;
  beneficios: string[];
  destacado?: boolean;
};

/* =====================================================
   RUTAS
===================================================== */

const RUTA_ACCESO = "/acceso";

/* =====================================================
   DATOS DE PAGO
===================================================== */

const DATOS_PAGO = {
  banco: "Venezuela (0102)",
  cedula: "V-16.113.624",
  telefono: "0414-4895281",
  whatsapp: "584144895281",
};

/* =====================================================
   PLANES DE MEMBRESÍA
===================================================== */

const PLANES_MEMBRESIA: PlanMembresia[] = [
  {
    id: "mensual",
    nombre: "Membresía mensual",
    precio: "$3",
    duracion: "1 mes",
    descripcion:
      "Ideal para comenzar y disfrutar todo el contenido durante un mes.",
    beneficios: [
      "Biblioteca educativa completa",
      "Descargas habilitadas",
      "Acceso al Laboratorio Tech",
      "Uso desde cualquier dispositivo",
      "Nuevos materiales y actividades",
    ],
  },
  {
    id: "trimestral",
    nombre: "Membresía trimestral",
    precio: "$6",
    duracion: "3 meses",
    descripcion:
      "Tres meses de acceso con un precio más conveniente.",
    beneficios: [
      "Todos los beneficios del plan mensual",
      "Acceso durante 3 meses",
      "Ahorro frente al pago mensual",
      "Nuevos materiales y actividades",
      "Soporte por WhatsApp",
    ],
    destacado: true,
  },
  {
    id: "anual",
    nombre: "Membresía anual",
    precio: "$12",
    duracion: "1 año",
    descripcion:
      "La mejor alternativa para familias, docentes y creadores frecuentes.",
    beneficios: [
      "Acceso completo durante un año",
      "Mayor ahorro",
      "Biblioteca educativa completa",
      "Acceso al Laboratorio Tech",
      "Contenido y recursos exclusivos",
    ],
  },
];

/* =====================================================
   BENEFICIOS
===================================================== */

const beneficios = [
  {
    emoji: "📚",
    titulo: "Biblioteca organizada",
    descripcion:
      "Materiales educativos clasificados por categorías para encontrarlos fácilmente.",
    color: "from-blue-500 to-cyan-400",
  },
  {
    emoji: "🎮",
    titulo: "Aprendizaje divertido",
    descripcion:
      "Juegos, cuentos y actividades diseñadas para aprender de manera entretenida.",
    color: "from-rose-500 to-orange-400",
  },
  {
    emoji: "📱",
    titulo: "Disponible en varios dispositivos",
    descripcion:
      "Utiliza la plataforma desde teléfonos, tabletas y computadoras.",
    color: "from-violet-500 to-fuchsia-400",
  },
  {
    emoji: "⬇️",
    titulo: "Materiales descargables",
    descripcion:
      "Con una membresía activa podrás descargar los recursos educativos disponibles.",
    color: "from-amber-500 to-yellow-400",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    titulo: "Para familias y docentes",
    descripcion:
      "Recursos útiles para acompañar el aprendizaje en casa y en el aula.",
    color: "from-emerald-500 to-green-400",
  },
  {
    emoji: "🚀",
    titulo: "Contenido en crecimiento",
    descripcion:
      "La plataforma continúa incorporando nuevos materiales y herramientas.",
    color: "from-indigo-500 to-blue-400",
  },
];

/* =====================================================
   PREGUNTAS FRECUENTES
===================================================== */

const preguntasFrecuentes = [
  {
    pregunta: "¿Qué planes de membresía están disponibles?",
    respuesta:
      "Puedes elegir una membresía de un mes por $3, tres meses por $6 o un año por $12.",
  },
  {
    pregunta: "¿Cuánto tiempo dura cada membresía?",
    respuesta:
      "La membresía mensual dura un mes, la trimestral dura tres meses y la anual dura un año.",
  },
  {
    pregunta: "¿La membresía se renueva automáticamente?",
    respuesta:
      "Por ahora la renovación es manual. Cuando tu membresía esté próxima a vencer podrás realizar un nuevo pago y enviar el comprobante por WhatsApp.",
  },
  {
    pregunta: "¿Puedo descargar los materiales?",
    respuesta:
      "Sí. Las descargas estarán disponibles mientras tu membresía se encuentre activa.",
  },
  {
    pregunta: "¿Cómo se activa mi membresía?",
    respuesta:
      "Selecciona un plan, realiza el pago, envía el comprobante por WhatsApp y espera la confirmación.",
  },
  {
    pregunta: "¿Qué ocurre cuando vence mi membresía?",
    respuesta:
      "El contenido protegido y las descargas se bloquearán hasta que renueves tu membresía.",
  },
  {
    pregunta: "¿Puedo utilizar la plataforma desde el teléfono?",
    respuesta:
      "Sí. La plataforma funciona desde teléfonos, tabletas y computadoras.",
  },
  {
    pregunta: "¿Qué incluye la prueba gratuita?",
    respuesta:
      "Permite explorar la plataforma durante 60 minutos. Las descargas de la biblioteca permanecen bloqueadas.",
  },
];

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */

export default function InicioLanding() {
  const router = useRouter();

  const [planSeleccionado, setPlanSeleccionado] =
    useState<PlanMembresia | null>(null);

  const [preguntaAbierta, setPreguntaAbierta] =
    useState<number | null>(null);

  /* ===================================================
     PRUEBA GRATUITA
  =================================================== */

  const solicitarPruebaGratis = () => {
    router.push("/acceso?modo=prueba");
  };

  /* ===================================================
     CLIENTE CON MEMBRESÍA
  =================================================== */

  const entrarComoCliente = () => {
    router.push(RUTA_ACCESO);
  };

  /* ===================================================
     DESPLAZAMIENTO ENTRE SECCIONES
  =================================================== */

  const irASeccion = (id: string) => {
    document.getElementById(id)?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ===================================================
     IR A MEMBRESÍAS
  =================================================== */

  const abrirMembresias = () => {
    document.getElementById("membresias")?.scrollIntoView({
      behavior: "smooth",
      block: "start",
    });
  };

  /* ===================================================
     SELECCIONAR MEMBRESÍA
  =================================================== */

  const seleccionarPlan = (plan: PlanMembresia) => {
    setPlanSeleccionado(plan);

    setTimeout(() => {
      document.getElementById("datos-pago")?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  /* ===================================================
     WHATSAPP
  =================================================== */

  const mensajeWhatsApp = planSeleccionado
    ? `Hola, quiero activar la ${planSeleccionado.nombre} de Mundo Digital Infantil por ${planSeleccionado.precio}. La membresía tendrá una duración de ${planSeleccionado.duracion}. Enviaré mi comprobante de pago:`
    : "Hola, quiero recibir información sobre las membresías de Mundo Digital Infantil.";

  const enlaceWhatsApp = `https://wa.me/${
    DATOS_PAGO.whatsapp
  }?text=${encodeURIComponent(mensajeWhatsApp)}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-white">
      {/* =================================================
          MENÚ SUPERIOR
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex min-w-0 items-center gap-3 text-left"
            aria-label="Volver al inicio"
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 text-2xl shadow-lg">
              🚀
            </span>

            <div className="min-w-0">
              <p className="truncate text-xs font-black leading-tight text-yellow-300 sm:text-base">
                MUNDO DIGITAL
              </p>

              <p className="text-[10px] font-bold tracking-[0.16em] text-cyan-300 sm:text-xs">
                INFANTIL
              </p>
            </div>
          </button>

          <nav className="hidden items-center gap-6 text-sm font-bold text-blue-100 lg:flex">
            <button
              type="button"
              onClick={() => irASeccion("contenido")}
              className="transition hover:text-yellow-300"
            >
              Contenido
            </button>

            <button
              type="button"
              onClick={() => irASeccion("beneficios")}
              className="transition hover:text-yellow-300"
            >
              Beneficios
            </button>

            <button
              type="button"
              onClick={() => irASeccion("como-funciona")}
              className="transition hover:text-yellow-300"
            >
              Cómo funciona
            </button>

            <button
              type="button"
              onClick={() => irASeccion("membresias")}
              className="transition hover:text-yellow-300"
            >
              Membresías
            </button>

            <button
              type="button"
              onClick={() => irASeccion("preguntas")}
              className="transition hover:text-yellow-300"
            >
              Preguntas
            </button>
          </nav>

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={entrarComoCliente}
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-200 transition hover:bg-cyan-300 hover:text-slate-950 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              🔐 Ya tengo membresía
            </button>

            <button
              type="button"
              onClick={abrirMembresias}
              className="hidden rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5 sm:block"
            >
              Ver membresías
            </button>
          </div>
        </div>
      </header>

      {/* =================================================
          ENCABEZADO PRINCIPAL
      ================================================= */}

      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 top-5 h-96 w-96 rounded-full bg-fuchsia-600/25 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="relative mx-auto grid min-h-[720px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8">
          <div className="text-center lg:text-left">
            <span className="mb-6 inline-flex rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-extrabold text-cyan-200">
              ✨ APRENDER · JUGAR · CREAR
            </span>

            <h1 className="text-5xl font-black leading-[1.05] tracking-tight sm:text-6xl lg:text-7xl">
              <span className="block text-white">
                Descubre un universo
              </span>

              <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                de aprendizaje digital
              </span>
            </h1>

            <p className="mx-auto mt-6 max-w-2xl text-lg font-medium leading-relaxed text-blue-100/90 lg:mx-0 lg:text-xl">
              Materiales educativos, actividades infantiles
              y herramientas digitales para familias,
              docentes y creadores.
            </p>

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">
              <button
                type="button"
                onClick={solicitarPruebaGratis}
                className="rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-8 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:brightness-110"
              >
                🛸 Solicitar prueba de 60 minutos
              </button>

              <button
                type="button"
                onClick={entrarComoCliente}
                className="rounded-full border-2 border-cyan-300/40 bg-white/10 px-8 py-4 text-lg font-black text-white shadow-xl transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-300/15"
              >
                🔐 Ya tengo membresía
              </button>
            </div>

            <p className="mx-auto mt-4 max-w-xl text-sm text-blue-200/70 lg:mx-0">
              La prueba debe validarse con tu número de
              WhatsApp. Las descargas de la biblioteca
              permanecerán bloqueadas.
            </p>

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["📚", "Materiales"],
                ["🎮", "Actividades"],
                ["🤖", "Tecnología"],
                ["💎", "Membresía VIP"],
              ].map(([emoji, texto]) => (
                <div
                  key={texto}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center"
                >
                  <span className="block text-2xl">
                    {emoji}
                  </span>

                  <span className="mt-1 block text-xs font-bold">
                    {texto}
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="relative mx-auto w-full max-w-xl">
            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-pink-500/20 blur-2xl" />

            <div className="relative rounded-[2.5rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
              <div className="mb-6 flex items-center justify-between">
                <div>
                  <p className="text-sm font-bold uppercase tracking-[0.2em] text-cyan-300">
                    Plataforma educativa
                  </p>

                  <h2 className="mt-1 text-2xl font-black">
                    Tu estación de aprendizaje
                  </h2>
                </div>

                <span className="text-5xl">
                  🛰️
                </span>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <article className="rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 p-5 shadow-xl">
                  <span className="text-4xl">
                    📚
                  </span>

                  <h3 className="mt-5 text-xl font-black">
                    Biblioteca Estelar
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-blue-50">
                    Guías, cuentos, juegos, matemáticas,
                    caligrafía y más.
                  </p>

                  <span className="mt-5 inline-flex rounded-full bg-white/20 px-3 py-2 text-xs font-black">
                    🔒 Acceso protegido
                  </span>
                </article>

                <article className="rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 shadow-xl">
                  <span className="text-4xl">
                    🤖
                  </span>

                  <h3 className="mt-5 text-xl font-black">
                    Laboratorio Tech
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-violet-50">
                    Inteligencia artificial, automatización
                    y recursos digitales.
                  </p>

                  <span className="mt-5 inline-flex rounded-full bg-white/20 px-3 py-2 text-xs font-black">
                    🔒 Acceso protegido
                  </span>
                </article>
              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/30 p-5">
                <p className="font-black text-yellow-200">
                  💡 Conoce antes de decidir
                </p>

                <p className="mt-2 text-sm leading-relaxed text-blue-100">
                  Solicita la prueba gratuita para descubrir
                  la plataforma antes de elegir tu
                  membresía.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CLIENTES CON MEMBRESÍA
      ================================================= */}

      <section className="relative border-y border-white/10 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-blue-500/20 px-5 py-10 lg:px-8">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-7 rounded-[2rem] border border-emerald-300/25 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8 lg:flex-row lg:text-left">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-300 to-cyan-400 text-4xl shadow-xl">
              🔐
            </span>

            <div>
              <span className="inline-flex rounded-full bg-emerald-300/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                Acceso para miembros
              </span>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                ¿Ya tienes una membresía activa?
              </h2>

              <p className="mt-2 max-w-2xl leading-relaxed text-blue-100/75">
                Ingresa con el mismo número de WhatsApp
                utilizado para enviar tu comprobante.
              </p>
            </div>
          </div>

          <button
            type="button"
            onClick={entrarComoCliente}
            className="w-full shrink-0 rounded-full bg-gradient-to-r from-emerald-300 to-cyan-400 px-7 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1 lg:w-auto"
          >
            ✅ Ingresar a mi cuenta
          </button>
        </div>
      </section>

      {/* =================================================
          CONTENIDO
      ================================================= */}

      <section
        id="contenido"
        className="scroll-mt-24 bg-gradient-to-b from-slate-950 to-indigo-950 px-5 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-cyan-200">
              CONOCE TODO LO QUE INCLUYE
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Dos espacios llenos de posibilidades
            </h2>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            <article className="rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-blue-600/30 to-cyan-500/10 p-7 shadow-2xl sm:p-9">
              <span className="inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-blue-950">
                PARA NIÑOS, FAMILIAS Y DOCENTES
              </span>

              <h3 className="mt-6 text-3xl font-black text-cyan-200 sm:text-4xl">
                Biblioteca Estelar
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-blue-100">
                Recursos para fortalecer diferentes áreas
                del aprendizaje.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "📖 Cuentos y lecturas",
                  "🔢 Matemáticas",
                  "✍️ Caligrafía",
                  "🧠 Recursos para TDAH",
                  "🧩 Método Montessori",
                  "🗣️ Terapia de lenguaje",
                  "🎮 Juegos educativos",
                  "🖼️ Pictogramas",
                ].map((elemento) => (
                  <div
                    key={elemento}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold"
                  >
                    {elemento}
                  </div>
                ))}
              </div>

              <div className="mt-8 inline-flex rounded-full border border-cyan-200/30 bg-cyan-300/15 px-6 py-3 font-black text-cyan-100">
                🔒 Disponible con prueba o membresía activa
              </div>
            </article>

            <article className="rounded-[2.5rem] border border-fuchsia-300/20 bg-gradient-to-br from-violet-600/30 to-fuchsia-500/10 p-7 shadow-2xl sm:p-9">
              <span className="inline-flex rounded-full bg-fuchsia-300 px-4 py-2 text-sm font-black text-violet-950">
                PARA ADULTOS Y CREADORES
              </span>

              <h3 className="mt-6 text-3xl font-black text-fuchsia-200 sm:text-4xl">
                Laboratorio Tech
              </h3>

              <p className="mt-4 text-lg leading-relaxed text-violet-100">
                Herramientas digitales para aprender,
                crear y mejorar proyectos.
              </p>

              <div className="mt-7 grid gap-3 sm:grid-cols-2">
                {[
                  "🤖 Inteligencia artificial",
                  "⚙️ Automatización",
                  "📊 Google Sheets",
                  "📣 Marketing digital",
                  "🎨 Diseño para redes",
                  "🗓️ Calendarios de contenido",
                  "🧠 Productividad",
                  "📱 Herramientas digitales",
                ].map((elemento) => (
                  <div
                    key={elemento}
                    className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold"
                  >
                    {elemento}
                  </div>
                ))}
              </div>

              <div className="mt-8 inline-flex rounded-full border border-fuchsia-200/30 bg-fuchsia-300/15 px-6 py-3 font-black text-fuchsia-100">
                🔒 Disponible con prueba o membresía activa
              </div>
            </article>
          </div>
        </div>
      </section>

      {/* =================================================
          BENEFICIOS
      ================================================= */}

      <section
        id="beneficios"
        className="scroll-mt-24 bg-slate-50 px-5 py-20 text-slate-900 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-violet-100 px-4 py-2 text-sm font-black text-violet-700">
              TODO EN UN MISMO LUGAR
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Una plataforma para facilitar el aprendizaje
            </h2>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {beneficios.map((beneficio) => (
              <article
                key={beneficio.titulo}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg transition hover:-translate-y-2 hover:shadow-2xl"
              >
                <div
                  className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${beneficio.color}`}
                />

                <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl">
                  {beneficio.emoji}
                </div>

                <h3 className="mt-5 text-xl font-black">
                  {beneficio.titulo}
                </h3>

                <p className="mt-3 leading-relaxed text-slate-600">
                  {beneficio.descripcion}
                </p>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* =================================================
          CÓMO FUNCIONA
      ================================================= */}

      <section
        id="como-funciona"
        className="relative scroll-mt-24 overflow-hidden bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-5 py-24 lg:px-8"
      >
        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-fuchsia-500/20 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 bottom-0 h-96 w-96 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-violet-500/10 blur-3xl" />

        <div className="relative mx-auto max-w-7xl">
          <div className="mx-auto mb-16 max-w-4xl text-center">
            <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/20 bg-yellow-300/10 px-5 py-2 text-sm font-black uppercase tracking-[0.14em] text-yellow-200 shadow-lg">
              <span className="animate-pulse">✨</span>
              Comenzar es muy fácil
            </span>

            <h2 className="mt-6 text-4xl font-black leading-tight sm:text-5xl lg:text-6xl">
              Elige cómo quieres{" "}
              <span className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 bg-clip-text text-transparent">
                comenzar
              </span>
            </h2>

            <p className="mx-auto mt-5 max-w-2xl text-base font-medium leading-relaxed text-blue-100/70 sm:text-lg">
              Conoce la plataforma, solicita tu prueba gratuita
              y selecciona la membresía que mejor se adapte a ti.
            </p>
          </div>

          <div className="relative">
            <div className="pointer-events-none absolute left-[16%] right-[16%] top-20 hidden h-1 rounded-full bg-gradient-to-r from-yellow-300 via-orange-400 to-cyan-300 opacity-40 lg:block" />

            <div className="grid gap-7 lg:grid-cols-3">
              {[
                {
                  numero: "01",
                  emoji: "🔍",
                  etiqueta: "DESCUBRE",
                  titulo: "Conoce la propuesta",
                  descripcion:
                    "Revisa los contenidos, beneficios y herramientas disponibles dentro de la plataforma.",
                  detalles: [
                    "Explora las categorías",
                    "Conoce los beneficios",
                  ],
                  color: "from-yellow-300 to-orange-400",
                  borde: "border-yellow-300/30",
                  texto: "text-yellow-200",
                },
                {
                  numero: "02",
                  emoji: "🛸",
                  etiqueta: "EXPLORA",
                  titulo: "Solicita la prueba",
                  descripcion:
                    "Registra tu número de teléfono y explora la plataforma gratuitamente durante 60 minutos.",
                  detalles: [
                    "Prueba gratuita",
                    "Sin compromiso",
                  ],
                  color: "from-orange-400 to-pink-500",
                  borde: "border-pink-300/30",
                  texto: "text-pink-200",
                },
                {
                  numero: "03",
                  emoji: "💎",
                  etiqueta: "DESBLOQUEA",
                  titulo: "Elige tu membresía",
                  descripcion:
                    "Selecciona el plan de un mes, tres meses o un año y envía tu comprobante.",
                  detalles: [
                    "Planes desde $3",
                    "Acceso completo",
                  ],
                  color: "from-cyan-300 to-emerald-400",
                  borde: "border-cyan-300/30",
                  texto: "text-cyan-200",
                },
              ].map((paso) => (
                <article
                  key={paso.numero}
                  className={`group relative flex h-full flex-col overflow-hidden rounded-[2.25rem] border ${paso.borde} bg-white/[0.08] p-7 shadow-2xl backdrop-blur-xl transition duration-300 hover:-translate-y-3 hover:bg-white/[0.12] sm:p-8`}
                >
                  <div
                    className={`absolute inset-x-0 top-0 h-1.5 bg-gradient-to-r ${paso.color}`}
                  />

                  <div
                    className={`pointer-events-none absolute -right-20 -top-20 h-44 w-44 rounded-full bg-gradient-to-br ${paso.color} opacity-10 blur-3xl transition duration-500 group-hover:opacity-25`}
                  />

                  <span className="absolute right-6 top-6 text-6xl font-black text-white/[0.04] transition duration-300 group-hover:text-white/[0.08]">
                    {paso.numero}
                  </span>

                  <div
                    className={`relative flex h-20 w-20 items-center justify-center rounded-[1.5rem] bg-gradient-to-br ${paso.color} text-4xl shadow-xl transition duration-300 group-hover:scale-110 group-hover:rotate-3`}
                  >
                    {paso.emoji}

                    <span className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border-2 border-purple-950 bg-white text-xs font-black text-slate-950">
                      {paso.numero}
                    </span>
                  </div>

                  <span
                    className={`mt-7 text-xs font-black uppercase tracking-[0.2em] ${paso.texto}`}
                  >
                    {paso.etiqueta}
                  </span>

                  <h3 className="mt-2 text-2xl font-black text-white sm:text-3xl">
                    {paso.titulo}
                  </h3>

                  <p className="mt-4 flex-1 leading-relaxed text-blue-100/70">
                    {paso.descripcion}
                  </p>

                  <div className="mt-7 flex flex-wrap gap-2">
                    {paso.detalles.map((detalle) => (
                      <span
                        key={detalle}
                        className="rounded-full border border-white/10 bg-white/10 px-3 py-2 text-xs font-black text-blue-50"
                      >
                        ✓ {detalle}
                      </span>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <div className="relative mx-auto mt-14 max-w-5xl overflow-hidden rounded-[2.25rem] border border-white/10 bg-white/[0.07] p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-yellow-300/5 via-pink-400/5 to-cyan-300/5" />

            <div className="relative flex flex-col items-center justify-between gap-7 text-center lg:flex-row lg:text-left">
              <div>
                <span className="inline-flex rounded-full bg-emerald-300/10 px-4 py-2 text-xs font-black uppercase tracking-[0.16em] text-emerald-200">
                  🚀 Tu aventura comienza aquí
                </span>

                <h3 className="mt-4 text-2xl font-black sm:text-3xl">
                  Explora gratis o desbloquea todo
                </h3>

                <p className="mt-2 max-w-xl leading-relaxed text-blue-100/65">
                  Prueba la plataforma durante 60 minutos o
                  revisa las membresías disponibles desde $3.
                </p>
              </div>

              <div className="flex w-full flex-col gap-4 sm:w-auto sm:flex-row">
                <button
                  type="button"
                  onClick={solicitarPruebaGratis}
                  className="rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-7 py-4 text-base font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:brightness-110"
                >
                  🛸 Probar 60 minutos
                </button>

                <button
                  type="button"
                  onClick={abrirMembresias}
                  className="rounded-full border-2 border-cyan-300 bg-cyan-300/10 px-7 py-4 text-base font-black text-cyan-200 shadow-xl transition hover:-translate-y-1 hover:bg-cyan-300 hover:text-slate-950"
                >
                  💎 Ver membresías
                </button>
              </div>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm font-bold text-blue-100/55">
            <span>✓ Prueba gratuita</span>
            <span>✓ Activación por WhatsApp</span>
            <span>✓ Planes desde $3</span>
            <span>✓ Acceso desde cualquier dispositivo</span>
          </div>
        </div>
      </section>

      {/* =================================================
          MEMBRESÍAS
      ================================================= */}

      <section
        id="membresias"
        className="scroll-mt-24 bg-slate-50 px-5 py-20 text-slate-900 lg:px-8"
      >
        <div className="mx-auto max-w-7xl">
          <div className="mx-auto mb-12 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
              MEMBRESÍAS VIP
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Elige el plan ideal para ti
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Disfruta la biblioteca educativa, las
              descargas y todas las herramientas digitales
              mientras tu membresía se encuentre activa.
            </p>
          </div>

          <div className="grid gap-7 lg:grid-cols-3">
            {PLANES_MEMBRESIA.map((plan) => (
              <article
                key={plan.id}
                className={`relative flex flex-col rounded-[2.5rem] border-4 bg-white p-7 shadow-xl transition hover:-translate-y-2 hover:shadow-2xl sm:p-8 ${
                  plan.destacado
                    ? "border-yellow-300 lg:scale-105"
                    : "border-emerald-200"
                }`}
              >
                {plan.destacado && (
                  <span className="absolute -top-4 left-1/2 -translate-x-1/2 whitespace-nowrap rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-5 py-2 text-xs font-black uppercase tracking-[0.14em] text-slate-950 shadow-lg">
                    Más recomendado
                  </span>
                )}

                <div className="text-center">
                  <span className="text-5xl">
                    {plan.id === "mensual"
                      ? "🚀"
                      : plan.id === "trimestral"
                        ? "💎"
                        : "🌟"}
                  </span>

                  <h3 className="mt-5 text-2xl font-black">
                    {plan.nombre}
                  </h3>

                  <div className="mt-5">
                    <span className="text-4xl font-black text-emerald-600 sm:text-5xl">
                      {plan.precio}
                    </span>
                  </div>

                  <p className="mt-2 font-black text-slate-500">
                    Acceso por {plan.duracion}
                  </p>

                  <p className="mt-5 min-h-[72px] leading-relaxed text-slate-600">
                    {plan.descripcion}
                  </p>
                </div>

                <ul className="mt-7 flex-1 space-y-4">
                  {plan.beneficios.map((beneficio) => (
                    <li
                      key={beneficio}
                      className="flex items-start gap-3 font-bold text-slate-700"
                    >
                      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                        ✓
                      </span>

                      <span>{beneficio}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  onClick={() => seleccionarPlan(plan)}
                  className={`mt-8 w-full rounded-full px-6 py-4 text-lg font-black shadow-xl transition hover:-translate-y-1 ${
                    plan.destacado
                      ? "bg-gradient-to-r from-yellow-300 to-orange-400 text-slate-950"
                      : "bg-gradient-to-r from-emerald-400 to-green-500 text-slate-950"
                  }`}
                >
                  Elegir membresía
                </button>
              </article>
            ))}
          </div>

          {planSeleccionado && (
            <div
              id="datos-pago"
              className="mt-14 grid scroll-mt-28 overflow-hidden rounded-[2.5rem] border border-emerald-300 bg-white shadow-2xl lg:grid-cols-2"
            >
              <div className="bg-gradient-to-br from-emerald-500 to-cyan-500 p-7 text-white sm:p-10">
                <span className="inline-flex rounded-full bg-white/20 px-4 py-2 text-xs font-black uppercase tracking-[0.16em]">
                  Plan seleccionado
                </span>

                <h3 className="mt-5 text-3xl font-black sm:text-4xl">
                  {planSeleccionado.nombre}
                </h3>

                <div className="mt-6">
                  <span className="text-5xl font-black">
                    {planSeleccionado.precio}
                  </span>
                </div>

                <p className="mt-3 text-lg font-bold text-emerald-50">
                  Vigencia: {planSeleccionado.duracion}
                </p>

                <p className="mt-6 leading-relaxed text-emerald-50">
                  Realiza el pago y envía el comprobante por
                  WhatsApp. Tu membresía será activada
                  después de verificar la operación.
                </p>

                <div className="mt-7 rounded-2xl border border-white/20 bg-white/10 p-5">
                  <p className="font-black">
                    Importante
                  </p>

                  <p className="mt-2 text-sm leading-relaxed text-emerald-50">
                    La renovación es manual. Cuando finalice
                    la vigencia, deberás renovar para
                    continuar accediendo al contenido
                    protegido.
                  </p>
                </div>
              </div>

              <div className="p-7 sm:p-10">
                <div className="text-center">
                  <span className="text-5xl">
                    📲
                  </span>

                  <h3 className="mt-4 text-3xl font-black text-emerald-600">
                    Datos de pago
                  </h3>
                </div>

                <div className="mt-7 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">
                  <p>
                    🏦 Banco:{" "}
                    <strong className="text-blue-700">
                      {DATOS_PAGO.banco}
                    </strong>
                  </p>

                  <p>
                    📝 Cédula:{" "}
                    <strong className="text-blue-700">
                      {DATOS_PAGO.cedula}
                    </strong>
                  </p>

                  <p>
                    📱 Teléfono:{" "}
                    <strong className="text-blue-700">
                      {DATOS_PAGO.telefono}
                    </strong>
                  </p>

                  <p>
                    💵 Monto:{" "}
                    <strong className="text-emerald-600">
                      {planSeleccionado.precio}
                    </strong>
                  </p>

                  <p>
                    ⏳ Duración:{" "}
                    <strong className="text-violet-700">
                      {planSeleccionado.duracion}
                    </strong>
                  </p>
                </div>

                <a
                  href={enlaceWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-4 text-center text-lg font-black text-white shadow-lg transition hover:-translate-y-1"
                >
                  📲 Enviar comprobante por WhatsApp
                </a>

                <button
                  type="button"
                  onClick={() => {
                    setPlanSeleccionado(null);

                    setTimeout(() => {
                      document
                        .getElementById("membresias")
                        ?.scrollIntoView({
                          behavior: "smooth",
                          block: "start",
                        });
                    }, 100);
                  }}
                  className="mt-4 w-full font-bold text-slate-400 underline"
                >
                  Cambiar membresía
                </button>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* =================================================
          PRUEBA GRATUITA
      ================================================= */}

      <section className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 px-5 py-16 text-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">
              ¿Quieres explorar antes de elegir?
            </h2>

            <p className="mt-3 max-w-2xl text-lg font-semibold">
              Registra tu número y disfruta de 60 minutos
              para conocer la plataforma.
            </p>
          </div>

          <button
            type="button"
            onClick={solicitarPruebaGratis}
            className="w-full rounded-full bg-slate-950 px-8 py-5 text-lg font-black text-yellow-300 shadow-2xl lg:w-auto"
          >
            🛸 Solicitar prueba de 60 minutos
          </button>
        </div>
      </section>

      {/* =================================================
          PREGUNTAS FRECUENTES
      ================================================= */}

      <section
        id="preguntas"
        className="scroll-mt-24 bg-slate-950 px-5 py-20"
      >
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h2 className="text-4xl font-black sm:text-5xl">
              Preguntas frecuentes
            </h2>
          </div>

          <div className="space-y-4">
            {preguntasFrecuentes.map((elemento, indice) => {
              const abierta = preguntaAbierta === indice;

              return (
                <article
                  key={elemento.pregunta}
                  className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                >
                  <button
                    type="button"
                    onClick={() =>
                      setPreguntaAbierta(
                        abierta ? null : indice,
                      )
                    }
                    className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left font-black"
                  >
                    <span>
                      {elemento.pregunta}
                    </span>

                    <span>
                      {abierta ? "−" : "+"}
                    </span>
                  </button>

                  {abierta && (
                    <div className="border-t border-white/10 px-5 py-5 text-blue-100/75">
                      {elemento.respuesta}
                    </div>
                  )}
                </article>
              );
            })}
          </div>
        </div>
      </section>

      {/* =================================================
          LLAMADO FINAL
      ================================================= */}

      <section className="border-t border-white/10 bg-indigo-950 px-5 py-16 text-center">
        <div className="mx-auto max-w-3xl">
          <span className="text-6xl">
            🌟
          </span>

          <h2 className="mt-5 text-3xl font-black sm:text-4xl">
            El conocimiento está listo para despegar
          </h2>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={solicitarPruebaGratis}
              className="rounded-full bg-yellow-300 px-7 py-4 font-black text-slate-950"
            >
              🛸 Solicitar prueba
            </button>

            <button
              type="button"
              onClick={entrarComoCliente}
              className="rounded-full border-2 border-cyan-300 bg-cyan-300/10 px-7 py-4 font-black text-cyan-200"
            >
              🔐 Ya tengo membresía
            </button>

            <button
              type="button"
              onClick={abrirMembresias}
              className="rounded-full border-2 border-emerald-300 bg-emerald-300/10 px-7 py-4 font-black text-emerald-200"
            >
              💎 Ver membresías
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          PIE DE PÁGINA
      ================================================= */}

      <footer className="border-t border-white/10 bg-slate-950 px-5 py-8">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 sm:flex-row">
          <p className="font-black text-yellow-300">
            🚀 MUNDO DIGITAL INFANTIL
          </p>

          <p className="text-sm font-bold text-blue-300/50">
            MUNDO DIGITAL INFANTIL © 2026
          </p>
        </div>
      </footer>
    </main>
  );
}