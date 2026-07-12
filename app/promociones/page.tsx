"use client";
import { useState, useEffect } from "react";

export default function Promociones() {
  const [promos, setPromos] = useState<any[]>([]);
  
  // === CONFIGURACIÓN DE TUS DATOS ===
  const numeroWhatsApp = "584144895281"; 
  const telegramToken = "8890718589:AAEAv7AhiRh_ZBr_xHmtBwjEQsA57nqCDY0"; // Ej: "123456:ABCdef..."
  const telegramChatId = "390820193"; // Ej: "987654321"
  
  // Enlace de tu base de datos (Google Sheets)
  const urlBase = "https://script.google.com/macros/s/AKfycbzF9mUNcMJ_dKpnl2nLfULdMkqa3eY_zB6X_VvP9m1Q2Q2rVv0/exec";

  useEffect(() => {
    fetch(`${urlBase}?t=${new Date().getTime()}`)
      .then(res => res.json())
      .then(data => setPromos(data))
      .catch(err => console.error("Error al cargar promos:", err));
  }, []);

  const comprarCurso = async (nombre: string, precio: string) => {
    // 1. Armar el mensaje de alerta silenciosa para tu Telegram
    const mensajeTelegram = `🚨 ¡NUEVA INTENCIÓN DE COMPRA!\n\nAlguien hizo clic en la web.\n📘 Material: ${nombre}\n💰 Precio: ${precio}\n\nRevisa tu WhatsApp en unos segundos.`;
    
    // 2. Enviar a Telegram en segundo plano (el cliente no nota nada)
    try {
      await fetch(`https://api.telegram.org/bot${telegramToken}/sendMessage?chat_id=${telegramChatId}&text=${encodeURIComponent(mensajeTelegram)}`);
    } catch (e) {
      console.error("Error enviando a Telegram", e);
    }

    // 3. Redirigir a WhatsApp (Usamos location.href para evitar que el navegador lo bloquee)
    const mensajeWa = `Hola, quiero comprar el material: ${nombre}. ¡Vi que tengo un 20% de descuento por la App!`;
    window.location.href = `https://wa.me/${numeroWhatsApp}?text=${encodeURIComponent(mensajeWa)}`;
  };

  return (
    <main className="min-h-screen p-6 pt-24 max-w-lg mx-auto bg-[#FAF8F5]">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-8 text-center">🎁 Promociones</h1>
      <div className="space-y-6">
        {promos.map((p, i) => (
          <div key={i} className="bg-white p-4 rounded-3xl shadow-sm border border-pink-100 overflow-hidden">
            <img src={p.ImagenUrl} className="w-full h-48 object-cover rounded-2xl mb-4" alt={p.NombreCurso} />
            <h2 className="text-xl font-bold text-gray-800">{p.NombreCurso}</h2>
            <p className="text-gray-500 line-through text-sm">Antes: {p.PrecioNormal}</p>
            <p className="text-pink-600 font-black text-lg mb-4">Oferta: {p.PrecioOferta} - ¡Con 20% OFF Extra!</p>
            <button 
              onClick={() => comprarCurso(p.NombreCurso, p.PrecioOferta)}
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