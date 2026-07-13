"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

/* =====================================================
   CONFIGURACIÓN

   La única ruta directa disponible desde esta portada
   será la prueba gratuita de 60 minutos.
===================================================== */

const RUTA_PRUEBA = "/tecnologia";

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
      "La plataforma puede utilizarse desde teléfonos, tabletas y computadoras.",
    color: "from-violet-500 to-fuchsia-400",
  },
  {
    emoji: "⬇️",
    titulo: "Materiales descargables",
    descripcion:
      "Con el acceso completo podrás descargar los recursos educativos disponibles.",
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
      "La plataforma continúa incorporando materiales y herramientas digitales.",
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
      "No. El monto mostrado corresponde a un pago único para activar el acceso completo.",
  },
  {
    pregunta: "¿Cuánto tiempo dura el acceso?",
    respuesta:
      "El acceso completo es ilimitado y no requiere pagos mensuales.",
  },
  {
    pregunta: "¿Puedo descargar los materiales?",
    respuesta:
      "Sí. Las descargas estarán disponibles después de activar el acceso completo.",
  },
  {
    pregunta: "¿Cómo se activa mi acceso?",
    respuesta:
      "Realiza el pago móvil, envía el comprobante mediante WhatsApp y espera la confirmación.",
  },
  {
    pregunta: "¿Puedo utilizar la plataforma desde el teléfono?",
    respuesta:
      "Sí. La plataforma está diseñada para funcionar en teléfonos, tabletas y computadoras.",
  },
  {
    pregunta: "¿Qué incluye la prueba gratuita?",
    respuesta:
      "La prueba permite explorar la plataforma durante 60 minutos. Las descargas permanecen bloqueadas.",
  },
];

/* =====================================================
   COMPONENTE PRINCIPAL
===================================================== */

