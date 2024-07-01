import { authMiddleware } from "@clerk/nextjs/server";

export default authMiddleware({
  publicRoutes: ['/', '/api', '/trpc'], // Specify public routes that should not require authentication
});

export const config = {
  matcher: [
    '/((?!.*\\..*|_next).*)', // Match all routes except those with dots (likely for assets) and Next.js specific paths
    '/', // Match the root path
    '/api(.*)', // Match all paths under /api
    '/trpc(.*)', // Match all paths under /trpc
  ],
};
