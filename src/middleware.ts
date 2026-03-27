import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

export async function middleware(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!url || !key) {
    return response // Skip auth if variables are missing during initial build
  }

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() { return request.cookies.getAll() },
      setAll(cookiesToSet) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value))
        // ... handled internally by ssr
      },
    },
  })

  const { data: { user } } = await supabase.auth.getUser()

  // Protect Admin Route: Only allow access if user is logged in AND has the admin email
  const adminEmail = process.env.ADMIN_EMAIL || 'admin@gaming-charity.com'

  if (request.nextUrl.pathname.startsWith('/admin')) {
    if (!user || user.email !== adminEmail) {
      return NextResponse.redirect(new URL('/login', request.url))
    }
  }

  // Protect Dashboard Route: Only allow if user is logged in
  if (!user && request.nextUrl.pathname.startsWith('/dashboard')) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return response
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)'],
}
