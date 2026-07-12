"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function InicioLanding() {
  const [mostrarPago, setMostrarPago] = useState(false);
  const router = useRouter();

  // Función para el botón automático de 1 hora de prueba
  const iniciarPruebaExpress = () => {
    const ahora = new Date().getTime();
    const limite = ahora + (60 * 60 * 1000); // 1 hora
    localStorage.setItem("limitePrueba", limite.toString());
    localStorage.removeItem("accesoVIP"); 
    router.push("/tecnologia"); 
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-blue-900 text-white font-sans overflow-x-hidden">
      
      {/* SECCIÓN 1: HERO (ENCABEZADO ESPACIAL) */}
      <div className="relative pt-20 pb-16 px-6 text-center max-w-2xl mx-auto">
        <div className="absolute top-10 left-4 text-4xl animate-bounce">🚀</div>
        <div className="absolute top-20 right-8 text-5xl animate-pulse">🪐</div>
        <div className="absolute top-40 left-10 text-3xl">⭐</div>
        
        <h1 className="text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-yellow-300 via-yellow-400 to-orange-500 drop-shadow-lg mb-4 tracking-tight">
          MUNDO DIGITAL INFANTIL
        </h1>
        <p className="text-xl text-blue-200 font-medium leading-relaxed drop-shadow-md">
          Un universo de aprendizaje, herramientas y diversión diseñado para impulsar el desarrollo y la creatividad. ¡Despega hacia el conocimiento! 🛸
        </p>
      </div>

      {/* LÍNEA CONECTORA TIPO INFOGRAFÍA */}
      <div className="w-1 h-16 bg-gradient-to-b from-orange-400 to-cyan-400 mx-auto rounded-full"></div>

      {/* SECCIÓN 2: LA BIBLIOTECA (INFOGRAFÍA) */}
      <div className="px-6 py-8 max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden transition-transform hover:scale-105">
          <div className="absolute -right-4 -top-4 text-6xl opacity-50">📚</div>
          <h2 className="text-3xl font-extrabold text-cyan-300 mb-6 flex items-center gap-3">
            <span>🌍</span> La Biblioteca Estelar
          </h2>
          <ul className="space-y-4 text-blue-100 font-medium">
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl">⭐</span>
              <p><b>Guías Pedagógicas:</b> Material de desarrollo preescolar y rutinas de psicomotricidad infantil.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl">⭐</span>
              <p><b>Juegos Tradicionales:</b> Dinámicas físicas y recreativas explicadas paso a paso.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl">⭐</span>
              <p><b>Planificaciones:</b> Rúbricas, evaluaciones y planes de estudio listos para aplicar.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-yellow-400 text-xl">⭐</span>
              <p><b>Cuentos y Lecturas:</b> Historias mágicas para fomentar la lectura y la imaginación.</p>
            </li>
          </ul>
        </div>
      </div>

      {/* LÍNEA CONECTORA TIPO INFOGRAFÍA */}
      <div className="w-1 h-16 bg-gradient-to-b from-cyan-400 to-fuchsia-400 mx-auto rounded-full"></div>

      {/* SECCIÓN 3: TECNOLOGÍA (INFOGRAFÍA) */}
      <div className="px-6 py-8 max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-8 rounded-3xl shadow-2xl relative overflow-hidden transition-transform hover:scale-105">
          <div className="absolute -left-4 -bottom-4 text-7xl opacity-50">🤖</div>
          <h2 className="text-3xl font-extrabold text-fuchsia-300 mb-6 flex items-center gap-3">
            <span>💻</span> El Laboratorio Tech
          </h2>
          <ul className="space-y-4 text-blue-100 font-medium">
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 text-xl">✨</span>
              <p><b>Modelos IA Femeninos:</b> Aprende a diseñar personajes virtuales realistas y consistentes.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 text-xl">✨</span>
              <p><b>Automatización:</b> Scripts, bots y bases de datos automatizadas con Google Sheets.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 text-xl">✨</span>
              <p><b>Marketing Digital:</b> Cuadrículas, copy estratégico para redes sociales y calendarios de contenido.</p>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-cyan-400 text-xl">✨</span>
              <p><b>Recursos de Diseño:</b> Grillas y plantillas listas para potenciar tu presencia online.</p>
            </li>
          </ul>
        </div>
      </div>

      {/* LÍNEA CONECTORA TIPO INFOGRAFÍA */}
      <div className="w-1 h-16 bg-gradient-to-b from-fuchsia-400 to-green-400 mx-auto rounded-full"></div>

      {/* SECCIÓN 4: COMPRA Y PRUEBA GRATIS */}
      <div className="px-6 py-12 max-w-md mx-auto text-center space-y-8">
        
        {/* SISTEMA DE PAGO VIP */}
        {!mostrarPago ? (
          <div className="animate-bounce">
            <button 
              onClick={() => setMostrarPago(true)}
              className="w-full bg-gradient-to-r from-green-400 to-emerald-600 hover:from-green-500 hover:to-emerald-700 text-white font-black text-2xl py-6 rounded-full shadow-[0_0_30px_rgba(52,211,153,0.6)] transition-all transform hover:scale-105 border-4 border-green-300"
            >
              🛒 ¡COMPRA AQUÍ! 💎
            </button>
            <p className="text-green-200 mt-3 font-semibold tracking-wide">Acceso ILIMITADO a todo el universo.</p>
          </div>
        ) : (
          <div className="bg-white text-gray-800 p-8 rounded-3xl shadow-2xl border-4 border-green-400 relative">
            <h2 className="text-3xl font-extrabold text-green-600 mb-2">💎 Taquilla VIP</h2>
            <p className="text-gray-600 mb-6 text-sm font-medium">
              Realiza tu pago móvil y envíanos el comprobante para activar tu acceso para siempre.
            </p>
            
            {/* DATOS DE PAGO MÓVIL (¡Modifica estos datos!) */}
            <div className="bg-gray-50 p-5 rounded-2xl text-left text-sm text-gray-700 font-bold mb-6 space-y-3 border border-gray-200">
              <p>🏦 Banco: <span className="text-blue-600">Venezuela (0102)</span></p>
              <p>📝 Cédula: <span className="text-blue-600">V-16.113.624</span></p>
              <p>📱 Teléfono: <span className="text-blue-600">0414-4895281</span></p>
              <p>💵 Monto: <span className="text-blue-600">2500 Bs</span></p>
            </div>

            <a 
              href="https://wa.me/584144895281?text=Hola,%20ya%20realicé%20mi%20pago%20móvil.%20Aquí%20está%20el%20comprobante:" 
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-3 w-full bg-[#25D366] hover:bg-[#1ebe57] text-white font-extrabold text-lg py-4 rounded-xl shadow-md transition-transform transform hover:scale-105 mb-4"
            >
              <span className="text-2xl">📲</span> Enviar Comprobante
            </a>

            <button 
              onClick={() => setMostrarPago(false)}
              className="w-full text-gray-400 font-bold py-2 hover:text-gray-600 underline"
            >
              Cerrar y volver atrás
            </button>
          </div>
        )}

        <div className="w-1 h-12 bg-white/20 mx-auto rounded-full"></div>

        {/* PRUEBA GRATIS */}
        <div className="bg-gradient-to-br from-yellow-400 to-orange-500 p-1 rounded-2xl shadow-xl">
          <div className="bg-indigo-900 rounded-xl p-6 border border-transparent">
            <h2 className="text-2xl font-black text-yellow-400 mb-2 flex justify-center items-center gap-2">
              ⏱️ ¿Quieres curiosear?
            </h2>
            <p className="text-sm text-blue-200 mb-5 font-medium">
              Obtén una hora de prueba para explorar la plataforma (podrás ver el contenido, pero las descargas estarán bloqueadas).
            </p>
            <button 
              onClick={iniciarPruebaExpress}
              className="w-full bg-yellow-400 hover:bg-yellow-300 text-indigo-900 font-black py-4 rounded-xl shadow-md transition-all transform hover:scale-105"
            >
              🛸 Iniciar Prueba de 60 Minutos
            </button>
          </div>
        </div>

      </div>

      {/* FOOTER ESPACIAL */}
      <div className="text-center pb-8 text-blue-300/50 text-sm font-bold tracking-widest">
        MUNDO DIGITAL INFANTIL © 2026
      </div>
    </main>
  );
}