export default function InicioLanding() {
  const router = useRouter();

  const [mostrarPago, setMostrarPago] = useState(false);
  const [menuAbierto, setMenuAbierto] = useState(false);
  const [preguntaAbierta, setPreguntaAbierta] =
    useState<number | null>(null);

  /* ===================================================
     PRUEBA GRATUITA DE 60 MINUTOS

     Este es el único botón que permite entrar
     temporalmente a la plataforma.
  =================================================== */

  const iniciarPruebaExpress = () => {
    const ahora = new Date().getTime();
    const limite = ahora + 60 * 60 * 1000;

    localStorage.setItem(
      "limitePrueba",
      limite.toString(),
    );

    localStorage.removeItem("accesoVIP");

    router.push(RUTA_PRUEBA);
  };

  /* ===================================================
     DESPLAZAMIENTO ENTRE SECCIONES
  =================================================== */

  const irASeccion = (id: string) => {
    const seccion = document.getElementById(id);

    if (seccion) {
      seccion.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }

    setMenuAbierto(false);
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
     WHATSAPP
  =================================================== */

  const mensajeWhatsApp =
    "Hola, ya realicé mi pago móvil para Mundo Digital Infantil. Aquí está el comprobante:";

  const enlaceWhatsApp = `https://wa.me/${
    DATOS_PAGO.whatsapp
  }?text=${encodeURIComponent(mensajeWhatsApp)}`;

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

            <button
              type="button"
              onClick={abrirPago}
              className="rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-5 py-2.5 font-black text-slate-950 shadow-lg shadow-green-500/20 transition hover:-translate-y-0.5 hover:brightness-110"
            >
              Activar acceso
            </button>
          </nav>

          {/* MENÚ MÓVIL */}

          <button
            type="button"
            onClick={() => setMenuAbierto(!menuAbierto)}
            className="flex h-11 w-11 items-center justify-center rounded-xl border border-white/15 bg-white/10 text-2xl lg:hidden"
            aria-label="Abrir menú"
            aria-expanded={menuAbierto}
          >
            {menuAbierto ? "×" : "☰"}
          </button>
        </div>

        {menuAbierto && (
          <nav className="border-t border-white/10 bg-slate-950 px-5 py-5 lg:hidden">
            <div className="mx-auto flex max-w-7xl flex-col gap-3">
              <button
                type="button"
                onClick={() => irASeccion("contenido")}
                className="rounded-xl bg-white/5 px-4 py-3 text-left font-bold text-blue-100"
              >
                🌌 Contenido
              </button>

              <button
                type="button"
                onClick={() => irASeccion("beneficios")}
                className="rounded-xl bg-white/5 px-4 py-3 text-left font-bold text-blue-100"
              >
                ✨ Beneficios
              </button>

              <button
                type="button"
                onClick={() =>
                  irASeccion("como-funciona")
                }
                className="rounded-xl bg-white/5 px-4 py-3 text-left font-bold text-blue-100"
              >
                🛸 Cómo funciona
              </button>

              <button
                type="button"
                onClick={() => irASeccion("preguntas")}
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
                💎 Activar acceso completo
              </button>
            </div>
          </nav>
        )}
      </header>

      {/* =================================================
          ENCABEZADO PRINCIPAL
      ================================================= */}

      <section className="relative isolate overflow-hidden">
        <div className="pointer-events-none absolute -left-32 top-20 h-96 w-96 rounded-full bg-blue-600/30 blur-3xl" />

        <div className="pointer-events-none absolute -right-32 top-5 h-96 w-96 rounded-full bg-fuchsia-600/25 blur-3xl" />

        <div className="pointer-events-none absolute bottom-0 left-1/3 h-80 w-80 rounded-full bg-cyan-500/20 blur-3xl" />

        <div className="pointer-events-none absolute left-[8%] top-24 hidden text-5xl lg:block">
          🚀
        </div>

        <div className="pointer-events-none absolute right-[10%] top-32 hidden text-6xl lg:block">
          🪐
        </div>

        <div className="relative mx-auto grid min-h-[760px] max-w-7xl items-center gap-12 px-5 py-20 lg:grid-cols-2 lg:px-8 lg:py-24">
          {/* TEXTO */}

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
              Materiales educativos, actividades
              infantiles y herramientas digitales
              reunidas en una plataforma para
              familias, docentes y creadores.
            </p>

            {/* ÚNICO BOTÓN DE ENTRADA */}

            <div className="mt-9 flex justify-center lg:justify-start">
              <button
                type="button"
                onClick={iniciarPruebaExpress}
                className="w-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-8 py-4 text-lg font-black text-slate-950 shadow-xl shadow-orange-500/20 transition hover:-translate-y-1 hover:brightness-110 sm:w-auto"
              >
                🛸 Probar gratis durante 60 minutos
              </button>
            </div>

            <p className="mx-auto mt-4 max-w-xl text-sm font-medium text-blue-200/70 lg:mx-0">
              Durante la prueba podrás explorar el
              contenido, pero las descargas estarán
              bloqueadas.
            </p>

            {/* INDICADORES */}

            <div className="mt-10 grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[
                ["📚", "Materiales"],
                ["🎮", "Actividades"],
                ["🤖", "Tecnología"],
                ["♾️", "Acceso completo"],
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

          {/* TARJETA INFORMATIVA */}

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
                {/* BIBLIOTECA SIN BOTÓN */}

                <article className="rounded-3xl bg-gradient-to-br from-blue-500 to-cyan-400 p-5 text-left shadow-xl">
                  <span className="text-4xl">
                    📚
                  </span>

                  <h3 className="mt-5 text-xl font-black">
                    Biblioteca Estelar
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-blue-50">
                    Guías, cuentos, juegos,
                    matemáticas, caligrafía y muchos
                    materiales educativos.
                  </p>

                  <span className="mt-5 inline-flex rounded-full bg-white/20 px-3 py-2 text-xs font-black">
                    🔒 Acceso protegido
                  </span>
                </article>

                {/* TECNOLOGÍA SIN BOTÓN */}

                <article className="rounded-3xl bg-gradient-to-br from-violet-500 to-fuchsia-500 p-5 text-left shadow-xl">
                  <span className="text-4xl">
                    🤖
                  </span>

                  <h3 className="mt-5 text-xl font-black">
                    Laboratorio Tech
                  </h3>

                  <p className="mt-2 text-sm leading-relaxed text-violet-50">
                    Inteligencia artificial,
                    automatización, marketing y
                    recursos digitales.
                  </p>

                  <span className="mt-5 inline-flex rounded-full bg-white/20 px-3 py-2 text-xs font-black">
                    🔒 Acceso protegido
                  </span>
                </article>
              </div>

              <div className="mt-4 rounded-3xl border border-white/10 bg-slate-950/30 p-5">
                <div className="flex items-center gap-4">
                  <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-yellow-300 text-3xl">
                    💡
                  </span>

                  <div>
                    <h3 className="font-black text-yellow-200">
                      Conoce antes de decidir
                    </h3>

                    <p className="mt-1 text-sm leading-relaxed text-blue-100">
                      Utiliza la prueba gratuita para
                      descubrir la plataforma antes de
                      activar el acceso completo.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* =================================================
          CONTENIDO DE LA PLATAFORMA
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

            <p className="mt-4 text-lg leading-relaxed text-blue-100/75">
              La portada muestra el contenido disponible,
              pero el ingreso se realiza mediante la
              prueba gratuita o el acceso completo.
            </p>
          </div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* UNIVERSO INFANTIL */}

            <article className="relative overflow-hidden rounded-[2.5rem] border border-cyan-300/20 bg-gradient-to-br from-blue-600/30 to-cyan-500/10 p-7 shadow-2xl backdrop-blur sm:p-9">
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
                  Un espacio educativo con recursos para
                  fortalecer diferentes áreas del
                  aprendizaje.
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
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold text-blue-50"
                    >
                      {elemento}
                    </div>
                  ))}
                </div>

                <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-cyan-200/30 bg-cyan-300/15 px-6 py-3 font-black text-cyan-100">
                  🔒 Disponible con la prueba o el
                  acceso completo
                </div>
              </div>
            </article>

            {/* ZONA DE ADULTOS */}

            <article className="relative overflow-hidden rounded-[2.5rem] border border-fuchsia-300/20 bg-gradient-to-br from-violet-600/30 to-fuchsia-500/10 p-7 shadow-2xl backdrop-blur sm:p-9">
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
                  Herramientas digitales para aprender,
                  crear contenido y mejorar diferentes
                  proyectos.
                </p>

                <div className="mt-7 grid gap-3 sm:grid-cols-2">
                  {[
                    "🤖 Inteligencia artificial",
                    "⚙️ Automatización",
                    "📊 Google Sheets",
                    "📣 Marketing digital",
                    "🎨 Diseño para redes",
                    "🗓️ Calendarios de contenido",
                    "🧠 Recursos de productividad",
                    "📱 Herramientas digitales",
                  ].map((elemento) => (
                    <div
                      key={elemento}
                      className="rounded-2xl border border-white/10 bg-white/10 px-4 py-3 font-bold text-violet-50"
                    >
                      {elemento}
                    </div>
                  ))}
                </div>

                <div className="mt-8 inline-flex items-center gap-2 rounded-full border border-fuchsia-200/30 bg-fuchsia-300/15 px-6 py-3 font-black text-fuchsia-100">
                  🔒 Disponible con la prueba o el
                  acceso completo
                </div>
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
              Una plataforma creada para facilitar el
              aprendizaje
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-slate-600">
              Recursos organizados, prácticos y fáciles
              de utilizar desde cualquier dispositivo.
            </p>
          </div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {beneficios.map((beneficio) => (
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
            <span className="inline-flex rounded-full border border-yellow-300/20 bg-yellow-300/10 px-4 py-2 text-sm font-black text-yellow-200">
              COMENZAR ES MUY FÁCIL
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Elige cómo quieres comenzar
            </h2>

            <p className="mt-4 text-lg leading-relaxed text-blue-100/75">
              Puedes conocer la plataforma durante 60
              minutos o activar directamente el acceso
              completo.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                numero: "01",
                emoji: "🔍",
                titulo: "Conoce la propuesta",
                descripcion:
                  "Revisa todo el contenido y los beneficios presentados en esta página.",
              },
              {
                numero: "02",
                emoji: "🛸",
                titulo: "Utiliza la prueba",
                descripcion:
                  "Explora la plataforma durante 60 minutos con las descargas bloqueadas.",
              },
              {
                numero: "03",
                emoji: "💎",
                titulo: "Activa el acceso",
                descripcion:
                  "Realiza el pago y envía el comprobante para habilitar todas las funciones.",
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

          <div className="mt-10 flex justify-center">
            <button
              type="button"
              onClick={iniciarPruebaExpress}
              className="w-full rounded-full bg-gradient-to-r from-yellow-300 to-orange-400 px-8 py-4 text-lg font-black text-slate-950 shadow-xl transition hover:-translate-y-1 hover:brightness-110 sm:w-auto"
            >
              🛸 Iniciar prueba de 60 minutos
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
          {/* INFORMACIÓN */}

          <div>
            <span className="inline-flex rounded-full bg-emerald-100 px-4 py-2 text-sm font-black text-emerald-700">
              ACCESO COMPLETO
            </span>

            <h2 className="mt-5 text-4xl font-black sm:text-5xl">
              Desbloquea todo el universo digital
            </h2>

            <p className="mt-5 text-lg leading-relaxed text-slate-600">
              Obtén acceso ilimitado a la biblioteca
              educativa y al laboratorio de herramientas
              digitales.
            </p>

            <ul className="mt-8 space-y-4">
              {[
                "Acceso ilimitado a la plataforma",
                "Biblioteca educativa completa",
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

          {/* TARJETA DE PAGO */}

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
                    onClick={() => setMostrarPago(true)}
                    className="mt-8 w-full rounded-full bg-gradient-to-r from-emerald-400 to-green-500 px-6 py-5 text-xl font-black text-slate-950 shadow-xl shadow-green-500/20 transition hover:-translate-y-1 hover:brightness-105"
                  >
                    💎 Mostrar datos de pago
                  </button>

                  <p className="mt-4 text-sm leading-relaxed text-slate-500">
                    Después del pago deberás enviar el
                    comprobante por WhatsApp.
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
                      Realiza el pago móvil y envía el
                      comprobante para activar tu acceso.
                    </p>
                  </div>

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
                    onClick={() => setMostrarPago(false)}
                    className="mt-4 w-full py-2 font-bold text-slate-400 underline underline-offset-4 transition hover:text-slate-700"
                  >
                    Ocultar datos de pago
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
              ¿Quieres explorar antes de activar tu
              acceso?
            </h2>

            <p className="mt-3 max-w-2xl text-lg font-semibold leading-relaxed text-slate-800">
              Disfruta de 60 minutos para conocer la
              plataforma. Podrás visualizar el contenido,
              pero las descargas permanecerán bloqueadas.
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
              Consulta la información más importante
              antes de comenzar.
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
                          abierta ? null : indice,
                        )
                      }
                      className="flex w-full items-center justify-between gap-5 px-5 py-5 text-left font-black text-white sm:px-6"
                      aria-expanded={abierta}
                    >
                      <span>{elemento.pregunta}</span>

                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-xl text-cyan-300">
                        {abierta ? "−" : "+"}
                      </span>
                    </button>

                    {abierta && (
                      <div className="border-t border-white/10 px-5 py-5 leading-relaxed text-blue-100/75 sm:px-6">
                        {elemento.respuesta}
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
            El conocimiento está listo para despegar
          </h2>

          <p className="mt-4 text-lg leading-relaxed text-blue-100/75">
            Conoce la plataforma mediante la prueba
            gratuita o activa el acceso completo para
            disfrutar de todos los recursos.
          </p>

          <div className="mt-8 flex flex-col justify-center gap-4 sm:flex-row">
            <button
              type="button"
              onClick={iniciarPruebaExpress}
              className="rounded-full bg-yellow-300 px-7 py-4 font-black text-slate-950 transition hover:-translate-y-1 hover:bg-yellow-200"
            >
              🛸 Probar gratis 60 minutos
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