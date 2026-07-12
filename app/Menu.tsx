"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Menu() {
  const [abierto, setAbierto] = useState(false);
  const rutaActual = usePathname();

  useEffect(() => {
    const hoy = new Date().toLocaleDateString("es-ES");
    const diaGuardado = localStorage.getItem("diaSesion");
    
    if (diaGuardado !== hoy) {
      localStorage.setItem("diaSesion", hoy);
      localStorage.setItem("inicioSesionTiempo", Date.now().toString());
    }
  }, []);

  // 🔴 VARIABLE DE CONTROL: Oculta los links si estamos en la página de inicio O en la de acceso
  const ocultarLinks = rutaActual === "/" || rutaActual === "/acceso";

  return (
    <>
      <button 
        onClick={() => setAbierto(true)}
        className="fixed top-4 left-4 z-40 bg-blue-900 text-white p-4 rounded-full shadow-lg text-xl hover:bg-blue-800 transition-colors"
      >
        ☰
      </button>

      {abierto && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-40 z-40 transition-opacity"
          onClick={() => setAbierto(false)}
        ></div>
      )}

      <div className={`fixed top-0 left-0 h-full w-72 bg-white z-50 transform transition-transform duration-300 flex flex-col shadow-2xl ${abierto ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="p-6 flex flex-col h-full">
          <button onClick={() => setAbierto(false)} className="self-end text-gray-400 text-2xl mb-4 hover:text-gray-700">✖</button>

          <nav className="flex flex-col gap-2 flex-grow">
            {/* CONDICIÓN: Si NO estamos en las páginas restringidas, mostramos el menú */}
            {!ocultarLinks && (
              <>
                <Link href="/" onClick={() => setAbierto(false)} className="p-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50">🚀 Mundo Digital JR</Link>
                <Link href="/biblioteca" onClick={() => setAbierto(false)} className="p-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50">📚 Mi Biblioteca</Link>
                <Link href="/comunidad" onClick={() => setAbierto(false)} className="p-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50">💛 Comunidad</Link>
                <Link href="/calendario" onClick={() => setAbierto(false)} className="p-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50">📅 Calendario de Racha</Link>
                <Link href="/perfil" onClick={() => setAbierto(false)} className="p-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50">👤 Mi Perfil</Link>
                <Link href="/tecnologia" onClick={() => setAbierto(false)} className="p-3 rounded-xl font-bold text-gray-700 hover:bg-blue-50">💻 Tecnología</Link>
                <Link href="/promociones" onClick={() => setAbierto(false)} className="p-3 rounded-xl font-bold text-pink-700 hover:bg-pink-50">🎁 Promociones</Link>
              </>
            )}
          </nav>

          <div className="mt-8">
            {/* El botón de aporte queda afuera, siempre visible */}
            <Link 
              href="/acceso" 
              onClick={() => setAbierto(false)} 
              className="flex items-center justify-center w-full bg-blue-900 hover:bg-blue-800 text-white font-bold py-3 rounded-full shadow-md transition-colors"
            >
              ✅ Ya hice mi aporte
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}