"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Inicio() {
  const [mostrarPago, setMostrarPago] = useState(false);
  const router = useRouter();

  // Función para el botón automático de 1 hora de prueba
  const iniciarPruebaExpress = () => {
    const ahora = new Date().getTime();
    const limite = ahora + (60 * 60 * 1000); // 1 hora en milisegundos
    localStorage.setItem("limitePrueba", limite.toString());
    localStorage.removeItem("accesoVIP"); // Aseguramos que no sea VIP
    router.push("/tecnologia"); 
  };

  // PANTALLA 2: DATOS DE PAGO MÓVIL (Venezuela, V-16113624, Celular 04144895281 Aparece cuando le dan a "Quieres ser VIP")
  if (mostrarPago) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAF8F5] p-6">
        <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-blue-100">
          <h2 className="text-3xl font-extrabold text-blue-900 mb-2">💎 Conviértete en VIP</h2>
          <p className="text-gray-600 mb-6 text-sm">
            Realiza tu pago móvil con los siguientes datos y envíanos el comprobante para activar tu acceso para siempre.
          </p>
          
          {/* AQUÍ VAS A ESCRIBIR TUS DATOS REALES DE PAGO MÓVIL */}
          <div className="bg-blue-50 p-5 rounded-2xl text-left text-sm text-blue-900 font-medium mb-6 space-y-3 border border-blue-200 shadow-inner">
            <p>🏦 <span className="font-bold text-gray-600">Banco:</span> VENEZUELA</p>
            <p>📝 <span className="font-bold text-gray-600">Cédula:</span> V-16.113.624</p>
            <p>📱 <span className="font-bold text-gray-600">Teléfono:</span> 0414-4895281</p>
            <p>💵 <span className="font-bold text-gray-600">Monto:</span> 2050 Bs</p>
          </div>

          <a 
            href="https://wa.me/584144895281?text=Hola,%20ya%20realicé%20mi%20pago%20móvil.%20Aquí%20está%20el%20comprobante:" 
            target="_blank"
            rel="noopener noreferrer"
            className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 rounded-xl shadow-md transition-transform transform hover:scale-105 mb-4"
          >
            <span>📲</span> Enviar Comprobante
          </a>

          <button 
            onClick={() => setMostrarPago(false)}
            className="w-full text-gray-500 font-bold py-3 hover:text-gray-800 underline transition-colors"
          >
            Volver atrás
          </button>
        </div>
      </main>
    );
  }

  // PANTALLA 1: PÁGINA PRINCIPAL (Lo primero que ven al entrar)
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAF8F5] p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
        
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Bienvenido 🚀</h1>
        <p className="text-gray-600 mb-8 text-sm">
          Descubre todo nuestro material educativo y tecnológico en un solo lugar.
        </p>
        
        {/* BOTÓN PARA SER VIP */}
        <div className="mb-8">
          <button 
            onClick={() => setMostrarPago(true)}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-extrabold text-lg py-5 rounded-2xl shadow-lg transition-transform transform hover:scale-105"
          >
            💎 ¿Quieres ser VIP?
          </button>
          <p className="text-xs text-gray-500 mt-3 font-medium">Acceso ilimitado y descargas para siempre.</p>
        </div>

        <div className="w-full h-px bg-gray-200 my-6"></div>

        {/* CUADRO DE PRUEBA GRATIS INTACTO */}
        <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl shadow-sm">
          <h2 className="text-xl font-extrabold text-yellow-800 mb-2">¿Quieres una hora de prueba? ⏱️</h2>
          <p className="text-sm text-yellow-700 mb-4 font-medium">
            Entra aquí para explorar la plataforma por 60 minutos (podrás ver el contenido, pero no descargarlo).
          </p>
          <button 
            onClick={iniciarPruebaExpress}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded-xl shadow-sm transition-all hover:scale-105"
          >
            Iniciar Prueba Gratis Ahora
          </button>
        </div>

      </div>
    </main>
  );
}