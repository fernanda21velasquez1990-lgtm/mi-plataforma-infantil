"use client";
import { useState, useEffect } from "react";

// Lista de 20 avatares estilo comiquita
const avatares = [
  "https://cdn-icons-png.flaticon.com/128/3135/3135715.png", "https://cdn-icons-png.flaticon.com/128/3135/3135768.png", 
  "https://cdn-icons-png.flaticon.com/128/2922/2922506.png", "https://cdn-icons-png.flaticon.com/128/2922/2922510.png", 
  "https://cdn-icons-png.flaticon.com/128/3048/3048122.png", "https://cdn-icons-png.flaticon.com/128/3048/3048127.png", 
  "https://cdn-icons-png.flaticon.com/128/4140/4140037.png", "https://cdn-icons-png.flaticon.com/128/4140/4140048.png", 
  "https://cdn-icons-png.flaticon.com/128/4140/4140061.png", "https://cdn-icons-png.flaticon.com/128/4140/4140079.png", 
  "https://cdn-icons-png.flaticon.com/128/3135/3135789.png", "https://cdn-icons-png.flaticon.com/128/3135/3135731.png", 
  "https://cdn-icons-png.flaticon.com/128/1999/1999625.png", "https://cdn-icons-png.flaticon.com/128/3048/3048177.png", 
  "https://cdn-icons-png.flaticon.com/128/3048/3048122.png", "https://cdn-icons-png.flaticon.com/128/1154/1154448.png", 
  "https://cdn-icons-png.flaticon.com/128/3048/3048163.png", "https://cdn-icons-png.flaticon.com/128/3048/3048162.png", 
  "https://cdn-icons-png.flaticon.com/128/3048/3048154.png", "https://cdn-icons-png.flaticon.com/128/3048/3048148.png"
];

export default function Perfil() {
  const [avatar, setAvatar] = useState(avatares[0]);
  const [nombre, setNombre] = useState("");
  const [fechaCumple, setFechaCumple] = useState("");
  const [fechaAcceso, setFechaAcceso] = useState("");

  // 🔴 PEGA AQUÍ TU ENLACE DE GOOGLE SCRIPT (Si cambió al hacer la Nueva Versión)
  const urlScript = "https://script.google.com/macros/s/AKfycbz1eU4HFHQtliJsC0Hm8NidbjHP1W69BAO_mmL0cz7BYLM_0T0Ke6VjmebtyxbqdoN2FQ/exec";

  useEffect(() => {
    // Calculamos el día de sesión actual o usamos el guardado
    const fechaActual = new Date().toLocaleDateString("es-ES");
    const accesoRegistrado = localStorage.getItem("diaSesion") || fechaActual;
    
    setFechaAcceso(accesoRegistrado);
    setNombre(localStorage.getItem("nombreUsuario") || "");
    setFechaCumple(localStorage.getItem("cumpleUsuario") || "");
    setAvatar(localStorage.getItem("avatarUsuario") || avatares[0]);
  }, []);

  const guardarPerfil = async () => {
    const idUsuario = localStorage.getItem("telefonoUsuario") || "anonimo";
    
    // 🔴 AHORA ENVIAMOS LA FECHA DE ACCESO A TU EXCEL
    const params = new URLSearchParams({
      accion: "guardar",
      id: idUsuario,
      nombre: nombre,
      fecha: fechaCumple,
      avatar: avatar,
      acceso: fechaAcceso
    });

    try {
      await fetch(`${urlScript}?${params.toString()}`);
      localStorage.setItem("nombreUsuario", nombre);
      localStorage.setItem("cumpleUsuario", fechaCumple);
      localStorage.setItem("avatarUsuario", avatar);
      alert("¡Perfil guardado correctamente! 🎁");
    } catch (e) {
      console.error("Error al guardar", e);
      alert("Error al guardar. Verifica tu conexión.");
    }
  };

  return (
    <main className="min-h-screen p-6 pt-24 max-w-md mx-auto bg-[#FAF8F5]">
      {/* Parte Superior: Foto de perfil */}
      <div className="bg-white p-6 rounded-3xl shadow-sm text-center mb-6 border border-gray-100">
        <img src={avatar} alt="Avatar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-pink-200 shadow-md" />
        <p className="text-sm font-bold text-gray-500 mb-2">Selecciona tu personaje:</p>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {avatares.map((img, i) => (
            <img key={i} src={img} onClick={() => setAvatar(img)} className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform bg-gray-50 p-1" />
          ))}
        </div>
      </div>

      {/* Parte Inferior: Información */}
      <div className="bg-white p-6 rounded-3xl shadow-sm space-y-4 border border-gray-100">
        <h2 className="text-xl font-bold text-gray-800 mb-4">Información de cuenta</h2>
        <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-xl border border-gray-100">
          <strong>Último acceso a la App:</strong> {fechaAcceso}
        </div>
        
        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Nombre y Apellido:</label>
          <input 
            type="text" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            className="w-full p-3 border border-gray-200 rounded-xl" 
            placeholder="Ej: María Pérez" 
          />
        </div>

        <div>
          <label className="block text-sm font-bold text-gray-600 mb-1">Fecha de cumpleaños:</label>
          <input 
            type="date" 
            value={fechaCumple} 
            onChange={(e) => setFechaCumple(e.target.value)} 
            className="w-full p-3 border border-gray-200 rounded-xl" 
          />
        </div>
        
        <button onClick={guardarPerfil} className="w-full bg-pink-500 hover:bg-pink-600 text-white font-bold py-3 rounded-xl mt-4 shadow-lg transition-transform hover:-translate-y-1">
          Guardar Perfil
        </button>
      </div>
    </main>
  );
}