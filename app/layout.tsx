import type { Metadata } from "next";
import {
  Geist,
  Geist_Mono,
  Archivo_Black,
  Teko,
  Inter,
} from "next/font/google";
import "./globals.css";

export const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

export const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Minilagmerch",
  description: "Minilagmerch store, anime merchs",
  icons: {
    icon: "/icon.png",
  },
};

const heading = Archivo_Black({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-heading",
});
const accent = Teko({
  weight: ["400", "700"],
  subsets: ["latin"],
  variable: "--font-accent",
});
const body = Inter({ subsets: ["latin"], variable: "--font-body" });

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${heading.variable} ${accent.variable} ${body.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
