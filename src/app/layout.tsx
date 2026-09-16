import type { Metadata } from "next";
import type { ReactNode } from "react";
import "./globals.css";

export const metadata: Metadata = {
  title: "Hotelbewertung",
  description: "Bewertung von Pauschalreisen und Hotelaufenthalten",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="de">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased">
        <div className="mx-auto max-w-xl px-4 py-8">{children}</div>
      </body>
    </html>
  );
}
