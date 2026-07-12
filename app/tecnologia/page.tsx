"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Tecnologia() {
  const [materiales, setMateriales] = useState<any[]>([]);
  const [esVIP, setEsVIP] = useState(false);
  const [esPrueba, setEsPrueba] = useState(false);
  const [tiempoRestante, setTiempoRestante] = useState("");
  const router = useRouter();

  const urlBase = "https://script.google.com/macros/s/AKfycbxvVvFUKwHxM6bQUeJs9FH7uVmRUfln_RSvSLy0vAC5q_kh69FYJ0ZO8OQcphU7OHRIbg/exec";

  useEffect(() => {
    // 1. SISTEMA DE SEGURIDAD (El "Guardián")
    const vip = localStorage.getItem("accesoVIP");
    const limiteStr = localStorage.getItem("limitePrueba");

    if (vip === "true") {
      setEsVIP(true); // Es cliente pagado, entra con todos los permisos
    } else if (limiteStr) {
      const limite = parseInt(limiteStr);
      if (new Date().getTime() > limite) {
        // El tiempo se acabó, lo botamos a la pantalla de inicio
        localStorage.removeItem("limitePrueba");
        router.push("/");
        return;
      } else {
        setEsPrueba(true); // Está dentro de su hora de prueba
      }
    } else {
      // Si alguien intenta entrar con el link directo sin permisos, lo botamos
      router.push("/");
      return;
    }

    // 2. Cargar los materiales de Google Sheets
    fetch(`${urlBase}?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => setMateriales(data))
      .catch(err => console.error("Error al cargar tecnología:", err));
  }, [router]);

  // 3. LÓGICA DEL CRONÓMETRO FLOTANTE
  useEffect(() => {
    let intervalo: NodeJS.Timeout;
    if (esPrueba) {
      intervalo = setInterval(() => {
        const limiteStr = localStorage.getItem("limitePrueba");
        if (!limiteStr) return;
        
        const limite = parseInt(limiteStr);
        const dif = limite - new Date().getTime();

        if (dif <= 0) {
          clearInterval(intervalo);
          localStorage.removeItem("limitePrueba");
          alert("⏳ Tu tiempo de prueba ha finalizado. Realiza tu pago para continuar.");
          router.push("/");
        } else {
          const minutos = Math.floor((dif % (1000 * 60 * 60)) / (1000 * 60));
          const segundos = Math.floor((dif % (1000 * 60)) / 1000);
          setTiempoRestante(`${minutos}m ${segundos}s`);
        }
      }, 1000);
    }
    return () => clearInterval(intervalo);
  }, [esPrueba, router]);

  // Si no hemos validado aún, mostramos pantalla en blanco temporal
  if (!esVIP && !esPrueba) return null; 

  return (
    <main className="min-h-screen pb-12 bg-[#FAF8F5]">
      
      {/* CINTILLO FLOTANTE DE TIEMPO (Solo se ve en modo prueba) */}
      {esPrueba && (
        <div className="fixed top-0 left-0 w-full bg-red-600 text-white text-center py-3 font-bold z-50 shadow-md animate-pulse">
          ⏱️ MODO PRUEBA: Te quedan {tiempoRestante} - <span className="underline">Las descargas están bloqueadas.</span>
        </div>
      )}

      <div className={`p-6 max-w-lg mx-auto ${esPrueba ? "pt-24" : "pt-12"}`}>
        <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">💻 Tecnología</h1>
        
        <div className="space-y-6">
          {materiales.map((m, i) => {
            const estaDisponible = m.Disponible?.toString().toLowerCase().trim() !== "no";

            return (
              <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-blue-100 overflow-hidden relative">
                
                {m.Categoria && (
                  <span className="absolute top-6 right-6 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1 rounded-full uppercase tracking-wider shadow-sm z-10">
                    {m.Categoria}
                  </span>
                )}

                <img src={m.ImagenUrl} className="w-full h-48 object-cover rounded-2xl mb-4 relative" alt={m.Nombre} />
                
                <h2 className="text-xl font-bold text-gray-800">{m.Nombre}</h2>
                <p className="text-gray-600 my-2 text-sm">{m.Descripcion}</p>
                
                <div className="mt-4">
                  {!estaDisponible ? (
                    <div className="w-full text-center bg-red-100 text-red-600 font-bold py-3 rounded-full border border-red-200">
                      🚫 No Disponible por ahora
                    </div>
                  ) : esVIP ? (
                    // BOTÓN AZUL ACTIVO SOLO PARA VIPS
                    <a 
                      href={m.Link} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full shadow-md transition-all hover:scale-105"
                    >
                      Descargar Material ⬇️
                    </a>
                  ) : (
                    // BOTÓN GRIS BLOQUEADO PARA LOS DE PRUEBA
                    <button 
                      disabled 
                      className="w-full bg-gray-300 text-gray-600 font-bold py-3 rounded-full cursor-not-allowed border border-gray-400"
                    >
                      🔒 Descarga Exclusiva VIP
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}