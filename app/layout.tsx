import type { Metadata } from "next";
import "./globals.css";
import { AdminNav } from "@/components/admin-nav";

export const metadata: Metadata = {
  title: "ClubStyle Back Office",
  description: "ClubStyle India Operations Platform",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <AdminNav />

        <main className="min-h-screen bg-gray-50 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}