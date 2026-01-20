import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const authCookie = request.cookies.get("auth");
  const isLoginPage = request.nextUrl.pathname === "/login";

  // Se não está logado e não está na página de login, redireciona para login
  if (!authCookie && !isLoginPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Se está logado e tenta acessar a página de login, redireciona para dashboard
  if (authCookie && isLoginPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};

