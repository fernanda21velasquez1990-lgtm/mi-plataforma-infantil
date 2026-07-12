"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Acceso() {
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const verificarAccesoVIP = async () => {
    if (!telefono) {
      setMensaje("⚠️ Por favor ingresa tu número VIP.");
      return;
    }

    setCargando(true);
    setMensaje("Verificando tu membresía VIP...");

    // ENLACE DE TU SCRIPT DE GOOGLE PARA USUARIOS (Mantenemos el que ya funcionaba)
    const urlGoogleScript = "https://script.google.com/macros/s/AKfycbwQ-_4c4TrOUggmwnQaUXcDZTPPGVJpbxSLHAQ1CuA8UT7RKW3xBJXrNJNzgf0S9t2HfA/exec"; 
    
    try {
      const respuesta = await fetch(`${urlGoogleScript}?whatsapp=${telefono}`);
      const datos = await respuesta.json();

      if (datos.encontrado && datos.estado === "pagado") {
        setMensaje("✅ ¡Acceso VIP concedido! Abriendo plataforma...");
        localStorage.setItem("accesoVIP", "true");
        localStorage.removeItem("limitePrueba"); // Borramos cualquier prueba anterior
        setTimeout(() => {
          router.push("/tecnologia");
        }, 1500);
      } else {
        setMensaje("❌ Número no autorizado o aún no has pagado.");
      }
    } catch (error) {
      setMensaje("⚠️ Hubo un error de conexión. Intenta de nuevo.");
    }
    setCargando(false);
  };

  // Función para el botón automático de 1 hora de prueba
  const iniciarPruebaExpress = () => {
    const ahora = new Date().getTime();
    const limite = ahora + (60 * 60 * 1000); // 1 hora en milisegundos
    localStorage.setItem("limitePrueba", limite.toString());
    localStorage.removeItem("accesoVIP"); // Aseguramos que no sea VIP
    router.push("/tecnologia");
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-[#FAF8F5] p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
        
        <h1 className="text-3xl font-extrabold text-blue-900 mb-2">Desbloquea tu acceso 🔐</h1>
        <p className="text-gray-600 mb-6 text-sm">
          Si ya realizaste tu pago, ingresa tu WhatsApp para acceder a todo el material para siempre.
        </p>
        
        <input 
          type="tel" 
          placeholder="Ej: 584141234567" 
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full p-4 border-2 border-blue-100 rounded-xl mb-4 focus:outline-none focus:border-blue-500 text-center text-lg font-bold"
        />
        
        <button 
          onClick={verificarAccesoVIP}
          disabled={cargando}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-md transition-transform transform hover:scale-105 disabled:opacity-50"
        >
          {cargando ? "Verificando..." : "Entrar como VIP ✅"}
        </button>

        {mensaje && (
          <p className={`mt-4 font-bold ${mensaje.includes("❌") ? "text-red-500" : "text-green-600"}`}>
            {mensaje}
          </p>
        )}

        <div className="w-full h-px bg-gray-200 my-8"></div>

        {/* CUADRO DE PRUEBA GRATIS SOLICITADO */}
        <div className="bg-yellow-50 border-2 border-yellow-200 p-6 rounded-2xl">
          <h2 className="text-xl font-extrabold text-yellow-800 mb-2">¿Quieres una hora de prueba? ⏱️</h2>
          <p className="text-sm text-yellow-700 mb-4">
            Entra aquí para explorar la plataforma por 60 minutos (podrás ver el contenido, pero no descargarlo).
          </p>
          <button 
            onClick={iniciarPruebaExpress}
            className="w-full bg-yellow-400 hover:bg-yellow-500 text-yellow-900 font-bold py-3 rounded-xl shadow-sm transition-all"
          >
            Iniciar Prueba Gratis Ahora
          </button>
        </div>

      </div>
    </main>
  );
}