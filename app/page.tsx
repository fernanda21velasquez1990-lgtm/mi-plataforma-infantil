"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

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
  monto: "2500 Bs",
  whatsapp: "584144895281",
};

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
      "Con el acceso VIP podrás descargar los recursos educativos disponibles.",
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
    pregunta: "¿El pago es mensual?",
    respuesta:
      "No. El monto corresponde a un pago único para activar el acceso completo.",
  },
  {
    pregunta: "¿Cuánto tiempo dura el acceso?",
    respuesta:
      "El acceso VIP es ilimitado y no requiere pagos mensuales.",
  },
  {
    pregunta: "¿Puedo descargar los materiales?",
    respuesta:
      "Sí. Las descargas estarán disponibles después de activar el acceso VIP.",
  },
  {
    pregunta: "¿Cómo se activa mi acceso?",
    respuesta:
      "Realiza el pago, envía el comprobante por WhatsApp y espera la confirmación.",
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

  const [mostrarPago, setMostrarPago] = useState(false);

  const [preguntaAbierta, setPreguntaAbierta] =
    useState<number | null>(null);

  /* ===================================================
     ENVIAR A LA PÁGINA DE ACCESO EN MODO PRUEBA

     Ya no se crea la prueba desde esta página.
     La validación se realizará en /acceso.
  =================================================== */

  const solicitarPruebaGratis = () => {
    router.push("/acceso?modo=prueba");
  };

  /* ===================================================
     CLIENTE QUE YA PAGÓ
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
     ABRIR DATOS DE PAGO
  =================================================== */

  const abrirPago = () => {
    setMostrarPago(true);

    setTimeout(() => {
      document
        .getElementById("acceso-completo")
        ?.scrollIntoView({
          behavior: "smooth",
          block: "center",
        });
    }, 100);
  };

  /* ===================================================
     ENLACE DE WHATSAPP
  =================================================== */

  const mensajeWhatsApp =
    "Hola, quiero activar mi acceso VIP a Mundo Digital Infantil. Enviaré mi comprobante de pago:";

  const enlaceWhatsApp = `https://wa.me/${
    DATOS_PAGO.whatsapp
  }?text=${encodeURIComponent(mensajeWhatsApp)}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-white">
      {/* =================================================
          MENÚ SUPERIOR SIN BOTÓN HAMBURGUESA
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
          {/* LOGO */}

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

          {/* MENÚ PARA COMPUTADOR */}

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
              onClick={() => irASeccion("preguntas")}
              className="transition hover:text-yellow-300"
            >
              Preguntas
            </button>
          </nav>

          {/* BOTONES VISIBLES EN TELÉFONO Y COMPUTADOR */}

          <div className="flex shrink-0 items-center gap-2">
            <button
              type="button"
              onClick={entrarComoCliente}
              className="rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-2 text-xs font-black text-cyan-200 transition hover:bg-cyan-300 hover:text-slate-950 sm:px-5 sm:py-2.5 sm:text-sm"
            >
              🔐 Ya pagué
            </button>

            <button
              type="button"
              onClick={abrirPago}
              className="hidden rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-5 py-2.5 text-sm font-black text-slate-950 shadow-lg transition hover:-translate-y-0.5 sm:block"
            >
              Activar acceso
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
          {/* TEXTO PRINCIPAL */}

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

            {/* BOTONES PRINCIPALES */}

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
                🔐 Ya pagué, quiero entrar
              </button>
            </div>

            <p className="mx-auto mt-4 max-w-xl text-sm text-blue-200/70 lg:mx-0">
              La prueba debe validarse con tu número de
              WhatsApp. Las descargas de la biblioteca
              permanecerán bloqueadas.
            </p>

            {/* INDICADORES */}

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["📚", "Materiales"],
                ["🎮", "Actividades"],
                ["🤖", "Tecnología"],
                ["♾️", "Acceso VIP"],
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

          {/* PRESENTACIÓN DEL CONTENIDO */}

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
                  la plataforma antes de activar el acceso
                  VIP.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CLIENTES QUE YA PAGARON
      ================================================= */}

      <section className="relative border-y border-white/10 bg-gradient-to-r from-emerald-500/20 via-cyan-500/10 to-blue-500/20 px-5 py-10 lg:px-8">
        <div className="relative mx-auto flex max-w-6xl flex-col items-center justify-between gap-7 rounded-[2rem] border border-emerald-300/25 bg-white/10 p-6 text-center shadow-2xl backdrop-blur-xl sm:p-8 lg:flex-row lg:text-left">
          <div className="flex flex-col items-center gap-5 sm:flex-row">
            <span className="flex h-20 w-20 shrink-0 items-center justify-center rounded-3xl bg-gradient-to-br from-emerald-300 to-cyan-400 text-4xl shadow-xl">
              🔐
            </span>

            <div>
              <span className="inline-flex rounded-full bg-emerald-300/15 px-4 py-2 text-xs font-black uppercase tracking-[0.18em] text-emerald-200">
                Acceso para clientes
              </span>

              <h2 className="mt-3 text-2xl font-black sm:text-3xl">
                ¿Ya realizaste tu pago?
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
            ✅ Ya pagué, quiero entrar
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
                🔒 Disponible con prueba o acceso VIP
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
                🔒 Disponible con prueba o acceso VIP
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
        className="scroll-mt-24 bg-gradient-to-br from-indigo-950 via-purple-950 to-slate-950 px-5 py-20 lg:px-8"
      >
        <div className="mx-auto max-w-6xl">
          <div className="mx-auto mb-14 max-w-3xl text-center">
            <span className="inline-flex rounded-full bg-yellow-300/10 px-4 py-2 text-sm font-black text-yellow-200">
              COMENZAR ES MUY FÁCIL
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Elige cómo quieres comenzar
            </h2>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                numero: "01",
                emoji: "🔍",
                titulo: "Conoce la propuesta",
                descripcion:
                  "Revisa los contenidos y beneficios de la plataforma.",
              },
              {
                numero: "02",
                emoji: "🛸",
                titulo: "Solicita la prueba",
                descripcion:
                  "Registra tu teléfono y explora durante 60 minutos.",
              },
              {
                numero: "03",
                emoji: "💎",
                titulo: "Activa el acceso",
                descripcion:
                  "Realiza el pago y envía el comprobante para habilitar todo.",
              },
            ].map((paso) => (
              <article
                key={paso.numero}
                className="relative rounded-[2rem] border border-white/10 bg-white/10 p-7 shadow-xl"
              >
                <span className="absolute right-6 top-5 text-5xl font-black text-white/5">
                  {paso.numero}
                </span>

                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-400 text-3xl">
                  {paso.emoji}
                </span>

                <h3 className="mt-6 text-2xl font-black">
                  {paso.titulo}
                </h3>

                <p className="mt-3 leading-relaxed text-blue-100/75">
                  {paso.descripcion}
                </p>
              </article>
            ))}
          </div>

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={solicitarPruebaGratis}
              className="rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-8 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1"
            >
              🛸 Solicitar prueba de 60 minutos
            </button>
          </div>
        </div>
      </section>

      {/* =================================================
          ACCESO COMPLETO
      ================================================= */}

      <section
        id="acceso-completo"
        className="scroll-mt-24 bg-slate-50 px-5 py-20 text-slate-900 lg:px-8"
      >
        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">
          <div>
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
              ACCESO VIP
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Desbloquea todo el universo digital
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Acceso ilimitado a la biblioteca y al
              laboratorio digital.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "Acceso ilimitado",
                "Biblioteca educativa completa",
                "Descargas habilitadas",
                "Laboratorio Tech",
                "Uso desde cualquier dispositivo",
                "Sin mensualidades",
              ].map((elemento) => (
                <li
                  key={elemento}
                  className="flex items-center gap-3 font-bold text-slate-700"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
                    ✓
                  </span>

                  {elemento}
                </li>
              ))}
            </ul>
          </div>

          <div className="relative rounded-[2.5rem] border-4 border-emerald-300 bg-white p-7 shadow-2xl sm:p-9">
            {!mostrarPago ? (
              <div className="text-center">
                <span className="text-5xl">
                  💎
                </span>

                <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
                  Pago único
                </p>

                <div className="mt-3 flex items-end justify-center gap-2">
                  <span className="text-5xl font-black sm:text-6xl">
                    2500
                  </span>

                  <span className="pb-2 text-xl font-black text-slate-500">
                    Bs
                  </span>
                </div>

                <p className="mt-3 font-bold text-slate-500">
                  Sin mensualidades
                </p>

                <button
                  type="button"
                  onClick={() => setMostrarPago(true)}
                  className="mt-8 w-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-6 py-5 text-xl font-black text-slate-950 shadow-xl transition hover:-translate-y-1"
                >
                  💎 Mostrar datos de pago
                </button>
              </div>
            ) : (
              <div>
                <div className="text-center">
                  <span className="text-5xl">
                    📲
                  </span>

                  <h3 className="mt-4 text-3xl font-black text-emerald-600">
                    Taquilla VIP
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
                      {DATOS_PAGO.monto}
                    </strong>
                  </p>
                </div>

                <a
                  href={enlaceWhatsApp}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-4 text-lg font-black text-white shadow-lg transition hover:-translate-y-1"
                >
                  📲 Enviar comprobante
                </a>

                <button
                  type="button"
                  onClick={() => setMostrarPago(false)}
                  className="mt-4 w-full font-bold text-slate-400 underline"
                >
                  Ocultar datos de pago
                </button>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* =================================================
          PRUEBA GRATUITA
      ================================================= */}

      <section className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 px-5 py-16 text-slate-950">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">
          <div>
            <h2 className="text-3xl font-black sm:text-4xl">
              ¿Quieres explorar antes de pagar?
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
              🔐 Ya pagué, quiero entrar
            </button>

            <button
              type="button"
              onClick={abrirPago}
              className="rounded-full border-2 border-emerald-300 bg-emerald-300/10 px-7 py-4 font-black text-emerald-200"
            >
              💎 Activar acceso
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