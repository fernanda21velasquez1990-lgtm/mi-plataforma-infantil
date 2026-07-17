import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json({
    ok: true,
    mensaje: "Sistema de diamantes funcionando",
    diamantes: 100,
  });
}