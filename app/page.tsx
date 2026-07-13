"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* =====================================================
   CONFIGURACIÓN PRINCIPAL

   Si alguna ruta de tu proyecto es diferente,
   solo cambia el valor correspondiente aquí.
===================================================== */

const RUTA_BIBLIOTECA = "/biblioteca";
const RUTA_TECNOLOGIA = "/tecnologia";

/* =====================================================
   DATOS DE PAGO

   Puedes modificar estos datos cuando lo necesites.
===================================================== */

const DATOS_PAGO = {
  banco: "Venezuela (0102)",
  cedula: "V-16.113.624",
  telefono: "0414-4895281",
  monto: "2500 Bs",
  whatsapp: "584144895281",
};

/* =====================================================
   BENEFICIOS DE LA PLATAFORMA
===================================================== */

const beneficios = [
  {
    emoji: "📚",
    titulo: "Biblioteca organizada",
    descripcion:
      "Materiales clasificados por categorías para encontrarlos fácilmente.",
    color:
      "from-blue-500 to-cyan-400",
  },
  {
    emoji: "🎮",
    titulo: "Aprendizaje divertido",
    descripcion:
      "Actividades, juegos y recursos para aprender mientras se divierten.",
    color:
      "from-rose-500 to-orange-400",
  },
  {
    emoji: "📱",
    titulo: "Disponible en cualquier dispositivo",
    descripcion:
      "Utiliza la plataforma desde teléfonos, tabletas y computadoras.",
    color:
      "from-violet-500 to-fuchsia-400",
  },
  {
    emoji: "⬇️",
    titulo: "Materiales descargables",
    descripcion:
      "Descarga recursos educativos y utilízalos cuando los necesites.",
    color:
      "from-amber-500 to-yellow-400",
  },
  {
    emoji: "👨‍👩‍👧‍👦",
    titulo: "Para familias y docentes",
    descripcion:
      "Recursos útiles para acompañar el aprendizaje en casa o en el aula.",
    color:
      "from-emerald-500 to-green-400",
  },
  {
    emoji: "🚀",
    titulo: "Contenido en crecimiento",
    descripcion:
      "La plataforma continúa incorporando nuevos materiales y herramientas.",
    color:
      "from-indigo-500 to-blue-400",
  },
];

/* =====================================================
   PREGUNTAS FRECUENTES
===================================================== */

const preguntasFrecuentes = [
  {
    pregunta: "¿El pago es mensual?",
    respuesta:
      "No. El monto mostrado corresponde a un pago único para activar el acceso completo a la plataforma.",
  },
  {
    pregunta: "¿Cuánto tiempo dura el acceso?",
    respuesta:
      "El acceso completo es ilimitado. Después de la activación podrás ingresar sin tener que realizar pagos mensuales.",
  },
  {
    pregunta: "¿Puedo descargar los materiales?",
    respuesta:
      "Sí. Los usuarios con acceso completo pueden abrir y descargar los materiales disponibles en la biblioteca.",
  },
  {
    pregunta: "¿Cómo se activa mi acceso?",
    respuesta:
      "Realiza el pago móvil, envía el comprobante por WhatsApp y espera la confirmación de activación.",
  },
  {
    pregunta: "¿Puedo utilizar la plataforma desde el teléfono?",
    respuesta:
      "Sí. La plataforma está diseñada para funcionar en teléfonos, tabletas y computadoras.",
  },
  {
    pregunta: "¿Qué incluye la prueba gratuita?",
    respuesta:
      "La prueba permite explorar la plataforma durante 60 minutos. Algunas funciones, como las descargas, pueden permanecer bloqueadas.",
  },
];

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */

