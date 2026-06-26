export default function AdminRouteGroupLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return <div className="min-h-screen bg-[#f8fafc]">{children}</div>;
}
