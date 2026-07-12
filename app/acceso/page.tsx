"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Acceso() {
  const [telefono, setTelefono] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [cargando, setCargando] = useState(false);
  const router = useRouter();

  const verificarAcceso = async () => {
    if (!telefono) {
      setMensaje("⚠️ Por favor ingresa un número.");
      return;
    }

    setCargando(true);
    setMensaje("Buscando en la base de datos...");

    const urlGoogleScript = "https://script.google.com/macros/s/AKfycbwDgV4sr55CI3bO20gJ-o7WlFxSOmYVfqgcFCqXhyxGNAqqv6BzbFyRD-LsYQnb-_Sp/exec"; 
    
    try {
      const respuesta = await fetch(`${urlGoogleScript}?telefono=${telefono}`);
      const datos = await respuesta.json();

      if (datos.encontrado && datos.estado === "Activo") {
        setMensaje("✅ ¡Acceso concedido! Abriendo biblioteca...");
        localStorage.setItem("accesoVIP", "true");
        setTimeout(() => {
          router.push("/biblioteca");
        }, 1500);
      } else {
        setMensaje("❌ Número no encontrado. ¿Ya enviaste tu comprobante?");
      }
    } catch (error) {
      setMensaje("⚠️ Hubo un error de conexión. Intenta de nuevo.");
    }
    
    setCargando(false);
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gray-50 p-6">
      <div className="bg-white p-8 rounded-3xl shadow-xl max-w-md w-full text-center border border-gray-100">
        
        <h1 className="text-3xl font-extrabold text-gray-800 mb-2">
          Desbloquea tu acceso 🔐
        </h1>
        <p className="text-gray-600 mb-6">
          Si el material te gusto, realiza tu pago y tendrás acceso <b>para siempre</b> a toda la biblioteca 🙌
        </p>
        
        <a 
          href="https://wa.me/584144895281?text=Hola,%20quiero%20hacer%20mi%20aporte%20para%20la%20plataforma" 
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-center gap-2 w-full bg-green-500 hover:bg-green-600 text-white font-bold py-4 px-4 rounded-xl mb-8 transition-transform transform hover:scale-105 shadow-md"
        >
          <span>📲</span> Enviar mi comprobante
        </a>

        <div className="w-full h-px bg-gray-200 mb-8"></div>

        <h2 className="text-xl font-bold text-gray-800 mb-2">
          ¿Ya hiciste tu aporte?
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          Entra con tu número de WhatsApp para activar tu cuenta.
        </p>
        
        <input 
          type="tel" 
          placeholder="Ej: 04141234567" 
          value={telefono}
          onChange={(e) => setTelefono(e.target.value)}
          className="w-full p-4 border border-gray-300 rounded-xl mb-4 focus:outline-none focus:ring-2 focus:ring-yellow-400 text-center text-lg"
        />
        
        <button 
          onClick={verificarAcceso}
          disabled={cargando}
          className="w-full bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-4 rounded-xl transition-colors shadow-sm disabled:opacity-50"
        >
          {cargando ? "Cargando..." : "Activar mi acceso ✅"}
        </button>

        {mensaje && (
          <p className="mt-4 font-bold text-gray-700">
            {mensaje}
          </p>
        )}

      </div>
    </main>
  );
}