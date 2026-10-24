import type { Metadata } from "next";
import "./globals.css";

const serifFont = { variable: "--font-serif" };
const sansFont = { variable: "--font-sans" };
const geistMono = { variable: "--font-geist-mono" };

export const metadata: Metadata = {
  title: "AURELIA — Where Luxury Meets Experience",
  description: "A next-generation luxury mall digital experience combining haute retail, fine dining, interactive 3D navigation, smart parking, and AI concierge services.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html
      lang="en"
      className={`${serifFont.variable} ${sansFont.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col font-sans bg-[#08080a] text-[#fbf8f3]">
        {children}
      </body>
    </html>
  );
}

