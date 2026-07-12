"use client";
import { useState, useEffect } from "react";

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

  // 🔴 PEGA AQUÍ TU NUEVO ENLACE DE GOOGLE SCRIPT (El que copiaste en el Paso 1)
  const urlScript = "https://script.google.com/macros/s/AKfycbx4T_Sd-8lLWFFRnXkr5JS2F6KTlVVajPd40i93AXmNei_IumkLLc8fUTpC7NLF3DX5/exec";

  useEffect(() => {
    const fechaActual = new Date().toLocaleDateString("es-ES");
    const accesoRegistrado = localStorage.getItem("diaSesion") || fechaActual;
    
    setFechaAcceso(accesoRegistrado);
    setNombre(localStorage.getItem("nombreUsuario") || "");
    setFechaCumple(localStorage.getItem("cumpleUsuario") || "");
    setAvatar(localStorage.getItem("avatarUsuario") || avatares[0]);
  }, []);

  const guardarPerfil = async () => {
    const idUsuario = localStorage.getItem("telefonoUsuario") || "anonimo";
    
    const params = new URLSearchParams({
      accion: "guardar",
      id: idUsuario,
      nombre: nombre,
      fecha: fechaCumple,
      avatar: avatar,
      acceso: fechaAcceso
    });

    try {
      const respuesta = await fetch(`${urlScript}?${params.toString()}`);
      const datos = await respuesta.json(); // 🔴 AHORA LEEMOS LA RESPUESTA

      if (datos.status === "ok") {
        localStorage.setItem("nombreUsuario", nombre);
        localStorage.setItem("cumpleUsuario", fechaCumple);
        localStorage.setItem("avatarUsuario", avatar);
        alert("¡Perfil guardado correctamente! 🎁");
      } else {
        // Si Google devuelve el error de la hoja, saldrá aquí
        alert(`Error desde Google: ${datos.error}`);
      }

    } catch (e) {
      console.error("Error al guardar", e);
      alert("Error de conexión. Verifica tu internet.");
    }
  };

  return (
    <main className="min-h-screen p-6 pt-24 max-w-md mx-auto bg-[#FAF8F5]">
      <div className="bg-white p-6 rounded-3xl shadow-sm text-center mb-6 border border-gray-100">
        <img src={avatar} alt="Avatar" className="w-32 h-32 rounded-full mx-auto mb-4 border-4 border-pink-200 shadow-md" />
        <p className="text-sm font-bold text-gray-500 mb-2">Selecciona tu personaje:</p>
        <div className="grid grid-cols-5 gap-2 mt-2">
          {avatares.map((img, i) => (
            <img key={i} src={img} onClick={() => setAvatar(img)} className="w-10 h-10 rounded-full cursor-pointer hover:scale-110 transition-transform bg-gray-50 p-1" />
          ))}
        </div>
      </div>

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