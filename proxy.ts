import { NextRequest, NextResponse } from 'next/server'
import { cookies } from 'next/headers'
 
// 1. Specify protected and public routes

const publicRoutes = ['/login',  '/']
 
export default async function proxy(req: NextRequest) {
  // 2. Check if the current route is protected or public
  const path = req.nextUrl.pathname
  const isPublicRoute = publicRoutes.includes(path)
    if(isPublicRoute){
         return NextResponse.next()
    }
  // 3. Decrypt the session from the cookie
  const cookie = (await cookies()).get('session')?.value
 if(!cookie){
        return NextResponse.redirect(new URL('/login', req.nextUrl))
 }
  const user= JSON.parse(cookie);
 
  // 4. Redirect to /login if the user is not authenticated
  if (!user?.id) {
    return NextResponse.redirect(new URL('/login', req.nextUrl))
  }

  return NextResponse.next()
}
 
// Routes Proxy should not run on
export const config = {
  matcher: [
    // Esclude API routes, asset statici di Next.js, cartella public e immagini (.png, .jpg, .svg)
    '/((?!api|_next/static|_next/image|public|.*\\.(?:png|jpg|svg)$).*)',
  ],
}