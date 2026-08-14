import type { Metadata } from "next";
import "./globals.css";
import { AdminSidebar } from "@/components/admin-sidebar";

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
        <AdminSidebar />

        <main className="ml-64 min-h-screen bg-gray-50 p-8">
          {children}
        </main>
      </body>
    </html>
  );
}