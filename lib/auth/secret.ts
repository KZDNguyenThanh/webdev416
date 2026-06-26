export function getAuthSecret() {
  return (
    process.env.AUTH_SECRET ||
    process.env.AUTH_JWT_SECRET ||
    process.env.NEXTAUTH_SECRET ||
    process.env.NEXTAUTH_JWT_SECRET
  );
}
