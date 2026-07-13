"use client";

import {
  useEffect,
  useMemo,
  useState,
} from "react";

import Link from "next/link";

/* =====================================================
   CONFIGURACIÓN
===================================================== */

const META_MINUTOS = 10;
const META_MILISEGUNDOS =
  META_MINUTOS * 60 * 1000;

const RECOMPENSAS = [
  {
    dias: 3,
    icono: "🌟",
    titulo: "Explorador inicial",
  },
  {
    dias: 7,
    icono: "🏅",
    titulo: "Semana brillante",
  },
  {
    dias: 15,
    icono: "🚀",
    titulo: "Piloto digital",
  },
  {
    dias: 30,
    icono: "👑",
    titulo: "Leyenda estelar",
  },
];

/* =====================================================
   MENSAJES DIARIOS
===================================================== */

const mensajesDiarios = [
  "El domingo es perfecto para organizar una nueva semana de aventuras y aprendizaje. 🌟",
  "¡Lunes con toda la energía! Cada pequeño paso construye grandes conocimientos. 🚀",
  "¡Martes de constancia! Lo que practicas hoy se convierte en una habilidad mañana. 💪",
  "¡Miércoles estelar! Ya llegaste a la mitad de la semana, sigue avanzando. 💛",
  "¡Jueves de descubrimientos! Diez minutos pueden abrir la puerta a una nueva idea. 🧠",
  "¡Viernes de celebración! Termina la semana aprendiendo algo sorprendente. ✨",
  "¡Sábado de diversión! Aprende jugando y fortalece tu racha. 🎉",
];

/* =====================================================
   TIPOS
===================================================== */

type DiaSemana = {
  clave: string;
  nombre: string;
  numero: number;
  esHoy: boolean;
  completado: boolean;
};

type Alerta = {
  tipo: "advertencia" | "exito";
  texto: string;
};

/* =====================================================
   FUNCIONES DE FECHA
===================================================== */

function obtenerClaveFecha(
  fecha: Date,
): string {
  const anio =
    fecha.getFullYear();

  const mes = String(
    fecha.getMonth() + 1,
  ).padStart(2, "0");

  const dia = String(
    fecha.getDate(),
  ).padStart(2, "0");

  return `${anio}-${mes}-${dia}`;
}

function restarDias(
  fecha: Date,
  cantidad: number,
): Date {
  const resultado =
    new Date(fecha);

  resultado.setDate(
    resultado.getDate() -
      cantidad,
  );

  return resultado;
}

function convertirFechaAnterior(
  valor: string | null,
): string {
  if (!valor) {
    return "";
  }

  if (
    /^\d{4}-\d{2}-\d{2}$/.test(
      valor,
    )
  ) {
    return valor;
  }

  const partes =
    valor.split("/");

  if (partes.length !== 3) {
    return "";
  }

  const dia =
    partes[0].padStart(2, "0");

  const mes =
    partes[1].padStart(2, "0");

  const anio =
    partes[2];

  return `${anio}-${mes}-${dia}`;
}

function generarSemana(
  diasCompletados: string[],
): DiaSemana[] {
  const fechaActual =
    new Date();

  const nombresDias = [
    "Dom",
    "Lun",
    "Mar",
    "Mié",
    "Jue",
    "Vie",
    "Sáb",
  ];

  const inicioSemana =
    new Date(fechaActual);

  inicioSemana.setDate(
    fechaActual.getDate() -
      fechaActual.getDay(),
  );

  return nombresDias.map(
    (nombre, indice) => {
      const fecha =
        new Date(inicioSemana);

      fecha.setDate(
        inicioSemana.getDate() +
          indice,
      );

      const clave =
        obtenerClaveFecha(fecha);

      return {
        clave,
        nombre,
        numero:
          fecha.getDate(),
        esHoy:
          clave ===
          obtenerClaveFecha(
            fechaActual,
          ),
        completado:
          diasCompletados.includes(
            clave,
          ),
      };
    },
  );
}

/* =====================================================
   FUNCIONES AUXILIARES
===================================================== */

