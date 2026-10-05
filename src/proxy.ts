import { withAuth } from "next-auth/middleware";

export const proxy = withAuth({});
export default proxy;

export const config = {
  matcher: ["/dashboard/:path*", "/trades/:path*", "/analytics/:path*", "/settings/:path*"],
};
