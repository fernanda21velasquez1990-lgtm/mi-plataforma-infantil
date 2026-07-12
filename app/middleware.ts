import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  // Solo protegemos la ruta /biblioteca
  if (request.nextUrl.pathname.startsWith('/biblioteca')) {
    const tieneAcceso = request.cookies.get('accesoVIP');
    
    // Si no tiene la "llave" (cookie), lo mandamos al acceso
    if (!tieneAcceso) {
      return NextResponse.redirect(new URL('/acceso', request.url));
    }
  }
  return NextResponse.next();
}