function leerDiasCompletados(): string[] {
  try {
    const guardados =
      localStorage.getItem(
        "diasPracticaMDI",
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

function formatearTiempo(
  segundosTotales: number,
): string {
  const minutos =
    Math.floor(
      segundosTotales / 60,
    );

  const segundos =
    segundosTotales % 60;

  return `${String(
    minutos,
  ).padStart(2, "0")}:${String(
    segundos,
  ).padStart(2, "0")}`;
}

/* =====================================================
   COMPONENTE
===================================================== */

export default function Calendario() {
  const [racha, setRacha] =
    useState(0);

  const [
    practicadoHoy,
    setPracticadoHoy,
  ] = useState(false);

  const [
    inicioSesion,
    setInicioSesion,
  ] = useState<number | null>(
    null,
  );

  const [
    milisegundosPracticados,
    setMilisegundosPracticados,
  ] = useState(0);

  const [
    diasCompletados,
    setDiasCompletados,
  ] = useState<string[]>([]);

  const [
    diasSemana,
    setDiasSemana,
  ] = useState<DiaSemana[]>([]);

  const [
    mensajeHoy,
    setMensajeHoy,
  ] = useState("");

  const [alerta, setAlerta] =
    useState<Alerta | null>(null);

  const [
    celebrando,
    setCelebrando,
  ] = useState(false);

  /* ===================================================
     INICIAR DATOS
  =================================================== */

  useEffect(() => {
    const fechaActual =
      new Date();

    const hoyClave =
      obtenerClaveFecha(
        fechaActual,
      );

    setMensajeHoy(
      mensajesDiarios[
        fechaActual.getDay()
      ],
    );

    const rachaGuardada =
      Number(
        localStorage.getItem(
          "rachaMDI",
        ) || "0",
      );

    setRacha(
      Number.isFinite(
        rachaGuardada,
      )
        ? rachaGuardada
        : 0,
    );

    const ultimaClaveNueva =
      localStorage.getItem(
        "ultimaPracticaClaveMDI",
      );

    const ultimaFechaAntigua =
      localStorage.getItem(
        "ultimaPracticaMDI",
      );

    const ultimaClave =
      ultimaClaveNueva ||
      convertirFechaAnterior(
        ultimaFechaAntigua,
      );

    let diasGuardados =
      leerDiasCompletados();

    if (
      ultimaClave &&
      !diasGuardados.includes(
        ultimaClave,
      )
    ) {
      diasGuardados = [
        ...diasGuardados,
        ultimaClave,
      ];
    }

    setDiasCompletados(
      diasGuardados,
    );

    setDiasSemana(
      generarSemana(
        diasGuardados,
      ),
    );

    setPracticadoHoy(
      ultimaClave === hoyClave ||
        diasGuardados.includes(
          hoyClave,
        ),
    );

    /* ===============================================
       CONTROL DEL TIEMPO DIARIO
    =============================================== */

    const hoyTexto =
      fechaActual.toLocaleDateString(
        "es-ES",
      );

    const diaGuardado =
      localStorage.getItem(
        "diaSesion",
      );

    let inicioGuardado =
      Number(
        localStorage.getItem(
          "inicioSesionTiempo",
        ) || "0",
      );

    if (
      diaGuardado !==
        hoyTexto ||
      !inicioGuardado
    ) {
      inicioGuardado =
        Date.now();

      localStorage.setItem(
        "diaSesion",
        hoyTexto,
      );

      localStorage.setItem(
        "inicioSesionTiempo",
        inicioGuardado.toString(),
      );
    }

    setInicioSesion(
      inicioGuardado,
    );
  }, []);

  /* ===================================================
     CRONÓMETRO EN VIVO
  =================================================== */

  useEffect(() => {
    if (!inicioSesion) {
      return;
    }

    const actualizarTiempo =
      () => {
        if (practicadoHoy) {
          setMilisegundosPracticados(
            META_MILISEGUNDOS,
          );

          return;
        }

        const transcurrido =
          Math.max(
            0,
            Date.now() -
              inicioSesion,
          );

        setMilisegundosPracticados(
          Math.min(
            transcurrido,
            META_MILISEGUNDOS,
          ),
        );
      };

    actualizarTiempo();

    const intervalo =
      window.setInterval(
        actualizarTiempo,
        1000,
      );

    return () => {
      window.clearInterval(
        intervalo,
      );
    };
  }, [
    inicioSesion,
    practicadoHoy,
  ]);

  /* ===================================================
     CÁLCULOS
  =================================================== */

  const progreso = Math.min(
    100,
    Math.round(
      (milisegundosPracticados /
        META_MILISEGUNDOS) *
        100,
    ),
  );

  const segundosRestantes =
    Math.max(
      0,
      Math.ceil(
        (META_MILISEGUNDOS -
          milisegundosPracticados) /
          1000,
      ),
    );

  const minutosPracticados =
    Math.min(
      META_MINUTOS,
      Math.floor(
        milisegundosPracticados /
          60000,
      ),
    );

  const proximaRecompensa =
    useMemo(() => {
      return (
        RECOMPENSAS.find(
          (recompensa) =>
            recompensa.dias >
            racha,
        ) || {
          dias: 50,
          icono: "🌌",
          titulo:
            "Maestro del universo",
        }
      );
    }, [racha]);

  const diasParaPremio =
    Math.max(
      0,
      proximaRecompensa.dias -
        racha,
    );

  /* ===================================================
     VALIDAR Y COMPLETAR META
  =================================================== */

  const validarTiempoYPracticar =
    () => {
      if (practicadoHoy) {
        return;
      }

      if (
        milisegundosPracticados <
        META_MILISEGUNDOS
      ) {
        setAlerta({
          tipo: "advertencia",
          texto:
            `Todavía faltan ${formatearTiempo(
              segundosRestantes,
            )} para completar la misión. ` +
            "Continúa explorando la Biblioteca Estelar o el Laboratorio Tech.",
        });

        window.setTimeout(() => {
          setAlerta(null);
        }, 7000);

        return;
      }

      const fechaActual =
        new Date();

      const hoyClave =
        obtenerClaveFecha(
          fechaActual,
        );

      const ayerClave =
        obtenerClaveFecha(
          restarDias(
            fechaActual,
            1,
          ),
        );

      const ultimaClaveNueva =
        localStorage.getItem(
          "ultimaPracticaClaveMDI",
        );

      const ultimaClaveAntigua =
        convertirFechaAnterior(
          localStorage.getItem(
            "ultimaPracticaMDI",
          ),
        );

      const ultimaClave =
        ultimaClaveNueva ||
        ultimaClaveAntigua;

      let nuevaRacha = 1;

      if (
        ultimaClave ===
        ayerClave
      ) {
        nuevaRacha =
          racha + 1;
      }

      if (
        ultimaClave ===
        hoyClave
      ) {
        nuevaRacha =
          racha;
      }

      const nuevosDias =
        Array.from(
          new Set([
            ...diasCompletados,
            hoyClave,
          ]),
        );

      setRacha(nuevaRacha);
      setPracticadoHoy(true);
      setDiasCompletados(
        nuevosDias,
      );

      setDiasSemana(
        generarSemana(
          nuevosDias,
        ),
      );

      localStorage.setItem(
        "rachaMDI",
        nuevaRacha.toString(),
      );

      localStorage.setItem(
        "ultimaPracticaMDI",
        fechaActual.toLocaleDateString(
          "es-ES",
        ),
      );

      localStorage.setItem(
        "ultimaPracticaClaveMDI",
        hoyClave,
      );

      localStorage.setItem(
        "diasPracticaMDI",
        JSON.stringify(
          nuevosDias,
        ),
      );

      setAlerta({
        tipo: "exito",
        texto:
          "¡Misión completada! Tu constancia hizo crecer la racha de aprendizaje.",
      });

      setCelebrando(true);

      window.setTimeout(() => {
        setCelebrando(false);
      }, 4500);
    };

  /* ===================================================
     PÁGINA
  =================================================== */

  return (
    <main className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-indigo-950 to-purple-950 px-4 pb-24 pt-24 text-white sm:px-6">
      {/* FONDO ESPACIAL */}

      <div className="pointer-events-none absolute -left-44 top-10 h-[36rem] w-[36rem] rounded-full bg-blue-600/25 blur-3xl" />

      <div className="pointer-events-none absolute -right-44 top-32 h-[34rem] w-[34rem] rounded-full bg-fuchsia-600/20 blur-3xl" />

      <div className="pointer-events-none absolute bottom-0 left-1/3 h-96 w-96 rounded-full bg-cyan-500/15 blur-3xl" />

      <span className="pointer-events-none absolute left-[7%] top-48 hidden text-6xl opacity-50 lg:block">
        🚀
      </span>

      <span className="pointer-events-none absolute right-[8%] top-60 hidden text-7xl opacity-50 lg:block">
        🪐
      </span>

      <span className="pointer-events-none absolute left-[12%] top-[65%] hidden text-4xl opacity-40 lg:block">
        ⭐
      </span>

      <span className="pointer-events-none absolute right-[12%] top-[72%] hidden text-4xl opacity-40 lg:block">
        🏆
      </span>

      {/* CELEBRACIÓN */}

      {celebrando && (
        <div className="pointer-events-none fixed inset-0 z-[9999] flex items-center justify-center overflow-hidden bg-slate-950/50 backdrop-blur-sm">
          {[
            "🎉",
            "⭐",
            "🚀",
            "💛",
            "🏆",
            "✨",
            "🌟",
            "🎊",
          ].map(
            (emoji, indice) => (
              <span
                key={`${emoji}-${indice}`}
                className="absolute animate-bounce text-4xl sm:text-6xl"
                style={{
                  left: `${8 + indice * 12}%`,
                  top: `${
                    10 +
                    (indice % 3) *
                      27
                  }%`,
                  animationDelay: `${indice * 120}ms`,
                }}
              >
                {emoji}
              </span>
            ),
          )}

          <div className="relative mx-5 max-w-md rounded-[2.5rem] border border-yellow-300/40 bg-gradient-to-br from-slate-900 to-indigo-950 p-8 text-center shadow-2xl shadow-yellow-500/20">
            <div className="text-8xl">
              🏆
            </div>

            <h2 className="mt-5 bg-gradient-to-r from-yellow-300 to-pink-300 bg-clip-text text-4xl font-black text-transparent">
              ¡Misión cumplida!
            </h2>

            <p className="mt-3 text-lg font-bold text-blue-100">
              Tu racha ahora es de{" "}
              <strong className="text-yellow-300">
                {racha} días
              </strong>
              .
            </p>
          </div>
        </div>
      )}

      <div className="relative z-10 mx-auto max-w-7xl">
        {/* ENCABEZADO */}

        <header className="mx-auto mb-10 max-w-4xl text-center">
          <span className="inline-flex items-center gap-2 rounded-full border border-yellow-300/30 bg-yellow-300/10 px-4 py-2 text-sm font-black tracking-wide text-yellow-200 backdrop-blur">
            🚀 CONSTANCIA QUE TRANSFORMA
          </span>

          <h1 className="mt-5 bg-gradient-to-r from-yellow-300 via-pink-300 to-cyan-300 bg-clip-text text-4xl font-black leading-tight text-transparent drop-shadow-lg md:text-6xl">
            Misión de Racha
          </h1>

          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-blue-100/75 md:text-lg">
            Completa al menos 10 minutos de
            aprendizaje cada día, reúne estrellas
            y conviértete en una leyenda digital.
          </p>
        </header>

        {/* ALERTA */}

        {alerta && (
          <div
            role="status"
            className={`mx-auto mb-8 max-w-4xl rounded-3xl border p-5 text-center font-bold shadow-xl backdrop-blur-xl ${
              alerta.tipo === "exito"
                ? "border-emerald-300/30 bg-emerald-300/10 text-emerald-200"
                : "border-amber-300/30 bg-amber-300/10 text-amber-200"
            }`}
          >
            {alerta.tipo === "exito"
              ? "🎉 "
              : "⏳ "}

            {alerta.texto}
          </div>
        )}

        {/* PANEL PRINCIPAL */}

        <section className="grid gap-7 lg:grid-cols-[1.15fr_0.85fr]">
          {/* RACHA Y PROGRESO */}

          <article className="relative overflow-hidden rounded-[2.5rem] border border-white/10 bg-slate-900/75 p-6 shadow-2xl shadow-black/25 backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-16 -top-16 text-[13rem] opacity-[0.05]">
              🚀
            </div>

            <div className="relative">
              <div className="flex flex-col items-center justify-between gap-8 sm:flex-row">
                {/* CÍRCULO DE PROGRESO */}

                <div
                  className="relative flex h-56 w-56 shrink-0 items-center justify-center rounded-full p-3 shadow-2xl"
                  style={{
                    background: `conic-gradient(
                      #67e8f9 ${progreso}%,
                      rgba(255,255,255,0.08) ${progreso}%
                    )`,
                  }}
                >
                  <div className="flex h-full w-full flex-col items-center justify-center rounded-full border border-white/10 bg-slate-950">
                    <span className="text-5xl">
                      {practicadoHoy
                        ? "🏆"
                        : "🚀"}
                    </span>

                    <strong className="mt-2 text-4xl font-black text-cyan-300">
                      {progreso}%
                    </strong>

                    <span className="mt-1 text-xs font-black uppercase tracking-[0.18em] text-blue-100/45">
                      Misión diaria
                    </span>
                  </div>
                </div>

                {/* INFORMACIÓN */}

                <div className="flex-1 text-center sm:text-left">
                  <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-300">
                    Racha actual
                  </p>

                  <div className="mt-3 flex items-center justify-center gap-4 sm:justify-start">
                    <span className="text-6xl">
                      🔥
                    </span>

                    <strong className="bg-gradient-to-r from-yellow-300 to-orange-400 bg-clip-text text-7xl font-black text-transparent">
                      {racha}
                    </strong>
                  </div>

                  <h2 className="mt-2 text-2xl font-black text-white">
                    {racha === 1
                      ? "día consecutivo"
                      : "días consecutivos"}
                  </h2>

                  <p className="mt-3 leading-relaxed text-blue-100/60">
                    Cada día completado fortalece
                    el hábito de aprender y
                    desbloquea nuevas recompensas.
                  </p>
                </div>
              </div>

              {/* DATOS DE TIEMPO */}

              <div className="mt-8 grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-2xl font-black text-cyan-300">
                    {minutosPracticados}
                  </p>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-blue-100/45">
                    Minutos logrados
                  </p>
                </div>

                <div className="rounded-2xl border border-white/10 bg-white/5 p-4 text-center">
                  <p className="text-2xl font-black text-yellow-300">
                    {practicadoHoy
                      ? "00:00"
                      : formatearTiempo(
                          segundosRestantes,
                        )}
                  </p>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-blue-100/45">
                    Tiempo restante
                  </p>
                </div>

                <div className="col-span-2 rounded-2xl border border-white/10 bg-white/5 p-4 text-center sm:col-span-1">
                  <p className="text-2xl font-black text-pink-300">
                    {META_MINUTOS}
                  </p>

                  <p className="mt-1 text-xs font-bold uppercase tracking-wide text-blue-100/45">
                    Meta diaria
                  </p>
                </div>
              </div>

              {/* BOTÓN */}

              <button
                type="button"
                onClick={
                  validarTiempoYPracticar
                }
                disabled={practicadoHoy}
                className={`mt-7 flex w-full items-center justify-center gap-3 rounded-2xl px-6 py-4 text-lg font-black shadow-xl transition ${
                  practicadoHoy
                    ? "cursor-default bg-gradient-to-r from-emerald-300 to-cyan-300 text-emerald-950"
                    : progreso >= 100
                      ? "animate-pulse bg-gradient-to-r from-yellow-300 via-orange-400 to-pink-400 text-slate-950 hover:-translate-y-1"
                      : "bg-gradient-to-r from-pink-400 to-violet-500 text-white hover:-translate-y-1 hover:brightness-110"
                }`}
              >
                {practicadoHoy
                  ? "✅ Misión del día completada"
                  : progreso >= 100
                    ? "🏆 Reclamar mi estrella diaria"
                    : `⏱️ Progreso diario: ${progreso}%`}
              </button>

              {!practicadoHoy &&
                progreso < 100 && (
                  <Link
                    href="/biblioteca"
                    className="mt-3 flex w-full items-center justify-center gap-2 rounded-2xl border border-cyan-300/25 bg-cyan-300/10 px-6 py-4 font-black text-cyan-200 transition hover:bg-cyan-300/15"
                  >
                    📚 Continuar practicando
                  </Link>
                )}
            </div>
          </article>

          {/* RECOMPENSA */}

          <aside className="relative overflow-hidden rounded-[2.5rem] border border-yellow-300/20 bg-gradient-to-br from-yellow-300/10 to-pink-400/10 p-6 shadow-2xl backdrop-blur-xl sm:p-8">
            <div className="pointer-events-none absolute -right-10 -top-10 text-[10rem] opacity-10">
              {proximaRecompensa.icono}
            </div>

            <div className="relative">
              <p className="text-xs font-black uppercase tracking-[0.2em] text-yellow-300">
                Próxima recompensa
              </p>

              <div className="mt-5 flex h-24 w-24 items-center justify-center rounded-3xl bg-gradient-to-br from-yellow-300 via-orange-400 to-pink-400 text-5xl shadow-2xl">
                {proximaRecompensa.icono}
              </div>

              <h2 className="mt-5 text-3xl font-black text-white">
                {proximaRecompensa.titulo}
              </h2>

              <p className="mt-3 leading-relaxed text-blue-100/65">
                Te faltan{" "}
                <strong className="text-yellow-300">
                  {diasParaPremio} días
                </strong>{" "}
                para desbloquear esta insignia.
              </p>

              <div className="mt-6 h-4 overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-yellow-300 to-pink-400 transition-all duration-700"
                  style={{
                    width: `${Math.min(
                      100,
                      (racha /
                        proximaRecompensa.dias) *
                        100,
                    )}%`,
                  }}
                />
              </div>

              <p className="mt-3 text-right text-sm font-black text-yellow-200">
                {racha}/
                {proximaRecompensa.dias} días
              </p>

              <div className="mt-7 rounded-2xl border border-white/10 bg-slate-950/30 p-4">
                <p className="text-sm font-bold leading-relaxed text-blue-100/70">
                  💡 {mensajeHoy}
                </p>
              </div>
            </div>
          </aside>
        </section>

        {/* SEMANA */}

        <section className="mt-8 rounded-[2.5rem] border border-white/10 bg-slate-900/70 p-5 shadow-2xl backdrop-blur-xl sm:p-8">
          <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-cyan-300">
                Registro semanal
              </p>

              <h2 className="mt-1 text-3xl font-black text-white">
                Tu mapa de constancia
              </h2>
            </div>

            <p className="text-sm font-bold text-blue-100/50">
              Completa la misión cada día
              para iluminar toda la semana.
            </p>
          </div>

          <div className="mt-7 grid grid-cols-4 gap-3 sm:grid-cols-7">
            {diasSemana.map(
              (dia) => (
                <article
                  key={dia.clave}
                  className={`relative flex min-h-28 flex-col items-center justify-center rounded-2xl border p-3 text-center transition ${
                    dia.completado
                      ? "border-emerald-300/40 bg-gradient-to-br from-emerald-300/20 to-cyan-300/10 shadow-lg shadow-emerald-950/20"
                      : dia.esHoy
                        ? "border-pink-300/50 bg-pink-300/15 ring-2 ring-pink-300/10"
                        : "border-white/10 bg-white/5"
                  }`}
                >
                  {dia.esHoy && (
                    <span className="absolute -top-2 rounded-full bg-pink-300 px-2 py-1 text-[9px] font-black uppercase text-pink-950">
                      Hoy
                    </span>
                  )}

                  <span
                    className={`text-xs font-black uppercase tracking-wide ${
                      dia.completado
                        ? "text-emerald-200"
                        : dia.esHoy
                          ? "text-pink-200"
                          : "text-blue-100/40"
                    }`}
                  >
                    {dia.nombre}
                  </span>

                  <strong className="mt-1 text-2xl font-black text-white">
                    {dia.numero}
                  </strong>

                  <span className="mt-2 text-2xl">
                    {dia.completado
                      ? "⭐"
                      : dia.esHoy
                        ? "🚀"
                        : "○"}
                  </span>
                </article>
              ),
            )}
          </div>
        </section>

        {/* COLECCIÓN DE INSIGNIAS */}

        <section className="mt-8">
          <div className="mb-5 text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-pink-300">
              Colección personal
            </p>

            <h2 className="mt-2 text-3xl font-black text-white">
              Insignias de aprendizaje
            </h2>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {RECOMPENSAS.map(
              (recompensa) => {
                const desbloqueada =
                  racha >=
                  recompensa.dias;

                return (
                  <article
                    key={
                      recompensa.dias
                    }
                    className={`relative overflow-hidden rounded-3xl border p-6 text-center shadow-xl backdrop-blur transition ${
                      desbloqueada
                        ? "border-yellow-300/35 bg-gradient-to-br from-yellow-300/20 to-pink-400/15"
                        : "border-white/10 bg-white/5 opacity-60"
                    }`}
                  >
                    <div
                      className={`mx-auto flex h-20 w-20 items-center justify-center rounded-3xl text-4xl ${
                        desbloqueada
                          ? "bg-gradient-to-br from-yellow-300 to-pink-400 shadow-xl"
                          : "bg-white/10 grayscale"
                      }`}
                    >
                      {desbloqueada
                        ? recompensa.icono
                        : "🔒"}
                    </div>

                    <h3 className="mt-4 font-black text-white">
                      {recompensa.titulo}
                    </h3>

                    <p className="mt-2 text-sm font-bold text-blue-100/50">
                      {recompensa.dias} días
                      consecutivos
                    </p>

                    {desbloqueada && (
                      <span className="mt-4 inline-flex rounded-full bg-emerald-300 px-3 py-1 text-xs font-black text-emerald-950">
                        ✅ Desbloqueada
                      </span>
                    )}
                  </article>
                );
              },
            )}
          </div>
        </section>
      </div>
    </main>
  );
}