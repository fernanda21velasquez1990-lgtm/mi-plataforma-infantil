"use client";
import { useState, useEffect } from "react";

export default function Comunidad() {
  const [nombre, setNombre] = useState("");
  const [mensaje, setMensaje] = useState("");
  const [publicaciones, setPublicaciones] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  
  // Guardamos en la memoria del navegador a qué mensajes les dio "Me gusta" ESTA persona
  const [misLikes, setMisLikes] = useState<number[]>([]);

  // TU URL DE GOOGLE APPS SCRIPT
  const urlBase = "https://script.google.com/macros/s/AKfycbzMp3gaWWHyFkcsSeBQxpNCqTzXomL6Yj3EIxAy2nxZs2aNfB0pViQx_VuUVcFpJ5dZ9g/exec";

  // 1. CARGAR LOS MENSAJES AL ENTRAR A LA PÁGINA
  useEffect(() => {
    const obtenerMensajes = async () => {
      try {
        const respuesta = await fetch(urlBase);
        const datos = await respuesta.json();
        setPublicaciones(datos);
      } catch (error) {
        console.error("Error al cargar la comunidad:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerMensajes();

    // Recuperamos los likes que esta persona ya había dado antes
    const likesGuardados = localStorage.getItem("misLikesComunidad");
    if (likesGuardados) {
      setMisLikes(JSON.parse(likesGuardados));
    }
  }, []);

  // 2. FUNCIÓN PARA PUBLICAR UN MENSAJE EN GOOGLE SHEETS
  const publicarMensaje = async () => {
    if (!nombre.trim() || !mensaje.trim()) return;
    
    const fechaActual = new Date().toLocaleDateString("es-ES");
    const idTemporal = Date.now(); // ID provisional mientras sube a la base de datos

    // A. Mostrar el mensaje inmediatamente en la pantalla (para que sea rápido)
    const nuevaPublicacion = { id: idTemporal, nombre, texto: mensaje, fecha: fechaActual, likes: 0 };
    setPublicaciones([nuevaPublicacion, ...publicaciones]);
    
    // B. Limpiar el formulario
    const nombreGuardado = nombre; // Guardamos por si hay error
    const mensajeGuardado = mensaje;
    setNombre("");
    setMensaje("");

    // C. Enviar los datos reales a Google Sheets en segundo plano
    try {
      const parametros = new URLSearchParams({
        accion: "publicar",
        nombre: nombreGuardado,
        texto: mensajeGuardado,
        fecha: fechaActual
      });
      
      await fetch(`${urlBase}?${parametros.toString()}`, { method: "GET" });
    } catch (error) {
      console.error("Error al guardar el mensaje", error);
    }
  };

  // 3. FUNCIÓN PARA DAR (O QUITAR) "ME GUSTA"
  const darLike = async (id: number) => {
    const yaDioLike = misLikes.includes(id);
    const operacion = yaDioLike ? "restar" : "sumar";

    // A. Actualizamos la memoria de la persona (localStorage)
    let nuevosMisLikes;
    if (yaDioLike) {
      nuevosMisLikes = misLikes.filter(likeId => likeId !== id); // Quita el like
    } else {
      nuevosMisLikes = [...misLikes, id]; // Agrega el like
    }
    setMisLikes(nuevosMisLikes);
    localStorage.setItem("misLikesComunidad", JSON.stringify(nuevosMisLikes));

    // B. Actualizamos el número visualmente en la pantalla
    setPublicaciones(publicaciones.map(pub => {
      if (pub.id === id) {
        return { ...pub, likes: pub.likes + (yaDioLike ? -1 : 1) };
      }
      return pub;
    }));

    // C. Le avisamos a Google Sheets para que sume o reste el número oficial
    try {
      const parametros = new URLSearchParams({
        accion: "like",
        id: id.toString(),
        operacion: operacion
      });
      
      await fetch(`${urlBase}?${parametros.toString()}`, { method: "GET" });
    } catch (error) {
      console.error("Error al registrar el like", error);
    }
  };

  return (
    <main className="min-h-screen p-6 pt-24 z-10 relative max-w-4xl mx-auto">
      
      {/* TÍTULO DE LA SECCIÓN */}
      <div className="text-center mb-10">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 drop-shadow-md">
          Nuestra Comunidad 💛
        </h1>
        <p className="text-blue-800 mt-2 font-medium text-lg">
          Comparte tu experiencia, ideas o sugerencias con otras mamás.
        </p>
      </div>

      {/* CAJA PARA ESCRIBIR UN MENSAJE */}
      <div className="bg-white/90 backdrop-blur-md p-6 rounded-3xl shadow-xl border border-white mb-10">
        <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
          ✍️ ¡Deja tu mensaje!
        </h2>
        <div className="flex flex-col gap-4">
          <input 
            type="text" 
            placeholder="Tu nombre (Ej. María)" 
            value={nombre} 
            onChange={(e) => setNombre(e.target.value)} 
            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-gray-700 bg-white/50"
          />
          <textarea 
            placeholder="¿Qué tal tu experiencia? Comparte una idea o sugerencia..." 
            value={mensaje} 
            onChange={(e) => setMensaje(e.target.value)} 
            rows={4} 
            className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-400 focus:ring-1 focus:ring-pink-400 text-gray-700 resize-none bg-white/50"
          ></textarea>
          <button 
            onClick={publicarMensaje} 
            className="bg-pink-400 hover:bg-pink-500 text-white font-extrabold py-4 px-8 rounded-full self-end shadow-md transition-transform transform hover:-translate-y-1"
          >
            Publicar en la comunidad 🚀
          </button>
        </div>
      </div>

      {/* MURO DE MENSAJES */}
      <div className="space-y-6">
        {cargando ? (
           <div className="text-center p-10">
             <div className="animate-spin text-5xl mb-4 inline-block">🚀</div>
             <h2 className="text-2xl font-bold text-blue-900">Cargando mensajes...</h2>
           </div>
        ) : publicaciones.length === 0 ? (
          <div className="text-center p-10 bg-white/50 backdrop-blur-sm rounded-3xl border border-white">
            <p className="text-5xl mb-4">🌟</p>
            <h3 className="text-xl font-bold text-blue-900">Aún no hay mensajes</h3>
            <p className="text-blue-800">¡Sé la primera en compartir tu experiencia!</p>
          </div>
        ) : (
          publicaciones.map((pub) => {
            const leDiLike = misLikes.includes(pub.id);
            return (
              <div key={pub.id} className="bg-white/80 backdrop-blur-sm p-6 rounded-3xl shadow-md border border-white hover:shadow-lg transition-shadow">
                
                {/* Info del usuario y fecha */}
                <div className="flex justify-between items-start mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-tr from-pink-300 to-blue-300 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-inner">
                      {pub.nombre.charAt(0).toUpperCase()}
                    </div>
                    <div>
                      <h3 className="font-bold text-gray-800 text-lg leading-none">{pub.nombre}</h3>
                      <span className="text-xs text-gray-400">{pub.fecha}</span>
                    </div>
                  </div>
                </div>

                {/* Texto del mensaje */}
                <p className="text-gray-700 mb-4 whitespace-pre-line">{pub.texto}</p>

                {/* Botón de Me Gusta */}
                <div className="flex justify-start border-t border-gray-100 pt-4">
                  <button 
                    onClick={() => darLike(pub.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-full font-bold transition-colors ${
                      leDiLike 
                        ? 'bg-pink-100 text-pink-600' 
                        : 'bg-gray-50 text-gray-500 hover:bg-gray-100 hover:text-gray-700'
                    }`}
                  >
                    {leDiLike ? '❤️' : '🤍'} 
                    <span>{pub.likes} {pub.likes === 1 ? 'Me gusta' : 'Me gusta'}</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </main>
  );
}