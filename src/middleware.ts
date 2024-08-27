import { getToken } from 'next-auth/jwt'
import {NextRequest, NextResponse } from 'next/server'
export {default} from 'next-auth/middleware'
export {getToken} from 'next-auth/jwt'

// This function can be marked `async` if using `await` inside
export async function middleware(request: NextRequest) {
    const token = await getToken({req:request})
    const url = request.nextUrl
    console.log(token);
    if(!token){
        return NextResponse.redirect(new URL('/sign-in', request.url))
    }
  return NextResponse.redirect(new URL('/dashboard', request.url))
}
 
// See "Matching Paths" below to learn more
export const config = {
  matcher: [
    // '/dashboard',
    // '/verify/:path*'
],
}