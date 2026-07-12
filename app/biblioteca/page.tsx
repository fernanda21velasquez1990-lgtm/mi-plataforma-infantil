"use client";
import { useState, useEffect } from "react";

// 1. TODAS LAS CATEGORÍAS
const categorias = [
  { id: "Todos", nombre: "Todos", emoji: "🌌", color: "bg-blue-100 text-blue-800 border-blue-300" },
  { id: "Juegos", nombre: "Juegos", emoji: "🎮", color: "bg-red-100 text-red-800 border-red-300" },
  { id: "Grafismo", nombre: "Grafismo", emoji: "✏️", color: "bg-green-100 text-green-800 border-green-300" },
  { id: "Fonetico", nombre: "Fonético", emoji: "🗣️", color: "bg-yellow-100 text-yellow-800 border-yellow-300" },
  { id: "Alfabeto", nombre: "Alfabeto y lenguaje", emoji: "🔤", color: "bg-purple-100 text-purple-800 border-purple-300" },
  { id: "TDAH", nombre: "TDAH", emoji: "🧠", color: "bg-pink-100 text-pink-800 border-pink-300" },
  { id: "Caligrafias", nombre: "Caligrafías", emoji: "✍️", color: "bg-indigo-100 text-indigo-800 border-indigo-300" },
  { id: "Cuentos", nombre: "Cuentos", emoji: "📖", color: "bg-teal-100 text-teal-800 border-teal-300" },
  { id: "Guias", nombre: "Guías para padres", emoji: "👨‍👩‍👧‍👦", color: "bg-orange-100 text-orange-800 border-orange-300" },
  { id: "BonoMaestro", nombre: "Bono Maestro", emoji: "🍎", color: "bg-lime-100 text-lime-800 border-lime-300" },
  { id: "BonoRegalo", nombre: "Bono de regalo", emoji: "🎁", color: "bg-rose-100 text-rose-800 border-rose-300" },
  { id: "Tesoro", nombre: "Tesoro bíblico", emoji: "🕊️", color: "bg-cyan-100 text-cyan-800 border-cyan-300" },
  { id: "Lettering", nombre: "Lettering", emoji: "🖋️", color: "bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300" },
  { id: "MiniPack", nombre: "Mini pack adolescentes", emoji: "📱", color: "bg-emerald-100 text-emerald-800 border-emerald-300" },
  { id: "Preescritura", nombre: "Cuadernos preescritura", emoji: "📓", color: "bg-amber-100 text-amber-800 border-amber-300" },
  { id: "Pictogramas", nombre: "Pictogramas", emoji: "🖼️", color: "bg-violet-100 text-violet-800 border-violet-300" },
  { id: "Matematicas", nombre: "Matemáticas", emoji: "🔢", color: "bg-sky-100 text-sky-800 border-sky-300" },
  { id: "Montessori", nombre: "Método Montessori", emoji: "🧩", color: "bg-orange-200 text-orange-900 border-orange-400" },
  { id: "Motricidad", nombre: "Motricidad fina", emoji: "🖐️", color: "bg-pink-200 text-pink-900 border-pink-400" },
  { id: "Terapia", nombre: "Terapia de lenguaje", emoji: "👅", color: "bg-blue-200 text-blue-900 border-blue-400" },
];

