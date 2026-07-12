import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Menu from "./Menu"; // <--- ESTA LÍNEA ES NUEVA

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Mundo Digital Infantil",
  description: "Plataforma educativa para niños",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es">
      <body className={`${inter.className} bg-blue-100 min-h-screen relative`}>
        <Menu /> {/* <--- ESTA LÍNEA ES NUEVA */}
        {children}
      </body>
    </html>
  );
}