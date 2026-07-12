"use client";
import { useState, useEffect } from "react";

export default function Tecnologia() {
  const [items, setItems] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // URL de tu nuevo script de tecnología
  const urlBase = "https://script.google.com/macros/s/AKfycbz4ke2zZ5yBrKLLBiQw_FFbmiXMQtCuRgnVUQo0ZzG8pNZb6xnytFESm5KIH0-2HEC5wQ/exec";

  useEffect(() => {
    fetch(urlBase)
      .then(res => res.json())
      .then(data => {
        setItems(data);
        setCargando(false);
      })
      .catch(err => {
        console.error("Error al cargar tecnología:", err);
        setCargando(false);
      });
  }, []);

  return (
    <main className="min-h-screen p-6 pt-24 max-w-2xl mx-auto bg-[#FAF8F5]">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">💻 Tecnología</h1>
      
      {cargando ? (
        <div className="text-center p-10 font-bold text-blue-900">Cargando catálogo...</div>
      ) : (
        <div className="space-y-4">
          {items.map((item, index) => (
            <div key={index} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 transition-all hover:shadow-md">
              <h2 className="text-xl font-extrabold text-gray-800 mb-2">{item.Nombre}</h2>
              <p className="text-gray-600 mb-6">{item.Descripcion}</p>
              
              {/* Lógica de disponibilidad */}
              {item.Disponible === "SI" ? (
                <a 
                  href={item.Link} 
                  target="_blank" 
                  className="inline-block bg-blue-900 hover:bg-blue-800 text-white px-8 py-3 rounded-full font-bold shadow-md transition-transform hover:-translate-y-1"
                >
                  Descargar ahora 🚀
                </a>
              ) : (
                <div className="inline-block bg-red-50 text-red-600 px-6 py-3 rounded-full font-bold border border-red-100">
                  🚫 No disponible actualmente
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </main>
  );
}