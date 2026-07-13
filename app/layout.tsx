import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";

import "./globals.css";
import Menu from "./Menu";

const inter = Inter({
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Mundo Digital Infantil",
  description: "Plataforma educativa para niños",
};

/* =====================================================
   SCRIPT DEL CONTROL DE ACCESO

   Se ejecuta en el navegador y controla:

   - Acceso VIP.
   - Prueba gratuita.
   - Cronómetro.
   - Expulsión automática.
   - Protección de Biblioteca y Tecnología.
===================================================== */

const SCRIPT_CONTROL_PRUEBA = `
(function () {
  var RUTAS_PROTEGIDAS = [
    "/biblioteca",
    "/tecnologia"
  ];

  var ID_CONTENEDOR =
    "control-prueba-root";

  var CLAVE_INTERVALO =
    "__intervaloControlPrueba";

  function obtenerContenedor() {
    return document.getElementById(
      ID_CONTENEDOR
    );
  }

  function rutaActualProtegida() {
    var ruta =
      window.location.pathname;

    return RUTAS_PROTEGIDAS.some(
      function (rutaProtegida) {
        return (
          ruta === rutaProtegida ||
          ruta.startsWith(
            rutaProtegida + "/"
          )
        );
      }
    );
  }

  function limpiarSesionPrueba() {
    localStorage.removeItem(
      "limitePrueba"
    );

    localStorage.removeItem(
      "modoAcceso"
    );

    localStorage.removeItem(
      "telefonoAcceso"
    );

    localStorage.removeItem(
      "accesoVIP"
    );
  }

  function ocultarCintillo() {
    var contenedor =
      obtenerContenedor();

    if (!contenedor) {
      return;
    }

    contenedor.style.display =
      "none";

    contenedor.innerHTML = "";
  }

  function convertirTiempo(
    milisegundos
  ) {
    var segundosTotales =
      Math.max(
        0,
        Math.floor(
          milisegundos / 1000
        )
      );

    var horas =
      Math.floor(
        segundosTotales / 3600
      );

    var minutos =
      Math.floor(
        (segundosTotales % 3600) /
          60
      );

    var segundos =
      segundosTotales % 60;

    function dosDigitos(numero) {
      return String(numero).padStart(
        2,
        "0"
      );
    }

    return (
      dosDigitos(horas) +
      ":" +
      dosDigitos(minutos) +
      ":" +
      dosDigitos(segundos)
    );
  }

  function mostrarCintillo(
    tiempoRestante
  ) {
    var contenedor =
      obtenerContenedor();

    if (!contenedor) {
      return;
    }

    contenedor.style.display =
      "block";

    contenedor.innerHTML = \`
      <div
        style="
          position: relative;
          z-index: 9999;
          width: 100%;
          padding: 10px 16px;
          background:
            linear-gradient(
              90deg,
              #fde047,
              #fb923c,
              #f472b6
            );
          color: #0f172a;
          box-shadow:
            0 8px 25px
            rgba(15, 23, 42, 0.22);
          font-family:
            Arial,
            Helvetica,
            sans-serif;
        "
      >
        <div
          style="
            max-width: 1200px;
            margin: 0 auto;
            display: flex;
            align-items: center;
            justify-content:
              space-between;
            gap: 14px;
            flex-wrap: wrap;
          "
        >
          <div
            style="
              display: flex;
              align-items: center;
              gap: 12px;
            "
          >
            <span
              aria-hidden="true"
              style="
                display: flex;
                width: 42px;
                height: 42px;
                align-items: center;
                justify-content:
                  center;
                border-radius: 14px;
                background:
                  rgba(
                    15,
                    23,
                    42,
                    0.12
                  );
                font-size: 23px;
              "
            >
              ⏱️
            </span>

            <div>
              <strong
                style="
                  display: block;
                  font-size: 15px;
                  font-weight: 900;
                "
              >
                Estás utilizando la prueba gratuita
              </strong>

              <span
                style="
                  display: block;
                  margin-top: 2px;
                  font-size: 12px;
                  font-weight: 700;
                "
              >
                Las descargas de la biblioteca estarán bloqueadas.
              </span>
            </div>
          </div>

          <div
            style="
              display: flex;
              align-items: center;
              gap: 12px;
              flex-wrap: wrap;
            "
          >
            <div
              style="
                padding: 8px 14px;
                border-radius: 999px;
                background: #0f172a;
                color: #fde047;
                font-size: 17px;
                font-weight: 900;
                letter-spacing: 1px;
                box-shadow:
                  0 5px 15px
                  rgba(
                    15,
                    23,
                    42,
                    0.22
                  );
              "
            >
              \${convertirTiempo(
                tiempoRestante
              )}
            </div>

            <a
              href="/acceso?motivo=activar-vip"
              style="
                padding: 9px 15px;
                border-radius: 999px;
                background: #10b981;
                color: #052e2b;
                text-decoration: none;
                font-size: 12px;
                font-weight: 900;
                white-space: nowrap;
              "
            >
              💎 Activar acceso VIP
            </a>
          </div>
        </div>
      </div>
    \`;
  }

  function expulsarUsuario(
    motivo
  ) {
    limpiarSesionPrueba();
    ocultarCintillo();

    if (rutaActualProtegida()) {
      window.location.replace(
        "/acceso?motivo=" +
          encodeURIComponent(
            motivo
          )
      );
    }
  }

  function comprobarAcceso() {
    var esVIP =
      localStorage.getItem(
        "accesoVIP"
      ) === "true" ||
      localStorage.getItem(
        "modoAcceso"
      ) === "vip";

    var modoAcceso =
      localStorage.getItem(
        "modoAcceso"
      );

    var limitePrueba =
      Number(
        localStorage.getItem(
          "limitePrueba"
        ) || "0"
      );

    /*
    ACCESO VIP:
    No muestra cronómetro.
    */

    if (esVIP) {
      ocultarCintillo();
      return;
    }

    /*
    ACCESO DE PRUEBA ACTIVO.
    */

    if (
      modoAcceso === "prueba" &&
      limitePrueba > 0
    ) {
      var tiempoRestante =
        limitePrueba -
        Date.now();

      if (tiempoRestante <= 0) {
        expulsarUsuario(
          "prueba-finalizada"
        );

        return;
      }

      if (rutaActualProtegida()) {
        mostrarCintillo(
          tiempoRestante
        );
      } else {
        ocultarCintillo();
      }

      return;
    }

    /*
    SIN ACCESO:

    Si intenta entrar directamente
    a Biblioteca o Tecnología,
    se envía a la página de acceso.
    */

    ocultarCintillo();

    if (rutaActualProtegida()) {
      window.location.replace(
        "/acceso?motivo=acceso-requerido"
      );
    }
  }

  /*
  Evitar varios cronómetros
  al mismo tiempo.
  */

  if (window[CLAVE_INTERVALO]) {
    window.clearInterval(
      window[CLAVE_INTERVALO]
    );
  }

  /*
  Comprobar inmediatamente.
  */

  comprobarAcceso();

  /*
  Comprobar cada segundo.
  */

  window[CLAVE_INTERVALO] =
    window.setInterval(
      comprobarAcceso,
      1000
    );

  /*
  Detectar cambios de sesión
  realizados en otra pestaña.
  */

  window.addEventListener(
    "storage",
    comprobarAcceso
  );

  /*
  Detectar navegación hacia
  atrás o hacia adelante.
  */

  window.addEventListener(
    "popstate",
    comprobarAcceso
  );
})();
`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body
        className={`${inter.className} min-h-screen bg-blue-100`}
      >
        {/* Aquí aparecerá el cintillo de la prueba */}

        <div
          id="control-prueba-root"
          style={{
            display: "none",
            position: "sticky",
            top: 0,
            zIndex: 9999,
          }}
        />

        {/* Menú actual de la plataforma */}

        <Menu />

        {/* Contenido de cada página */}

        {children}

        {/* Control global de acceso y cronómetro */}

        <Script
          id="control-global-prueba"
          strategy="afterInteractive"
          dangerouslySetInnerHTML={{
            __html:
              SCRIPT_CONTROL_PRUEBA,
          }}
        />
      </body>
    </html>
  );
}