"use client";
import { useState, useEffect } from "react";

// Mensajes motivadores diferentes para cada día de la semana
const mensajesDiarios = [
  "¡El domingo es perfecto para organizar la semana y aprender jugando! 🌟",
  "¡Lunes con toda la energía! Cada pequeño paso cuenta. 🚀",
  "¡Martes de constancia! La práctica de hoy es el éxito de mañana. 💪",
  "¡Miércoles! Ya estamos a mitad de semana, ¡no te detengas! 💛",
  "¡Jueves! El secreto es la constancia: 10 minutos al día marcan la diferencia. 🧠",
  "¡Viernes! Cerremos la semana de práctica con broche de oro. ✨",
  "¡Sábado de diversión y aprendizaje! Sigue sumando a tu racha. 🎉"
];

export default function Calendario() {
  const [racha, setRacha] = useState(0);
  const [practicadoHoy, setPracticadoHoy] = useState(false);
  const [alerta, setAlerta] = useState("");
  const [mensajeHoy, setMensajeHoy] = useState("");
  const [diasSemana, setDiasSemana] = useState<{nombre: string, numero: number, esHoy: boolean}[]>([]);

  useEffect(() => {
    // Configurar el mensaje del día
    const fechaActual = new Date();
    setMensajeHoy(mensajesDiarios[fechaActual.getDay()]);

    // Generar los días de la semana actual para la vista visual
    const dias = [];
    const nombresDias = ["Dom", "Lun", "Mar", "Mié", "Jue", "Vie", "Sáb"];
    for (let i = 0; i < 7; i++) {
      const dia = new Date();
      dia.setDate(fechaActual.getDate() - fechaActual.getDay() + i);
      dias.push({
        nombre: nombresDias[i],
        numero: dia.getDate(),
        esHoy: i === fechaActual.getDay()
      });
    }
    setDiasSemana(dias);

    // Cargar datos de racha y estado de hoy
    const rachaGuardada = localStorage.getItem("rachaMDI") || "0";
    setRacha(parseInt(rachaGuardada));
    
    const ultimaPractica = localStorage.getItem("ultimaPracticaMDI");
    if (ultimaPractica === fechaActual.toLocaleDateString("es-ES")) {
      setPracticadoHoy(true);
    }
  }, []);

  const validarTiempoYPracticar = () => {
    if (practicadoHoy) return;

    // Buscar a qué hora empezó a usar la app hoy (lo guardamos en el Menú)
    const inicioSesion = localStorage.getItem("inicioSesionTiempo");
    if (!inicioSesion) {
      setAlerta("Hubo un error calculando tu tiempo. Por favor recarga la página.");
      return;
    }

    // Calcular cuántos minutos han pasado
    const tiempoPasadoMs = Date.now() - parseInt(inicioSesion);
    const minutosTranscurridos = Math.floor(tiempoPasadoMs / 60000);

    // SISTEMA ESTRICTO: 10 MINUTOS
    if (minutosTranscurridos < 10) {
      const minutosFaltantes = 10 - minutosTranscurridos;
      setAlerta(`⚠️ Todavía no has completado tu tiempo de hoy. Llevas ${minutosTranscurridos} min. ¡Sigue practicando en la biblioteca por ${minutosFaltantes} minutos más!`);
      
      // Borrar la alerta después de 5 segundos
      setTimeout(() => setAlerta(""), 6000);
      return;
    }

    // Si pasaron los 10 minutos, celebramos y guardamos
    const hoy = new Date().toLocaleDateString("es-ES");
    const nuevaRacha = racha + 1;
    
    setRacha(nuevaRacha);
    setPracticadoHoy(true);
    setAlerta("");
    
    localStorage.setItem("rachaMDI", nuevaRacha.toString());
    localStorage.setItem("ultimaPracticaMDI", hoy);
  };

  return (
    <main className="min-h-screen p-6 pt-24 z-10 relative max-w-md mx-auto flex flex-col items-center font-sans bg-[#FAF8F5]">
      
      {/* TÍTULO */}
      <div className="flex items-center gap-3 mb-8 self-start w-full bg-white p-4 rounded-2xl shadow-sm border border-yellow-100">
        <div className="bg-pink-100 p-2 rounded-xl text-2xl">📅</div>
        <div>
          <h1 className="text-xl font-bold text-yellow-900 leading-none">Calendario</h1>
          <p className="text-sm text-yellow-700">Mundo Digital JR • todo tu material 💛</p>
        </div>
      </div>

      {/* TARJETA DE RACHA (COHETE) */}
      <div className="w-full bg-gradient-to-tr from-pink-100 to-orange-100 p-8 rounded-3xl shadow-sm mb-6 text-center border border-pink-50">
        <div className="flex justify-center items-center gap-4 mb-2">
          <span className="text-6xl drop-shadow-md">🚀</span>
          <span className="text-6xl font-extrabold text-pink-500 drop-shadow-sm">{racha}</span>
        </div>
        <p className="text-yellow-900 font-bold text-lg">días seguidos practicando 💛</p>
      </div>

      {/* MENSAJE DE ALERTA (Tiempo insuficiente) */}
      {alerta && (
        <div className="w-full bg-red-100 border-l-4 border-red-500 text-red-700 p-4 rounded-xl mb-4 font-medium animate-pulse text-sm text-center shadow-sm">
          {alerta}
        </div>
      )}

      {/* BOTÓN DE CHECK-IN */}
      <button 
        onClick={validarTiempoYPracticar}
        disabled={practicadoHoy}
        className={`w-full py-4 rounded-full font-extrabold text-xl shadow-md transition-all transform hover:scale-105 mb-8 ${
          practicadoHoy 
            ? "bg-green-400 text-white cursor-default hover:scale-100" 
            : "bg-[#FA5D7E] text-white hover:bg-[#e04c6a]"
        }`}
      >
        {practicadoHoy ? "✅ ¡Meta del día cumplida!" : "✅ ¡Hoy practicamos 10 min!"}
      </button>

      {/* VISTA DE LA SEMANA */}
      <div className="flex justify-between w-full mb-8 gap-2">
        {diasSemana.map((dia, index) => (
          <div 
            key={index} 
            className={`flex flex-col items-center p-2 w-14 rounded-2xl border-2 transition-colors ${
              dia.esHoy 
                ? "bg-pink-100 border-pink-400 shadow-sm" 
                : "bg-white border-gray-100"
            }`}
          >
            <span className={`text-xs font-bold ${dia.esHoy ? "text-pink-600" : "text-gray-400"}`}>
              {dia.nombre}
            </span>
            <span className={`text-lg font-extrabold ${dia.esHoy ? "text-pink-600" : "text-gray-700"}`}>
              {dia.numero}
            </span>
          </div>
        ))}
      </div>

      {/* MENSAJE MOTIVACIONAL DEL DÍA */}
      <div className="w-full bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
        <p className="text-gray-700 text-lg leading-relaxed">
          💡 {mensajeHoy} 
          <br/><br/>
          Marca cada día que practiquen en la biblioteca y mira crecer su racha 🚀.
        </p>
      </div>

    </main>
  );
}