export default function InicioLanding() {
  const router = useRouter();

  const [mostrarPago, setMostrarPago] =
    useState(false);

  const [menuAbierto, setMenuAbierto] =
    useState(false);

  const [
    preguntaAbierta,
    setPreguntaAbierta,
  ] = useState<number | null>(null);

  /* ===================================================
     PRUEBA GRATUITA DE 60 MINUTOS
  =================================================== */

  const iniciarPruebaExpress = () => {
    const ahora = new Date().getTime();

    const limite =
      ahora + 60 * 60 * 1000;

    localStorage.setItem(
      "limitePrueba",
      limite.toString(),
    );

    localStorage.removeItem("accesoVIP");

    router.push(RUTA_TECNOLOGIA);
  };

  /* ===================================================
     NAVEGACIÓN INTERNA
  =================================================== */

  const irASeccion = (id: string) => {
    const seccion =
      document.getElementById(id);

    if (seccion) {
      seccion.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMenuAbierto(false);
  };

  /* ===================================================
     ABRIR PAGO Y BAJAR A LA SECCIÓN
  =================================================== */

  const abrirPago = () => {
    setMostrarPago(true);

    setTimeout(() => {
      const seccionPago =
        document.getElementById(
          "acceso-completo",
        );

      seccionPago?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }, 100);
  };

  /* ===================================================
     ENLACE DE WHATSAPP
  =================================================== */

  const mensajeWhatsApp =
    "Hola, ya realicé mi pago móvil para Mundo Digital Infantil. Aquí está el comprobante:";

  const enlaceWhatsApp = `https://wa.me/${
    DATOS_PAGO.whatsapp
  }?text=${encodeURIComponent(
    mensajeWhatsApp,
  )}`;

  return (
    <main className="min-h-screen overflow-x-hidden bg-slate-950 font-sans text-white">

      {/* =================================================
          MENÚ SUPERIOR
      ================================================= */}

      <header className="sticky top-0 z-50 border-b border-white/10 bg-slate-950/85 backdrop-blur-xl">

        <div className="mx-auto flex max-w-7xl items-center justify-between px-5 py-4 lg:px-8">

          {/* LOGO */}

          <button
            type="button"
            onClick={() =>
              window.scrollTo({
                top: 0,
                behavior: "smooth",
              })
            }
            className="flex items-center gap-3 text-left"
            aria-label="Volver al inicio"
          >
            <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-500 text-2xl shadow-lg shadow-orange-500/20">
              🚀
            </span>

            <div>
              <p className="text-sm font-black leading-tight text-yellow-300 sm:text-base">
                MUNDO DIGITAL
              </p>

              <p className="text-xs font-bold tracking-[0.2em] text-cyan-300">
                INFANTIL
              </p>
            </div>
          </button>

          {/* MENÚ DE COMPUTADORA */}

          <nav className="hidden items-center gap-7 text-sm font-bold text-blue-100 lg:flex">

            <button
              type="button"
              onClick={() =>
                irASeccion("universos")
              }
              className="transition hover:text-yellow-300"
            >
              Contenido
            </button>

            <button
              type="button"
              onClick={() =>
                irASeccion("beneficios")
              }
              className="transition hover:text-yellow-300"
            >
              Beneficios
            </button>

            <button
              type="button"
              onClick={() =>
                irASeccion("como-funciona")
              }
              className="transition hover:text-yellow-300"
            >
              Cómo funciona
            </button>

            <button
              type="button"
              onClick={() =>
                irASeccion("preguntas")
              }
              className="transition hover:text-yellow-300"
            >
              Preguntas
            </button>

            <button
              type="button"
              onClick={abrirPago}
              className="rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-5 py-2.5 font-black text-slate-950 shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Acceso completo
            </button>

          </nav>

          {/* BOTÓN DEL MENÚ MÓVIL */}

          <button
            type="button"
            onClick={() =>
              setMenuAbierto(
                !menuAbierto,
              )
            }
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-2xl lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? "×" : "☰"}
          </button>

        </div>

        {/* MENÚ PARA TELÉFONO */}

        {menuAbierto && (
          <nav className="border-t border-white/10 bg-slate-950 px-5 py-5 lg:hidden">

            <div className="mx-auto flex max-w-7xl flex-col gap-3">

              <button
                type="button"
                onClick={() =>
                  irASeccion("universos")
                }
                className="rounded-xl bg-white/5 px-4 py-3 text-left font-bold text-blue-100"
              >
                🌌 Contenido
              </button>

              <button
                type="button"
                onClick={() =>
                  irASeccion("beneficios")
                }
                className="rounded-xl bg-white/5 px-4 py-3 text-left font-bold text-blue-100"
              >
                ✨ Beneficios
              </button>

              <button
                type="button"
                onClick={() =>
                  irASeccion(
                    "como-funciona",
                  )
                }
                className="rounded-xl bg-white/5 px-4 py-3 text-left font-bold text-blue-100"
              >
                🛸 Cómo funciona
              </button>

              <button
                type="button"
                onClick={() =>
                  irASeccion("preguntas")
                }
                className="rounded-xl bg-white/5 px-4 py-3 text-left font-bold text-blue-100"
              >
                💬 Preguntas frecuentes
              </button>

              <button
                type="button"
                onClick={() => {
                  setMenuAbierto(false);
                  abrirPago();
                }}
                className="rounded-xl bg-gradient-to-r from-emerald-400 to-green-500 px-4 py-3 text-left font-black text-slate-950"
              >
                💎 Desbloquear acceso
              </button>

            </div>

          </nav>
        )}

      </header>

      {/* =================================================
          HERO PRINCIPAL
      ================================================= */}

      <section className="relative isolate overflow-hidden">

        {/* DECORACIÓN */}

        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 top-5 h-96 w-96 rounded-full bg-fuchsia-600/25 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="pointer-events-none absolute left-[8%] top-24 hidden text-5xl lg:block">
          🚀
        </div>

        <div className="pointer-events-none absolute right-[10%] top-32 hidden text-6xl lg:block">
          🪐
        </div>

        <div className="pointer-events-none absolute left-[16%] top-[65%] hidden text-3xl lg:block">
          ⭐
        </div>

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">

          {/* TEXTO PRINCIPAL */}

          <div className="text-center lg:text-left">

            <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-300/25 bg-cyan-300/10 px-4 py-2 text-sm font-extrabold text-cyan-200 backdrop-blur">
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
              Materiales educativos,
              actividades infantiles y
              herramientas digitales reunidas
              en una plataforma diseñada para
              familias, docentes y creadores.
            </p>

            {/* BOTONES PRINCIPALES */}

            <div className="mt-9 flex flex-col justify-center gap-4 sm:flex-row lg:justify-start">

              <button
                type="button"
                onClick={() =>
                  router.push(
                    RUTA_BIBLIOTECA,
                  )
                }
                className="rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-7 py-4 text-lg font-black text-slate-950 shadow-xl shadow-orange-500/20 transition hover:-translate-y-1 hover:brightness-110"
              >
                📚 Explorar biblioteca
              </button>

              <button
                type="button"
                onClick={
                  iniciarPruebaExpress
                }
                className="rounded-full border-2 border-cyan-300/40 bg-white/10 px-7 py-4 text-lg font-black text-white shadow-xl backdrop-blur transition hover:-translate-y-1 hover:border-cyan-300 hover:bg-cyan-300/15"
              >
                🛸 Probar gratis 60 minutos
              </button>

            </div>

            {/* INDICADORES */}

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">

              {[
                ["📚", "Materiales"],
                ["🎮", "Actividades"],
                ["🤖", "Tecnología"],
                ["♾️", "Acceso"],
              ].map(([emoji, texto]) => (
                <div
                  key={texto}
                  className="rounded-2xl border border-white/10 bg-white/5 p-3 text-center backdrop-blur"
                >
                  <span className="block text-2xl">
                    {emoji}
                  </span>

                  <span className="mt-1 block text-xs font-bold text-blue-100">
                    {texto}
                  </span>
                </div>
              ))}

            </div>

          </div>

          {/* TARJETA VISUAL */}

          <div className="relative mx-auto w-full max-w-xl">

            <div className="absolute -inset-6 rounded-[3rem] bg-gradient-to-r from-cyan-500/20 via-violet-500/20 to-pink-500/20 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border border-white/15 bg-white/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">

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

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      RUTA_BIBLIOTECA,
                    )
                  }
                  className="group rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 p-5 text-left shadow-xl transition hover:-translate-y-1"
                >
                  <span className="text-4xl">
                    📚
                  </span>

                  <h3 className="mt-5 text-xl font-black">
                    Biblioteca Estelar
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-blue-50">
                    Guías, cuentos, juegos,
                    matemáticas, caligrafía y
                    más.
                  </p>

                  <span className="mt-5 inline-block font-black">
                    Explorar →
                  </span>
                </button>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      RUTA_TECNOLOGIA,
                    )
                  }
                  className="group rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 text-left shadow-xl transition hover:-translate-y-1"
                >
                  <span className="text-4xl">
                    🤖
                  </span>

                  <h3 className="mt-5 text-xl font-black">
                    Laboratorio Tech
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-violet-50">
                    Inteligencia artificial,
                    automatización y recursos
                    digitales.
                  </p>

                  <span className="mt-5 inline-block font-black">
                    Descubrir →
                  </span>
                </button>

              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/30 p-5">

                <div className="flex items-center gap-4">

                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-3xl">
                    💡
                  </span>

                  <div>
                    <h3 className="font-black text-yellow-200">
                      Aprende a tu ritmo
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-blue-100">
                      Explora los contenidos
                      desde cualquier dispositivo
                      y en el momento que
                      prefieras.
                    </p>
                  </div>

                </div>

              </div>

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          DOS UNIVERSOS
      ================================================= */}

      <section
        id="universos"
        className="scroll-mt-24 bg-gradient-to-b from-slate-950 to-indigo-950 px-5 py-20 lg:px-8"
      >

        <div className="mx-auto max-w-7xl">

          <div className="mx-auto mb-12 max-w-3xl text-center">

            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-bold text-cyan-200">
              DOS ESPACIOS, MUCHAS POSIBILIDADES
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Todo organizado para encontrarlo
              fácilmente
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-blue-100/75">
              La plataforma separa los recursos
              infantiles de las herramientas
              digitales para adultos y creadores.
            </p>

          </div>

          <div className="grid gap-8 lg:grid-cols-2">

            {/* UNIVERSO INFANTIL */}

            <article className="group relative overflow-hidden rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-blue-600/30 to-cyan-500/10 p-7 shadow-2xl backdrop-blur sm:p-9">

              <div className="absolute -right-12 -top-12 text-[10rem] opacity-10">
                📚
              </div>

              <div className="relative">

                <span className="inline-flex rounded-full bg-cyan-300 px-4 py-2 text-sm font-black text-blue-950">
                  PARA NIÑOS, FAMILIAS Y DOCENTES
                </span>

                <h3 className="mt-6 text-3xl font-black text-cyan-200 sm:text-4xl">
                  Biblioteca Estelar
                </h3>

                <p className="mt-4 max-w-xl text-lg leading-relaxed text-blue-100">
                  Un espacio educativo con
                  recursos diseñados para
                  fortalecer diferentes áreas
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
                  ].map((elemento) => (
                    <div
                      key={elemento}
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold text-blue-50"
                    >
                      {elemento}
                    </div>
                  ))}

                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      RUTA_BIBLIOTECA,
                    )
                  }
                  className="mt-8 rounded-full bg-cyan-300 px-7 py-4 font-black text-blue-950 shadow-xl transition hover:-translate-y-1 hover:bg-cyan-200"
                >
                  Explorar la biblioteca →
                </button>

              </div>

            </article>

            {/* ZONA DE ADULTOS */}

            <article className="group relative overflow-hidden rounded-[2.5rem] border border-fuchsia-300/20 bg-gradient-to-br from-violet-600/30 to-fuchsia-500/10 p-7 shadow-2xl backdrop-blur sm:p-9">

              <div className="absolute -right-12 -top-12 text-[10rem] opacity-10">
                🤖
              </div>

              <div className="relative">

                <span className="inline-flex rounded-full bg-fuchsia-300 px-4 py-2 text-sm font-black text-violet-950">
                  PARA ADULTOS Y CREADORES
                </span>

                <h3 className="mt-6 text-3xl font-black text-fuchsia-200 sm:text-4xl">
                  Laboratorio Tech
                </h3>

                <p className="mt-4 max-w-xl text-lg leading-relaxed text-violet-100">
                  Herramientas digitales para
                  aprender, crear contenido y
                  mejorar diferentes proyectos.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">

                  {[
                    "🤖 Inteligencia artificial",
                    "⚙️ Automatización",
                    "📊 Google Sheets",
                    "📣 Marketing digital",
                    "🎨 Diseño para redes",
                    "🗓️ Calendarios de contenido",
                  ].map((elemento) => (
                    <div
                      key={elemento}
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold text-violet-50"
                    >
                      {elemento}
                    </div>
                  ))}

                </div>

                <button
                  type="button"
                  onClick={() =>
                    router.push(
                      RUTA_TECNOLOGIA,
                    )
                  }
                  className="mt-8 rounded-full bg-fuchsia-300 px-7 py-4 font-black text-violet-950 shadow-xl transition hover:-translate-y-1 hover:bg-fuchsia-200"
                >
                  Entrar al laboratorio →
                </button>

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

            <h2 className="mt-5 text-4xl font-black text-slate-900 sm:text-5xl">
              Una plataforma creada para
              facilitar el aprendizaje
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Encuentra recursos organizados,
              prácticos y fáciles de utilizar
              desde cualquier dispositivo.
            </p>

          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">

            {beneficios.map(
              (beneficio) => (
                <article
                  key={beneficio.titulo}
                  className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-lg shadow-slate-900/5 transition hover:-translate-y-2 hover:shadow-2xl"
                >

                  <div
                    className={`absolute inset-x-0 top-0 h-2 bg-gradient-to-r ${beneficio.color}`}
                  />

                  <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-slate-100 text-3xl transition group-hover:scale-110">
                    {beneficio.emoji}
                  </div>

                  <h3 className="mt-5 text-xl font-black text-slate-900">
                    {beneficio.titulo}
                  </h3>

                  <p className="mt-3 leading-relaxed text-slate-600">
                    {beneficio.descripcion}
                  </p>

                </article>
              ),
            )}

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

            <span className="inline-flex rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-sm font-black text-yellow-200">
              ACTIVACIÓN SENCILLA
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Comienza en tres pasos
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-blue-100/75">
              Explora la plataforma, activa
              tu acceso y disfruta de todos
              los recursos disponibles.
            </p>

          </div>

          <div className="grid gap-8 md:grid-cols-3">

            {[
              {
                numero: "01",
                emoji: "🔍",
                titulo:
                  "Explora la plataforma",
                descripcion:
                  "Conoce la biblioteca y las herramientas digitales disponibles.",
              },
              {
                numero: "02",
                emoji: "📲",
                titulo:
                  "Activa tu acceso",
                descripcion:
                  "Realiza el pago y envía el comprobante mediante WhatsApp.",
              },
              {
                numero: "03",
                emoji: "🚀",
                titulo:
                  "Aprende sin límites",
                descripcion:
                  "Ingresa, descarga materiales y utiliza todos los recursos.",
              },
            ].map((paso) => (
              <article
                key={paso.numero}
                className="relative rounded-[2rem] border border-white/10 bg-white/10 p-7 shadow-xl backdrop-blur"
              >

                <span className="absolute right-6 top-5 text-5xl font-black text-white/5">
                  {paso.numero}
                </span>

                <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-yellow-300 to-orange-400 text-3xl shadow-xl">
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

        </div>

      </section>

      {/* =================================================
          PRECIO Y ACCESO COMPLETO
      ================================================= */}

      <section
        id="acceso-completo"
        className="scroll-mt-24 bg-slate-50 px-5 py-20 text-slate-900 lg:px-8"
      >

        <div className="mx-auto grid max-w-6xl items-center gap-10 lg:grid-cols-2">

          {/* INFORMACIÓN DEL ACCESO */}

          <div>

            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
              ACCESO COMPLETO
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Desbloquea todo el universo
              digital
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Obtén acceso ilimitado a la
              biblioteca educativa y al
              laboratorio de herramientas
              digitales.
            </p>

            <ul className="mt-8 space-y-4">

              {[
                "Acceso ilimitado a la plataforma",
                "Biblioteca de materiales educativos",
                "Descargas habilitadas",
                "Acceso al Laboratorio Tech",
                "Uso desde teléfono y computadora",
                "Sin pagos mensuales",
              ].map((elemento) => (
                <li
                  key={elemento}
                  className="flex items-center gap-3 font-bold text-slate-700"
                >
                  <span className="flex h-7 w-7 items-center justify-center rounded-full bg-emerald-100 text-sm text-emerald-700">
                    ✓
                  </span>

                  {elemento}
                </li>
              ))}

            </ul>

          </div>

          {/* TARJETA DE PRECIO */}

          <div className="relative">

            <div className="absolute -inset-5 rounded-[3rem] bg-gradient-to-r from-emerald-300/30 to-cyan-300/30 blur-2xl" />

            <div className="relative overflow-hidden rounded-[2.5rem] border-4 border-emerald-300 bg-white p-7 shadow-2xl sm:p-9">

              {!mostrarPago ? (
                <div className="text-center">

                  <span className="text-5xl">
                    💎
                  </span>

                  <p className="mt-5 text-sm font-black uppercase tracking-[0.2em] text-emerald-600">
                    Pago único
                  </p>

                  <div className="mt-3 flex items-end justify-center gap-2">

                    <span className="text-5xl font-black text-slate-900 sm:text-6xl">
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
                    onClick={() =>
                      setMostrarPago(true)
                    }
                    className="mt-8 w-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-6 py-5 text-xl font-black text-slate-950 shadow-xl shadow-green-500/20 transition hover:-translate-y-1 hover:brightness-105"
                  >
                    💎 Desbloquear acceso completo
                  </button>

                  <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    Al pulsar el botón se
                    mostrarán los datos para
                    realizar el pago móvil.
                  </p>

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

                    <p className="mt-2 text-sm leading-relaxed text-slate-500">
                      Realiza el pago móvil y
                      envía el comprobante para
                      activar tu acceso.
                    </p>

                  </div>

                  {/* DATOS DE PAGO */}

                  <div className="mt-7 space-y-4 rounded-2xl border border-slate-200 bg-slate-50 p-5">

                    <div className="flex flex-col justify-between gap-1 border-b border-slate-200 pb-3 sm:flex-row">

                      <span className="font-bold text-slate-500">
                        🏦 Banco
                      </span>

                      <span className="font-black text-blue-700">
                        {DATOS_PAGO.banco}
                      </span>

                    </div>

                    <div className="flex flex-col justify-between gap-1 border-b border-slate-200 pb-3 sm:flex-row">

                      <span className="font-bold text-slate-500">
                        📝 Cédula
                      </span>

                      <span className="font-black text-blue-700">
                        {DATOS_PAGO.cedula}
                      </span>

                    </div>

                    <div className="flex flex-col justify-between gap-1 border-b border-slate-200 pb-3 sm:flex-row">

                      <span className="font-bold text-slate-500">
                        📱 Teléfono
                      </span>

                      <span className="font-black text-blue-700">
                        {DATOS_PAGO.telefono}
                      </span>

                    </div>

                    <div className="flex flex-col justify-between gap-1 sm:flex-row">

                      <span className="font-bold text-slate-500">
                        💵 Monto
                      </span>

                      <span className="font-black text-emerald-600">
                        {DATOS_PAGO.monto}
                      </span>

                    </div>

                  </div>

                  <a
                    href={enlaceWhatsApp}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-6 flex w-full items-center justify-center gap-3 rounded-2xl bg-[#25D366] px-5 py-4 text-lg font-black text-white shadow-lg transition hover:-translate-y-1 hover:bg-[#1ebe57]"
                  >
                    <span className="text-2xl">
                      📲
                    </span>

                    Enviar comprobante
                  </a>

                  <button
                    type="button"
                    onClick={() =>
                      setMostrarPago(false)
                    }
                    className="mt-4 w-full py-2 font-bold text-slate-400 underline underline-offset-4 transition hover:text-slate-700"
                  >
                    Cerrar datos de pago
                  </button>

                </div>
              )}

            </div>

          </div>

        </div>

      </section>

      {/* =================================================
          PRUEBA GRATUITA
      ================================================= */}

      <section className="bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 px-5 py-16 text-slate-950 lg:px-8">

        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-8 text-center lg:flex-row lg:text-left">

          <div>

            <span className="inline-flex rounded-full bg-slate-950/10 px-4 py-2 text-sm font-black">
              PRUEBA GRATUITA
            </span>

            <h2 className="mt-4 text-3xl font-black sm:text-4xl">
              ¿Quieres explorar antes de
              activar tu acceso?
            </h2>

            <p className="mt-3 max-w-2xl text-lg font-semibold leading-relaxed text-slate-800">
              Disfruta de 60 minutos para
              conocer la plataforma. Durante
              la prueba podrás visualizar los
              contenidos, pero las descargas
              permanecerán bloqueadas.
            </p>

          </div>

          <button
            type="button"
            onClick={iniciarPruebaExpress}
            className="w-full shrink-0 rounded-full bg-slate-950 px-8 py-5 text-lg font-black text-yellow-300 shadow-2xl transition hover:-translate-y-1 hover:bg-indigo-950 lg:w-auto"
          >
            🛸 Iniciar prueba de 60 minutos
          </button>

        </div>

      </section>

      {/* =================================================
          PREGUNTAS FRECUENTES
      ================================================= */}

      <section
        id="preguntas"
        className="scroll-mt-24 bg-slate-950 px-5 py-20 lg:px-8"
      >

        <div className="mx-auto max-w-4xl">

          <div className="mb-12 text-center">

            <span className="inline-flex rounded-full bg-white/10 px-4 py-2 text-sm font-black text-cyan-200">
              RESOLVEMOS TUS DUDAS
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Preguntas frecuentes
            </h2>

            <p className="mt-4 text-lg text-blue-100/70">
              Consulta la información más
              importante antes de comenzar.
            </p>

          </div>

          <div className="space-y-4">

            {preguntasFrecuentes.map(
              (elemento, indice) => {
                const abierta =
                  preguntaAbierta === indice;

                return (
                  <article
                    key={elemento.pregunta}
                    className="overflow-hidden rounded-2xl border border-white/10 bg-white/5"
                  >

                    <button
                      type="button"
                      onClick={() =>
                        setPreguntaAbierta(
                          abierta
                            ? null
                            : indice,
                        )
                      }
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left font-black text-white sm:px-6"
                      aria-expanded={abierta}
                    >
                      <span>
                        {
                          elemento.pregunta
                        }
                      </span>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl text-cyan-300">
                        {abierta
                          ? "−"
                          : "+"}
                      </span>
                    </button>

                    {abierta && (
                      <div className="border-t border-white/10 px-5 py-5 leading-relaxed text-blue-100/75 sm:px-6">
                        {
                          elemento.respuesta
                        }
                      </div>
                    )}

                  </article>
                );
              },
            )}

          </div>

        </div>

      </section>

      {/* =================================================
          LLAMADO FINAL
      ================================================= */}

      <section className="border-t border-white/10 bg-indigo-950 px-5 py-16 text-center lg:px-8">

        <div className="mx-auto max-w-3xl">

          <span className="text-6xl">
            🌟
          </span>

          <h2 className="mt-5 text-3xl font-black sm:text-4xl">
            El conocimiento está listo para
            despegar
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-blue-100/75">
            Explora la biblioteca, descubre
            herramientas digitales y comienza
            una nueva experiencia de
            aprendizaje.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">

            <button
              type="button"
              onClick={() =>
                router.push(
                  RUTA_BIBLIOTECA,
                )
              }
              className="rounded-full bg-yellow-300 px-7 py-4 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-200"
            >
              📚 Ir a la biblioteca
            </button>

            <button
              type="button"
              onClick={abrirPago}
              className="rounded-full border-2 border-emerald-300 bg-emerald-300/10 px-7 py-4 font-black text-emerald-200 transition hover:-translate-y-1 hover:bg-emerald-300 hover:text-slate-950"
            >
              💎 Activar acceso completo
            </button>

          </div>

        </div>

      </section>

      {/* =================================================
          PIE DE PÁGINA
      ================================================= */}

      <footer className="border-t border-white/10 bg-slate-950 px-5 py-8 text-center">

        <div className="mx-auto max-w-7xl">

          <div className="flex flex-col items-center justify-between gap-5 sm:flex-row">

            <div className="flex items-center gap-3">

              <span className="text-3xl">
                🚀
              </span>

              <div className="text-left">

                <p className="font-black text-yellow-300">
                  MUNDO DIGITAL INFANTIL
                </p>

                <p className="text-xs text-blue-300/60">
                  Aprender · Jugar · Crear
                </p>

              </div>

            </div>

            <p className="text-sm font-bold text-blue-300/50">
              MUNDO DIGITAL INFANTIL © 2026
            </p>

          </div>

        </div>

      </footer>

    </main>
  );
}