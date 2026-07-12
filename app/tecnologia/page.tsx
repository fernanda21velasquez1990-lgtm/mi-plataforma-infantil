"use client";
import { useState, useEffect } from "react";

export default function Tecnologia() {
  const [materiales, setMateriales] = useState<any[]>([]);

  // 🔴 ¡IMPORTANTE! PEGA AQUÍ EL ENLACE NUEVO QUE COPIASTE EN EL PASO 3
  const urlBase = "https://script.google.com/macros/s/AKfycbzQeOoMlSR9IGb3hqmFOsCC3IkzDI3JF2G0jLd_8OA0nw0YY_O9bzXseLdeElGbTeMm9Q/exec";

  useEffect(() => {
    // Truco anticaché
    fetch(`${urlBase}?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => setMateriales(data))
      .catch(err => console.error("Error al cargar tecnología:", err));
  }, []);

  return (
    <main className="min-h-screen p-6 pt-24 max-w-lg mx-auto bg-[#FAF8F5]">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">💻 Tecnología</h1>
      <div className="space-y-6">
        {materiales.map((m, i) => {
          // Lógica para saber si está disponible (ignora mayúsculas o espacios extra)
          const estaDisponible = m.Disponible?.toString().toLowerCase().trim() !== "no";

          return (
            <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-blue-100 overflow-hidden">
              <img src={m.ImagenUrl} className="w-full h-48 object-cover rounded-2xl mb-4" alt={m.Nombre} />
              <h2 className="text-xl font-bold text-gray-800">{m.Nombre}</h2>
              <p className="text-gray-600 my-2 text-sm">{m.Descripcion}</p>
              
              <div className="mt-4">
                {estaDisponible ? (
                  <a 
                    href={m.Link} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="block w-full text-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 rounded-full shadow-md transition-all hover:scale-105"
                  >
                    Descargar Material ⬇️
                  </a>
                ) : (
                  <div className="w-full text-center bg-red-100 text-red-600 font-bold py-3 rounded-full border border-red-200">
                    🚫 No Disponible por ahora
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </main>
  );
}