export default function Biblioteca() {
  // Estados para búsqueda y filtrado
  const [busqueda, setBusqueda] = useState("");
  const [categoriaActiva, setCategoriaActiva] = useState("Todos");
  
  // ESTADOS DE LA BASE DE DATOS (Google Sheets)
  const [materiales, setMateriales] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);

  // Estados para la ventana emergente y sistema social
  const [materialActivo, setMaterialActivo] = useState<any>(null);
  const [nombre, setNombre] = useState("");
  const [nuevoComentario, setNuevoComentario] = useState("");
  const [comentarios, setComentarios] = useState<any>({});
  const [likes, setLikes] = useState<any>({});

  // CONEXIÓN CON TU GOOGLE SHEET
  useEffect(() => {
    const obtenerMateriales = async () => {
      try {
        // 👇👇 PEGA AQUÍ LA URL NUEVA QUE TE FUNCIONÓ EN EL NAVEGADOR 👇👇
        const url = "https://script.google.com/macros/s/AKfycbxGShnNgOoBGB7hxUOUYWv3stdet9rSsDxLaSc04DcM3fIkNMSfLGdJbADzJ4TaaxiUsQ/exec";
        
        const respuesta = await fetch(url);
        const datos = await respuesta.json();
        setMateriales(datos);
      } catch (error) {
        console.error("Error al cargar los datos:", error);
      } finally {
        setCargando(false);
      }
    };

    obtenerMateriales();

    // Cargar likes y comentarios guardados
    const datosGuardados = localStorage.getItem("comentariosMDI");
    const likesGuardados = localStorage.getItem("likesMDI");
    if (datosGuardados) setComentarios(JSON.parse(datosGuardados));
    if (likesGuardados) setLikes(JSON.parse(likesGuardados));
  }, []);

  const publicarComentario = () => {
    if (!nombre.trim() || !nuevoComentario.trim()) return;
    const fechaActual = new Date().toLocaleDateString("es-ES");
    const comentarioArmado = { nombre, texto: nuevoComentario, fecha: fechaActual };
    const nuevosComentarios = {
      ...comentarios,
      [materialActivo.id]: [...(comentarios[materialActivo.id] || []), comentarioArmado]
    };
    setComentarios(nuevosComentarios);
    localStorage.setItem("comentariosMDI", JSON.stringify(nuevosComentarios));
    setNombre("");
    setNuevoComentario("");
  };

  const darLike = () => {
    const nuevosLikes = { ...likes, [materialActivo.id]: true };
    setLikes(nuevosLikes);
    localStorage.setItem("likesMDI", JSON.stringify(nuevosLikes));
  };

  const materialesFiltrados = materiales.filter((item) => {
    const coincideBusqueda = item.titulo.toLowerCase().includes(busqueda.toLowerCase());
    const coincideCategoria = categoriaActiva === "Todos" || item.categoria === categoriaActiva;
    return coincideBusqueda && coincideCategoria;
  });

  return (
    <main className="min-h-screen p-6 pt-24 z-10 relative max-w-7xl mx-auto">
      
      {/* Título */}
      <div className="text-center mb-8">
        <h1 className="text-4xl md:text-5xl font-extrabold text-blue-900 drop-shadow-md">Explorador de Materiales 🚀</h1>
      </div>

      {/* CINTILLO DE BÚSQUEDA */}
      <div className="max-w-2xl mx-auto mb-8 relative">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-2xl">🔍</div>
        <input
          type="text"
          placeholder="¿Qué estás buscando hoy?"
          value={busqueda}
          onChange={(e) => setBusqueda(e.target.value)}
          className="w-full pl-12 pr-4 py-4 rounded-full border-2 border-blue-300 shadow-lg text-lg focus:outline-none focus:border-blue-500 bg-white/90 backdrop-blur-sm"
        />
      </div>

      {/* CINTILLO DE CATEGORÍAS */}
      <div className="flex overflow-x-auto pb-4 mb-8 gap-3 no-scrollbar snap-x">
        {categorias.map((cat) => (
          <button
            key={cat.id}
            onClick={() => setCategoriaActiva(cat.id)}
            className={`snap-center flex items-center whitespace-nowrap px-5 py-3 rounded-full font-bold border-2 shadow-sm transition-all transform hover:scale-105 ${
              categoriaActiva === cat.id ? `${cat.color} ring-2 ring-offset-2 ring-blue-400` : "bg-white/80 border-white text-gray-600 hover:bg-gray-50"
            }`}
          >
            <span className="mr-2 text-xl">{cat.emoji}</span> {cat.nombre}
          </button>
        ))}
      </div>

      {/* ESTADO DE CARGA */}
      {cargando ? (
        <div className="text-center p-10 mt-10">
          <div className="animate-spin text-5xl mb-4 inline-block">🚀</div>
          <h2 className="text-2xl font-bold text-blue-900">Buscando materiales en el espacio...</h2>
        </div>
      ) : (
        /* GRILLA DE MATERIALES DESDE GOOGLE SHEETS */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {materialesFiltrados.map((item) => {
            const catInfo = categorias.find(c => c.id === item.categoria) || categorias[0]; // Categoria por defecto si hay error en escritura
            return (
              <div key={item.id} className="bg-white/70 backdrop-blur-md p-6 rounded-3xl shadow-lg hover:shadow-xl transition-shadow flex flex-col justify-between">
                <div>
                  <div className="w-full h-48 mb-4 rounded-2xl overflow-hidden bg-gray-200 relative cursor-pointer shadow-inner" onClick={() => setMaterialActivo(item)}>
                    <img src={item.imagen} alt={item.titulo} className="w-full h-full object-cover transition-transform hover:scale-110" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/400x300?text=Ver+Material" }}/>
                  </div>
                  <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold border mb-3 ${catInfo?.color}`}>
                    {catInfo?.emoji} {catInfo?.nombre}
                  </div>
                  <h3 className="text-xl font-extrabold text-blue-900 mb-2 leading-tight">{item.titulo}</h3>
                  <p className="text-gray-700 text-sm mb-6">{item.desc}</p>
                </div>
                <button onClick={() => setMaterialActivo(item)} className="w-full bg-blue-500 hover:bg-blue-600 text-white font-extrabold py-3 rounded-full shadow-md transition-transform transform hover:-translate-y-1">
                  Abrir Material 🔍
                </button>
              </div>
            );
          })}
          
          {materialesFiltrados.length === 0 && !cargando && (
            <div className="col-span-full text-center p-10 bg-white/50 rounded-3xl border border-white/60 mt-4">
               <p className="text-4xl mb-4">🛸</p>
               <h3 className="text-xl font-bold text-blue-900">Aún no hay materiales aquí</h3>
               <p className="text-blue-800">Estamos preparando nuevos recursos para esta categoría.</p>
            </div>
          )}
        </div>
      )}

      {/* VENTANA EMERGENTE (MODAL) */}
      {materialActivo && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex justify-center items-start overflow-y-auto p-4 sm:p-6">
          <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl mt-10 mb-10 overflow-hidden relative">
            
            <div className="flex justify-between items-center p-4 border-b border-gray-100">
              <h2 className="text-xl font-extrabold text-gray-800">{materialActivo.titulo}</h2>
              <button onClick={() => setMaterialActivo(null)} className="text-gray-500 hover:text-gray-800 text-3xl font-light rounded-full w-10 h-10 flex items-center justify-center bg-gray-100 hover:bg-gray-200">×</button>
            </div>

            <div className="w-full h-64 sm:h-80 bg-gray-900">
              <img src={materialActivo.imagen} alt="Material" className="w-full h-full object-contain" onError={(e) => { e.currentTarget.src = "https://via.placeholder.com/800x400?text=Vista+Previa" }}/>
            </div>

            <div className="p-6">
              <div className="grid grid-cols-2 gap-3 mb-8">
                <button onClick={() => window.open(materialActivo.imagen, '_blank')} className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-2 rounded-2xl flex items-center justify-center gap-2 shadow-sm">
                  🔍 Modo grande
                </button>
                <button onClick={() => window.print()} className="bg-gray-50 hover:bg-gray-100 text-gray-700 font-bold py-3 px-2 rounded-2xl border border-gray-200 flex items-center justify-center gap-2 shadow-sm">
                  🖨️ Imprimir
                </button>
                <a href={materialActivo.linkDrive} target="_blank" rel="noopener noreferrer" className="bg-yellow-400 hover:bg-yellow-500 text-gray-900 font-bold py-3 px-2 rounded-2xl flex items-center justify-center gap-2 shadow-sm">
                  ⬇️ Descargar
                </a>
                <button onClick={darLike} className={`${likes[materialActivo.id] ? 'bg-pink-200 text-pink-700' : 'bg-pink-100 hover:bg-pink-200 text-pink-600'} font-bold py-3 px-2 rounded-2xl flex items-center justify-center gap-2 shadow-sm transition-colors`}>
                  {likes[materialActivo.id] ? '❤️ Te encantó' : '💛 Me encanta'}
                </button>
              </div>

              <div className="border-t border-gray-100 pt-6">
                <h3 className="text-lg font-bold text-gray-800 flex items-center gap-2 mb-1">💬 Comentarios</h3>
                <p className="text-sm text-gray-500 mb-4">Comparte tu experiencia o pregunta — otras mamás lo verán 💛</p>

                <div className="flex flex-col gap-3 mb-6">
                  <input type="text" placeholder="Tu nombre" value={nombre} onChange={(e) => setNombre(e.target.value)} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300"/>
                  <textarea placeholder="Escribe tu comentario..." value={nuevoComentario} onChange={(e) => setNuevoComentario(e.target.value)} rows={3} className="w-full p-4 rounded-xl border border-gray-200 focus:outline-none focus:border-pink-300 focus:ring-1 focus:ring-pink-300 resize-none"></textarea>
                  <button onClick={publicarComentario} className="bg-pink-400 hover:bg-pink-500 text-white font-bold py-3 px-6 rounded-full self-start shadow-md">
                    Publicar comentario 💛
                  </button>
                </div>

                <div className="space-y-4">
                  {(comentarios[materialActivo.id] || []).map((com: any, index: number) => (
                    <div key={index} className="bg-orange-50/50 p-4 rounded-xl border border-orange-100">
                      <div className="flex items-baseline gap-2 mb-1">
                        <span className="font-bold text-gray-800">{com.nombre}</span>
                        <span className="text-xs text-gray-400">{com.fecha}</span>
                      </div>
                      <p className="text-gray-700">{com.texto}</p>
                    </div>
                  ))}
                  {(!comentarios[materialActivo.id] || comentarios[materialActivo.id].length === 0) && (
                    <p className="text-gray-400 italic text-sm">Sé la primera en comentar este material.</p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

    </main>
  );
}