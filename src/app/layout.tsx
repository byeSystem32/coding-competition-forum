import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "CSN 2026 Coding Challenge",
  description: "Register your team for the CSN 2026 Coding Challenge",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-black text-white antialiased">{children}</body>
    </html>
  );
}
