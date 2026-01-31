import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "MEKA Command Center",
  description: "Personal task and project management dashboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
