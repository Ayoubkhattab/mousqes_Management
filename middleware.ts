import { NextRequest, NextResponse } from "next/server";
import { TOKEN_COOKIE } from "@/lib/auth/constants";

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // ✅ لا تتدخل أبداً في مسارات API
  if (pathname.startsWith("/api")) {
    return NextResponse.next();
  }

  const isLogin = pathname === "/login";
  const hasToken = Boolean(req.cookies.get(TOKEN_COOKIE)?.value);

  // امنع الدخول لصفحة /login إن كان عنده توكن
  if (isLogin && hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/dashboard";
    return NextResponse.redirect(url);
  }

  // احمِ مسارات الداشبورد فقط
  if (pathname.startsWith("/dashboard") && !hasToken) {
    const url = req.nextUrl.clone();
    url.pathname = "/login";
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  // 🔒 طبّق الميدلوير على كل شيء *عدا* ملفات Next الثابتة
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
