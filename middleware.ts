import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl;

        if (
          pathname.startsWith("/api/auth") ||
          pathname === "/sign-in" ||
          pathname === "/sign-up"
        ) {
          return true;
        }

        if (pathname.startsWith("/api/user/check-username")) {
          return true;
        }

        if (
          pathname === "/" ||
          pathname === "/sign-in" ||
          pathname === "/sign-up" ||
          pathname === "/verify"
        ) {
          return true;
        }

        return !!token;
      },
    },
  },
);

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|public/).*)"],
};
