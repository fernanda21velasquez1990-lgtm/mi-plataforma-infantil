"use client";
import { useState, useEffect } from "react";

export default function Promociones() {
  const [promos, setPromos] = useState<any[]>([]);
  // CAMBIA ESTO POR TU NÚMERO (ej: 584121234567)
  const numeroWhatsApp = "584144895281"; 

  // URL DE TU SCRIPT DE PROMOCIONES
  const urlBase = "https://script.google.com/macros/s/AKfycbwk5W_h7uC9JuUJVY0J8CQNc7kJk3zK5WUS1GbxxZNilmysCf1bKcqAtKAJQUtPoi1x/exec";

  useEffect(() => {
    fetch(urlBase)
      .then(res => res.json())
      .then(data => setPromos(data))
      .catch(err => console.error("Error al cargar promos:", err));
  }, []);

  const comprarCurso = (nombre: string, precio: string) => {
    // Mensaje informativo del 20% de descuento
    alert("¡Felicidades! 🎉 Por comprar desde la aplicación tienes un 20% de descuento. ¡Redirigiendo a tu asesor!");

    // Enviar a WhatsApp
    const mensaje = `Hola, quiero comprar el curso: ${nombre}. ¡Vi que tengo un 20% de descuento por la App!`;
    window.open(`https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensaje)}`, "_blank");
  };

  return (
    <main className="min-h-screen p-6 pt-24 max-w-lg mx-auto bg-[#FAF8F5]">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">🎁 Promociones</h1>
      <div className="space-y-6">
        {promos.map((p, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
            <img src={p.Imagen} className="w-full h-48 object-cover rounded-2xl mb-4" alt={p.Nombre} />
            <h2 className="text-xl font-bold text-gray-800">{p.Nombre}</h2>
            <p className="text-pink-600 font-black text-lg mb-4">Precio: {p.Precio} - 20% OFF</p>
            <button 
              onClick={() => comprarCurso(p.Nombre, p.Precio)}
              className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-full shadow-md transition-all hover:scale-105"
            >
              Comprar con Descuento 🛍️
            </button>
          </div>
        ))}
      </div>
    </main>
  );
}