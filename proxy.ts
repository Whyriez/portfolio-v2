import { type NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";

export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  });

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll();
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) =>
            request.cookies.set(name, value)
          );
          response = NextResponse.next({
            request,
          });
          cookiesToSet.forEach(({ name, value, options }) =>
            response.cookies.set(name, value, options)
          );
        },
      },
    }
  );

  // Cek session user
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Definisikan path
  const url = request.nextUrl.clone();
  const isAdminPage = url.pathname.startsWith("/admin");
  const isLoginPage = url.pathname === "/admin/login";

  // LOGIC STRICT:
  
  // 1. Jika user SUDAH login tapi buka halaman login, lempar ke dashboard
  if (isLoginPage && user) {
    url.pathname = "/admin";
    return NextResponse.redirect(url);
  }

  // 2. Jika user BELUM login tapi coba akses halaman admin (selain login page), tendang ke login
  if (isAdminPage && !isLoginPage && !user) {
    url.pathname = "/admin/login";
    return NextResponse.redirect(url);
  }

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (images, svg, etc)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)",
  ],
};