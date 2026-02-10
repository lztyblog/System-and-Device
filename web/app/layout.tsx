// web/app/layout.tsx
import "./globals.css";

export const metadata = {
  title: "System & Device",
  description: "Next.js + API (动态网站)",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>{children}</body>
    </html>
  );
}
